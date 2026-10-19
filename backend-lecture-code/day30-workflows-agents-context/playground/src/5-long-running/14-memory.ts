import Anthropic from "@anthropic-ai/sdk";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { bold, cyan, dim, green, magenta, title, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: long-term memory. Write, select, forget
// ════════════════════════════════════════════════════════════════════════════════════════════════

const INTRO = "Hi, I'm Dana. I own an Aria 500 and I only use Android. Please keep your answers short.";
const QUESTION = "Hi again, my Aria 500 keeps disconnecting. Any advice?";

async function runMemoryDemo() {
  // 1. conversation 1 WRITES: the agent saves lasting facts with save_memory (to a file; a database in real life)
  title("Conversation 1: the customer introduces themselves");
  console.log(cyan(INTRO));
  await saveMemories(INTRO);

  // 2. conversation 2 SELECTS: a brand-new message list, with this customer's memories in the system prompt
  await answerWithMemories(QUESTION);

  // 3. FORGET: drop memories older than 30 days, and delete one when the customer asks
  title("Forgetting");
  expireOldMemories();
  forgetOnRequest();
  console.log(bold(`memories left: ${load().length}`));

  // 4. the same question again: what was forgotten does not come back
  await answerWithMemories(QUESTION);
  console.log(dim("\nEvery memory kept a date and a source, which is what made expiring and deleting possible."));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

type Memory = { id: number; fact: string; savedAt: string; source: string };
const FILE = new URL("../../memory.json", import.meta.url);
const DAY = 24 * 60 * 60 * 1000;
function load(): Memory[] {
  return existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : [];
}
function store(memories: Memory[]) {
  writeFileSync(FILE, JSON.stringify(memories, null, 2));
}

const SAVE_TOOL: Anthropic.Tool = {
  name: "save_memory",
  description: "Save one lasting fact about the customer (name, product, preference) so it is remembered in future conversations.",
  input_schema: { type: "object", properties: { fact: { type: "string" } }, required: ["fact"] },
};

async function saveMemories(message: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 500,
    system: "You are Lumen Audio support. Save lasting facts about the customer with save_memory.",
    tools: [SAVE_TOOL],
    messages: [{ role: "user", content: message }],
  });
  const memories = load();
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    memories.push({ id: memories.length + 1, fact: (block.input as { fact: string }).fact, savedAt: new Date().toISOString(), source: "conversation 1" });
  }
  store(memories);
  console.log(green(`saved ${memories.length} memories:`));
  for (const m of memories) console.log(dim(`  #${m.id} ${m.fact}`));
}

// The old messages are gone. Memory is kept per customer, so we load that customer's memories.
// (With thousands of memories per customer you would rank them by search and load only the top few.)
async function answerWithMemories(question: string) {
  const relevant = load();
  title(`Conversation 2: a new chat, ${relevant.length} memories loaded`);
  console.log(cyan(question));
  for (const m of relevant) console.log(magenta(`  recalled #${m.id}: ${m.fact}`));
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 300,
    system: `You are Lumen Audio support. Known about this customer:\n${relevant.map((m) => `- ${m.fact}`).join("\n") || "(nothing)"}`,
    messages: [{ role: "user", content: question }],
  });
  console.log(green(`bot > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
}

// Anything older than 30 days is dropped. (We backdate memory #1 first to pretend it is old.)
function expireOldMemories() {
  const all = load();
  all[0].savedAt = new Date(Date.now() - 90 * DAY).toISOString();
  const fresh = all.filter((m) => Date.now() - new Date(m.savedAt).getTime() < 30 * DAY);
  console.log(yellow(`expired ${all.length - fresh.length} memory older than 30 days: #${all[0].id}`));
  store(fresh);
}

// A privacy request must remove the fact for good
function forgetOnRequest() {
  const memories = load();
  if (memories.length === 0) return;
  console.log(yellow(`customer asked to be forgotten: deleting #${memories[0].id} (${memories[0].fact})`));
  store(memories.slice(1));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

rmSync(FILE, { force: true }); // start every demo with an empty memory
await runMemoryDemo();
