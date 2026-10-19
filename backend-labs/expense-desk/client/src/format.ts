import type { Decision } from "./types";

export const money = (n: number) => `$${n.toFixed(2)}`;

export const DECISION_LABELS: Record<Decision, string> = {
  approve: "Approved",
  partial: "Partly approved",
  reject: "Rejected",
  needs_approval: "Needs manager approval",
  escalate: "Sent to Finance",
};
