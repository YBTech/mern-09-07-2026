import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 13 — Concepts Reference</title>
      <DayNav day="day13-layered-architecture" current="concepts" />
      <h1>Day 13 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before
        revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up
          constantly in interviews. If you're shaky on any of these, that's the
          priority to fix.
        </p>

        <details>
          <summary>
            What is each layer's responsibility: controller, service,
            repository?
          </summary>
          <div className="answer">
            <p>
              Controller: HTTP in, HTTP out — parse the request, call one
              service method, send the response. Service: the business rules —
              validation, workflow, orchestrating repositories. Repository: the
              database — reads and writes rows, nothing else.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why shouldn't a controller talk to the database directly?
          </summary>
          <div className="answer">
            <p>
              Because then every endpoint has to re-implement whatever
              validation or business rule applies to that data. Routing all
              access through a service means the rule is written once and every
              caller gets it, instead of trusting each controller to remember
              it.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why do we need an ORM, and what are some popular ones?
          </summary>
          <div className="answer">
            <p>
              An ORM (object-relational mapper) maps rows to objects and
              generates the SQL for you, so you're not hand-writing a slightly
              different <code>SELECT</code>/<code>INSERT</code> for every query
              — it also gives you type checking on column names and
              parameterizes queries automatically, closing off SQL injection by
              default. Popular ones: <strong>Prisma</strong> (schema file,
              generates a fully-typed client), <strong>TypeORM</strong>{" "}
              (decorator-based classes), <strong>Sequelize</strong>{" "}
              (ActiveRecord-style model instances), and{" "}
              <strong>Drizzle</strong> (a query builder that still reads like
              SQL — what this project uses).
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why do we still need a repository layer if we're already using an
            ORM?
          </summary>
          <div className="answer">
            <p>
              The ORM generates the query; the repository is the boundary that
              decides <em>which</em> query and hides that decision from the
              rest of the app. Without it, every service would call{" "}
              <code>db.select()...</code> directly, so swapping the ORM later
              or mocking data access in a test means touching every service
              instead of one file per table.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you handle errors in Express, end to end?</summary>
          <div className="answer">
            <p>
              Define small custom error classes (<code>NotFoundError</code>,{" "}
              <code>ValidationError</code>, ...) that each carry their own HTTP
              status code, so the layer that throws one — usually the service —
              never has to know or care about HTTP. Validate input up front and
              wrap anything that can still throw in <code>try/catch</code> (or
              an async-handler wrapper), so a thrown error becomes a call to{" "}
              <code>next(err)</code> instead of an unhandled rejection that
              crashes the process. Register one error-handling middleware last,
              after every route — Express recognizes it by its four-parameter
              signature, <code>(err, req, res, next)</code>, instead of three —
              and route every error there. That single middleware reads the
              status code off the error and responds with one consistent{" "}
              <code>
                {"{"} error: {"{"} message {"}"} {"}"}
              </code>{" "}
              shape, so every client can check{" "}
              <code>response.error.message</code> the same way no matter which
              endpoint failed, instead of Express's default HTML stack trace.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What's a cache hit vs. a cache miss, and what is the cache-aside
            pattern?
          </summary>
          <div className="answer">
            <p>
              A <strong>cache hit</strong> is when the requested data is
              already in the cache, so it's returned immediately and the
              database is never touched. A <strong>cache miss</strong> is when
              it isn't, so the code falls through to the real source.{" "}
              <strong>Cache-aside</strong> is the pattern built around that:
              check the cache first; on a hit, return it; on a miss, fetch from
              the repository, write the result into the cache with an expiry
              (TTL), then return it — so the next read is a hit, until it
              expires or is invalidated.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Structurally, what is Express middleware, and what does{" "}
            <code>app.use(...)</code> actually register?
          </summary>
          <div className="answer">
            <p>
              Middleware is just a function shaped <code>(req, res, next)</code>{" "}
              that runs before your route handler. <code>app.use(...)</code>{" "}
              adds it to a chain Express runs in order for every matching
              request; each one can inspect/modify <code>req</code>, end the
              response early, or call <code>next()</code> to hand off to the
              next function in the chain.
            </p>
            <p>
              Common use cases: parsing the body (<code>express.json()</code>),
              logging every request, authenticating a token before the route
              runs, and centralized error handling.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Give some examples of Express middleware — what does each one do?
          </summary>
          <div className="answer">
            <ul>
              <li>
                <code>express.json()</code> — parses a JSON request body into{" "}
                <code>req.body</code>
              </li>
              <li>
                <code>cookie-parser</code> — reads incoming cookies into{" "}
                <code>req.cookies</code>
              </li>
              <li>
                <code>morgan</code> — logs every request's method, path,
                status and timing
              </li>
              <li>
                <code>cors</code> — adds the headers that let a browser on a
                different origin call this API at all
              </li>
              <li>
                <code>helmet</code> — sets a batch of security-related
                response headers
              </li>
            </ul>
            <p>
              Custom middleware (auth checks, request logging, rate limiting)
              follows the exact same <code>(req, res, next)</code> shape as
              all of these.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
