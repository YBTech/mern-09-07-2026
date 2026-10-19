import Anthropic from "@anthropic-ai/sdk";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { listFiles } from "../lib/incident";
import { runWorker } from "../lib/worker";
import { bold, cyan, dim, green, magenta, title, tokenBar } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: code-driven workers. OUR CODE decides when each worker starts
// ════════════════════════════════════════════════════════════════════════════════════════════════

const TASK =
  "Write a short brief on incident INC-2026-Q3-011 for the exec team: what broke, the root cause, " +
  "how many extra support conversations it caused, and what it cost.";

// The shared file the workers write to, and the token counts for the summary at the end
const FINDINGS = new URL("../../runs/findings.md", import.meta.url);
const tokens = { peak: 0, total: 0 };

async function runOrchestratorWorkers() {
  // 1. orchestrator: a model plans the subtasks, from the file names only
  title("1. Orchestrator: plan the subtasks");
  console.log(cyan(TASK));
  const subtasks = await planSubtasks();

  // 2. OUR CODE starts one worker per subtask, all at once. The worker is the same one step 11 uses (lib/worker.ts).
  //    Each writes its report into ITS OWN section of runs/findings.md (shared state: no worker waits for another)
  title("2. Workers: started by our code, in parallel, each in its own window");
  startFindingsFile();
  await Promise.all(
    subtasks.map(async ({ file, question }) => {
      const report = await runWorker(`Read ${file} and answer: ${question}`, file.slice(0, 9));
      saveReport(file, report.text);
      count(report.peakInput, report.totalInput);
    }),
  );
  const findings = readFileSync(FINDINGS, "utf8");
  console.log(dim(findings));

  // 3. orchestrator: reads findings.md, never the workers' windows, and writes the brief
  title("3. Orchestrator: read findings.md and write the brief");
  const brief = await writeBrief(findings);
  console.log(green(`\nbrief > ${brief}`));

  console.log(bold(`\nBiggest window any model read: ${tokens.peak.toLocaleString()} tokens. Tokens read in total: ${tokens.total.toLocaleString()}.`));
  console.log(dim("Smaller windows and parallel work, but the total is not lower: every worker pays for its own reading."));
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

const text = (r: Anthropic.Message) => r.content.find((b) => b.type === "text")?.text ?? "";
// Models sometimes wrap JSON in a code fence: cut everything before the first [ or { and after the last ] or }
const json = (s: string) => JSON.parse(s.replace(/^[^[{]*/, "").replace(/[^\]}]*$/, ""));

function count(peak: number, total: number) {
  tokens.peak = Math.max(tokens.peak, peak);
  tokens.total += total;
}

async function planSubtasks() {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 600,
    system:
      "You split a research job into subtasks, one per file that could help. Reply with JSON only: " +
      '[{"file": "<file name>", "question": "<what to find in that file>"}]',
    messages: [{ role: "user", content: `Job: ${TASK}\n\nFiles:\n${listFiles().join("\n")}` }],
  });
  count(response.usage.input_tokens, response.usage.input_tokens);
  tokenBar("planner", response.usage.input_tokens);
  const subtasks: { file: string; question: string }[] = json(text(response));
  for (const t of subtasks) console.log(dim(`      ${t.file}: ${t.question}`));
  return subtasks;
}

function startFindingsFile() {
  mkdirSync(new URL("../../runs/", import.meta.url), { recursive: true });
  writeFileSync(FINDINGS, "# Findings\n");
}

// Write, do not return: the report goes into the shared file, in this worker's own section
function saveReport(file: string, report: string) {
  appendFileSync(FINDINGS, `\n## ${file}\n${report}\n`);
  console.log(magenta(`      ${file} → wrote its section of runs/findings.md`));
}

async function writeBrief(findings: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 1000,
    system: "Write the brief in plain text from these findings. Mention the source file for each fact.",
    messages: [{ role: "user", content: `Job: ${TASK}\n\n${findings}` }],
  });
  count(response.usage.input_tokens, response.usage.input_tokens);
  tokenBar("combine", response.usage.input_tokens);
  return text(response);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runOrchestratorWorkers();
