import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import ApprovalQueue from "./components/ApprovalQueue";
import ClaimDetail from "./components/ClaimDetail";
import ClaimList from "./components/ClaimList";
import FailedPayouts from "./components/FailedPayouts";
import NewClaimForm from "./components/NewClaimForm";
import type { Claim, ClaimSummary } from "./types";

type Tab = "inbox" | "queue" | "failed";
const PARALLEL_RUNS = 3;

export default function App() {
  const [claims, setClaims] = useState<ClaimSummary[]>([]);
  // ?claim=C04 in the URL opens that claim, so a link can point at one claim
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    new URLSearchParams(location.search).get("claim"),
  );
  const [tab, setTab] = useState<Tab>("inbox");
  const [version, setVersion] = useState(0); // bumped when a queue changes, so the open tab reloads
  const [showForm, setShowForm] = useState(false);
  const [outage, setOutage] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [error, setError] = useState("");

  const loadClaims = useCallback(() => {
    api
      .claims()
      .then(setClaims)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(loadClaims, [loadClaims]);

  useEffect(() => {
    api
      .financeOutage()
      .then((r) => setOutage(r.on))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    history.replaceState(null, "", selectedId ? `?claim=${selectedId}` : location.pathname);
  }, [selectedId]);

  function changed() {
    loadClaims();
    setVersion((v) => v + 1);
  }

  async function reset() {
    try {
      await api.reset();
      setSelectedId(null);
      setOutage(false);
      changed();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function toggleOutage(on: boolean) {
    try {
      setOutage((await api.setFinanceOutage(on)).on);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  // Run every new claim through the AI, a few at a time
  async function processAllNew() {
    setBatchRunning(true);
    const todo = claims.filter((c) => c.status === "new").map((c) => c.id);
    const worker = async () => {
      for (let id = todo.shift(); id; id = todo.shift()) {
        await api.processClaim(id).catch((err: Error) => setError(`${id}: ${err.message}`));
        changed();
      }
    };
    await Promise.all(Array.from({ length: PARALLEL_RUNS }, worker));
    setBatchRunning(false);
  }

  function created(claim: Claim) {
    setShowForm(false);
    setTab("inbox");
    changed();
    setSelectedId(claim.id);
  }

  const waiting = claims.filter((c) => c.status === "awaiting_review").length;
  const failed = claims.filter((c) => c.status === "payout_failed").length;

  return (
    <div className="app">
      <header className="top">
        <h1>Expense Desk</h1>
        <label className="switch" title="While on, Finance's system rejects every payout">
          <input
            type="checkbox"
            checked={outage}
            onChange={(e) => toggleOutage(e.target.checked)}
          />
          Simulate Finance outage
        </label>
        <button onClick={processAllNew} disabled={batchRunning}>
          {batchRunning ? "Processing…" : "Process all new"}
        </button>
        <button onClick={() => setShowForm(true)}>New claim</button>
        <button className="secondary" onClick={reset}>
          Reset data
        </button>
      </header>

      <nav className="tabs">
        <button className={tab === "inbox" ? "active" : ""} onClick={() => setTab("inbox")}>
          Inbox
        </button>
        <button className={tab === "queue" ? "active" : ""} onClick={() => setTab("queue")}>
          Review queue ({waiting})
        </button>
        <button className={tab === "failed" ? "active" : ""} onClick={() => setTab("failed")}>
          Failed payouts ({failed})
        </button>
      </nav>

      {error && (
        <p className="error" onClick={() => setError("")}>
          {error}
        </p>
      )}
      {showForm && <NewClaimForm onCreated={created} onCancel={() => setShowForm(false)} />}

      {tab === "queue" && <ApprovalQueue key={version} onChanged={changed} />}
      {tab === "failed" && <FailedPayouts key={version} onChanged={changed} />}
      {tab === "inbox" && (
        <main>
          <ClaimList claims={claims} selectedId={selectedId} onSelect={setSelectedId} />
          {selectedId ? (
            <ClaimDetail
              key={`${selectedId}-${version}`}
              claimId={selectedId}
              onChanged={changed}
            />
          ) : (
            <section className="detail empty">Pick a claim on the left.</section>
          )}
        </main>
      )}
    </div>
  );
}
