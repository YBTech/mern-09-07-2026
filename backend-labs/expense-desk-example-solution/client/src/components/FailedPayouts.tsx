import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { money } from "../format";
import type { PayoutRequest } from "../types";

type Props = { onChanged: () => void };

// Approved claims that Finance's system did not accept. Finance fixes the cause and presses Retry.
export default function FailedPayouts({ onChanged }: Props) {
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .failedPayouts()
      .then(setPayouts)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  async function retry(id: string) {
    setError("");
    try {
      await api.retryPayout(id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      load();
      onChanged();
    }
  }

  return (
    <section className="queue">
      <h2>Failed payouts ({payouts.length})</h2>
      {error && <p className="error">{error}</p>}
      {payouts.length === 0 && <p className="muted">Every approved claim reached Finance.</p>}
      {payouts.map((p) => (
        <div className="card" key={p.id}>
          <div className="row">
            <strong>
              {p.claimId} · {money(p.amount)}
            </strong>
            <span className="muted">
              {p.id}, {p.attempts} attempt(s)
            </span>
          </div>
          <p className="error-text">{p.lastError}</p>
          <div className="actions">
            <button onClick={() => retry(p.id)}>Retry</button>
          </div>
        </div>
      ))}
    </section>
  );
}
