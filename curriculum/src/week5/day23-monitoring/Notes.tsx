import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";
import { Arrow, ArrowDefs, Box, T } from "../../components/Diagram";
import { Aggregation, AutoScaling, BugFlow, CauseFix, CdnMap, ErrorMetric, FixLayers, GoldenSignals, LabVsField, MainThread, MoreMetrics, Percentiles, SignalsCompare, UsesFork } from "./Signals";

// A trace drawn as a waterfall: one row per span, bar = when it ran and for how long.
type Span = {
  label: string;
  indent?: number;
  start: number;
  ms: number;
  tone?: "base" | "warn" | "fail";
  repeat?: number; // draw the span as N back-to-back slivers (an N+1 loop)
  note?: string;
  notePos?: "inside" | "after" | "before";
};

const TONE = {
  base: ["#eef3ff", "#7ea6e0"],
  warn: ["#fff1e6", "#e8a060"],
  fail: ["#fdf3f3", "#d98b8b"],
} as const;

function Waterfall({ spans, total, ticks, label }: { spans: Span[]; total: number; ticks: number[]; label: string }) {
  const x0 = 220;
  const scale = (650 - x0) / total;
  const height = 40 + spans.length * 28;
  return (
    <svg viewBox={`0 0 680 ${height}`} role="img" aria-label={label}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x0 + t * scale} x2={x0 + t * scale} y1={24} y2={height - 6} stroke="#eee" />
          <T x={x0 + t * scale} y={16}>{`${t.toLocaleString()}ms`}</T>
        </g>
      ))}
      {spans.map((s, i) => {
        const y = 30 + i * 28;
        const x = x0 + s.start * scale;
        const w = Math.max(s.ms * scale, 2);
        const [fill, stroke] = TONE[s.tone ?? "base"];
        const pos = s.notePos ?? "after";
        return (
          <g key={s.label}>
            <T x={20 + (s.indent ?? 0) * 12} y={y + 14} anchor="start" color="#1c1c1c">{s.label}</T>
            {s.repeat ? (
              Array.from({ length: s.repeat }, (_, k) => (
                <rect key={k} x={x + (k * w) / s.repeat!} y={y} width={w / s.repeat! - 1} height={20} fill={fill} stroke={stroke} strokeWidth="0.8" />
              ))
            ) : (
              <rect x={x} y={y} width={w} height={20} rx="3" fill={fill} stroke={stroke} />
            )}
            {s.note && (
              <T
                x={pos === "inside" ? x + w - 6 : pos === "before" ? x - 4 : x + w + 4}
                y={y + 14}
                anchor={pos === "after" ? "start" : "end"}
                color="#1c1c1c"
              >
                {s.note}
              </T>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const checkoutTrace: Span[] = [
  { label: "orders · POST /orders", start: 0, ms: 480, note: "480ms", notePos: "inside" },
  { label: "orders · validate cart", indent: 1, start: 2, ms: 10, note: "10ms" },
  { label: "orders · SELECT products", indent: 1, start: 12, ms: 18, note: "18ms" },
  { label: "inventory · POST /reserve", indent: 1, start: 30, ms: 390, tone: "warn", note: "390ms", notePos: "inside" },
  { label: "inventory · UPDATE stock", indent: 2, start: 40, ms: 370, tone: "fail", note: "370ms — waiting on a row lock", notePos: "inside" },
  { label: "payments · POST /charge", indent: 1, start: 420, ms: 50, note: "50ms" },
  { label: "orders · publish event", indent: 1, start: 470, ms: 6, note: "6ms" },
];

const slowApiTrace: Span[] = [
  { label: "GET /orders", start: 0, ms: 1850, note: "1,850ms", notePos: "inside" },
  { label: "auth middleware", indent: 1, start: 0, ms: 15, note: "15ms" },
  { label: "SELECT orders", indent: 1, start: 15, ms: 40, note: "40ms" },
  { label: "SELECT order_items ×50", indent: 1, start: 55, ms: 1400, tone: "fail", repeat: 50, note: "1,400ms (N+1)" },
  { label: "GET pricing-service", indent: 1, start: 1455, ms: 345, tone: "warn", note: "345ms", notePos: "inside" },
  { label: "serialize JSON", indent: 1, start: 1800, ms: 50, note: "50ms", notePos: "before" },
];

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 23 Notes</title>
      <DayNav day="day23-monitoring" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">Week 5 · Day 23 · Notes</p>
        <h1>Monitoring &amp; Observability</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. You will not be asked to set up a monitoring stack from memory; you will be asked how you would use one to find a bug or a bottleneck.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。面试不会让你凭记忆搭一套监控系统，而是会问你如何用它来找 bug 或性能瓶颈。</Zh>
        </p>
        <ul>
          <li>
            <En>Explain what monitoring and observability are for: catching problems, debugging them, and finding performance bottlenecks</En>
            <Zh>讲清楚监控和可观测性的用途：发现问题、排查问题、找到性能瓶颈</Zh>
          </li>
          <li>
            <En>Explain metrics, logs, and traces — what data each one holds and what question each one answers</En>
            <Zh>讲清楚 metrics、logs、traces——各自包含什么数据、回答什么问题</Zh>
          </li>
          <li>
            <En>Explain the LGTM stack: OpenTelemetry collects, Loki / Mimir (Prometheus) / Tempo store, Grafana shows — and how paid APM tools (Datadog, New Relic) compare</En>
            <Zh>讲清楚 LGTM 技术栈：OpenTelemetry 负责采集，Loki / Mimir（Prometheus）/ Tempo 负责存储，Grafana 负责展示——以及与付费 APM 工具（Datadog、New Relic）的对比</Zh>
          </li>
          <li>
            <En>Walk through debugging a production bug with these tools: metrics → trace → logs → reproduce → fix</En>
            <Zh>讲清楚如何用这些工具排查生产 bug：metrics → trace → logs → 复现 → 修复</Zh>
          </li>
          <li>
            <En>Explain the Core Web Vitals (LCP, INP, CLS), the common fixes for each, and the tools that measure them</En>
            <Zh>讲清楚 Core Web Vitals（LCP、INP、CLS）、各自的常见优化手段，以及用来测量它们的工具</Zh>
          </li>
          <li>
            <En>Answer &quot;how do you fix a slow API?&quot; layer by layer: find it, trace it, then fix the application, database, or external call</En>
            <Zh>逐层回答&quot;如何优化一个慢接口？&quot;：先找到、再 trace、然后修复应用层、数据库或外部调用</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/week5/day23-monitoring/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ───────────────────────── 1. Why ───────────────────────── */}
        <h3>
          <En>1. Why monitor at all?</En>
          <Zh>1. 为什么需要监控？</Zh>
        </h3>
        <p>
          <En>Once code is in production, you can&apos;t set a breakpoint or add a <code>console.log</code> and rerun it. Thousands of users are hitting dozens of services at once. The only way to know what&apos;s happening is the data the system reports about itself — its <strong>telemetry</strong>. That data has three jobs:</En>
          <Zh>代码一旦上线，你就没法打断点，也没法加个 <code>console.log</code> 再重跑。成千上万的用户同时在访问几十个服务。想知道发生了什么，唯一的办法就是系统自己上报的数据——也就是 <strong>telemetry（遥测数据）</strong>。这些数据有三个用途：</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Job</En><Zh>用途</Zh></th>
              <th><En>Question it answers</En><Zh>回答的问题</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Detect</En><Zh>发现</Zh></td>
              <td><En>Is something broken right now — before users email support?</En><Zh>现在是不是出问题了——在用户投诉之前？</Zh></td>
            </tr>
            <tr>
              <td><En>Debug</En><Zh>排查</Zh></td>
              <td><En>Where exactly did it break, and why?</En><Zh>到底在哪里出的问题，为什么？</Zh></td>
            </tr>
            <tr>
              <td><En>Improve performance</En><Zh>优化性能</Zh></td>
              <td><En>Where is the time going? What is the bottleneck slowing the frontend or the backend?</En><Zh>时间都花在哪里了？是什么瓶颈拖慢了前端或后端？</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En><strong>Monitoring</strong> is watching for problems you already expect: a dashboard of error rate, an alert when latency crosses a line. Like the warning lights on a car&apos;s dashboard.</En>
              <Zh><strong>Monitoring（监控）</strong>是盯着你已经预料到的问题：错误率仪表盘、延迟超线就告警。就像汽车仪表盘上的警示灯。</Zh>
            </li>
            <li>
              <En><strong>Observability</strong> is being able to answer questions you <em>didn&apos;t</em> predict, from the data you already collect. Like the mechanic plugging in a diagnostic computer to find out <em>why</em> the light came on.</En>
              <Zh><strong>Observability（可观测性）</strong>是能用已经收集的数据，回答你<em>事先没想到</em>的问题。就像修车师傅接上诊断电脑，找出警示灯<em>为什么</em>亮了。</Zh>
            </li>
            <li>
              <En>In practice, people use the two words loosely. Both rely on the same three kinds of data: <strong>metrics, logs, and traces</strong>.</En>
              <Zh>实际工作中这两个词经常混用。它们依赖的都是同样三类数据：<strong>metrics、logs、traces</strong>。</Zh>
            </li>
          </ul>
        </div>

        {/* ───────────────────────── 2. Three signals ───────────────────────── */}
        <h3>
          <En>2. The three signals: metrics, logs, traces</En>
          <Zh>2. 三种信号：metrics、logs、traces</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>2.1 Metrics — numbers over time</En>
          <Zh>2.1 Metrics——随时间变化的数字</Zh>
        </h4>
        <p>
          <En>A metric is an <strong>aggregated numerical snapshot</strong>, taken again and again and stored as a <strong>time series</strong>.</En>
          <Zh>metric 是<strong>聚合后的数值快照</strong>，被反复采集，并以<strong>时间序列（time series）</strong>的形式保存。</Zh>
        </p>
        <Aggregation />
        <ul>
          <li>
            <En>Thousands of requests become <strong>one number per minute</strong>.</En>
            <Zh>成千上万个请求，被汇总成<strong>每分钟一个数字</strong>。</Zh>
          </li>
          <li>
            <En>Just numbers, so they are cheap: keep them for months.</En>
            <Zh>只是数字，所以很便宜：可以保存好几个月。</Zh>
          </li>
          <li>
            <En>They say <em>something is wrong, and since when</em> — not why.</En>
            <Zh>它们告诉你<em>出问题了、从什么时候开始</em>——但不告诉你为什么。</Zh>
          </li>
        </ul>

        <p>
          <En><strong>The four golden signals</strong> — watch these for every service:</En>
          <Zh><strong>四个黄金信号</strong>——每个服务都要盯这四个：</Zh>
        </p>
        <GoldenSignals />

        <p>
          <En><strong>More metrics you will meet</strong> — resource, application, and business:</En>
          <Zh><strong>你还会遇到的 metrics</strong>——资源类、应用类、业务类：</Zh>
        </p>
        <MoreMetrics />

        <p>
          <En><strong>Why p95 / p99, not the average?</strong> Line up 100 requests from fastest to slowest:</En>
          <Zh><strong>为什么看 p95 / p99，而不是平均值？</strong>把 100 个请求按从快到慢排成一排：</Zh>
        </p>
        <Percentiles />
        <ul>
          <li>
            <En><strong>p50</strong> — the 50th request: the typical user.</En>
            <Zh><strong>p50</strong>——第 50 个请求：典型用户的体验。</Zh>
          </li>
          <li>
            <En><strong>p95</strong> — the 95th request: <em>1 in 20</em> users waits this long or longer.</En>
            <Zh><strong>p95</strong>——第 95 个请求：<em>每 20 个用户里有 1 个</em>要等这么久甚至更久。</Zh>
          </li>
          <li>
            <En><strong>p99</strong> — the 99th request: <em>1 in 100</em> users. The worst tail.</En>
            <Zh><strong>p99</strong>——第 99 个请求：<em>每 100 个用户里有 1 个</em>。最糟糕的尾部。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>The average hides the slow tail. Alert on p95 / p99.</En>
          <Zh>平均值会把慢的尾部藏起来。告警要看 p95 / p99。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>2.2 Logs — a diary of events</En>
          <Zh>2.2 Logs——事件日记</Zh>
        </h4>
        <p>
          <En>A log is one line written when something happens. Each line carries a <strong>trace ID</strong>, so you can filter the flood down to one request&apos;s story:</En>
          <Zh>log 是在某件事发生时写下的一行记录。每一行都带着一个 <strong>trace ID</strong>，所以你能从洪流中筛出某一个请求的完整经过：</Zh>
        </p>
        <svg viewBox="0 0 680 200" role="img" aria-label="A stream of six log lines from different services. Three of them — orders order.received, inventory stock.low, and payments card.declined — share trace=abc and are highlighted. Filtering by that trace ID turns three services' logs into one checkout's story.">
          {(
            [
              ["INFO", "10:02:11.204", "orders", "order.received", "abc", true],
              ["INFO", "10:02:11.209", "catalog", "product.viewed", "k9f", false],
              ["WARN", "10:02:11.231", "inventory", "stock.low", "abc", true],
              ["INFO", "10:02:11.240", "users", "login.success", "p2m", false],
              ["ERROR", "10:02:11.655", "payments", "card.declined", "abc", true],
              ["INFO", "10:02:11.661", "orders", "order.received", "z7q", false],
            ] as const
          ).map(([level, time, service, event, trace, hit], i) => {
            const y = 20 + i * 28;
            const chip = level === "ERROR" ? ["#fdf3f3", "#c0392b"] : level === "WARN" ? ["#fff1e6", "#e08a3c"] : ["#eef8ee", "#3d8b40"];
            return (
              <g key={i} fontFamily="ui-monospace, Menlo, monospace" fontSize="10">
                <rect x="20" y={y} width="460" height="22" rx="3" fill={hit ? "#fff7e0" : "#fafafa"} stroke={hit ? "#e8b400" : "#e5e5e5"} />
                <rect x="26" y={y + 4} width="44" height="14" rx="3" fill={chip[0]} stroke={chip[1]} />
                <text x="48" y={y + 14.5} textAnchor="middle" fill={chip[1]} fontWeight="700">{level}</text>
                <text x="80" y={y + 15} fill="#5b6b82">{time}</text>
                <text x="168" y={y + 15} fill="#1c1c1c">{service}</text>
                <text x="250" y={y + 15} fill="#1c1c1c">{event}</text>
                <text x="390" y={y + 15} fill={hit ? "#1c1c1c" : "#999"} fontWeight={hit ? 700 : 400}>{`trace=${trace}`}</text>
              </g>
            );
          })}
          <T x={500} y={84} anchor="start" size={11} color="#1c1c1c" bold>filter: trace = abc</T>
          <T x={500} y={100} anchor="start">→ 3 lines from 3 services</T>
          <T x={500} y={116} anchor="start">→ one checkout&apos;s story</T>
        </svg>
        <p>
          <En>Logging is a mix: <strong>you write the line</strong>, OTel <strong>stamps the trace ID</strong> on it.</En>
          <Zh>日志是两者结合：<strong>你来写这一行</strong>，OTel 自动<strong>盖上 trace ID</strong>。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// Manual: you decide what to log, and at which level
logger.info({ orderId: 1001 }, "order created");
logger.error({ orderId: 1001, reason: "card_declined" }, "payment failed");`}
        />
        <CodeBlock
          language="json"
          code={`{ "level": "error", "msg": "payment failed", "orderId": 1001, "reason": "card_declined",
  "trace_id": "abc", "span_id": "s5" }`}
        />
        <ul>
          <li>
            <En><strong>Automatic:</strong> <code>trace_id</code> and <code>span_id</code> are added to every line, and the line is shipped to the log store.</En>
            <Zh><strong>自动：</strong>每一行都会加上 <code>trace_id</code> 和 <code>span_id</code>，并被发送到日志存储。</Zh>
          </li>
          <li>
            <En><strong>Manual:</strong> the message, the fields, and the level (<code>error</code> = a human should look, <code>info</code> = a normal event).</En>
            <Zh><strong>手动：</strong>消息内容、字段和级别（<code>error</code> = 需要人看，<code>info</code> = 正常事件）。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>Never log passwords, tokens, card numbers, or full request bodies.</En>
          <Zh>永远不要把密码、token、卡号或完整的请求体写进日志。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>2.3 Traces — package tracking for one request</En>
          <Zh>2.3 Traces——一个请求的&quot;快递追踪&quot;</Zh>
        </h4>
        <p>
          <En>A <strong>trace</strong> follows one request through every service, like a parcel&apos;s tracking page. Each step is a <strong>span</strong>: a timed operation with a start, a duration, and a parent.</En>
          <Zh><strong>trace</strong> 会跟着一个请求走过每个服务，就像快递的追踪页面。每一步叫一个 <strong>span</strong>：带开始时间、耗时和父节点的计时操作。</Zh>
        </p>
        <Waterfall
          spans={checkoutTrace}
          total={500}
          ticks={[0, 100, 200, 300, 400, 500]}
          label="A trace of POST /orders taking 480ms. Orders validates the cart (10ms) and selects products (18ms), then calls Inventory's POST /reserve, which takes 390ms — 370ms of it is an UPDATE waiting on a row lock. Then Payments charges the card (50ms) and Orders publishes an event (6ms)."
        />
        <p className="callout">
          <En>Read it: 370ms of the 480ms is one <code>UPDATE</code> waiting on a lock. Look there, nowhere else.</En>
          <Zh>读图：480ms 里有 370ms 花在一条在等锁的 <code>UPDATE</code> 上。只看这里，别处不用看。</Zh>
        </p>
        <p>
          <En>How does one trace follow a request across services? <strong>A header, added for you.</strong></En>
          <Zh>一条 trace 是怎么跟着请求跨过多个服务的？<strong>靠一个请求头，而且是自动加的。</strong></Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`POST /reserve            (orders calls inventory)
traceparent: 00-<trace id>-<parent span id>-01`}
        />
        <ul>
          <li>
            <En>The first service creates the trace ID. Each SDK adds the header to outgoing calls and reads it on incoming ones, so every service joins the same trace. You write no code.</En>
            <Zh>第一个服务生成 trace ID。每个 SDK 会在对外调用时加上这个请求头，收到请求时读取它，所以每个服务都会加入同一条 trace。你不用写任何代码。</Zh>
          </li>
          <li>
            <En>Traces are <strong>sampled</strong>: keep a small percentage, plus every error and every slow request.</En>
            <Zh>trace 会做<strong>采样</strong>：保留一小部分，再加上所有出错的和所有慢的请求。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.4 Side by side</En>
          <Zh>2.4 三者对比</Zh>
        </h4>
        <SignalsCompare />
        <p className="callout">
          <En>Debug in this order: <strong>metrics → traces → logs</strong>. The chart says something broke, the trace says where, the log says why.</En>
          <Zh>按这个顺序排查：<strong>metrics → traces → logs</strong>。图表告诉你出事了，trace 告诉你在哪，log 告诉你为什么。</Zh>
        </p>

        {/* ───────────────────────── 3. Tools ───────────────────────── */}
        <h3>
          <En>3. The tools: OpenTelemetry, the LGTM stack, and paid APM</En>
          <Zh>3. 工具：OpenTelemetry、LGTM 技术栈与付费 APM</Zh>
        </h3>
        <h4 className="topic">
          <En>3.1 OpenTelemetry — one standard for collecting</En>
          <Zh>3.1 OpenTelemetry——统一的采集标准</Zh>
        </h4>
        <p>
          <En>Every vendor used to ship its own agent and format. <strong>OpenTelemetry (OTel)</strong> is the open, vendor-neutral standard: instrument once, send the data anywhere.</En>
          <Zh>过去每家厂商都有自己的 agent 和格式。<strong>OpenTelemetry（OTel）</strong>是开放的、与厂商无关的标准：埋点一次，数据想发到哪都行。</Zh>
        </p>
        <p>
          <En>How does the data get collected? <strong>Mostly automatically.</strong></En>
          <Zh>数据是怎么被采集的？<strong>大部分是自动的。</strong></Zh>
        </p>
        <svg viewBox="0 0 680 112" role="img" aria-label="How OTel collects data. Inside your Node service, your code stays unchanged while the OTel SDK automatically wraps Express, HTTP, the database and the logger. The SDK pushes the data over OTLP to the OTel Collector, which listens on port 4318.">
          <rect x="10" y="14" width="408" height="88" rx="8" fill="none" stroke="#bbb" strokeDasharray="5,4" />
          <T x={20} y={11} anchor="start">your Node service</T>
          <Box x={24} y={34} w={130} h={52} kind="muted" label="Your code" sub="unchanged" />
          <Box x={196} y={34} w={206} h={52} kind="primary" label="OTel SDK" sub="auto-wraps Express · HTTP · DB · logger" />
          <Arrow d="M154,60 L194,60" />
          <Arrow d="M418,60 L498,60" />
          <T x={458} y={52}>push (OTLP)</T>
          <Box x={500} y={34} w={166} h={52} label="OTel Collector" sub="listens on :4318" />
        </svg>
        <CodeBlock
          language="typescript"
          code={`// otel.ts: loaded BEFORE the app starts (node --import ./otel.ts server.ts)
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

new NodeSDK({ instrumentations: [getNodeAutoInstrumentations()] }).start();`}
        />
        <CodeBlock
          language="bash"
          code={`OTEL_SERVICE_NAME=orders                              # who am I?
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318   # where to push the data`}
        />
        <ul>
          <li>
            <En><strong>Automatic:</strong> every request, database call and outgoing HTTP call becomes a span and metrics. Logs get the trace ID.</En>
            <Zh><strong>自动：</strong>每个请求、数据库调用和对外的 HTTP 调用都会变成 span 和 metrics。日志会自动带上 trace ID。</Zh>
          </li>
          <li>
            <En><strong>Manual (optional):</strong> your own spans and metrics, such as &quot;orders placed&quot;.</En>
            <Zh><strong>手动（可选）：</strong>你自己的 span 和 metrics，比如&quot;下单数&quot;。</Zh>
          </li>
          <li>
            <En>You write no sending code: the SDK pushes to the Collector for you.</En>
            <Zh>不需要写任何发送代码：SDK 会自动推送到 Collector。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>3.2 The LGTM stack — the open-source way to store and see it</En>
          <Zh>3.2 LGTM 技术栈——开源的存储与展示方案</Zh>
        </h4>
        <p>
          <En>OTel only <em>collects</em>. Grafana Labs&apos; open-source stack stores and shows it: <strong>LGTM</strong> — Loki, Grafana, Tempo, Mimir.</En>
          <Zh>OTel 只负责<em>采集</em>。Grafana Labs 的开源方案负责存储和展示：<strong>LGTM</strong>——Loki、Grafana、Tempo、Mimir。</Zh>
        </p>
        <svg viewBox="0 0 680 245" role="img" aria-label="The LGTM pipeline. The frontend, the Orders API, and the Inventory API each run the OpenTelemetry SDK and send data to an OTel Collector. The Collector routes logs to Loki, metrics to Mimir or Prometheus, and traces to Tempo. Grafana reads from all three to draw dashboards and fire alerts.">
          <Box x={20} y={20} w={120} h={44} label="Frontend" sub="OTel SDK" />
          <Box x={20} y={90} w={120} h={44} label="Orders API" sub="OTel SDK" />
          <Box x={20} y={160} w={120} h={44} label="Inventory API" sub="OTel SDK" />
          <Arrow d="M140,42 L188,98" />
          <Arrow d="M140,112 L188,112" />
          <Arrow d="M140,182 L188,126" />
          <Box x={190} y={80} w={120} h={64} kind="primary" label="OTel Collector" sub="receive · batch · route" />
          <Arrow d="M310,98 L358,42" />
          <Arrow d="M310,112 L358,112" />
          <Arrow d="M310,126 L358,182" />
          <Box x={360} y={20} w={140} h={44} kind="broker" label="Loki" sub="logs" />
          <Box x={360} y={90} w={140} h={44} kind="broker" label="Mimir / Prometheus" sub="metrics" size={11} />
          <Box x={360} y={160} w={140} h={44} kind="broker" label="Tempo" sub="traces" />
          <Arrow d="M500,42 L548,98" />
          <Arrow d="M500,112 L548,112" />
          <Arrow d="M500,182 L548,126" />
          <Box x={550} y={80} w={110} h={64} kind="ok" label="Grafana" sub="dashboards · alerts" />
          <T x={80} y={232} size={11} color="#1c1c1c" bold>1. Instrument</T>
          <T x={250} y={232} size={11} color="#1c1c1c" bold>2. Collect</T>
          <T x={430} y={232} size={11} color="#1c1c1c" bold>3. Store</T>
          <T x={605} y={232} size={11} color="#1c1c1c" bold>4. See + alert</T>
        </svg>
        <ul>
          <li>
            <En><strong>Grafana</strong> is the one you open: click from a spike on a chart, to the traces in that minute, to their logs.</En>
            <Zh><strong>Grafana</strong> 是你真正会打开的那个：从图表上的尖峰点到那一分钟的 traces，再点到对应的 logs。</Zh>
          </li>
          <li>
            <En><strong>Prometheus</strong> is the classic single-server metrics database. <strong>Mimir</strong> is the scaled-up version with the same query language.</En>
            <Zh><strong>Prometheus</strong> 是经典的单机 metrics 数据库；<strong>Mimir</strong> 是它的可横向扩展版本，查询语言相同。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>3.3 Paid APM tools: Datadog and New Relic</En>
          <Zh>3.3 付费 APM 工具：Datadog 与 New Relic</Zh>
        </h4>
        <p>
          <En>Two ways to get the same three signals:</En>
          <Zh>拿到同样三种信号，有两条路：</Zh>
        </p>
        <svg viewBox="0 0 680 150" role="img" aria-label="Two options. Build it yourself with OpenTelemetry and LGTM: free software, but you run it. Or buy it with an APM such as Datadog or New Relic: install an agent and it all works, but you pay per host or per GB. Both accept OpenTelemetry data, so you can switch without re-instrumenting.">
          <rect x="10" y="10" width="320" height="96" rx="8" fill="#eef8ee" stroke="#7dbb7d" strokeWidth="1.5" />
          <T x={170} y={34} size={13} color="#1c1c1c" bold>Build it: OTel + LGTM</T>
          <T x={170} y={58} size={11} color="#1c1c1c">free software</T>
          <T x={170} y={76} size={11} color="#1c1c1c">you run and maintain four systems</T>
          <T x={170} y={94} size={11} color="#2e7d32">no lock-in</T>
          <rect x="350" y="10" width="320" height="96" rx="8" fill="#fff7e0" stroke="#e8b400" strokeWidth="1.5" />
          <T x={510} y={34} size={13} color="#1c1c1c" bold>Buy it: Datadog / New Relic</T>
          <T x={510} y={58} size={11} color="#1c1c1c">install an agent, done</T>
          <T x={510} y={76} size={11} color="#1c1c1c">pay per host / per GB, which adds up</T>
          <T x={510} y={94} size={11} color="#9a6b00">some lock-in</T>
          <T x={340} y={134} size={11} color="#1c1c1c" bold>Both accept OTel data, so you can switch without re-instrumenting.</T>
        </svg>
        <p className="callout">
          <En>Also common: <strong>Splunk</strong> for searching huge volumes of logs, <strong>Sentry</strong> for app errors and crashes, <strong>PagerDuty</strong> for paging whoever is on call.</En>
          <Zh>同样常见的还有：<strong>Splunk</strong>，用来搜索海量日志；<strong>Sentry</strong>，抓应用错误和崩溃；<strong>PagerDuty</strong>，负责通知当前 on-call 的人。</Zh>
        </p>

        {/* ───────────────────────── 4. Putting the tools to work ───────────────────────── */}
        <h3>
          <En>4. Putting the tools to work</En>
          <Zh>4. 让这些工具真正派上用场</Zh>
        </h3>
        <p>
          <En>Collecting data is not the goal. Metrics tell you where to look, and then you do one of two things:</En>
          <Zh>收集数据本身不是目的。metrics 告诉你该往哪里看，然后你做下面两件事之一：</Zh>
        </p>
        <UsesFork />

        <h4 className="topic">
          <En>4.1 Finding and fixing bottlenecks</En>
          <Zh>4.1 找出并解决瓶颈</Zh>
        </h4>
        <p>
          <En>Watch latency and saturation. When one crosses a line, you either <strong>scale</strong> or <strong>fix</strong>:</En>
          <Zh>盯着延迟和饱和度。一旦越线，你要么<strong>扩容</strong>，要么<strong>优化</strong>：</Zh>
        </p>
        <ul>
          <li>
            <En><strong>Scale:</strong> traffic grew and the code is fine. Add capacity.</En>
            <Zh><strong>扩容：</strong>流量涨了，代码没问题。增加容量。</Zh>
          </li>
          <li>
            <En><strong>Fix:</strong> one layer is inefficient. Make it faster.</En>
            <Zh><strong>优化：</strong>某一层效率低。让它变快。</Zh>
          </li>
        </ul>

        <p>
          <En><strong>Scale automatically</strong> — on AWS, an Auto Scaling Group does it for you:</En>
          <Zh><strong>自动扩容</strong>——在 AWS 上，Auto Scaling Group 会替你完成：</Zh>
        </p>
        <AutoScaling />
        <ul>
          <li>
            <En>A <strong>CloudWatch</strong> alarm watches a metric (CPU, or requests per server).</En>
            <Zh><strong>CloudWatch</strong> 告警盯着某个 metric（CPU，或每台服务器的请求数）。</Zh>
          </li>
          <li>
            <En>Past the line, the group <strong>adds servers</strong>; when traffic drops, it removes them.</En>
            <Zh>越线后，Auto Scaling Group <strong>自动加服务器</strong>；流量回落后再自动减掉。</Zh>
          </li>
          <li>
            <En>Kubernetes has the same idea: the Horizontal Pod Autoscaler.</En>
            <Zh>Kubernetes 也有同样的机制：Horizontal Pod Autoscaler。</Zh>
          </li>
        </ul>

        <p>
          <En><strong>Fix the slow layer</strong> — metrics say <em>that</em> it is slow, the trace says <em>where</em>:</En>
          <Zh><strong>优化慢的那一层</strong>——metrics 告诉你<em>有多慢</em>，trace 告诉你<em>慢在哪</em>：</Zh>
        </p>
        <FixLayers />
        <ul>
          <li>
            <En>A slow endpoint could be the database, your code, or an outside call. Metrics alone cannot tell.</En>
            <Zh>一个慢接口可能慢在数据库、你的代码或外部调用。光看 metrics 分不出来。</Zh>
          </li>
          <li>
            <En>Take one slow request&apos;s trace ID, open its trace: the <strong>longest span</strong> is the layer to fix. Section 6 goes deeper.</En>
            <Zh>拿一个慢请求的 trace ID 打开它的 trace：<strong>最长的那个 span</strong> 就是要优化的那一层。第 6 节会讲得更深入。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>Do both, before and after: load-test ahead of time to learn your limit, alert below it, then scale or fix when the alert fires.</En>
          <Zh>事前和事后都要做：提前压测，摸清系统极限；告警设在极限之下；告警触发后再扩容或优化。</Zh>
        </p>

        <h4 className="topic">
          <En>4.2 Debugging a bug with logs and traces</En>
          <Zh>4.2 用 logs 和 traces 排查 bug</Zh>
        </h4>
        <p>
          <En>Example: users report that placing an order fails.</En>
          <Zh>例子：用户反馈下单失败。</Zh>
        </p>
        <ErrorMetric />
        <BugFlow />
        <ul>
          <li>
            <En><strong>Metric:</strong> something is failing. <strong>Logs:</strong> what the error says, plus the trace ID. <strong>Trace:</strong> exactly where it broke.</En>
            <Zh><strong>Metric：</strong>有东西在失败。<strong>Logs：</strong>错误信息是什么，以及 trace ID。<strong>Trace：</strong>具体崩在哪里。</Zh>
          </li>
          <li>
            <En>Root cause here: some products have no bulk discount, and the code assumed every product did.</En>
            <Zh>根因：有些商品没有批量折扣，而代码默认每个商品都有。</Zh>
          </li>
        </ul>
        <CodeBlock
          language="typescript"
          bad={[1]}
          good={[3]}
          code={`const percent = product.bulkDiscount.percent;          // crashes when there is no discount

const percent = product.bulkDiscount?.percent ?? 0;    // no discount means 0%`}
        />
        <p className="callout">
          <En>After every incident, ask: what signal would have caught this sooner? Then add that metric or alert.</En>
          <Zh>每次事故之后都问一句：什么信号能更早发现它？然后把那个 metric 或告警加上。</Zh>
        </p>

        <h4 className="topic">
          <En>4.3 Reference: more common production bugs</En>
          <Zh>4.3 参考：更多常见的生产 bug</Zh>
        </h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Bug</En><Zh>Bug</Zh></th>
              <th><En>What you see in monitoring</En><Zh>监控里看到什么</Zh></th>
              <th><En>Fix</En><Zh>修复</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>A bad release</En><Zh>有问题的发布</Zh></td>
              <td><En>Error rate or latency jumps at the exact minute of a deploy (dashboards mark deploys as lines)</En><Zh>错误率或延迟恰好在部署那一分钟跳升（仪表盘会把部署标成竖线）</Zh></td>
              <td><En>Roll back first, debug after</En><Zh>先 rollback，再排查</Zh></td>
            </tr>
            <tr>
              <td><En>Unexpected data shape</En><Zh>数据格式不符合预期</Zh></td>
              <td><En>Sentry / browser errors: <code>Cannot read properties of null (reading &apos;map&apos;)</code>. The trace shows the API returned <code>null</code> instead of <code>[]</code></En><Zh>Sentry / 浏览器报错：<code>Cannot read properties of null (reading &apos;map&apos;)</code>。trace 显示 API 返回了 <code>null</code> 而不是 <code>[]</code></Zh></td>
              <td><En>Fix the API contract; guard the frontend (<code>data ?? []</code>)</En><Zh>修正 API 约定；前端做兜底（<code>data ?? []</code>）</Zh></td>
            </tr>
            <tr>
              <td><En>Slow or failing dependency</En><Zh>依赖服务变慢或失败</Zh></td>
              <td><En>Traces show one long span calling a third-party API; timeouts in the logs</En><Zh>trace 中调用第三方 API 的 span 特别长；日志里有超时</Zh></td>
              <td><En>Timeouts, retries, a fallback, or move the call to a background queue</En><Zh>加超时、重试、降级方案，或把调用挪到后台队列</Zh></td>
            </tr>
            <tr>
              <td><En>Memory leak</En><Zh>内存泄漏</Zh></td>
              <td><En>Memory metric climbs steadily, the container is killed and restarts, repeat (a saw-tooth chart)</En><Zh>内存曲线持续上升，container 被杀掉重启，周而复始（锯齿形曲线）</Zh></td>
              <td><En>Take a heap snapshot; look for an ever-growing cache, array, or event listener</En><Zh>抓 heap snapshot；查找不断增长的缓存、数组或事件监听器</Zh></td>
            </tr>
            <tr>
              <td><En>Only some users</En><Zh>只影响部分用户</Zh></td>
              <td><En>Group errors by browser, region, or account: e.g. 100% of failures are Safari, or one tenant</En><Zh>按浏览器、地区或账号对错误分组：比如 100% 的失败都来自 Safari，或某一个租户</Zh></td>
              <td><En>Reproduce in that exact environment; ask the reporter for steps</En><Zh>在完全相同的环境下复现；请报告人提供操作步骤</Zh></td>
            </tr>
            <tr>
              <td><En>Race condition</En><Zh>竞态条件</Zh></td>
              <td><En>Impossible data (stock is −1). Logs show two requests milliseconds apart; their traces overlap</En><Zh>出现不可能的数据（库存为 −1）。日志显示两个请求相隔几毫秒；它们的 trace 互相重叠</Zh></td>
              <td><En>Make the check-and-write atomic: one SQL statement, <code>UPDATE ... WHERE quantity &gt;= 1</code></En><Zh>让&quot;检查 + 写入&quot;变成原子操作：一条 SQL，<code>UPDATE ... WHERE quantity &gt;= 1</code></Zh></td>
            </tr>
          </tbody>
        </table>

        {/* ───────────────────────── 5. Frontend performance ───────────────────────── */}
        <h3>
          <En>5. Frontend performance: Core Web Vitals</En>
          <Zh>5. 前端性能：Core Web Vitals</Zh>
        </h3>
        <p>
          <En>Bottlenecks exist on the frontend too. There, &quot;fast&quot; means Google&apos;s three <strong>Core Web Vitals</strong>:</En>
          <Zh>前端同样有性能瓶颈。在前端，&quot;快&quot;指的是 Google 的三项 <strong>Core Web Vitals</strong>：</Zh>
        </p>
        <svg viewBox="0 0 680 222" role="img" aria-label="Three phone screens. LCP: the largest element, a hero image, is what the user waits to see; good is 2.5 seconds or less. INP: the user taps Add to cart and the page is frozen for 320ms before the cart updates; good is 200ms or less. CLS: a late-loading banner pushes the Buy button down, so the user taps the wrong thing; good is 0.1 or less.">
          {/* LCP */}
          <T x={110} y={16} size={11} color="#1c1c1c" bold>LCP — loading</T>
          <rect x="10" y="26" width="200" height="156" rx="10" fill="#fff" stroke="#bbb" />
          <rect x="22" y="38" width="176" height="14" rx="3" fill="#f5f5f5" />
          <rect x="22" y="60" width="176" height="76" rx="4" fill="#fff7e0" stroke="#e8b400" />
          <T x={110} y={94} color="#1c1c1c" bold>largest element</T>
          <T x={110} y={108}>(hero image)</T>
          <rect x="22" y="146" width="140" height="7" rx="3" fill="#e5e5e5" />
          <rect x="22" y="160" width="110" height="7" rx="3" fill="#e5e5e5" />
          <T x={110} y={198}>when does the biggest thing appear?</T>
          <T x={110} y={212} color="#3d8b40" bold>good ≤ 2.5s</T>
          {/* INP */}
          <T x={340} y={16} size={11} color="#1c1c1c" bold>INP — responsiveness</T>
          <rect x="240" y="26" width="200" height="156" rx="10" fill="#fff" stroke="#bbb" />
          <rect x="290" y="46" width="100" height="28" rx="5" fill="#eef3ff" stroke="#7ea6e0" />
          <T x={340} y={64} color="#1c1c1c" bold>Add to cart</T>
          <Arrow d="M340,76 L340,124" ink="red" dashed />
          <T x={348} y={104} anchor="start" color="#c0392b">320ms frozen</T>
          <rect x="280" y="128" width="120" height="26" rx="5" fill="#eef8ee" stroke="#7dbb7d" />
          <T x={340} y={145} color="#1c1c1c">Cart: 1 item</T>
          <T x={340} y={198}>tap → how long until the screen reacts?</T>
          <T x={340} y={212} color="#3d8b40" bold>good ≤ 200ms</T>
          {/* CLS */}
          <T x={570} y={16} size={11} color="#1c1c1c" bold>CLS — visual stability</T>
          <rect x="470" y="26" width="200" height="156" rx="10" fill="#fff" stroke="#bbb" />
          <rect x="482" y="38" width="176" height="32" rx="4" fill="#fdf3f3" stroke="#d98b8b" strokeDasharray="4,3" />
          <T x={570} y={58} color="#c0392b">late-loading banner</T>
          <rect x="520" y="80" width="100" height="24" rx="5" fill="none" stroke="#bbb" strokeDasharray="4,3" />
          <T x={570} y={96} color="#999">Buy (was here)</T>
          <Arrow d="M570,106 L570,134" ink="red" />
          <T x={578} y={124} anchor="start" color="#c0392b">mis-tap!</T>
          <rect x="520" y="136" width="100" height="24" rx="5" fill="#eef3ff" stroke="#7ea6e0" />
          <T x={570} y={152} color="#1c1c1c" bold>Buy</T>
          <T x={570} y={198}>how much does the layout jump?</T>
          <T x={570} y={212} color="#3d8b40" bold>good ≤ 0.1</T>
        </svg>

        <h4 className="topic topic-line">
          <En>5.1 Improving LCP — the page loads slowly</En>
          <Zh>5.1 优化 LCP——页面加载慢</Zh>
        </h4>
        <p>
          <En>Slow to appear means a slow network trip, or too much to download before anything shows.</En>
          <Zh>出现得慢，说明网络往返慢，或者在显示任何内容之前要下载的东西太多。</Zh>
        </p>
        <CauseFix
          label="LCP causes and fixes. Server far away: use a CDN and browser caching. JavaScript bundle too big: code splitting and lazy loading. Heavy dependencies: use a bundle analyzer and drop heavy libraries. Huge images: WebP or AVIF at the right size, lazy-loading below the fold but never the hero image. Slow API before first render: fix or cache the API, or show the page shell first."
          rows={[
            ["Server is far away", "CDN + browser caching", "copies of your files near the user; repeat visits skip the download"],
            ["JS bundle is too big", "Code splitting + lazy loading", "ship only what this page needs, load the rest later"],
            ["Heavy dependencies", "Bundle analyzer", "see what is inside the bundle, drop the heavy libraries"],
            ["Huge images", "WebP / AVIF, the right size", "lazy-load below the fold, but never the hero image"],
            ["Slow API before first render", "Fix or cache the API", "or show the page shell first and stream the data in (section 6)"],
          ]}
        />
        <p>
          <En><strong>CDN:</strong> a user in Tokyo downloads from Tokyo, not Virginia.</En>
          <Zh><strong>CDN：</strong>东京的用户从东京下载，而不是从弗吉尼亚。</Zh>
        </p>
        <CdnMap />
        <p>
          <En><strong>Lazy loading:</strong> the admin page&apos;s code is only downloaded when someone opens it.</En>
          <Zh><strong>懒加载：</strong>管理后台页面的代码，只有在有人打开它时才会下载。</Zh>
        </p>
        <CodeBlock
          code={`import { lazy, Suspense } from "react";

const AdminDashboard = lazy(() => import("./AdminDashboard")); // split into its own file

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}`}
        />

        <h4 className="topic topic-line">
          <En>5.2 Improving INP — the page reacts slowly</En>
          <Zh>5.2 优化 INP——页面响应慢</Zh>
        </h4>
        <p>
          <En>The browser has <strong>one main thread</strong>. While your JavaScript is busy, a click has to wait.</En>
          <Zh>浏览器只有<strong>一个主线程</strong>。你的 JavaScript 在忙的时候，点击就得等着。</Zh>
        </p>
        <MainThread />
        <CodeBlock
          bad={[2]}
          good={[5, 6]}
          code={`// BEFORE: filters 20,000 products on every keystroke, so typing waits
const results = filterBy(products, query);

// AFTER: the input updates now, the list catches up a moment later
const deferred = useDeferredValue(query);
const results = useMemo(() => filterBy(products, deferred), [products, deferred]);`}
        />
        <CauseFix
          label="INP causes and fixes. Unnecessary re-renders: React.memo, useMemo, useCallback, found with the React DevTools Profiler. Thousands of rows rendered: virtualize the list with react-window. Heavy work on every keystroke: debounce or useDeferredValue. Pure computation: move it to a Web Worker. Refetching the same data: cache API responses with TanStack Query or SWR."
          rows={[
            ["Unnecessary re-renders", "React.memo · useMemo · useCallback", "the Profiler finds them; the React Compiler can add them for you"],
            ["Thousands of rows rendered", "Virtualize the list", "react-window: render only the rows on screen"],
            ["Heavy work on every keystroke", "Debounce · useDeferredValue", "typing stays responsive"],
            ["Pure computation", "Web Worker", "move it off the main thread"],
            ["Refetching the same data", "API caching", "TanStack Query / SWR: revisits show cached data, not a spinner"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>5.3 Improving CLS — the page jumps around</En>
          <Zh>5.3 优化 CLS——页面跳来跳去</Zh>
        </h4>
        <p>
          <En>Content that shows up <em>without reserved space</em> pushes everything down. The fix is always the same: <strong>reserve the space first</strong>.</En>
          <Zh>内容<em>没有预留空间</em>就冒出来，会把下面的一切往下推。修复思路永远一样：<strong>先预留空间</strong>。</Zh>
        </p>
        <CauseFix
          label="CLS causes and fixes. Images and video: set width and height or aspect-ratio. Async content such as ads, banners and API data: a skeleton or fixed-height slot. New content inserted above: add it below, or after the user asks. Web fonts swapping in: preload them and use a similar fallback font."
          rows={[
            ["Images and video", "width + height (or aspect-ratio)", "the browser reserves the box before the file arrives"],
            ["Async content: ads, banners, data", "Skeleton or fixed-height slot", "the same size as the real content"],
            ["New content inserted above", "Add it below, or after the user asks", "never push what they are reading"],
            ["Web fonts swapping in", "Preload + a similar fallback font", "so the text does not reflow"],
          ]}
        />
        <CodeBlock
          language="xml"
          bad={[1]}
          good={[2]}
          code={`<img src="/hero.jpg" alt="Summer sale" />
<img src="/hero.jpg" alt="Summer sale" width="1200" height="600" />`}
        />

        <h4 className="topic topic-line">
          <En>5.4 Tools for measuring frontend performance</En>
          <Zh>5.4 测量前端性能的工具</Zh>
        </h4>
        <LabVsField />
        <p>
          <En>Building field data yourself takes a few lines with Google&apos;s <code>web-vitals</code> library:</En>
          <Zh>自己搭建现场数据，用 Google 的 <code>web-vitals</code> 库只要几行：</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

// Each real visitor reports their own numbers.
function report(metric: Metric) {
  const body = JSON.stringify({ name: metric.name, value: metric.value, page: location.pathname });
  navigator.sendBeacon("/api/vitals", body);
}

onLCP(report);
onINP(report);
onCLS(report);`}
        />

        {/* ───────────────────────── 6. Slow API ───────────────────────── */}
        <h3>
          <En>6. Backend performance: &quot;How do you fix a slow API?&quot;</En>
          <Zh>6. 后端性能：&quot;如何优化一个慢接口？&quot;</Zh>
        </h3>
        <p>
          <En>One of the most common interview questions. The wrong answer is jumping to a fix (&quot;add Redis!&quot;). The right answer is: <strong>measure, find the bottleneck layer by layer, fix the biggest one, measure again.</strong></En>
          <Zh>最常见的面试题之一。错误的回答是直接跳到解决方案（&quot;加 Redis！&quot;）。正确的回答是：<strong>先测量，逐层找出瓶颈，修复最大的那个，再测量一次。</strong></Zh>
        </p>

        <h4 className="topic">
          <En>Step 1 — Confirm and scope it with metrics</En>
          <Zh>第 1 步——用 metrics 确认并界定问题</Zh>
        </h4>
        <ul>
          <li>
            <En>Which endpoint? Is it the p95 or every request? Since when — did it start with a deploy, or grow with traffic?</En>
            <Zh>哪个接口？是 p95 慢还是所有请求都慢？从什么时候开始——是某次部署之后，还是随着流量增长慢慢变慢？</Zh>
          </li>
          <li>
            <En>Is it every user, or only big accounts with lots of data? That alone often points at the database.</En>
            <Zh>是所有用户都慢，还是只有数据量大的账号慢？光这一点往往就指向了数据库。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>Step 2 — Open a slow trace and see where the time goes</En>
          <Zh>第 2 步——打开一条慢 trace，看时间花在哪</Zh>
        </h4>
        <Waterfall
          spans={slowApiTrace}
          total={1850}
          ticks={[0, 500, 1000, 1500]}
          label="A trace of GET /orders taking 1,850ms. Auth takes 15ms and SELECT orders 40ms. Then 50 separate SELECT order_items queries run one after another, adding up to 1,400ms — an N+1 problem. A call to pricing-service takes 345ms, and serializing JSON takes 50ms."
        />
        <p>
          <En>Now you are not guessing. 1,400ms of 1,850ms is fifty tiny queries in a row — fix that first. The pricing call is the second target.</En>
          <Zh>现在不用再猜了。1,850ms 里有 1,400ms 是连续五十条小查询——先修这个。pricing 调用是第二个目标。</Zh>
        </p>

        <h4 className="topic">
          <En>Step 3 — Fix the layer the trace points at</En>
          <Zh>第 3 步——修复 trace 指向的那一层</Zh>
        </h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Layer</En><Zh>层</Zh></th>
              <th><En>What the trace shows</En><Zh>trace 中的表现</Zh></th>
              <th><En>Typical fixes</En><Zh>常见修复</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Database</En><Zh>数据库</Zh></td>
              <td><En>One long query span, or many short identical ones (N+1)</En><Zh>一个很长的查询 span，或很多个相同的短查询（N+1）</Zh></td>
              <td><En>Index the slow query; replace N+1 with a join or one batched query; paginate; tune the connection pool</En><Zh>为慢查询加 index；用 join 或一次批量查询替代 N+1；分页；调整连接池</Zh></td>
            </tr>
            <tr>
              <td><En>Application code</En><Zh>应用代码</Zh></td>
              <td><En>A long span with no child spans — the code itself is busy</En><Zh>一个很长却没有子 span 的 span——代码本身在忙</Zh></td>
              <td><En>Better algorithm; <strong>cache</strong> expensive results; send less data; move slow non-urgent work to a background queue</En><Zh>换更好的算法；<strong>缓存</strong>昂贵的计算结果；减少返回的数据量；把慢且不紧急的工作挪到后台队列</Zh></td>
            </tr>
            <tr>
              <td><En>External services</En><Zh>外部服务</Zh></td>
              <td><En>A long HTTP span to another service or third-party API</En><Zh>调用其他服务或第三方 API 的 HTTP span 很长</Zh></td>
              <td><En>Cache its responses; run independent calls in parallel; set timeouts; call it asynchronously</En><Zh>缓存它的响应；把互不依赖的调用并行执行；设置超时；改成异步调用</Zh></td>
            </tr>
            <tr>
              <td><En>Resources</En><Zh>资源</Zh></td>
              <td><En>Everything is slow at once; spans wait before starting; CPU, memory, or pool metrics are maxed</En><Zh>所有东西同时变慢；span 开始前有等待；CPU、内存或连接池指标打满</Zh></td>
              <td><En>Scale out (more replicas), fix the leak, raise limits</En><Zh>横向扩容（更多副本）、修复泄漏、提高上限</Zh></td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">
          <En>Database: the most common culprit</En>
          <Zh>数据库：最常见的罪魁祸首</Zh>
        </h4>
        <ul>
          <li>
            <En><strong>Find the slow query.</strong> The trace span shows the exact SQL; Postgres&apos;s <code>pg_stat_statements</code> ranks every query by total time.</En>
            <Zh><strong>找到慢查询。</strong>trace 的 span 里有完整 SQL；Postgres 的 <code>pg_stat_statements</code> 会按总耗时给所有查询排序。</Zh>
          </li>
          <li>
            <En><strong>Ask the database why.</strong> <code>EXPLAIN ANALYZE</code> shows how it ran the query. A <code>Seq Scan</code> that throws away almost every row means it read the whole table — it needs an index.</En>
            <Zh><strong>问数据库为什么慢。</strong><code>EXPLAIN ANALYZE</code> 会展示查询的执行方式。如果看到 <code>Seq Scan</code> 并且几乎丢弃了所有行，说明它扫了整张表——需要加 index。</Zh>
          </li>
          <li>
            <En><strong>N+1:</strong> one query for the list, then one more per item. Fetch them all in one query with a join or <code>WHERE id IN (...)</code>.</En>
            <Zh><strong>N+1：</strong>先一条查询取列表，然后每一项再查一次。改成用 join 或 <code>WHERE id IN (...)</code> 一次查完。</Zh>
          </li>
          <li>
            <En><strong>Deep pagination:</strong> <code>OFFSET 10000</code> still reads 10,000 rows to skip them; keyset (cursor) pagination jumps straight there.</En>
            <Zh><strong>深度分页：</strong><code>OFFSET 10000</code> 仍然要读 10,000 行再丢掉；keyset（cursor）分页可以直接跳过去。</Zh>
          </li>
        </ul>
        <CodeBlock
          language="plaintext"
          code={`EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;

-- before: read all 2 million rows to find 37
Seq Scan on orders  (actual time=0.02..812.40 rows=37)
  Filter: (customer_id = 42)
  Rows Removed by Filter: 1999963

-- after CREATE INDEX ON orders (customer_id): jump straight to the 37
Index Scan using orders_customer_id_idx on orders  (actual time=0.03..0.30 rows=37)`}
        />

        <h4 className="topic">
          <En>Application and external calls: cache and parallelize</En>
          <Zh>应用层与外部调用：缓存与并行</Zh>
        </h4>
        <CodeBlock
          language="typescript"
          code={`// Cache-aside: check a fast in-memory store (Redis) before doing the slow work.
async function getProduct(id: string) {
  const key = "product:" + id;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);              // fast path: ~1ms

  const product = await db.products.findById(id);     // slow path: ~50ms
  await redis.set(key, JSON.stringify(product), { EX: 300 });   // keep for 5 minutes
  return product;
}`}
        />
        <CodeBlock
          language="typescript"
          bad={[3, 4, 5]}
          good={[10]}
          code={`async function loadDashboard(id: string) {
  // one after another: 300ms + 250ms + 200ms = 750ms
  const user = await getUser(id);
  const orders = await getOrders(id);
  const recs = await getRecommendations(id);
  return { user, orders, recs };
}

async function loadDashboardFast(id: string) {
  const [user, orders, recs] = await Promise.all([getUser(id), getOrders(id), getRecommendations(id)]);
  return { user, orders, recs }; // independent calls side by side: ~300ms, the slowest one
}`}
        />
        <p className="callout">
          <En>Caching makes reads fast but adds a new problem: stale data. Always decide how long an entry may live, and what clears it when the data changes.</En>
          <Zh>缓存让读取变快，但也带来新问题：数据过期。一定要想清楚每条缓存能活多久，以及数据变化时由谁来清除它。</Zh>
        </p>

        <h4 className="topic">
          <En>Step 4 — Measure again</En>
          <Zh>第 4 步——再测量一次</Zh>
        </h4>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>Compare p95 on the dashboard before and after the release. If the number didn&apos;t move, the fix didn&apos;t matter — no matter how clever it was.</En>
              <Zh>对比发布前后仪表盘上的 p95。如果数字没动，那么不管修复多巧妙，它都没起作用。</Zh>
            </li>
            <li>
              <En>The full interview answer, in one line: <strong>metrics to find which endpoint, a trace to find which layer, the right tool for that layer (EXPLAIN, caching, parallel calls, scaling), then metrics again to prove it.</strong></En>
              <Zh>一句话版本的面试回答：<strong>用 metrics 找到哪个接口，用 trace 找到哪一层，针对那一层用对工具（EXPLAIN、缓存、并行调用、扩容），最后再用 metrics 证明效果。</strong></Zh>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
