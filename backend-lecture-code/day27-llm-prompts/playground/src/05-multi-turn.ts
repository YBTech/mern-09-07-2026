import type Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { callModel } from "./utils/call-model";
import { cyan, dim, green, title } from "./utils/log";

const SYSTEM = "You are a friendly assistant. Keep every answer under 3 sentences.";

const history: Anthropic.MessageParam[] = [];

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("Chat (type exit to quit)");

while (true) {
  const userText = await terminal.question(cyan("\nyou > "));
  if (userText.trim() === "exit") break;

  history.push({ role: "user", content: userText });
  
  const { text, usage } = await callModel({ system: SYSTEM, messages: history });

  history.push({ role: "assistant", content: text });

  console.log(green(`bot > ${text}`));
  console.log(
    dim(`      sent ${history.length} message(s) · ${usage.input_tokens} input tokens`),
  );
}

terminal.close();
