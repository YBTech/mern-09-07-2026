import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import * as readline from "node:readline/promises";
import { cyan, dim, green, title } from "./lib/log";

// Read every policy file and glue them into one big string
const files = fs.readdirSync("docs");
const allDocs = files.map((file) => fs.readFileSync(`docs/${file}`, "utf8")).join("\n\n");
console.log(dim(`Loaded ${files.length} files, ${allDocs.length} characters`));

const client = new Anthropic();
const SYSTEM = `You are the support assistant for Lumen Audio, an online headphone and speaker store.
Answer only from these policies. If the answer is not there, say you don't know. Be brief, plain text, no markdown.

${allDocs}`;

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("Paste everything into the prompt (type exit to quit)");

while (true) {
  const question = await terminal.question(cyan("\nyou > "));
  if (question === "exit") break;

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: SYSTEM,
    messages: [{ role: "user", content: question }],
  });

  console.log(green(`bot > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
  // Every question pays for every document
  console.log(dim(`      ${response.usage.input_tokens} input tokens`));
}

terminal.close();
