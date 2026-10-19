import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { cyan, green, title } from "./lib/log";

// A plain chatbot. It has never seen Lumen Audio's policies
const client = new Anthropic();
const SYSTEM = "You are the support assistant for Lumen Audio, an online headphone and speaker store. Be brief, plain text, no markdown.";

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("No RAG (type exit to quit)");

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
}

terminal.close();
