import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { money } from "../format";
import type { ClaimDetail as Detail } from "../types";
import ReceiptView from "./ReceiptView";
import ResultCard from "./ResultCard";

type Props = { claimId: string; onChanged: () => void };

// One claim: what was submitted, and the AI's decision
export default function ClaimDetail({ claimId, onChanged }: Props) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .claim(claimId)
      .then(setDetail)
      .catch((err: Error) => setError(err.message));
  }, [claimId]);

  useEffect(load, [load]);

  async function process() {
    setBusy(true);
    setError("");
    try {
      await api.processClaim(claimId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
      load();
      onChanged();
    }
  }

  if (!detail) return <section className="detail">Loading…</section>;
  const { claim, employee, result, payments, payout, receiptImage } = detail;
  const closed = !["new", "awaiting_review"].includes(claim.status);

  return (
    <section className="detail">
      <h2>
        {claim.id} · {money(claim.amount)}
      </h2>
      <dl className="facts">
        <dt>Employee</dt>
        <dd>
          {employee
            ? `${employee.name}, ${employee.title} (${employee.department})`
            : claim.employeeId}
        </dd>
        <dt>Expense date</dt>
        <dd>{claim.expenseDate}</dd>
        <dt>Submitted</dt>
        <dd>{claim.submittedAt}</dd>
        {claim.category && (
          <>
            <dt>Category</dt>
            <dd>{claim.category}</dd>
          </>
        )}
        <dt>Note</dt>
        <dd>{claim.note}</dd>
      </dl>
      <ReceiptView text={claim.receiptText} image={receiptImage} />

      <div className="actions">
        <button onClick={process} disabled={busy || closed}>
          {closed ? "Closed" : busy ? "Processing…" : result ? "Process again" : "Process with AI"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      {result && <ResultCard result={result} payments={payments} payout={payout} />}
    </section>
  );
}
