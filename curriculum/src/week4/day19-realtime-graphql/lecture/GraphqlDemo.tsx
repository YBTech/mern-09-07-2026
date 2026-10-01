import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import CodeBlock from "../../../components/CodeBlock";
import DayNav from "../../../components/DayNav";
import {
  ACCOUNT_QUERIES,
  NETWORKS,
  aggregatorUp,
  loadAccount,
  setNetwork,
  type AccountView,
  type Call,
  type Client,
  type Measured,
  type Mode,
  type Network,
  type OnCall,
} from "./graphqlApi";

// Day 19 demo, part 1: the "My Account" page, which needs four REST services,
// loaded three ways — the browser calling each service, a REST aggregation
// endpoint, and a GraphQL aggregation layer (a BFF) — on a fast or a slow network.
// Backend: backend-lecture-code/day19-realtime-graphql/graphql-store

const fmtMs = (ms: number) => `${Math.round(ms).toLocaleString("en-US")} ms`;
const fmtKb = (bytes: number) => (bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`);
const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

// ════════════════════════════════════════════════════════════════════════════
// Loading: a stopwatch, every request as it lands, and the result
// ════════════════════════════════════════════════════════════════════════════
type LoadState<T> = {
  status: "idle" | "loading" | "done" | "error";
  elapsed: number;
  calls: Call[];
  result: Measured<T> | null;
  error: string | null;
};

function useLoader<T>() {
  const [state, setState] = useState<LoadState<T>>({ status: "idle", elapsed: 0, calls: [], result: null, error: null });
  const run = useRef(0); // ignore a slow load that finishes after a newer one started
  const ticker = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(ticker.current), []);

  async function load(fetcher: (onCall: OnCall) => Promise<Measured<T>>) {
    const id = ++run.current;
    const started = performance.now();
    window.clearInterval(ticker.current);
    // Start clean: the old page disappears, so you see the whole load happen.
    setState({ status: "loading", elapsed: 0, calls: [], result: null, error: null });
    ticker.current = window.setInterval(() => {
      if (run.current === id) setState((s) => ({ ...s, elapsed: performance.now() - started }));
    }, 40);

    const onCall: OnCall = (call) => {
      if (run.current === id) setState((s) => ({ ...s, calls: [...s.calls, call] }));
    };
    try {
      const result = await fetcher(onCall);
      if (run.current !== id) return;
      setState((s) => ({ ...s, status: "done", result, elapsed: performance.now() - started }));
    } catch (err) {
      if (run.current !== id) return;
      setState((s) => ({ ...s, status: "error", error: (err as Error).message, elapsed: performance.now() - started }));
    } finally {
      if (run.current === id) window.clearInterval(ticker.current);
    }
  }

  return { state, load };
}

/** The numbers, plus one bar per request on a shared timeline: the waterfall. */
function Metrics({ state }: { state: LoadState<unknown> }) {
  const { status, elapsed, calls, result } = state;
  const bytes = calls.reduce((sum, c) => sum + c.bytes, 0);
  const span = Math.max(elapsed, ...calls.map((c) => c.start + c.ms), 1);

  return (
    <div className="gq-metricbar">
      <div className="gq-metrics">
        <div>
          <span className={`gq-big ${status === "loading" ? "is-running" : ""}`}>{status === "idle" ? "—" : fmtMs(elapsed)}</span>
          <span className="gq-label">{status === "loading" ? "loading…" : "until the page could render"}</span>
        </div>
        <div>
          <span className="gq-big">{status === "idle" ? "—" : calls.length}</span>
          <span className="gq-label">requests from the browser</span>
        </div>
        <div>
          <span className="gq-big">{status === "idle" ? "—" : fmtKb(result?.bytes ?? bytes)}</span>
          <span className="gq-label">downloaded</span>
        </div>
      </div>
      <div className="net" aria-label="Network waterfall">
        {calls.length === 0 && <span className="net-empty">{status === "loading" ? "waiting for the first response…" : "requests will appear here"}</span>}
        {calls.map((c, i) => (
            <div key={i} className="net-row">
              <span className="net-label">
                {c.service} <code>{c.path.length > 34 ? `${c.path.slice(0, 33)}…` : c.path}</code>
              </span>
              <span className="net-track">
                <span className={`net-bar is-${c.service}`} style={{ left: `${(c.start / span) * 100}%`, width: `${Math.max((c.ms / span) * 100, 0.8)}%` }} />
              </span>
              <span className="net-size">{fmtKb(c.bytes)}</span>
            </div>
          ))}
      </div>
      {state.error && (
        <p className="gq-error" role="alert">
          {state.error}
        </p>
      )}
    </div>
  );
}

function Seg<K extends string>({ value, options, onPick, disabled }: { value: K | null; options: [K, string][]; onPick: (k: K) => void; disabled?: boolean }) {
  return (
    <div className="co-seg" role="group">
      {options.map(([k, label]) => (
        <button key={k} className={value === k ? "is-active" : ""} onClick={() => onPick(k)} disabled={disabled}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <div className="ui-loading">
      <span className="spinner spinner-lg" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="ui-tag">{children}</span>;
}

function Thumb({ name }: { name: string }) {
  return <span className="ui-thumb">{name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}</span>;
}

const statusLabel = (s: string) => s.replace(/_/g, " ");
const shortDate = (iso?: string | null) => (iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "");

// ════════════════════════════════════════════════════════════════════════════
// Part 1 — My Account
// ════════════════════════════════════════════════════════════════════════════
function AccountWeb({ data }: { data: AccountView }) {
  return (
    <div className="acct">
      <div className="acct-left">
        <section className="ui-card">
          <Tag>users</Tag>
          <h4>{data.name}</h4>
          {data.email && <p className="ui-muted">{data.email}</p>}
          {data.tier && <p className="ui-muted">{data.tier[0].toUpperCase() + data.tier.slice(1)} member</p>}
        </section>
        <section className="ui-card">
          <Tag>reviews</Tag>
          <h4>Your reviews</h4>
          <ul className="acct-reviews">
            {data.reviews.map((r, i) => (
              <li key={i}>
                {r.rating !== undefined && <span className="ui-stars">{stars(r.rating)}</span>} {r.title}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="ui-card acct-orders">
        <Tag>orders · shipping</Tag>
        <h4>Recent orders</h4>
        <ul>
          {data.orders.map((o) => (
            <li key={o.id}>
              <Thumb name={o.items[0]?.name ?? "?"} />
              <div className="acct-order-main">
                <strong>
                  {o.items[0]?.name}
                  {o.items.length > 1 && <span className="ui-muted"> + {o.items.length - 1} more</span>}
                </strong>
                <span className="ui-muted">
                  {o.total !== undefined && `$${o.total} · `}
                  {o.id}
                </span>
              </div>
              <span className={`ui-pill is-${o.status}`}>
                {statusLabel(o.status)}
                {o.status === "in_transit" && o.eta && ` · arrives ${shortDate(o.eta)}`}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AccountMobile({ data }: { data: AccountView }) {
  return (
    <div className="acct-mobile">
      <p className="acct-mobile-hi">Hi, {data.name.split(" ")[0]}</p>
      <h4>Your orders</h4>
      <ul>
        {data.orders.map((o) => (
          <li key={o.id}>
            <Thumb name={o.items[0]?.name ?? "?"} />
            <span className="acct-mobile-name">{o.items.map((i) => i.name).join(", ")}</span>
            <span className={`ui-pill is-${o.status}`}>{statusLabel(o.status)}</span>
          </li>
        ))}
      </ul>
      <p className="acct-mobile-link">Your reviews ({data.reviews.length}) ›</p>
    </div>
  );
}

const ACCOUNT_CODE: Record<Mode, string> = {
  direct: `// Wave 1: only needs the customer id
const [user, orders, reviews] = await Promise.all([
  fetch(\`\${USERS}/users/c-1\`).then((r) => r.json()),
  fetch(\`\${ORDERS}/orders?customerId=c-1&limit=4\`).then((r) => r.json()), // items included
  fetch(\`\${REVIEWS}/reviews?authorId=c-1\`).then((r) => r.json()),
]);

// Wave 2: needs the order ids from wave 1, so it has to wait
const ids = orders.map((o) => o.id).join(",");
const shipments = await fetch(\`\${SHIPPING}/shipments?orderIds=\${ids}\`).then((r) => r.json());

// …then stitch it all together, in every client (web, iOS, Android)`,
  rest: `// Browser: one request
const page = await fetch(\`\${AGGREGATOR}/dashboard/c-1\`).then((r) => r.json());

// Aggregator: the same two waves, next to the services (~1 ms per hop),
// and the same whole objects for every client, mobile included
app.get("/dashboard/:customerId", async (req, res) => {
  const [customer, orders, reviews] = await Promise.all([/* users, orders, reviews */]);
  const shipments = await getJson(\`\${SHIPPING}/shipments?orderIds=\${ids}\`);
  res.json({ customer, orders: withShipments(orders, shipments), reviews });
});`,
  graphql: `// Browser: one request, and the query names exactly the fields this screen shows
const { data } = await fetch(\`\${AGGREGATOR}/graphql\`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ query: MY_ACCOUNT_QUERY, variables: { id: "c-1" } }),
}).then((r) => r.json());`,
};

const MODE_LABEL: Record<Mode, string> = {
  direct: "Browser calls every service",
  rest: "REST aggregator",
  graphql: "GraphQL aggregator",
};

function AccountDemo({ network, onNetwork }: { network: Network; onNetwork: (n: Network) => Promise<void> }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [client, setClient] = useState<Client>("web");
  const { state, load } = useLoader<AccountView>();

  const start = (m: Mode, c: Client) => {
    setMode(m);
    setClient(c);
    void load((onCall) => loadAccount(m, c, onCall));
  };

  const switchNetwork = async (n: Network) => {
    await onNetwork(n);
    if (mode) start(mode, client);
  };

  const busy = state.status === "loading";
  const page =
    state.status === "loading" ? (
      <Loading label={mode === "direct" ? "Loading… the browser is calling 4 services" : "Loading… one request to the aggregator"} />
    ) : state.result ? (
      client === "web" ? (
        <AccountWeb data={state.result.data} />
      ) : (
        <AccountMobile data={state.result.data} />
      )
    ) : (
      <div className="ui-empty">Pick how to load this page ↑</div>
    );

  return (
    <>
      <div className="gq-toolbar">
        <span className="gq-toolbar-label">Load it by</span>
        <Seg value={mode} options={Object.entries(MODE_LABEL) as [Mode, string][]} onPick={(m) => start(m, client)} disabled={busy} />
        <span className="gq-toolbar-label">Client</span>
        <Seg
          value={client}
          options={[
            ["web", "Web"],
            ["mobile", "Mobile"],
          ]}
          onPick={(c) => (mode ? start(mode, c) : setClient(c))}
          disabled={busy}
        />
        <button className="co-secondary" onClick={() => mode && start(mode, client)} disabled={!mode || busy}>
          Reload
        </button>
      </div>
      <div className="gq-toolbar">
        <span className="gq-toolbar-label">Network</span>
        <Seg
          value={network}
          options={[
            ["wifi", "Laptop on Wi-Fi"],
            ["cellular", "Phone on cellular"],
          ]}
          onPick={(n) => void switchNetwork(n)}
          disabled={busy}
        />
        <span className="gq-sim">
          Simulated: every request from the browser waits {NETWORKS[network]} ms before the service answers, like a trip
          across the internet. Calls between services stay ~1 ms.
        </span>
      </div>

      <Metrics state={state} />

      {client === "web" ? (
        <div className="ui-browser">
          <div className="ui-browser-bar">
            <span className="ui-dots" />
            <span className="ui-url">shop.example/account</span>
          </div>
          <div className="ui-browser-body">
            <h3 className="ui-page-title">My Account</h3>
            {page}
          </div>
        </div>
      ) : (
        <div className="ui-phone">
          <div className="ui-phone-notch" />
          <div className="ui-phone-body">
            <h3 className="ui-page-title">My Account</h3>
            {page}
          </div>
        </div>
      )}

      {mode && (
        <details className="gq-details">
          <summary>Show the code: {MODE_LABEL[mode]}</summary>
          <CodeBlock language="typescript" code={ACCOUNT_CODE[mode]} />
          {mode === "graphql" && <CodeBlock language="graphql" code={ACCOUNT_QUERIES[client]} />}
        </details>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function GraphqlDemo() {
  const [up, setUp] = useState<boolean | null>(null);
  const [network, setNetworkState] = useState<Network>("cellular");

  // On load: is the backend up? If so, put every service on the default network.
  useEffect(() => {
    let cancelled = false;
    aggregatorUp().then(async (ok) => {
      if (cancelled) return;
      setUp(ok);
      if (ok) await setNetwork("cellular").catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const changeNetwork = async (n: Network) => {
    await setNetwork(n);
    setNetworkState(n);
  };

  return (
    <div className="page lecture-page lecture-console">
      <title>Day 19 — GraphQL Demo</title>
      <DayNav day="day19-realtime-graphql" current="lecture" />
      <p className="gq-back">
        <Link to="/week4/day19-realtime-graphql/lecture">← Lecture canvas</Link> ·{" "}
        <Link to="/week4/day19-realtime-graphql/lecture/realtime">Real-time demo →</Link>
      </p>
      <h1>Day 19 — GraphQL Demo</h1>

      {up === false && (
        <div className="backend-banner is-down" role="alert">
          <span>
            Nothing is answering on :4500. In <code>backend-lecture-code/day19-realtime-graphql/graphql-store</code> run{" "}
            <code>npm run dev:all</code>.
          </span>
          <button onClick={() => aggregatorUp().then(setUp)}>Retry</button>
        </div>
      )}

      <h2>One page, four services</h2>
      <p className="console-intro">
        The &quot;My Account&quot; page needs data from four REST services: Users, Orders, Shipping, and Reviews. Load it
        three ways and watch the timer and the network waterfall — first on Wi-Fi, then on cellular. Then switch to
        Mobile and compare what each way downloads.
      </p>
      <AccountDemo network={network} onNetwork={changeNetwork} />
    </div>
  );
}
