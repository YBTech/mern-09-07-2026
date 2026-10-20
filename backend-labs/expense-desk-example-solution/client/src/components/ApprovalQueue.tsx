import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { money } from "../format";
import type { ReviewItem } from "../types";
import ReceiptView from "./ReceiptView";

type Props = { onChanged: () => void };

// Claims waiting for a manager or Finance: the AI's summary, why it stopped, and Approve / Reject
export default function ApprovalQueue({ onChanged }: Props) {
  const [items, setItems] = useState<ReviewItem[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .reviewQueue()
      .then(setItems)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  function changed() {
    load();
    onChanged();
  }

  if (!items) return <section className="detail">Loading…</section>;
  return (
    <section className="queue">
      <h2>Review queue ({items.length})</h2>
      {error && <p className="error">{error}</p>}
      {items.length === 0 && <p className="muted">Nothing is waiting for a person.</p>}
      {items.map((item) => (
        <ReviewCard key={item.claim.id} item={item} onChanged={changed} />
      ))}
    </section>
  );
}

function ReviewCard({ item, onChanged }: { item: ReviewItem; onChanged: () => void }) {
  const { claim, employee, result } = item;
  const { review } = result;
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function decide(action: "approve" | "reject") {
    setBusy(true);
    setError("");
    try {
      await (action === "approve" ? api.approve(claim.id, note) : api.reject(claim.id, note));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      onChanged();
    }
  }

  const who =
    review.reviewer === "manager"
      ? `Manager${review.reviewerName ? `: ${review.reviewerName}` : ""}`
      : "Finance";

  return (
    <div className="card review">
      <div className="row">
        <strong>
          {claim.id} · {employee?.name ?? claim.employeeId} · {money(claim.amount)}
        </strong>
        <span className={`chip chip-${review.reviewer}`}>{who}</span>
      </div>
      <p>{result.summary}</p>
      <ul className="gates">
        {review.gates.map((g) => (
          <li key={g.id}>
            <strong>{g.title}.</strong> {g.reason}
          </li>
        ))}
      </ul>
      {result.flags && result.flags.length > 0 && (
        <ul className="flags">
          {result.flags.map((f) => (
            <li key={f.id} className={`flag-${f.severity}`}>
              {f.message}
            </li>
          ))}
        </ul>
      )}
      <details>
        <summary>Receipt and note</summary>
        <p className="muted">{claim.note}</p>
        <ReceiptView text={claim.receiptText} image={item.receiptImage} />
      </details>
      <label>
        Note (optional)
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <div className="actions">
        <button
          onClick={() => decide("approve")}
          disabled={busy || review.proposedAmount <= 0}
          title={review.proposedAmount <= 0 ? "Nothing would be paid: reject to close it" : ""}
        >
          Approve · send {money(review.proposedAmount)} to Finance
        </button>
        <button className="secondary" onClick={() => decide("reject")} disabled={busy}>
          Reject
        </button>
      </div>
    </div>
  );
}
