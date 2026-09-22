import { Link } from "react-router-dom";
import DayNav from "../../../components/DayNav";
import CodeBlock from "../../../components/CodeBlock";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Node.js Event Loop Deep Dive — Notes</title>
      <DayNav day="additional-backend-topics" topic="node-event-loop-deep-dive" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow">Week 3 · Additional Backend Topics · Notes</p>
        <h1>Node.js Event Loop Deep Dive</h1>
        <p className="subtitle">
          The event loop's real phases, why one blocking call stalls the whole process, and four
          production-grade ways to get CPU-heavy work off that one thread.
        </p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of this topic:</p>
        <ul>
          <li>
            Explain why Node runs your JavaScript on a single thread, and why that doesn't mean it
            can only do one thing at a time
          </li>
          <li>
            Walk through the event loop's phases in order, and say where <code>process.nextTick</code>{" "}
            and Promise microtasks drain relative to them
          </li>
          <li>Read a synchronous CPU-heavy handler and explain exactly what it blocks, and for how long</li>
          <li>Move CPU work onto a separate thread with <code>worker_threads</code>, and know when that's overkill</li>
          <li>
            Explain what <code>child_process</code> buys you that <code>worker_threads</code> doesn't,
            and when you'd reach for it instead
          </li>
          <li>
            Explain what the <code>cluster</code> module does and doesn't fix — more throughput
            across requests, not a faster single request
          </li>
          <li>
            Explain why offloading to a separate service/queue is the real production answer for
            genuinely heavy work, and sketch the shape of it
          </li>
          <li>Given a CPU-heavy scenario, pick the right mitigation and justify it over the others</li>
        </ul>
        <p>
          Want more?{" "}
          <Link to="/week3/additional-backend-topics/node-event-loop-deep-dive/concepts">
            View all concepts?
          </Link>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — Full Walkthrough                                  */}
      {/* ============================================================ */}
      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>
        <p>
          Day 11 covered the event loop in one page: I/O gets handed off, and the loop picks the
          result back up. This topic goes one level deeper — the loop's actual phases, and,
          critically, what happens when the work in question isn't I/O at all.
        </p>
        <p className="callout">
          Everything in this topic follows from one sentence: Node is single-threaded for{" "}
          <strong>your JavaScript</strong>, not for I/O. I/O has somewhere else to run while it
          waits. CPU-bound work does not — it runs on the one thread you have, blocking everything
          else on that process until it's done.
        </p>

        <h3>2.1 Single-threaded — what it actually means</h3>
        <p>
          One call stack, one thread, one line of your JavaScript executing at any instant. But
          "single-threaded" describes the JavaScript, not the whole runtime — Node itself is
          multi-threaded under the hood.
        </p>
        <div className="concept">
          <p className="concept-label">Concept — where the other threads are</p>
          <ul>
            <li>
              File system calls, DNS lookups, and some crypto functions run on{" "}
              <strong>libuv's thread pool</strong> (4 threads by default) — off your JS thread
              entirely.
            </li>
            <li>
              Network I/O (sockets, most of <code>http</code>) doesn't even need the thread pool —
              the OS kernel itself notifies Node when a socket is ready, via epoll/kqueue/IOCP.
            </li>
            <li>
              Your JS thread never blocks waiting for any of this. It hands the work off, moves on
              to the next thing on its queue, and the event loop calls your callback once the
              result is ready.
            </li>
            <li>
              None of those threads run <em>your</em> JavaScript. That's the one thing nothing in
              this topic changes — your own code still executes one line at a time, on one thread.
            </li>
          </ul>
        </div>

        <h3>2.2 The event loop's phases, precisely</h3>
        <p>
          "The event loop" isn't one queue — it's a fixed loop through six phases, each with its own
          callback queue, run in this order, over and over, for the life of the process:
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Phase</th>
              <th>Runs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>timers</td>
              <td>
                Callbacks whose <code>setTimeout</code>/<code>setInterval</code> delay has expired
              </td>
            </tr>
            <tr>
              <td>pending callbacks</td>
              <td>A few system-level callbacks deferred from the previous loop turn (rare in app code)</td>
            </tr>
            <tr>
              <td>poll</td>
              <td>Fetches new I/O events and runs their callbacks — almost everything: <code>fs</code>, sockets, DNS</td>
            </tr>
            <tr>
              <td>check</td>
              <td><code>setImmediate</code> callbacks</td>
            </tr>
            <tr>
              <td>close callbacks</td>
              <td>e.g. <code>socket.on("close", ...)</code></td>
            </tr>
          </tbody>
        </table>
        <p>
          Between <em>every</em> callback, on every transition — not just once per loop turn — Node
          drains two more queues that aren't phases at all:
        </p>
        <CodeBlock
          language="typescript"
          code={`console.log("1 — sync");

setTimeout(() => console.log("2 — timers phase"), 0);
setImmediate(() => console.log("3 — check phase"));
process.nextTick(() => console.log("4 — nextTick queue"));
Promise.resolve().then(() => console.log("5 — microtask queue"));

console.log("6 — sync");

// 1, 6 — sync code runs first
// 4    — process.nextTick always drains next, and fully, before anything else
// 5    — then the Promise microtask queue drains fully
// 2, 3 — then the loop proceeds into its phases and runs whichever is due`}
        />
        <div className="concept">
          <p className="concept-label">Concept — nextTick vs. microtask vs. macrotask</p>
          <ul>
            <li>
              <code>process.nextTick</code> is its own queue, checked — and fully drained — after
              every single callback, before the loop is even allowed to continue. It is not a
              "phase."
            </li>
            <li>
              The Promise microtask queue drains next, also fully, also between every callback.
              <code>nextTick</code> always wins the two.
            </li>
            <li>
              Only once both are empty does the loop move on. This is also why an unbounded chain of{" "}
              <code>process.nextTick</code> calls can starve I/O forever — the loop never gets to
              the poll phase.
            </li>
          </ul>
        </div>
        <p className="callout">
          Line 2 vs. line 3 above: at the top level, whether <code>setTimeout(fn, 0)</code> or{" "}
          <code>setImmediate</code> fires first isn't guaranteed — it depends on process startup
          timing. Inside an I/O callback, though, <code>setImmediate</code> always wins, because
          the poll phase leads straight into check.
        </p>

        <h3>2.3 Where the weakness actually shows up</h3>
        <p>
          None of the above is the problem. The problem is code that runs synchronously for a long
          time — nothing hands it off, because there's nothing to hand off to. It's not waiting on
          anything; it's just computing, on the one thread everything else needs too.
        </p>
        <CodeBlock
          language="typescript"
          bad={[2]}
          code={`// BAD — a synchronous CPU-heavy route blocks every other request on this process
app.get("/report/:n", (req, res) => {
  const result = fib(Number(req.params.n)); // fib(40) recursive: multiple seconds, synchronously
  res.json({ result });
});
// while this runs: no other request is served, no health check responds, no timer fires —
// not because those requests are slow, but because the ONE thread they'd run on is busy`}
        />
        <p>
          Real versions of this in a backend: image resizing, PDF/report generation, large CSV
          parsing, password hashing done synchronously, heavy in-memory aggregation over a big
          result set — anything that's pure computation, not I/O, and takes more than a few
          milliseconds.
        </p>
        <p className="callout">
          This is why day 11's "waiting is free" doesn't apply here. Waiting is free because the
          thread is handed back while I/O is in flight. Computing isn't free — the thread is
          occupied the entire time, and everyone else queues behind it.
        </p>

        <h3>2.4 First move: chunk it so the loop can breathe</h3>
        <p>
          Before reaching for threads or processes, the cheapest fix for a large-but-interruptible
          loop is to split it into chunks and yield back to the event loop between them:
        </p>
        <CodeBlock
          language="typescript"
          code={`// splits one big synchronous loop into chunks, yielding to the event loop between them
function processInChunks(items: Item[], onDone: () => void) {
  const chunk = items.splice(0, 100);
  chunk.forEach(processItem);

  if (items.length > 0) {
    setImmediate(() => processInChunks(items, onDone)); // yield — let other callbacks run
  } else {
    onDone();
  }
}`}
        />
        <p className="callout">
          This doesn't make the work faster — the total time on the thread is the same. It makes
          the process <em>responsive</em> while doing it, by giving other queued callbacks a turn
          between chunks instead of monopolizing the thread start to finish.
        </p>

        <h3>2.5 <code>worker_threads</code> — real parallelism, same process</h3>
        <p>
          A worker thread is a genuinely separate JS thread — its own call stack, its own event
          loop, its own V8 instance — running inside the same Node process. This is the direct fix
          for section 2.3's problem: move the CPU work off the thread that's also serving requests.
        </p>
        <CodeBlock
          language="typescript"
          code={`// main.ts — the request handler hands the work to a worker and awaits the result
import { Worker } from "worker_threads";

function runInWorker(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./fibonacci-worker.js", { workerData: n });
    worker.once("message", resolve);
    worker.once("error", reject);
  });
}

app.get("/report/:n", async (req, res) => {
  const result = await runInWorker(Number(req.params.n)); // the main thread is free the whole time
  res.json({ result });
});`}
        />
        <CodeBlock
          language="typescript"
          code={`// fibonacci-worker.js — runs on its OWN thread, with its own event loop
import { parentPort, workerData } from "worker_threads";

function fib(n: number): number {
  return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

parentPort!.postMessage(fib(workerData));`}
        />
        <div className="concept">
          <p className="concept-label">Concept — cost and isolation</p>
          <ul>
            <li>
              Data passed via <code>postMessage</code> is structured-cloned by default — copied,
              not shared. For large data, a <code>SharedArrayBuffer</code> can be shared
              zero-copy instead, but that's the exception, not the default.
            </li>
            <li>
              An uncaught exception inside a worker terminates <em>that worker</em> and emits{" "}
              <code>"error"</code> on the parent's <code>Worker</code> object — it does not crash
              the main process. That's real crash isolation, for free.
            </li>
            <li>
              Spinning up a worker has real overhead (a new V8 instance). For work that's genuinely
              short, that overhead can cost more than the chunking approach above — reach for
              workers when the work is heavy enough to be worth it.
            </li>
          </ul>
        </div>

        <h3>2.6 <code>child_process</code> — a separate OS process</h3>
        <p>
          <code>child_process</code> goes one step further than a worker thread: a whole separate
          OS process, with its own memory space, no sharing at all except through message passing
          or piped stdio.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { fork } from "child_process";

app.get("/report/:orderId", (req, res) => {
  const child = fork("./generate-report.js"); // fork: run another Node module as a child process
  child.send({ orderId: req.params.orderId });
  child.once("message", (report) => res.json(report));
});`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th><code>worker_threads</code></th>
              <th><code>child_process</code></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Isolation unit</td>
              <td>A thread, inside your process</td>
              <td>A whole separate OS process</td>
            </tr>
            <tr>
              <td>Memory</td>
              <td>Same process; can share via <code>SharedArrayBuffer</code></td>
              <td>Fully separate — no sharing, only message passing</td>
            </tr>
            <tr>
              <td>Startup cost</td>
              <td>Lighter — new thread, same V8/process</td>
              <td>Heavier — new V8 instance, new process</td>
            </tr>
            <tr>
              <td>Can it crash independently?</td>
              <td>Yes — worker crash never takes the process down</td>
              <td>Yes — even more completely; an OS-level crash</td>
            </tr>
            <tr>
              <td>Can it run non-Node programs?</td>
              <td>No — it's still your Node app</td>
              <td>
                Yes — <code>spawn</code>/<code>exec</code> run any external program
                (<code>ffmpeg</code>, a Python script, ImageMagick)
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Use <code>fork</code> for another piece of your own Node code that needs process-level
          isolation; use <code>spawn</code>/<code>exec</code> when the CPU-heavy work is really a
          different program you're shelling out to, not JavaScript at all.
        </p>

        <h3>2.7 <code>cluster</code> — more throughput, not a faster request</h3>
        <p>
          <code>cluster</code> forks multiple copies of your whole process — typically one per CPU
          core — that all share the same listening port. Incoming connections are distributed
          across them.
        </p>
        <CodeBlock
          language="typescript"
          code={`import cluster from "cluster";
import os from "os";
import http from "http";

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  for (let i = 0; i < cpuCount; i++) cluster.fork(); // one worker process per core

  cluster.on("exit", (worker) => {
    console.log(\`worker \${worker.process.pid} died — forking a replacement\`);
    cluster.fork();
  });
} else {
  // each worker runs the real app, all of them sharing port 3000
  http.createServer(app).listen(3000);
}`}
        />
        <div className="concept">
          <p className="concept-label">Concept — what it fixes, and what it doesn't</p>
          <ul>
            <li>
              What it fixes: with 8 cores, you can now serve 8 CPU-heavy requests at once instead
              of 1 — total throughput scales with core count.
            </li>
            <li>
              What it doesn't fix: any <em>one</em> request still runs on exactly one worker's one
              thread. If that request is a blocking <code>fib(40)</code>, that worker is still
              stalled for the same duration section 2.3 described — cluster just means the{" "}
              <em>other</em> 7 workers can keep serving everyone else.
            </li>
            <li>
              Each worker is a full separate process (built on <code>child_process</code> under the
              hood) — no shared memory, same as section 2.6.
            </li>
          </ul>
        </div>

        <h3>2.8 The real production answer: offload it to a separate service</h3>
        <p>
          For work that's genuinely heavy — a multi-second report, video transcoding, ML
          inference — none of the above is really the answer. The API process should never run it
          at all. It hands the job to a queue and responds immediately; a separate worker service,
          scaled independently, does the actual work.
        </p>
        <CodeBlock
          language="typescript"
          code={`// the API process — never runs the CPU work itself, just enqueues it
app.post("/reports", async (req, res) => {
  const job = await reportQueue.add("generate-report", { orderId: req.body.orderId });
  res.status(202).json({ jobId: job.id, status: "queued" }); // 202: accepted, not done yet
});

// a SEPARATE process (maybe not even Node) pulls jobs off the same queue and does the work
reportQueue.process("generate-report", async (job) => {
  return generateReport(job.data.orderId); // the heavy part, entirely off the API's thread
});`}
        />
        <p>
          The queue is the durable handoff — Redis-backed (BullMQ), a managed queue (SQS,
          RabbitMQ), whatever the stack already uses. The client finds out the result is ready by
          polling <code>/reports/:jobId</code>, a webhook, or a socket push — not by the original
          request staying open.
        </p>
        <div className="concept">
          <p className="concept-label">Concept — why this beats everything above it</p>
          <ul>
            <li>
              <strong>Right tool for the work.</strong> The worker service doesn't have to be Node —
              image/video processing, ML inference, and heavy number-crunching often run faster in
              a runtime built for it.
            </li>
            <li>
              <strong>Scales independently.</strong> Report generation spiking doesn't cost the API
              tier anything — add worker instances without touching the request-handling fleet at
              all.
            </li>
            <li>
              <strong>The tradeoff is real, not free.</strong> A queue, worker processes, retries,
              and monitoring are a whole extra system to run — reach for this once the work is
              genuinely too heavy for a thread or a process, not by default for anything that takes
              more than a few milliseconds.
            </li>
          </ul>
        </div>

        <h3>2.9 Other tools worth knowing</h3>
        <ul>
          <li>
            <strong>Native addons</strong> (N-API, or Rust via <code>napi-rs</code>) — compiled
            native code called from JS. <code>bcrypt</code> and <code>sharp</code> already do this:
            the heavy part runs as machine code, not interpreted JS, even though it's still on a
            thread in your process.
          </li>
          <li>
            <strong>Horizontal scaling</strong> — many single-threaded Node processes behind a load
            balancer, across <em>machines</em> rather than just cores. Same shape as{" "}
            <code>cluster</code>, one level further out.
          </li>
          <li>
            <strong>Caching</strong> — the cheapest mitigation of all: CPU work you don't repeat
            can't block anything. If the same report gets requested twice, the second request
            shouldn't recompute it.
          </li>
        </ul>

        <h3>2.10 Putting it together</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Approach</th>
              <th>Adds real parallelism?</th>
              <th>Isolation</th>
              <th>Reach for it when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chunk + <code>setImmediate</code></td>
              <td>No — same thread, just fairer</td>
              <td>None</td>
              <td>A bounded loop you can safely interrupt, no new dependency needed</td>
            </tr>
            <tr>
              <td><code>worker_threads</code></td>
              <td>Yes — separate thread, same process</td>
              <td>Worker crash doesn't crash the process</td>
              <td>CPU-bound work inside an otherwise normal Node app</td>
            </tr>
            <tr>
              <td><code>child_process</code></td>
              <td>Yes — separate OS process</td>
              <td>Full process isolation</td>
              <td>Need to run a non-Node program, or want process-level isolation</td>
            </tr>
            <tr>
              <td><code>cluster</code></td>
              <td>Yes, across requests — not within one</td>
              <td>Per-worker process isolation</td>
              <td>Many concurrent small-to-medium requests; want to use every core</td>
            </tr>
            <tr>
              <td>Separate service / queue</td>
              <td>Yes — fully independent system</td>
              <td>Complete — different process, machine, even language</td>
              <td>Genuinely heavy or long-running work: video, ML, bulk reports</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
