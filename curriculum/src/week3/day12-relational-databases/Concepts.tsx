import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 12 — Concepts Reference</title>
      <DayNav day="day12-relational-databases" current="concepts" />

      <h1>Day 12 — Concepts Reference</h1>
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
          <summary>
            What's the difference between <code>INSERT</code>, <code>UPDATE</code>, and{" "}
            <code>DELETE</code>, and when would you use each?
          </summary>
          <div className="answer">
            <p>
              <code>INSERT</code> adds a new row, <code>UPDATE</code> changes columns on existing
              rows matching a condition, and <code>DELETE</code> removes rows matching a condition.
              All three (plus <code>SELECT</code>) are the four CRUD operations every table needs.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What's the difference between an <code>INNER JOIN</code> and a <code>LEFT JOIN</code>?
          </summary>
          <div className="answer">
            <p>
              <code>INNER JOIN</code> only returns rows that have a match in both tables.{" "}
              <code>LEFT JOIN</code> returns every row from the left table, with <code>NULL</code>{" "}
              columns filled in when there's no matching row on the right — useful when you want
              "every customer, even ones with zero orders."
            </p>
          </div>
        </details>

        <details>
          <summary>What does each letter in ACID stand for, in your own words?</summary>
          <div className="answer">
            <p>
              <strong>A</strong>tomicity — all of a transaction's writes happen or none do.{" "}
              <strong>C</strong>onsistency — a transaction can only leave the database in a valid
              state. <strong>I</strong>solation — concurrent transactions can't see each other's
              uncommitted changes. <strong>D</strong>urability — a committed transaction survives a
              crash.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does a multi-table write need to be wrapped in a transaction?</summary>
          <div className="answer">
            <p>
              Without one, a crash or error partway through leaves some tables updated and others
              not — e.g. an order row inserted but its items missing. Wrapping the whole sequence in{" "}
              <code>BEGIN</code>/<code>COMMIT</code> makes it all-or-nothing, and a failure triggers{" "}
              <code>ROLLBACK</code> instead of a half-finished write.
            </p>
          </div>
        </details>

        <details>
          <summary>What is third normal form (3NF), in one sentence?</summary>
          <div className="answer">
            <p>
              Every non-key column depends only on the table's primary key, and not on any other
              non-key column — no repeated or derivable data sitting in a table where it doesn't
              belong.
            </p>
          </div>
        </details>

        <details>
          <summary>
            When is it OK to deliberately break normalization, like storing a captured price on an
            order line?
          </summary>
          <div className="answer">
            <p>
              When the "normalized" version would change meaning over time in a way that breaks
              correctness — a product's live price can change, but what a customer was actually
              charged for a past order must never change with it. Capturing the value at write time
              is intentional denormalization, not a mistake.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a stored procedure, and what's one real reason to use one?</summary>
          <div className="answer">
            <p>
              A named block of SQL logic saved inside the database, callable by name instead of
              re-sent by the app every time. It's useful when logic needs to stay identical no matter
              which application calls it, or for work the database itself should trigger or schedule.
            </p>
          </div>
        </details>

        <details>
          <summary>What's the difference between a <code>PRIMARY KEY</code> and a <code>UNIQUE</code> constraint?</summary>
          <div className="answer">
            <p>
              A table can have only one <code>PRIMARY KEY</code>, it can't contain{" "}
              <code>NULL</code>, and it's what other tables reference with a foreign key. A table can
              have several <code>UNIQUE</code> constraints, and a unique column can still be{" "}
              <code>NULL</code> (Postgres treats multiple <code>NULL</code>s as distinct, not equal
              to each other).
            </p>
          </div>
        </details>

        <details>
          <summary>What is a foreign key, and what does it actually enforce?</summary>
          <div className="answer">
            <p>
              A column that must match a value already present in another table's primary key (or be{" "}
              <code>NULL</code>, if nullable). It stops orphaned rows — you can't insert an{" "}
              <code>order_items</code> row pointing at a <code>product_id</code> that doesn't exist.
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
          <summary>What's the difference between <code>DELETE</code> and <code>TRUNCATE</code>?</summary>
          <div className="answer">
            <p>
              <code>DELETE</code> removes rows one at a time, can be filtered with{" "}
              <code>WHERE</code>, and can be rolled back inside a transaction.{" "}
              <code>TRUNCATE</code> deallocates the whole table's data at once, can't be filtered,
              and is much faster on large tables — but resets things like auto-increment counters
              that <code>DELETE</code> leaves alone.
            </p>
          </div>
        </details>

        <details>
          <summary>What are database isolation levels, and what's Postgres's default?</summary>
          <div className="answer">
            <p>
              Isolation levels control how much one transaction can see of another's in-progress
              changes, trading strictness for concurrency: <code>READ UNCOMMITTED</code>,{" "}
              <code>READ COMMITTED</code>, <code>REPEATABLE READ</code>, <code>SERIALIZABLE</code>.
              Postgres defaults to <code>READ COMMITTED</code> — a query only ever sees data that was
              committed before that query started.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a deadlock, and how does Postgres typically respond to one?</summary>
          <div className="answer">
            <p>
              Two transactions each hold a lock the other one is waiting for, so neither can proceed.
              Postgres detects the cycle and forcibly aborts one of the transactions (returning a
              deadlock error), letting the other continue — the aborted one is expected to retry.
            </p>
          </div>
        </details>

        <details>
          <summary>What's a composite primary key, and when would you use one?</summary>
          <div className="answer">
            <p>
              A primary key made of two or more columns together, instead of one surrogate{" "}
              <code>id</code>. Common for pure join/junction tables where the natural key already is
              the pair — e.g. <code>(store_id, product_id)</code> uniquely identifying one inventory
              row.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a self-join, and when would you need one?</summary>
          <div className="answer">
            <p>
              A table joined to itself, usually to compare rows within the same table — e.g. an{" "}
              <code>employees</code> table with a <code>manager_id</code> column referencing another
              row in the same table, joined to list each employee next to their manager's name.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
