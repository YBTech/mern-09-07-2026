import Anthropic from "@anthropic-ai/sdk";
import { bold, cyan, dim, red, title, tokenBar, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: an agent whose tool never works, stopped by a turn cap
// ════════════════════════════════════════════════════════════════════════════════════════════════

const TASK = "Find the Q3 2026 refund rate for the Aria 500 in the company documents.";
const MAX_TURNS = 3; // the guard: after this many turns, stop and say why

async function runWithTurnCap() {
  title(`Turn cap: ${MAX_TURNS} turns`);
  console.log(cyan(TASK));

  const messages: Anthropic.MessageParam[] = [{ role: "user", content: TASK }];

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    // 1. call the model
    const response = await callModel(messages);
    tokenBar(`turn ${turn}`, response.usage.input_tokens, 100);
    messages.push({ role: "assistant", content: response.content });

    // 2. finished by itself? It never does here: the tool always fails, so it keeps retrying
    if (response.stop_reason !== "tool_use") {
      console.log(`\nfinished by itself: ${response.content.find((b) => b.type === "text")?.text ?? ""}`);
      return;
    }

    // 3. run the tools, send the (failed) results back, and loop
    const results = runTools(response, turn);
    messages.push({ role: "user", content: results });
  }

  // 4. the turn cap ended the run: report why, and hand over instead of retrying forever
  console.log(bold(red(`\nSTOPPED by the turn cap: ${MAX_TURNS} turns used, task not finished`)));
  console.log(dim("Without the cap this loop would never end. Report why it stopped, and hand over to a person."));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_docs",
    description: "Search the company documents.",
    input_schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  },
];

async function callModel(messages: Anthropic.MessageParam[]) {
  return client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 500,
    system: "You are a research agent. Use search_docs. Do not answer until you have found the figure: if a search fails, try again.",
    tools: TOOLS,
    messages,
  });
}

// The tool always fails, so the agent can never finish this task
function runTools(response: Anthropic.Message, turn: number) {
  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    console.log(yellow(`      turn ${turn} → ${block.name}`), dim(JSON.stringify(block.input)));
    results.push({ type: "tool_result", tool_use_id: block.id, content: "Search timed out. Please try again." });
  }
  return results;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runWithTurnCap();
