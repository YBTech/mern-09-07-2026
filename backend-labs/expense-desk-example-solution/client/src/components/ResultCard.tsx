import { money } from "../format";
import type { ClaimResult, Payment, PayoutRequest } from "../types";
import DecisionBadge from "./DecisionBadge";
import RunTimeline from "./RunTimeline";

type Props = { result: ClaimResult; payments: Payment[]; payout: PayoutRequest | null };

const PATH_LABELS = { "hard-rule": "Hard rule", workflow: "Workflow", agent: "Agent" };

// What the AI decided, why, and what happened after (review, hand-off to Finance)
export default function ResultCard({ result, payments, payout }: Props) {
  const { review } = result;
  return (
    <div className="card result">
      <div className="row">
        <DecisionBadge decision={result.decision} status="payout_recorded" />
        <strong>{money(review ? review.proposedAmount : result.approvedAmount)}</strong>
        {result.path && <span className="chip">{PATH_LABELS[result.path]}</span>}
        {result.confidence !== undefined && (
          <span className="muted">confidence {result.confidence.toFixed(2)}</span>
        )}
        {result.ruleIds.length > 0 && (
          <span className="muted">Rules: {result.ruleIds.join(", ")}</span>
        )}
      </div>
      <p>{result.summary}</p>

      {review && (
        <div className="review-note">
          {review.resolution
            ? `${review.resolution.action === "approve" ? "Approved" : "Rejected"} by the reviewer${review.resolution.note ? `: ${review.resolution.note}` : ""}.`
            : `Waiting for ${review.reviewer === "manager" ? `the manager${review.reviewerName ? ` (${review.reviewerName})` : ""}` : "Finance"}. Nothing has been sent to Finance's system.`}
          <ul>
            {review.gates.map((g) => (
              <li key={g.id}>
                <strong>{g.title}.</strong> {g.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.flags && result.flags.length > 0 && (
        <ul className="flags">
          {result.flags.map((f) => (
            <li key={f.id} className={`flag-${f.severity}`}>
              {f.message}
            </li>
          ))}
        </ul>
      )}

      {result.emailToEmployee && (
        <details>
          <summary>Email to the employee</summary>
          <p className="email">{result.emailToEmployee}</p>
        </details>
      )}
      {result.trace && <RunTimeline steps={result.trace} />}

      <p className="muted">
        Finance hand-off:{" "}
        {payout
          ? `${payout.id} ${payout.status}${payout.lastError ? ` (${payout.lastError})` : ""}, ${payout.attempts} attempt(s)`
          : "none"}
        {payments.length > 0 &&
          ` · recorded as ${payments.map((p) => `${p.id} ${money(p.amount)}`).join(", ")}`}
      </p>
    </div>
  );
}
