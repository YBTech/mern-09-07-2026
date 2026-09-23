import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 12 Notes</title>
      <DayNav day="day12-relational-databases" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow">Week 3 · Day 12 · Notes</p>
        <h1>Relational Databases</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>

        <p className="compare-label">Write — hands on the keyboard</p>
        <ul>
          <li>
            Write a query with <code>SELECT</code> / <code>FROM</code> /{" "}
            <code>WHERE</code> / <code>ORDER BY</code> / <code>LIMIT</code>
          </li>
          <li>
            Write the simplest <code>LEFT JOIN</code> — two tables, one{" "}
            <code>ON</code> condition
          </li>
          <li>
            Write basic CRUD SQL (<code>SELECT</code>/<code>INSERT</code>/
            <code>UPDATE</code>/<code>DELETE</code>) against a real table
          </li>
          <li>
            Aggregate with <code>COUNT</code>/<code>SUM</code>/<code>AVG</code>{" "}
            plus <code>GROUP BY</code>
          </li>
        </ul>

        <p className="compare-label">Explain — out loud, no editor needed</p>
        <ul>
          <li>
            Read a table schema and say what each column and each constraint is
            there for
          </li>
          <li>
            Point at a foreign key and say which two tables it links, and which
            side holds it
          </li>
          <li>
            Explain why a query built by string concatenation is open to SQL
            injection, and how a parameterized query closes it
          </li>
          <li>
            Say what each of the four <strong>ACID</strong> guarantees means,
            and give a simple example of each
          </li>
          <li>Explain what normalization is and what problem it solves</li>
          <li>Say what a stored procedure is</li>
        </ul>
        <p>
          Want more?{" "}
          <Link to="/week3/day12-relational-databases/concepts">
            View all concepts?
          </Link>
        </p>
      </section>

      <hr className="section-divider" />

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>
        <p className="callout">
          Today is the high-level pass: enough SQL to build this project. The
          full reference — every join, every data type, window functions,
          isolation levels — is{" "}
          <Link to="/week3/additional-backend-topics/full-sql/foundation">
            Full SQL · Foundation
          </Link>
          .
        </p>

        <h3>2.1 Where the data actually lives</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>What it is</th>
              <th>In this project</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Database</td>
              <td>
                The top-level container; one connection targets one database
              </td>
              <td>
                <code>oms</code>
              </td>
            </tr>
            <tr>
              <td>Schema</td>
              <td>
                A namespace for tables inside it (Postgres defaults to{" "}
                <code>public</code>)
              </td>
              <td>
                <code>public</code>
              </td>
            </tr>
            <tr>
              <td>Table</td>
              <td>One entity type — columns are its shape</td>
              <td>
                <code>orders</code>, <code>products</code>
              </td>
            </tr>
            <tr>
              <td>Row / column</td>
              <td>One record / one typed field of every record</td>
              <td>
                Order #4012 / <code>orders.status</code>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              The database is a <strong>separate server process</strong> — your
              Express app talks to it over TCP, so every query is a network
              round trip. That single fact drives most of Day 14.
            </li>
            <li>
              SQL is <strong>declarative</strong>: you describe the result, and
              the query planner decides how to get it. You never write the loop.
            </li>
            <li>
              Everything here is PostgreSQL. MySQL and SQL Server share most of
              the syntax and differ on the edges.
            </li>
          </ul>
        </div>

        <h3>2.2 The schema we're building</h3>
        <p>
          Starting today, this is the real relational schema for the Order
          Management &amp; Fulfillment platform this whole course builds toward
          — every day from here on adds to it.
        </p>
        <CodeBlock
          language="sql"
          code={`CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  region VARCHAR(80) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('retail', 'fulfillment_center'))
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  price_cents INTEGER NOT NULL
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  UNIQUE (store_id, product_id),
  CHECK (quantity_reserved <= quantity_on_hand)  -- can never reserve more than physically exists
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  store_id INTEGER REFERENCES stores(id),
  status VARCHAR(20) NOT NULL DEFAULT 'placed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL
);

CREATE TABLE order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);`}
        />

        <h3>2.3 Data types — picking the column</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Types</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Numeric</td>
              <td>
                <code>INTEGER</code>, <code>BIGINT</code>,{" "}
                <code>DECIMAL(p,s)</code>, <code>REAL</code>
              </td>
              <td>
                <code>INTEGER</code> for ids and counts, <code>DECIMAL</code>{" "}
                for exact money, never a float for money
              </td>
            </tr>
            <tr>
              <td>String</td>
              <td>
                <code>VARCHAR(n)</code>, <code>TEXT</code>, <code>CHAR(n)</code>
              </td>
              <td>
                <code>VARCHAR(n)</code> when the limit is a real rule,{" "}
                <code>TEXT</code> for free-form; <code>CHAR</code> pads with
                spaces — avoid
              </td>
            </tr>
            <tr>
              <td>Date / time</td>
              <td>
                <code>DATE</code>, <code>TIME</code>, <code>TIMESTAMPTZ</code>,{" "}
                <code>INTERVAL</code>
              </td>
              <td>
                <code>TIMESTAMPTZ</code> by default — plain{" "}
                <code>TIMESTAMP</code> is an ambiguous wall clock
              </td>
            </tr>
            <tr>
              <td>Boolean</td>
              <td>
                <code>BOOLEAN</code>
              </td>
              <td>
                Three states, not two: <code>TRUE</code>, <code>FALSE</code>,{" "}
                <code>NULL</code>
              </td>
            </tr>
            <tr>
              <td>JSON</td>
              <td>
                <code>JSONB</code>
              </td>
              <td>
                Genuinely variable data only — it's an escape hatch, not a
                schema substitute
              </td>
            </tr>
            <tr>
              <td>Id</td>
              <td>
                <code>SERIAL</code> / <code>UUID</code>
              </td>
              <td>
                <code>SERIAL</code> unless ids must be generated outside the
                database or must not leak volume
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="sql"
          bad={[2]}
          good={[3]}
          code={`-- why money is never a float
SELECT 0.1::REAL + 0.2::REAL = 0.3::REAL;   -- false — binary float can't represent 0.1
SELECT 1299 + 250;                          -- integer cents: exact, and what this course uses`}
        />

        <h3>2.4 Constraints — rules the database enforces, not your app</h3>
        <p>
          App-level validation can be bypassed by another service, a script, or
          someone in <code>psql</code>. A constraint cannot.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Constraint</th>
              <th>Guarantees</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>PRIMARY KEY</code>
              </td>
              <td>
                Identifies the row uniquely; implies <code>NOT NULL</code> +{" "}
                <code>UNIQUE</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>REFERENCES</code> (foreign key)
              </td>
              <td>The row it points at exists — no orphan order items</td>
            </tr>
            <tr>
              <td>
                <code>NOT NULL</code>
              </td>
              <td>The column always has a value</td>
            </tr>
            <tr>
              <td>
                <code>UNIQUE</code>
              </td>
              <td>
                No two rows share the value — one inventory row per (store,
                product)
              </td>
            </tr>
            <tr>
              <td>
                <code>CHECK</code>
              </td>
              <td>
                An arbitrary per-row rule, e.g. <code>quantity &gt; 0</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>DEFAULT</code>
              </td>
              <td>
                Not a constraint — the value used when the column is omitted
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="plaintext"
          code={`ON DELETE CASCADE    -- deleting the order deletes its items (order_items)
ON DELETE RESTRICT   -- refuse to delete a product any order still references (products)`}
        />
        <p className="callout">
          <code>CASCADE</code> on order items is right — a line item is
          meaningless without its order. <code>RESTRICT</code> on products is
          right too: deleting a product that appears in past orders would
          destroy financial history.
        </p>

        <h3>2.5 The shape of a query</h3>
        <CodeBlock
          language="sql"
          code={`SELECT   store_id, COUNT(*) AS order_count      -- 5. which columns come out
FROM     orders                                 -- 1. which table
WHERE    created_at > now() - INTERVAL '30 days' -- 2. which rows survive
GROUP BY store_id                               -- 3. how rows collapse into groups
HAVING   COUNT(*) > 10                          -- 4. which groups survive
ORDER BY order_count DESC                       -- 6. how the output is sorted
LIMIT    5;                                     -- 7. how many rows come back`}
        />
        <div className="concept">
          <p className="concept-label">
            Concept — written order is not execution order
          </p>
          <ul>
            <li>
              <code>WHERE</code> runs before grouping, so it filters{" "}
              <em>rows</em>. <code>HAVING</code> runs after, so it filters{" "}
              <em>groups</em>. That's the whole difference.
            </li>
            <li>
              <code>SELECT</code> runs after <code>GROUP BY</code> — which is
              why every selected column must be grouped or aggregated.
            </li>
            <li>
              <code>SELECT</code> runs before <code>ORDER BY</code> — which is
              why <code>ORDER BY order_count</code> can use the alias and{" "}
              <code>WHERE</code> cannot.
            </li>
            <li>
              <code>LIMIT</code> runs last. It never makes the underlying work
              smaller by itself.
            </li>
          </ul>
        </div>

        <h3>2.6 CRUD SQL</h3>
        <CodeBlock
          language="sql"
          code={`INSERT INTO products (sku, name, price_cents)
VALUES ('MUG-001', 'Ceramic Mug', 1299)
RETURNING id;                      -- get the generated id back without a second query

SELECT id, name, price_cents FROM products WHERE price_cents < 1500;

UPDATE products SET price_cents = 1499 WHERE sku = 'MUG-001';

DELETE FROM products WHERE id = 4;`}
        />
        <CodeBlock
          language="sql"
          bad={[2]}
          good={[3]}
          code={`-- the most expensive typo in SQL
UPDATE orders SET status = 'shipped';                  -- no WHERE: every order in the table
UPDATE orders SET status = 'shipped' WHERE id = 4012;  -- one row`}
        />
        <p className="callout">
          Habit worth building today: write it as a <code>SELECT</code> with the
          same <code>WHERE</code> first, check the row count, then swap in{" "}
          <code>UPDATE</code>/<code>DELETE</code>.
        </p>

        <h3>2.7 Filtering, sorting, limiting</h3>
        <CodeBlock
          language="sql"
          code={`SELECT id, status, created_at
FROM orders
WHERE status IN ('placed', 'routed')          -- one of a set
  AND created_at BETWEEN '2026-01-01' AND '2026-01-31'
  AND store_id IS NOT NULL                    -- NULL needs IS, never =
ORDER BY created_at DESC, id DESC             -- second key breaks ties deterministically
LIMIT 20 OFFSET 40;                           -- rows 41-60`}
        />
        <div className="concept">
          <p className="concept-label">
            Concept — NULL means "unknown", and it poisons comparisons
          </p>
          <ul>
            <li>
              Any comparison with <code>NULL</code> returns <code>NULL</code>,
              not true or false — so <code>WHERE store_id = NULL</code> matches
              nothing, ever.
            </li>
            <li>
              <code>IS NULL</code> / <code>IS NOT NULL</code> are the only
              operators that test for it.
            </li>
            <li>
              <code>WHERE status &lt;&gt; 'cancelled'</code> silently drops rows
              where <code>status</code> is NULL — "unknown is not cancelled" is
              itself unknown, and unknown doesn't survive a <code>WHERE</code>.
            </li>
            <li>
              <code>AND</code> binds tighter than <code>OR</code>. Parenthesize
              whenever you mix them.
            </li>
          </ul>
        </div>
        <p className="callout">
          Without <code>ORDER BY</code>, row order is undefined and changes when
          the plan changes — so paginating an unordered query silently skips and
          repeats rows.
        </p>

        <h3>2.8 Aggregates and GROUP BY</h3>
        <CodeBlock
          language="sql"
          code={`-- revenue per store, busiest first, stores with fewer than 10 orders excluded
SELECT s.name,
       COUNT(*) AS order_count,
       SUM(oi.quantity * oi.unit_price_cents) AS revenue_cents
FROM orders o
JOIN stores s ON s.id = o.store_id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'      -- filters ROWS, before grouping
GROUP BY s.id, s.name
HAVING COUNT(*) >= 10              -- filters GROUPS, after aggregating
ORDER BY revenue_cents DESC;`}
        />
        <p>
          <code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> counts
          non-NULL values of that column; <code>SUM</code> and <code>AVG</code>{" "}
          skip NULLs rather than treating them as zero.
        </p>

        <h3>2.9 Relationships</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Shape</th>
              <th>Where the key goes</th>
              <th>In this project</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>One-to-one</td>
              <td>
                Foreign key on either side, made <code>PRIMARY KEY</code> or{" "}
                <code>UNIQUE</code>
              </td>
              <td>A customer and their billing details</td>
            </tr>
            <tr>
              <td>One-to-many</td>
              <td>
                Foreign key on the <em>many</em> side
              </td>
              <td>
                <code>orders.customer_id</code>,{" "}
                <code>order_items.order_id</code>
              </td>
            </tr>
            <tr>
              <td>Many-to-many</td>
              <td>A third join table holding both keys</td>
              <td>
                <code>inventory</code> (stores ↔ products)
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="plaintext"
          code={`-- one-to-many: the "many" side holds the key
orders.customer_id  -> customers.id

-- many-to-many: neither side can hold it, so a join table does
inventory (store_id, product_id, quantity_on_hand)`}
        />
        <p className="callout">
          A join table that carries extra columns (<code>quantity_on_hand</code>
          ) is an entity in its own right — which is why it's called{" "}
          <code>inventory</code>, not <code>store_products</code>.
        </p>

        <h3>2.10 Joins</h3>
        <p>
          A join matches rows from two tables on a condition. What happens when
          there's <em>no</em> match is the only real difference between the
          types.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Join</th>
              <th>Keeps</th>
              <th>Question it answers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>INNER JOIN</code>
              </td>
              <td>Only rows matched on both sides</td>
              <td>"Orders and the customer who placed them"</td>
            </tr>
            <tr>
              <td>
                <code>LEFT JOIN</code>
              </td>
              <td>All left rows; right columns NULL where unmatched</td>
              <td>"Every customer, with their order count — zero included"</td>
            </tr>
            <tr>
              <td>
                <code>RIGHT JOIN</code>
              </td>
              <td>Mirror of LEFT</td>
              <td>Rare — swap the tables and use LEFT</td>
            </tr>
            <tr>
              <td>
                <code>FULL OUTER JOIN</code>
              </td>
              <td>All rows from both sides</td>
              <td>"Reconcile two systems"</td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="sql"
          code={`-- 2 tables: every order alongside its customer's name
SELECT orders.id, customers.name, orders.status
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id
WHERE orders.status = 'routed';`}
        />
        <CodeBlock
          language="sql"
          code={`-- 3 tables: what's actually in one order
SELECT orders.id AS order_id, products.name, order_items.quantity, order_items.unit_price_cents
FROM orders
INNER JOIN order_items ON order_items.order_id = orders.id
INNER JOIN products ON products.id = order_items.product_id
WHERE orders.id = 1;`}
        />
        <CodeBlock
          language="sql"
          code={`-- LEFT JOIN + IS NULL = "the rows with no match": customers who have never ordered
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;`}
        />
        <p className="callout">
          On a <code>LEFT JOIN</code>, a condition on the right table belongs in{" "}
          <code>ON</code>, not <code>WHERE</code> — in <code>WHERE</code> it
          deletes the unmatched NULL rows and silently turns the query back into
          an inner join.
        </p>

        <h3>2.11 Parameterized queries &amp; SQL injection</h3>
        <p>
          <strong>Problem:</strong> building a query by pasting user input straight into the SQL
          string lets that input change what the query does, not just what it searches for.
        </p>
        <CodeBlock
          language="typescript"
          bad={[3]}
          code={`// user types this into the email field:  ' OR '1'='1
const email = req.body.email;
const { rows } = await pool.query(\`SELECT * FROM customers WHERE email = '\${email}'\`);
// runs: SELECT * FROM customers WHERE email = '' OR '1'='1'
// -- matches EVERY row in the table, not the one customer that was asked for`}
        />
        <p className="callout">
          A more destructive input — <code>'; DROP TABLE customers; --</code> — works the same
          way. The database can't tell SQL you wrote from SQL a user typed once they're pasted
          into the same string.
        </p>
        <p>
          <strong>Solution:</strong> a parameterized query. The value travels to the database
          separately from the SQL text, so it can never be interpreted as SQL:
        </p>
        <CodeBlock
          language="typescript"
          good={[2]}
          code={`const email = req.body.email;
const { rows } = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
// Postgres parses "WHERE email = $1" first — $1 can only ever be a value, never more SQL`}
        />
        <p className="callout">
          An ORM (Day 13) builds parameterized queries under the hood for every normal call, so
          writing ordinary ORM code already gets this for free. The one place it still bites: an
          ORM's raw/unsafe escape hatch for building a query string by hand — use it only for
          values you wrote yourself, never for user input.
        </p>

        <h3>2.12 Normalization</h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <strong>Normalization</strong> just means organizing tables so every
          fact lives in exactly one place — never repeating the same value
          across rows just because two things happened to occur together. 1NF,
          2NF, and 3NF are three increasingly strict versions of that one idea:
        </div>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              1NF — every column holds one atomic value, no repeating groups in
              a single cell.
            </li>
            <li>
              2NF — every non-key column depends on the whole primary key, not
              just part of it.
            </li>
            <li>
              3NF — every non-key column depends only on the key, not on another
              non-key column (no transitive dependencies).
            </li>
            <li>
              The schema above is already normalized this way: a product's name
              and price live once, in <code>products</code> — not copied onto
              every <code>order_items</code> row.
            </li>
          </ul>
        </div>

        <p>
          One example, carried through all three steps — starting from a single
          wide table and fixing one dependency at a time:
        </p>

        <p>
          <strong>Before</strong> — everything crammed into one table. Order 1
          has two items; order 2 reorders the same product from the same store:
        </p>
        <table className="example-table">
          <caption>Not normalized</caption>
          <thead>
            <tr>
              <th>order_id</th>
              <th>store_id</th>
              <th>region</th>
              <th>products</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>7</td>
              <td>East</td>
              <td>Mug x2, Tumbler x1</td>
            </tr>
            <tr>
              <td>2</td>
              <td>7</td>
              <td>East</td>
              <td>Mug x1</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <strong>The problem:</strong> <code>products</code> holds a list, not
          a value — you can&apos;t <code>SUM</code> the quantity of Mugs sold,
          and a third item on one order has nowhere to go.
        </p>

        <hr className="step-divider" />

        <p>
          <strong>1NF</strong> — one row per item instead. The key is now the
          pair <code>(order_id, product_id)</code>:
        </p>
        <table className="example-table">
          <caption>1NF — order_items</caption>
          <thead>
            <tr>
              <th>order_id</th>
              <th>product_id</th>
              <th>product_name</th>
              <th>quantity</th>
              <th>store_id</th>
              <th>region</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>Mug</td>
              <td>2</td>
              <td>7</td>
              <td>East</td>
            </tr>
            <tr>
              <td>1</td>
              <td>3</td>
              <td>Tumbler</td>
              <td>1</td>
              <td>7</td>
              <td>East</td>
            </tr>
            <tr>
              <td>2</td>
              <td>2</td>
              <td>Mug</td>
              <td>1</td>
              <td>7</td>
              <td>East</td>
            </tr>
          </tbody>
        </table>
        <div className="callout">
          <p>
            <strong>Why it&apos;s 1NF:</strong> every cell now holds exactly one
            value, and each row is uniquely identified by{" "}
            <code>(order_id, product_id)</code>.
          </p>
          <p>
            <strong>The new problem:</strong> <code>product_name</code> repeats
            &quot;Mug&quot; on rows 1 and 3, because it depends on{" "}
            <code>product_id</code> alone, not on the whole key. That&apos;s a{" "}
            <strong>partial dependency</strong>, and it violates 2NF.
          </p>
        </div>

        <hr className="step-divider" />

        <p>
          <strong>2NF</strong> — move the product&apos;s own attributes to their
          own table, keyed by <code>product_id</code>:
        </p>
        <div className="example-tables">
          <table className="example-table">
            <caption>2NF — products</caption>
            <thead>
              <tr>
                <th>product_id</th>
                <th>name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>Mug</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Tumbler</td>
              </tr>
            </tbody>
          </table>
          <table className="example-table">
            <caption>2NF — order_items</caption>
            <thead>
              <tr>
                <th>order_id</th>
                <th>product_id</th>
                <th>quantity</th>
                <th>store_id</th>
                <th>region</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>2</td>
                <td>7</td>
                <td>East</td>
              </tr>
              <tr>
                <td>1</td>
                <td>3</td>
                <td>1</td>
                <td>7</td>
                <td>East</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2</td>
                <td>1</td>
                <td>7</td>
                <td>East</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="callout">
          <p>
            <strong>Why it&apos;s 2NF:</strong> <code>product_name</code> is
            gone from <code>order_items</code>, so no column depends on only
            part of the key anymore.
          </p>
          <p>
            <strong>The new problem:</strong> <code>region</code> still repeats
            on every row, because it depends on <code>store_id</code> — another
            non-key column — not on the key itself. Key → <code>store_id</code>{" "}
            → <code>region</code> is a <strong>transitive dependency</strong>,
            and it violates 3NF.
          </p>
        </div>

        <hr className="step-divider" />

        <p>
          <strong>3NF</strong> — move the store&apos;s own attributes to their
          own table, keyed by <code>store_id</code>:
        </p>
        <div className="example-tables">
          <table className="example-table">
            <caption>3NF — stores</caption>
            <thead>
              <tr>
                <th>store_id</th>
                <th>region</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>7</td>
                <td>East</td>
              </tr>
            </tbody>
          </table>
          <table className="example-table">
            <caption>3NF — order_items</caption>
            <thead>
              <tr>
                <th>order_id</th>
                <th>product_id</th>
                <th>quantity</th>
                <th>store_id</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>2</td>
                <td>7</td>
              </tr>
              <tr>
                <td>1</td>
                <td>3</td>
                <td>1</td>
                <td>7</td>
              </tr>
              <tr>
                <td>2</td>
                <td>2</td>
                <td>1</td>
                <td>7</td>
              </tr>
            </tbody>
          </table>
          <table className="example-table">
            <caption>3NF — products (unchanged)</caption>
            <thead>
              <tr>
                <th>product_id</th>
                <th>name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>Mug</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Tumbler</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="callout">
          <strong>Why it&apos;s 3NF:</strong> every column now depends on the
          key, the whole key, and nothing but the key — three tables, each with
          one job. This is exactly the <code>orders</code> /{" "}
          <code>order_items</code> / <code>products</code> / <code>stores</code>{" "}
          shape at the top of this page.
        </p>

        <hr className="step-divider" />

        <h3>2.13 ACID and transactions</h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <strong>Atomicity</strong> — either all of a transaction's writes succeed,
              or none does.
            </li>
            <li>
              <strong>Consistency</strong> — the database enforces its own
              invariants (a <code>CHECK</code>, a foreign key, a{" "}
              <code>UNIQUE</code>) on every write, no matter what wrote it. An
              app-level <code>if</code> can be skipped, forgotten, or buggy; a
              constraint can&apos;t.
            </li>
            <li>
              <strong>Isolation</strong> — concurrent transactions can't see
              each other's uncommitted changes, so two orders can't both read
              the same stale stock count.
            </li>
            <li>
              <strong>Durability</strong> — once <code>COMMIT</code> returns
              successfully, that write survives a crash the instant after,
              guaranteed by the database engine itself.
            </li>
          </ul>
        </div>
        <p>
          Placing an order has to touch four tables at once — it's the clearest
          real example of why that needs to be one transaction, not four
          independent statements:
        </p>
        <CodeBlock
          language="sql"
          code={`BEGIN;

-- lock the inventory row so a concurrent order can't reserve the same stock
-- before this transaction commits
SELECT product_id, quantity_on_hand, quantity_reserved
FROM inventory
WHERE store_id = 1 AND product_id = 2
FOR UPDATE;

INSERT INTO orders (customer_id, store_id, status)
VALUES (1, 1, 'routed')
RETURNING id;

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
VALUES (1, 2, 3, 899);

UPDATE inventory
SET quantity_reserved = quantity_reserved + 3
WHERE store_id = 1 AND product_id = 2;

INSERT INTO order_status_history (order_id, from_status, to_status, note)
VALUES (1, NULL, 'routed', 'Order placed and auto-routed at creation');

COMMIT;`}
        />
        <p>
          Four letters, four separate guarantees — each one shown on its own,
          with the smallest example that actually demonstrates it:
        </p>

        <hr className="step-divider" />

        <p>
          <strong>Atomicity</strong> — an order needs at least one item; if
          either write fails, neither should exist.
        </p>
        <CodeBlock
          language="sql"
          bad={[9]}
          code={`-- Suppose the item insert has a mistake: quantity must be greater than 0.
BEGIN;

INSERT INTO orders (customer_id, store_id, status)
VALUES (1, 1, 'placed');

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
VALUES (1, 2, -1, 899);  -- quantity must be > 0 — this fails

ROLLBACK;`}
        />
        <CodeBlock
          language="plaintext"
          code={`ERROR:  new row for relation "order_items" violates check constraint
        "order_items_quantity_check"
-- the transaction is now aborted; ROLLBACK above ends it cleanly

SELECT * FROM orders WHERE status = 'placed';
-- (0 rows) — the order insert succeeded a moment ago, but rolling back
-- the transaction undid it too`}
        />
        <p>Same two statements, this time both valid:</p>
        <CodeBlock
          language="sql"
          code={`BEGIN;

INSERT INTO orders (customer_id, store_id, status)
VALUES (1, 1, 'placed');

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
VALUES (1, 2, 3, 899);

COMMIT;
-- both rows exist now, together`}
        />
        <p className="callout">
          Same two statements, two outcomes. There is no state where the order
          exists without its item, or the item without its order — that&apos;s
          Atomicity: all of a transaction&apos;s writes land, or none do.
        </p>

        <hr className="step-divider" />

        <p>
          <strong>Consistency</strong> — the constraint that makes stock
          consistent, declared once, right on the table:
        </p>
        <CodeBlock
          language="sql"
          code={`CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id),      -- foreign key: must be a real store
  product_id INTEGER NOT NULL REFERENCES products(id),  -- foreign key: must be a real product
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  UNIQUE (store_id, product_id),                         -- one row per store + product
  CHECK (quantity_reserved <= quantity_on_hand)           -- can never reserve more than exists
);`}
        />
        <p>
          Now the payoff — try to break that last rule directly, bypassing any
          app-level check entirely:
        </p>
        <CodeBlock
          language="sql"
          bad={[4]}
          code={`-- A buggy app that forgot to check availability, or a script run directly
-- against the database, bypassing the app entirely:
BEGIN;
UPDATE inventory SET quantity_reserved = quantity_reserved + 999
WHERE store_id = 1 AND product_id = 2;
COMMIT;`}
        />
        <CodeBlock
          language="plaintext"
          code={`ERROR:  new row for relation "inventory" violates check constraint
        "inventory_quantity_reserved_check"
DETAIL: Failing row contains (id=4, store_id=1, product_id=2,
        quantity_on_hand=5, quantity_reserved=999).

-- rejected before it's written — the CHECK constraint declared above catches
-- it even though nothing in the application layer validated this UPDATE`}
        />
        <p className="callout">
          This is the actual point of Consistency: it holds{" "}
          <strong>independent of the application</strong>. No app code had to
          catch anything — the database refused the write on its own.
        </p>

        <hr className="step-divider" />

        <p>
          <strong>Isolation</strong> — two customers order the same product at
          the same time, with no locking at all:
        </p>
        <CodeBlock
          language="plaintext"
          code={`5 in stock. Two customers each try to order 3, at the same time.

Session A (order 3)                    Session B (order 3)
────────────────────────────────────────────────────────────────
Read stock → 5
Check: enough for 3? Yes
                                        Read stock → 5  (A hasn't saved yet)
                                        Check: enough for 3? Yes
Save stock as 5 − 3 = 2
                                        Save stock as 5 − 3 = 2

Both orders are confirmed. Final stock in the database: 2. But 6 units were
just promised across the two orders, and only 5 ever existed — B read the
same "5" that A did, a moment before A's change was saved.`}
        />
        <p className="callout">
          Notice what <em>wouldn&apos;t</em> catch this: even a{" "}
          <code>CHECK (quantity_on_hand &gt;= 0)</code> constraint. 2 is a
          perfectly valid, non-negative number — it&apos;s the{" "}
          <em>sequence</em> of two reads-then-writes that&apos;s wrong, not
          any single write. That&apos;s specifically what Isolation is for.
        </p>
        <p>
          The fix: a row lock makes the second session wait until the first
          one finishes, so it reads the real, up-to-date number instead:
        </p>
        <CodeBlock
          language="sql"
          code={`-- Session A
BEGIN;
SELECT quantity_on_hand
FROM inventory
WHERE store_id = 1 AND product_id = 2
FOR UPDATE;                    -- takes a row lock, held until COMMIT/ROLLBACK
-- → 5 in stock`}
        />
        <CodeBlock
          language="sql"
          code={`-- Session B, a moment later, same row
BEGIN;
SELECT quantity_on_hand
FROM inventory
WHERE store_id = 1 AND product_id = 2
FOR UPDATE;                    -- blocks here until Session A ends its transaction`}
        />
        <CodeBlock
          language="plaintext"
          code={`Session A (order 3)                    Session B (order 3)
────────────────────────────────────────────────────────────────
Lock the row, read stock → 5
                                        Try to lock the row → blocked,
                                        waiting on A
Save stock as 5 − 3 = 2
Done — lock released
                                        Unblocked — read stock → 2, the real,
                                        up-to-date number
                                        Check: enough for 3? No — reject the
                                        order

Only one order goes through. B saw the real number instead of a stale one,
because it had to wait for A to finish first. That's what Isolation buys you.`}
        />
        <p className="callout">
          <code>FOR UPDATE</code> is one tool, not the property itself —
          Postgres&apos;s default isolation level (Read Committed) does not
          block this automatically; the lock is something you add on purpose.
          The full table of what each isolation level prevents is in{" "}
          <Link to="/week3/additional-backend-topics/full-sql/foundation">
            Full SQL · Foundation
          </Link>
          .
        </p>

        <hr className="step-divider" />

        <p>
          <strong>Durability</strong> — the one guarantee you can&apos;t see in
          the SQL at all. Postgres writes every commit to disk before it
          reports success, so a crash right after can&apos;t undo it:
        </p>
        <CodeBlock
          language="sql"
          code={`UPDATE inventory SET quantity_reserved = quantity_reserved + 3
WHERE store_id = 1 AND product_id = 2;
COMMIT;

-- Once COMMIT returns "success", that write is on disk. Even if the network
-- drops, the server crashes, or the power goes out one second later, this
-- update is still there when the database comes back up.`}
        />
        <p className="callout">
          Unlike the other three, this isn&apos;t something your transaction
          does right — it&apos;s a guarantee the database provides
          automatically, every time, once <code>COMMIT</code> succeeds.
        </p>

        <h3>2.14 Stored procedures</h3>
        <p>
          A stored procedure is a named block of SQL logic saved inside the
          database itself, callable by name instead of re-sent from the app
          every time. It's reached for when logic has to stay consistent no
          matter which application calls it, or for scheduled/triggered work the
          database runs on its own.
        </p>
        <CodeBlock
          language="sql"
          code={`CREATE OR REPLACE PROCEDURE mark_order_shipped(order_id_in INTEGER)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE orders SET status = 'shipped' WHERE id = order_id_in;
  INSERT INTO order_status_history (order_id, from_status, to_status, note)
  VALUES (order_id_in, 'packed', 'shipped', 'Marked shipped via stored procedure');
END;
$$;

CALL mark_order_shipped(1);`}
        />
        <p className="callout">
          This course puts most business logic in the app's service layer
          instead (Day 13) — stored procedures are still worth recognizing,
          since plenty of real systems do lean on them.
        </p>

        <h3>2.15 Going deeper</h3>
        <p>
          Today skipped a lot on purpose. When you need it:{" "}
          <Link to="/week3/additional-backend-topics/full-sql/foundation">
            Full SQL · Foundation
          </Link>{" "}
          covers upserts, <code>CROSS</code>/self joins, subqueries, CTEs,
          window functions, isolation levels, deadlocks and views;{" "}
          <Link to="/week3/additional-backend-topics/full-sql/schema-design">
            Schema Design &amp; Evolution
          </Link>{" "}
          covers the normal forms with worked examples, deliberate
          denormalization, and migrations.
        </p>
      </section>
    </div>
  );
}
