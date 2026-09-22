import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 11 — Concepts Reference</title>
      <DayNav day="day11-node-express" current="concepts" />
      <h1>Day 11 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you're shaky on any of these, that's the priority to fix.
        </p>

        <details>
          <summary>Why does one blocking, synchronous call in a Node server delay every other in-flight request?</summary>
          <div className="answer">
            <p>
              Node runs your JavaScript on a single thread. A synchronous call that takes 5 seconds
              occupies that one thread for the full 5 seconds, so no other request's callback — even
              an unrelated one — can run until it's done.
            </p>
          </div>
        </details>

        <details>
          <summary>What does "Node is single-threaded" actually mean, given that it can handle thousands of concurrent connections?</summary>
          <div className="answer">
            <p>
              Your JavaScript callbacks all run on one thread, one at a time — but most of what a
              server does is <em>wait</em> on I/O (a DB query, a network call), and that waiting
              happens outside your JS, handled by the system. The single thread is rarely busy
              computing, so it can juggle many in-flight requests as long as none of them block it
              with synchronous work.
            </p>
            <p>
              Put another way, Node is <strong>asynchronous</strong> (it doesn't wait around for a
              slow operation before moving to the next line), <strong>non-blocking</strong> (that
              waiting never freezes the thread), and <strong>single-threaded</strong> (there's still
              only one thread running your actual JS) — three different words pointing at the same
              underlying design.
            </p>
          </div>
        </details>

        <details>
          <summary>How does the Node.js event loop actually work?</summary>
          <div className="answer">
            <p>
              Once your synchronous code finishes, the event loop repeatedly cycles through a set of
              phases — timers, pending I/O callbacks, poll (new I/O events), check (
              <code>setImmediate</code>), and close callbacks — running whatever's ready in each one.
              Promise callbacks (microtasks) get priority: they all drain completely between every
              phase, before the loop moves on, which is why a chain of <code>.then()</code>s runs
              before a <code>setTimeout(fn, 0)</code> fires.
            </p>
          </div>
        </details>

        <details>
          <summary>What is an I/O operation, and why does it make Node fast for this kind of work?</summary>
          <div className="answer">
            <p>
              I/O is anything that leaves the CPU to talk to something slower — disk, network, a
              database — and Node hands that operation off to the system instead of sitting there
              waiting for it. Because the event loop is free during that wait, one thread can have
              thousands of I/O operations in flight at once; that's why Node is fast specifically for
              I/O-heavy work, not because it computes any faster than another language.
            </p>
          </div>
        </details>

        <details>
          <summary>What's the difference between CPU, RAM, and storage?</summary>
          <div className="answer">
            <p>
              The <strong>CPU</strong> computes — it's what actually executes your code, and it can
              only run one thing at a time per thread. <strong>RAM</strong> is fast, temporary working
              memory the CPU reads and writes while running. <strong>Storage</strong> (disk/SSD) is
              slow, persistent space for data that has to survive a restart. Node's whole performance
              story is about keeping the CPU free while I/O — which mostly waits on storage or
              network, not the CPU — happens in the background.
            </p>
          </div>
        </details>

        <details>
          <summary>Why isn't Node.js good for CPU-intensive tasks, and what counts as one?</summary>
          <div className="answer">
            <p>
              A CPU-intensive task — image/video processing, heavy cryptography, sorting a huge
              in-memory dataset, parsing a massive file, ML inference — keeps the CPU continuously
              busy instead of waiting on I/O, so it occupies Node's one JS thread for its entire
              duration and blocks every other in-flight request, exactly like a busy-wait loop.
            </p>
            <p>That work belongs on a worker thread, a separate process, or a queue — not directly in a route handler.</p>
          </div>
        </details>

        <details>
          <summary>What's the difference between a path param and a query param, and when do you use each?</summary>
          <div className="answer">
            <p>
              A path param (<code>/orders/:id</code>) identifies <em>which</em> resource — it's part
              of the resource's identity. A query param (<code>/orders?status=placed</code>) filters
              or shapes the response to a resource that's already identified — it's optional and the
              route works without it.
            </p>
          </div>
        </details>

        <details>
          <summary>What's the difference between <code>req.params</code>, <code>req.query</code>, and <code>req.body</code>?</summary>
          <div className="answer">
            <p>
              <code>req.params</code> comes from the URL path's named segments (<code>:id</code>).{" "}
              <code>req.query</code> comes from the URL's <code>?key=value</code> string.{" "}
              <code>req.body</code> comes from the request payload, parsed by middleware like{" "}
              <code>express.json()</code>.
            </p>
          </div>
        </details>

        <details>
          <summary>What is npm (Node Package Manager)?</summary>
          <div className="answer">
            <p>
              The command-line tool (and public registry) that installs, versions, and runs the
              packages a project depends on — it's what <code>npm install</code> and{" "}
              <code>npm run</code> actually are.
            </p>
          </div>
        </details>

        <details>
          <summary>What is <code>package.json</code>?</summary>
          <div className="answer">
            <p>
              The project's manifest — its name, version, the scripts you can run, and its{" "}
              <code>dependencies</code>/<code>devDependencies</code>. It's the one file in this
              cluster you write by hand and commit; everything else is generated from it.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the <code>scripts</code> field in <code>package.json</code>? How do you run one?</summary>
          <div className="answer">
            <p>
              A map of names to shell commands — e.g. <code>"dev": "tsx watch src/server.ts"</code>.
              Run one with <code>npm run &lt;name&gt;</code> (a couple of conventional names, like{" "}
              <code>start</code> and <code>test</code>, can drop the <code>run</code>).
            </p>
          </div>
        </details>

        <details>
          <summary>What is <code>package-lock.json</code>?</summary>
          <div className="answer">
            <p>
              The exact, resolved version of every package that got installed — including everything
              your dependencies themselves depend on. It's committed so <code>npm ci</code> installs a
              byte-identical tree on every machine, not just "whatever satisfies the range today."
            </p>
          </div>
        </details>

        <details>
          <summary>What's the latest LTS version of Node.js?</summary>
          <div className="answer">
            <p>
              As of now, Node 24 is the current Active LTS line, with Node 22 still in Maintenance. A
              new even-numbered release becomes LTS every October; odd-numbered releases (23, 25, ...)
              are never LTS — they're only a preview of what the next even release stabilizes into.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a <code>.env</code> file? What do we put in it?</summary>
          <div className="answer">
            <p>
              A plain <code>key=value</code> file for configuration that shouldn't be hard-coded or
              committed — database URLs, API keys, secrets, the port to listen on. Code reads it
              (e.g. via <code>dotenv</code> or <code>process.env</code>), and the file itself is
              listed in <code>.gitignore</code> so real credentials never reach the repo.
            </p>
          </div>
        </details>

        <details>
          <summary>What is <code>.gitignore</code>?</summary>
          <div className="answer">
            <p>
              A list of file/folder patterns Git should never track — <code>node_modules/</code>{" "}
              (regenerable, enormous) and <code>.env</code> (secrets) are the two that matter most in
              a Node project. Anything already committed before it's added still has to be removed
              with <code>git rm --cached</code>.
            </p>
          </div>
        </details>

        
        
        <details>
          <summary>What is Swagger?</summary>
          <div className="answer">
            <p>
              A specification (OpenAPI) and toolset for documenting a REST API — its endpoints,
              parameters, and request/response shapes — in a format that's both human-readable and
              machine-generated into interactive docs you can call directly from the browser.
            </p>
          </div>
        </details>
      </section>


      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today's lecture covered — mostly "gotcha"
          interview trivia and things that sharpen how you code without being asked often.
        </p>

        <details>
          <summary>Why is <code>GET</code> expected to have no side effects?</summary>
          <div className="answer">
            <p>
              Browsers, proxies, and caches all assume a <code>GET</code> is "safe" — they may
              prefetch it, retry it silently, or serve a cached copy without asking. A{" "}
              <code>GET</code> that deletes data will eventually get triggered by something other
              than a real user action.
            </p>
          </div>
        </details>

        <details>
          <summary>What does "idempotent" mean, and which HTTP methods are idempotent?</summary>
          <div className="answer">
            <p>
              A request is idempotent if making it once has the same effect on server state as
              making it many times in a row. <code>GET</code>, <code>PUT</code>, and{" "}
              <code>DELETE</code> are idempotent — <code>PUT</code> overwrites a resource with the
              same data every time, and deleting an already-deleted resource leaves it gone either
              way. <code>POST</code> is not idempotent (each call typically creates another new
              resource), and <code>PATCH</code> isn't guaranteed to be, since a partial update can
              depend on the resource's current state.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the <code>fs</code> module?</summary>
          <div className="answer">
            <p>
              Node's built-in file-system module — <code>readFileSync</code>/<code>writeFileSync</code>{" "}
              (and their async, non-blocking Promise-based counterparts) for reading and writing
              files. This lab's own backend project uses it directly to persist data to a JSON file.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the <code>path</code> module?</summary>
          <div className="answer">
            <p>
              Node's built-in module for building and normalizing file-system paths —{" "}
              <code>path.join(__dirname, "../data/x.json")</code> instead of hand-concatenating
              strings with the wrong slash for the OS.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the <code>os</code> module?</summary>
          <div className="answer">
            <p>
              Node's built-in module for reading information about the machine the process is running
              on — CPU core count, free memory, platform, home directory. Useful for things like
              sizing a worker pool to <code>os.cpus().length</code>, rarely used in everyday route
              handlers.
            </p>
          </div>
        </details>

        <details>
          <summary>What tools do you use to test your APIs and Express apps?</summary>
          <div className="answer">
            <p>
              Postman, Insomnia, or plain <code>curl</code> for manually poking endpoints while
              building. For automated tests, a test runner like Jest or Vitest paired with{" "}
              <code>supertest</code>, which drives your Express app with real HTTP assertions without
              needing a server actually running.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the call stack?</summary>
          <div className="answer">
            <p>
              The structure that tracks which function is currently running and what called it — each
              call pushes a frame on, returning pops it off. There's only one of it, which is the
              actual mechanism behind "JavaScript is single-threaded": only one thing executes at a
              time.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the V8 engine?</summary>
          <div className="answer">
            <p>
              Google's open-source JavaScript engine (also used in Chrome) that Node embeds to
              compile and run your JS — parsing, JIT-compiling to machine code, and garbage collection
              all happen inside V8. Node itself is V8 plus libuv plus a set of built-in APIs (
              <code>fs</code>, <code>http</code>, ...) layered on top.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the memory heap?</summary>
          <div className="answer">
            <p>
              The region of memory where objects, arrays, closures, and anything else dynamically
              allocated actually live — unlike the call stack, which holds primitive values and
              references. V8's garbage collector periodically walks the heap and frees anything
              nothing still references.
            </p>
          </div>
        </details>

        <details>
          <summary>What is libuv?</summary>
          <div className="answer">
            <p>
              The C library underneath Node that implements the event loop and hands I/O off to the
              operating system — using a thread pool for things like file-system access that don't
              have a native async OS API. It's the piece that makes "non-blocking I/O" physically
              happen; V8 just runs your JavaScript.
            </p>
          </div>
        </details>

        <details>
          <summary>What is <code>process.nextTick()</code>?</summary>
          <div className="answer">
            <p>
              Schedules a callback to run immediately after the current operation finishes, before the
              event loop continues to anything else — even before other microtasks like a resolved
              Promise's <code>.then()</code>. It runs so early that recursive{" "}
              <code>nextTick</code> calls can, in theory, starve the event loop entirely.
            </p>
          </div>
        </details>

        <details>
          <summary>What is <code>setImmediate()</code>?</summary>
          <div className="answer">
            <p>
              Schedules a callback to run in the event loop's "check" phase, right after the current
              poll phase's I/O callbacks — in practice, one step later than{" "}
              <code>process.nextTick()</code>, and (inside an I/O callback) reliably before any{" "}
              <code>setTimeout(fn, 0)</code>.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a CommonJS module?</summary>
          <div className="answer">
            <p>
              Node's original module system — <code>require()</code> to import,{" "}
              <code>module.exports</code> to export, resolved synchronously at runtime. It's what{" "}
              <code>"type": "module"</code> in <code>package.json</code> (ESM, <code>import</code>/
              <code>export</code>) opts a project out of; the two systems interoperate but genuinely
              differ (ESM is static/analyzable, CommonJS is dynamic).
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
