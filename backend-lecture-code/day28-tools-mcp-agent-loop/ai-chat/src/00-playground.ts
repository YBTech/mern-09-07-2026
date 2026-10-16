import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { TOOLS, runTool } from "./tools";
import { cyan, dim, green, red, title, yellow } from "./lib/log";

// An agent: keep calling the model until it stops asking for tools
const client = new Anthropic();
const SYSTEM = `You are a calendar assistant. Today is ${new Date().toDateString()}.`;
const MAX_TURNS = 10;
const history: Anthropic.MessageParam[] = [];

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("Calendar agent (type exit to quit)");

while (true) {
  const userText = await terminal.question(cyan("\nyou > "));
  if (userText === "exit") break;
  history.push({ role: "user", content: userText });

  let turns = 0;
  // One pass of this loop = one model call plus running its tools
  while (true) {
    if (++turns > MAX_TURNS) {
      console.log(red("      stopped: too many turns"));
      break;
    }

    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 1000,
      system: SYSTEM,
      tools: TOOLS,
      messages: history,
    });
    history.push({ role: "assistant", content: response.content });

    // No tool call means the model has its answer
    if (response.stop_reason !== "tool_use") {
      console.log(green(`bot > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
      break;
    }

    // Run each requested tool and collect the results
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(yellow(`      turn ${turns} → ${block.name}`), dim(JSON.stringify(block.input)));
      const output = await runTool(block.name, block.input);
      results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(output) });
    }
    // Send the results back as the next message, then loop: the model decides what is next
    history.push({ role: "user", content: results });
  }
}

terminal.close();
