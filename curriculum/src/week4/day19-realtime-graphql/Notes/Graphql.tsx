import { Link } from "react-router-dom";
import CodeBlock from "../../../components/CodeBlock";
import DayNav from "../../../components/DayNav";
import { Arrow, ArrowDefs, Box, T } from "../../../components/Diagram";
import NotesNav from "./NotesNav";

export default function GraphqlNotes() {
  return (
    <div className="page notes-page">
      <title>Day 19 Notes — GraphQL</title>
      <DayNav day="day19-realtime-graphql" current="notes" />
      <NotesNav current="graphql" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 19 · Notes</p>
        <h1>GraphQL</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>Explain why one screen calling several microservices from the browser gets slow — especially on a phone on cellular</li>
          <li>Explain over-fetching and under-fetching with a concrete example</li>
          <li>Explain what an aggregation layer (a BFF) does, and why GraphQL is mostly used there</li>
          <li>Read and write a basic GraphQL schema, query, and mutation, and explain what a resolver is</li>
          <li>
            Explain how GraphQL differs from REST on the wire: one <code>POST</code> endpoint, <code>200</code> even with
            errors, no free HTTP caching
          </li>
          <li>Explain what GraphQL costs — N+1 resolvers, expensive queries, caching, per-field authorization — and why so many teams walked it back</li>
          <li>Choose between REST and GraphQL for a given service, and defend it</li>
        </ul>
        <p>
          Want more? <Link to="/week4/day19-realtime-graphql/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ============================================================ */}
        <h3 className="part">Part A — The problem: one page, four REST services</h3>

        <h4 className="topic">A.1 The &quot;My Account&quot; page</h4>
        <p>Once a store is split into microservices, a single screen often needs data from several of them:</p>
        <svg viewBox="0 0 640 300" role="img" aria-label="A My Account page mockup. The profile panel comes from the Users service. The recent orders panel comes from Orders, with each item&apos;s name and price stored on the order, and delivery status from Shipping. The your reviews panel comes from Reviews.">
          <rect x="10" y="10" width="620" height="280" rx="8" fill="#fff" stroke="#bbb" strokeWidth="1.5" />
          <rect x="10" y="10" width="620" height="26" rx="8" fill="#f1f3f5" stroke="#bbb" strokeWidth="1.5" />
          <T x={24} y={28} anchor="start" color="#1c1c1c" bold>My Account</T>
          <rect x="30" y="52" width="180" height="78" rx="6" fill="#fafbfc" stroke="#d5dae0" />
          <T x={42} y={72} anchor="start" color="#1c1c1c" bold>Alice Martin</T>
          <T x={42} y={90} anchor="start">alice@shop.com</T>
          <T x={42} y={106} anchor="start">Gold member</T>
          <rect x="230" y="52" width="380" height="220" rx="6" fill="#fafbfc" stroke="#d5dae0" />
          <T x={242} y={72} anchor="start" color="#1c1c1c" bold>Recent orders</T>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="242" y={84 + i * 58} width="44" height="44" rx="4" fill="#e9eef7" stroke="#c6d3ea" />
              <T x={298} y={102 + i * 58} anchor="start" color="#1c1c1c">{["Mechanical Keyboard", '27" 4K Monitor', "Headphones"][i]}</T>
              <T x={298} y={118 + i * 58} anchor="start">{["$129 · ord-2004", "$349 · ord-2003", "$199 · ord-2002"][i]}</T>
              <rect x="510" y={92 + i * 58} width="84" height="20" rx="10" fill="#eef8ee" stroke="#7dbb7d" />
              <T x={552} y={106 + i * 58} size={9} color="#256029">{["in transit", "delivered", "delivered"][i]}</T>
            </g>
          ))}
          <rect x="30" y="146" width="180" height="126" rx="6" fill="#fafbfc" stroke="#d5dae0" />
          <T x={42} y={166} anchor="start" color="#1c1c1c" bold>Your reviews</T>
          <T x={42} y={186} anchor="start">★★★★★ Worth every penny</T>
          <T x={42} y={204} anchor="start">★★★★ Arrived fast</T>
          <T x={42} y={222} anchor="start">★★ Returned it</T>
          {[
            ["users", 170, 46],
            ["orders", 560, 46],
            ["shipping", 552, 274],
            ["reviews", 170, 140],
          ].map(([label, x, y]) => (
            <g key={label as string}>
              <rect x={(x as number) - 34} y={(y as number) - 11} width="68" height="18" rx="9" fill="#eef3ff" stroke="#7ea6e0" />
              <T x={x as number} y={(y as number) + 2} size={9} color="#2b4a80" bold>{label as string}</T>
            </g>
          ))}
        </svg>
        <p className="callout">Four services own pieces of this one page: Users, Orders, Shipping, and Reviews.</p>

        <h4 className="topic">A.2 Calling them all from the browser</h4>
        <ul>
          <li>
            <code>GET /orders?customerId=c-1</code> returns each order <em>with</em> its items, joined inside the Orders
            service&apos;s own database.
          </li>
          <li>
            Each item keeps a <strong>snapshot</strong> of the product from checkout (its name, and the price paid), so the
            list needs no call to Catalog.
          </li>
          <li>
            What Orders can&apos;t join is another service&apos;s data: shipment status lives in Shipping&apos;s database.
          </li>
        </ul>
        <p>So the browser makes four calls, in two waves. Wave 2 needs the order ids that wave 1 returns:</p>
        <svg viewBox="0 0 640 200" role="img" aria-label="A request waterfall. Wave 1: Users, Orders, and Reviews in parallel, about 170 milliseconds. Wave 2 can only start after: one Shipping call for all four orders, finishing around 340 milliseconds. 4 requests in total.">
          <T x={120} y={34} anchor="end" color="#1c1c1c">users</T>
          <T x={120} y={58} anchor="end" color="#1c1c1c">orders</T>
          <T x={120} y={82} anchor="end" color="#1c1c1c">reviews</T>
          <T x={120} y={124} anchor="end" color="#1c1c1c">shipping</T>
          {[22, 46, 70].map((y) => (
            <rect key={y} x="130" y={y} width="230" height="16" rx="3" fill="#eef3ff" stroke="#7ea6e0" />
          ))}
          <rect x="370" y="112" width="230" height="16" rx="3" fill="#fdf3f3" stroke="#d98b8b" />
          <T x={245} y={104} color="#2b4a80">wave 1 (needs only the customer id)</T>
          <T x={485} y={148} color="#c0392b">wave 2 (needs the order ids, so it waits)</T>
          <path d="M365,16 L365,135" stroke="#bbb" strokeDasharray="4,3" />
          <Arrow d="M130,166 L604,166" />
          <T x={367} y={188} color="#1c1c1c">measured in the lecture demo: 4 requests, ~340 ms — two full trips across the internet</T>
        </svg>
        <table className="ref-table">
          <thead>
            <tr>
              <th>What hurts</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Many round trips</td>
              <td>Each one crosses the internet: 100–200 ms on a phone, more on a bad network</td>
            </tr>
            <tr>
              <td>A waterfall</td>
              <td>Wave 2 can&apos;t start until wave 1 answers, so the delays stack</td>
            </tr>
            <tr>
              <td>Every client re-does the work</td>
              <td>Web, iOS, and Android each write the same four calls and the same stitching code</td>
            </tr>
            <tr>
              <td>Mobile suffers most</td>
              <td>Slow, flaky networks multiply every one of those round trips</td>
            </tr>
            <tr>
              <td>Internals leak out</td>
              <td>The browser needs every service&apos;s address, and every service needs CORS and public auth</td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">A.3 Fine on a laptop, painful on a phone</h4>
        <p>The same four calls cost very different amounts depending on where the customer is:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Laptop on good Wi-Fi</th>
              <th>Phone on cellular</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>One round trip to the datacenter</td>
              <td>~20 ms</td>
              <td>~100–300 ms, and it jumps around</td>
            </tr>
            <tr>
              <td>Two waves of calls</td>
              <td>~40 ms — nobody notices</td>
              <td>~300–600 ms — a visible spinner</td>
            </tr>
            <tr>
              <td>Data downloaded</td>
              <td>Plenty of bandwidth</td>
              <td>Metered data plan and battery</td>
            </tr>
            <tr>
              <td>What the screen shows</td>
              <td>The full page</td>
              <td>A small screen: a fraction of the fields</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          On a laptop this page is fine as it is. The trouble starts on a slow network with a small screen.
        </p>

        <h4 className="topic">A.4 The two core problems: under-fetching and over-fetching</h4>
        <p>Everything that hurts on the phone comes down to two problems — and they pull in opposite directions:</p>
        <svg viewBox="0 0 640 270" role="img" aria-label="Left panel, under-fetching: the phone makes four requests in two waves — users, orders, and reviews, then shipping once the order ids arrive — because no single endpoint returns everything the page needs. Right panel, over-fetching: the response from GET /users/c-1 contains fourteen values — name, email, phone, tier, member since, a five-part address, and three preferences — but the phone screen only shows the first name.">
          <rect x="6" y="6" width="306" height="258" rx="10" fill="#fdf3f3" stroke="#d98b8b" strokeWidth="1.5" />
          <T x={159} y={30} size={13} color="#c0392b" bold>Under-fetching: too many trips</T>
          <Box x={20} y={104} w={70} h={56} kind="muted" label="Phone" size={11} />
          {[
            ["users", 52, "1"],
            ["orders", 92, "1"],
            ["reviews", 132, "1"],
            ["shipping", 192, "2"],
          ].map(([label, y, wave]) => (
            <g key={label as string}>
              <Box x={196} y={y as number} w={100} h={28} label={label as string} size={10} />
              <Arrow d={`M90,132 L194,${(y as number) + 14}`} ink={wave === "1" ? "dark" : "red"} />
            </g>
          ))}
          <T x={150} y={78} size={9} color="#5b6b82">wave 1</T>
          <T x={118} y={206} size={9} color="#c0392b">wave 2 (waits)</T>
          <T x={159} y={240} color="#1c1c1c">no single endpoint returns enough,</T>
          <T x={159} y={254} color="#1c1c1c">so the client makes 4 calls in 2 waves</T>

          <rect x="328" y="6" width="306" height="258" rx="10" fill="#fff7e0" stroke="#e8b400" strokeWidth="1.5" />
          <T x={481} y={30} size={13} color="#8a5a00" bold>Over-fetching: too much data</T>
          <T x={346} y={54} anchor="start" color="#1c1c1c" bold>GET /users/c-1 →</T>
          {[
            ["name: \"Alice Martin\"", true],
            ["email", false],
            ["phone", false],
            ["tier", false],
            ["memberSince", false],
            ["address: line1, city, region, postalCode, country", false],
            ["preferences: newsletter, currency, language", false],
          ].map(([field, used], i) => (
            <T key={i} x={352} y={78 + i * 20} anchor="start" size={10} color={used ? "#1c1c1c" : "#b0b0b0"} bold={used as boolean}>
              {`${used ? "✓" : "–"} ${field}`}
            </T>
          ))}
          <T x={481} y={240} color="#1c1c1c">14 values sent;</T>
          <T x={481} y={254} color="#1c1c1c">the phone shows 1 (the first name)</T>
        </svg>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <strong>Under-fetching</strong> — no single endpoint returns everything the screen needs, so the client makes
              several requests, often in waves. It costs <strong>time</strong>: every request is another trip across a slow
              network.
            </li>
            <li>
              <strong>Over-fetching</strong> — an endpoint returns more than the screen needs. It costs{" "}
              <strong>data</strong>: bandwidth, battery, and time spent downloading fields nobody looks at.
            </li>
            <li>
              Fixing one with REST tends to cause the other: one big endpoint that returns everything ends under-fetching,
              but over-fetches for every screen that needs less.
            </li>
          </ul>
        </div>
        <p className="callout">
          GraphQL was designed to fix both at once: <strong>one request</strong> per screen, carrying{" "}
          <strong>exactly the fields</strong> that screen asks for.
        </p>

        {/* ============================================================ */}
        <h3 className="part">Part B — The fix: an aggregation layer</h3>

        <h4 className="topic">B.1 One request in, many requests out</h4>
        <svg viewBox="0 0 640 250" role="img" aria-label="The browser makes one request across the internet, about 150 milliseconds, to an aggregation layer inside the datacenter. The aggregation layer calls Users, Orders, Shipping, and Reviews, each about 1 millisecond away.">
          <Box x={10} y={100} w={100} h={46} kind="muted" label="Browser" />
          <rect x="190" y="12" width="440" height="226" rx="12" fill="#fafbfc" stroke="#bbb" strokeDasharray="6,4" />
          <T x={410} y={30} color="#5b6b82">the datacenter</T>
          <Box x={210} y={98} w={130} h={50} kind="primary" label="Aggregation layer" size={11} />
          <Arrow d="M110,123 L208,123" />
          <T x={150} y={112}>1 request</T>
          <T x={150} y={142} color="#c0392b">~150 ms</T>
          {["Users", "Orders", "Shipping", "Reviews"].map((s, i) => (
            <g key={s}>
              <Box x={480} y={48 + i * 44} w={120} h={32} label={s} size={11} />
              <Arrow d={`M340,123 L478,${64 + i * 44}`} />
            </g>
          ))}
          <T x={410} y={228} color="#3d8b40">~1 ms each — the same two waves, but inside the datacenter</T>
        </svg>
        <ul>
          <li>It runs next to the services, so its calls to them are almost free.</li>
          <li>It makes those calls in parallel wherever it can, and stitches the results together once, for every client.</li>
          <li>The services don&apos;t change. They stay plain REST, owned by their own teams.</li>
        </ul>
        <p className="callout">
          You&apos;ll hear this called a <strong>BFF</strong> (&quot;backend for frontend&quot;). Strictly, a BFF is one
          aggregation layer <em>per</em> frontend (a web BFF, a mobile BFF). The general idea is just an aggregation layer.
        </p>
        <div className="concept">
          <p className="concept-label">Concept — it makes the same calls, so why is it faster?</p>
          <ul>
            <li>It doesn&apos;t make fewer calls: the same two waves still happen, because wave 2 still needs the order ids.</li>
            <li>
              What changes is <strong>where</strong> they travel. The browser pays for one slow trip across the internet;
              the second wave runs inside the datacenter, where a call takes about a millisecond.
            </li>
            <li>
              So the win depends on the client being far away. On a fast local network there&apos;s nothing to win — the
              extra hop through the aggregation layer can even make it slightly slower.
            </li>
          </ul>
        </div>

        <h4 className="topic">B.2 Version 1: a REST aggregation endpoint</h4>
        <CodeBlock
          language="typescript"
          code={`app.get("/dashboard/:customerId", async (req, res) => {
  const id = req.params.customerId;
  const [customer, orders, reviews] = await Promise.all([
    getJson(\`\${USERS}/users/\${id}\`),
    getJson(\`\${ORDERS}/orders?customerId=\${id}&limit=4\`),
    getReviewsBy(id),
  ]);
  const ids = orders.map((o) => o.id).join(",");
  const shipments = await getJson(\`\${SHIPPING}/shipments?orderIds=\${ids}\`);

  // One fixed shape: whole objects from every service, for every client.
  res.json({ customer, orders: withShipments(orders, shipments), reviews });
});`}
        />
        <p>It works: one request, ~170 ms. But one endpoint means one fixed response shape:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>New need</th>
              <th>What happens to the REST endpoint</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>The mobile app shows half the fields</td>
              <td>It downloads all of them anyway (over-fetching), or someone writes <code>/mobile-dashboard</code></td>
            </tr>
            <tr>
              <td>The order-detail page wants a different mix</td>
              <td>Another endpoint, and another backend release</td>
            </tr>
            <tr>
              <td>The web team adds a field to a card</td>
              <td>A backend change, a deploy, and coordination between teams</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">The endpoint count grows with the number of screens and clients.</p>

        <h4 className="topic">B.3 Version 2: GraphQL as the BFF</h4>
        <p>GraphQL was built for exactly this problem:</p>
        <ul>
          <li>
            Facebook created it in 2012 for its mobile app. Phones on cellular networks were loading the news feed through
            many REST calls, each returning far more than a small screen could show.
          </li>
          <li>
            Their fix: one endpoint, where the client sends a query describing <strong>exactly</strong> the data the screen
            needs — no extra round trips, no extra fields. Facebook open-sourced it in 2015.
          </li>
        </ul>
        <p>The same endpoint then serves every screen and every client, each asking for its own shape:</p>
        <div className="code-compare">
          <div>
            <p className="compare-label">Web dashboard</p>
            <CodeBlock
              language="graphql"
              code={`query Dashboard($id: ID!) {
  customer(id: $id) {
    name
    email
    tier
    orders(limit: 4) {
      id
      total
      shipment { status eta }
      items { name price qty }
    }
    reviews { rating title }
  }
}`}
            />
          </div>
          <div>
            <p className="compare-label">Mobile dashboard</p>
            <CodeBlock
              language="graphql"
              code={`query DashboardMobile($id: ID!) {
  customer(id: $id) {
    name
    orders(limit: 4) {
      id
      shipment { status }
      items { name }
    }
    reviews { title }
  }
}`}
            />
          </div>
        </div>
        <p>The same page, loaded the three ways in the lecture demo:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Requests</th>
              <th>Downloaded</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Browser calls each service</td>
              <td>4</td>
              <td>~2.3 KB</td>
              <td>~340 ms (two trips)</td>
            </tr>
            <tr>
              <td>REST aggregation endpoint</td>
              <td>1</td>
              <td>~3.1 KB (whole objects, for every client)</td>
              <td>~170 ms</td>
            </tr>
            <tr>
              <td>GraphQL aggregation (web query)</td>
              <td>1</td>
              <td>~1 KB</td>
              <td>~170 ms</td>
            </tr>
            <tr>
              <td>GraphQL aggregation (mobile query)</td>
              <td>1</td>
              <td>~0.65 KB</td>
              <td>~160 ms</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          This is GraphQL&apos;s most common job today: a <strong>BFF in front of REST services</strong>. The services stay
          plain REST; only the layer facing the frontends speaks GraphQL.
        </p>

        {/* ============================================================ */}
        <h3 className="part">Part C — GraphQL basics</h3>

        <h4 className="topic">C.1 The schema: the contract</h4>
        <p>Everything a client can ask for is declared up front, in the schema:</p>
        <CodeBlock
          language="graphql"
          code={`type Query {
  customer(id: ID!): Customer
  product(sku: ID!): Product
}

type Mutation {
  placeOrder(customerId: ID!, items: [OrderItemInput!]!): Order!
}

type Customer {
  id: ID!
  name: String!
  orders(limit: Int = 4): [Order!]!
}

type Order {
  id: ID!
  total: Float!
  status: OrderStatus!
  items: [OrderItem!]!
}

enum OrderStatus { PLACED SHIPPED DELIVERED }

input OrderItemInput {
  sku: ID!
  qty: Int!
}`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th>Building block</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>type Order {"{ … }"}</code>
              </td>
              <td>An object type: a named set of fields</td>
            </tr>
            <tr>
              <td>Scalars</td>
              <td>
                The leaves: <code>ID</code>, <code>String</code>, <code>Int</code>, <code>Float</code>, <code>Boolean</code>{" "}
                (plus custom ones like <code>DateTime</code>)
              </td>
            </tr>
            <tr>
              <td>
                <code>!</code>
              </td>
              <td>Non-null: this field always has a value</td>
            </tr>
            <tr>
              <td>
                <code>[Order!]!</code>
              </td>
              <td>A list (never null) of orders (never null)</td>
            </tr>
            <tr>
              <td>
                <code>enum</code>
              </td>
              <td>A field limited to a fixed set of values</td>
            </tr>
            <tr>
              <td>
                <code>input</code>
              </td>
              <td>A type used only as an argument, e.g. to a mutation</td>
            </tr>
            <tr>
              <td>
                <code>union</code>
              </td>
              <td>&quot;One of these types&quot;, e.g. a page block that&apos;s a hero <em>or</em> a carousel</td>
            </tr>
            <tr>
              <td>
                <code>Query</code> / <code>Mutation</code>
              </td>
              <td>The entry points: reads, and writes</td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">C.2 Queries and mutations</h4>
        <p>The response mirrors the query&apos;s shape, field for field:</p>
        <div className="code-compare">
          <div>
            <p className="compare-label">Query</p>
            <CodeBlock
              language="graphql"
              code={`query OrderCard($id: ID!) {
  order(id: $id) {
    id
    total
    items {
      qty
      product { name }
    }
  }
}`}
            />
          </div>
          <div>
            <p className="compare-label">Response</p>
            <CodeBlock
              language="json"
              code={`{
  "data": {
    "order": {
      "id": "ord-2004",
      "total": 188,
      "items": [
        { "qty": 1, "product": { "name": "Mechanical Keyboard" } },
        { "qty": 1, "product": { "name": "Wireless Mouse" } }
      ]
    }
  }
}`}
            />
          </div>
        </div>
        <CodeBlock
          language="graphql"
          code={`mutation {
  placeOrder(customerId: "c-1", items: [{ sku: "sku-108", qty: 2 }]) {
    id
    total
  }
}`}
        />
        <ul>
          <li>A <strong>query</strong> reads; a <strong>mutation</strong> writes, and also returns fields you choose.</li>
          <li>
            Pass values as <strong>variables</strong> (<code>$id</code>, sent separately as JSON), never by building the
            query string, for the same reason you don&apos;t build SQL strings.
          </li>
        </ul>

        <h4 className="topic">C.3 Resolvers: where the data comes from</h4>
        <svg viewBox="0 0 640 210" role="img" aria-label="A query tree. customer is resolved by calling Users. Its orders field calls Orders. Each order's shipment calls Shipping, and each item's product calls Catalog. customer's reviews field calls the Reviews service.">
          <Box x={10} y={85} w={110} h={40} kind="primary" label="customer" sub="→ Users" size={11} />
          <Box x={170} y={30} w={110} h={40} label="orders" sub="→ Orders" size={11} />
          <Box x={170} y={145} w={110} h={40} label="reviews" sub="→ Reviews" size={11} />
          <Box x={330} y={8} w={110} h={40} label="shipment" sub="→ Shipping" size={11} />
          <Box x={330} y={60} w={110} h={40} label="items" sub="(on the order)" size={11} kind="muted" />
          <Box x={490} y={60} w={130} h={40} label="product" sub="→ Catalog" size={11} />
          <Arrow d="M120,100 L168,52" />
          <Arrow d="M120,110 L168,162" />
          <Arrow d="M280,45 L328,30" />
          <Arrow d="M280,55 L328,78" />
          <Arrow d="M440,80 L488,80" />
          <T x={320} y={200}>each field has a resolver; the server only runs the ones the query asked for</T>
        </svg>
        <CodeBlock
          language="typescript"
          code={`const resolvers = {
  Query: {
    customer: (_, { id }) => getJson(\`\${USERS}/users/\${id}\`),
  },
  Customer: {
    orders: (customer, { limit }) =>
      getJson(\`\${ORDERS}/orders?customerId=\${customer.id}&limit=\${limit}\`),
  },
  Order: {
    shipment: (order) => getJson(\`\${SHIPPING}/shipments/\${order.id}\`),
  },
  OrderItem: {
    product: (item) => getJson(\`\${CATALOG}/products/\${item.sku}\`),
  },
};`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>A <strong>resolver</strong> is a function that returns the value of one field.</li>
            <li>
              Its first argument is the <strong>parent</strong> object: <code>Order.shipment</code> receives the order, so
              it knows which id to look up.
            </li>
            <li>
              Fields without a resolver just read the property of the same name (<code>order.total</code>). You only write
              resolvers where data comes from somewhere else.
            </li>
            <li>The server walks the query tree and calls only the resolvers for fields that were asked for.</li>
          </ul>
        </div>

        <h4 className="topic">C.4 How it differs from REST on the wire</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>REST</th>
              <th>GraphQL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Endpoints</td>
              <td>
                One per resource: <code>/orders</code>, <code>/products/:sku</code>
              </td>
              <td>
                One: <code>POST /graphql</code>
              </td>
            </tr>
            <tr>
              <td>HTTP method</td>
              <td>GET / POST / PUT / DELETE carry meaning</td>
              <td>
                Almost always <code>POST</code>
              </td>
            </tr>
            <tr>
              <td>Response shape</td>
              <td>Fixed by the server</td>
              <td>Chosen by the client&apos;s query</td>
            </tr>
            <tr>
              <td>Errors</td>
              <td>Status codes: 400, 404, 500</td>
              <td>
                Usually <code>200</code>, with an <code>errors</code> array next to the data
              </td>
            </tr>
            <tr>
              <td>HTTP caching</td>
              <td>Free: GET + Cache-Control, CDNs</td>
              <td>Not free: every request is a POST to one URL</td>
            </tr>
            <tr>
              <td>Contract</td>
              <td>OpenAPI, if someone writes it</td>
              <td>The schema: required, and clients can read it (introspection)</td>
            </tr>
          </tbody>
        </table>
        <p>
          Asking for an order that doesn&apos;t exist still comes back <code>200 OK</code>:
        </p>
        <CodeBlock
          language="json"
          code={`{
  "errors": [
    {
      "message": "order nope not found",
      "path": ["order"],
      "extensions": { "code": "NOT_FOUND" }
    }
  ],
  "data": { "order": null }
}`}
        />
        <ul>
          <li>A client has to check <code>errors</code> in the body, not just the status code.</li>
          <li>
            One field can fail while the rest still returns data — a <strong>partial success</strong>. REST has no
            equivalent.
          </li>
          <li>Monitoring that only counts 5xx responses will miss GraphQL errors completely.</li>
        </ul>

        <h4 className="topic">C.5 The tools: Apollo Server and Apollo Client</h4>
        <p>GraphQL is a specification, not a library. In JavaScript, the most common pair of libraries comes from Apollo:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Apollo Server</th>
              <th>Apollo Client</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Runs on</td>
              <td>The backend (Node)</td>
              <td>The frontend (React, and others)</td>
            </tr>
            <tr>
              <td>Takes</td>
              <td>Your schema and resolvers</td>
              <td>The queries your components need</td>
            </tr>
            <tr>
              <td>Does</td>
              <td>
                Serves <code>POST /graphql</code>: checks each query against the schema, runs the resolvers, and returns{" "}
                <code>data</code> and <code>errors</code>
              </td>
              <td>Sends the queries, tracks loading and error state, and caches the results</td>
            </tr>
            <tr>
              <td>Extra</td>
              <td>
                In development, opening <code>/graphql</code> in a browser shows <strong>Apollo Sandbox</strong>: write and
                run queries, with autocomplete from the schema
              </td>
              <td>
                The cache is <strong>normalized</strong>: each object is stored once by its id, so the same order shown on
                two screens is fetched once and updates in both
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          code={`// Server: schema + resolvers in, a GraphQL endpoint out.
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
app.use("/graphql", express.json(), expressMiddleware(server));`}
        />
        <CodeBlock
          language="tsx"
          code={`// Client: a component asks for exactly the fields it renders.
const MY_ORDERS = gql\`
  query MyOrders($id: ID!) {
    customer(id: $id) { orders { id total } }
  }
\`;

function MyOrders() {
  const { data, loading, error } = useQuery(MY_ORDERS, { variables: { id: "c-1" } });
  if (loading) return <Spinner />;
  if (error) return <p>Something went wrong.</p>;
  return <OrderList orders={data.customer.orders} />;
}`}
        />
        <p className="callout">
          Neither is required: a GraphQL request is just an HTTP <code>POST</code> with a JSON body, so plain{" "}
          <code>fetch</code> works too. Alternatives exist on both sides (e.g. GraphQL Yoga on the server; Relay or urql on
          the client).
        </p>

        {/* ============================================================ */}
        <h3 className="part">Part D — The hype, and what GraphQL really costs</h3>

        <h4 className="topic">D.1 From &quot;use it everywhere&quot; to &quot;use it where it fits&quot;</h4>
        <ul>
          <li>
            Facebook built GraphQL for a large company&apos;s problem: many teams, many clients, and phones on slow networks.
          </li>
          <li>
            Once it was open-sourced, it became the new thing. Teams adopted it because it was popular, not because they had
            that problem — often as a layer on top of their own internal REST API, translating one to the other and adding
            nothing.
          </li>
          <li>
            After a few years of running it, many teams moved back to REST (with OpenAPI for typed, documented contracts) and
            kept GraphQL only where several clients really did need different views of the same data.
          </li>
        </ul>
        <p className="callout">
          The same cycle as microservices and NoSQL: a big company&apos;s tool for a big company&apos;s problem, copied by
          small teams that didn&apos;t have the problem — and paid for the complexity anyway.
        </p>
        <p>
          The rest of this part is that complexity. Most of it doesn&apos;t exist with REST, and every one of these has to
          be solved before GraphQL is safe in production.
        </p>

        <h4 className="topic">D.2 The N+1 problem, and DataLoader</h4>
        <p>
          A resolver runs once per object. Ask each order for its <code>shipment</code>, and each item for its{" "}
          <em>live</em> <code>product</code> (today&apos;s price and rating, not the snapshot), and a naive server makes one
          call per order and one per item:
        </p>
        <CodeBlock
          language="graphql"
          code={`{
  customer(id: "c-1") {
    orders {
      shipment { status }
      items { name product { price rating } }
    }
  }
}`}
        />
        <CodeBlock
          language="plaintext"
          code={`← POST /graphql
  → users    GET /users/c-1
  → orders   GET /orders?customerId=c-1&limit=4
  → shipping GET /shipments/ord-2004
  → shipping GET /shipments/ord-2003
  → catalog  GET /products/sku-101
  → catalog  GET /products/sku-102
  …            (4 shipping calls and 8 catalog calls: N+1)`}
        />
        <p>
          <strong>DataLoader</strong> collects every key asked for in the same moment, and fetches them in one batch:
        </p>
        <CodeBlock
          language="typescript"
          code={`// Created fresh for EVERY request: one user's cached results must never leak into another's.
const createContext = () => ({
  productLoader: new DataLoader(async (skus) => {
    const products = await getJson(\`\${CATALOG}/products?ids=\${skus.join(",")}\`);
    return skus.map((sku) => products.find((p) => p.sku === sku));
  }),
});

const resolvers = {
  OrderItem: {
    product: (item, _, ctx) => ctx.productLoader.load(item.sku), // queued, then batched
  },
};`}
        />
        <CodeBlock
          language="plaintext"
          code={`← POST /graphql
  → users    GET /users/c-1
  → orders   GET /orders?customerId=c-1&limit=4
  → shipping GET /shipments?orderIds=ord-2004,ord-2003,ord-2002,ord-2001
  → catalog  GET /products?ids=sku-101,sku-102,sku-103,sku-104,sku-105,sku-106,sku-107`}
        />
        <p className="callout">
          The same N+1 shows up against a database: one <code>SELECT … WHERE id = $1</code> per row, until DataLoader turns
          them into one <code>WHERE id IN (…)</code>.
        </p>

        <h4 className="topic">D.3 Unpredictable and malicious queries</h4>
        <ul>
          <li>
            With REST, the backend team decides every query that runs, and indexes the database for them. With GraphQL the
            <strong> client</strong> writes the query, so load patterns can change with any frontend release.
          </li>
          <li>And a client can write a very expensive query on purpose. When types point back at each other, it can nest forever:</li>
        </ul>
        <CodeBlock
          language="graphql"
          code={`{
  product(sku: "sku-101") {
    reviews {
      author {
        reviews {
          product {
            reviews {
              author {
                reviews { title }   # …and so on, 50 levels deep
              }
            }
          }
        }
      }
    }
  }
}`}
        />
        <CodeBlock language="plaintext" code={`'' exceeds maximum operation depth of 6`} />
        <table className="ref-table">
          <thead>
            <tr>
              <th>Attack</th>
              <th>Defence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Very deep nesting (above)</td>
              <td>A depth limit, checked before anything runs</td>
            </tr>
            <tr>
              <td>The same expensive field requested 500 times under different aliases</td>
              <td>A query cost limit: give each field a cost, reject queries over budget</td>
            </tr>
            <tr>
              <td>Huge lists</td>
              <td>
                Require pagination arguments (<code>first: 20</code>) and cap them
              </td>
            </tr>
            <tr>
              <td>Anything the frontend never sends</td>
              <td>
                <strong>Persisted queries</strong>: the server only accepts queries registered ahead of time
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">Plus the usual: timeouts and rate limiting.</p>

        <h4 className="topic">D.4 Everything else it costs</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Cost</th>
              <th>Why it happens</th>
              <th>What teams do about it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No free HTTP caching</td>
              <td>Every request is a <code>POST</code> to one URL, so browsers, proxies, and CDNs can&apos;t cache it</td>
              <td>A client-side cache (e.g. Apollo Client), or persisted queries sent as <code>GET</code></td>
            </tr>
            <tr>
              <td>Authorization per field</td>
              <td>One query can reach public and private data at once; there&apos;s no &quot;this endpoint needs admin&quot;</td>
              <td>Checks in every resolver, or schema-level rules — easy to miss one</td>
            </tr>
            <tr>
              <td>Errors hide behind <code>200</code></td>
              <td>A failed field still returns <code>200 OK</code>, with the failure inside the body</td>
              <td>Monitoring and alerts that read the <code>errors</code> array, not just status codes</td>
            </tr>
            <tr>
              <td>Harder to trace</td>
              <td>One request becomes a tree of resolvers, each calling a different service</td>
              <td>Per-resolver tracing and logging</td>
            </tr>
            <tr>
              <td>Over-fetching moves to the server</td>
              <td>
                The client asks for 3 fields, but a resolver calls a REST service that returns 25 — or loads the whole row
                from the database
              </td>
              <td>Accept it, or teach the services to return less</td>
            </tr>
            <tr>
              <td>The frontend gains, the backend pays</td>
              <td>Frontend teams get flexibility; backend teams inherit the load, the security, and the performance problems</td>
              <td>Clear ownership of the schema, and backend review of new queries</td>
            </tr>
            <tr>
              <td>It grows into one big layer</td>
              <td>Every team adds its types to the same schema; at scale it gets split up again (&quot;federation&quot;)</td>
              <td>Federation (e.g. Apollo Federation) — one more layer to run</td>
            </tr>
            <tr>
              <td>Awkward for some data</td>
              <td>File uploads; trees of unknown depth (every level must be written out in the query)</td>
              <td>Plain REST for files; special handling for deep trees</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          None of these are reasons to never use GraphQL — they&apos;re the price. Pay it only when GraphQL solves a problem
          you actually have.
        </p>

        {/* ============================================================ */}
        <h3 className="part">Part E — When GraphQL genuinely fits</h3>

        <h4 className="topic">E.1 As a BFF for many clients, or many roles</h4>
        <ul>
          <li>
            <strong>Web, mobile, and partner apps</strong> that each need a different slice of the same data — the problem
            GraphQL was built for.
          </li>
          <li>
            <strong>Internal tools used by many roles.</strong> A customer support portal: a front-line agent needs a compact
            view, a billing specialist needs invoices and refunds, a compliance officer needs identity and audit history — all
            of it from different services, about the same customer.
          </li>
          <li>
            <strong>Screens that change often.</strong> When every new view would otherwise mean another custom endpoint,
            each view can ask for its own fields instead.
          </li>
        </ul>
        <p className="callout">
          With one fixed screen, a REST endpoint is still simpler. The case for GraphQL is <em>many</em> different views of
          the same data.
        </p>

        <h4 className="topic">E.2 Services where GraphQL is the natural API</h4>
        <p>
          A few kinds of service are worth building as GraphQL themselves, not just behind a BFF: their data is complicated,
          heavily connected, and every client wants a different part of it.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Its data</th>
              <th>Why GraphQL helps</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Headless CMS</td>
              <td>Pages built from blocks — banners, carousels, articles — each with many optional fields</td>
              <td>The web site, the app, and an email each need a different slice of the same page</td>
            </tr>
            <tr>
              <td>Product catalog management (PIM)</td>
              <td>
                Attributes that differ by category — a laptop has CPU and RAM, a shirt has size and fabric — plus variants and
                translations
              </td>
              <td>The storefront, the admin editor, and marketplace exports each need different fields</td>
            </tr>
            <tr>
              <td>Media library (DAM)</td>
              <td>Images and video, their sizes and crops, alt text, usage rights</td>
              <td>A phone wants a small image, a desktop a large one, the legal team the licence details</td>
            </tr>
            <tr>
              <td>Product compatibility</td>
              <td>A camera → compatible lenses → batteries → replacement parts → …</td>
              <td>Each screen starts at a different product and follows different links</td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="graphql"
          code={`# One query walks the relationships this screen needs, and nothing else.
query CompatibleAccessories($sku: ID!) {
  product(sku: $sku) {
    name
    compatibleProducts(type: LENS) {
      sku
      name
      inStock
    }
    replacementParts { sku name }
  }
}`}
        />
        <p className="callout">
          The common thread: complicated, connected data, and frontends that need to query it flexibly — without a backend
          team building a new endpoint for every new screen.
        </p>

        <h4 className="topic">E.3 REST or GraphQL: when to choose which</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Situation</th>
              <th>Pick</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Calls between services inside the backend</td>
              <td>REST (or gRPC)</td>
              <td>Simple, cacheable, fixed contracts</td>
            </tr>
            <tr>
              <td>A CRUD app with one web client</td>
              <td>REST</td>
              <td>GraphQL adds a server, a schema, and tooling for no gain</td>
            </tr>
            <tr>
              <td>One fixed screen that needs several services</td>
              <td>REST aggregation endpoint</td>
              <td>One round trip, and simpler than GraphQL</td>
            </tr>
            <tr>
              <td>Public, cache-heavy reads (catalog pages behind a CDN)</td>
              <td>REST</td>
              <td>HTTP caching for free</td>
            </tr>
            <tr>
              <td>File upload and download, streaming</td>
              <td>REST</td>
              <td>GraphQL handles binary data poorly</td>
            </tr>
            <tr>
              <td>Web, mobile, and partner apps needing different views of the same data</td>
              <td>GraphQL BFF</td>
              <td>One API, each client asks for its own fields</td>
            </tr>
            <tr>
              <td>An internal portal where many roles need different views</td>
              <td>GraphQL BFF</td>
              <td>No new endpoint per role or per screen</td>
            </tr>
            <tr>
              <td>Complicated, connected data queried many ways (CMS, PIM, DAM)</td>
              <td>GraphQL service</td>
              <td>Flexible queries instead of a growing pile of endpoints</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Default to REST. Reach for GraphQL when many clients keep needing different combinations of the same data — and
          budget for what it costs.
        </p>
      </section>
    </div>
  );
}
