import type { Decision, GateHit, Reviewer } from "../types";
import { round2 } from "./dates";
import { evaluateGates, pickReviewer } from "./gates";
import { checkGuardrails } from "./guardrails";
import type { Trace } from "./trace";
import type { ClaimContext, DecisionPathName, Verdict } from "./types";
import { askSecondOpinion, needsSecondOpinion, type SecondOpinion } from "./verifier";

// Stage 6: check the proposed decision before anything happens: sanity rules, second opinion, approval gates.

export type Checked = {
  decision: Decision; // the proposal, or needs_approval / escalate when a person must sign
  payable: number; // what goes to Finance if cleared (never more than the claim or the receipt)
  hits: GateHit[];
  reviewer: Reviewer | null;
  opinion: SecondOpinion | null;
  problems: string[];
};

export async function checkBeforeActing(
  ctx: ClaimContext,
  verdict: Verdict,
  path: DecisionPathName,
  trace: Trace,
): Promise<Checked> {
  const problems = checkGuardrails(verdict, ctx.claim, ctx.receipt);
  const opinion = await maybeSecondOpinion(ctx, verdict, path, problems, trace);
  const hits = evaluateGates({
    decision: verdict.decision,
    payable: verdict.payable,
    confidence: verdict.confidence,
    flags: ctx.flags,
    path,
    secondOpinionAgrees: opinion ? opinion.agrees : null,
    inconclusive: Boolean(verdict.inconclusive),
    guardrailProblems: problems,
  });
  return {
    decision: finalDecision(verdict.decision, problems, hits),
    payable: clampPayable(verdict, ctx),
    hits,
    reviewer: pickReviewer(hits),
    opinion,
    problems,
  };
}

// A proposal that already broke a safety rule is not asked about again
function maybeSecondOpinion(
  ctx: ClaimContext,
  verdict: Verdict,
  path: DecisionPathName,
  problems: string[],
  trace: Trace,
) {
  if (problems.length > 0 || !needsSecondOpinion(verdict, path)) return Promise.resolve(null);
  return askSecondOpinion(ctx, verdict, trace);
}

function finalDecision(proposed: Decision, problems: string[], hits: GateHit[]): Decision {
  if (proposed === "reject") return "reject";
  if (problems.length > 0) return "escalate";
  if (hits.length > 0 && proposed !== "escalate") return "needs_approval";
  return proposed;
}

function clampPayable(verdict: Verdict, { claim, receipt }: ClaimContext): number {
  if (verdict.decision === "reject") return 0;
  const ceiling = Math.min(claim.amount, receipt.total ?? claim.amount);
  return round2(Math.min(Math.max(0, verdict.payable), ceiling));
}
