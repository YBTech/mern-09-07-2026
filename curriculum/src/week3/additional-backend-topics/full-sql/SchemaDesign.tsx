import { Link } from "react-router-dom";
import TopicNav from "../../../components/TopicNav";
import CodeBlock from "../../../components/CodeBlock";

export default function SchemaDesign() {
  return (
    <div className="page notes-page">
      <title>Full SQL — Schema Design &amp; Evolution</title>
      <TopicNav day="additional-backend-topics" topic="full-sql" current="schema-design" />

      <header className="lecture-header">
        <p className="eyebrow">Full SQL · Advanced</p>
        <h1>Schema Design &amp; Evolution</h1>
        <p className="subtitle">
          Normalization from 1NF to 3NF, the denormalizations you make on purpose, and how a schema
          changes safely once it has real data in it.
        </p>
      </header>

      <p className="callout">
        Normalize until it hurts, denormalize until it works — and be able to say which one you did
        and why.
      </p>

      <hr className="section-divider" />

      <h2>1. Why normalization exists</h2>
      <p>Start with the mistake every spreadsheet-shaped schema makes — one flat table:</p>
      <CodeBlock
        language="plaintext"
        code={`order_id | customer_name | customer_email  | store       | products                  | total
---------+---------------+-----------------+-------------+---------------------------+-------
4012     | Felix Chen    | felix@mail.com  | Boston #3   | Mug x2, Tumbler x1        | 34.97
4013     | Felix Chen    | felix@male.com  | Boston #3   | Mug x1                    | 12.99
4014     | Ana Diaz      | ana@mail.com    | Boston #3   | Tumbler x3                | 68.97`}
      />
      <div className="concept">
        <p className="concept-label">Concept — the three anomalies that follow</p>
        <ul>
          <li>
            <strong>Update anomaly.</strong> Felix changes his email; it lives on every one of his
            order rows, so missing one leaves the data contradicting itself — as row 4013 already
            does.
          </li>
          <li>
            <strong>Insert anomaly.</strong> A new store that hasn't taken an order yet has nowhere
            to exist.
          </li>
          <li>
            <strong>Delete anomaly.</strong> Deleting Ana's only order deletes the only record that
            the Tumbler was ever sold.
          </li>
          <li>
            <strong>And it isn't queryable.</strong> "How many mugs did we sell?" requires parsing a
            text column.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>2. First normal form — atomic values</h2>
      <p>
        <strong>1NF:</strong> every column holds a single value, and there are no repeating groups.
      </p>
      <CodeBlock
        language="plaintext"
        bad={[2, 3]}
        code={`NOT 1NF — a list crammed into one cell, and numbered repeating columns:
  products TEXT                      'Mug x2, Tumbler x1'
  product_1, product_2, product_3    what happens on the fourth item?`}
      />
      <CodeBlock
        language="sql"
        code={`-- 1NF: one row per item, in its own table
CREATE TABLE order_items (
  order_id INTEGER NOT NULL,
  product_name VARCHAR(160) NOT NULL,
  quantity INTEGER NOT NULL
);`}
      />
      <p className="callout">
        A JSONB column or a real array column is a deliberate, indexable exception — not the same
        thing as a comma-separated string. Use them when the shape genuinely varies, never to avoid
        making a table.
      </p>

      <hr className="section-divider" />

      <h2>3. Second normal form — no partial dependencies</h2>
      <p>
        <strong>2NF:</strong> 1NF, plus every non-key column depends on the <em>whole</em> primary
        key. It only ever bites when the key is composite.
      </p>
      <CodeBlock
        language="sql"
        bad={[6, 7]}
        code={`-- composite key: (order_id, product_id)
CREATE TABLE order_items (
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,              -- depends on BOTH: fine
  product_name VARCHAR(160),     -- depends on product_id ALONE: partial dependency
  product_weight_grams INTEGER,  -- same problem
  PRIMARY KEY (order_id, product_id)
);`}
      />
      <CodeBlock
        language="sql"
        code={`-- 2NF: the product's own attributes move to the product
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  weight_grams INTEGER NOT NULL
);

CREATE TABLE order_items (
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  PRIMARY KEY (order_id, product_id)
);`}
      />

      <hr className="section-divider" />

      <h2>4. Third normal form — no transitive dependencies</h2>
      <p>
        <strong>3NF:</strong> 2NF, plus no non-key column depends on another non-key column.
      </p>
      <CodeBlock
        language="sql"
        bad={[5, 6]}
        code={`CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  store_id INTEGER,
  store_name VARCHAR(120),   -- depends on store_id, not on the order
  store_region VARCHAR(80),  -- same: id -> store_id -> store_region is transitive
  status VARCHAR(20)
);`}
      />
      <CodeBlock
        language="sql"
        code={`-- 3NF: store attributes live on the store, and the order just points at it
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  region VARCHAR(80) NOT NULL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  store_id INTEGER REFERENCES stores(id),
  status VARCHAR(20) NOT NULL DEFAULT 'placed'
);`}
      />
      <p className="callout">
        The one-line version of all three: <em>every non-key column depends on the key, the whole
        key, and nothing but the key.</em> 3NF is where practical schema design stops — BCNF, 4NF and
        5NF exist and almost never change a real design.
      </p>

      <table className="ref-table">
        <thead>
          <tr>
            <th>Form</th>
            <th>Rule</th>
            <th>Fixes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1NF</td>
            <td>Atomic values, no repeating groups</td>
            <td>Unqueryable list-in-a-cell columns</td>
          </tr>
          <tr>
            <td>2NF</td>
            <td>No column depends on only part of a composite key</td>
            <td>Attributes duplicated on every row of a pairing</td>
          </tr>
          <tr>
            <td>3NF</td>
            <td>No column depends on another non-key column</td>
            <td>Entity attributes copied onto a related table</td>
          </tr>
        </tbody>
      </table>

      <hr className="section-divider" />

      <h2>5. Denormalizing on purpose</h2>
      <p>
        Denormalization means deliberately storing data in more than one place, accepting the
        duplication in exchange for something concrete. It is only defensible when you can name what
        you bought.
      </p>

      <h3>A. Point-in-time capture — a correctness requirement, not an optimization</h3>
      <CodeBlock
        language="plaintext"
        bad={[2]}
        good={[5]}
        code={`-- looking the price up live means last year's invoice changes when the catalog does
SELECT p.price_cents FROM products p WHERE p.id = oi.product_id

-- captured at order time, frozen forever
order_items.unit_price_cents`}
      />
      <p>
        Same reasoning applies to the shipping address on an order and the tax rate applied: the
        order records what was true <em>then</em>, and the catalog records what is true{" "}
        <em>now</em>. These are two different facts that happen to share a name.
      </p>

      <h3>B. Precomputed aggregates</h3>
      <CodeBlock
        language="sql"
        code={`-- recomputing this per row of a 200-order list is 200 aggregate queries
ALTER TABLE orders ADD COLUMN total_cents INTEGER;
ALTER TABLE orders ADD COLUMN item_count INTEGER NOT NULL DEFAULT 0;

-- keep it true in the same transaction that writes the items, or with a trigger
UPDATE orders o
SET total_cents = (SELECT SUM(quantity * unit_price_cents) FROM order_items WHERE order_id = o.id)
WHERE o.id = 4012;`}
      />
      <p className="callout">
        Every derived column is a value that can drift out of sync. Update it inside the same
        transaction as the source data, or make it a materialized view you refresh on a schedule —
        never "whenever the app remembers to".
      </p>

      <h3>C. Materialized views for reporting</h3>
      <CodeBlock
        language="sql"
        code={`CREATE MATERIALIZED VIEW store_daily_revenue AS
SELECT o.store_id, date_trunc('day', o.created_at) AS day,
       SUM(oi.quantity * oi.unit_price_cents) AS revenue_cents
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'
GROUP BY 1, 2;

CREATE UNIQUE INDEX ON store_daily_revenue (store_id, day);
REFRESH MATERIALIZED VIEW CONCURRENTLY store_daily_revenue;   -- the unique index is what CONCURRENTLY needs`}
      />

      <table className="ref-table">
        <thead>
          <tr>
            <th>Denormalize when</th>
            <th>Stay normalized when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The value must record a point in time (price, address, tax)</td>
            <td>There's one current truth and everyone should see it</td>
          </tr>
          <tr>
            <td>A measured read path is too slow and the join is the cause</td>
            <td>You're guessing that a join "might be slow"</td>
          </tr>
          <tr>
            <td>Reads vastly outnumber writes and staleness is acceptable</td>
            <td>The data changes constantly and must be exact</td>
          </tr>
          <tr>
            <td>You can keep the copy in sync transactionally</td>
            <td>Keeping it in sync would be best-effort</td>
          </tr>
        </tbody>
      </table>

      <hr className="section-divider" />

      <h2>6. Migrations</h2>
      <p>
        A migration is a versioned, ordered script that changes the schema. The schema lives in the
        repository as a sequence of these files — never as something someone typed into{" "}
        <code>psql</code> on production.
      </p>
      <CodeBlock
        language="bash"
        code={`migrations/
  20260301120000_create_orders.sql
  20260305093000_add_orders_store_id.sql
  20260312171500_backfill_order_totals.sql
# applied in filename order; the tool records which have run in a schema_migrations table`}
      />
      <CodeBlock
        language="typescript"
        code={`// node-pg-migrate / Knex style: up applies the change, down reverses it
export async function up(pgm) {
  pgm.addColumn("orders", { cancelled_at: { type: "timestamptz", notNull: false } });
  pgm.createIndex("orders", ["status", "created_at"]);
}

export async function down(pgm) {
  pgm.dropIndex("orders", ["status", "created_at"]);
  pgm.dropColumn("orders", "cancelled_at");
}`}
      />

      <div className="concept">
        <p className="concept-label">Concept — rules that keep migrations from causing outages</p>
        <ul>
          <li>
            <strong>Never edit an applied migration.</strong> It has already run somewhere; write a
            new one instead.
          </li>
          <li>
            <strong>Forward-only in practice.</strong> Write the <code>down</code>, but treat a bad
            deploy as "roll forward with a fix" — a <code>down</code> that drops a column destroys
            the data written since.
          </li>
          <li>
            <strong>Separate schema changes from data backfills.</strong> A backfill over 40M rows
            belongs in its own batched, resumable script, not in the DDL migration.
          </li>
          <li>
            <strong>One migration, one logical change.</strong> Long transactions holding DDL locks
            are how a deploy takes the site down.
          </li>
          <li>
            <strong>Know which statements lock.</strong> Adding a nullable column is instant; adding
            a <code>NOT NULL</code> column with a default, or changing a type, rewrites the whole
            table.
          </li>
        </ul>
      </div>

      <h3>Locking: the ones that bite</h3>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Statement</th>
            <th>Cost on a large table</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>ADD COLUMN</code> (nullable, no default)</td>
            <td>Instant — metadata only</td>
          </tr>
          <tr>
            <td><code>ADD COLUMN ... DEFAULT</code></td>
            <td>Instant in Postgres 11+, full rewrite before that</td>
          </tr>
          <tr>
            <td><code>ALTER COLUMN ... TYPE</code></td>
            <td>Full table rewrite, table locked throughout</td>
          </tr>
          <tr>
            <td><code>CREATE INDEX</code></td>
            <td>Blocks writes — use <code>CREATE INDEX CONCURRENTLY</code></td>
          </tr>
          <tr>
            <td><code>ADD CONSTRAINT ... CHECK</code></td>
            <td>Scans the table — add <code>NOT VALID</code>, then <code>VALIDATE CONSTRAINT</code></td>
          </tr>
          <tr>
            <td><code>ADD FOREIGN KEY</code></td>
            <td>Same: <code>NOT VALID</code> first, validate second</td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        language="sql"
        code={`-- adding a constraint to a live table without a long lock
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('placed','routed','packed','shipped','delivered','cancelled')) NOT VALID;

ALTER TABLE orders VALIDATE CONSTRAINT orders_status_check;   -- scans, but doesn't block writes`}
      />

      <h3>Expand / contract — changing a column with zero downtime</h3>
      <p>
        Old and new application code run at the same time during a deploy, so the schema has to
        satisfy both. Rename <code>orders.total</code> to <code>orders.total_cents</code> in four
        deploys, not one:
      </p>
      <ol>
        <li><strong>Expand:</strong> add <code>total_cents</code>, nullable. Old code ignores it.</li>
        <li><strong>Dual-write:</strong> deploy code that writes both columns; backfill the old rows in batches.</li>
        <li><strong>Switch reads:</strong> deploy code that reads <code>total_cents</code> only.</li>
        <li><strong>Contract:</strong> stop writing <code>total</code>, then drop it in a later migration.</li>
      </ol>
      <p className="callout">
        A single <code>ALTER TABLE ... RENAME COLUMN</code> breaks every instance still running the
        previous release, for the whole rollout window. The four-step version never has a moment
        where some running code is wrong.
      </p>

      <h3>Seeds vs. migrations</h3>
      <CodeBlock
        language="bash"
        code={`# migrations: schema, plus reference data the app cannot run without (status codes, roles)
# seeds:      sample/demo data for development — never run against production`}
      />

      <hr className="section-divider" />

      <h2>7. Designing a new table — the checklist</h2>
      <ol>
        <li>What is one row? Name the table after that noun, plural.</li>
        <li>What identifies it? <code>SERIAL</code> id unless you need client-generated UUIDs.</li>
        <li>Which columns are required? <code>NOT NULL</code> by default; nullable is the exception you justify.</li>
        <li>Which values are invalid? Encode them as <code>CHECK</code>/<code>UNIQUE</code>, not just in app code.</li>
        <li>What does it point at? Foreign keys, and the right <code>ON DELETE</code> behaviour.</li>
        <li>Does any column duplicate data that lives elsewhere? Justify it as point-in-time capture or remove it.</li>
        <li>How will it be queried? Index those columns — and index every foreign key.</li>
        <li>How will rows be removed? Hard delete, soft delete, or a partition you can drop.</li>
      </ol>
      <p>
        Once the shape is right, the remaining question is whether it should be relational at all —{" "}
        <Link to="/week3/additional-backend-topics/full-sql/sql-vs-nosql">SQL vs. NoSQL</Link>.
      </p>
    </div>
  );
}
