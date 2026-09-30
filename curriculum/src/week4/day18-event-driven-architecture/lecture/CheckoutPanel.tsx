import { useEffect, useRef, useState } from "react";
import { PRODUCTS, fetchDownstream, placeOrder } from "./api";
import type { Mode, Step } from "./api";

type TrackedOrder = {
  id: string;
  startedAt: number; // performance.now() when the button was pressed
  waitMs: number; // how long the customer waited for the reply
  steps: Step[]; // the downstream work this order should trigger
  done: Partial<Record<Step, number>>; // step → ms after the click that it was seen finished
};

const STEP_LABEL: Record<Step, string> = {
  inventory: "Inventory reserved",
  email: "Confirmation email",
  loyalty: "Loyalty points",
};

const fmt = (ms: number) => `${Math.round(ms).toLocaleString("en-US")} ms`;

const COPY: Record<Mode, { title: string; endpoint: string; how: string }> = {
  sync: {
    title: "Synchronous",
    endpoint: "POST /orders/sync",
    how: "Orders calls Inventory, then Notifications, over HTTP. It waits for every answer before replying.",
  },
  async: {
    title: "Asynchronous",
    endpoint: "POST /orders",
    how: "Orders saves the order, publishes an OrderPlaced event to RabbitMQ, and replies. Everyone else reacts on their own time.",
  },
};

// After an order (and again once its downstream work has finished) the panel asks the page to
// re-check the status bar, so the stock line moves. `onSettled` is how it does that.
type Props = { mode: Mode; loyaltyUp: boolean; onSettled: () => void };

// Stop asking after this long. An order whose email never goes out (Notifications is down)
// would otherwise keep the page polling forever.
const GIVE_UP_AFTER_MS = 30_000;
const POLL_EVERY_MS = 150;

export default function CheckoutPanel({ mode, loyaltyUp, onSettled }: Props) {
  const [sku, setSku] = useState<string>(PRODUCTS[0].sku);
  const [waiting, setWaiting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const ticker = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(ticker.current), []);

  // Press the button → start a stopwatch → send the request → stop it when the reply lands.
  // That stopwatch is the whole point: it's how long a real customer would stare at a spinner.
  async function place() {
    const startedAt = performance.now();
    setWaiting(true);
    setError(null);
    setElapsed(0);
    ticker.current = window.setInterval(() => setElapsed(performance.now() - startedAt), 50);

    const result = await placeOrder(mode, sku);

    window.clearInterval(ticker.current);
    const waitMs = performance.now() - startedAt;
    setElapsed(waitMs);
    setWaiting(false);

    onSettled();
    if (!result.ok) {
      setError(`Checkout failed after ${fmt(waitMs)}: ${result.error}`);
      return;
    }

    // Sync only replies once Inventory and Notifications have both finished, so they
    // are done by definition. Async has only queued the work: we go and watch for it.
    const steps: Step[] = mode === "async" && loyaltyUp ? ["inventory", "email", "loyalty"] : ["inventory", "email"];
    const done: TrackedOrder["done"] = mode === "sync" ? { inventory: waitMs, email: waitMs } : {};
    const order: TrackedOrder = { id: result.orderId, startedAt, waitMs, steps, done };
    setOrders((prev) => [order, ...prev].slice(0, 6));
  }

  async function placeFive() {
    for (let i = 0; i < 5; i++) await place();
  }

  // While any order still has unfinished downstream work, ask the services what they've done.
  // Times shown for these steps are "first noticed", accurate to about the polling interval.
  const pending = orders.some((o) => o.steps.some((s) => o.done[s] === undefined));
  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending) onSettled(); // the last chip just turned ✓
    wasPending.current = pending;
  }, [pending, onSettled]);

  // Re-runs when a new order is added (orders.length), so each order gets its own 30 seconds.
  useEffect(() => {
    if (!pending) return;
    let cancelled = false;
    let asked = 0;
    const poll = async () => {
      const seen = await fetchDownstream();
      if (cancelled) return;
      const now = performance.now();
      setOrders((prev) =>
        prev.map((o) => {
          const done = { ...o.done };
          for (const step of o.steps) {
            if (done[step] === undefined && seen[step]?.includes(o.id)) done[step] = now - o.startedAt;
          }
          return { ...o, done };
        }),
      );
    };
    const id = window.setInterval(() => {
      if (++asked * POLL_EVERY_MS > GIVE_UP_AFTER_MS) {
        window.clearInterval(id);
        return;
      }
      void poll();
    }, POLL_EVERY_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [pending, orders.length]);

  const latest = orders[0];
  const copy = COPY[mode];

  return (
    <div className={`co-panel is-${mode}`}>
      <h2>{copy.title}</h2>
      <p className="co-endpoint">
        <code>{copy.endpoint}</code>
      </p>
      <p className="co-how">{copy.how}</p>

      <div className="co-form">
        <select value={sku} onChange={(e) => setSku(e.target.value)} disabled={waiting} aria-label="Product">
          {PRODUCTS.map((p) => (
            <option key={p.sku} value={p.sku}>
              {p.name} · ${p.price}
            </option>
          ))}
        </select>
        <button className="send-btn" onClick={place} disabled={waiting}>
          Place order
        </button>
        <button className="co-secondary" onClick={placeFive} disabled={waiting}>
          Place 5 in a row
        </button>
      </div>

      <div className="co-timer" aria-live="polite">
        {waiting && (
          <>
            <div className="co-time is-waiting">{fmt(elapsed)}</div>
            <div className="co-caption">
              <span className="spinner" aria-hidden="true" /> the customer is waiting…
            </div>
          </>
        )}
        {!waiting && error && (
          <div className="co-error" role="alert">
            {error}
          </div>
        )}
        {!waiting && !error && latest && (
          <>
            <div className={`co-time is-${mode}`}>{fmt(latest.waitMs)}</div>
            <div className="co-caption">the customer waited for the reply</div>
          </>
        )}
        {!waiting && !error && !latest && <div className="co-caption">Press “Place order” and watch the clock.</div>}
      </div>

      {orders.length > 0 && (
        <ul className="co-orders">
          {orders.map((o) => (
            <li key={o.id} className="co-order">
              <div className="co-order-head">
                <span>{o.id}</span>
                <span>replied in {fmt(o.waitMs)}</span>
              </div>
              <div className="co-steps">
                {o.steps.map((step) => {
                  const at = o.done[step];
                  return at === undefined ? (
                    <span key={step} className="co-step is-pending">
                      ⏳ {STEP_LABEL[step]}
                    </span>
                  ) : (
                    <span key={step} className="co-step is-done">
                      ✓ {STEP_LABEL[step]}
                      {mode === "async" && ` · ~${fmt(at)}`}
                    </span>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
