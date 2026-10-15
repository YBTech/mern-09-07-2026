import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { cyan, json, title } from "./lib/log";

// Describe our functions, and ask the model which one it would call
const client = new Anthropic();
const SYSTEM = `You are a calendar assistant. Today is ${new Date().toDateString()}.
You can't act yourself, but you can ask me to run one of these functions:
- list_events(): list every event
- create_event(title, date, time, description): date is YYYY-MM-DD, time is HH:MM
- none: just reply to the user
Pick the function and its arguments. Leave an argument null if it is not needed.`;

const CHOICE_SCHEMA = {
  type: "object",
  properties: {
    function: { type: "string", enum: ["list_events", "create_event", "none"] },
    args: {
      type: "object",
      properties: {
        title: { type: ["string", "null"] },
        date: { type: ["string", "null"] },
        time: { type: ["string", "null"] },
        description: { type: ["string", "null"] },
      },
      required: ["title", "date", "time", "description"],
      additionalProperties: false,
    },
    reply: { type: "string" },
  },
  required: ["function", "args", "reply"],
  additionalProperties: false,
};

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("Calendar chat (type exit to quit)");

while (true) {
  const userText = await terminal.question(cyan("\nyou > "));
  if (userText === "exit") break;

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: SYSTEM,
    messages: [{ role: "user", content: userText }],
    output_config: { format: { type: "json_schema", schema: CHOICE_SCHEMA } },
  });
  const text = response.content.find((b) => b.type === "text")?.text ?? "";

  // The model only CHOSE. Nothing has run yet.
  json(JSON.parse(text));
}

terminal.close();
