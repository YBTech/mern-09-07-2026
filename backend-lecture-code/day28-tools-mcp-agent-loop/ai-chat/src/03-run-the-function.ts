import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { createEvent, listEvents } from "./lib/calendar-api";
import { cyan, dim, green, json, title, yellow } from "./lib/log";

// Same choice as 02, but now OUR code runs it, then the model writes the reply
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

  // 1. The model picks a function
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: SYSTEM,
    messages: [{ role: "user", content: userText }],
    output_config: { format: { type: "json_schema", schema: CHOICE_SCHEMA } },
  });
  const choice = JSON.parse(response.content.find((b) => b.type === "text")?.text ?? "{}");
  console.log(yellow(`      model chose: ${choice.function}`), dim(JSON.stringify(choice.args)));

  // 2. Our code runs it
  let result: unknown = null;
  if (choice.function === "list_events") result = await listEvents();
  if (choice.function === "create_event") result = await createEvent(choice.args);
  if (choice.function === "none") {
    console.log(green(`bot > ${choice.reply}`));
    continue;
  }
  json(result);

  // 3. Send the result back so the model can answer in words
  const final = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: `You are a calendar assistant. Today is ${new Date().toDateString()}.`,
    messages: [
      {
        role: "user",
        content: `${userText}\n\nI ran ${choice.function} and got: ${JSON.stringify(result)}\nReply to me.`,
      },
    ],
  });
  console.log(green(`bot > ${final.content.find((b) => b.type === "text")?.text}`));
}

terminal.close();
