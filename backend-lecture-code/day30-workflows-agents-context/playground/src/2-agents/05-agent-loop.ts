import Anthropic from "@anthropic-ai/sdk";
import { checkHardReply, EASY_REFUND, HARD, lookUpOrder, searchPolicy } from "../lib/support";
import { cyan, dim, green, isMain, printChecklist, red, title, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: the agent loop
// ════════════════════════════════════════════════════════════════════════════════════════════════

export type AgentResult = { reply: string; path: string[]; modelCalls: number; inputTokens: number; outputTokens: number; ms: number };

// We give the model tools and a turn cap. The model picks which tool, in which order, how many times.
const MAX_TURNS = 10;
const TOOLS: Anthropic.Tool[] = [
  {
    name: "look_up_order",
    description: "Look up one order by id, for example A1042. Returns the item, total, and days since delivery.",
    input_schema: { type: "object", properties: { order_id: { type: "string" } }, required: ["order_id"] },
  },
  {
    name: "search_policy",
    description: "Search Lumen Audio policies. The topic can be refund, warranty or firmware.",
    input_schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  },
];

export async function runSupportAgent(email: string, quiet = false): Promise<AgentResult> {
  const started = Date.now();
  const result: AgentResult = { reply: "", path: [], modelCalls: 0, inputTokens: 0, outputTokens: 0, ms: 0 };
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: email }];

  while (result.modelCalls < MAX_TURNS) {
    // 1. call the model with the whole conversation so far and the tools it may pick
    const response = await callModel(messages);
    result.modelCalls++;
    result.inputTokens += response.usage.input_tokens;
    result.outputTokens += response.usage.output_tokens;
    messages.push({ role: "assistant", content: response.content });
    if (!quiet) console.log(dim(`      turn ${result.modelCalls} stop_reason: ${response.stop_reason}`));

    // 2. stop_reason "end_turn": the MODEL decided it is done
    if (response.stop_reason !== "tool_use") {
      result.reply = response.content.find((b) => b.type === "text")?.text ?? "";
      break;
    }

    // 3. stop_reason "tool_use": run the tools it picked, send the results back, and loop
    const tools = runTools(response, result.modelCalls, quiet);
    result.path.push(...tools.steps);
    messages.push({ role: "user", content: tools.results });
  }

  result.ms = Date.now() - started;
  return result;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

async function callModel(messages: Anthropic.MessageParam[]) {
  return client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" }, // no hidden reasoning: cheaper, and token counts stay comparable
    max_tokens: 800,
    system: "You are Lumen Audio support. Use the tools to check facts, then reply in under 120 words, plain text.",
    tools: TOOLS,
    messages,
  });
}

// Run every tool the model asked for this turn. Returns the tool results, plus a short label per call for the path.
function runTools(response: Anthropic.Message, turn: number, quiet: boolean) {
  const results: Anthropic.ToolResultBlockParam[] = [];
  const steps: string[] = [];
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    const input = block.input as { order_id?: string; query?: string };
    steps.push(block.name === "look_up_order" ? `look_up ${input.order_id}` : `policy ${input.query}`);
    if (!quiet) console.log(yellow(`      turn ${turn} → ${block.name}`), dim(JSON.stringify(input)));
    const output = block.name === "look_up_order" ? JSON.stringify(lookUpOrder(input.order_id)) : searchPolicy(input.query ?? "");
    results.push({ type: "tool_result", tool_use_id: block.id, content: output });
  }
  return { results, steps };
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

if (isMain(import.meta.url)) {
  title("The email the router in step 02 could not handle");
  console.log(cyan(HARD));
  const hard = await runSupportAgent(HARD);
  console.log(green(`\nreply > ${hard.reply}`));
  console.log(dim(`      ${hard.modelCalls} model calls, ${hard.inputTokens + hard.outputTokens} tokens, ${hard.ms} ms`));

  title("Did it cover everything the customer asked?");
  printChecklist(checkHardReply(hard.reply));

  title("And a simple refund email");
  console.log(cyan(EASY_REFUND));
  const easy = await runSupportAgent(EASY_REFUND);
  console.log(green(`\nreply > ${easy.reply}`));
  console.log("\nNobody wrote the path. The model chose which tools to call, in which order, as many times as it needed.");
}
