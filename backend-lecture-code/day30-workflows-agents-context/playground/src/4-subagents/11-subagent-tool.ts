import Anthropic from "@anthropic-ai/sdk";
import { runAgent } from "../lib/loop";
import { runWorker } from "../lib/worker";
import { bold, cyan, dim, green, magenta, printChecklist, title } from "../lib/log";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: agent-driven workers. The LEAD AGENT decides when each worker starts
// ════════════════════════════════════════════════════════════════════════════════════════════════

// The second question depends on the first answer: you need the fix date before you can ask what happened up to it
const TASK =
  "Write a short brief on incident INC-2026-Q3-011 for the exec team. First find what broke, the root cause, and the " +
  "date the fix shipped. Then, using that date, find how many extra support conversations came in up to it and what " +
  "the incident cost.";

// What the parent does with the children, counted for the summary at the end
let childPeak = 0;
let childCalls = 0;
const reports: string[] = [];

// The parent's only tool: it looks like any other tool
const PARENT_TOOLS: Anthropic.Tool[] = [
  {
    name: "research",
    description:
      "Hand a research question to a helper that reads the incident files. The helper starts with an empty memory, so the brief " +
      "must say exactly what to find and include any facts it needs from earlier reports. Returns a short report.",
    input_schema: { type: "object", properties: { brief: { type: "string" } }, required: ["brief"] },
  },
];

async function runParentAgent() {
  title("Parent agent (delegates), child agent (reads)");
  console.log(cyan(TASK));

  // 1. the parent agent: its only tool is "research", and it delegates one question at a time
  const parent = await runAgent({
    label: "parent",
    system:
      "You write incident briefs. Do not read files yourself: delegate each fact-finding question with the research tool, " +
      "one question at a time, then write the brief in plain text.",
    oneToolAtATime: true,
    task: TASK,
    tools: PARENT_TOOLS,
    // 2. each time the lead calls research, the worker below runs; only its short report comes back
    run: (_name, input: { brief: string }) => research(input.brief),
  });

  console.log(green(`\nbrief > ${parent.text}`));
  console.log(bold(`\nParent: ${parent.turns} turns, biggest window ${parent.peakInput.toLocaleString()} tokens.`));
  console.log(bold(`Children: ${childCalls} delegated, biggest window ${childPeak.toLocaleString()} tokens, thrown away after each report.`));
  console.log(dim("The parent never saw a whole file. It only saw each child's short report."));
}

// The research tool's body: the SAME worker step 10 uses (lib/worker.ts), started here by the lead's tool call
async function research(brief: string) {
  childCalls++;
  console.log(magenta(`\n      brief #${childCalls} for the helper:`), dim(brief));
  // Passing state through the lead: brief 2 should carry facts that came back in report 1
  if (childCalls > 1) printCarriedFacts(brief);

  const child = await runWorker(brief, "  child");
  childPeak = Math.max(childPeak, child.peakInput);

  // The contract: a report must name its sources and its gaps
  checkContract(child.text);
  reports.push(child.text);
  return child.text;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

// Which figures and dates from earlier reports did the parent copy into this brief? (ignoring ones already in the task)
function printCarriedFacts(brief: string) {
  const earlier = reports.join(" ").match(/\d{1,2} (?:July|August|September)|\$?\d[\d,.]*\d%?/g) ?? [];
  const carried = [...new Set(earlier.filter((n) => n.length >= 3 && brief.includes(n) && !TASK.includes(n)))];
  console.log(magenta(`      carried from earlier reports: ${carried.join(", ") || "(nothing)"}`));
}

function checkContract(report: string) {
  printChecklist([
    { label: "report names its sources", ok: /sources:/i.test(report) },
    { label: "report says what it could not find", ok: /not found:/i.test(report) },
  ]);
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runParentAgent();
