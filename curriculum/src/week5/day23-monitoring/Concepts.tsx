import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 23 — Concepts Reference</title>
      <DayNav day="day23-monitoring" current="concepts" />
      <h1>Day 23 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you&apos;re shaky on any of these, that&apos;s the priority to fix.
        </p>

        <details>
          <summary>What are monitoring and observability tools actually for?</summary>
          <div className="answer">
            <p>
              Three jobs: detect that something is broken before users report it, debug where and why it broke, and find performance bottlenecks so the frontend and backend can be made faster. Monitoring watches for problems you expect; observability lets you answer questions you didn&apos;t predict from the data you already collect.
            </p>
          </div>
        </details>

        <details>
          <summary>What are metrics, logs, and traces, and what question does each answer?</summary>
          <div className="answer">
            <p>
              Metrics are numbers over time (request rate, error rate, p95 latency) and answer <em>is</em> something wrong and since when. Traces follow one request through every service as timed spans and answer <em>where</em>. Logs are detailed structured events and answer <em>what exactly</em> happened. Debugging usually goes metrics → traces → logs.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between a trace and a span?</summary>
          <div className="answer">
            <p>
              A trace is one request&apos;s whole journey across services; a span is one timed step inside it (a DB query, an HTTP call) with a start time, a duration, and a parent. Reading the span waterfall shows exactly which step the time went into.
            </p>
          </div>
        </details>

        <details>
          <summary>How do logs from different services get connected to one request?</summary>
          <div className="answer">
            <p>
              A trace ID is created at the first service and passed along in request (or message) headers. Every span and every log line carries it, so filtering by that ID turns logs from many services into one request&apos;s story.
            </p>
          </div>
        </details>

        <details>
          <summary>What is OpenTelemetry, and why does it matter?</summary>
          <div className="answer">
            <p>
              The open, vendor-neutral standard for producing metrics, logs, and traces. You instrument once with OTel and can send the data to any backend — LGTM, Datadog, New Relic — instead of re-instrumenting every service when you switch vendors.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the LGTM stack?</summary>
          <div className="answer">
            <p>
              Grafana Labs&apos; open-source observability stack: Loki stores logs, Mimir (or Prometheus) stores metrics, Tempo stores traces, and Grafana is the dashboard and alerting layer over all three. OpenTelemetry collects the data and the OTel Collector routes each signal to its store.
            </p>
          </div>
        </details>

        <details>
          <summary>What is an APM tool, and how does it compare to self-hosting LGTM?</summary>
          <div className="answer">
            <p>
              Application Performance Monitoring tools like Datadog and New Relic give you logs, metrics, traces, dashboards, alerts, and browser monitoring as one paid service — install an agent and go. Self-hosted LGTM is free software with no lock-in, but you run and maintain it yourself.
            </p>
          </div>
        </details>

        <details>
          <summary>How would you use monitoring tools to debug a production bug?</summary>
          <div className="answer">
            <p>
              An alert or a metric shows when it started and how bad it is (roll back first if a release caused something serious). A trace of a failing request shows which service and step; its logs show the exact error and inputs. Then reproduce it locally, fix it with a test, ship it through the pipeline, and confirm the metric recovers.
            </p>
          </div>
        </details>

        <details>
          <summary>Why look at p95/p99 latency instead of the average?</summary>
          <div className="answer">
            <p>
              An average hides the tail — 200ms on average can include 5% of users waiting 8 seconds. p95 means 95% of requests are faster than that number, so it describes the users actually having a bad time.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the Core Web Vitals?</summary>
          <div className="answer">
            <p>
              LCP (Largest Contentful Paint): how fast the main content loads, good ≤ 2.5s. INP (Interaction to Next Paint): how fast the page reacts to a click or keypress, good ≤ 200ms. CLS (Cumulative Layout Shift): how much the layout jumps, good ≤ 0.1.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you improve LCP?</summary>
          <div className="answer">
            <p>
              Serve static files from a CDN with long caching, shrink the JavaScript with code splitting and lazy loading (a bundle analyzer shows what&apos;s heavy), compress and right-size images without lazy-loading the hero, and speed up any API the first render waits on.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you improve INP?</summary>
          <div className="answer">
            <p>
              Keep the main thread free: avoid unnecessary re-renders (Profiler, <code>memo</code>, <code>useMemo</code>), virtualize long lists, debounce or defer heavy work on input, move pure computation into a Web Worker, and cache API data so pages don&apos;t refetch.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you improve CLS?</summary>
          <div className="answer">
            <p>
              Reserve space before content arrives: give images <code>width</code>/<code>height</code> or <code>aspect-ratio</code>, use skeletons or fixed-size slots for async content and ads, never insert content above what the user is reading, and preload fonts.
            </p>
          </div>
        </details>

        <details>
          <summary>What tools measure frontend performance?</summary>
          <div className="answer">
            <p>
              Lighthouse for a quick lab score of one page; the DevTools Performance panel and React Profiler to find the slow function or component; and RUM (Datadog RUM, New Relic Browser, or the <code>web-vitals</code> library reporting to your own backend) for field data from real users.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you fix a slow API?</summary>
          <div className="answer">
            <p>
              Measure first: use metrics to find which endpoint and since when. Open a slow trace to see which layer takes the time — database, application code, external call, or saturated resources. Fix that layer (index or fix N+1, cache, parallelize, scale), then compare p95 before and after.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you find and fix a slow database query?</summary>
          <div className="answer">
            <p>
              Find it from the trace&apos;s DB span or <code>pg_stat_statements</code>, then run <code>EXPLAIN ANALYZE</code>. A <code>Seq Scan</code> discarding most rows means a missing index; many identical small queries mean N+1, fixed with a join or one batched query. Re-run <code>EXPLAIN ANALYZE</code> to confirm.
            </p>
          </div>
        </details>

      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today&apos;s lecture covered — mostly
          &quot;gotcha&quot; interview trivia and things that sharpen how you code without being
          asked often.
        </p>

        <details>
          <summary>What are the four golden signals?</summary>
          <div className="answer">
            <p>
              Latency, traffic, errors, and saturation. Watching those four covers nearly every way a request-serving service degrades.
            </p>
          </div>
        </details>

        <details>
          <summary>Why alert on symptoms rather than causes?</summary>
          <div className="answer">
            <p>
              Users feel error rate and latency, not CPU. High CPU with fast responses is just a busy server, and paging on it teaches the team to ignore alerts.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between Prometheus and Mimir?</summary>
          <div className="answer">
            <p>
              Prometheus is the classic single-server metrics database and query language. Mimir is a horizontally scalable, long-term store that speaks the same query language, used when one Prometheus can&apos;t hold all the data.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between lab data and field data?</summary>
          <div className="answer">
            <p>
              Lab data (Lighthouse) is one test run on a simulated device — repeatable, good for catching regressions. Field data (RUM) comes from real users on real phones and networks, and is what Google actually uses to judge your Web Vitals.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a CDN, and why does it help?</summary>
          <div className="answer">
            <p>
              A network of servers around the world holding copies of your static files. Users download from the nearest one, cutting network latency, and the origin server handles far less traffic.
            </p>
          </div>
        </details>

        <details>
          <summary>What is code splitting, and how does <code>React.lazy</code> help?</summary>
          <div className="answer">
            <p>
              Breaking the bundle into chunks so the browser downloads only the code the current page needs. <code>React.lazy(() =&gt; import(...))</code> puts a component in its own chunk that loads when it first renders, inside a <code>Suspense</code> boundary.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is the N+1 problem so easy to miss, and how does a trace reveal it?</summary>
          <div className="answer">
            <p>
              Each query is fast on its own, so nothing looks slow in isolation. In a trace it shows up as a long staircase of identical short DB spans — fifty 28ms queries that add up to 1.4 seconds.
            </p>
          </div>
        </details>

        <details>
          <summary>What is cache-aside, and what problem does caching introduce?</summary>
          <div className="answer">
            <p>
              Check the cache first; on a miss, read the slow source and store the result with an expiry. The new problem is stale data — you must decide how long entries live and invalidate them when the data changes.
            </p>
          </div>
        </details>

        <details>
          <summary>Why should traces be sampled, and which ones should you keep?</summary>
          <div className="answer">
            <p>
              Storing every trace is expensive at scale. Keep a small random percentage plus every error and every slow request — the ones you&apos;ll actually want to open.
            </p>
          </div>
        </details>

        <details>
          <summary>How does a memory leak show up in monitoring?</summary>
          <div className="answer">
            <p>
              A memory metric that climbs steadily until the container is killed and restarted, then climbs again — a saw-tooth chart. A heap snapshot then shows what keeps growing, usually a cache, array, or event listener that is never released.
            </p>
          </div>
        </details>

        <details>
          <summary>Why must nothing sensitive ever appear in logs?</summary>
          <div className="answer">
            <p>
              Logs are shipped to many systems, read by many people, and kept long after the incident. A password, token, or card number in a log line is a data breach waiting to happen.
            </p>
          </div>
        </details>

      </section>
    </div>
  );
}
