import { DECISION_LABELS, STATUS_LABELS } from "../format";
import type { ClaimStatus, Decision } from "../types";

// One coloured pill: where the claim is now. A paid claim shows what the AI decided.
export default function DecisionBadge({
  decision,
  status,
}: {
  decision: Decision | null;
  status: ClaimStatus;
}) {
  if (status === "payout_recorded" && decision)
    return <span className={`badge badge-${decision}`}>{DECISION_LABELS[decision]}</span>;
  return <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>;
}
