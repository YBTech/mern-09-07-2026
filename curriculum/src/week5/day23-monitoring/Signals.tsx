// Diagrams for Notes.tsx section 2 (metrics, logs, traces). Each metric gets its own small card
// so a student sees one idea per picture. Arrowheads come from the <ArrowDefs /> in Notes.tsx.
import type { ReactNode } from "react";
import { Arrow, Box, T } from "../../components/Diagram";

const RED = "#d98b8b";
const GREEN = "#7dbb7d";
const ORANGE = "#e8a060";
const BLUE = "#7ea6e0";

// ───────────────────────── metric cards ─────────────────────────

function Card(props: { title: string; question: string; tag: string; value: string; valueColor?: string; label: string; children: ReactNode }) {
  const { title, question, tag, value, valueColor = "#1c1c1c", label, children } = props;
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label={label}>
      <rect x="1" y="1" width="318" height="178" rx="8" fill="#fff" stroke="#d6dbe6" />
      <T x={14} y={24} anchor="start" size={13} color="#1c1c1c" bold>{title}</T>
      <T x={306} y={22} anchor="end" size={9} color="#8e5fd6">{tag}</T>
      <T x={14} y={40} anchor="start" size={10.5}>{question}</T>
      {children}
      <line x1="14" x2="306" y1="152" y2="152" stroke="#eee" />
      <T x={14} y={170} anchor="start" size={15} color={valueColor} bold>{value}</T>
    </svg>
  );
}

function Spark({ v, color }: { v: number[]; color: string }) {
  const pts = v.map((y, i) => `${14 + (i * 292) / (v.length - 1)},${142 - y * 78}`).join(" ");
  return (
    <g>
      <line x1="14" x2="306" y1="142" y2="142" stroke="#ddd" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  );
}

function Traffic() {
  return (
    <Card title="Traffic" question="How busy are we?" tag="golden signal" value="420 requests / sec" label="Traffic: a line chart of requests per second rising through the morning to 420 requests per second.">
      <Spark v={[0.3, 0.32, 0.4, 0.5, 0.62, 0.7, 0.66, 0.8, 0.9, 0.85, 0.78, 0.6, 0.5]} color={BLUE} />
    </Card>
  );
}

function Latency() {
  return (
    <Card title="Latency" question="How slow are we?" tag="golden signal" value="p95 = 1.6s" valueColor="#c0392b" label="Latency: a line chart of p95 response time that spikes above the 1 second alert line.">
      <line x1="14" x2="306" y1="95" y2="95" stroke="#c0392b" strokeDasharray="4,3" />
      <T x={306} y={90} anchor="end" color="#c0392b">alert at 1s</T>
      <Spark v={[0.2, 0.22, 0.2, 0.25, 0.2, 0.22, 0.8, 0.95, 0.9, 0.85, 0.3, 0.22, 0.2]} color="#3b6fd6" />
    </Card>
  );
}

function Errors() {
  return (
    <Card title="Errors" question="How often do we fail?" tag="golden signal" value="2% error rate" valueColor="#c0392b" label="Errors: a grid of 100 squares, one per request. 98 are green and 2 are red, so the error rate is 2 percent.">
      {Array.from({ length: 100 }, (_, i) => (
        <rect key={i} x={14 + (i % 10) * 9.4} y={54 + Math.floor(i / 10) * 9.4} width="8" height="8" rx="1.5" fill={i === 23 || i === 71 ? "#d9534f" : "#bfe3bf"} />
      ))}
      <T x={125} y={80} anchor="start" size={11} color="#1c1c1c">100 requests</T>
      <T x={125} y={98} anchor="start" size={11} color="#2e7d32">98 worked</T>
      <T x={125} y={116} anchor="start" size={11} color="#c0392b">2 failed</T>
      <T x={125} y={136} anchor="start" size={11} color="#1c1c1c" bold>= 2% errors</T>
    </Card>
  );
}

function Saturation() {
  const rows: [string, number, string][] = [
    ["CPU 85%", 85, RED],
    ["Memory 60%", 60, GREEN],
    ["Disk 30%", 30, GREEN],
  ];
  return (
    <Card title="Saturation" question="How full are we?" tag="golden signal" value="CPU nearly full" valueColor="#c0392b" label="Saturation: three fill bars. CPU is 85 percent full, memory 60 percent, disk 30 percent.">
      {rows.map(([name, pct, color], i) => (
        <g key={name}>
          <T x={14} y={70 + i * 29} anchor="start" size={10} color="#1c1c1c">{name}</T>
          <rect x="84" y={58 + i * 29} width="220" height="16" rx="3" fill="#eee" />
          <rect x="84" y={58 + i * 29} width={(220 * pct) / 100} height="16" rx="3" fill={color} />
        </g>
      ))}
    </Card>
  );
}

function Queue() {
  return (
    <Card title="Queue depth" question="How much work is waiting?" tag="app metric" value="1,240 jobs waiting" valueColor="#c0392b" label="Queue depth: jobs arrive at 50 per second but the worker only finishes 20 per second, so the queue fills up with 1,240 waiting jobs.">
      <T x={14} y={88} anchor="start" size={9}>in 50/s</T>
      <Arrow d="M48,84 L70,84" />
      <rect x="72" y="66" width="166" height="40" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={78 + i * 17.5} y="72" width="13" height="28" rx="2" fill="#fff" stroke="#8e5fd6" />
      ))}
      <Arrow d="M240,84 L262,84" />
      <T x={266} y={88} anchor="start" size={9}>out 20/s</T>
      <T x={155} y={128} size={9.5}>work arrives faster than it is finished</T>
    </Card>
  );
}

function CacheHit() {
  const c = 2 * Math.PI * 34;
  return (
    <Card title="Cache hit rate" question="How often is the cache enough?" tag="app metric" value="92% hit rate" valueColor="#2e7d32" label="Cache hit rate: a ring chart. 92 percent of lookups are answered from the cache, 8 percent miss and go to the database.">
      <circle cx="70" cy="100" r="34" fill="none" stroke={ORANGE} strokeWidth="14" />
      <circle cx="70" cy="100" r="34" fill="none" stroke={GREEN} strokeWidth="14" strokeDasharray={`${0.92 * c} ${c}`} transform="rotate(-90 70 100)" />
      <T x={70} y={105} size={14} color="#1c1c1c" bold>92%</T>
      <rect x="125" y="68" width="10" height="10" fill={GREEN} />
      <T x={141} y={77} anchor="start" size={10.5} color="#1c1c1c">hit: answered from cache</T>
      <T x={141} y={91} anchor="start" size={9}>fast</T>
      <rect x="125" y="108" width="10" height="10" fill={ORANGE} />
      <T x={141} y={117} anchor="start" size={10.5} color="#1c1c1c">miss: asked the database</T>
      <T x={141} y={131} anchor="start" size={9}>slow</T>
    </Card>
  );
}

function Pool() {
  return (
    <Card title="DB connection pool" question="Are database connections running out?" tag="resource" value="19 / 20 in use" valueColor="#c0392b" label="Database connection pool: 20 slots, 19 are in use and 1 is free. When the pool is full, the next request waits in line.">
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={14 + (i % 10) * 29.2} y={58 + Math.floor(i / 10) * 26} width="24" height="20" rx="3" fill={i < 19 ? BLUE : "#fff"} stroke={BLUE} strokeWidth="1.5" strokeDasharray={i < 19 ? undefined : "3,2"} />
      ))}
      <T x={160} y={128} size={9.5}>when all 20 are busy, the next request waits in line</T>
    </Card>
  );
}

function Orders() {
  const v = [38, 41, 40, 44, 43, 42, 3, 4, 5, 35, 40, 42];
  return (
    <Card title="Orders per minute" question="Is the business still earning?" tag="business metric" value="40 → 3 orders / min" valueColor="#c0392b" label="Orders per minute: a bar chart that sits around 40, collapses to 3 for three minutes while the payment provider is down, then recovers.">
      <line x1="14" x2="306" y1="142" y2="142" stroke="#ddd" />
      {v.map((n, i) => (
        <rect key={i} x={14 + i * 24.3} y={142 - n * 1.6} width="17" height={n * 1.6} rx="2" fill={n < 10 ? "#d9534f" : BLUE} />
      ))}
      <T x={14 + 7 * 24.3 + 8} y={120} size={9} color="#c0392b">provider down</T>
    </Card>
  );
}

export function GoldenSignals() {
  return (
    <div className="metric-grid">
      <Traffic />
      <Latency />
      <Errors />
      <Saturation />
    </div>
  );
}

export function MoreMetrics() {
  return (
    <div className="metric-grid">
      <Queue />
      <CacheHit />
      <Pool />
      <Orders />
    </div>
  );
}

// ───────────────────────── metrics: aggregation + percentiles ─────────────────────────

export function Aggregation() {
  const dots = Array.from({ length: 60 }, (_, i) => [24 + (i % 10) * 11, 30 + Math.floor(i / 10) * 11] as const);
  const line = [0.3, 0.35, 0.5, 0.45, 0.7, 0.62, 0.85, 0.75, 0.9].map((y, i) => `${480 + i * 22},${100 - y * 55}`).join(" ");
  return (
    <svg viewBox="0 0 680 130" role="img" aria-label="How a metric is made: thousands of individual requests are counted once per minute into a single number, 412 requests per minute. Repeating that every minute gives one point per minute, which forms a line over time called a time series.">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#bcd2f2" stroke={BLUE} />
      ))}
      <T x={79} y={108} color="#1c1c1c">every request</T>
      <Arrow d="M140,60 L178,60" />
      <Box x={182} y={34} w={120} h={52} kind="service" label="Count them" sub="once per minute" />
      <Arrow d="M302,60 L338,60" />
      <Box x={342} y={34} w={110} h={52} kind="primary" label="412" sub="requests / min" />
      <Arrow d="M452,60 L474,60" />
      <line x1="480" x2="660" y1="100" y2="100" stroke="#ddd" />
      <polyline points={line} fill="none" stroke="#3b6fd6" strokeWidth="2.5" strokeLinejoin="round" />
      <T x={570} y={118} color="#1c1c1c">one point per minute = a time series</T>
    </svg>
  );
}

const LATENCIES = Array.from({ length: 100 }, (_, k) => {
  const i = k + 1;
  return i <= 90 ? 60 + i : 150 + 30 * (i - 90) ** 2; // 100 requests, fastest to slowest
});
const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

export function Percentiles() {
  const x0 = 30;
  const step = 6.2;
  const base = 200;
  const scale = 150 / LATENCIES[99];
  const barX = (i: number) => x0 + i * step;
  const p50 = LATENCIES[49];
  const p95 = LATENCIES[94];
  const p99 = LATENCIES[98];
  const avg = Math.round(LATENCIES.reduce((a, b) => a + b, 0) / 100);
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label={`100 requests lined up from fastest to slowest. The average is ${avg} milliseconds, which looks healthy. The 50th request, p50, took ${p50} milliseconds. The 95th, p95, took ${p95} milliseconds. The 99th, p99, took ${p99} milliseconds. The slowest 5 requests are far slower than the average suggests.`}>
      {LATENCIES.map((ms, i) => (
        <rect key={i} x={barX(i)} y={base - ms * scale} width="5" height={Math.max(ms * scale, 1)} fill={i >= 95 ? "#e3a0a0" : "#bcd2f2"} />
      ))}
      <line x1={x0} x2={650} y1={base} y2={base} stroke="#bbb" />
      <line x1={x0} x2={650} y1={base - avg * scale} y2={base - avg * scale} stroke="#3d8b40" strokeDasharray="4,3" />
      <T x={x0 + 4} y={base - avg * scale - 5} anchor="start" color="#2e7d32">{`average = ${avg}ms  (looks fine)`}</T>
      <line x1={barX(49) + 2.5} x2={barX(49) + 2.5} y1={170} y2={base - p50 * scale} stroke="#555" strokeDasharray="2,2" />
      <T x={barX(49) + 2.5} y={164} color="#1c1c1c" bold>{`p50 = ${p50}ms`}</T>
      <line x1={barX(94) + 2.5} x2={barX(94) + 2.5} y1={56} y2={base - p95 * scale} stroke="#555" strokeDasharray="2,2" />
      <T x={barX(94) + 2.5} y={50} anchor="end" color="#1c1c1c" bold>{`p95 = ${secs(p95)}`}</T>
      <line x1={barX(98) + 2.5} x2={barX(98) + 2.5} y1={26} y2={base - p99 * scale} stroke="#555" strokeDasharray="2,2" />
      <T x={barX(98) + 2.5} y={20} anchor="end" color="#c0392b" bold>{`p99 = ${secs(p99)}`}</T>
      <T x={x0} y={218} anchor="start">fastest</T>
      <T x={340} y={218}>100 requests, sorted from fastest to slowest</T>
      <T x={650} y={218} anchor="end">slowest</T>
      <rect x={x0} y={232} width="10" height="10" fill="#e3a0a0" />
      <T x={x0 + 16} y={241} anchor="start" color="#1c1c1c">the slowest 5 of 100: 1 in 20 users waits this long or longer</T>
    </svg>
  );
}

// ───────────────────────── 2.4 the three side by side ─────────────────────────

function Pips({ x, y, filled }: { x: number; y: number; filled: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + i * 18} cy={y} r="6" fill={i < filled ? "#e8b400" : "#fff"} stroke="#e8b400" strokeWidth="1.5" />
      ))}
    </g>
  );
}

export function SignalsCompare() {
  const cols = [
    { x: 10, step: "1 · Notice", name: "Metrics", ask: "Is something wrong?", sub: "and since when", keep: "kept for months", pips: 1 },
    { x: 245, step: "2 · Locate", name: "Traces", ask: "Where is it slow or failing?", sub: "which service, which step", keep: "sampled", pips: 2 },
    { x: 480, step: "3 · Explain", name: "Logs", ask: "What exactly happened?", sub: "the detail at that spot", keep: "kept for days", pips: 3 },
  ];
  return (
    <svg viewBox="0 0 680 290" role="img" aria-label="The three signals side by side, in debugging order. Step 1, metrics: is something wrong and since when. Looks like a line chart. Cheap, kept for months. Step 2, traces: where is it slow or failing. Looks like a waterfall of spans. Medium cost, sampled. Step 3, logs: what exactly happened. Looks like lines of events. Expensive, kept for days.">
      {cols.map((c) => (
        <g key={c.name}>
          <rect x={c.x} y="10" width="190" height="270" rx="8" fill="#fff" stroke="#d6dbe6" />
          <T x={c.x + 95} y={32} size={10} color="#8e5fd6" bold>{c.step}</T>
          <T x={c.x + 95} y={54} size={16} color="#1c1c1c" bold>{c.name}</T>
          <T x={c.x + 95} y={78} size={11.5} color="#1c1c1c" bold>{c.ask}</T>
          <T x={c.x + 95} y={93} size={9.5}>{c.sub}</T>
          <rect x={c.x + 15} y="106" width="160" height="90" rx="5" fill="#fafafa" stroke="#eee" />
          <T x={c.x + 15} y={222} anchor="start" size={10}>cost</T>
          <Pips x={c.x + 62} y={219} filled={c.pips} />
          <T x={c.x + 95} y={252} size={11} color="#1c1c1c">{c.keep}</T>
        </g>
      ))}
      {/* metrics: a line with a spike */}
      <polyline points="26,180 50,176 74,179 98,174 114,128 130,120 148,124 164,172 180,178" transform="translate(10,0) scale(0.92,1)" fill="none" stroke="#3b6fd6" strokeWidth="2.5" strokeLinejoin="round" />
      {/* traces: a tiny waterfall */}
      {[
        [262, 118, 140, BLUE],
        [274, 136, 36, BLUE],
        [310, 154, 84, RED],
        [394, 172, 20, BLUE],
      ].map(([x, y, w, c], i) => (
        <rect key={i} x={x as number} y={y as number} width={w as number} height="12" rx="2" fill={c === RED ? "#fdf3f3" : "#eef3ff"} stroke={c as string} />
      ))}
      {/* logs: lines of events, one of them an error */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={497} y={118 + i * 19} width="30" height="11" rx="2" fill={i === 2 ? "#fdf3f3" : "#eef8ee"} stroke={i === 2 ? "#c0392b" : "#3d8b40"} />
          <rect x={533} y={120 + i * 19} width={[110, 90, 120, 70][i]} height="7" rx="2" fill={i === 2 ? "#e3a0a0" : "#ddd"} />
        </g>
      ))}
      <Arrow d="M201,150 L242,150" />
      <Arrow d="M436,150 L477,150" />
    </svg>
  );
}

// ───────────────────────── section 4: putting the tools to work ─────────────────────────

export function UsesFork() {
  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="Metrics are where you start. If something is slow or full, find the bottleneck, then scale or fix. If something is failing, debug the bug with logs and traces.">
      <Box x={20} y={50} w={150} h={52} kind="primary" label="Metrics" sub="dashboards + alerts" />
      <Arrow d="M170,68 L298,40" />
      <Arrow d="M170,84 L298,112" />
      <Box x={300} y={14} w={360} h={52} kind="warn" label="Something is slow or full" sub="find the bottleneck, then scale or fix  (4.1)" />
      <Box x={300} y={86} w={360} h={52} kind="fail" label="Something is failing" sub="debug the bug with logs and traces  (4.2)" />
    </svg>
  );
}

export function AutoScaling() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="Auto scaling on AWS. Users reach a load balancer, which spreads requests over servers in an Auto Scaling Group. A CloudWatch alarm watches CPU. When CPU goes above 70 percent, the alarm tells the group to add a server.">
      <Box x={10} y={44} w={90} h={52} kind="muted" label="Users" />
      <Arrow d="M100,70 L128,70" />
      <Box x={130} y={44} w={120} h={52} label="Load balancer" sub="spreads requests" />
      <rect x="280" y="22" width="390" height="96" rx="8" fill="none" stroke="#bbb" strokeDasharray="5,4" />
      <T x={290} y={18} anchor="start">Auto Scaling Group (EC2)</T>
      <Arrow d="M250,70 L290,70" />
      <Box x={292} y={44} w={110} h={52} label="Server 1" />
      <Box x={414} y={44} w={110} h={52} label="Server 2" />
      <Box x={536} y={44} w={124} h={52} kind="ok" label="Server 3" sub="added automatically" dashed />
      <Box x={330} y={146} w={230} h={46} kind="warn" label="CloudWatch alarm" sub="CPU above 70% for 5 minutes" />
      <Arrow d="M560,166 L598,166 L598,120" ink="orange" />
      <T x={608} y={148} anchor="start" color="#e08a3c">add a server</T>
    </svg>
  );
}

export function FixLayers() {
  return (
    <svg viewBox="0 0 680 140" role="img" aria-label="A slow request has a trace ID. The trace shows which layer is slow. If it is the database: add an index, optimize the query, or cache in Redis. If it is your own code: a better algorithm or a background queue. If it is an external API: cache, parallel calls, or a timeout.">
      <Box x={10} y={44} w={120} h={52} kind="warn" label="Slow request" sub="grab its trace ID" />
      <Arrow d="M130,70 L168,70" />
      <Box x={170} y={44} w={110} h={52} label="Trace" sub="which layer is slow?" />
      <Arrow d="M280,62 L338,28" />
      <Arrow d="M280,70 L338,70" />
      <Arrow d="M280,78 L338,112" />
      <Box x={340} y={8} w={330} h={40} kind="ok" label="Database" sub="index · optimize the query · cache in Redis" />
      <Box x={340} y={50} w={330} h={40} kind="ok" label="Your code" sub="better algorithm · move work to a background queue" />
      <Box x={340} y={92} w={330} h={40} kind="ok" label="External API" sub="cache · parallel calls · timeout" />
    </svg>
  );
}

export function ErrorMetric() {
  const pts = "60,112 100,110 140,113 180,111 220,112 250,60 280,30 320,26 360,32 400,28 440,30";
  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="A line chart of the POST /orders error rate. It sits near zero, then jumps to 20 percent, far above the 1 percent alert line. The metric shows that orders are failing and since when, but not why.">
      <T x={60} y={14} anchor="start" size={11} color="#1c1c1c" bold>error rate · POST /orders</T>
      <line x1="60" x2="450" y1="125" y2="125" stroke="#bbb" />
      <line x1="60" x2="450" y1="104" y2="104" stroke="#c0392b" strokeDasharray="4,3" />
      <T x={56} y={108} anchor="end" color="#c0392b">1%</T>
      <T x={56} y={129} anchor="end">0</T>
      <T x={56} y={34} anchor="end">20%</T>
      <polyline points={pts} fill="none" stroke="#d9534f" strokeWidth="2.5" strokeLinejoin="round" />
      <T x={250} y={142}>alert fires here</T>
      <T x={480} y={50} anchor="start" size={11} color="#1c1c1c" bold>The metric tells you</T>
      <T x={480} y={68} anchor="start">orders are failing, how badly, since when</T>
      <T x={480} y={98} anchor="start" size={11} color="#1c1c1c" bold>It does not tell you</T>
      <T x={480} y={116} anchor="start">why</T>
    </svg>
  );
}

export function BugFlow() {
  const steps = [
    { x: 10, n: "1", label: "Metric", sub: "something is failing", kind: "fail" as const, a: "POST /orders errors: 20%", b: "(the alert fires)" },
    { x: 180, n: "2", label: "Logs", sub: "what + trace ID", kind: "service" as const, a: "Cannot read 'percent'", b: "of undefined · trace_id=abc" },
    { x: 350, n: "3", label: "Trace", sub: "where", kind: "service" as const, a: "red span in orders,", b: "pricing.ts line 9" },
    { x: 520, n: "4", label: "Fix + verify", sub: "ship, watch the metric", kind: "ok" as const, a: "handle the missing discount;", b: "error rate back to 0%" },
  ];
  return (
    <svg viewBox="0 0 680 140" role="img" aria-label="Debugging in four steps. One, the metric shows orders failing at 20 percent. Two, the error logs say Cannot read percent of undefined and give a trace ID. Three, searching that trace ID shows a red span in the orders service at pricing.ts line 9. Four, fix the missing discount case and watch the error rate return to 0 percent.">
      {steps.map((s, i) => (
        <g key={s.n}>
          <T x={s.x + 70} y={16} size={10} color="#8e5fd6" bold>{`step ${s.n}`}</T>
          <Box x={s.x} y={24} w={140} h={52} kind={s.kind} label={s.label} sub={s.sub} />
          <T x={s.x + 70} y={98} size={10} color="#1c1c1c">{s.a}</T>
          <T x={s.x + 70} y={113} size={10}>{s.b}</T>
          {i < 3 && <Arrow d={`M${s.x + 142},50 L${s.x + 168},50`} />}
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────── section 5: frontend performance ─────────────────────────

/** One row per problem: the cause on the left, the fix on the right. */
export function CauseFix({ rows, label }: { rows: [string, string, string][]; label: string }) {
  const h = rows.length * 52 + 4;
  return (
    <svg viewBox={`0 0 680 ${h}`} role="img" aria-label={label}>
      {rows.map(([cause, fix, sub], i) => {
        const y = 4 + i * 52;
        return (
          <g key={cause}>
            <Box x={10} y={y} w={250} h={44} kind="warn" label={cause} size={11.5} />
            <Arrow d={`M260,${y + 22} L298,${y + 22}`} />
            <Box x={300} y={y} w={370} h={44} kind="ok" label={fix} sub={sub} size={11.5} />
          </g>
        );
      })}
    </svg>
  );
}

export function CdnMap() {
  const edges: [number, string][] = [
    [40, "Tokyo"],
    [265, "London"],
    [490, "São Paulo"],
  ];
  return (
    <svg viewBox="0 0 680 160" role="img" aria-label="A CDN. The origin server sits in one place, Virginia. It copies your JavaScript, CSS and images to CDN edge servers in Tokyo, London and São Paulo. A user downloads from the nearest edge, not from Virginia.">
      <Box x={270} y={6} w={140} h={44} kind="muted" label="Origin server" sub="Virginia" />
      {edges.map(([x, city]) => (
        <g key={city}>
          <Arrow d={`M340,50 L${x + 75},96`} dashed />
          <Box x={x} y={98} w={150} h={40} kind="primary" label="CDN edge" sub={city} />
        </g>
      ))}
      <T x={150} y={64} anchor="end">copies of your static files</T>
      <T x={340} y={154} size={11} color="#1c1c1c" bold>A user downloads from the nearest edge, not from Virginia.</T>
    </svg>
  );
}

export function MainThread() {
  const chunks = Array.from({ length: 9 }, (_, i) => 150 + i * 42);
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="The browser's main thread, before and after. Before: one long 320 millisecond task of JavaScript filters 20,000 items, so a click has to wait until it finishes before the screen can update. After: the work is split into small chunks with a repaint between each, so the click is handled within a few milliseconds.">
      <T x={10} y={50} anchor="start" size={12} color="#1c1c1c" bold>Before</T>
      <rect x="150" y="34" width="360" height="28" rx="3" fill="#fdf3f3" stroke={RED} />
      <T x={330} y={52} color="#1c1c1c">JavaScript: filter 20,000 items (one long task)</T>
      <rect x="514" y="34" width="34" height="28" rx="3" fill="#eef8ee" stroke={GREEN} />
      <T x={531} y={52} color="#1c1c1c">paint</T>
      <Arrow d="M190,12 L190,32" ink="red" />
      <T x={196} y={14} anchor="start" color="#c0392b">click</T>
      <line x1="190" x2="548" y1="74" y2="74" stroke="#c0392b" />
      <T x={369} y={88} color="#c0392b" bold>the click waits ~320ms: poor INP</T>

      <T x={10} y={140} anchor="start" size={12} color="#1c1c1c" bold>After</T>
      {chunks.map((x) => (
        <g key={x}>
          <rect x={x} y="124" width="26" height="28" rx="3" fill="#eef3ff" stroke={BLUE} />
          <rect x={x + 28} y="124" width="10" height="28" rx="2" fill="#eef8ee" stroke={GREEN} />
        </g>
      ))}
      <Arrow d="M190,102 L190,122" ink="red" />
      <T x={196} y={104} anchor="start" color="#c0392b">click</T>
      <T x={369} y={172} color="#2e7d32" bold>small chunks, a repaint between each: the click is handled right away</T>
    </svg>
  );
}

export function LabVsField() {
  const dot = (x: number, y: number) => <circle cx={x} cy={y - 4} r="2.5" fill="#555" />;
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="Two kinds of performance data. Lab data comes from a test run on one page: Lighthouse, the DevTools Performance panel, the React Profiler. It tells you how fast the page can be. Field data comes from real users, and you have two options: a Real User Monitoring tool such as Datadog RUM or New Relic Browser, or build it yourself with the web-vitals library sending numbers to your own endpoint and Grafana. It tells you how fast the page is for real people.">
      <rect x="10" y="10" width="320" height="156" rx="8" fill="#eef3ff" stroke={BLUE} strokeWidth="1.5" />
      <T x={170} y={34} size={13} color="#1c1c1c" bold>Lab data: a test run</T>
      {dot(30, 66)}
      <T x={40} y={66} anchor="start" size={11.5} color="#1c1c1c">Lighthouse (built into Chrome DevTools)</T>
      {dot(30, 90)}
      <T x={40} y={90} anchor="start" size={11.5} color="#1c1c1c">DevTools Performance panel</T>
      {dot(30, 114)}
      <T x={40} y={114} anchor="start" size={11.5} color="#1c1c1c">React Profiler</T>
      <T x={170} y={150} size={11} color="#1c5fb0" bold>how fast the page CAN be</T>
      <rect x="350" y="10" width="320" height="156" rx="8" fill="#fff7e0" stroke="#e8b400" strokeWidth="1.5" />
      <T x={510} y={34} size={13} color="#1c1c1c" bold>Field data: real users</T>
      {dot(370, 66)}
      <T x={380} y={66} anchor="start" size={11.5} color="#1c1c1c" bold>Option 1: a RUM tool</T>
      <T x={394} y={84} anchor="start" size={10.5}>Datadog RUM, New Relic Browser</T>
      {dot(370, 108)}
      <T x={380} y={108} anchor="start" size={11.5} color="#1c1c1c" bold>Option 2: build it yourself</T>
      <T x={394} y={126} anchor="start" size={10.5}>web-vitals library → your endpoint → Grafana</T>
      <T x={510} y={150} size={11} color="#9a6b00" bold>how fast the page IS, for real people</T>
      <T x={340} y={196} size={11} color="#1c1c1c" bold>Old phones and slow networks only show up in field data.</T>
    </svg>
  );
}
