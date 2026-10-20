import type Anthropic from "@anthropic-ai/sdk";
import { tools } from "../tools";
import { GATE_CONFIG } from "./gates";
import { UNTRUSTED_NOTE, callForced, field } from "./model";
import type { Trace } from "./trace";
import type { ClaimContext, DecisionPathName, Verdict } from "./types";

// Stage 6c: a second model call with a fresh context and no tools asks "would you pay this?".

const SYSTEM = `You are an independent auditor for an expense desk. You get a claim, the structured receipt, the employee's records and a proposed payment. Decide whether you would pay exactly this amount under the policy. Disagree if the amount, the rules cited or the evidence do not fit. Be brief.
${UNTRUSTED_NOTE}`;

const TOOL: Anthropic.Tool = {
  name: "recordOpinion",
  description: "Record whether you agree with the proposed payment.",
  input_schema: {
    type: "object",
    properties: {
      agrees: { type: "boolean" },
      concern: { type: "string", description: "One sentence; empty if you agree" },
    },
    required: ["agrees", "concern"],
  },
};

export type SecondOpinion = { agrees: boolean; concern: string };

// Only worth the cost when the AI investigated, or when the payout is large
export function needsSecondOpinion(verdict: Verdict, path: DecisionPathName): boolean {
  const pays = verdict.decision === "approve" || verdict.decision === "partial";
  return pays && (path === "agent" || verdict.payable > GATE_CONFIG.secondOpinionAbove);
}

export function askSecondOpinion(
  ctx: ClaimContext,
  verdict: Verdict,
  trace: Trace,
): Promise<SecondOpinion> {
  return callForced({
    system: SYSTEM,
    content: opinionPrompt(ctx, verdict),
    tool: TOOL,
    validate: (input) => ({
      agrees: Boolean(input.agrees),
      concern: field.string(input.concern ?? "", "concern"),
    }),
    trace,
    maxTokens: 400,
  });
}

function opinionPrompt(
  { claim, receipt, evidence, flags }: ClaimContext,
  verdict: Verdict,
): string {
  return [
    `<policy>${JSON.stringify(tools.getPolicy())}</policy>`,
    `<claim>${JSON.stringify({ ...claim, receiptText: undefined })}</claim>`,
    `<receipt>${JSON.stringify(receipt)}</receipt>`,
    `<records>${JSON.stringify({ trips: evidence.trips, pastClaims: evidence.pastClaims })}</records>`,
    `<flags>${JSON.stringify(flags)}</flags>`,
    `<proposed>${JSON.stringify({ decision: verdict.decision, pay: verdict.payable, rules: verdict.ruleIds, reasons: verdict.reasons })}</proposed>`,
  ].join("\n");
}
