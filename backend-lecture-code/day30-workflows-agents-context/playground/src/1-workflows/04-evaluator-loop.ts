import Anthropic from "@anthropic-ai/sdk";
import { DANA, lookUpOrder, searchPolicy } from "../lib/support";
import { bold, cyan, dim, green, red, title, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: the evaluator-optimizer loop
// ════════════════════════════════════════════════════════════════════════════════════════════════

const MAX_ROUNDS = 3; // the first draft + at most 2 rewrites
// The rubric is the whole point: "good" written down so a second call can check it
const RUBRIC = [
  "1. Names firmware 2.4.1 as the fix for the Bluetooth drops, and says how to update.",
  "2. Does NOT promise a full refund: the order was delivered 10 days ago, past the 7-day window for defective items.",
  "3. Offers the real options: return within 14 days with the 12% restocking fee, or a warranty repair or replacement.",
].join("\n");
const MAX_WORDS = 100; // rule 4 is plain code: never ask a model to count words

async function runEvaluatorLoop() {
  title("Customer email");
  console.log(cyan(DANA));

  let draft = "";
  let feedback = "";
  for (let round = 1; round <= MAX_ROUNDS; round++) {
    // 1. the writer drafts, or rewrites using the evaluator's feedback. It never sees the rubric
    draft = await writeDraft(draft, feedback);
    title(`Round ${round}: draft`);
    console.log(draft);

    // 2. the evaluator checks the draft against the rubric (plus a word limit checked in code)
    const verdict = await evaluateDraft(draft);

    // 3. pass → stop. Fail → the feedback goes into the next round. Our code owns the loop and the cap
    if (verdict.pass) {
      console.log(green(`\n  evaluator: PASS in round ${round}`));
      break;
    }
    feedback = verdict.feedback.trim();
    console.log(red(`\n  evaluator: FAIL (rubric ${verdict.failed.join(", ")})`), yellow(feedback));
    if (round === MAX_ROUNDS) console.log(red(bold(`  round cap reached: hand the draft to a person instead of looping forever`)));
  }

  console.log(bold("\nWhat to notice"));
  console.log("  The writer never saw the rubric. The evaluator did, and its feedback is the only thing that changed between rounds.");
  console.log(dim(`  Our code owns the loop and the cap (${MAX_ROUNDS} rounds), exactly like the steps of a chain.`));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

const FACTS = `Order A1042: ${JSON.stringify(lookUpOrder("A1042"))}\nPolicies:\n${searchPolicy("refund warranty firmware")}`;
const text = (r: Anthropic.Message) => r.content.find((b) => b.type === "text")?.text ?? "";
// The first {...} in the reply: models sometimes add a sentence before or after the JSON
const json = (s: string) => JSON.parse(s.match(/\{[^{}]*\}/)?.[0] ?? "{}");

// The writer: a friendly prompt that has the facts but not the rubric
async function writeDraft(lastDraft: string, feedback: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" }, // no hidden reasoning: cheaper, and token counts stay comparable
    max_tokens: 400,
    system: `You are a friendly Lumen Audio support agent. Keep the customer happy. Plain text. Facts:\n${FACTS}`,
    messages: [
      {
        role: "user",
        content: feedback ? `Email: ${DANA}\n\nYour last draft:\n${lastDraft}\n\nA reviewer rejected it:\n${feedback}\n\nWrite a better reply.` : DANA,
      },
    ],
  });
  return text(response);
}

// The evaluator: sees the rubric and the facts, and answers in a shape our code can read
async function evaluateDraft(draft: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 300,
    system:
      `You check support replies against a rubric. Facts:\n${FACTS}\n\nRubric:\n${RUBRIC}\n\n` +
      'Reply with JSON only: {"pass": true or false, "failed": [<rubric numbers that failed>], "feedback": "<what to fix, one sentence>"}',
    messages: [{ role: "user", content: draft }],
  });
  const verdict: { pass: boolean; failed: number[]; feedback: string } = { pass: false, failed: [], feedback: "", ...json(text(response)) };
  const words = draft.split(/\s+/).length;
  if (words > MAX_WORDS) {
    verdict.pass = false;
    verdict.failed.push(4);
    verdict.feedback += ` Cut it to under ${MAX_WORDS} words (it has ${words}).`;
  }
  return verdict;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runEvaluatorLoop();
