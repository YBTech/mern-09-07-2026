import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 11 — Practice</title>
      <DayNav day="day11-node-express" current="practice" />
      <h1>Day 11 — Practice</h1>
      <p className="intro">
        Everything below is required — get all of it solid and bring it to the 6pm lab.
      </p>
      <p className="callout">
        Work through these during the gap between lecture and lab. Use the Notes page as your
        reference if you get stuck on syntax.
      </p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Be able to set up and run a Node project from the terminal.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="bash"
            code={`cd my-day11-project     # 1. navigate into the project folder from wherever your terminal starts
cat package.json        # 2. find "scripts" (how do you start this?) and "dependencies" (what's installed?)
npm install             # 3. install everything package.json declares
npm run dev             # 4. start the server using the script name from step 2
                         # 5. Ctrl+C to stop it — same on Mac and Windows (not Cmd+C)`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Be able to check an endpoint's response two ways: a browser tab, and Postman.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="plaintext"
            code={`GET /health   ->  paste http://localhost:3000/health straight into a browser tab   # GET only — no body, no other verb
POST /tasks   ->  Postman: set the method + URL, Body tab -> raw -> JSON, then Send  # anything with a body needs a real client`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Be able to define Express routes for each verb, including one with a route param.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`app.get("/tasks", ...)        // 1. reads the whole collection
app.post("/tasks", ...)       // 2. creates one
app.get("/tasks/:id", ...)    // 3. a route param — read it back with req.params.id`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Be able to read params, query, and body off a request and respond with status + JSON.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`app.get("/tasks/:id", (req, res) => { ... })
// 1. read the id from the URL path — req.params, not req.query

app.get("/tasks", (req, res) => { ... })
// 2. support /tasks?done=true — read it from req.query and filter the list

app.post("/tasks", (req, res) => { ... })
// 3. read title and done off req.body, then res.status(201).json(...) the created task`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Be able to design a REST resource with correct verbs and status codes.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            language="typescript"
            code={`app.post("/tasks", ...)          // 1. creates a task — pick the status code for a new resource
app.get("/tasks/:id", ...)       // 2. reads one task — pick the status code for found vs. missing
app.patch("/tasks/:id", ...)     // 3. updates part of a task — pick the status code for success`}
          />
        </div>
      </div>

      <p className="section-label">Put it all together</p>
      <p className="section-note">
        Two scenarios, each combining several of today's tools into one realistic problem — this is
        the real test of whether it clicked.
      </p>

      <div className="task challenge">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>Reading list API.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`interface Article {
  id: number;
  url: string;
  tag: string;
  read: boolean;
}

let articles: Article[] = [];
let nextId = 1;`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              <code>POST /articles</code> — create one from <code>url</code> and <code>tag</code>,
              starting <code>read: false</code>; <code>400</code> if <code>url</code> is missing.
            </li>
            <li>
              <code>GET /articles</code> — supports <code>?tag=</code> and <code>?read=</code> query
              filters, combinable.
            </li>
            <li>
              <code>GET /articles/:id</code> — <code>404</code> if the id doesn't exist.
            </li>
            <li>
              <code>DELETE /articles/:id</code> — removes it and responds <code>200</code> with the
              deleted article; <code>404</code> if it was never there.
            </li>
          </ul>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Habit tracker API.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`interface Habit {
  id: number;
  name: string;
  streak: number;
}

let habits: Habit[] = [];
let nextId = 1;`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              <code>POST /habits</code> — create one from <code>name</code>, starting{" "}
              <code>streak: 0</code>.
            </li>
            <li>
              <code>PATCH /habits/:id/complete</code> — increments <code>streak</code> by one;{" "}
              <code>404</code> if the id doesn't exist.
            </li>
            <li>
              <code>GET /habits/:id</code> — returns the habit; pick the right status for found vs.
              missing.
            </li>
            <li>
              Every handler <code>return</code>s immediately after sending its response — no
              "headers already sent" crashes.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
