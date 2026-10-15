import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { listEvents } from "./lib/calendar-api";
import { cyan, dim, green, title } from "./lib/log";

// Just an LLM, no tools. Try: "Add lunch with Sam on Friday at 1pm"
const client = new Anthropic();
const SYSTEM = `You are a calendar assistant. Today is ${new Date().toDateString()}.`;
const history: Anthropic.MessageParam[] = [];

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("Calendar chat (type exit to quit)");

while (true) {
  const userText = await terminal.question(cyan("\nyou > "));
  if (userText === "exit") break;
  history.push({ role: "user", content: userText });

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: SYSTEM,
    messages: history,
  });
  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  history.push({ role: "assistant", content: text });

  console.log(green(`bot > ${text}`));
  console.log(dim(`      (the calendar really has ${(await listEvents()).length} events)`));
}

terminal.close();
