import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Arrow, ArrowDefs, Box, Chip, Exchange, T, type Kind } from "../../components/Diagram";
import { Link } from "react-router-dom";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 18 Notes</title>
      <DayNav day="day18-event-driven-architecture" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 18 · Notes</p>
        <h1>Event-Driven Architecture</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>Explain what synchronous service-to-service calls cost: stacked latency, chained failures, and coupling</li>
          <li>Explain async communication and eventual consistency, and say which calls should stay sync</li>
          <li>Explain a message queue — producer, queue, consumer, ack — and what it buys you</li>
          <li>Explain why a plain queue can&apos;t fan out, and how an exchange with one queue per subscriber fixes it</li>
          <li>Map RabbitMQ&apos;s queue + exchange onto AWS SQS + SNS</li>
          <li>Explain how Kafka&apos;s log differs from a queue: retention, offsets, replay, partitions, consumer groups</li>
          <li>Explain why duplicate messages are normal, and write an idempotent consumer</li>
        </ul>
        <p>
          Want more? <Link to="/week4/day18-event-driven-architecture/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ============================================================ */}
        <h3 className="part">Part A — Why go async</h3>

        <h4 className="topic">A.1 Checkout, the synchronous way</h4>
        <p>Services talk over HTTP: Orders calls each service it needs, and waits for each answer before the next.</p>
        <CodeBlock
          language="typescript"
          code={`// Checkout, synchronous: the customer waits for every call, one after another.
app.post("/orders/sync", async (req, res) => {
  const order = buildOrder(req.body);
  await post(\`\${INVENTORY_URL}/internal/reserve\`, {
    orderId: order.id,
    items: order.items,
  });
  await post(\`\${NOTIFICATIONS_URL}/internal/order-confirmation\`, {
    orderId: order.id,
    customer: order.customer,
  });
  // Loyalty points? A third call right here, and a redeploy of Orders.
  res.status(201).json(order);
});`}
        />
        <svg viewBox="0 0 640 205" role="img" aria-label="A timeline of one checkout. Users 40ms, Catalog 60ms, Inventory 80ms, and Payments 300ms run one after another, then Notifications takes 1,200ms to send an email. The customer waits 1,680ms in total.">
          {[
            ["Users", 20, 130, 12, "40ms"],
            ["Catalog", 50, 142, 17, "60ms"],
            ["Inventory", 80, 159, 23, "80ms"],
            ["Payments", 110, 182, 86, "300ms"],
          ].map(([label, y, x, w, ms]) => (
            <g key={label as string}>
              <T x={118} y={(y as number) + 15} anchor="end" size={11} color="#1c1c1c">{label}</T>
              <rect x={x as number} y={y as number} width={w as number} height="22" rx="3" fill="#eef3ff" stroke="#7ea6e0" />
              <T x={(x as number) + (w as number) + 6} y={(y as number) + 15} anchor="start">{ms}</T>
            </g>
          ))}
          <T x={118} y={155} anchor="end" size={11} color="#1c1c1c">Notifications</T>
          <rect x="268" y="140" width="342" height="22" rx="3" fill="#fdf3f3" stroke="#d98b8b" />
          <T x={439} y={155} color="#1c1c1c">1,200ms — sending an email</T>
          <Arrow d="M130,182 L612,182" />
          <T x={371} y={199} color="#1c1c1c" size={11}>the customer waits this whole time: 1,680ms</T>
        </svg>
        <p className="callout">The customer is waiting on an email server they&apos;ve never heard of.</p>

        <h4 className="topic">A.2 Where synchronous calls hurt</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Pain point</th>
              <th>What it looks like</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Latency adds up</td>
              <td>The slowest service in the chain sets the checkout time</td>
            </tr>
            <tr>
              <td>Failures chain together</td>
              <td>Notifications is down, so checkout fails — even though the email wasn&apos;t essential</td>
            </tr>
            <tr>
              <td>Uptime multiplies down</td>
              <td>Five services each up 99.9% → the chain is up 99.5%, about 3.6 hours down a month</td>
            </tr>
            <tr>
              <td>Spikes pass straight through</td>
              <td>A Black Friday burst hits every downstream service at the same instant</td>
            </tr>
            <tr>
              <td>The caller knows everyone</td>
              <td>Adding a Loyalty service means editing and redeploying Orders</td>
            </tr>
            <tr>
              <td>Retries are ambiguous</td>
              <td>A timeout from Payments: did the charge go through or not?</td>
            </tr>
          </tbody>
        </table>
        <p>One slow service backs up everything in front of it:</p>
        <svg viewBox="0 0 640 140" role="img" aria-label="Browser calls API Gateway, which calls Orders, which calls Notifications. Notifications hangs; Orders' checkouts are stuck waiting on it; the gateway's connections pile up and it returns a 504 timeout; the browser shows a spinner, then an error.">
          <Box x={20} y={30} w={110} h={44} kind="muted" label="Browser" />
          <Box x={175} y={30} w={110} h={44} kind="warn" label="API Gateway" />
          <Box x={330} y={30} w={110} h={44} kind="warn" label="Orders" />
          <Box x={490} y={30} w={130} h={44} kind="fail" label="Notifications" />
          <Arrow d="M130,52 L173,52" ink="red" />
          <Arrow d="M285,52 L328,52" ink="red" />
          <Arrow d="M440,52 L488,52" ink="red" />
          {[152, 307, 465].map((x) => (
            <T key={x} x={x} y={22} size={9} color="#c0392b">waiting…</T>
          ))}
          <T x={75} y={96}>spinner, then</T>
          <T x={75} y={110}>an error page</T>
          <T x={230} y={96}>connections pile up,</T>
          <T x={230} y={110}>then 504 timeout</T>
          <T x={385} y={96}>every checkout</T>
          <T x={385} y={110}>stuck waiting</T>
          <T x={555} y={96} color="#c0392b">email provider</T>
          <T x={555} y={110} color="#c0392b">hangs</T>
        </svg>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>None of this is a bug. It&apos;s the price of <strong>waiting for an answer you didn&apos;t need</strong>.</li>
            <li>Orders needs to know the stock is there and the card was charged. It does not need to know the email went out.</li>
            <li>Timeouts and retries soften the damage, but the caller is still coupled to every service it calls.</li>
          </ul>
        </div>

        <h4 className="topic">A.3 The alternative: async and eventual consistency</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Phone call (sync)</th>
              <th>Text message (async)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Both sides available at once?</td>
              <td>Yes, or it doesn&apos;t happen</td>
              <td>No — it&apos;s delivered when they&apos;re ready</td>
            </tr>
            <tr>
              <td>You&apos;re blocked until…</td>
              <td>The call ends</td>
              <td>You hit send</td>
            </tr>
            <tr>
              <td>They&apos;re busy</td>
              <td>You get nothing</td>
              <td>It waits in their inbox</td>
            </tr>
          </tbody>
        </table>
        <svg viewBox="0 0 640 170" role="img" aria-label="Left: synchronous. Orders sends a request to Notifications and waits for the response before replying. Right: asynchronous. Orders drops a message in a queue and replies 201 right away; Notifications reads the message when it's ready.">
          <T x={160} y={18} size={12} color="#1c1c1c" bold>Sync: call and wait</T>
          <Box x={30} y={55} w={110} h={44} kind="primary" label="Orders" />
          <Box x={190} y={55} w={120} h={44} label="Notifications" />
          <Arrow d="M140,68 L188,68" />
          <Arrow d="M190,88 L142,88" ink="red" />
          <T x={165} y={124} color="#c0392b">…waits for the answer</T>
          <T x={165} y={150}>Orders can&apos;t reply until Notifications does</T>
          <path d="M325,10 L325,160" stroke="#ccc" strokeDasharray="4,4" />
          <T x={490} y={18} size={12} color="#1c1c1c" bold>Async: drop it off, move on</T>
          <Box x={345} y={55} w={80} h={44} kind="primary" label="Orders" />
          <rect x="452" y="59" width="64" height="36" rx="5" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
          <Chip x={458} y={66} w={16} label="" />
          <Chip x={476} y={66} w={16} label="" />
          <Chip x={494} y={66} w={16} label="" />
          <Box x={540} y={55} w={92} h={44} label="Notifications" size={11} />
          <Arrow d="M425,77 L450,77" />
          <Arrow d="M516,77 L538,77" />
          <T x={385} y={124} color="#3d8b40">201 sent right away</T>
          <T x={586} y={124}>reads it when ready</T>
          <T x={484} y={150}>a queue in the middle holds the message</T>
        </svg>
        <p>
          The trade: the whole system becomes correct <em>eventually</em>, not instantly. That&apos;s{" "}
          <strong>eventual consistency</strong>:
        </p>
        <svg viewBox="0 0 640 110" role="img" aria-label="Eventual consistency timeline for one order. At 0 seconds the order is saved; at 0.05 seconds the customer sees Order placed; at 2 seconds the confirmation email arrives; at 5 seconds loyalty points appear.">
          <Arrow d="M30,50 L612,50" />
          {[
            [45, "0s", "order saved"],
            [140, "0.05s", "customer sees"],
            [340, "2s", "email arrives"],
            [560, "5s", "points appear"],
          ].map(([x, t, what]) => (
            <g key={t as string}>
              <circle cx={x as number} cy="50" r="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
              <T x={x as number} y={32} size={11} color="#1c1c1c" bold>{t}</T>
              <T x={x as number} y={76}>{what}</T>
            </g>
          ))}
          <T x={140} y={90}>&quot;Order placed&quot;</T>
        </svg>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Keep it sync when…</th>
              <th>Make it async when…</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>You need the answer to build your response</td>
              <td>It should happen <em>because</em> this happened</td>
            </tr>
            <tr>
              <td>Price lookup, stock check, card authorization</td>
              <td>Confirmation email, loyalty points, analytics, search re-index</td>
            </tr>
          </tbody>
        </table>
        <p>What gets sent is an <strong>event</strong> — a fact about something that already happened:</p>
        <CodeBlock
          language="typescript"
          code={`// A past-tense FACT, not a command like "SendEmail". Orders is announcing
// what happened, not telling anyone what to do about it.
type OrderPlaced = {
  type: "OrderPlaced";
  eventId: string; // unique per event: what a consumer dedupes on
  orderId: string;
  customer: string;
  items: { sku: string; qty: number; price: number }[];
  total: number;
  occurredAt: string;
};`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              An <strong>event</strong> states a fact in the past tense — <code>OrderPlaced</code>. A{" "}
              <strong>command</strong> names a receiver and tells it what to do — <code>SendEmail</code>.
            </li>
            <li>Past-tense naming keeps the publisher ignorant of who&apos;s listening. A command-shaped event quietly re-couples the two sides.</li>
            <li>The event carries the data consumers need. Too little and every consumer calls back for details; too much and the contract can&apos;t evolve.</li>
          </ul>
        </div>

        {/* ============================================================ */}
        <h3 className="part">Part B — Message queues (RabbitMQ)</h3>

        <h4 className="topic">B.1 A message queue: the mailbox in the middle</h4>
        <svg viewBox="0 0 640 170" role="img" aria-label="A producer, Orders, sends messages into a queue holding four messages. The queue delivers them to a consumer, Notifications, which sends an ack back to the queue — only then is the message deleted.">
          <Box x={20} y={55} w={120} h={46} kind="primary" label="Orders" sub="producer" />
          <T x={320} y={42} color="#1c1c1c" bold>queue: notifications.q</T>
          <rect x="230" y="52" width="180" height="52" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
          {[0, 1, 2, 3].map((i) => (
            <Chip key={i} x={244 + i * 40} y={65} w={32} h={26} label={`#${i + 1}`} />
          ))}
          <Box x={500} y={55} w={120} h={46} label="Notifications" sub="consumer" />
          <Arrow d="M140,78 L228,78" />
          <T x={184} y={70}>send</T>
          <Arrow d="M410,78 L498,78" />
          <T x={454} y={70}>deliver</T>
          <Arrow d="M560,101 Q455,152 332,106" ink="green" dashed />
          <T x={455} y={158} color="#3d8b40">ack ✓ — &quot;done, delete it&quot;</T>
        </svg>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Producer</td>
              <td>Whoever puts a message in</td>
            </tr>
            <tr>
              <td>Queue</td>
              <td>A named line of messages, held by the broker (RabbitMQ) until someone takes them</td>
            </tr>
            <tr>
              <td>Consumer</td>
              <td>Whoever takes a message out and does the work</td>
            </tr>
            <tr>
              <td>Ack</td>
              <td>The consumer saying &quot;done&quot; — only now is the message deleted</td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          code={`// send.ts — drop messages into a queue and leave. Nobody has to be listening.
const channel = await connection.createChannel();
await channel.assertQueue("hello", { durable: true }); // create it if it's missing
channel.sendToQueue("hello", Buffer.from("message #1"), { persistent: true });`}
        />
        <CodeBlock
          language="typescript"
          code={`// receive.ts — take messages out, one at a time.
await channel.assertQueue("hello", { durable: true });
await channel.consume("hello", (msg) => {
  if (!msg) return;
  console.log(\`got: \${msg.content.toString()}\`);
  channel.ack(msg); // "done". Only now does RabbitMQ delete the message.
});`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th>Situation</th>
              <th>What the queue does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consumer is down</td>
              <td>Messages wait. It catches up when it&apos;s back</td>
            </tr>
            <tr>
              <td>Traffic spike</td>
              <td>The queue absorbs it; the consumer works through it at its own pace</td>
            </tr>
            <tr>
              <td>Consumer too slow</td>
              <td>Start more copies of the consumer (next section)</td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">B.2 More workers on one queue</h4>
        <svg viewBox="0 0 640 170" role="img" aria-label="One queue holding messages 1 to 6, read by two copies of Notifications. Copy A gets messages 1, 3, and 5; copy B gets 2, 4, and 6.">
          <rect x="40" y="60" width="210" height="50" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <Chip key={n} x={50 + i * 32} y={74} label={String(n)} />
          ))}
          <T x={145} y={50} color="#1c1c1c" bold>notifications.q</T>
          <Box x={440} y={18} w={180} h={46} label="Notifications copy A" sub="gets 1, 3, 5" />
          <Box x={440} y={106} w={180} h={46} label="Notifications copy B" sub="gets 2, 4, 6" />
          <Arrow d="M250,80 Q350,42 438,41" />
          <Arrow d="M250,90 Q350,128 438,129" />
        </svg>
        <p className="callout">
          <strong>Competing consumers</strong>: each message goes to exactly one copy. That&apos;s how a
          queue scales — and exactly why it can&apos;t fan out.
        </p>

        <h4 className="topic">B.3 The limit: one message, one reader</h4>
        <p>Inventory, Notifications, and Loyalty all need <em>every</em> <code>OrderPlaced</code>. Put all three on one queue:</p>
        <svg viewBox="0 0 640 200" role="img" aria-label="Orders sends three orders into one shared queue read by Inventory, Notifications, and Loyalty. Each service gets only one of the three orders: Inventory never hears about orders 2 and 3, so their stock is never deducted.">
          <Box x={20} y={78} w={100} h={44} kind="primary" label="Orders" />
          <rect x="170" y="75" width="150" height="50" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
          {[1, 2, 3].map((n, i) => (
            <Chip key={n} x={190 + i * 40} y={89} w={30} label={`#${n}`} />
          ))}
          <T x={245} y={65} color="#1c1c1c" bold>one shared queue</T>
          <Box x={440} y={12} w={180} h={46} kind="fail" label="Inventory" sub="got order #1 only" />
          <Box x={440} y={77} w={180} h={46} kind="fail" label="Notifications" sub="got order #2 only" />
          <Box x={440} y={142} w={180} h={46} kind="fail" label="Loyalty" sub="got order #3 only" />
          <Arrow d="M120,100 L168,100" />
          <Arrow d="M320,92 Q380,40 438,35" ink="red" />
          <Arrow d="M320,100 L438,100" ink="red" />
          <Arrow d="M320,108 Q380,160 438,165" ink="red" />
        </svg>
        <p>The tempting fix puts the coupling right back:</p>
        <CodeBlock
          language="typescript"
          bad={[2, 3, 4]}
          code={`// Orders now has to know every consumer by name.
channel.sendToQueue("inventory", body);
channel.sendToQueue("notifications", body);
channel.sendToQueue("loyalty", body); // …and edit this list for every new team`}
        />

        <h4 className="topic">B.4 Exchanges and fan-out (pub/sub)</h4>
        <p>
          The fix is one more piece in front of the queues: an <strong>exchange</strong>. Orders publishes
          to the exchange; the exchange copies each message into every queue bound to it.
        </p>
        <svg viewBox="0 0 680 250" role="img" aria-label="Orders publishes to the orders exchange, a fanout. The exchange copies each message into three queues: inventory.q, notifications.q, and loyalty.q. Two copies of Inventory share inventory.q and split its messages. Notifications reads notifications.q. Loyalty, added later, reads loyalty.q.">
          <Box x={10} y={103} w={90} h={44} kind="primary" label="Orders" />
          <Exchange cx={194} cy={125} label="orders" sub="fanout" />
          <Arrow d="M100,125 L148,125" />
          {[
            ["inventory.q", 30],
            ["notifications.q", 107],
            ["loyalty.q", 184],
          ].map(([q, y]) => (
            <g key={q as string}>
              <rect x="300" y={y as number} width="130" height="36" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
              <T x={365} y={(y as number) + 22} size={11} color="#1c1c1c" bold>{q}</T>
            </g>
          ))}
          <Arrow d="M238,122 Q268,50 298,48" ink="orange" />
          <Arrow d="M238,125 L298,125" ink="orange" />
          <Arrow d="M238,128 Q268,200 298,202" ink="orange" />
          <T x={194} y={180} color="#e08a3c">copy to every queue</T>
          <Box x={500} y={6} w={160} h={34} label="Inventory copy 1" size={11} />
          <Box x={500} y={50} w={160} h={34} label="Inventory copy 2" size={11} />
          <Box x={500} y={108} w={160} h={34} label="Notifications" size={11} />
          <Box x={500} y={185} w={160} h={34} label="Loyalty" sub="added later" size={11} dashed />
          <Arrow d="M430,44 Q465,24 498,23" />
          <Arrow d="M430,52 Q465,66 498,67" />
          <Arrow d="M430,125 L498,125" />
          <Arrow d="M430,202 L498,202" />
          <T x={580} y={240}>split between copies of one service</T>
        </svg>
        <p className="callout">
          The exchange copies messages <strong>between</strong> services. The queue splits them{" "}
          <strong>within</strong> a service. Hold on to that — it comes back with Kafka.
        </p>
        <p>Orders publishes to the exchange, not to any service:</p>
        <CodeBlock
          language="typescript"
          code={`await channel.assertExchange("orders", "fanout", { durable: true });

// Orders has no idea who is subscribed: Inventory, Notifications, Loyalty, or nobody.
channel.publish("orders", "", Buffer.from(JSON.stringify(event)), { persistent: true });`}
        />
        <p>Each subscriber declares its own queue and binds it to the exchange:</p>
        <CodeBlock
          language="typescript"
          good={[2]}
          code={`await channel.assertQueue("inventory.q", { durable: true });
await channel.bindQueue("inventory.q", "orders", ""); // copy every order into MY queue

await channel.consume("inventory.q", async (msg) => {
  if (!msg) return;
  const event = JSON.parse(msg.content.toString()) as OrderPlaced;
  reserveStock(event.orderId, event.items);
  channel.ack(msg);
});`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>Adding Loyalty tomorrow = one new queue bound to <code>orders</code>. Orders&apos; code doesn&apos;t change, and it isn&apos;t redeployed.</li>
            <li>An exchange <strong>stores nothing</strong>. A message published while no queue is bound is simply dropped.</li>
            <li>A queue keeps collecting while its service is down — the messages wait for it, not for the others.</li>
          </ul>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Exchange type</th>
              <th>Copies a message to…</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>fanout</code>
              </td>
              <td>Every bound queue</td>
            </tr>
            <tr>
              <td>
                <code>direct</code>
              </td>
              <td>Queues bound with the exact routing key, e.g. <code>order.placed</code></td>
            </tr>
            <tr>
              <td>
                <code>topic</code>
              </td>
              <td>Queues whose pattern matches, e.g. <code>order.*</code> gets placed, paid, and shipped</td>
            </tr>
          </tbody>
        </table>
        <p>
          <code>direct</code> — the publisher tags each message with a <strong>routing key</strong>, and a
          queue is bound to one exact key:
        </p>
        <CodeBlock
          language="typescript"
          code={`await channel.assertExchange("orders", "direct", { durable: true });

// Refunds only cares about cancellations: bind its queue to that one key.
await channel.assertQueue("refunds.q", { durable: true });
await channel.bindQueue("refunds.q", "orders", "order.cancelled");

// Only a message published with exactly this key reaches refunds.q.
channel.publish("orders", "order.cancelled", Buffer.from(JSON.stringify(event)));
channel.publish("orders", "order.placed", Buffer.from(JSON.stringify(event))); // refunds.q never sees this`}
        />
        <svg viewBox="0 0 680 250" role="img" aria-label="Orders publishes a message with routing key order.cancelled to the orders exchange, a direct exchange. Three queues are bound to it, each with one exact key: inventory.q to order.placed, shipping.q to order.paid, and refunds.q to order.cancelled. Only refunds.q matches, so only it receives the message; Refunds reads refunds.q, while Inventory and Shipping get nothing.">
          <Box x={10} y={103} w={90} h={44} kind="primary" label="Orders" />
          <T x={55} y={166}>publishes with key</T>
          <T x={55} y={180} color="#e08a3c" bold>order.cancelled</T>
          <Exchange cx={194} cy={125} label="orders" sub="direct" />
          <Arrow d="M100,125 L148,125" />
          {[
            ["inventory.q", "order.placed", 30],
            ["shipping.q", "order.paid", 107],
            ["refunds.q", "order.cancelled", 184],
          ].map(([q, key, y]) => (
            <g key={q as string}>
              <rect x="300" y={y as number} width="130" height="36" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
              <T x={365} y={(y as number) + 15} size={11} color="#1c1c1c" bold>{q}</T>
              <T x={365} y={(y as number) + 28} size={9}>bound: {key}</T>
            </g>
          ))}
          <Arrow d="M238,122 Q268,50 298,48" dashed />
          <Arrow d="M238,125 L298,125" dashed />
          <Arrow d="M238,128 Q268,200 298,202" ink="orange" />
          <T x={194} y={180} color="#e08a3c">only the exact key matches</T>
          <Box x={500} y={31} w={160} h={34} kind="muted" label="Inventory" sub="gets nothing" size={11} />
          <Box x={500} y={108} w={160} h={34} kind="muted" label="Shipping" sub="gets nothing" size={11} />
          <Box x={500} y={185} w={160} h={34} label="Refunds" size={11} />
          <Arrow d="M430,48 L498,48" />
          <Arrow d="M430,125 L498,125" />
          <Arrow d="M430,202 L498,202" />
          <T x={365} y={240}>dashed = binding exists, but the key doesn't match</T>
        </svg>
        <p>
          <code>topic</code> — keys are dot-separated words, and a queue binds to a <strong>pattern</strong>{" "}
          instead:
        </p>
        <CodeBlock
          language="typescript"
          code={`await channel.assertExchange("orders", "topic", { durable: true });

// Notifications wants every order event; Audit wants everything, whatever the prefix.
await channel.bindQueue("notifications.q", "orders", "order.*"); // order.placed, order.paid, order.shipped
await channel.bindQueue("audit.q", "orders", "#"); // every message

channel.publish("orders", "order.paid", Buffer.from(JSON.stringify(event))); // → notifications.q AND audit.q
channel.publish("orders", "payment.refunded", Buffer.from(JSON.stringify(event))); // → audit.q only`}
        />
        <ul>
          <li><code>*</code> matches exactly one word, so <code>order.*</code> does not match <code>order.item.added</code></li>
          <li><code>#</code> matches zero or more words, so <code>order.#</code> does</li>
          <li>A <code>fanout</code> exchange ignores the routing key completely, which is why our code passes <code>&quot;&quot;</code></li>
        </ul>

        <h4 className="topic">B.5 The same thing on AWS: SQS + SNS</h4>
        <p>AWS sells both halves of this pattern as managed services — no broker to run:</p>
        <svg viewBox="0 0 680 230" role="img" aria-label="Orders publishes to an SNS topic called order-placed. SNS pushes a copy into three SQS queues, one each for Inventory, Notifications, and Loyalty — the same shape as a RabbitMQ fanout exchange with three queues.">
          <Box x={10} y={93} w={90} h={44} kind="primary" label="Orders" />
          <Exchange cx={194} cy={115} label="SNS topic" sub="order-placed" />
          <Arrow d="M100,115 L148,115" />
          {[
            ["SQS: inventory", 20],
            ["SQS: notifications", 97],
            ["SQS: loyalty", 174],
          ].map(([q, y]) => (
            <g key={q as string}>
              <rect x="300" y={y as number} width="140" height="36" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
              <T x={370} y={(y as number) + 22} size={11} color="#1c1c1c" bold>{q}</T>
            </g>
          ))}
          <Arrow d="M238,112 Q268,40 298,38" ink="orange" />
          <Arrow d="M238,115 L298,115" ink="orange" />
          <Arrow d="M238,118 Q268,190 298,192" ink="orange" />
          <Box x={510} y={21} w={150} h={34} label="Inventory" size={11} />
          <Box x={510} y={98} w={150} h={34} label="Notifications" size={11} />
          <Box x={510} y={175} w={150} h={34} label="Loyalty" size={11} />
          <Arrow d="M440,38 L508,38" />
          <Arrow d="M440,115 L508,115" />
          <Arrow d="M440,192 L508,192" />
        </svg>
        <table className="ref-table">
          <thead>
            <tr>
              <th>RabbitMQ</th>
              <th>AWS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Queue</td>
              <td>SQS queue</td>
            </tr>
            <tr>
              <td>Fanout exchange</td>
              <td>SNS topic</td>
            </tr>
            <tr>
              <td>Binding a queue to an exchange</td>
              <td>Subscribing an SQS queue to an SNS topic</td>
            </tr>
            <tr>
              <td>
                <code>ack</code>
              </td>
              <td>
                <code>DeleteMessage</code> — until then, the message is only hidden for a visibility timeout
              </td>
            </tr>
            <tr>
              <td>Dead-letter queue</td>
              <td>SQS redrive policy → a DLQ</td>
            </tr>
            <tr>
              <td>You run and patch the broker</td>
              <td>AWS runs it; you pay per request</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">&quot;SNS fan-out to SQS&quot; is the same pattern as an exchange with one queue per subscriber, just managed.</p>

        <h4 className="topic">B.6 Where queues run out</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>How a queue works</th>
              <th>What that costs you</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>An acked message is deleted</td>
              <td>No history. Fix a bug in a consumer and you can&apos;t re-run last week&apos;s orders through it</td>
            </tr>
            <tr>
              <td>A queue only collects from the moment it&apos;s bound</td>
              <td>A Fraud service added today can&apos;t learn from last month&apos;s orders</td>
            </tr>
            <tr>
              <td>Competing consumers take whatever&apos;s next</td>
              <td>Two events for the same order can be handled out of order</td>
            </tr>
            <tr>
              <td>Every subscriber gets its own copy of every message</td>
              <td>At millions of events a second and dozens of subscribers, all that copying gets expensive</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">A queue is a to-do list: once a job is done, it&apos;s crossed off. Some systems need a <em>record</em> instead.</p>

        {/* ============================================================ */}
        <h3 className="part">Part C — Kafka: a log, not a mailbox</h3>

        <h4 className="topic">C.1 A different model, not an upgrade</h4>
        <ul>
          <li><strong>A mailbox</strong> (a queue): once you take a letter out, it&apos;s gone from the box.</li>
          <li><strong>A group chat&apos;s history</strong> (Kafka): nothing is removed when read — each reader just remembers how far they&apos;ve scrolled.</li>
        </ul>
        <svg viewBox="0 0 640 165" role="img" aria-label="A log of ten events, numbered 0 to 9, with new events appended on the right. Two readers keep their own bookmark: Analytics is at position 3, Notifications at position 7. Nothing is deleted when read.">
          <T x={60} y={38} anchor="start" color="#1c1c1c" bold>the log — new events are appended on the right →</T>
          {Array.from({ length: 10 }, (_, i) => (
            <Chip key={i} x={60 + i * 52} y={52} w={44} h={36} label={String(i)} />
          ))}
          <Arrow d="M235,138 L235,92" ink="dark" />
          <T x={235} y={154} color="#1c1c1c">Analytics is here</T>
          <Arrow d="M443,138 L443,92" ink="dark" />
          <T x={443} y={154} color="#1c1c1c">Notifications is here</T>
          <T x={600} y={112} anchor="end">nothing is deleted when read</T>
        </svg>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>RabbitMQ / SQS</th>
              <th>Kafka</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mental model</td>
              <td>Mailbox / to-do list</td>
              <td>Log / ledger</td>
            </tr>
            <tr>
              <td>After a message is read</td>
              <td>Deleted</td>
              <td>Kept — for a retention period (e.g. 7 days) or forever</td>
            </tr>
            <tr>
              <td>Who tracks progress</td>
              <td>The broker, per message</td>
              <td>The consumer group, as one number per partition (the offset)</td>
            </tr>
            <tr>
              <td>Delivery</td>
              <td>The broker pushes messages to consumers</td>
              <td>Consumers pull from the log</td>
            </tr>
            <tr>
              <td>Fan-out</td>
              <td>An exchange copies into one queue per subscriber</td>
              <td>Every consumer group reads the same log</td>
            </tr>
            <tr>
              <td>Replay</td>
              <td>No</td>
              <td>Yes — move the offset back</td>
            </tr>
            <tr>
              <td>Ordering</td>
              <td>Weak once several consumers share a queue</td>
              <td>Guaranteed within a partition</td>
            </tr>
            <tr>
              <td>Sweet spot</td>
              <td>Distributing jobs, commands, moderate volume, flexible routing</td>
              <td>Event streams, analytics, audit trails, very high throughput</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          On AWS, Kafka is <strong>Amazon MSK</strong> (Managed Streaming for Apache Kafka) — the same Kafka,
          with AWS running the brokers.
        </p>

        <h4 className="topic">C.2 Topics and partitions</h4>
        <ul>
          <li>A <strong>topic</strong> is a named log — e.g. <code>orders</code>.</li>
          <li>A topic is split into <strong>partitions</strong>: separate logs that can be written and read in parallel.</li>
          <li>Each message has a <strong>key</strong>. Same key → same partition, every time.</li>
        </ul>
        <svg viewBox="0 0 640 190" role="img" aria-label="Orders writes events into the orders topic, which has three partitions. The key is the order id: ord-1001's placed, paid, and shipped events all land in partition 0, in order. ord-1004 goes to partition 1, and ord-1002 to partition 2.">
          <Box x={10} y={73} w={96} h={44} kind="primary" label="Orders" />
          <T x={58} y={136} size={9}>key = orderId</T>
          <T x={58} y={149} size={9}>partition = hash(key) % 3</T>
          {[
            ["partition 0", 25, ["1001 placed", "1003 placed", "1001 paid", "1001 shipped"]],
            ["partition 1", 80, ["1004 placed"]],
            ["partition 2", 135, ["1002 placed", "1002 paid"]],
          ].map(([name, y, cells]) => (
            <g key={name as string}>
              <rect x="220" y={y as number} width="410" height="34" rx="4" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
              <T x={230} y={(y as number) + 21} anchor="start" color="#1c1c1c">{name as string}</T>
              {(cells as string[]).map((c, i) => (
                <Chip key={c} x={300 + i * 82} y={(y as number) + 6} w={76} label={c} />
              ))}
            </g>
          ))}
          <Arrow d="M106,90 Q160,45 218,42" />
          <Arrow d="M106,95 L218,97" />
          <Arrow d="M106,100 Q160,150 218,152" />
        </svg>
        <CodeBlock
          language="typescript"
          code={`await producer.send({
  topic: "orders",
  // Same orderId → same partition → placed/paid/shipped can never arrive out of order.
  messages: [{ key: event.orderId, value: JSON.stringify(event) }],
});`}
        />
        <CodeBlock
          language="plaintext"
          code={`key=alice    → partition 0, offset 0
key=dave     → partition 1, offset 0
key=carol    → partition 2, offset 0
key=alice    → partition 0, offset 1     ← same key, same partition; the offset counts up`}
        />
        <p className="callout">
          Kafka guarantees order <em>within a partition</em>, never across a whole topic — which is why the
          key matters.
        </p>

        <h4 className="topic">C.3 Offsets: the bookmark</h4>
        <p>
          Every message in a partition has a position, its <strong>offset</strong>. Each consumer group
          stores one number per partition: the next offset it will read.
        </p>
        <svg viewBox="0 0 640 185" role="img" aria-label="One partition with messages at offsets 0 to 9. Offsets 0 to 5 are shaded as already read by the notifications group, whose committed offset is 6. A dashed arrow from offset 6 back to offset 2 shows a reset: replaying from an earlier point. A brand-new group reading from the beginning starts at offset 0.">
          {Array.from({ length: 10 }, (_, i) => (
            <Chip key={i} x={60 + i * 52} y={70} w={44} h={36} label={String(i)} read={i < 6} />
          ))}
          <Arrow d="M399,150 L399,110" ink="dark" />
          <T x={399} y={166} color="#1c1c1c">notifications group: next = 6</T>
          <T x={399} y={180} size={9}>crash and restart → resumes here</T>
          <Arrow d="M82,150 L82,110" ink="purple" dashed />
          <T x={82} y={166} color="#8e5fd6">a new group</T>
          <T x={82} y={180} size={9} color="#8e5fd6">starts at 0</T>
          <Arrow d="M399,66 Q290,10 183,64" ink="orange" dashed />
          <T x={291} y={24} color="#e08a3c">reset offsets → replay from 2</T>
        </svg>
        <ul>
          <li><strong>Resume</strong> — a consumer crashes, restarts, and picks up at its committed offset. Nothing lost.</li>
          <li><strong>Replay</strong> — fix a bug, move the group&apos;s offset back, and re-process history with the fixed code.</li>
          <li><strong>Late joiners</strong> — a brand-new group can start at offset 0 and read everything the topic still holds.</li>
        </ul>
        <CodeBlock
          language="typescript"
          code={`// Analytics, added months later: its first run starts at the beginning of the log.
const consumer = kafka.consumer({ groupId: "analytics" });
await consumer.subscribe({ topic: "orders", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const event = JSON.parse(message.value!.toString()) as OrderEvent;
    updateTotals(event);
    // Returning without an error commits this offset for the group.
  },
});`}
        />
        <CodeBlock
          language="bash"
          code={`# Replay: rewind the analytics group to the start (its consumers must be stopped first)
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\
  --group analytics --topic orders --reset-offsets --to-earliest --execute`}
        />
        <p className="callout">
          <code>fromBeginning</code> only matters the first time a group ever reads a topic. After that, the
          committed offset decides.
        </p>

        <h4 className="topic">C.4 Consumer groups: fan-out and scaling in one idea</h4>
        <svg viewBox="0 0 680 250" role="img" aria-label="The orders topic has three partitions. On the left, the inventory group has four copies: copies 1 to 3 each own one partition, and copy 4 owns nothing and sits idle. On the right, the notifications group has a single copy that reads all three partitions.">
          <rect x="8" y="8" width="176" height="200" rx="10" fill="none" stroke="#7ea6e0" strokeDasharray="5,4" />
          <T x={96} y={26} color="#1c1c1c" bold>group: inventory</T>
          <Box x={20} y={38} w={150} h={32} label="copy 1" size={11} />
          <Box x={20} y={80} w={150} h={32} label="copy 2" size={11} />
          <Box x={20} y={122} w={150} h={32} label="copy 3" size={11} />
          <Box x={20} y={164} w={150} h={32} kind="muted" label="copy 4 — idle" size={11} dashed />
          {[
            ["partition 0", 40],
            ["partition 1", 82],
            ["partition 2", 124],
          ].map(([p, y]) => (
            <g key={p as string}>
              <rect x="250" y={y as number} width="190" height="30" rx="4" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
              <T x={345} y={(y as number) + 19} color="#1c1c1c">{p}</T>
            </g>
          ))}
          <T x={345} y={30} color="#1c1c1c" bold>topic: orders</T>
          <Arrow d="M248,55 L172,54" ink="purple" />
          <Arrow d="M248,97 L172,96" ink="purple" />
          <Arrow d="M248,139 L172,138" ink="purple" />
          <rect x="492" y="58" width="180" height="92" rx="10" fill="none" stroke="#7ea6e0" strokeDasharray="5,4" />
          <T x={582} y={76} color="#1c1c1c" bold>group: notifications</T>
          <Box x={505} y={88} w={154} h={44} label="copy 1" sub="reads all 3" size={11} />
          <Arrow d="M440,55 Q475,60 503,100" ink="purple" />
          <Arrow d="M440,97 L503,108" ink="purple" />
          <Arrow d="M440,139 Q475,134 503,118" ink="purple" />
          <T x={340} y={232} color="#1c1c1c">within a group: partitions are split  ·  across groups: everyone reads everything</T>
        </svg>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><strong>Across groups = fan-out.</strong> Each group has its own offsets, so each gets every event — like one queue per subscriber.</li>
            <li><strong>Within a group = split the work.</strong> Each partition is owned by exactly one copy — like competing consumers on one queue.</li>
            <li><strong>Partition count caps parallelism.</strong> Three partitions → at most three busy copies per group; a fourth sits idle.</li>
            <li>A copy joining or leaving triggers a <strong>rebalance</strong>: the group hands the partitions out again.</li>
          </ul>
        </div>
        <CodeBlock
          language="plaintext"
          code={`🔀 [inventory :4302] I own partitions: orders [0]
🔀 [inventory :4312] I own partitions: orders [2]
🔀 [inventory :4332] I own partitions: orders [1]
🔀 [inventory :4322] I own partitions: none (idle)`}
        />

        <h4 className="topic">C.5 Choosing: a queue or Kafka</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Pick</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Send a welcome email after sign-up</td>
              <td>Queue</td>
              <td>A job to do once; nobody needs it afterwards</td>
            </tr>
            <tr>
              <td>Resize every uploaded image</td>
              <td>Queue</td>
              <td>Spread work across workers</td>
            </tr>
            <tr>
              <td>Several teams react to orders, and new teams keep appearing</td>
              <td>Either</td>
              <td>Exchange/SNS fan-out handles this at moderate scale</td>
            </tr>
            <tr>
              <td>A new service must learn from past orders</td>
              <td>Kafka</td>
              <td>Retention + a new group starting at offset 0</td>
            </tr>
            <tr>
              <td>Clickstream analytics, millions of events a second</td>
              <td>Kafka</td>
              <td>Built for throughput; partitions scale out</td>
            </tr>
            <tr>
              <td>Audit trail, or re-processing after a bug</td>
              <td>Kafka</td>
              <td>The log is the history; replay by moving offsets</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Most systems start with a queue. Kafka earns its extra operational weight when you need history or
          massive scale. On AWS, besides MSK, there&apos;s <strong>Kinesis</strong> — AWS&apos;s own log-style
          stream.
        </p>

        {/* ============================================================ */}
        <hr className="section-divider" />
        <p className="section-label">Advanced</p>
        <p className="section-note">Past today&apos;s bare minimum — what it takes to live with async in production.</p>

        <h3 className="part">Part D — Living with async</h3>

        <h4 className="topic">D.1 Duplicates are normal: at-least-once delivery</h4>
        <p>
          A consumer does two things with every message: <strong>the work</strong> (send the email) and{" "}
          <strong>the ack</strong> (tell the broker &quot;done, delete it&quot;). A crash can land between the two —
          so which one goes first?
        </p>
        <svg viewBox="0 0 680 235" role="img" aria-label="Two orderings of work and ack, each with a crash in the middle. Work then ack: the email is sent, the consumer crashes before acking, the broker redelivers the message, and the email is sent twice — a duplicate. Ack then work: the message is acked and deleted, the consumer crashes before sending the email, the broker has nothing left to resend, and the email is never sent — lost.">
          <T x={6} y={58} anchor="start" size={12} color="#1c1c1c" bold>Work, then ack</T>
          <T x={6} y={74} anchor="start" color="#3d8b40">at-least-once</T>
          <T x={6} y={168} anchor="start" size={12} color="#1c1c1c" bold>Ack, then work</T>
          <T x={6} y={184} anchor="start" color="#c0392b">at-most-once</T>
          {[
            [40, [
              ["receive", "order #1013", "service"],
              ["send email", "✓ sent", "ok"],
              ["crash", "before the ack", "fail"],
              ["broker", "no ack → resend it", "broker"],
              ["send email", "sent twice: duplicate", "warn"],
            ]],
            [150, [
              ["receive", "order #1013", "service"],
              ["ack", "broker deletes it", "ok"],
              ["crash", "before the email", "fail"],
              ["broker", "nothing to resend", "muted"],
              ["no email", "never sent: lost", "fail"],
            ]],
          ].map(([y, boxes]) => (
            <g key={y as number}>
              {(boxes as string[][]).map(([label, sub, kind], i) => (
                <g key={i}>
                  <Box x={112 + i * 114} y={y as number} w={102} h={50} kind={kind as Kind} label={label} sub={sub} size={11} />
                  {i < 4 && <Arrow d={`M${214 + i * 114},${(y as number) + 25} L${224 + i * 114},${(y as number) + 25}`} />}
                </g>
              ))}
            </g>
          ))}
          <T x={340} y={228}>either way the crash costs something — the only choice is which failure you get</T>
        </svg>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>A crash in between…</th>
              <th>Called</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Work, then ack</td>
              <td>The message comes back and the work runs <strong>twice</strong></td>
              <td>At-least-once</td>
            </tr>
            <tr>
              <td>Ack, then work</td>
              <td>The message is gone and the work <strong>never</strong> runs</td>
              <td>At-most-once</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              Almost every system picks <strong>at-least-once</strong>. A lost message is silent — nobody notices
              the stock was never deducted. A duplicate is something you can guard against in code.
            </li>
            <li>
              So duplicates aren&apos;t a rare bug: crashes, deploys, and network blips all cause redelivery. Every
              consumer has to expect them.
            </li>
            <li>
              The guard is making the consumer <strong>idempotent</strong>: handling the same message twice ends in
              the same state as handling it once.
            </li>
            <li>
              &quot;Exactly-once&quot; exists in Kafka only for Kafka-to-Kafka work. The moment a handler writes to a
              database or sends an email, you&apos;re back to at-least-once.
            </li>
          </ul>
        </div>
        <p>Some work is already safe to repeat; some isn&apos;t:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Safe to repeat — same result the 2nd time</th>
              <th>Not safe — the 2nd time does it again</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>SET status = &apos;paid&apos;</code>
              </td>
              <td>
                <code>SET qty = qty - 1</code> — stock drops twice
              </td>
            </tr>
            <tr>
              <td>
                <code>DELETE</code> a row by its id
              </td>
              <td>
                <code>INSERT</code> a new row — two rows
              </td>
            </tr>
            <tr>
              <td>Upsert a row keyed by the order id</td>
              <td>Send an email, charge a card, add loyalty points</td>
            </tr>
          </tbody>
        </table>
        <p>
          For the unsafe kind, remember which events you&apos;ve already handled. Every event carries a unique{" "}
          <code>eventId</code>; record it <strong>in the same transaction</strong> as the work:
        </p>
        <CodeBlock
          language="typescript"
          code={`// Inventory: "qty = qty - n" is not safe to repeat, so it's guarded by the event id.
export async function handleOrderPlaced(event: OrderPlaced) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // First time for this event? The insert succeeds. A redelivery hits the unique key.
    const { rowCount } = await client.query(
      "INSERT INTO processed_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING",
      [event.eventId]
    );
    if (rowCount === 0) {
      await client.query("ROLLBACK"); // already handled: do nothing
      return;
    }

    for (const item of event.items) {
      await client.query("UPDATE stock SET qty = qty - $1 WHERE sku = $2", [item.qty, item.sku]);
    }

    // The "seen it" row and the stock change land together, or not at all.
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err; // no ack → the broker redelivers, and the retry starts clean
  } finally {
    client.release();
  }
}`}
        />
        <ul>
          <li>
            <strong>Why the event id, not the order id?</strong> <code>OrderPlaced</code> and <code>OrderPaid</code>{" "}
            for the same order are different events, and both must run.
          </li>
          <li>
            <strong>Why one transaction?</strong> Record the id and crash before the work, and the redelivery is
            wrongly skipped. Together, they either both happen or neither does.
          </li>
          <li>
            <strong>Work outside your database</strong> (an email, a card charge) can&apos;t join that transaction.
            Pass the event id to the provider as an idempotency key — Stripe, for one, answers a repeated key with
            the first result instead of charging again.
          </li>
        </ul>

        <h4 className="topic">D.2 When a message keeps failing: the dead-letter queue</h4>
        <ul>
          <li>A <strong>poison message</strong> — bad JSON, a missing field — fails every time it&apos;s retried.</li>
          <li>Requeued forever, it blocks the queue behind it and burns CPU.</li>
          <li>Fix: after it fails (or after N retries), move it to a <strong>dead-letter queue</strong> for a human to look at.</li>
        </ul>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Broker</th>
              <th>Dead-letter support</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RabbitMQ</td>
              <td>Built in — declare the queue with a dead-letter exchange, then reject without requeue</td>
            </tr>
            <tr>
              <td>SQS</td>
              <td>Built in — a redrive policy moves a message to a DLQ after N failed receives</td>
            </tr>
            <tr>
              <td>Kafka</td>
              <td>
                <strong>Not built in.</strong> Your consumer publishes the bad event to a topic of your own (e.g.{" "}
                <code>orders.dlq</code>) and commits past it
              </td>
            </tr>
          </tbody>
        </table>
        <p>In RabbitMQ:</p>
        <CodeBlock
          language="typescript"
          code={`// The queue is declared with a dead-letter exchange…
await channel.assertQueue("notifications.q", {
  durable: true,
  deadLetterExchange: "orders.dlx",
});

// …so rejecting WITHOUT requeue moves the message there instead of looping on it.
try {
  event = JSON.parse(msg.content.toString());
} catch {
  channel.nack(msg, false, false); // (message, allUpTo, requeue = false)
  return;
}`}
        />

        <h4 className="topic">D.3 What async costs you</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>You gain</th>
              <th>You pay</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fast responses; one slow service doesn&apos;t slow the rest</td>
              <td>The UI shows &quot;processing&quot; states — the data is eventually consistent</td>
            </tr>
            <tr>
              <td>New subscribers without touching the publisher</td>
              <td>&quot;Who reacts to this event?&quot; is no longer answered by reading one file</td>
            </tr>
            <tr>
              <td>Bursts are buffered</td>
              <td>A broker to run, monitor, and pay for</td>
            </tr>
            <tr>
              <td>Services fail independently</td>
              <td>Debugging one request across hops — a correlation ID goes in every message&apos;s headers</td>
            </tr>
            <tr>
              <td>Teams deploy independently</td>
              <td>Event shapes are now contracts; changing one is a versioning problem</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Real systems mix both: sync for questions you need answered, async for facts you&apos;re announcing.
        </p>
      </section>
    </div>
  );
}
