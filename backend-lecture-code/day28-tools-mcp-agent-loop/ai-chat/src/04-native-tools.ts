import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { TOOLS, runTool } from "./tools";
import { cyan, dim, green, title, yellow } from "./lib/log";

// The API's built-in tools: pass definitions, get back a tool_use block
const client = new Anthropic();
const SYSTEM = `You are a calendar assistant. Today is ${new Date().toDateString()}.`;

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("Calendar chat (type exit to quit)");

while (true) {
  const userText = await terminal.question(cyan("\nyou > "));
  if (userText === "exit") break;
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: userText }];

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: SYSTEM,
    tools: TOOLS,
    messages,
  });

  if (response.stop_reason === "tool_use") {
    // The model asked for tools (maybe several). Run each one and collect the results
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(yellow(`      → ${block.name}`), dim(JSON.stringify(block.input)));
      const output = await runTool(block.name, block.input);
      results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(output) });
    }
    // Add the tool request and our results to the history, so the model can see them
    messages.push({ role: "assistant", content: response.content });
    messages.push({ role: "user", content: results });

    // Second call: the model reads the results and writes the answer
    const final = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 1000,
      system: SYSTEM,
      tools: TOOLS,
      messages,
    });

    console.log(dim(`      stop_reason: ${final.stop_reason}`));
    console.log(green(`bot > ${final.content.find((b) => b.type === "text")?.text ?? ""}`));
  } else {
    console.log(green(`bot > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
  }
}

terminal.close();
