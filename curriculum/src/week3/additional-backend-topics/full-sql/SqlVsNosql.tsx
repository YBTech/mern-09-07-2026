import { Link } from "react-router-dom";
import TopicNav from "../../../components/TopicNav";
import CodeBlock from "../../../components/CodeBlock";

export default function SqlVsNosql() {
  return (
    <div className="page notes-page">
      <title>Full SQL — SQL vs. NoSQL</title>
      <TopicNav day="additional-backend-topics" topic="full-sql" current="sql-vs-nosql" />

      <header className="lecture-header">
        <p className="eyebrow">Full SQL · Advanced</p>
        <h1>SQL vs. NoSQL</h1>
        <p className="subtitle">
          Term by term, ACID vs. BASE, the same domain modelled both ways, and how real systems end
          up using both.
        </p>
      </header>

      <p className="callout">
        "NoSQL" isn't one thing — it's four unrelated families. Most of this page compares
        relational Postgres with document MongoDB, because that's the MERN choice you'll actually
        make.
      </p>

      <hr className="section-divider" />

      <h2>1. The four NoSQL families</h2>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Family</th>
            <th>Shape</th>
            <th>Examples</th>
            <th>Built for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Document</td>
            <td>JSON-ish documents in collections</td>
            <td>MongoDB, DocumentDB, Firestore</td>
            <td>Whole objects read and written together</td>
          </tr>
          <tr>
            <td>Key-value</td>
            <td>Opaque value under a key</td>
            <td>Redis, DynamoDB, Memcached</td>
            <td>Cache, sessions, counters, huge simple lookups</td>
          </tr>
          <tr>
            <td>Wide-column</td>
            <td>Rows with a partition key and dynamic columns</td>
            <td>Cassandra, HBase, Bigtable</td>
            <td>Massive write throughput, time-series at scale</td>
          </tr>
          <tr>
            <td>Graph</td>
            <td>Nodes and edges as first-class things</td>
            <td>Neo4j, Neptune</td>
            <td>Deep relationship traversal — social, fraud rings</td>
          </tr>
        </tbody>
      </table>

      <hr className="section-divider" />

      <h2>2. Term by term</h2>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Relational (Postgres)</th>
            <th>Document (MongoDB)</th>
            <th>Not quite the same because</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Database</td>
            <td>Database</td>
            <td>Same idea</td>
          </tr>
          <tr>
            <td>Table</td>
            <td>Collection</td>
            <td>A collection enforces no shape unless you add a JSON schema validator</td>
          </tr>
          <tr>
            <td>Row</td>
            <td>Document</td>
            <td>A document can nest arrays and sub-objects; a row is flat</td>
          </tr>
          <tr>
            <td>Column</td>
            <td>Field</td>
            <td>Fields are per-document — two documents need not share any</td>
          </tr>
          <tr>
            <td>Primary key (<code>id</code>)</td>
            <td><code>_id</code> (ObjectId)</td>
            <td>Generated client-side, embeds a timestamp</td>
          </tr>
          <tr>
            <td>Foreign key + <code>JOIN</code></td>
            <td>Embedding, or a manual ref + <code>$lookup</code></td>
            <td>No referential integrity — nothing stops a dangling ref</td>
          </tr>
          <tr>
            <td>Schema (DDL)</td>
            <td>Schema in the app (Mongoose) or none</td>
            <td>Enforcement moves from the database into your code</td>
          </tr>
          <tr>
            <td><code>ALTER TABLE</code> migration</td>
            <td>Write the new field; old documents lack it</td>
            <td>Every reader must handle both shapes, forever</td>
          </tr>
          <tr>
            <td>Transaction</td>
            <td>Transaction (4.0+, replica set required)</td>
            <td>Supported, but the data model is meant to avoid needing them</td>
          </tr>
          <tr>
            <td><code>GROUP BY</code> / window functions</td>
            <td>Aggregation pipeline</td>
            <td>Stages instead of clauses; same ideas, different syntax</td>
          </tr>
        </tbody>
      </table>

      <hr className="section-divider" />

      <h2>3. ACID vs. BASE</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>ACID</strong> — Atomicity, Consistency, Isolation, Durability. The database
            refuses to be in an invalid state, and a commit means it's true everywhere.
          </li>
          <li>
            <strong>BASE</strong> — <em>Basically Available</em>, <em>Soft state</em>,{" "}
            <em>Eventually consistent</em>. The system stays up and accepts writes; replicas
            converge shortly afterwards.
          </li>
          <li>
            <strong>CAP</strong> — under a network partition you can keep Consistency or
            Availability, not both. ACID systems typically refuse the write; BASE systems typically
            accept it and reconcile later.
          </li>
          <li>
            This is a spectrum, not a label. Postgres with async replicas gives you eventually
            consistent <em>reads</em>; MongoDB with <code>writeConcern: "majority"</code> and
            transactions is close to ACID. The question is always which guarantee <em>this
            operation</em> needs.
          </li>
        </ul>
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Needs</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Reserve stock and place an order</td>
            <td>ACID</td>
            <td>Two customers must not reserve the same unit</td>
          </tr>
          <tr>
            <td>Record a status change to history</td>
            <td>BASE is fine</td>
            <td>Append-only, read later, no cross-record invariant</td>
          </tr>
          <tr>
            <td>Increment a "views" counter</td>
            <td>BASE is fine</td>
            <td>Nobody notices if it lags a second</td>
          </tr>
          <tr>
            <td>Move money between accounts</td>
            <td>ACID</td>
            <td>The two writes are meaningless apart</td>
          </tr>
        </tbody>
      </table>

      <hr className="section-divider" />

      <h2>4. The same domain, modelled both ways</h2>

      <h3>Relational — normalized across tables</h3>
      <CodeBlock
        language="plaintext"
        code={`orders(id, customer_id, store_id, status, created_at)
order_items(id, order_id, product_id, quantity, unit_price_cents)
products(id, sku, name, price_cents)
customers(id, name, email)

-- reading one order for display = a 3-table join`}
      />

      <h3>Document — one order is one document</h3>
      <CodeBlock
        language="json"
        code={`{
  "_id": "663f1b2c8a9d0e4f12345678",
  "customerId": "663f1a9c8a9d0e4f11111111",
  "customerName": "Felix Chen",
  "storeId": "663f1a9c8a9d0e4f22222222",
  "status": "packed",
  "items": [
    { "productId": "663f...", "sku": "MUG-001", "name": "Ceramic Mug", "quantity": 2, "unitPriceCents": 1299 },
    { "productId": "663f...", "sku": "TUM-004", "name": "Tumbler", "quantity": 1, "unitPriceCents": 2299 }
  ],
  "totalCents": 4897,
  "createdAt": "2026-03-14T10:02:11Z"
}`}
      />
      <div className="concept">
        <p className="concept-label">Concept — embed vs. reference</p>
        <ul>
          <li>
            <strong>Embed</strong> when the child is always read with the parent, is owned by it, and
            is bounded in size — order items are the textbook case.
          </li>
          <li>
            <strong>Reference</strong> when the child is shared (a product appears in thousands of
            orders), queried on its own, or unbounded.
          </li>
          <li>
            Embedding <em>duplicates</em> data by design. <code>customerName</code> on the order is
            a denormalization — and in this case a correct one, since it records who placed the
            order at that time.
          </li>
          <li>
            The cost: a customer renaming themselves doesn't retroactively update documents, and
            there's a 16MB per-document ceiling.
          </li>
          <li>
            You model documents around <em>the query you'll run</em>, not around the entities. That
            is the single biggest mental shift from relational design.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>5. The same queries, side by side</h2>

      <h3>Read one order with its items</h3>
      <CodeBlock
        language="sql"
        code={`SELECT o.id, o.status, p.name, oi.quantity, oi.unit_price_cents
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.id = 4012;`}
      />
      <CodeBlock
        language="typescript"
        code={`// one document, one read — the join was done at write time by embedding
const order = await db.collection("orders").findOne({ _id: orderId });`}
      />

      <h3>Filter and sort</h3>
      <CodeBlock
        language="sql"
        code={`SELECT * FROM orders
WHERE status = 'packed' AND created_at > now() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 20;`}
      />
      <CodeBlock
        language="typescript"
        code={`await db.collection("orders")
  .find({ status: "packed", createdAt: { $gt: sevenDaysAgo } })
  .sort({ createdAt: -1 })
  .limit(20)
  .toArray();`}
      />

      <h3>Aggregate: revenue per store</h3>
      <CodeBlock
        language="sql"
        code={`SELECT store_id, COUNT(*) AS order_count, SUM(total_cents) AS revenue_cents
FROM orders
WHERE status <> 'cancelled'
GROUP BY store_id
HAVING COUNT(*) >= 10
ORDER BY revenue_cents DESC;`}
      />
      <CodeBlock
        language="typescript"
        code={`await db.collection("orders").aggregate([
  { $match: { status: { $ne: "cancelled" } } },                 // WHERE
  { $group: { _id: "$storeId",                                   // GROUP BY
              orderCount: { $sum: 1 },                           // COUNT(*)
              revenueCents: { $sum: "$totalCents" } } },         // SUM(...)
  { $match: { orderCount: { $gte: 10 } } },                      // HAVING
  { $sort: { revenueCents: -1 } },                               // ORDER BY
]).toArray();`}
      />
      <p className="callout">
        The pipeline stages map one-to-one onto SQL clauses — and they run in the order you write
        them, which is why <code>$match</code> goes first: filtering before grouping is the same
        optimization in both worlds.
      </p>

      <h3>Join across collections</h3>
      <CodeBlock
        language="typescript"
        code={`// $lookup is Mongo's left outer join — available, but slower than a relational join
// and a sign the data might have wanted to be embedded (or relational) in the first place
await db.collection("orders").aggregate([
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
]).toArray();`}
      />

      <h3>Transactions</h3>
      <CodeBlock
        language="typescript"
        code={`const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await inventory.updateOne({ storeId, productId }, { $inc: { reserved: 3 } }, { session });
    await orders.insertOne({ customerId, storeId, status: "routed" }, { session });
  });
} finally {
  await session.endSession();
}
// works on a replica set, but costs more than in Postgres — the document model exists
// partly so that most operations touch a single document and need no transaction at all`}
      />

      <hr className="section-divider" />

      <h2>6. Choosing</h2>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Choose relational when</th>
            <th>Choose document when</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data has real relationships you'll query across</td>
            <td>An aggregate is always read and written whole</td>
          </tr>
          <tr>
            <td>Invariants span records (stock, balances, bookings)</td>
            <td>Records are independent of each other</td>
          </tr>
          <tr>
            <td>You need ad-hoc queries and reporting you can't predict</td>
            <td>Access patterns are few and known up front</td>
          </tr>
          <tr>
            <td>Correctness matters more than write throughput</td>
            <td>Write volume and horizontal scale matter most</td>
          </tr>
          <tr>
            <td>The shape is stable and should be enforced</td>
            <td>The shape genuinely varies per record</td>
          </tr>
        </tbody>
      </table>
      <div className="concept">
        <p className="concept-label">Concept — the honest version</p>
        <ul>
          <li>
            "Schemaless" means the schema moved into your application code, where nothing enforces
            it. Old documents keep their old shape forever, and every reader handles every past
            version.
          </li>
          <li>
            Postgres has <code>JSONB</code> with GIN indexes — so "I need flexible fields" is not by
            itself a reason to leave relational.
          </li>
          <li>
            Most teams that picked NoSQL for scale never reached the scale that justified it, and
            did pay for the lost joins and constraints.
          </li>
          <li>
            Default to Postgres. Move a specific workload to something else when you can name the
            property Postgres can't give it.
          </li>
        </ul>
      </div>

      <hr className="section-divider" />

      <h2>7. Both at once — polyglot persistence</h2>
      <p>
        At any real scale the question stops being "which database" and becomes "which database for
        this workload". In a microservices architecture each service owns its own store, so the
        choice is per service rather than per company.
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Workload in this project</th>
            <th>Store</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Orders, inventory, customers</td>
            <td>PostgreSQL</td>
            <td>Cross-record invariants, joins, ACID transactions</td>
          </tr>
          <tr>
            <td>Product catalog reads, sessions, rate limits</td>
            <td>Redis</td>
            <td>Read constantly, changes rarely, tolerates being rebuilt (day 13)</td>
          </tr>
          <tr>
            <td>Order status history / event log</td>
            <td>DynamoDB or Cassandra</td>
            <td>Append-only, high write volume, keyed lookup, no joins (day 15)</td>
          </tr>
          <tr>
            <td>Product search</td>
            <td>Elasticsearch / OpenSearch</td>
            <td>Relevance ranking and typo tolerance a <code>LIKE</code> can't do</td>
          </tr>
          <tr>
            <td>Uploaded invoices, label PDFs</td>
            <td>S3</td>
            <td>Blobs never belong in a database row (day 15)</td>
          </tr>
          <tr>
            <td>Analytics over years of orders</td>
            <td>Redshift / BigQuery / Snowflake</td>
            <td>Column-oriented scans, kept off the transactional primary</td>
          </tr>
        </tbody>
      </table>
      <div className="concept">
        <p className="concept-label">Concept — what polyglot actually costs</p>
        <ul>
          <li>
            The moment data lives in two stores, there is no transaction across them. Keeping them
            in sync becomes an application concern — usually an event stream, with retries and
            idempotent consumers.
          </li>
          <li>
            Every additional store is another thing to operate, back up, secure, monitor and hire
            for.
          </li>
          <li>
            The pattern that pays: one source of truth (Postgres), with derived read stores
            (cache, search index, warehouse) that can be rebuilt from it.
          </li>
          <li>
            The pattern that hurts: two stores that both accept writes for the same fact and have to
            be reconciled.
          </li>
        </ul>
      </div>

      <p>
        Day 15 puts real AWS names on this — RDS for the relational primary, DynamoDB for the
        append-only log, S3 for blobs. Start from{" "}
        <Link to="/week3/additional-backend-topics/full-sql/foundation">Foundation</Link> if any of
        the relational half still feels shaky.
      </p>
    </div>
  );
}
