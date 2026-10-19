import Anthropic from "@anthropic-ai/sdk";
import { readSection, search } from "../lib/incident";
import { bold, cyan, dim, green, title, tokenBar, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: the same agent as step 07. Only the tools changed (TOOLS, right below)
// ════════════════════════════════════════════════════════════════════════════════════════════════

const MAX_TURNS = 12;
const TASK =
  "Write a short brief on incident INC-2026-Q3-011 for the exec team: what broke, the root cause, " +
  "how many extra support conversations it caused, and what it cost. Use the incident files.";

// The tools are the whole change from step 07:
//   TRIM:   search returns short snippets, not whole files
//   SELECT: the model asks for the one section it needs, just in time
const TOOLS: Anthropic.Tool[] = [
  {
    name: "search",
    description: "Search all incident files. Returns the best matching sections with a short snippet each (file, heading, snippet).",
    input_schema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  },
  {
    name: "read_section",
    description: "Read one section of one file, using a file and heading from search results.",
    input_schema: { type: "object", properties: { file: { type: "string" }, heading: { type: "string" } }, required: ["file", "heading"] },
  },
];

async function runResearchAgent() {
  title("Job: incident brief (trimmed tools)");
  console.log(cyan(TASK));

  const messages: Anthropic.MessageParam[] = [{ role: "user", content: TASK }];
  let totalInput = 0;
  let peak = 0;

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    // 1. call the model. It still re-reads everything before this turn
    const response = await callModel(messages);
    totalInput += response.usage.input_tokens;
    peak = Math.max(peak, response.usage.input_tokens);
    tokenBar(`turn ${turn}`, response.usage.input_tokens, 250);
    messages.push({ role: "assistant", content: response.content });

    // 2. done: print the brief
    if (response.stop_reason !== "tool_use") {
      console.log(green(`\nbrief > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
      break;
    }

    // 3. run the tools. Now each result is a snippet or one section, not a whole file
    messages.push({ role: "user", content: runTools(response, turn) });
  }

  console.log(bold(`\nBiggest window: ${peak.toLocaleString()} tokens. Tokens read across all turns: ${totalInput.toLocaleString()}.`));
  console.log(dim("The window still grows with every turn, just far more slowly. Next: what to do when it grows anyway."));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

async function callModel(messages: Anthropic.MessageParam[]) {
  return client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 1500,
    system: "You research incidents for Lumen Audio. Search first, read only the sections you need, then write the brief in plain text.",
    tools: TOOLS,
    messages,
  });
}

function runTools(response: Anthropic.Message, turn: number) {
  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    const input = block.input as { query?: string; file?: string; heading?: string };
    console.log(yellow(`      turn ${turn} → ${block.name}`), dim(JSON.stringify(input)));
    const output =
      block.name === "search" ? JSON.stringify(search(input.query ?? "")) : readSection(input.file ?? "", input.heading ?? "");
    results.push({ type: "tool_result", tool_use_id: block.id, content: output });
  }
  return results;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runResearchAgent();
