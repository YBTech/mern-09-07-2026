import DayNav from "../../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Node.js Event Loop Deep Dive — Concepts Reference</title>
      <DayNav day="additional-backend-topics" topic="node-event-loop-deep-dive" current="concepts" />
      <h1>Node.js Event Loop Deep Dive — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the notes and/or comes up constantly in interviews. If
          you're shaky on any of these, that's the priority to fix.
        </p>

        <details>
          <summary>Why doesn't I/O block Node's single JavaScript thread?</summary>
          <div className="answer">
            <p>
              I/O is handed off to the OS kernel or libuv's thread pool, and the JS thread moves on
              to the next thing on its queue. The event loop picks the callback back up once the
              I/O finishes — the JS thread was never sitting there waiting.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does a synchronous CPU-heavy function block everything, when I/O doesn't?</summary>
          <div className="answer">
            <p>
              There's nowhere to hand pure computation off to — it has to run on the one JS thread
              you have. While it runs, that thread can't do anything else: not another request, not
              a timer, not a health check.
            </p>
          </div>
        </details>

        <details>
          <summary>What order do <code>process.nextTick</code>, Promise callbacks, and <code>setTimeout</code> run in?</summary>
          <div className="answer">
            <p>
              Sync code first, then the entire <code>process.nextTick</code> queue drains, then the
              entire Promise microtask queue drains — both fully, before the loop is allowed to
              continue. Only then does the loop move into its phases, where a due{" "}
              <code>setTimeout</code> callback runs.
            </p>
          </div>
        </details>

        <details>
          <summary>What does <code>worker_threads</code> actually give you that a normal async function doesn't?</summary>
          <div className="answer">
            <p>
              A genuinely separate thread with its own call stack and event loop, running inside the
              same process. An async function still runs its own code on the one main thread — it
              only yields while waiting on I/O. A worker thread can run CPU-bound code in real
              parallel with the main thread.
            </p>
          </div>
        </details>

        <details>
          <summary>How is <code>child_process</code> different from <code>worker_threads</code>?</summary>
          <div className="answer">
            <p>
              <code>child_process</code> spins up a whole separate OS process with its own memory —
              no sharing at all except message passing. <code>worker_threads</code> stays inside
              your process as a thread, which is lighter and can optionally share memory via{" "}
              <code>SharedArrayBuffer</code>.
            </p>
          </div>
        </details>

        <details>
          <summary>What does the <code>cluster</code> module fix, and what does it leave unfixed?</summary>
          <div className="answer">
            <p>
              It forks multiple copies of your process (typically one per CPU core) that share a
              listening port, so overall request throughput scales with core count. It doesn't fix
              any single request's own CPU work — that still runs on one worker's one thread and
              still blocks that worker for its full duration.
            </p>
          </div>
        </details>

        <details>
          <summary>When is offloading to a separate service/queue the right call instead of a worker thread?</summary>
          <div className="answer">
            <p>
              When the work is genuinely heavy or long-running — video processing, ML inference,
              bulk report generation. It isolates the work completely, lets it scale independently
              of the API tier, and can even run in a different language better suited to the task —
              at the cost of running a whole extra system (queue, workers, retries).
            </p>
          </div>
        </details>

        <details>
          <summary>Does <code>spawn</code>/<code>exec</code> have to run Node code?</summary>
          <div className="answer">
            <p>
              No — unlike <code>fork</code> (which runs another Node module), <code>spawn</code> and{" "}
              <code>exec</code> can run any external program at all, e.g. <code>ffmpeg</code> or a
              Python script.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what the notes covered in depth — mostly "gotcha"
          interview trivia and things that sharpen how you code without being asked often.
        </p>

        <details>
          <summary>Is <code>process.nextTick</code> a phase of the event loop?</summary>
          <div className="answer">
            <p>
              No. It's a separate queue that's checked — and fully drained — after every single
              callback, before the loop is even allowed to proceed to its next phase. The six named
              phases (timers, pending callbacks, poll, check, close callbacks, plus an internal
              idle/prepare step) are a different mechanism entirely.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why is the order of <code>setTimeout(fn, 0)</code> vs. <code>setImmediate()</code> not
            guaranteed at the top level, but guaranteed inside an I/O callback?
          </summary>
          <div className="answer">
            <p>
              At the top level, which one fires first depends on how long process startup took
              relative to the timer's minimum delay — genuinely a race. Inside an I/O callback, the
              loop is already in the poll phase, which leads directly into the check phase next —
              so <code>setImmediate</code> always wins there.
            </p>
          </div>
        </details>

        <details>
          <summary>Can an uncaught exception in a worker thread crash the main process?</summary>
          <div className="answer">
            <p>
              No, not by default — the worker is terminated and its parent <code>Worker</code>{" "}
              object emits an <code>"error"</code> event; the main thread keeps running. That's real
              crash isolation, distinct from an uncaught exception happening directly on the main
              thread, which does crash the process.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What does a native addon (e.g. <code>bcrypt</code>, <code>sharp</code>) actually change
            about where CPU work runs?
          </summary>
          <div className="answer">
            <p>
              It doesn't move the work to a different thread by itself — it changes what runs on
              whatever thread it's called from: compiled native code (C++/Rust) instead of
              interpreted JavaScript, which is usually dramatically faster for the same task.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why can an unbounded chain of <code>process.nextTick</code> calls starve I/O entirely?
          </summary>
          <div className="answer">
            <p>
              The <code>nextTick</code> queue must fully drain before the loop can proceed to any
              phase, including poll (where I/O callbacks run). If each <code>nextTick</code> call
              schedules another one, the queue never empties, and the loop never gets past it —
              I/O piles up and never fires.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
