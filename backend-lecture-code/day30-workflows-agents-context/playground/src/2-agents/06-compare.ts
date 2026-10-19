import { runRouter } from "../1-workflows/02-router";
import { runSupportAgent } from "./05-agent-loop";
import { checkHardReply, EASY_REFUND, HARD } from "../lib/support";
import { bold, dim, title } from "../lib/log";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: workflow vs agent, measured
// ════════════════════════════════════════════════════════════════════════════════════════════════

const RUNS = 3; // same model, same facts: only the approach changes

async function compareApproaches() {
  const rows: Row[] = [];

  // 1. the router workflow (step 02) and the agent (step 05) on the same emails, several times each
  for (const [request, email] of [["easy", EASY_REFUND], ["hard", HARD]] as const) {
    for (let run = 1; run <= RUNS; run++) {
      const workflow = await runRouter(email, true);
      rows.push(toRow(request, "workflow", run, workflow));

      const agent = await runSupportAgent(email, true);
      rows.push(toRow(request, "agent", run, agent));
    }
  }

  // 2. print every run
  printRuns(rows);

  // 3. summarise what we can measure: tokens, how many different paths, points covered
  printSummary(rows);

  console.log(bold("\nWhat to notice"));
  console.log("  workflow: the path is fixed, so it is cheap and easy to test, but it only covers what we planned for.");
  console.log("  agent:    it costs several times more tokens and its path is not written down anywhere, but it covers what we did not plan.");
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

type Row = { request: string; approach: string; run: number; calls: number; tokens: number; ms: number; covered: string; steps: string };
type RunResult = { reply: string; path: string[]; modelCalls: number; inputTokens: number; outputTokens: number; ms: number };

function toRow(request: string, approach: string, run: number, r: RunResult): Row {
  return { request, approach, run, calls: r.modelCalls, tokens: r.inputTokens + r.outputTokens, ms: r.ms, covered: score(request, r.reply), steps: r.path.join(">") };
}

// Only the hard request has a checklist; the easy one has a single obvious answer
function score(request: string, reply: string) {
  if (request === "easy") return "-";
  const checks = checkHardReply(reply);
  return `${checks.filter((c) => c.ok).length}/${checks.length}`;
}

function printRuns(rows: Row[]) {
  title(`${RUNS} runs of each approach on each request`);
  console.log(dim(`easy: ${EASY_REFUND}`));
  console.log(dim(`hard: ${HARD}`));
  console.table(rows.map((r) => ({ ...r, steps: r.steps.slice(0, 48) })));
}

function printSummary(rows: Row[]) {
  title("Summary (computed from the runs above)");
  for (const request of ["easy", "hard"]) {
    for (const approach of ["workflow", "agent"]) {
      const mine = rows.filter((r) => r.request === request && r.approach === approach);
      const tokens = mine.map((r) => r.tokens);
      const paths = new Set(mine.map((r) => r.steps)).size;
      console.log(
        `  ${request.padEnd(5)} ${approach.padEnd(9)} tokens ${Math.min(...tokens)}-${Math.max(...tokens)}   ` +
          `${paths} different path${paths === 1 ? "" : "s"} in ${RUNS} runs   points covered: ${mine.map((r) => r.covered).join(" ")}`,
      );
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await compareApproaches();
