import type { Decision, Flag, GateHit, Reviewer } from "../types";
import { money } from "./dates";
import type { DecisionPathName } from "./types";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🚦 THE BUSINESS SCENARIOS THAT NEED A PERSON. Edit this file to change when the AI must stop.
// ════════════════════════════════════════════════════════════════════════════════════════════════
// Each gate: an id, what it means, who signs, and a test that returns the reason (or null).

export const GATE_CONFIG = {
  managerLimit: 500, // R6: more than this to pay needs the manager
  nearLimitBand: 0.05, // a payout this close below the limit looks like threshold dodging
  minConfidence: 0.75, // below this the AI is not sure enough to pay on its own
  secondOpinionAbove: 200, // payouts above this get an independent second opinion
};

// Everything a gate may look at
export type GateContext = {
  decision: Decision; // what the AI proposes: approve | partial | reject | escalate
  payable: number; // what would be paid if everything is cleared
  confidence: number;
  flags: Flag[];
  path: DecisionPathName;
  secondOpinionAgrees: boolean | null; // null = not asked
  inconclusive: boolean; // the agent ran out of turns or budget
  guardrailProblems: string[];
};

type Gate = {
  id: string;
  title: string;
  reviewer: Reviewer;
  test: (ctx: GateContext) => string | null;
};

const GATES: Gate[] = [
  {
    id: "AMOUNT_OVER_LIMIT",
    title: "Over the manager limit (R6)",
    reviewer: "manager",
    test: (c) =>
      c.payable > GATE_CONFIG.managerLimit
        ? `${money(c.payable)} is more than ${money(GATE_CONFIG.managerLimit)}.`
        : null,
  },
  {
    id: "JUST_UNDER_LIMIT",
    title: "Just under the manager limit",
    reviewer: "manager",
    test: (c) => {
      const floor = GATE_CONFIG.managerLimit * (1 - GATE_CONFIG.nearLimitBand);
      return c.payable >= floor && c.payable <= GATE_CONFIG.managerLimit
        ? `${money(c.payable)} is within 5% below the limit.`
        : null;
    },
  },
  {
    id: "POLICY_ESCALATION",
    title: "Policy says send to Finance",
    reviewer: "finance",
    test: (c) =>
      c.decision === "escalate"
        ? "A rule or the AI sent this claim to Finance (R4, R7, R9 or doubt)."
        : null,
  },
  {
    id: "LOW_CONFIDENCE",
    title: "AI is not confident",
    reviewer: "finance",
    test: (c) =>
      c.payable > 0 && c.confidence < GATE_CONFIG.minConfidence
        ? `Confidence ${c.confidence.toFixed(2)} is below ${GATE_CONFIG.minConfidence}.`
        : null,
  },
  {
    id: "VERIFIER_DISAGREES",
    title: "Second opinion disagrees",
    reviewer: "finance",
    test: (c) =>
      c.secondOpinionAgrees === false ? "An independent review would not pay as proposed." : null,
  },
  {
    id: "AGENT_INCONCLUSIVE",
    title: "Agent could not conclude",
    reviewer: "finance",
    test: (c) =>
      c.inconclusive ? "The agent hit its turn or token limit without a clear decision." : null,
  },
  {
    id: "GUARDRAIL_VIOLATION",
    title: "Safety check failed",
    reviewer: "finance",
    test: (c) => (c.guardrailProblems.length > 0 ? c.guardrailProblems.join(" ") : null),
  },
  {
    id: "HIGH_RISK_SIGNAL",
    title: "High-risk signal on the claim",
    reviewer: "finance",
    test: (c) => {
      const high = c.flags.filter((f) => f.severity === "high");
      return c.payable > 0 && high.length > 0 ? high.map((f) => f.message).join(" ") : null;
    },
  },
];

// A rejection pays nothing, so it never needs a person
export function evaluateGates(ctx: GateContext): GateHit[] {
  if (ctx.decision === "reject") return [];
  return GATES.flatMap((gate) => {
    const reason = gate.test(ctx);
    return reason ? [{ id: gate.id, title: gate.title, reviewer: gate.reviewer, reason }] : [];
  });
}

// Finance can do everything a manager can, so one finance gate makes Finance the reviewer
export function pickReviewer(hits: GateHit[]): Reviewer | null {
  if (hits.length === 0) return null;
  return hits.some((h) => h.reviewer === "finance") ? "finance" : "manager";
}
