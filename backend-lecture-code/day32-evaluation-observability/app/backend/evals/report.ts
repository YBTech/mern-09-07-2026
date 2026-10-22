import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { AGENT_VERSION } from "../src/agents";

// Every evaluator ends with saveReport(). It writes this run's results to eval-report/results/<agent>-<evaluator>.json
// (one file per agent and evaluator, so running v1 and then v2 fills both columns), then rebuilds eval-report/index.html
// from all the JSON files. The folder is gitignored. Open the HTML file after each run instead of reading the terminal.

export type Row = {
  kind?: string; // a label shown next to the task, e.g. "Tool call"
  task: string;
  pass: boolean;
  score?: string; // a short result shown next to the ✅/❌, e.g. "tone 3/5"
  customer?: string; // what the customer typed
  reply?: string; // what the agent answered
  detail?: string; // why it passed or failed: the judge's reasoning, the question asked, ...
};

type Saved = { agent: string; evaluator: string; savedAt: string; rows: Row[] };

const FOLDER = new URL("../eval-report/", import.meta.url);
const EVALUATORS = [
  ["code", "Code evaluator (whole agent)"],
  ["decision", "Decision model evaluator (YES / NO)"],
  ["judge", "LLM judge evaluator (correctness + tone)"],
  ["node", "Node evaluators (one step at a time)"],
];

export function saveReport(evaluator: string, rows: Row[], agent: string = AGENT_VERSION) {
  mkdirSync(new URL("results/", FOLDER), { recursive: true });
  const saved: Saved = { agent, evaluator, savedAt: new Date().toLocaleString(), rows };
  writeFileSync(new URL(`results/${agent}-${evaluator}.json`, FOLDER), JSON.stringify(saved, null, 2));
  writeFileSync(new URL("index.html", FOLDER), buildHtml());
  console.log(`\nReport: file://${fileURLToPath(new URL("index.html", FOLDER))}`);
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Building the page: a summary table, then one table per evaluator with a v1 column and a v2 column.
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const escape = (text = "") => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildHtml() {
  const folder = new URL("results/", FOLDER);
  const results: Saved[] = readdirSync(folder)
    .filter((name) => name.endsWith(".json"))
    .map((name) => JSON.parse(readFileSync(new URL(name, folder), "utf8")));
  const find = (agent: string, evaluator: string) => results.find((r) => r.agent === agent && r.evaluator === evaluator);

  // Summary: passed / total for every evaluator and agent
  const summaryRows = EVALUATORS.map(([id, title]) => {
    const cells = ["v1", "v2"].map((agent) => {
      const saved = find(agent, id);
      if (!saved) return `<td class="none">${id === "node" && agent === "v1" ? "n/a (tests v2's steps)" : "not run"}</td>`;
      const passed = saved.rows.filter((r) => r.pass).length;
      return `<td class="${passed === saved.rows.length ? "ok" : "bad"}">${passed} / ${saved.rows.length}</td>`;
    });
    return `<tr><td>${title}</td>${cells.join("")}</tr>`;
  }).join("");

  // One section per evaluator: a row per task, a cell per agent that you can click open
  const sections = EVALUATORS.map(([id, title]) => {
    const v1 = find("v1", id);
    const v2 = find("v2", id);
    const taskNames = [...new Set([...(v1?.rows ?? []), ...(v2?.rows ?? [])].map((r) => r.task))];
    const rows = taskNames
      .map((name) => {
        const kind = (v1?.rows ?? v2?.rows ?? []).find((r) => r.task === name)?.kind;
        const cell = (saved?: Saved) => {
          const row = saved?.rows.find((r) => r.task === name);
          if (!row) return `<td class="none">–</td>`;
          return `<td class="${row.pass ? "ok" : "bad"}"><details><summary>${row.pass ? "✅" : "❌"} ${escape(row.score)}</summary>${
            row.customer ? `<p><b>Customer</b><br>${escape(row.customer)}</p>` : ""
          }${row.reply ? `<p><b>Agent</b><br>${escape(row.reply)}</p>` : ""}${row.detail ? `<p><b>Why</b><br>${escape(row.detail)}</p>` : ""}</details></td>`;
        };
        return `<tr><td>${kind ? `<span class="kind">${escape(kind)}</span> ` : ""}${escape(name)}</td>${cell(v1)}${cell(v2)}</tr>`;
      })
      .join("");
    const savedAt = [v1, v2].filter(Boolean).map((r) => `${r!.agent}: ${r!.savedAt}`).join(" · ");
    return `<h2>${title}</h2><p class="when">${savedAt || "not run yet"}</p>
      <table><tr><th>Task</th><th>Agent v1</th><th>Agent v2</th></tr>${rows}</table>`;
  }).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Eval report</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 1100px; margin: 2rem auto; padding: 0 1rem; color: #1c1c1c; }
  h1 { margin-bottom: 0.2rem; } h2 { margin-top: 2.2rem; border-bottom: 2px solid #4a6fa5; padding-bottom: 0.2rem; }
  .when { color: #777; font-size: 0.85rem; margin: 0.2rem 0 0.6rem; }
  table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 0.45rem 0.6rem; vertical-align: top; text-align: left; }
  th { background: #f4f6fa; } td.ok { background: #eef8ee; } td.bad { background: #fdf0f0; } td.none { color: #999; background: #fafafa; }
  .kind { font-size: 0.72rem; font-weight: 700; color: #4a6fa5; text-transform: uppercase; letter-spacing: 0.04em; }
  summary { cursor: pointer; } details p { white-space: pre-wrap; margin: 0.5rem 0 0; font-size: 0.88rem; }
</style></head><body>
<h1>Eval report</h1>
<p class="when">Rebuilt after every eval run. Run v1 and v2 to fill both columns. Click a cell to see the customer's message, the agent's reply and why it passed or failed.</p>
<table><tr><th>Evaluator</th><th>Agent v1</th><th>Agent v2</th></tr>${summaryRows}</table>
${sections}
</body></html>`;
}
