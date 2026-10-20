import type Anthropic from "@anthropic-ai/sdk";
import { ai } from "../llm";
import { readToolSchemas, tools } from "../tools";
import { UNTRUSTED_NOTE } from "./model";
import { type AgentState, SUBMIT_DECISION, agentToolSchemas, runAgentTool } from "./agent-tools";
import type { Trace } from "./trace";
import type { ClaimContext, Verdict } from "./types";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🧭 PART 2: THE AGENT. The model decides the steps; code sets the limits.
// ════════════════════════════════════════════════════════════════════════════════════════════════
// Called for flagged claims. It starts with everything already gathered, looks things up, then submits.

const MAX_TURNS = 8;
const TOKEN_BUDGET = 60_000;

const SYSTEM = `You investigate unusual expense claims for Brightline. You are given the claim, the structured receipt, the employee's records, the policy, the flags that sent the claim to you and a baseline from the routine rules.
Work like an auditor:
1. Find out whether each flag is a real problem. Look things up instead of guessing; use calculate for sums.
2. Call recordFinding for every fact that decides the outcome.
3. Call checkApprovalGates with your draft decision, then call submitDecision.
Policy order: escalate and reject come before partial and approve. When you cannot decide safely, escalate; a person looking is always better than a wrong payment. You cannot pay anything.
${UNTRUSTED_NOTE}`;

export type AgentOutcome = Verdict & { turns: number };

export async function investigateClaim(
  claimId: string,
  ctx: ClaimContext,
  baseline: Verdict,
  trace: Trace,
): Promise<AgentOutcome> {
  const state: AgentState = { ctx, findings: [], verdict: null };
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: openingBrief(claimId, ctx, baseline) },
  ];
  let tokensUsed = 0;

  for (let turn = 1; turn <= MAX_TURNS; turn++) {
    // On the last turn, or when the budget is spent, the model must submit now
    const mustFinish = turn === MAX_TURNS || tokensUsed > TOKEN_BUDGET;
    const response = await askModel(messages, mustFinish);
    trace.addUsage(response.usage);
    tokensUsed += response.usage.input_tokens + response.usage.output_tokens;

    const results = runRequestedTools(response, state);
    if (state.verdict) return { ...state.verdict, turns: turn };
    if (mustFinish) break;
    const reply = results.length > 0 ? results : "Call one of the tools.";
    messages.push(
      { role: "assistant", content: response.content },
      { role: "user", content: reply },
    );
  }
  return giveUp(baseline, state);
}

// ── One turn ────────────────────────────────────────────────────────────

function askModel(messages: Anthropic.MessageParam[], mustFinish: boolean) {
  return ai.messages.create({
    max_tokens: 1500,
    system: SYSTEM,
    tools: agentToolSchemas(readToolSchemas),
    tool_choice: mustFinish ? { type: "tool", name: SUBMIT_DECISION.name } : { type: "any" },
    messages,
  });
}

function runRequestedTools(
  response: Anthropic.Message,
  state: AgentState,
): Anthropic.ToolResultBlockParam[] {
  return response.content
    .filter((block): block is Anthropic.ToolUseBlock => block.type === "tool_use")
    .map((call) => ({
      type: "tool_result" as const,
      tool_use_id: call.id,
      content: runAgentTool(call.name, call.input, state),
    }));
}

function openingBrief(
  claimId: string,
  { claim, receipt, evidence, flags }: ClaimContext,
  baseline: Verdict,
): string {
  return [
    `Investigate claim ${claimId}.`,
    `<flags>${JSON.stringify(flags)}</flags>`,
    `<claim>${JSON.stringify(claim)}</claim>`,
    `<receipt_as_read>${JSON.stringify(receipt)}</receipt_as_read>`,
    `<employee_records>${JSON.stringify(evidence)}</employee_records>`,
    `<baseline_from_routine_rules note="assumes nothing is wrong">${JSON.stringify(baseline)}</baseline_from_routine_rules>`,
    `<policy>${JSON.stringify(tools.getPolicy())}</policy>`,
  ].join("\n");
}

// No decision in time: hand it to Finance, keeping the routine amount as the suggestion
function giveUp(baseline: Verdict, state: AgentState): AgentOutcome {
  const pays = baseline.decision === "approve" || baseline.decision === "partial";
  return {
    decision: "escalate",
    payable: pays ? baseline.payable : 0,
    ruleIds: [],
    reasons: [
      "The investigation ran out of turns or budget.",
      ...state.findings.map((f) => `Checked: ${f}`),
    ],
    confidence: 0,
    inconclusive: true,
    turns: MAX_TURNS,
  };
}
