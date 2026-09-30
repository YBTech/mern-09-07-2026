import { useCallback, useEffect, useState } from "react";
import DayNav from "../../../components/DayNav";
import CheckoutPanel from "./CheckoutPanel";
import Workflow from "./Workflow";
import { PRODUCTS, SERVICES, fetchStatus, setEmailDelay } from "./api";
import type { Status } from "./api";

// Day 18 demo: the same checkout, placed twice.
//   left  — synchronous: Orders calls Inventory and Notifications over HTTP and waits
//   right — asynchronous: Orders publishes an OrderPlaced event to RabbitMQ and replies
// Backed by backend-lecture-code/day18-event-driven-architecture/rabbitmq-store
// (Kafka behaves the same from the browser's point of view, so it isn't wired in here).
const SLOW_MS = 3000;

export default function Lecture() {
  const [status, setStatus] = useState<Status | null>(null);

  const refresh = useCallback(async () => setStatus(await fetchStatus()), []);

  // No background polling: the status bar is checked once when the page opens, when the tab
  // regains focus, after every order, and when "Refresh" is pressed. Nothing runs on a timer.
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const latest = await fetchStatus();
      if (!cancelled) setStatus(latest);
    };
    const first = window.setTimeout(check, 0);
    window.addEventListener("focus", check);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
      window.removeEventListener("focus", check);
    };
  }, []);

  async function chooseDelay(ms: number) {
    await setEmailDelay(ms);
    await refresh();
  }

  const services: { name: string; port: number; up: boolean; optional?: boolean }[] = [
    { name: "orders", port: 4201, up: !!status?.orders },
    { name: "inventory", port: 4202, up: !!status?.inventory },
    { name: "notifications", port: 4203, up: !!status?.notifications },
    { name: "loyalty", port: 4204, up: !!status?.loyalty, optional: true },
  ];

  return (
    <div className="page lecture-page lecture-console">
      <title>Day 18 — Lecture Canvas</title>
      <DayNav day="day18-event-driven-architecture" current="lecture" />
      <h1>Day 18 — Lecture Canvas</h1>
      <p className="console-intro">
        The same checkout, placed two ways. Watch how long the customer waits, and what finishes after.
      </p>

      <Workflow />

      {status && !status.orders && (
        <div className="backend-banner is-down" role="alert">
          <span>
            Nothing is answering at {SERVICES.orders}. In <code>backend-lecture-code/day18-event-driven-architecture/rabbitmq-store</code>{" "}
            run <code>npm run infra:up</code>, then <code>npm run dev:all</code>.
          </span>
          <button onClick={() => void refresh()}>Retry</button>
        </div>
      )}

      <div className="co-status">
        {services.map((s) => (
          <span key={s.name} className={`co-pill ${s.up ? "" : s.optional ? "is-off" : "is-down"}`}>
            {s.name} :{s.port}
            {!s.up && s.optional && " — not started"}
            {!s.up && !s.optional && " — down"}
          </span>
        ))}
        <button className="co-refresh" onClick={() => void refresh()}>
          Refresh
        </button>
        {status?.stock && (
          <span className="co-stock">
            Stock: {PRODUCTS.map((p) => `${p.name} ${status.stock?.[p.sku] ?? "?"}`).join(" · ")}
          </span>
        )}
      </div>

      <div className="co-controls">
        <span className="co-controls-label">Email provider</span>
        <div className="co-seg" role="group" aria-label="Email provider speed">
          <button className={status?.slowMs === 0 ? "is-active" : ""} disabled={!status?.notifications} onClick={() => void chooseDelay(0)}>
            Fast
          </button>
          <button
            className={status?.slowMs === SLOW_MS ? "is-active" : ""}
            disabled={!status?.notifications}
            onClick={() => void chooseDelay(SLOW_MS)}
          >
            Slow ({SLOW_MS.toLocaleString("en-US")} ms)
          </button>
        </div>
      </div>

      <div className="co-grid">
        <CheckoutPanel mode="sync" loyaltyUp={!!status?.loyalty} onSettled={refresh} />
        <CheckoutPanel mode="async" loyaltyUp={!!status?.loyalty} onSettled={refresh} />
      </div>
    </div>
  );
}
