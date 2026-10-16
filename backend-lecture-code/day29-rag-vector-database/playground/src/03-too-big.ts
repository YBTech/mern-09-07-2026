import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import { dim, red, title, yellow } from "./lib/log";

// What if the company had 200 times more documents? Real companies have thousands of pages
const COPIES = 200;
const files = fs.readdirSync("docs");
const allDocs = files.map((file) => fs.readFileSync(`docs/${file}`, "utf8")).join("\n\n");
const hugeDocs = Array(COPIES).fill(allDocs).join("\n\n");

const client = new Anthropic();

title("How many tokens is that?");
const small = await client.messages.countTokens({
  model: "claude-haiku-5-5",
  system: allDocs,
  messages: [{ role: "user", content: "Can I return opened headphones?" }],
});
console.log(`  ${files.length} files:        ${small.input_tokens.toLocaleString()} tokens`);
console.log(`  ${files.length * COPIES} files:     ~${(small.input_tokens * COPIES).toLocaleString()} tokens`);

title("Send it anyway");
try {
  await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: hugeDocs,
    messages: [{ role: "user", content: "Can I return opened headphones?" }],
  });
} catch (err) {
  console.log(red(`  ${(err as Error).message}`));
}

console.log(yellow("\n  Too big for the model, and even when it fits, every question pays for all of it."));
console.log(dim("  We need to send only the parts that answer the question."));
