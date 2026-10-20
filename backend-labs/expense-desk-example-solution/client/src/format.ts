import type { ClaimStatus, Decision } from "./types";

export const money = (n: number) => `$${n.toFixed(2)}`;

export const DECISION_LABELS: Record<Decision, string> = {
  approve: "Approved",
  partial: "Partly approved",
  reject: "Rejected",
  needs_approval: "Needs manager approval",
  escalate: "Sent to Finance",
};

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  new: "New",
  rejected: "Rejected",
  awaiting_review: "Awaiting review",
  approved: "Payout queued",
  payout_recorded: "Sent to Finance",
  payout_failed: "Payout failed",
};
