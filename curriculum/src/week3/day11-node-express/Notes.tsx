import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 11 Notes</title>
      <DayNav day="day11-node-express" current="notes" />
      <h1>Day 11 — Node &amp; Express</h1>
      <p className="subtitle">
        The first day of a five-day build: an Order Management &amp; Fulfillment
        API, starting from nothing but Express and an in-memory array.
      </p>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>
            Drive a Node project from the terminal: <code>npm install</code>,{" "}
            <code>npm run dev</code>, stop a running server, and fix "port
            already in use"
          </li>
          <li>
            Explain what <code>package.json</code>, <code>node_modules</code>{" "}
            and the lockfile each are, and when something belongs in{" "}
            <code>dependencies</code> vs. <code>devDependencies</code>
          </li>
          <li>
            Stand up an Express server with JSON body parsing and at least one
            route
          </li>
          <li>
            Explain what Node's single-threaded event loop means for writing a
            server — why you don't block the thread
          </li>
          <li>
            Describe the anatomy of an HTTP request and response — method, path,
            headers, body / status, headers, body — and inspect a real one in
            the browser's Network tab
          </li>
          <li>
            Send a request from a client with <code>fetch</code> and with{" "}
            <code>axios</code>: path params, query params, a JSON body, and a
            method other than <code>GET</code>
          </li>
          <li>
            Read that request in Express — destructure <code>req.params</code>,{" "}
            <code>req.query</code>, <code>req.body</code> and{" "}
            <code>req.headers</code>, and say which kind of information belongs
            in each
          </li>
          <li>
            Design a REST resource by the actual principles: nouns not verbs,
            plural collections, the verb carries the action, sub-resources nest
          </li>
          <li>
            Pick the right status code (<code>200</code>/<code>201</code>/
            <code>204</code>/<code>400</code>/<code>401</code>/<code>403</code>/
            <code>404</code>/<code>409</code>/<code>500</code>)
          </li>
          <li>
            Say which HTTP verbs are idempotent, give an example of each, and
            explain why a client retrying a request makes it matter
          </li>
          <li>
            Return a consistent JSON error shape instead of letting a raw error
            leak out
          </li>
        </ul>
        <p>
          Want more?{" "}
          <Link to="/week3/day11-node-express/concepts">
            View all concepts?
          </Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2 style={{ marginTop: "2.5rem" }}>Section 2 — Full Walkthrough</h2>

        {/* ================================================================= */}
        {/* Part A — getting a project running                                 */}
        {/* ================================================================= */}
        <h3 className="part">Part A — Getting a Node project running</h3>
        <p>
          Before any of today's HTTP material, you need a project that starts.
          That's three things: a manifest, a terminal, and a server listening on
          a port.
        </p>

        <h4 className="topic">
          A.1 <code>package.json</code>, npm, and <code>node_modules</code>
        </h4>
        <p>
          Every Node project starts as one file describing it, and one command
          that reads it.
        </p>
        <CodeBlock
          language="json"
          code={`{
  "name": "oms-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "tsx": "^4.16.0",
    "typescript": "^5.5.3"
  }
}`}
        />
        <div className="concept">
          <p className="concept-label">Concept — the four moving parts</p>
          <ul>
            <li>
              <strong>
                <code>package.json</code>
              </strong>{" "}
              — the project's manifest: its name, its scripts, and the packages
              it declares. This is the file you edit and commit.
            </li>
            <li>
              <strong>
                <code>node_modules/</code>
              </strong>{" "}
              — where <code>npm install</code> downloads those packages, plus
              everything they themselves depend on. It's generated, it's
              enormous, and it is never committed (it's in{" "}
              <code>.gitignore</code>).
            </li>
            <li>
              <strong>
                <code>package-lock.json</code>
              </strong>{" "}
              — the exact version of every package that got installed,
              transitive ones included. This <em>is</em> committed: it's what
              makes your machine and the CI server install byte-identical trees.
            </li>
            <li>
              <strong>Scripts</strong> — named shell commands.{" "}
              <code>npm run dev</code> runs the <code>dev</code> entry, so
              nobody has to remember the real command.
            </li>
          </ul>
        </div>

        <CodeBlock
          language="bash"
          code={`npm init -y                  # create a package.json from nothing
npm install express          # add a runtime dependency, save it to package.json
npm install -D typescript    # add a DEV dependency (-D = --save-dev)
npm install                  # install everything package.json already declares
npm ci                       # install strictly from the lockfile — what CI/deploy uses
npm run dev                  # run the "dev" script
npm ls express               # which version is actually installed, and why`}
        />

        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>
                <code>dependencies</code>
              </th>
              <th>
                <code>devDependencies</code>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Needed</td>
              <td>At runtime, in production</td>
              <td>Only while developing or building</td>
            </tr>
            <tr>
              <td>Examples</td>
              <td>
                <code>express</code>, <code>pg</code>, <code>zod</code>
              </td>
              <td>
                <code>typescript</code>, <code>tsx</code>, <code>@types/*</code>
                , test runners
              </td>
            </tr>
            <tr>
              <td>Shipped in the Docker image?</td>
              <td>Yes</td>
              <td>
                No — <code>npm ci --omit=dev</code> skips them
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Put a package your running server imports in <code>dependencies</code>
          . Getting this backwards works perfectly on your machine and crashes
          on deploy with "Cannot find module" — a classic day-one production
          bug.
        </p>

        <p>
          The caret in <code>"express": "^4.19.2"</code> is a version{" "}
          <em>range</em>, not a version:
        </p>
        <CodeBlock
          language="plaintext"
          code={`4.19.2     MAJOR.MINOR.PATCH
^4.19.2    any 4.x.x at or above 4.19.2  — breaking changes excluded  (npm's default)
~4.19.2    any 4.19.x at or above 4.19.2 — patches only
4.19.2     exactly this version

MAJOR  breaking change      MINOR  new feature, backwards compatible      PATCH  bug fix`}
        />

        <h4 className="topic">A.2 Living in the terminal</h4>
        <CodeBlock
          language="bash"
          code={`cd oms-api            # move into the project folder — run npm commands from here
npm run dev           # start the server; it keeps running and holds the terminal
                      # Ctrl+C  stop it  (Mac and Windows alike — not Cmd+C)
node --version        # confirm which Node you're on
lsof -i :3000         # Mac/Linux: what is holding port 3000
netstat -ano | findstr :3000   # Windows: same question`}
        />
        <p className="callout">
          <code>EADDRINUSE: address already in use :::3000</code> means a
          previous server is still running — you closed the tab without stopping
          it. Find it with the command above and kill it, or change the port;
          don't restart your machine.
        </p>
        <div className="concept">
          <p className="concept-label">
            Concept — terminal habits worth having by tonight
          </p>
          <ul>
            <li>
              A long-running process (a dev server) <strong>owns</strong> that
              terminal until you stop it. Open a second tab for other commands
              rather than killing it.
            </li>
            <li>
              Read the <em>first</em> error line, not the last. The stack
              trace's top frame is usually your file; everything below is
              library code.
            </li>
            <li>
              The terminal prints the URL the server is listening on — open
              that, don't guess the port.
            </li>
            <li>
              Up-arrow replays the last command; <code>Ctrl+C</code> stops,{" "}
              <code>Ctrl+L</code> clears the screen.
            </li>
          </ul>
        </div>

        <h4 className="topic">A.3 Standing up the Express server</h4>
        <p>
          <code>express.json()</code> is what turns a raw request body into{" "}
          <code>req.body</code> — skip it and every POST/PATCH body comes
          through as <code>undefined</code>.
        </p>
        <CodeBlock
          language="typescript"
          code={`import express from "express";

const app = express();
app.use(express.json());            // parse JSON request bodies into req.body

app.get("/health", (req, res) => {  // one route, so there's something to hit
  res.status(200).json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Order API listening on http://localhost:3000");
});`}
        />
        <p className="callout">
          That's a complete, runnable server. <code>npm run dev</code>, then
          open <code>http://localhost:3000/health</code> — everything else today
          is adding routes to this.
        </p>

        {/* ================================================================= */}
        {/* Part B — the event loop                                            */}
        {/* ================================================================= */}
        <h3 className="part">
          Part B — How Node runs your code: the event loop
        </h3>
        <p>
          You now have a server. Everything about how it behaves under load
          comes from one fact: your JavaScript runs on a{" "}
          <strong>single thread</strong>.
        </p>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              One blocking call — a huge synchronous loop, a synchronous file
              read — freezes <em>every</em> other request being handled at the
              same time, not just the one that made it.
            </li>
            <li>
              I/O (a database query, a file read, a network call) is handed off
              to the system, and Node moves on to the next thing on its queue
              while that I/O is in flight.
            </li>
            <li>
              The event loop is what picks the finished I/O work back up and
              runs its callback — that's why <code>await</code> doesn't block
              the thread while "waiting," it just yields back to the loop until
              the result is ready.
            </li>
            <li>
              This is why a Node server can handle thousands of concurrent
              connections on one thread: it's rarely actually <em>computing</em>{" "}
              anything, it's mostly waiting on I/O, and waiting is free.
            </li>
          </ul>
        </div>
        <CodeBlock
          language="typescript"
          code={`app.get("/blocking", (req, res) => {
  const start = Date.now();
  while (Date.now() - start < 5000) { /* busy-wait: the thread is stuck here */ }
  res.status(200).json({ done: true });   // every OTHER request waits 5s too
});

app.get("/non-blocking", async (req, res) => {
  const rows = await db.query("SELECT * FROM orders");  // yields to the event loop
  res.status(200).json(rows);             // other requests are served while this waits
});`}
        />
        <p className="callout">
          Try it: hit <code>/blocking</code> in one tab, then{" "}
          <code>/health</code> in another immediately after. The second request
          hangs until the first finishes — that's the whole lesson in one
          experiment.
        </p>

        {/* ================================================================= */}
        {/* Part C — requests and responses                                    */}
        {/* ================================================================= */}
        <h3 className="part">Part C — Requests and responses</h3>
        <p>
          You've been <em>sending</em> HTTP since week 1's <code>fetch</code>.
          Today you're on the receiving end, so it's worth seeing both halves at
          once: the call a client writes, what that turns into on the wire, and
          how Express reads it back out.
        </p>

        <h4 className="topic">C.1 One request, three views</h4>
        <p>
          This is the same single request, shown as the client writes it and as
          it travels:
        </p>

        <p className="compare-label">1 — What the client writes</p>
        <CodeBlock
          language="typescript"
          code={`await fetch("http://localhost:3000/orders?notify=true", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ customerId: 4, items: [{ productId: 2, quantity: 3 }] }),
});`}
        />

        <p className="compare-label">2 — What actually travels to the server</p>
        <CodeBlock
          language="plaintext"
          code={`POST /orders?notify=true HTTP/1.1          <- method, path + query string, version
Host: localhost:3000                       <- headers: metadata about the request
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{"customerId": 4, "items": [{"productId": 2, "quantity": 3}]}   <- body`}
        />

        <p className="compare-label">3 — What comes back</p>
        <CodeBlock
          language="plaintext"
          code={`HTTP/1.1 201 Created                       <- status code + reason
Content-Type: application/json             <- headers
Location: /orders/17

{"id": 17, "customerId": 4, "status": "placed"}                 <- body`}
        />
        <p className="callout">
          You'll almost never write view 2 by hand — but it's what the Network
          tab shows you, so being able to read it is what makes debugging fast.
        </p>

        <h4 className="topic">
          C.2 Sending a request: <code>fetch</code> and <code>axios</code>
        </h4>
        <p>
          Same four things every time: the method, the URL, the headers, the
          body.
        </p>

        <p className="compare-label">GET — path param and query params</p>
        <CodeBlock
          language="typescript"
          code={`const orderId = 17;

// fetch — you build the query string yourself
const params = new URLSearchParams({ status: "placed", limit: "20" });
const res = await fetch(\`http://localhost:3000/orders?\${params}\`);  // /orders?status=placed&limit=20
if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);      // fetch does NOT throw on 404/500
const orders = await res.json();                                     // body is a stream — parse it

// a path param is just string interpolation into the URL
const one = await fetch(\`http://localhost:3000/orders/\${orderId}\`);

// axios — params object becomes the query string, JSON is parsed for you
const { data } = await axios.get("http://localhost:3000/orders", {
  params: { status: "placed", limit: 20 },                           // ?status=placed&limit=20
});`}
        />

        <p className="compare-label">POST — sending a JSON body</p>
        <CodeBlock
          language="typescript"
          code={`// fetch — method, Content-Type and JSON.stringify are all manual
const res = await fetch("http://localhost:3000/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },   // omit this and req.body is undefined
  body: JSON.stringify({ customerId: 4, items: [{ productId: 2, quantity: 3 }] }),
});
const created = await res.json();

// axios — the header and the stringify are automatic; the 2nd argument IS the body
const { data: created2 } = await axios.post("http://localhost:3000/orders", {
  customerId: 4,
  items: [{ productId: 2, quantity: 3 }],
});`}
        />

        <p className="compare-label">PATCH, DELETE, and a custom header</p>
        <CodeBlock
          language="typescript"
          code={`await fetch(\`http://localhost:3000/orders/\${orderId}/status\`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Idempotency-Key": "order-4-attempt-1",          // any custom header goes here
  },
  body: JSON.stringify({ status: "shipped" }),
});

await fetch(\`http://localhost:3000/orders/\${orderId}\`, { method: "DELETE" });

// axios: body is the 2nd argument, options the 3rd
await axios.patch(\`http://localhost:3000/orders/\${orderId}/status\`, { status: "shipped" });
await axios.delete(\`http://localhost:3000/orders/\${orderId}\`);`}
        />

        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>
                <code>fetch</code>
              </th>
              <th>
                <code>axios</code>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Install</td>
              <td>Built in — nothing to add</td>
              <td>
                <code>npm install axios</code>
              </td>
            </tr>
            <tr>
              <td>Query string</td>
              <td>
                You build it (<code>URLSearchParams</code>)
              </td>
              <td>
                <code>params:</code> object
              </td>
            </tr>
            <tr>
              <td>JSON body</td>
              <td>
                <code>JSON.stringify</code> + <code>Content-Type</code> by hand
              </td>
              <td>Pass the object; both are automatic</td>
            </tr>
            <tr>
              <td>Parsing the response</td>
              <td>
                <code>await res.json()</code>
              </td>
              <td>
                <code>res.data</code>, already parsed
              </td>
            </tr>
            <tr>
              <td>A 404 or 500</td>
              <td>
                <strong>Resolves normally</strong> — you must check{" "}
                <code>res.ok</code>
              </td>
              <td>
                Throws, so <code>try/catch</code> catches it
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          The <code>res.ok</code> row is the one that bites. <code>fetch</code>{" "}
          only rejects when the request never happened (DNS failure, connection
          refused) — a <code>500</code> is a perfectly successful round trip as
          far as it's concerned.
        </p>

        <h4 className="topic">C.3 Reading the request in Express</h4>
        <p>
          Four places a request carries data, and four properties that read
          them. Destructure what you need out of each:
        </p>
        <CodeBlock
          language="typescript"
          code={`// PATCH /orders/17/items/3?notify=true    body: { "quantity": 5 }
app.patch("/orders/:id/items/:itemId", (req, res) => {
  const { id, itemId } = req.params;            // from the URL path — ALWAYS strings
  const { notify } = req.query;                 // from ?notify=true — also always strings
  const { quantity } = req.body;                // from the JSON body — real types (number here)
  const key = req.headers["idempotency-key"];   // header names are lower-cased by Node

  const orderId = Number(id);                   // convert before comparing to a number
  res.status(200).json({ orderId, itemId, notify, quantity, key });
});`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th>Where</th>
              <th>Answers</th>
              <th>Read with</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Path</td>
              <td>
                <strong>Which</strong> resource
              </td>
              <td>
                <code>req.params</code>
              </td>
              <td>
                <code>/orders/17</code> → <code>"17"</code>
              </td>
            </tr>
            <tr>
              <td>Query string</td>
              <td>
                <strong>How</strong> to filter or shape the response
              </td>
              <td>
                <code>req.query</code>
              </td>
              <td>
                <code>?status=placed&amp;limit=20</code>
              </td>
            </tr>
            <tr>
              <td>Body</td>
              <td>
                The <strong>data</strong> being sent (POST/PUT/PATCH)
              </td>
              <td>
                <code>req.body</code>
              </td>
              <td>
                <code>
                  {"{"} "customerId": 4 {"}"}
                </code>
              </td>
            </tr>
            <tr>
              <td>Headers</td>
              <td>
                Metadata <em>about</em> the request — type, auth, retry key
              </td>
              <td>
                <code>req.headers</code>
              </td>
              <td>
                <code>Authorization</code>, <code>Idempotency-Key</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Everything in <code>req.params</code> and <code>req.query</code> is a{" "}
          <strong>string</strong> — <code>/orders/17</code> gives you{" "}
          <code>"17"</code>, not <code>17</code>. Convert it before comparing,
          or <code>find</code> never matches.
        </p>

        <p>
          Now the same four properties across a real resource — four routes,
          four verbs:
        </p>
        <CodeBlock
          language="typescript"
          code={`interface Order {
  id: number;
  customerId: number;
  status: "placed" | "shipped" | "delivered";
  items: { productId: number; quantity: number }[];
}

const orders: Order[] = [];   // in memory for today; a real database starts tomorrow
let nextId = 1;

app.post("/orders", (req, res) => {
  const { customerId, items } = req.body;          // BODY — the data being created
  const order: Order = { id: nextId++, customerId, status: "placed", items };
  orders.push(order);
  res.status(201).json(order);                     // 201: something new exists now
});

app.get("/orders", (req, res) => {
  const { status } = req.query as { status?: string };   // QUERY — how to filter the list
  const result = status ? orders.filter((o) => o.status === status) : orders;
  res.status(200).json(result);
});

app.get("/orders/:id", (req, res) => {
  const { id } = req.params;                       // PATH — which order
  const order = orders.find((o) => o.id === Number(id));
  if (!order) {
    res.status(404).json({ error: { message: "Order not found" } });
    return;                                        // always return after responding
  }
  res.status(200).json(order);
});

app.patch("/orders/:id/status", (req, res) => {
  const { id } = req.params;                       // PATH — which order
  const { status } = req.body;                     // BODY — the new value for one field
  const order = orders.find((o) => o.id === Number(id));
  if (!order) {
    res.status(404).json({ error: { message: "Order not found" } });
    return;
  }
  order.status = status;
  res.status(200).json(order);                     // 200: it already existed, it changed
});`}
        />
        <p className="callout">
          <code>POST</code> creates something new and returns <code>201</code>.{" "}
          <code>PATCH</code> changes part of something that already exists and
          returns <code>200</code>. Neither one is "the update route" — the verb{" "}
          <em>is</em> the meaning.
        </p>

        <h4 className="topic">C.4 Seeing all of it: the Network tab</h4>
        <p>
          Open DevTools with <code>Cmd+Opt+I</code> (Mac) /{" "}
          <code>Ctrl+Shift+I</code> (Windows), then the Network tab, then filter
          to <strong>Fetch/XHR</strong>. Here's that same{" "}
          <code>POST /orders</code>, and where each part of it lives:
        </p>

        <div className="netmock">
          <div className="netmock-bar">
            <span>Elements</span>
            <span>Console</span>
            <span className="is-active">Network</span>
            <span>Sources</span>
            <span className="netmock-filter">Fetch/XHR</span>
          </div>

          <table className="netmock-list">
            <thead>
              <tr>
                <th>Name</th>
                <th>Method</th>
                <th>Status</th>
                <th>Type</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>orders?status=placed</td>
                <td>GET</td>
                <td className="netmock-ok">200</td>
                <td>fetch</td>
                <td>31 ms</td>
              </tr>
              <tr className="is-selected">
                <td>orders</td>
                <td>POST</td>
                <td className="netmock-ok">
                  <span className="netmark">1</span>201
                </td>
                <td>fetch</td>
                <td>48 ms</td>
              </tr>
              <tr>
                <td>orders/99</td>
                <td>GET</td>
                <td className="netmock-err">404</td>
                <td>fetch</td>
                <td>12 ms</td>
              </tr>
            </tbody>
          </table>

          <div className="netmock-detail">
            <div className="netmock-tabs">
              <span className="is-active">Headers</span>
              <span>Payload</span>
              <span>Response</span>
              <span>Timing</span>
            </div>

            <div className="netmock-pane">
              <p className="netmock-section">
                <span className="netmark">2</span>Headers — General
              </p>
              <div className="netmock-kv">
                <span>Request URL</span>
                <span>http://localhost:3000/orders</span>
              </div>
              <div className="netmock-kv">
                <span>Request Method</span>
                <span>POST</span>
              </div>
              <div className="netmock-kv">
                <span>Status Code</span>
                <span className="netmock-ok">201 Created</span>
              </div>
              <p className="netmock-section" style={{ marginTop: "0.7rem" }}>
                Request Headers
              </p>
              <div className="netmock-kv">
                <span>Content-Type</span>
                <span>application/json</span>
              </div>
              <div className="netmock-kv">
                <span>Idempotency-Key</span>
                <span>order-4-attempt-1</span>
              </div>
            </div>

            <div className="netmock-pane">
              <p className="netmock-section">
                <span className="netmark">3</span>Payload — what you sent
              </p>
              <pre className="netmock-body">{`{ "customerId": 4, "items": [{ "productId": 2, "quantity": 3 }] }`}</pre>
            </div>

            <div className="netmock-pane">
              <p className="netmock-section">
                <span className="netmark">4</span>Response — what came back
              </p>
              <pre className="netmock-body">{`{ "id": 17, "customerId": 4, "status": "placed" }`}</pre>
            </div>
          </div>
        </div>

        <ul className="netmock-legend">
          <li>
            <span className="netmark">1</span>
            <span>
              <strong>Status</strong> — tells you which side to debug before you
              read anything else. Red <code>404</code> = wrong URL.{" "}
              <code>400</code> = your body was rejected. <code>500</code> = the
              server threw.
            </span>
          </li>
          <li>
            <span className="netmark">2</span>
            <span>
              <strong>Headers</strong> — the method, the full URL, and the
              metadata. If <code>Content-Type: application/json</code> is
              missing here, <code>express.json()</code> never parses your body.
            </span>
          </li>
          <li>
            <span className="netmark">3</span>
            <span>
              <strong>Payload</strong> — what was <em>really</em> sent, not what
              you meant to send. Check this before blaming the server.
            </span>
          </li>
          <li>
            <span className="netmark">4</span>
            <span>
              <strong>Response</strong> — the raw body. An HTML stack trace here
              means the server crashed instead of returning JSON.
            </span>
          </li>
        </ul>
        <p className="callout">
          Right-click any request → <em>Copy as cURL</em> to replay it in the
          terminal with no front end involved — the fastest way to prove a bug
          is the API's and not the UI's.
        </p>

        {/* ================================================================= */}
        {/* Part D — designing the API                                         */}
        {/* ================================================================= */}
        <h3 className="part">Part D — Designing the API</h3>
        <p>
          Part C was mechanics. This is the part reviewers argue about: what the
          URLs are called, what each response means, and what happens when a
          client sends the same request twice.
        </p>

        <h4 className="topic">D.1 REST design principles</h4>
        <p>
          A REST resource is a noun (<code>/orders</code>), and the HTTP verb
          says what you're doing to it — not the URL.
        </p>
        <CodeBlock
          language="plaintext"
          bad={[2, 3, 4, 5]}
          good={[8, 9, 10, 11]}
          code={`# verbs in the URL — the method is then meaningless
POST /createOrder
POST /orders/17/updateStatus
GET  /getOrdersByCustomer?id=4
POST /deleteOrder/17

# the noun is the URL, the verb is the method
POST   /orders
PATCH  /orders/17/status
GET    /orders?customerId=4
DELETE /orders/17`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th>Principle</th>
              <th>Means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Resources are nouns</td>
              <td>
                <code>/orders</code>, never <code>/getOrders</code>
              </td>
            </tr>
            <tr>
              <td>Collections are plural</td>
              <td>
                <code>/orders</code> is the collection, <code>/orders/17</code>{" "}
                is one member
              </td>
            </tr>
            <tr>
              <td>The method is the action</td>
              <td>
                <code>GET</code> read, <code>POST</code> create,{" "}
                <code>PUT</code> replace, <code>PATCH</code> modify,{" "}
                <code>DELETE</code> remove
              </td>
            </tr>
            <tr>
              <td>Sub-resources nest</td>
              <td>
                <code>/orders/17/items</code> — but stop at two levels; deeper
                reads worse than a query param
              </td>
            </tr>
            <tr>
              <td>Filtering is a query param</td>
              <td>
                <code>/orders?status=placed&amp;limit=20</code>, not{" "}
                <code>/orders/placed</code>
              </td>
            </tr>
            <tr>
              <td>Statelessness</td>
              <td>Every request carries everything needed to serve it</td>
            </tr>
            <tr>
              <td>Consistent representations</td>
              <td>
                The same resource comes back with the same field names
                everywhere
              </td>
            </tr>
            <tr>
              <td>Status codes carry the outcome</td>
              <td>
                Never <code>200 OK</code> with{" "}
                <code>
                  {"{"} "error": "not found" {"}"}
                </code>{" "}
                in the body
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">D.2 Choosing a status code</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Meaning</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>200</td>
              <td>OK</td>
              <td>A GET or PATCH succeeded</td>
            </tr>
            <tr>
              <td>201</td>
              <td>Created</td>
              <td>A POST created a new resource</td>
            </tr>
            <tr>
              <td>204</td>
              <td>No Content</td>
              <td>
                It worked and there's nothing to return — usually a DELETE
              </td>
            </tr>
            <tr>
              <td>400</td>
              <td>Bad Request</td>
              <td>
                The client sent something invalid — missing field, wrong type
              </td>
            </tr>
            <tr>
              <td>401</td>
              <td>Unauthorized</td>
              <td>
                Not authenticated — no token, or an invalid one ("who are you?")
              </td>
            </tr>
            <tr>
              <td>403</td>
              <td>Forbidden</td>
              <td>
                Authenticated, but not allowed to do this ("I know you, no")
              </td>
            </tr>
            <tr>
              <td>404</td>
              <td>Not Found</td>
              <td>The resource id in the URL doesn't exist</td>
            </tr>
            <tr>
              <td>409</td>
              <td>Conflict</td>
              <td>
                Valid request, impossible in the current state — cancelling an
                already-shipped order
              </td>
            </tr>
            <tr>
              <td>429</td>
              <td>Too Many Requests</td>
              <td>
                The client is sending requests faster than the route allows
              </td>
            </tr>
            <tr>
              <td>500</td>
              <td>Internal Server Error</td>
              <td>
                Something broke on the server's own side, not the client's fault
              </td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">
            Concept — the class tells the caller whose problem it is
          </p>
          <ul>
            <li>
              <strong>2xx</strong> — it worked.
            </li>
            <li>
              <strong>3xx</strong> — go look somewhere else (redirects,
              caching).
            </li>
            <li>
              <strong>4xx</strong> — <em>the client</em> is wrong. Retrying the
              identical request won't help.
            </li>
            <li>
              <strong>5xx</strong> — <em>the server</em> is wrong. Retrying
              later might work, which is exactly why 4xx/5xx must not be mixed
              up.
            </li>
          </ul>
        </div>

        <h4 className="topic">D.3 Idempotency</h4>
        <p>
          An operation is <strong>idempotent</strong> if doing it five times
          leaves the system in the same state as doing it once. It's not about
          the response being identical — it's about the side effects.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Verb</th>
              <th>Safe (no change)</th>
              <th>Idempotent</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>GET</code>
              </td>
              <td>Yes</td>
              <td>Yes</td>
              <td>
                <code>GET /orders/17</code> five times — still one order,
                unchanged
              </td>
            </tr>
            <tr>
              <td>
                <code>PUT</code>
              </td>
              <td>No</td>
              <td>Yes</td>
              <td>
                <code>PUT /orders/17</code> with the same body five times — the
                order ends up in that exact state once
              </td>
            </tr>
            <tr>
              <td>
                <code>DELETE</code>
              </td>
              <td>No</td>
              <td>Yes</td>
              <td>
                <code>DELETE /orders/17</code> five times — deleted after the
                first; the rest are 404 but change nothing
              </td>
            </tr>
            <tr>
              <td>
                <code>PATCH</code>
              </td>
              <td>No</td>
              <td>It depends</td>
              <td>
                <code>
                  {"{"} status: "shipped" {"}"}
                </code>{" "}
                is idempotent;{" "}
                <code>
                  {"{"} incrementQuantityBy: 1 {"}"}
                </code>{" "}
                is not
              </td>
            </tr>
            <tr>
              <td>
                <code>POST</code>
              </td>
              <td>No</td>
              <td>No</td>
              <td>
                <code>POST /orders</code> five times — five separate orders,
                five charges
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          good={[2, 7]}
          bad={[12]}
          code={`// idempotent: the end state doesn't depend on how many times this ran
app.put("/orders/:id/status", (req, res) => {
  const { status } = req.body;
  order.status = status;                 // "shipped" -> "shipped" -> "shipped"
  res.status(200).json(order);
});

// NOT idempotent: each call moves the value again
app.patch("/inventory/:id", (req, res) => {
  const { delta } = req.body;
  item.quantity += delta;                // +1, +1, +1 — three calls, three effects
  res.status(200).json(item);
});`}
        />
        <div className="concept">
          <p className="concept-label">Concept — why anyone cares</p>
          <ul>
            <li>
              Networks lose responses. The client sent the request, the server
              handled it, and the reply never arrived — the client has no way to
              tell that from "never received".
            </li>
            <li>
              So clients, proxies and job queues <strong>retry</strong>.
              Retrying an idempotent request is free; retrying a{" "}
              <code>POST</code> creates a duplicate order.
            </li>
            <li>
              That's why the user double-clicking "Place order" is a real bug
              class, not a joke.
            </li>
            <li>
              The standard fix for a non-idempotent endpoint is an{" "}
              <strong>idempotency key</strong>: the client sends a unique key
              with the request, and the server returns the original result if it
              has already seen that key.
            </li>
          </ul>
        </div>
        <CodeBlock
          language="typescript"
          code={`const seen = new Map<string, Order>();

app.post("/orders", (req, res) => {
  const { customerId, items } = req.body;
  const key = req.headers["idempotency-key"] as string | undefined;

  if (key && seen.has(key)) {
    res.status(200).json(seen.get(key));   // the retry gets the ORIGINAL order back
    return;
  }

  const order: Order = { id: nextId++, customerId, status: "placed", items };
  orders.push(order);
  if (key) seen.set(key, order);
  res.status(201).json(order);
});`}
        />

        {/* ================================================================= */}
        {/* Part E — validation                                                */}
        {/* ================================================================= */}
        <h3 className="part">
          Part E — Validating the request, and a consistent error shape
        </h3>
        <p>
          Express's default error page is an HTML stack trace — nothing an API
          client can parse. Every error this app returns uses the same JSON
          shape instead.
        </p>
        <CodeBlock
          language="typescript"
          code={`app.post("/orders", (req, res) => {
  const { customerId, items } = req.body;
  // validating the body's fields
  if (typeof customerId !== "number" || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: { message: "customerId and a non-empty items array are required" } });
    return;
  }

  const order: Order = { id: nextId++, customerId, status: "placed", items };
  orders.push(order); // only reached once validation has already passed
  res.status(201).json(order);
});`}
        />
        <p className="callout">
          Always <code>return</code> right after sending a response inside a
          handler — without it, the function keeps running and can try to send a
          second response on the same request, which crashes with "Cannot set
          headers after they are sent."
        </p>
      </section>
    </div>
  );
}
