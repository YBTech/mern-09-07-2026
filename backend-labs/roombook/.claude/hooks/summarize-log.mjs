// Instructor tool: node .claude/hooks/summarize-log.mjs [path/to/session-log.jsonl]
// Prints how the student worked: prompts, tools, edits vs test runs, blocked ticket reads.
import { existsSync, readFileSync } from "node:fs";

const file = process.argv[2] ?? new URL("../session-log.jsonl", import.meta.url).pathname;
if (!existsSync(file)) {
  console.log("No session log yet. Use Claude Code or Codex in this folder first.");
  process.exit(0);
}
const rows = readFileSync(file, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const prompts = rows.filter((r) => r.event === "UserPromptSubmit");
const tools = rows.filter((r) => r.event === "PostToolUse");
const edits = tools.filter((r) => ["Edit", "Write", "MultiEdit", "apply_patch"].includes(r.tool));
const tests = tools.filter((r) => r.tool === "Bash" && /vitest|npm (run )?test/.test(r.target));
const blocked = rows.filter((r) => r.event === "blocked");
const minutes = (a, b) => Math.round((new Date(b) - new Date(a)) / 60000);

console.log(`Prompts: ${prompts.length}   Tool calls: ${tools.length}`);
console.log(`File edits: ${edits.length}   Test runs: ${tests.length}`);
console.log(`Approvals (GO:): ${rows.filter((r) => r.event === "approval").length}`);
console.log(
  `Edits blocked for no approval: ${blocked.filter((r) => r.reason === "no-approval").length}`,
);
if (rows.length > 1) console.log(`Span: ${minutes(rows[0].ts, rows.at(-1).ts)} min`);
const firstEdit = edits[0];
const testsBefore = firstEdit ? tests.filter((t) => t.ts < firstEdit.ts).length : 0;
console.log(`Tests run before the first edit: ${testsBefore}`);
console.log(`Edited files: ${[...new Set(edits.map((e) => e.target))].join(", ") || "none"}`);
console.log(`\nPrompts (first 120 chars):`);
prompts.forEach((p, i) =>
  console.log(`${String(i + 1).padStart(2)}. ${p.prompt.replace(/\s+/g, " ").slice(0, 120)}`),
);
