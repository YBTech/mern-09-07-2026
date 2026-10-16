import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { loadChunks, type Chunk } from "./lib/chunks";
import { cosine, embed } from "./lib/embed";
import { cyan, dim, green, title, yellow } from "./lib/log";

// Ingestion, step 2: embed every chunk once and keep it next to its vector
// This array is our vector store. A vector database does the same thing, at scale
const chunks = loadChunks();
const vectors = await embed(chunks.map((c) => `${c.heading}\n${c.text}`));
const vectorStore = chunks.map((chunk, i) => ({ chunk, vector: vectors[i] }));
console.log(dim(`Embedded ${vectorStore.length} chunks, ${vectors[0].length} numbers each`));


// Embed the question the same way, then keep the 3 closest chunks
async function vectorSearch(question: string): Promise<Chunk[]> {
  const [questionVector] = await embed([question]);
  
  return vectorStore
    .map((entry) => ({ chunk: entry.chunk, score: cosine(questionVector, entry.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((result) => result.chunk);
} 

// A question vector search cannot answer: an exact ID that sits inside long sections about other topics
// An ID has no meaning, so vector search returns whatever is nearest instead of the three sections that mention it
const TEST_QUESTION = "What is INC-2026-Q3-011?";

const client = new Anthropic();

// Search, put the chunks in the prompt, and let Claude answer
async function ask(question: string) {
  const found = await vectorSearch(question);
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

title("Vector search + Claude (type exit to quit)");

// Run the test question first, then keep chatting
console.log(cyan("\nyou > ") + TEST_QUESTION);
await ask(TEST_QUESTION);

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });

while (true) {
  const question = await terminal.question(cyan("\nyou > "));
  if (question === "exit") break;
  await ask(question);
}

terminal.close();
