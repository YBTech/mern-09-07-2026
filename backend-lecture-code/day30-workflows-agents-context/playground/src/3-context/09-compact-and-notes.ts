import Anthropic from "@anthropic-ai/sdk";
import { readSection, search } from "../lib/incident";
import { bold, cyan, dim, green, magenta, title, tokenBar, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: the same agent as step 08, plus COMPRESS and WRITE
// ════════════════════════════════════════════════════════════════════════════════════════════════

const USE_NOTES = true; // set to false to see compaction on its own
const COMPACT_AT = 4500; // tokens. Real limits are far bigger; this one is small so it fires in a short demo.
const MAX_TURNS = 15;
const TASK =
  "Write a short brief on incident INC-2026-Q3-011 for the exec team: what broke, the root cause, " +
  "how many extra support conversations it caused, and what it cost. Use the incident files.";

// The trimmed tools from step 08, plus two note tools. Notes survive compaction because they live outside the window.
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
const NOTE_TOOLS: Anthropic.Tool[] = [
  {
    name: "save_note",
    description: "Save one exact fact (a number, a date, a name) with where you found it. Notes survive history compaction.",
    input_schema: { type: "object", properties: { note: { type: "string" } }, required: ["note"] },
  },
  {
    name: "read_notes",
    description: "Read back every note you saved.",
    input_schema: { type: "object", properties: {} },
  },
];

// WRITE: notes live here, outside the message list, so compaction never touches them
const notes: string[] = [];

async function runResearchAgent() {
  title(`Job: incident brief (compact at ${COMPACT_AT} tokens, notes ${USE_NOTES ? "on" : "off"})`);
  console.log(cyan(TASK));

  let messages: Anthropic.MessageParam[] = [{ role: "user", content: TASK }];
  let totalInput = 0;
  let peak = 0;
  let finished = false;

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    // 1. call the model
    const response = await callModel(messages);
    totalInput += response.usage.input_tokens;
    peak = Math.max(peak, response.usage.input_tokens);
    tokenBar(`turn ${turn}`, response.usage.input_tokens, 250);
    messages.push({ role: "assistant", content: response.content });

    // 2. done: print the brief
    if (response.stop_reason !== "tool_use") {
      finished = true;
      console.log(green(`\nbrief > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
      break;
    }

    // 3. run the tools. WRITE: save_note puts an exact figure OUTSIDE the window
    messages.push({ role: "user", content: runTools(response, turn) });

    // 4. COMPRESS: past the limit, replace the old turns with a summary (keep the newest tool call + result)
    if (response.usage.input_tokens > COMPACT_AT && messages.length > 3) {
      messages = await compactHistory(messages);
    }
  }

  if (!finished) console.log(bold(`\nstopped: no brief after ${MAX_TURNS} turns`));
  console.log(bold(`\nBiggest window: ${peak.toLocaleString()} tokens. Tokens read across all turns: ${totalInput.toLocaleString()}.`));
  if (USE_NOTES) {
    console.log(bold("\nNotes kept outside the window (exact, never summarised):"));
    for (const note of notes) console.log(dim(`  - ${note}`));
  }
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

async function callModel(messages: Anthropic.MessageParam[]) {
  return client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 1500,
    system:
      "You research incidents for Lumen Audio. Search first, read only the sections you need, then write the brief in plain text." +
      (USE_NOTES ? " Save every exact figure and date with save_note as soon as you read it. If your history was summarised, call read_notes." : ""),
    tools: USE_NOTES ? [...TOOLS, ...NOTE_TOOLS] : TOOLS,
    messages,
  });
}

function runTools(response: Anthropic.Message, turn: number) {
  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    const input = block.input as { query?: string; file?: string; heading?: string; note?: string };
    console.log(yellow(`      turn ${turn} → ${block.name}`), dim(JSON.stringify(input).slice(0, 110)));
    let output: string;
    if (block.name === "search") output = JSON.stringify(search(input.query ?? ""));
    else if (block.name === "read_section") output = readSection(input.file ?? "", input.heading ?? "");
    else if (block.name === "save_note") {
      notes.push(input.note ?? "");
      output = "saved";
    } else output = notes.join("\n") || "(no notes yet)";
    results.push({ type: "tool_result", tool_use_id: block.id, content: output });
  }
  return results;
}

// Summarise everything except the newest tool call and its result, and start the history again from that summary
async function compactHistory(messages: Anthropic.MessageParam[]): Promise<Anthropic.MessageParam[]> {
  const summary = await summarise(messages.slice(0, -2));
  console.log(magenta(`      compacted ${messages.length - 2} old messages into one summary:`));
  console.log(dim(`      ${summary.replace(/\n+/g, " ").slice(0, 400)}`));
  return [{ role: "user", content: `${TASK}\n\nYour work so far (summary):\n${summary}` }, ...messages.slice(-2)];
}

// Turn the old messages into plain text, ask the model to shrink them, return the summary
async function summarise(old: Anthropic.MessageParam[]) {
  const transcript = old
    .map((m) => {
      const blocks = typeof m.content === "string" ? [m.content] : m.content.map((b) => ("text" in b ? b.text : "content" in b ? String(b.content) : "name" in b ? `${b.name}(${JSON.stringify(b.input)})` : ""));
      return `${m.role}: ${blocks.join("\n")}`;
    })
    .join("\n\n");
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 600,
    system: "Summarise this work in progress in under 150 words: the task, what was found so far, and what is still missing.",
    messages: [{ role: "user", content: transcript }],
  });
  return response.content.find((b) => b.type === "text")?.text ?? "";
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runResearchAgent();
