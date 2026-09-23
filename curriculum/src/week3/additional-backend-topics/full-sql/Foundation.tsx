import { Link } from "react-router-dom";
import TopicNav from "../../../components/TopicNav";
import CodeBlock from "../../../components/CodeBlock";

export default function Foundation() {
  return (
    <div className="page notes-page">
      <title>Full SQL — Foundation</title>
      <TopicNav day="additional-backend-topics" topic="full-sql" current="foundation" />

      <header className="lecture-header">
        <p className="eyebrow">Full SQL · Foundation</p>
        <h1>Foundation</h1>
        <p className="subtitle">
          Everything day 12 only had time to skim: types, DDL, the real shape of a query, CRUD,
          filtering, sorting, aggregates, relationships, every join, constraints, transactions.
        </p>
      </header>

      <p className="callout">
        Day 12 teaches the 20% of this page you need to build this project. This page is the reference you
        come back to for the other 80% — read it in pieces, not in one sitting.
      </p>

      <hr className="section-divider" />

      <h2>1. What a relational database actually is</h2>
      <p>Four words get used loosely and mean four different things:</p>
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
            <td>The top-level container. One connection targets exactly one database.</td>
            <td><code>oms</code></td>
          </tr>
          <tr>
            <td>Schema</td>
            <td>A namespace for tables inside a database. Postgres defaults to <code>public</code>.</td>
            <td><code>public</code>, or <code>fulfillment</code> once the app grows</td>
          </tr>
          <tr>
            <td>Table</td>
            <td>One entity type. Columns define its shape, rows are the instances.</td>
            <td><code>orders</code>, <code>products</code></td>
          </tr>
          <tr>
            <td>Row / column</td>
            <td>One record / one typed field of every record.</td>
            <td>Order #4012 / <code>orders.status</code></td>
          </tr>
        </tbody>
      </table>

      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            The database is a <strong>separate server process</strong>. Your Node app talks to it over
            TCP, which is why every query costs a network round trip — the single biggest reason
            "one query in a loop" is so slow.
          </li>
          <li>
            SQL is <strong>declarative</strong>: you describe the result you want, and the query
            planner decides how to get it. You never write the loop.
          </li>
          <li>
            That's also why the same query can be fast today and slow next month — the planner's
            decision depends on table statistics, which change as data grows.
          </li>
          <li>
            Every example on this page is PostgreSQL. MySQL, SQL Server and Oracle share ~90% of the
            syntax and disagree on the rest (<code>SERIAL</code> vs. <code>AUTO_INCREMENT</code>,{" "}
            <code>ILIKE</code>, <code>RETURNING</code>).
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>2. Data types</h2>
      <p>Pick the narrowest type that can hold every value the column will ever need.</p>

      <h3>Numeric</h3>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Range / precision</th>
            <th>Use for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>SMALLINT</code></td>
            <td>±32,767</td>
            <td>Small enums-as-numbers, quantities</td>
          </tr>
          <tr>
            <td><code>INTEGER</code></td>
            <td>±2.1 billion</td>
            <td>The default id and counter type</td>
          </tr>
          <tr>
            <td><code>BIGINT</code></td>
            <td>±9.2 quintillion</td>
            <td>Ids on tables that will exceed 2.1B rows, epoch millis</td>
          </tr>
          <tr>
            <td><code>DECIMAL(p,s)</code> / <code>NUMERIC</code></td>
            <td>Exact, arbitrary precision</td>
            <td>Money, tax rates — anything where rounding is a bug</td>
          </tr>
          <tr>
            <td><code>REAL</code> / <code>DOUBLE PRECISION</code></td>
            <td>Approximate, binary floating point</td>
            <td>Measurements, scientific values — never money</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="sql"
        bad={[2]}
        good={[3, 4]}
        code={`-- why floats are banned for money
SELECT 0.1::REAL + 0.2::REAL = 0.3::REAL;        -- false: binary float can't represent 0.1
SELECT 0.1::NUMERIC + 0.2::NUMERIC = 0.3::NUMERIC; -- true: exact decimal arithmetic
SELECT 1299 + 250;                                 -- or store integer cents and never divide until display`}
      />
      <p className="callout">
        This course stores money as <code>INTEGER</code> cents (<code>price_cents</code>).{" "}
        <code>NUMERIC(12,2)</code> is equally correct; a float is not.
      </p>

      <h3>String</h3>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Behaviour</th>
            <th>Use for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>VARCHAR(n)</code></td>
            <td>Variable length, rejects anything longer than <code>n</code></td>
            <td>Names, emails, SKUs — where a length limit is a real rule</td>
          </tr>
          <tr>
            <td><code>TEXT</code></td>
            <td>Variable length, unlimited</td>
            <td>Notes, descriptions, anything free-form</td>
          </tr>
          <tr>
            <td><code>CHAR(n)</code></td>
            <td>Fixed length, <em>space-padded</em> to <code>n</code></td>
            <td>Almost never — the padding surprises everyone</td>
          </tr>
        </tbody>
      </table>
      <p>
        In Postgres, <code>VARCHAR(n)</code> and <code>TEXT</code> are the same storage and the same
        speed. The length is a constraint, not an optimization — choose it when the limit is a
        business rule, not to "save space".
      </p>

      <h3>Date &amp; time</h3>
      <CodeBlock
        language="plaintext"
        bad={[3]}
        good={[4]}
        code={`DATE          -- 2026-03-14, no time component
TIME          -- 14:05:00, no date
TIMESTAMP     -- 2026-03-14 14:05:00, no timezone — ambiguous the moment two regions use it
TIMESTAMPTZ   -- stored as UTC, converted on the way out — the one you almost always want
INTERVAL      -- a duration: '30 days', '2 hours'`}
      />
      <CodeBlock
        language="sql"
        code={`SELECT now();                                  -- current timestamptz
SELECT now() - INTERVAL '7 days';              -- a week ago
SELECT created_at::DATE FROM orders;           -- truncate to the day
SELECT date_trunc('month', created_at) AS month FROM orders;  -- bucket for reporting
SELECT age(now(), created_at) FROM orders;     -- an INTERVAL, human-readable`}
      />
      <p className="callout">
        A fulfillment platform serving more than one region should use <code>TIMESTAMPTZ</code>{" "}
        everywhere. Plain <code>TIMESTAMP</code> means "some wall clock, somewhere" and produces
        off-by-hours bugs at daylight savings.
      </p>

      <h3>Boolean, JSON, UUID, arrays, enums</h3>
      <CodeBlock
        language="plaintext"
        code={`BOOLEAN       -- TRUE / FALSE / NULL — three states, not two
JSON          -- stores the raw text, reparsed on every read
JSONB         -- parsed binary form: faster to query, indexable with GIN, key order not preserved
UUID          -- 128-bit id, e.g. 550e8400-e29b-41d4-a716-446655440000
TEXT[]        -- a real array column: ARRAY['fragile', 'gift-wrap']`}
      />
      <CodeBlock
        language="sql"
        code={`CREATE TYPE order_status AS ENUM ('placed', 'routed', 'packed', 'shipped', 'delivered');

CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  is_express BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  tracking_id UUID NOT NULL DEFAULT gen_random_uuid()
);`}
      />
      <CodeBlock
        language="sql"
        code={`-- JSONB: the escape hatch for genuinely variable data, e.g. per-carrier shipping metadata
ALTER TABLE orders ADD COLUMN carrier_meta JSONB;

UPDATE orders SET carrier_meta = '{"carrier": "UPS", "service": "2day", "signature": true}'
WHERE id = 1;

SELECT id, carrier_meta->>'carrier' AS carrier      -- ->> returns text
FROM orders
WHERE carrier_meta @> '{"signature": true}';        -- @> is "contains", GIN-indexable`}
      />
      <div className="concept">
        <p className="concept-label">Concept — auto-increment vs. UUID for primary keys</p>
        <ul>
          <li>
            <code>SERIAL</code>/<code>IDENTITY</code> gives small, sequential, human-readable ids
            that index tightly and sort by insertion order.
          </li>
          <li>
            But sequential ids leak business information (order #1043 tells a competitor your
            volume) and can't be generated by the client before insert.
          </li>
          <li>
            <code>UUID</code> can be generated anywhere — client, another service, offline — which
            makes merging data from multiple sources or shards trivial.
          </li>
          <li>
            The cost: 16 bytes instead of 4, and random v4 UUIDs scatter index writes across the
            whole B-tree. <code>UUIDv7</code> (time-ordered) fixes the scatter and is the modern
            default when you want UUIDs.
          </li>
          <li>
            Rule of thumb: <code>SERIAL</code> until you have a distributed-generation or
            id-leaking reason not to.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>3. Creating tables, and the six constraints</h2>
      <p>
        A constraint is a rule the database itself enforces. Application validation can be bypassed
        — by another service, a migration script, someone in <code>psql</code> — a constraint cannot.
      </p>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,                                  -- PRIMARY KEY: unique + not null + the row's identity
  order_id INTEGER NOT NULL REFERENCES orders(id)
    ON DELETE CASCADE,                                    -- FOREIGN KEY: must point at a real orders row
  product_id INTEGER NOT NULL REFERENCES products(id)
    ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),         -- CHECK: an arbitrary boolean rule
  unit_price_cents INTEGER NOT NULL,                      -- NOT NULL: a value is required
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),          -- DEFAULT: filled in when omitted
  UNIQUE (order_id, product_id)                           -- UNIQUE: no duplicate line for the same product
);`}
      />
      <table className="ref-table">
        <thead>
          <tr>
            <th>Constraint</th>
            <th>Guarantees</th>
            <th>Violation gives you</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>PRIMARY KEY</code></td>
            <td>One column (or set) identifies the row uniquely; implies NOT NULL + UNIQUE</td>
            <td>Duplicate key error</td>
          </tr>
          <tr>
            <td><code>FOREIGN KEY</code></td>
            <td>The referenced row exists — no orphan order items</td>
            <td>Insert/delete rejected</td>
          </tr>
          <tr>
            <td><code>NOT NULL</code></td>
            <td>The column always has a value</td>
            <td>Null value violates not-null constraint</td>
          </tr>
          <tr>
            <td><code>UNIQUE</code></td>
            <td>No two rows share the value (multiple NULLs still allowed)</td>
            <td>Duplicate key error</td>
          </tr>
          <tr>
            <td><code>CHECK</code></td>
            <td>A per-row boolean holds, e.g. <code>quantity &gt; 0</code></td>
            <td>Check constraint violated</td>
          </tr>
          <tr>
            <td><code>DEFAULT</code></td>
            <td>Not a constraint — a value used when the column is omitted</td>
            <td>Nothing; it just fills in</td>
          </tr>
        </tbody>
      </table>

      <h3>What <code>ON DELETE</code> actually chooses</h3>
      <CodeBlock
        language="plaintext"
        code={`ON DELETE CASCADE     -- deleting the order deletes its items too
ON DELETE RESTRICT    -- refuse to delete a product that any order item still references
ON DELETE SET NULL    -- keep the row, blank the reference (column must be nullable)
ON DELETE NO ACTION   -- the default: same as RESTRICT, but checked at the end of the transaction`}
      />
      <p className="callout">
        <code>CASCADE</code> on <code>order_items</code> is right — a line item is meaningless
        without its order. <code>RESTRICT</code> on <code>products</code> is right too: deleting a
        product that appears in past orders would destroy financial history.
      </p>

      <h3>Changing a table later</h3>
      <CodeBlock
        language="sql"
        code={`ALTER TABLE orders ADD COLUMN cancelled_at TIMESTAMPTZ;
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'placed';
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('placed','routed','packed','shipped','delivered','cancelled'));
ALTER TABLE orders DROP COLUMN legacy_ref;
DROP TABLE IF EXISTS scratch_import;`}
      />
      <p>
        In production these run as <Link to="/week3/additional-backend-topics/full-sql/schema-design">migrations</Link>,
        and some of them take locks that stop the whole table. That page covers which ones.
      </p>

      <hr className="section-divider" />

      <h2>4. The shape of a query</h2>
      <p>The clauses have a fixed written order — and a completely different execution order.</p>
      <CodeBlock
        language="sql"
        code={`SELECT   store_id, COUNT(*) AS order_count      -- 5. which columns come out
FROM     orders                                 -- 1. which table
JOIN     stores ON stores.id = orders.store_id  -- 2. what to combine it with
WHERE    orders.created_at > now() - INTERVAL '30 days'  -- 3. which rows survive
GROUP BY store_id                               -- 4. how rows collapse into groups
HAVING   COUNT(*) > 10                          -- 4b. which groups survive
ORDER BY order_count DESC                       -- 6. how the output is sorted
LIMIT    5;                                     -- 7. how many rows come back`}
      />
      <div className="concept">
        <p className="concept-label">Concept — why execution order matters</p>
        <ul>
          <li>
            <code>WHERE</code> runs <em>before</em> grouping, so it filters rows.{" "}
            <code>HAVING</code> runs <em>after</em>, so it filters groups. That is the whole
            difference between them.
          </li>
          <li>
            <code>SELECT</code> runs after <code>GROUP BY</code>, which is why you can't use a column
            in <code>SELECT</code> unless it's grouped or aggregated.
          </li>
          <li>
            <code>SELECT</code> runs <em>before</em> <code>ORDER BY</code>, which is why{" "}
            <code>ORDER BY order_count</code> can use the alias but <code>WHERE order_count &gt; 10</code>{" "}
            cannot — the alias doesn't exist yet when <code>WHERE</code> runs.
          </li>
          <li>
            <code>LIMIT</code> runs last, so it never makes the underlying work smaller by itself —
            a <code>LIMIT 10</code> over an unindexed sort still sorts the whole table.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>5. CRUD, properly</h2>

      <h3>INSERT</h3>
      <CodeBlock
        language="sql"
        code={`-- one row
INSERT INTO products (sku, name, price_cents) VALUES ('MUG-001', 'Ceramic Mug', 1299);

-- many rows in ONE statement — one round trip instead of N
INSERT INTO products (sku, name, price_cents) VALUES
  ('MUG-002', 'Travel Mug', 1899),
  ('MUG-003', 'Espresso Cup', 899),
  ('MUG-004', 'Tumbler', 2299);

-- get the generated id back without a second query
INSERT INTO orders (customer_id, store_id, status)
VALUES (1, 3, 'placed')
RETURNING id, created_at;

-- upsert: insert, or update if the unique key already exists
INSERT INTO inventory (store_id, product_id, quantity_on_hand)
VALUES (3, 7, 50)
ON CONFLICT (store_id, product_id)
DO UPDATE SET quantity_on_hand = inventory.quantity_on_hand + EXCLUDED.quantity_on_hand;`}
      />
      <p className="callout">
        <code>EXCLUDED</code> is the row you tried to insert; the bare table name is the row already
        there. That's how an upsert can add to the existing value instead of replacing it.
      </p>

      <h3>SELECT</h3>
      <CodeBlock
        language="sql"
        bad={[2]}
        good={[3]}
        code={`-- name the columns you need
SELECT * FROM orders;                            -- breaks silently when a column is added or reordered
SELECT id, customer_id, status FROM orders;      -- explicit, and moves less data over the wire

SELECT DISTINCT status FROM orders;              -- unique values only
SELECT o.id AS order_id, c.name AS customer FROM orders o JOIN customers c ON c.id = o.customer_id;`}
      />

      <h3>UPDATE and DELETE</h3>
      <CodeBlock
        language="sql"
        bad={[2]}
        good={[3]}
        code={`-- the single most expensive typo in SQL
UPDATE orders SET status = 'shipped';                   -- no WHERE: every order in the table
UPDATE orders SET status = 'shipped' WHERE id = 4012;   -- one row

UPDATE orders SET status = 'shipped', shipped_at = now()
WHERE id = 4012
RETURNING id, status;                                    -- confirm what actually changed

DELETE FROM order_items WHERE order_id = 4012;
DELETE FROM orders WHERE created_at < now() - INTERVAL '7 years';`}
      />
      <p className="callout">
        Habit that saves you once a year: write it as a <code>SELECT</code> with the same{" "}
        <code>WHERE</code> first, look at the row count, then swap in <code>UPDATE</code>/
        <code>DELETE</code>. Inside a transaction you can also <code>ROLLBACK</code>.
      </p>
      <p>
        <code>DELETE</code> removes rows one at a time and can be rolled back;{" "}
        <code>TRUNCATE orders</code> empties the whole table instantly but can't be filtered.
        Many systems never hard-delete at all — they set a <code>deleted_at</code> timestamp
        (a soft delete) and filter it out in every query.
      </p>

      <hr className="section-divider" />

      <h2>6. Filtering</h2>
      <CodeBlock
        language="sql"
        code={`SELECT * FROM products WHERE price_cents > 1000;                 -- = <> < > <= >=
SELECT * FROM orders   WHERE status IN ('placed', 'routed');     -- one of a set
SELECT * FROM orders   WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31';  -- inclusive both ends
SELECT * FROM products WHERE name LIKE 'Cera%';                  -- % = any run of chars, _ = exactly one
SELECT * FROM products WHERE name ILIKE '%mug%';                 -- case-insensitive (Postgres)
SELECT * FROM orders   WHERE store_id IS NULL;                   -- unassigned orders
SELECT * FROM orders   WHERE status <> 'cancelled' AND (store_id = 3 OR store_id = 7);`}
      />
      <div className="concept">
        <p className="concept-label">Concept — NULL is not a value, and it poisons comparisons</p>
        <ul>
          <li>
            <code>NULL</code> means "unknown". Any comparison with it returns <code>NULL</code>, not
            true or false — so <code>WHERE store_id = NULL</code> matches nothing, ever.
          </li>
          <li>
            Use <code>IS NULL</code> / <code>IS NOT NULL</code>. They are the only operators that
            test for it.
          </li>
          <li>
            <code>WHERE status &lt;&gt; 'cancelled'</code> silently drops rows where{" "}
            <code>status</code> is NULL — "unknown is not cancelled" evaluates to unknown, and
            unknown rows don't survive a <code>WHERE</code>.
          </li>
          <li>
            <code>COALESCE(store_id, 0)</code> substitutes a fallback;{" "}
            <code>NULLIF(a, b)</code> does the reverse, turning a specific value into NULL.
          </li>
          <li>
            <code>AND</code> binds tighter than <code>OR</code>. Parenthesize whenever you mix them
            — this is a real, regular production bug.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>7. Sorting and limiting</h2>
      <CodeBlock
        language="sql"
        code={`SELECT id, status, created_at
FROM orders
ORDER BY created_at DESC, id DESC      -- second key breaks ties deterministically
LIMIT 20 OFFSET 40;                    -- rows 41-60

SELECT * FROM orders ORDER BY shipped_at DESC NULLS LAST;   -- unshipped orders at the bottom`}
      />
      <p className="callout">
        Without <code>ORDER BY</code>, row order is undefined — the database may return rows in any
        order, and it changes once the plan changes. Paginating an unordered query silently skips
        and repeats rows.
      </p>
      <p>
        <code>OFFSET</code> is fine for page 2 and terrible for page 2,000 — the database still has
        to produce and discard every skipped row. See{" "}
        <Link to="/week3/additional-backend-topics/full-sql/scaling-and-throughput">
          keyset pagination
        </Link>.
      </p>

      <hr className="section-divider" />

      <h2>8. Aggregates and GROUP BY</h2>
      <CodeBlock
        language="sql"
        code={`SELECT
  COUNT(*)                AS order_count,       -- counts rows, including ones with NULLs
  COUNT(store_id)         AS assigned_count,    -- counts NON-NULL store_id only
  COUNT(DISTINCT customer_id) AS customers,
  SUM(total_cents)        AS revenue_cents,
  AVG(total_cents)        AS avg_order_cents,   -- ignores NULLs entirely
  MIN(created_at)         AS first_order,
  MAX(created_at)         AS latest_order
FROM orders;`}
      />
      <CodeBlock
        language="sql"
        code={`-- revenue per store, busiest first, stores with fewer than 10 orders excluded
SELECT s.name, COUNT(*) AS order_count, SUM(oi.quantity * oi.unit_price_cents) AS revenue_cents
FROM orders o
JOIN stores s ON s.id = o.store_id
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'        -- filters ROWS, before grouping
GROUP BY s.id, s.name                -- group by the key, select what depends on it
HAVING COUNT(*) >= 10                -- filters GROUPS, after aggregating
ORDER BY revenue_cents DESC;`}
      />
      <div className="concept">
        <p className="concept-label">Concept — the rules that trip people up</p>
        <ul>
          <li>
            Every column in <code>SELECT</code> must either be in <code>GROUP BY</code> or wrapped in
            an aggregate. Postgres rejects anything else; MySQL historically returned an arbitrary
            row's value, which is worse.
          </li>
          <li>
            <code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> counts non-NULL values of that
            column. On a left join those two differ, and the difference is usually the bug.
          </li>
          <li>
            <code>AVG</code>/<code>SUM</code> skip NULLs rather than treating them as 0 — so an
            average over half-NULL data is an average of the half that exists.
          </li>
          <li>
            Aggregating a join multiplies rows: joining <code>orders</code> to{" "}
            <code>order_items</code> and then <code>SUM(o.total_cents)</code> counts each order's
            total once per item. Aggregate in a subquery, or sum the item-level numbers instead.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>9. Relationships</h2>

      <h3>One-to-one</h3>
      <p>
        A separate table for data that belongs to exactly one row of another — used to isolate rarely
        read columns, or data with different access rules.
      </p>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE customer_billing (
  customer_id INTEGER PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
  tax_id VARCHAR(40),
  billing_address TEXT
);
-- PRIMARY KEY on the foreign key is what makes it 1-1 rather than 1-many`}
      />

      <h3>One-to-many</h3>
      <p>
        The common case: the foreign key lives on the <em>many</em> side. One customer has many
        orders, so <code>customer_id</code> is a column on <code>orders</code>.
      </p>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),   -- the "many" side holds the key
  status VARCHAR(20) NOT NULL DEFAULT 'placed'
);`}
      />

      <h3>Many-to-many</h3>
      <p>
        Neither side can hold the key, so a third <strong>join table</strong> holds pairs. A product
        stocked in many stores, a store stocking many products — that's exactly what{" "}
        <code>inventory</code> is.
      </p>
      <CodeBlock
        language="sql"
        code={`CREATE TABLE inventory (
  store_id INTEGER NOT NULL REFERENCES stores(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (store_id, product_id)    -- composite key: one row per (store, product) pair
);`}
      />
      <p className="callout">
        A join table that carries extra columns (<code>quantity_on_hand</code>) is an entity in its
        own right, not just plumbing — which is why it's called <code>inventory</code> and not{" "}
        <code>store_products</code>.
      </p>

      <hr className="section-divider" />

      <h2>10. Joins — all of them</h2>
      <p>
        A join matches rows from two tables on a condition. Which rows survive when there is{" "}
        <em>no</em> match is the only real difference between the join types.
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Join</th>
            <th>Keeps</th>
            <th>Typical question</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>INNER JOIN</code></td>
            <td>Only rows with a match on both sides</td>
            <td>"Orders and the customer who placed them"</td>
          </tr>
          <tr>
            <td><code>LEFT JOIN</code></td>
            <td>All left rows; right columns NULL where no match</td>
            <td>"Every customer, with their order count — zero included"</td>
          </tr>
          <tr>
            <td><code>RIGHT JOIN</code></td>
            <td>All right rows; mirror of LEFT</td>
            <td>Rare — swap the tables and use LEFT instead</td>
          </tr>
          <tr>
            <td><code>FULL OUTER JOIN</code></td>
            <td>All rows from both sides, NULLs where unmatched</td>
            <td>"Reconcile two systems — what's in one and not the other"</td>
          </tr>
          <tr>
            <td><code>CROSS JOIN</code></td>
            <td>Every combination (N × M rows)</td>
            <td>"Every store × every product" — generating a grid</td>
          </tr>
          <tr>
            <td>Self join</td>
            <td>A table joined to itself under two aliases</td>
            <td>"Each order and the previous order from that customer"</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        language="sql"
        code={`-- INNER: only orders that have a store assigned
SELECT o.id, s.name AS store
FROM orders o
INNER JOIN stores s ON s.id = o.store_id;

-- LEFT: every order, store name NULL if it hasn't been routed yet
SELECT o.id, s.name AS store
FROM orders o
LEFT JOIN stores s ON s.id = o.store_id;

-- LEFT + IS NULL = "anti join": the rows with NO match
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;              -- customers who have never ordered

-- CROSS JOIN: every store/product pair, so missing inventory rows become visible
SELECT s.id AS store_id, p.id AS product_id
FROM stores s
CROSS JOIN products p;

-- self join: an order and that customer's previous order
SELECT curr.id, prev.id AS previous_order_id
FROM orders curr
JOIN orders prev ON prev.customer_id = curr.customer_id AND prev.created_at < curr.created_at;`}
      />

      <div className="concept">
        <p className="concept-label">Concept — <code>ON</code> vs. <code>WHERE</code> on an outer join</p>
        <ul>
          <li>
            On an <code>INNER JOIN</code> they're interchangeable — the planner treats them the same.
          </li>
          <li>
            On a <code>LEFT JOIN</code> they are not. <code>ON</code> decides which right-hand rows
            are eligible to match; <code>WHERE</code> filters the result <em>after</em> the join has
            already produced NULL rows.
          </li>
          <li>
            So a condition on the right table in <code>WHERE</code> deletes the unmatched rows and
            silently turns your LEFT JOIN back into an INNER JOIN.
          </li>
        </ul>
      </div>
      <CodeBlock
        language="sql"
        bad={[4]}
        good={[9]}
        code={`-- WRONG: every customer with no 2026 order is dropped entirely
SELECT c.name, COUNT(o.id)
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.created_at >= '2026-01-01'
GROUP BY c.id, c.name;

-- RIGHT: the date test is part of what counts as a match, so zero-order customers survive
SELECT c.name, COUNT(o.id)
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.created_at >= '2026-01-01'
GROUP BY c.id, c.name;`}
      />

      <hr className="section-divider" />

      <h2>11. Subqueries, CTEs, and window functions</h2>

      <h3>Subqueries</h3>
      <CodeBlock
        language="sql"
        code={`-- scalar: returns one value
SELECT id, total_cents, (SELECT AVG(total_cents) FROM orders) AS avg_cents FROM orders;

-- IN: a list of values
SELECT * FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE region = 'EU');

-- EXISTS: stops at the first match, usually faster than IN on large sets
SELECT c.* FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'shipped');

-- derived table: a subquery used as a table
SELECT store_id, order_count
FROM (SELECT store_id, COUNT(*) AS order_count FROM orders GROUP BY store_id) AS per_store
WHERE order_count > 100;`}
      />
      <p className="callout">
        <code>NOT IN</code> with a subquery that can return NULL matches <em>nothing</em> — the
        three-valued logic from section 6 again. Use <code>NOT EXISTS</code> instead.
      </p>

      <h3>CTEs — the readable version of a nested subquery</h3>
      <CodeBlock
        language="sql"
        code={`WITH recent_orders AS (
  SELECT * FROM orders WHERE created_at > now() - INTERVAL '30 days'
),
per_store AS (
  SELECT store_id, COUNT(*) AS order_count FROM recent_orders GROUP BY store_id
)
SELECT s.name, p.order_count
FROM per_store p
JOIN stores s ON s.id = p.store_id
ORDER BY p.order_count DESC;`}
      />
      <p>
        Same result as nesting the subqueries, read top to bottom instead of inside out. A CTE can
        also be recursive — the standard way to walk a tree (a category hierarchy, an org chart).
      </p>

      <h3>Window functions — aggregate without collapsing rows</h3>
      <CodeBlock
        language="sql"
        code={`SELECT
  id,
  customer_id,
  total_cents,
  SUM(total_cents)  OVER (PARTITION BY customer_id)                      AS customer_lifetime_cents,
  ROW_NUMBER()      OVER (PARTITION BY customer_id ORDER BY created_at)  AS nth_order,
  LAG(created_at)   OVER (PARTITION BY customer_id ORDER BY created_at)  AS previous_order_at
FROM orders;`}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <code>GROUP BY</code> turns many rows into one. A window function keeps every row and
            adds a column computed over a "window" of related rows.
          </li>
          <li>
            <code>PARTITION BY</code> is the window's grouping; <code>ORDER BY</code> inside{" "}
            <code>OVER</code> is what makes running totals, rankings and <code>LAG</code>/
            <code>LEAD</code> meaningful.
          </li>
          <li>
            The classic use is "top N per group" — <code>ROW_NUMBER()</code> in a CTE, then filter{" "}
            <code>WHERE rn &lt;= 3</code> outside it. There is no clean way to write that with{" "}
            <code>GROUP BY</code>.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>12. Transactions and ACID</h2>
      <CodeBlock
        language="sql"
        code={`BEGIN;
  UPDATE inventory SET quantity_reserved = quantity_reserved + 3
  WHERE store_id = 1 AND product_id = 2;

  INSERT INTO orders (customer_id, store_id, status) VALUES (1, 1, 'routed');
COMMIT;      -- or ROLLBACK; and neither statement ever happened`}
      />
      <div className="concept">
        <p className="concept-label">Concept — ACID</p>
        <ul>
          <li><strong>Atomicity</strong> — all of the transaction's writes land, or none do.</li>
          <li>
            <strong>Consistency</strong> — every constraint still holds when it commits; a
            transaction moves the database from one valid state to another.
          </li>
          <li>
            <strong>Isolation</strong> — concurrent transactions can't see each other's uncommitted
            work. How strictly is the isolation level, below.
          </li>
          <li>
            <strong>Durability</strong> — once <code>COMMIT</code> returns, the data survives an
            immediate power loss (it's in the write-ahead log on disk).
          </li>
        </ul>
      </div>

      <h3>Isolation levels — what each one prevents</h3>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Dirty read</th>
            <th>Non-repeatable read</th>
            <th>Phantom read</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Read uncommitted</td>
            <td>Possible*</td>
            <td>Possible</td>
            <td>Possible</td>
          </tr>
          <tr>
            <td>Read committed <em>(Postgres default)</em></td>
            <td>No</td>
            <td>Possible</td>
            <td>Possible</td>
          </tr>
          <tr>
            <td>Repeatable read</td>
            <td>No</td>
            <td>No</td>
            <td>Possible*</td>
          </tr>
          <tr>
            <td>Serializable</td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
          </tr>
        </tbody>
      </table>
      <p>
        *Postgres never allows dirty reads, and its repeatable read also blocks phantoms — the table
        is the SQL standard's, which other engines follow more literally. Higher isolation costs
        throughput and produces serialization failures the app must retry.
      </p>

      <h3>Row locking — the practical tool</h3>
      <CodeBlock
        language="sql"
        code={`BEGIN;
  SELECT quantity_on_hand, quantity_reserved
  FROM inventory
  WHERE store_id = 1 AND product_id = 2
  FOR UPDATE;             -- locks this row until COMMIT; a concurrent order waits here

  -- app checks availability, then:
  UPDATE inventory SET quantity_reserved = quantity_reserved + 3
  WHERE store_id = 1 AND product_id = 2;
COMMIT;`}
      />
      <p className="callout">
        Without <code>FOR UPDATE</code>, two concurrent orders both read "5 in stock", both reserve
        3, and you've oversold. This is the lost-update race, and it is the reason inventory
        systems lock.
      </p>
      <p>
        Two transactions that lock the same two rows in opposite orders <strong>deadlock</strong>;
        Postgres detects it and kills one with a serialization error. The fix is always the same:
        acquire locks in a consistent order (e.g. always ascending by <code>product_id</code>), and
        keep transactions short.
      </p>
      <p>
        <code>FOR UPDATE SKIP LOCKED</code> is the same lock with a different rule for an
        already-locked row: instead of waiting, skip it and take the next one. That's the standard
        pattern for several workers pulling from one queue without colliding:
      </p>
      <CodeBlock
        language="sql"
        code={`-- 3 worker processes can run this exact query at the same time —
-- each one gets a DIFFERENT row, none of them wait on each other
SELECT id FROM order_status_history
WHERE processed = false
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;`}
      />
      <p className="callout">
        Without <code>SKIP LOCKED</code>, every worker queues up behind whichever one locked the
        row first — plain <code>FOR UPDATE</code> serializes a queue instead of parallelizing it.
      </p>

      <hr className="section-divider" />

      <h2>13. Views and stored procedures</h2>
      <CodeBlock
        language="sql"
        code={`-- a view is a saved query, re-run every time it's selected from
CREATE VIEW order_totals AS
SELECT o.id, o.customer_id, SUM(oi.quantity * oi.unit_price_cents) AS total_cents
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.customer_id;

SELECT * FROM order_totals WHERE total_cents > 10000;

-- a materialized view stores the result on disk; fast to read, stale until refreshed
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT date_trunc('day', created_at) AS day, SUM(total_cents) AS revenue_cents
FROM order_totals GROUP BY 1;

REFRESH MATERIALIZED VIEW daily_revenue;`}
      />
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

CALL mark_order_shipped(4012);`}
      />
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th>Argument for</th>
            <th>Argument against</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Stored procedure</td>
            <td>Logic enforced no matter which app calls it; no round trips mid-logic</td>
            <td>Lives outside your repo, hard to test, hard to version, hard to hire for</td>
          </tr>
          <tr>
            <td>Service layer (day 13)</td>
            <td>Versioned with the code, unit-testable, one language</td>
            <td>Every other client of the database can bypass it</td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        This course puts business logic in the service layer. Recognize stored procedures because
        plenty of enterprise systems are built on them — expect to read one, not to write many.
      </p>

      <hr className="section-divider" />

      <h2>14. Where to go next</h2>
      <ul>
        <li>
          <Link to="/week3/additional-backend-topics/full-sql/query-optimization">Query Optimization</Link>{" "}
          — why a correct query is still slow, and how to read the plan that proves it.
        </li>
        <li>
          <Link to="/week3/additional-backend-topics/full-sql/scaling-and-throughput">Scaling &amp; Throughput</Link>{" "}
          — batching, pagination, partitioning, sharding, replicas, pooling.
        </li>
        <li>
          <Link to="/week3/additional-backend-topics/full-sql/schema-design">Schema Design &amp; Evolution</Link>{" "}
          — normal forms, deliberate denormalization, migrations.
        </li>
        <li>
          <Link to="/week3/additional-backend-topics/full-sql/sql-vs-nosql">SQL vs. NoSQL</Link> —
          the same domain modelled both ways.
        </li>
      </ul>
    </div>
  );
}
