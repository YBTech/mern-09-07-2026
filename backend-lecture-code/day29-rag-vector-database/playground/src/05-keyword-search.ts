import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { loadChunks, type Chunk } from "./lib/chunks";
import { cyan, dim, green, title, yellow } from "./lib/log";

const chunks = loadChunks();

// Words too common to mean anything
const STOP_WORDS = ["the", "and", "can", "for", "with", "what", "does", "how", "are", "you", "your", "get", "this", "that", "have", "will"];

function toWords(text: string) {
  const words = text.toLowerCase().match(/[a-z0-9]+(-[a-z0-9]+)*/g) ?? [];
  return words.filter((word) => word.length > 2 && !STOP_WORDS.includes(word));
}

// Score each chunk by how many of the question's words it contains, keep the best 3
function keywordSearch(question: string): Chunk[] {
  const questionWords = toWords(question);
  const scored = chunks.map((chunk) => {
    const chunkWords = toWords(`${chunk.heading} ${chunk.text}`);
    const score = questionWords.filter((word) => chunkWords.includes(word)).length;
    return { chunk, score };
  });
  return scored
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((result) => result.chunk);
}

// A question keyword search cannot answer: the words differ from the policy ("money back" vs "refund"), plus a typo
const TEST_QUESTION = "my earbuds came brokn, can i get my hard earned bucks back?";

const client = new Anthropic();

// Search, put the chunks in the prompt, and let Claude answer
async function ask(question: string) {
  const found = keywordSearch(question);
  for (const chunk of found) console.log(yellow(`      found: ${chunk.source} › ${chunk.heading}`));
  if (found.length === 0) console.log(yellow("      found: nothing"));

  const context = found.map((c) => `[${c.source} › ${c.heading}]\n${c.text}`).join("\n\n");

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: `You are the support assistant for Lumen Audio. Answer only from the context below. If the answer is not there, say you don't know. Be brief, plain text, no markdown.\n\nContext:\n${context}`,
    messages: [{ role: "user", content: question }],
  });

  console.log(green(`bot > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
}

title("Keyword search + Claude (type exit to quit)");

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });

while (true) {
  const question = await terminal.question(cyan("\nyou > "));
  if (question === "exit") break;
  await ask(question);
}

terminal.close();
