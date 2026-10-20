import type Anthropic from "@anthropic-ai/sdk";
import { runTool, tools } from "../tools";
import { round2 } from "./dates";
import { checkGuardrails } from "./guardrails";
import { evaluateGates } from "./gates";
import { field } from "./model";
import { sameMerchant } from "./signals";
import type { ClaimContext, Verdict } from "./types";

// The tools only the investigator has, next to the read tools from src/tools. None of them can move money.

export type AgentState = {
  ctx: ClaimContext;
  findings: string[];
  verdict: Verdict | null;
};

const idProp = { type: "string" };

const FIND_SIMILAR: Anthropic.Tool = {
  name: "findSimilarClaims",
  description:
    "Search this employee's paid claims for ones that look like the current claim. Give any of merchant, date or amount.",
  input_schema: {
    type: "object",
    properties: {
      employeeId: idProp,
      merchant: { type: "string" },
      date: { type: "string", description: "YYYY-MM-DD" },
      amount: { type: "number" },
    },
    required: ["employeeId"],
  },
};

const CALCULATE: Anthropic.Tool = {
  name: "calculate",
  description:
    "Exact arithmetic for + - * / and parentheses, for example (219 + 26.28) * 2. Use it instead of doing sums yourself.",
  input_schema: {
    type: "object",
    properties: { expression: { type: "string" } },
    required: ["expression"],
  },
};

const RECORD_FINDING: Anthropic.Tool = {
  name: "recordFinding",
  description:
    "Write down one fact you verified (or failed to verify). The list becomes the audit trail.",
  input_schema: {
    type: "object",
    properties: { finding: { type: "string" } },
    required: ["finding"],
  },
};

const CHECK_GATES: Anthropic.Tool = {
  name: "checkApprovalGates",
  description:
    "Ask whether a draft decision would need a manager or Finance to sign. Call it before submitDecision.",
  input_schema: decisionSchema(),
};

export const SUBMIT_DECISION: Anthropic.Tool = {
  name: "submitDecision",
  description:
    "Report your final decision. This ends the investigation. Nothing is paid by this call.",
  input_schema: {
    type: "object",
    properties: {
      ...decisionSchema().properties,
      ruleIds: { type: "array", items: { type: "string" }, description: 'For example ["R3"]' },
      reasons: {
        type: "array",
        items: { type: "string" },
        description: "Short reasons, one per fact that mattered",
      },
    },
    required: ["decision", "payableAmount", "confidence", "ruleIds", "reasons"],
  },
};

function decisionSchema() {
  return {
    type: "object" as const,
    properties: {
      decision: { type: "string", enum: ["approve", "partial", "reject", "escalate"] },
      payableAmount: {
        type: "number",
        description:
          "What would be paid if cleared. For escalate: what Finance would pay if they clear it (0 if never).",
      },
      confidence: { type: "number", description: "0 to 1" },
    },
    required: ["decision", "payableAmount", "confidence"],
  };
}

export const agentToolSchemas = (readTools: Anthropic.Tool[]): Anthropic.Tool[] => [
  ...readTools,
  FIND_SIMILAR,
  CALCULATE,
  RECORD_FINDING,
  CHECK_GATES,
  SUBMIT_DECISION,
];

// ── Running a tool the model asked for ──────────────────────────────────

export function runAgentTool(name: string, input: unknown, state: AgentState): string {
  const args = (input ?? {}) as Record<string, unknown>;
  try {
    if (name === "findSimilarClaims") return JSON.stringify(findSimilar(args));
    if (name === "calculate") return String(calculate(field.string(args.expression, "expression")));
    if (name === "recordFinding")
      return recordFinding(state, field.string(args.finding, "finding"));
    if (name === "checkApprovalGates") return previewGates(state, toVerdict(args));
    if (name === "submitDecision") return submit(state, toVerdict(args));
    return runTool(name, input);
  } catch (err) {
    return `Error: ${(err as Error).message}`;
  }
}

function findSimilar(args: Record<string, unknown>) {
  const { merchant, date, amount } = args as { merchant?: string; date?: string; amount?: number };
  const past = tools.getPastClaims({ employeeId: field.string(args.employeeId, "employeeId") });
  return past.filter(
    (p) =>
      (merchant === undefined || sameMerchant(p.merchant, merchant)) &&
      (date === undefined || p.expenseDate === date) &&
      (amount === undefined || Math.abs(p.amount - amount) < 0.01),
  );
}

// Only digits and arithmetic characters ever reach Function
function calculate(expression: string): number {
  if (!/^[0-9+\-*/().\s]+$/.test(expression))
    throw new Error("only numbers and + - * / ( ) are allowed");
  return round2(Function(`"use strict"; return (${expression});`)() as number);
}

function recordFinding(state: AgentState, finding: string): string {
  state.findings.push(finding);
  return `Recorded (${state.findings.length} findings so far).`;
}

function previewGates(state: AgentState, verdict: Verdict): string {
  const hits = evaluateGates(gateContext(state, verdict));
  return hits.length === 0
    ? "No gate fires: this would be paid without a person."
    : `A person must sign:\n${hits.map((h) => `- ${h.id} (${h.reviewer}): ${h.reason}`).join("\n")}`;
}

// A valid decision ends the loop; an invalid one goes back to the model as an error
function submit(state: AgentState, verdict: Verdict): string {
  verdict.reasons = [...verdict.reasons, ...state.findings.map((f) => `Checked: ${f}`)];
  state.verdict = verdict;
  return "Decision received.";
}

export function gateContext(state: AgentState, verdict: Verdict) {
  return {
    decision: verdict.decision,
    payable: verdict.payable,
    confidence: verdict.confidence,
    flags: state.ctx.flags,
    path: "agent" as const,
    secondOpinionAgrees: null,
    inconclusive: false,
    guardrailProblems: checkGuardrails(verdict, state.ctx.claim, state.ctx.receipt),
  };
}

function toVerdict(args: Record<string, unknown>): Verdict {
  return {
    decision: field.oneOf(args.decision, "decision", [
      "approve",
      "partial",
      "reject",
      "escalate",
    ] as const),
    payable: round2(field.number(args.payableAmount, "payableAmount")),
    confidence: field.rate(args.confidence, "confidence"),
    ruleIds:
      args.ruleIds === undefined
        ? []
        : field.array(args.ruleIds, "ruleIds").map((r) => field.string(r, "ruleIds")),
    reasons:
      args.reasons === undefined
        ? []
        : field.array(args.reasons, "reasons").map((r) => field.string(r, "reasons")),
  };
}
