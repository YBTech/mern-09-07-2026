// Four ways a page gets a bad INP, each next to its fix. In dev mode StrictMode renders every
// component twice, so the slowness here is roughly doubled: that is on purpose, it makes the demo obvious.
import { memo, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { burn, crunch } from "./heavy";

// ───────────────────────── 1. Typing: too much to render per keystroke ─────────────────────────

const ITEMS = Array.from({ length: 5000 }, (_, i) => `Product ${i + 1}`);
const search = (q: string) => ITEMS.filter((t) => t.toLowerCase().includes(q.toLowerCase())).slice(0, 2000);

function Row({ text }: { text: string }) {
  burn(0.08); // each row costs a little, like a real component with some work in it
  return <li>{text}</li>;
}

function ResultList({ items }: { items: string[] }) {
  return (
    <>
      <p className="fe-stat">{items.length} rows rendered</p>
      <ul className="fe-list">
        {items.map((t) => (
          <Row key={t} text={t} />
        ))}
      </ul>
    </>
  );
}
const MemoResultList = memo(ResultList);

export function SlowSearch() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="type quickly…" />
      <ResultList items={search(query)} />
    </>
  );
}

export function FastSearch() {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const items = useMemo(() => search(deferred), [deferred]);
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="type quickly…" />
      <MemoResultList items={items} />
    </>
  );
}

// ───────────────────────── 2. Re-rendering something that did not change ─────────────────────────

function Card({ n }: { n: number }) {
  burn(4);
  return <div className="fe-card">{n}</div>;
}

function GalleryImpl() {
  const badge = useRef<HTMLElement>(null);
  const renders = useRef(0);
  const lastRun = useRef(0);
  // After every commit of the gallery, bump the on-screen counter (written straight to the DOM,
  // so the counter itself never causes a re-render). StrictMode runs effects twice on mount;
  // two runs within 20ms count as one.
  useEffect(() => {
    const now = performance.now();
    if (now - lastRun.current > 20) renders.current += 1;
    lastRun.current = now;
    if (badge.current) badge.current.textContent = String(renders.current);
  });
  return (
    <>
      <p className="fe-stat">
        Gallery rendered <strong ref={badge}>0</strong> times
      </p>
      <div className="fe-cards">
        {Array.from({ length: 24 }, (_, i) => (
          <Card key={i} n={i + 1} />
        ))}
      </div>
    </>
  );
}
const Gallery = memo(GalleryImpl);

export function SlowRerender() {
  const [name, setName] = useState("");
  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="type your name…" />
      <p>Hello, {name || "…"}</p>
      <GalleryImpl />
    </>
  );
}

export function FastRerender() {
  const [name, setName] = useState("");
  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="type your name…" />
      <p>Hello, {name || "…"}</p>
      <Gallery />
    </>
  );
}

// ───────────────────────── 3. Heavy computation on the main thread ─────────────────────────

function Ticker() {
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), 100);
    return () => clearInterval(id);
  }, []);
  return <p className="fe-ticker">⏱ {(ticks / 10).toFixed(1)}s (stops when the page is blocked)</p>;
}

export function BlockingCrunch() {
  const [out, setOut] = useState("");
  const [clicks, setClicks] = useState(0);
  function run() {
    const t0 = performance.now();
    const result = crunch(); // the whole page waits for this line
    setOut(`result ${result} in ${Math.round(performance.now() - t0)}ms`);
  }
  return (
    <>
      <Ticker />
      <button onClick={run}>Crunch numbers</button>{" "}
      <button onClick={() => setClicks((c) => c + 1)}>Clicks: {clicks}</button>
      <p className="fe-stat">{out}</p>
    </>
  );
}

export function WorkerCrunch() {
  const [out, setOut] = useState("");
  const [clicks, setClicks] = useState(0);
  const [busy, setBusy] = useState(false);
  function run() {
    const t0 = performance.now();
    setBusy(true);
    const worker = new Worker(new URL("./crunch.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e) => {
      setOut(`result ${e.data} in ${Math.round(performance.now() - t0)}ms`);
      setBusy(false);
      worker.terminate();
    };
    worker.postMessage(null); // the work happens on another thread
  }
  return (
    <>
      <Ticker />
      <button onClick={run} disabled={busy}>
        {busy ? "Crunching…" : "Crunch numbers"}
      </button>{" "}
      <button onClick={() => setClicks((c) => c + 1)}>Clicks: {clicks}</button>
      <p className="fe-stat">{out}</p>
    </>
  );
}

// ───────────────────────── 4. Thousands of rows in the DOM ─────────────────────────

const ROW = 24;
const HEIGHT = 168;
const COUNT = 10_000;

function useMountTime(show: boolean) {
  const start = useRef(0);
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    if (show) setMs(Math.round(performance.now() - start.current));
  }, [show]);
  return { ms, markStart: () => (start.current = performance.now()) };
}

export function AllRows() {
  const [show, setShow] = useState(false);
  const { ms, markStart } = useMountTime(show);
  return (
    <>
      <button
        onClick={() => {
          markStart();
          setShow((s) => !s);
        }}
      >
        {show ? "Unmount" : "Mount"} {COUNT.toLocaleString()} rows
      </button>
      <p className="fe-stat">{show ? `DOM rows: ${COUNT.toLocaleString()} · mounted in ${ms}ms` : "not mounted"}</p>
      {show && (
        <div className="fe-scroll" style={{ height: HEIGHT }}>
          {Array.from({ length: COUNT }, (_, i) => (
            <div key={i} className="fe-vrow" style={{ height: ROW }}>
              Row {i + 1}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function WindowedRows() {
  const [show, setShow] = useState(false);
  const [top, setTop] = useState(0);
  const { ms, markStart } = useMountTime(show);
  const first = Math.floor(top / ROW);
  const visible = Array.from({ length: Math.ceil(HEIGHT / ROW) + 1 }, (_, k) => first + k);
  return (
    <>
      <button
        onClick={() => {
          markStart();
          setShow((s) => !s);
        }}
      >
        {show ? "Unmount" : "Mount"} {COUNT.toLocaleString()} rows
      </button>
      <p className="fe-stat">{show ? `DOM rows: ${visible.length} (of ${COUNT.toLocaleString()}) · mounted in ${ms}ms` : "not mounted"}</p>
      {show && (
        <div className="fe-scroll" style={{ height: HEIGHT }} onScroll={(e) => setTop(e.currentTarget.scrollTop)}>
          <div style={{ height: COUNT * ROW, position: "relative" }}>
            {visible.map((i) => (
              <div key={i} className="fe-vrow" style={{ position: "absolute", top: i * ROW, height: ROW }}>
                Row {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
