import Anthropic from "@anthropic-ai/sdk";
import { listFiles, readFile } from "../lib/incident";
import { bold, cyan, dim, green, red, title, tokenBar, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: one agent, three long files. Watch the window grow
// ════════════════════════════════════════════════════════════════════════════════════════════════

const MAX_TURNS = 12;
const TASK =
  "Write a short brief on incident INC-2026-Q3-011 for the exec team: what broke, the root cause, " +
  "how many extra support conversations it caused, and what it cost. Use the incident files.";

// The tools: read_file returns a whole file. This is what fills the window.
const TOOLS: Anthropic.Tool[] = [
  {
    name: "list_files",
    description: "List the incident files you can read.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "read_file",
    description: "Read one incident file completely. Returns the whole file.",
    input_schema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  },
];

async function runResearchAgent() {
  title("Job: incident brief");
  console.log(cyan(TASK));

  const messages: Anthropic.MessageParam[] = [{ role: "user", content: TASK }];
  let totalInput = 0;
  let peak = 0;

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    // 1. call the model. It re-reads EVERYTHING before this turn; the bar shows how much
    const response = await callModel(messages);
    totalInput += response.usage.input_tokens;
    peak = Math.max(peak, response.usage.input_tokens);
    tokenBar(`turn ${turn}`, response.usage.input_tokens);
    messages.push({ role: "assistant", content: response.content });

    // 2. done: print the brief
    if (response.stop_reason !== "tool_use") {
      console.log(green(`\nbrief > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
      break;
    }

    // 3. run the tools. Every read_file result is a WHOLE file, and it stays in the window until the end
    messages.push({ role: "user", content: runTools(response, turn) });
  }

  console.log(bold(`\nBiggest window: ${peak.toLocaleString()} tokens. Tokens read across all turns: ${totalInput.toLocaleString()}.`));
  console.log(red("Every turn re-sends everything before it, and each whole file stays in the window until the end."));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

async function callModel(messages: Anthropic.MessageParam[]) {
  return client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 1500,
    system: "You research incidents for Lumen Audio. Use the tools, then write the brief in plain text.",
    tools: TOOLS,
    messages,
  });
}

function runTools(response: Anthropic.Message, turn: number) {
  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    const input = block.input as { name?: string };
    console.log(yellow(`      turn ${turn} → ${block.name}`), dim(JSON.stringify(input)));
    const output = block.name === "list_files" ? listFiles().join("\n") : readFile(input.name ?? "");
    results.push({ type: "tool_result", tool_use_id: block.id, content: output });
  }
  return results;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runResearchAgent();
