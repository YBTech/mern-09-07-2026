import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { loadChunks, type Chunk } from "./lib/chunks";
import { keywordSearch } from "./lib/keyword-search";
import { cyan, dim, green, title, yellow } from "./lib/log";
import { buildVectorStore, vectorSearch } from "./lib/vector-search";

const chunks = loadChunks();
const vectorStore = await buildVectorStore(chunks);

// Run both searches, then merge the two ranked lists
// Reciprocal rank fusion: rank 1 is worth 1/61, rank 2 is 1/62, … and a chunk found by both adds up
async function hybridSearch(question: string): Promise<Chunk[]> {
  const byKeyword = keywordSearch(chunks, question).slice(0, 10);
  const byMeaning = (await vectorSearch(vectorStore, question)).slice(0, 10);

  const scores = new Map<Chunk, number>();
  for (const list of [byKeyword, byMeaning]) {
    list.forEach((chunk, rank) => {
      scores.set(chunk, (scores.get(chunk) ?? 0) + 1 / (60 + rank + 1));
    });
  }

  console.log(dim(`      keyword: ${byKeyword.slice(0, 3).map((c) => c.heading).join(" | ") || "nothing"}`));
  console.log(dim(`      vector:  ${byMeaning.slice(0, 3).map((c) => c.heading).join(" | ")}`));

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([chunk]) => chunk);
}

// The two questions that broke keyword search (different words) and vector search (an exact ID)
// Hybrid keeps the best 5: each search can bring a few wrong chunks, so leave room for the right ones
const DIFFERENT_WORDS = "my earbuds came brokn, can i get my money back?";
const EXACT_ID = "What is INC-2026-Q3-011?";

const client = new Anthropic();

// Search, put the chunks in the prompt, and let Claude answer
async function ask(question: string) {
  const found = await hybridSearch(question);
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

title("Hybrid search + Claude (type exit to quit)");

// Run the test questions first, then keep chatting
console.log(cyan("\nyou > ") + DIFFERENT_WORDS);
await ask(DIFFERENT_WORDS);
console.log(cyan("\nyou > ") + EXACT_ID);
await ask(EXACT_ID);

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });

while (true) {
  const question = await terminal.question(cyan("\nyou > "));
  if (question === "exit") break;
  await ask(question);
}

terminal.close();
