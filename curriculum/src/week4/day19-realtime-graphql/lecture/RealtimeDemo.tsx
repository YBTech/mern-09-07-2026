import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import CodeBlock from "../../../components/CodeBlock";
import DayNav from "../../../components/DayNav";

// Day 19 demo, part 2: four real-time features, each built with the mechanism that fits it.
//   1. short polling   a monitoring dashboard: the data changes every second, so nothing is wasted
//   2. short vs long   a notification bell: rare updates, where short polling mostly hears "nothing new"
//   3. WebSocket       a chat room: both sides talk, often
//   4. SSE             live match commentary: the server streams, the browser only listens
// Backend: backend-lecture-code/day19-realtime-graphql/realtime-demos (npm run dev)

const API = "http://localhost:4600";
const WS_URL = "ws://localhost:4600/chat";

/** How long after it happened something reached this page. */
const lateBy = (at: string) => {
  const ms = Math.max(0, Date.now() - Date.parse(at));
  return ms < 100 ? "instantly" : `${(ms / 1000).toFixed(1)} s late`;
};

function Panel(props: { title: string; how: string; counters: ReactNode; code: string; children?: ReactNode; wide?: boolean }) {
  const { title, how, counters, code, children, wide } = props;
  return (
    <div className={`demo-card rt-panel ${wide ? "is-wide" : ""}`}>
      <h2>{title}</h2>
      <p className="gq-how">{how}</p>
      {children}
      <p className="rt-counters">{counters}</p>
      <details className="gq-details">
        <summary>Show the code</summary>
        <CodeBlock language="typescript" code={code} />
      </details>
    </div>
  );
}

// ═════ 1. Short polling: a monitoring dashboard ═════════════════════════════
type Metrics = { cpu: number; memory: number; rps: number; version: number; at: string };

function Sparkline({ values }: { values: number[] }) {
  const points = values.map((v, i) => `${(i / 29) * 300},${60 - (v / 100) * 56}`).join(" ");
  return (
    <svg className="rt-spark" viewBox="0 0 300 62" preserveAspectRatio="none" role="img" aria-label="CPU usage over the last minute">
      <polyline points={points} fill="none" stroke="#2255cc" strokeWidth="2" />
    </svg>
  );
}

function DashboardPanel() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [requests, setRequests] = useState(0);
  const [fresh, setFresh] = useState(0);
  const lastVersion = useRef(-1);

  useEffect(() => {
    const poll = async () => {
      try {
        const m = (await fetch(`${API}/metrics`).then((r) => r.json())) as Metrics;
        setRequests((n) => n + 1);
        if (m.version !== lastVersion.current) {
          lastVersion.current = m.version;
          setFresh((n) => n + 1);
          setMetrics(m);
          setCpuHistory((h) => [...h, m.cpu].slice(-30));
        }
      } catch {
        /* server down: try again next tick */
      }
    };
    const first = window.setTimeout(poll, 0);
    const id = window.setInterval(poll, 2000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  return (
    <Panel
      wide
      title="Server monitoring dashboard"
      how="Asks every 2 seconds. The numbers change every second, so almost every answer is new data."
      counters={
        <>
          {requests} requests · <strong>{fresh} brought new data</strong> · {requests - fresh} wasted
        </>
      }
      code={`setInterval(async () => {
  const metrics = await fetch(\`\${API}/metrics\`).then((r) => r.json());
  renderCharts(metrics);
}, 2000);`}
    >
      <div className="rt-metrics">
        <div>
          <span>CPU</span>
          <strong>{metrics ? `${metrics.cpu}%` : "—"}</strong>
        </div>
        <div>
          <span>Memory</span>
          <strong>{metrics ? `${metrics.memory}%` : "—"}</strong>
        </div>
        <div>
          <span>Requests / s</span>
          <strong>{metrics ? metrics.rps : "—"}</strong>
        </div>
      </div>
      <Sparkline values={cpuHistory} />
    </Panel>
  );
}

// ═════ 2. A notification bell, two ways ═════════════════════════════════════
type Notification = { id: number; text: string; at: string };
type Received = Notification & { late: string };

function NotificationList({ items }: { items: Received[] }) {
  return (
    <ul className="rt-feed">
      {items.length === 0 && <li className="rt-empty">No notifications yet.</li>}
      {items.slice(0, 5).map((n) => (
        <li key={n.id}>
          🔔 {n.text} <span className="rt-late">arrived {n.late}</span>
        </li>
      ))}
    </ul>
  );
}

function ShortPollingBell() {
  const [items, setItems] = useState<Received[]>([]);
  const [requests, setRequests] = useState(0);
  const [empty, setEmpty] = useState(0);
  const since = useRef(0);

  useEffect(() => {
    const poll = async () => {
      try {
        const fresh = (await fetch(`${API}/notifications?since=${since.current}`).then((r) => r.json())) as Notification[];
        setRequests((n) => n + 1);
        if (fresh.length === 0) {
          setEmpty((n) => n + 1);
          return;
        }
        since.current = fresh[fresh.length - 1].id;
        setItems((list) => [...fresh.reverse().map((n) => ({ ...n, late: lateBy(n.at) })), ...list]);
      } catch {
        /* server down: try again next tick */
      }
    };
    const first = window.setTimeout(poll, 0);
    const id = window.setInterval(poll, 2000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  return (
    <Panel
      title="Short polling"
      how="Asks every 2 seconds whether anything new arrived. Almost always, nothing did."
      counters={
        <>
          {requests} requests · <strong>{empty} answered &quot;nothing new&quot;</strong>
        </>
      }
      code={`setInterval(async () => {
  const fresh = await fetch(\`\${API}/notifications?since=\${since}\`).then((r) => r.json());
  if (fresh.length > 0) showBadge(fresh); // usually it's []
}, 2000);`}
    >
      <NotificationList items={items} />
    </Panel>
  );
}

function LongPollingBell() {
  const [items, setItems] = useState<Received[]>([]);
  const [requests, setRequests] = useState(0);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const abort = new AbortController();
    (async () => {
      let since = 0;
      while (!abort.signal.aborted) {
        try {
          setWaiting(true);
          const res = await fetch(`${API}/notifications/poll?since=${since}`, { signal: abort.signal });
          setWaiting(false);
          setRequests((n) => n + 1);
          if (res.status === 200) {
            const fresh = (await res.json()) as Notification[];
            since = fresh[fresh.length - 1].id;
            setItems((list) => [...fresh.reverse().map((n) => ({ ...n, late: lateBy(n.at) })), ...list]);
          }
          // 204 = nothing new for 25 s: just ask again.
        } catch {
          if (abort.signal.aborted) return;
          setWaiting(false);
          await new Promise((r) => setTimeout(r, 1000)); // server down: back off, then retry
        }
      }
    })();
    return () => abort.abort();
  }, []);

  return (
    <Panel
      title="Long polling"
      how="Asks once, and the server holds the request open until there's news (or 25 s pass). Then the page asks again."
      counters={
        <>
          {requests} requests · {waiting ? <strong>one request open, waiting for news</strong> : "—"}
        </>
      }
      code={`let since = 0;
while (true) {
  // The server holds this request open until there's news (or 25 s pass).
  const res = await fetch(\`\${API}/notifications/poll?since=\${since}\`);
  if (res.status === 200) {
    const fresh = await res.json();
    since = fresh[fresh.length - 1].id;
    showBadge(fresh);
  }
  // 204 means "nothing new": loop round and ask again.
}`}
    >
      <NotificationList items={items} />
    </Panel>
  );
}

// ═════ 3. WebSocket: a chat room ════════════════════════════════════════════
type ChatMessage = { user: string; text: string; at: string };
type ServerMessage = { type: "presence"; online: string[] } | { type: "typing"; user: string } | ({ type: "message" } & ChatMessage);

function ChatPanel({ user }: { user: string }) {
  const [state, setState] = useState("connecting…");
  const [online, setOnline] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [counts, setCounts] = useState({ in: 0, out: 0 });
  const [draft, setDraft] = useState("");
  const socket = useRef<WebSocket | null>(null);
  const typingTimer = useRef<number | undefined>(undefined);
  const lastTypingSent = useRef(0);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?user=${user}`);
    socket.current = ws;
    ws.onopen = () => setState("connected");
    ws.onclose = () => setState("closed");
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data as string) as ServerMessage;
      setCounts((c) => ({ ...c, in: c.in + 1 }));
      if (msg.type === "presence") setOnline(msg.online);
      if (msg.type === "typing") {
        setTyping(msg.user);
        window.clearTimeout(typingTimer.current);
        typingTimer.current = window.setTimeout(() => setTyping(null), 1500);
      }
      if (msg.type === "message") {
        setMessages((list) => [...list, msg]);
        setTyping((t) => (t === msg.user ? null : t));
      }
    };
    return () => {
      window.clearTimeout(typingTimer.current);
      ws.close();
    };
  }, [user]);

  const out = (message: object) => {
    if (socket.current?.readyState !== WebSocket.OPEN) return;
    socket.current.send(JSON.stringify(message));
    setCounts((c) => ({ ...c, out: c.out + 1 }));
  };

  const onType = (value: string) => {
    setDraft(value);
    // At most one "typing" a second, not one per keystroke.
    if (Date.now() - lastTypingSent.current > 1000) {
      lastTypingSent.current = Date.now();
      out({ type: "typing" });
    }
  };

  const send = () => {
    if (!draft.trim()) return;
    out({ type: "message", text: draft });
    setDraft("");
    lastTypingSent.current = 0;
  };

  return (
    <Panel
      title={`${user}'s window`}
      how={`Signed in as ${user}. One connection, kept open: messages and "typing…" go out and come in on it.`}
      counters={
        <>
          1 connection ({state}) · {counts.in} messages in · {counts.out} out
        </>
      }
      code={`const socket = new WebSocket("ws://localhost:4600/chat?user=${user}");

// in: whatever anyone else sends
socket.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.type === "message") addToChat(msg);
  if (msg.type === "typing") showTyping(msg.user);
  if (msg.type === "presence") showOnline(msg.online);
};

// out: the other direction, same connection
input.oninput = () => socket.send(JSON.stringify({ type: "typing" }));
sendButton.onclick = () =>
  socket.send(JSON.stringify({ type: "message", text: input.value }));`}
    >
      <p className="rt-online">Online: {online.length ? online.join(", ") : "—"}</p>
      <div className="rt-chat">
        <ul>
          {messages.length === 0 && <li className="rt-empty">Say something; it shows up in the other window instantly.</li>}
          {messages.map((m, i) => (
            <li key={i} className={m.user === user ? "is-me" : ""}>
              <strong>{m.user}:</strong> {m.text}
            </li>
          ))}
        </ul>
        <p className="rt-typing">{typing ? `${typing} is typing…` : " "}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input value={draft} onChange={(e) => onType(e.target.value)} placeholder={`Message as ${user}`} aria-label={`Message as ${user}`} />
          <button className="send-btn" type="submit" disabled={state !== "connected"}>
            Send
          </button>
        </form>
      </div>
    </Panel>
  );
}

// ═════ 4. SSE: live match commentary ════════════════════════════════════════
type MatchEvent = { id: number; minute: number; text: string; score: string; replayed: boolean };
type MatchNow = { score: string; minute: number; started: boolean };

function Scoreboard({ score, minute }: { score: string; minute?: number }) {
  return (
    <p className="rt-score">
      <span>Reds</span>
      <strong>{score}</strong>
      <span>Blues</span>
      {minute !== undefined && <em>{minute}&apos;</em>}
    </p>
  );
}

function PlainScorePanel() {
  const [now, setNow] = useState<MatchNow | null>(null);
  const [loadedAt, setLoadedAt] = useState("");
  const [requests, setRequests] = useState(0);

  const load = async () => {
    try {
      setNow((await fetch(`${API}/match`).then((r) => r.json())) as MatchNow);
      setLoadedAt(new Date().toLocaleTimeString());
      setRequests((n) => n + 1);
    } catch {
      /* server down */
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <Panel
      title="Plain request (the problem)"
      how="Fetched once when the page loaded. The server can't tell this page that anything changed."
      counters={
        <>
          {requests} request{requests === 1 ? "" : "s"} · loaded at {loadedAt || "—"} · <strong>never updated since</strong>
        </>
      }
      code={`// Once, when the page loads. After that, the page has no way to find out.
useEffect(() => {
  fetch(\`\${API}/match\`)
    .then((r) => r.json())
    .then(setMatch);
}, []);`}
    >
      <Scoreboard score={now?.score ?? "0–0"} minute={now?.started ? now.minute : undefined} />
      <button className="co-secondary" onClick={() => void load()}>
        Refresh page
      </button>
    </Panel>
  );
}

function SseMatchPanel() {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [state, setState] = useState("connecting…");
  const [opened, setOpened] = useState(0);
  const [received, setReceived] = useState(0);
  const [replayed, setReplayed] = useState(0);

  useEffect(() => {
    const stream = new EventSource(`${API}/match/events`);
    stream.onopen = () => {
      setState("connected");
      setOpened((n) => n + 1);
    };
    stream.onerror = () => setState("dropped, the browser is reconnecting…"); // it retries on its own
    stream.onmessage = (e) => {
      const event = JSON.parse(e.data as string) as MatchEvent;
      setReceived((n) => n + 1);
      if (event.replayed) setReplayed((n) => n + 1);
      // Event 1 is kick-off: a new match (or this page's first look at one) starts the list over.
      setEvents((list) => (event.id === 1 ? [event] : list.some((x) => x.id === event.id) ? list : [...list, event]));
    };
    return () => stream.close();
  }, []);

  const last = events.at(-1);

  return (
    <Panel
      title="Server-Sent Events (SSE)"
      how="One request, and the server keeps writing to the response whenever something happens. Server → browser only."
      counters={
        <>
          {opened} connection{opened === 1 ? "" : "s"} opened ({state}) · {received} events · <strong>{replayed} replayed after a reconnect</strong>
        </>
      }
      code={`const events = new EventSource(\`\${API}/match/events\`);

events.onmessage = (e) => render(JSON.parse(e.data));

// If the connection drops, the browser reconnects by itself and sends
// a Last-Event-ID header; the server replays whatever was missed.`}
    >
      <Scoreboard score={last?.score ?? "0–0"} minute={last?.minute} />
      <ul className="rt-feed">
        {events.length === 0 && <li className="rt-empty">Press &quot;Start match&quot;.</li>}
        {[...events].reverse().map((e) => (
          <li key={e.id}>
            <strong>{e.minute}&apos;</strong> {e.text}
            {e.replayed && <span className="rt-late">replayed after reconnect</span>}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// ═════ The page ═════════════════════════════════════════════════════════════
type Stats = Record<string, number>;

export default function RealtimeDemo() {
  const [up, setUp] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/stats`, { signal: AbortSignal.timeout(3000) })
      .then((r) => {
        if (!cancelled) setUp(r.ok);
      })
      .catch(() => {
        if (!cancelled) setUp(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const post = (path: string) => fetch(`${API}${path}`, { method: "POST" }).then((r) => r.json());
  const loadStats = async () => setStats((await fetch(`${API}/stats`).then((r) => r.json())) as Stats);

  return (
    <div className="page lecture-page lecture-console">
      <title>Day 19 — Real-Time Demo</title>
      <DayNav day="day19-realtime-graphql" current="lecture" />
      <p className="gq-back">
        <Link to="/week4/day19-realtime-graphql/lecture">← Lecture canvas</Link> ·{" "}
        <Link to="/week4/day19-realtime-graphql/lecture/graphql">← GraphQL demo</Link>
      </p>
      <h1>Day 19 — Real-Time Demo</h1>
      <p className="console-intro">Four features, each built with the mechanism that fits it.</p>

      {up === false && (
        <div className="backend-banner is-down" role="alert">
          <span>
            Nothing is answering on :4600. In <code>backend-lecture-code/day19-realtime-graphql/realtime-demos</code> run{" "}
            <code>npm run dev</code>, then reload this page.
          </span>
        </div>
      )}

      <div className="rt-controls">
        <button className="co-secondary" onClick={() => void loadStats()}>
          Show server counters
        </button>
        <button className="co-secondary" onClick={() => void post("/stats/reset").then(loadStats)}>
          Reset server counters
        </button>
        {stats && (
          <span className="rt-stats">
            {Object.entries(stats)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")}
          </span>
        )}
      </div>

      <h2 className="rt-section">1 · Short polling: data that changes all the time</h2>
      <div className="rt-grid">
        <DashboardPanel />
      </div>

      <h2 className="rt-section">2 · Short vs. long polling: rare updates</h2>
      <div className="rt-controls">
        <button className="send-btn" onClick={() => void post("/notifications")}>
          Someone comments
        </button>
        <button className="co-secondary" onClick={() => void post("/jobs/export").then((r: { doneInMs: number }) => setNote(`Export started: done in ${r.doneInMs / 1000} s`))}>
          Start a report export
        </button>
        {note && <span className="rt-stats">{note}</span>}
      </div>
      <div className="rt-grid">
        <ShortPollingBell />
        <LongPollingBell />
      </div>

      <h2 className="rt-section">3 · WebSocket: both sides talk</h2>
      <div className="rt-grid">
        <ChatPanel user="Ana" />
        <ChatPanel user="Ben" />
      </div>

      <h2 className="rt-section">4 · SSE: the server streams, the browser listens</h2>
      <div className="rt-controls">
        <button className="send-btn" onClick={() => void post("/match/start")}>
          Start match
        </button>
        <button className="co-secondary" onClick={() => void post("/match/drop")}>
          Drop the connection
        </button>
      </div>
      <div className="rt-grid">
        <PlainScorePanel />
        <SseMatchPanel />
      </div>
    </div>
  );
}
