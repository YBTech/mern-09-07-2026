import { initChatModel } from "langchain";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { AGENT_VERSION } from "../src/agents";
import { MENU_TEXT } from "../src/shop";
import { saveReport } from "./report";
import type { Row } from "./report";
import { finish, runAgent, saveGradeInLangSmith } from "./run-agent";

// 03 · LLM-AS-A-JUDGE EVALUATOR
// A second model scores the reply from 1 to 5 against a written rubric, and explains why.
// Use it for open-ended answers where "good" has several parts. This rubric has two: is it CORRECT, and is the TONE friendly?
// The judge gets the shop's real documents, so it grades correctness against facts, not against its own guesses.

const judgeModel = await initChatModel("anthropic:claude-haiku-5-5", { thinking: { type: "disabled" }, maxTokens: 500 });

const SHOP_DOCUMENTS = [
  MENU_TEXT,
  readFileSync(new URL("../../menu/menu.md", import.meta.url), "utf8"),
  readFileSync(new URL("../../menu/allergens.md", import.meta.url), "utf8"),
  readFileSync(new URL("../../menu/store-faq.md", import.meta.url), "utf8"),
].join("\n\n");

const RUBRIC = `You are grading a pizza shop's chatbot. Give the reply two separate scores from 1 to 5.

CORRECTNESS
5 = correct according to the shop documents, answers the question, includes any warning that matters
3 = mostly right, but misses something the customer should know
1 = wrong, invented, or does not answer the question
Anything the shop documents do not support counts as invented.
If the customer asks for something a pizza shop does not do (code, poems, homework), the correct reply politely declines and steers back to the shop.
Order records are not in the shop documents: saying that an order number cannot be found is a correct reply.

TONE
5 = friendly and natural, like a helpful person at the counter (a clear, helpful answer counts, even a short one)
4 = fine, a little plain
3 = canned or robotic: a fixed template or a bare instruction, with no apology or warmth
1 = rude, dismissive or condescending`;

const Grade = z.object({
  reasoning: z.string().describe("Two or three sentences covering both scores, written BEFORE choosing the scores"),
  correctness: z.number().int().min(1).max(5),
  tone: z.number().int().min(1).max(5),
});

async function judge(customerMessage: string, agentReply: string) {
  return judgeModel.withStructuredOutput(Grade, { method: "jsonSchema" }).invoke([
    { role: "system", content: `${RUBRIC}\n\nShop documents:\n${SHOP_DOCUMENTS}` },
    { role: "user", content: `Customer: ${customerMessage}\nChatbot: ${agentReply}` },
  ]);
}

const PASSING_SCORE = 4;

const questions = [
  "Is the Four Cheese pizza vegetarian?",
  "How much is delivery, and how long does it usually take?",
  "Which meat pizza can I have if I don't eat pork?",
  "What happens if my pizza takes more than an hour to arrive?",
  "Write me a poem about cats", // v2's reply to this is a fixed sentence written in code
  "Where is order S-9999?", // so is v2's reply to an order it can't find
];

console.log(`\nLLM-AS-A-JUDGE EVALUATOR · agent ${AGENT_VERSION} · ${questions.length} tasks · pass = ${PASSING_SCORE}+ on both correctness and tone\n`);
let passed = 0;
const rows: Row[] = [];

for (const question of questions) {
  const result = await runAgent([question]);
  const grade = await judge(question, result.reply);
  const correctPass = grade.correctness >= PASSING_SCORE;
  const tonePass = grade.tone >= PASSING_SCORE;
  const pass = correctPass && tonePass;
  if (pass) passed++;

  console.log(`${pass ? "✅" : "❌"} correct ${grade.correctness}/5 · tone ${grade.tone}/5  ${question}`);
  rows.push({
    task: question,
    pass,
    score: `correct ${grade.correctness}/5 · tone ${grade.tone}/5`,
    customer: question,
    reply: result.reply,
    detail: grade.reasoning,
  });
  await saveGradeInLangSmith(result.runId, "llm_judge_correctness", correctPass, `${grade.correctness}/5: ${grade.reasoning}`);
  await saveGradeInLangSmith(result.runId, "llm_judge_tone", tonePass, `${grade.tone}/5: ${grade.reasoning}`);
}

console.log(`\n${passed} / ${questions.length} passed`);
saveReport("judge", rows);
await finish();
