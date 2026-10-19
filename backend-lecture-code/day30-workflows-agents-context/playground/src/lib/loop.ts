import Anthropic from "@anthropic-ai/sdk";
import { dim, tokenBar, yellow } from "./log";

// The agent loop from step 05, moved into a function because several agents use it: the worker in worker.ts
// (steps 10 and 11) and the lead agent in step 11.
// Same three moves: call the model, run the tools it asked for, send the results back.
const client = new Anthropic();

export type AgentRun = {
  text: string;
  turns: number;
  peakInput: number; // the biggest window the model had to read
  totalInput: number;
  totalOutput: number;
};

export async function runAgent(options: {
  system: string;
  task: string;
  tools: Anthropic.Tool[];
  run: (name: string, input: any) => string | Promise<string>;
  maxTurns?: number;
  label?: string;
  oneToolAtATime?: boolean; // true: the model may ask for only one tool per turn
}): Promise<AgentRun> {
  const { system, task, tools, run, maxTurns = 10, label = "agent", oneToolAtATime = false } = options;
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: task }];
  const result: AgentRun = { text: "", turns: 0, peakInput: 0, totalInput: 0, totalOutput: 0 };

  while (result.turns < maxTurns) {
    result.turns++;
    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      thinking: { type: "disabled" },
      max_tokens: 1500,
      system,
      tools,
      tool_choice: { type: "auto", disable_parallel_tool_use: oneToolAtATime },
      messages,
    });
    result.peakInput = Math.max(result.peakInput, response.usage.input_tokens);
    result.totalInput += response.usage.input_tokens;
    result.totalOutput += response.usage.output_tokens;
    tokenBar(`${label} ${result.turns}`, response.usage.input_tokens);
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      result.text = response.content.find((b) => b.type === "text")?.text ?? "";
      return result;
    }

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(yellow(`      ${label} → ${block.name}`), dim(JSON.stringify(block.input).slice(0, 90)));
      results.push({ type: "tool_result", tool_use_id: block.id, content: await run(block.name, block.input) });
    }
    messages.push({ role: "user", content: results });
  }
  result.text = "(stopped: too many turns)";
  return result;
}
