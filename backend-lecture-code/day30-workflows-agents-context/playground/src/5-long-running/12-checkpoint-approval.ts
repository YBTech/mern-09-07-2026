import Anthropic from "@anthropic-ai/sdk";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { readSection } from "../lib/incident";
import { bold, cyan, dim, green, red, title, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: a long job as steps, with ONE state object saved after every step
// ════════════════════════════════════════════════════════════════════════════════════════════════

// The job: three fact-finding steps, a draft, a human approval, and a send
const STEPS: { name: string; run: () => Promise<void> }[] = [
  { name: "engineering", run: () => extractFact("engineering", "engineering-postmortem.md", "Root cause analysis", "What was the root cause?") },
  { name: "support", run: () => extractFact("support", "support-chat-export.md", "Weekly summary", "How many extra conversations did the incident cause?") },
  { name: "finance", run: () => extractFact("finance", "finance-memo.md", "Total incident cost", "What did the incident cost?") },
  { name: "draft", run: draftBrief },
  { name: "approval", run: async () => {} },
  { name: "send", run: sendBrief },
];

//   npm run 12                          start a new run
//   npm run 12 -- --crash-after=2       start a run that dies after step 2 (or --crash-after=send)
//   npm run 12 -- --resume=<runId>      continue a crashed run: finished steps are skipped
//   npm run 12 -- --approve=<runId>     a human says yes to a run that is waiting
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const crashAfter = args["crash-after"] ?? "";
const runId = args.resume ?? args.approve ?? `run-${Date.now()}`;

// The ONE state object for this run: loaded from runs/<runId>.json, or a fresh one
const state = loadState(runId);
// A human said yes: this run may now pass the approval step
if (args.approve) {
  state.status = "approved";
  save(state);
}

async function runCheckpointedJob() {
  title(`Run ${runId}`);
  for (const step of STEPS) {
    // 1. a step that is already done is skipped: this is what makes resume work
    if (state.done.includes(step.name)) {
      console.log(dim(`  skip  ${step.name} (already done)`));
      continue;
    }

    // 2. approval is a pause, not a wait: save the state and exit. Nothing stays running
    if (step.name === "approval" && state.status !== "approved") pauseForApproval();

    // 3. run the step, then save a checkpoint
    console.log(yellow(`  run   ${step.name}`));
    await step.run();
    state.done.push(step.name);
  
    save(state);
    console.log(dim(`        checkpoint saved (${state.done.length} of ${STEPS.length} steps done)`));

    // (demo only) die here if --crash-after says so
    if (crashAfter === String(state.done.length)) crash(`after step ${state.done.length}`);
  }
  console.log(bold(green("\nRun complete.")));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

type State = {
  runId: string;
  done: string[];
  facts: Record<string, string>;
  brief: string;
  status: "running" | "waiting_for_approval" | "approved";
  messageId?: string;
};

function stateFile(id: string) {
  return new URL(`../../runs/${id}.json`, import.meta.url);
}

function loadState(id: string): State {
  mkdirSync(new URL("../../runs/", import.meta.url), { recursive: true });
  const file = stateFile(id);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { runId: id, done: [], facts: {}, brief: "", status: "running" };
}

// The checkpoint: the whole state, written to disk
function save(s: State) {
  writeFileSync(stateFile(s.runId), JSON.stringify(s, null, 2));
}

const text = (r: Anthropic.Message) => r.content.find((b) => b.type === "text")?.text ?? "";

// One model call that pulls the key facts out of one section, saved under its own key in the state
async function extractFact(key: string, file: string, heading: string, question: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 300,
    system: `Answer in two sentences, with exact figures, using only this text:\n${readSection(file, heading)}`,
    messages: [{ role: "user", content: question }],
  });
  state.facts[key] = text(response);
}

async function draftBrief() {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 500,
    system: "Write a five-line incident brief for executives from these facts. Plain text.",
    messages: [{ role: "user", content: JSON.stringify(state.facts, null, 2) }],
  });
  state.brief = text(response);
}

// Safe to repeat: the message id is saved BEFORE sending, so a second run knows it already went out
async function sendBrief() {
  if (state.messageId) return console.log(dim(`      already sent as ${state.messageId}, not sending again`));
  state.messageId = `msg-${Date.now()}`;
  save(state);
  console.log(green(`      SENT ${state.messageId} to the exec team`));
  if (crashAfter === "send") crash("after sending, before recording it as done");
}

function pauseForApproval(): never {
  state.status = "waiting_for_approval";
  save(state);
  console.log(bold(`\nBrief waiting for approval:\n`) + cyan(state.brief));
  console.log(yellow(`\n⏸ paused. The process exits now. Approve with: npm run 12 -- --approve=${runId}`));
  process.exit(0);
}

function crash(why: string): never {
  console.log(red(`\n💥 crashed ${why}. Resume with: npm run 12 -- --resume=${runId}`));
  process.exit(1);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runCheckpointedJob();
