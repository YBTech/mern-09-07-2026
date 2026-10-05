import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Arrow, ArrowDefs, Box, Chip, Exchange, T, type Kind } from "../../components/Diagram";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 18 Notes</title>
      <DayNav day="day18-event-driven-architecture" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 18 · Notes</p>
        <h1>Event-Driven Architecture</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>执行摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 执行摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心要点 — 今天结束后你必须能够做到：</Zh></p>
        <ul>
          <li><En>Explain what synchronous service-to-service calls cost: stacked latency, chained failures, and coupling</En><Zh>解释同步服务间调用的代价：叠加延迟、连锁故障和耦合</Zh></li>
          <li><En>Explain async communication and eventual consistency, and say which calls should stay sync</En><Zh>解释异步通信和最终一致性，并说明哪些调用应保持同步</Zh></li>
          <li><En>Explain a message queue — producer, queue, consumer, ack — and what it buys you</En><Zh>解释消息队列——producer（生产者）、queue（队列）、consumer（消费者）、ack（确认）——及其带来的好处</Zh></li>
          <li><En>Explain why a plain queue can&apos;t fan out, and how an exchange with one queue per subscriber fixes it</En><Zh>解释为什么普通队列无法广播，以及 exchange（交换机）加每个订阅者一个队列如何解决这个问题</Zh></li>
          <li><En>Map RabbitMQ&apos;s queue + exchange onto AWS SQS + SNS</En><Zh>将 RabbitMQ 的 queue + exchange 对应到 AWS SQS + SNS</Zh></li>
          <li><En>Explain how Kafka&apos;s log differs from a queue: retention, offsets, replay, partitions, consumer groups</En><Zh>解释 Kafka 的日志与队列的区别：retention（保留）、offset（偏移量）、replay（回放）、partition（分区）、consumer group（消费者组）</Zh></li>
          <li><En>Explain why duplicate messages are normal, and write an idempotent consumer</En><Zh>解释为什么重复消息是正常的，并编写幂等（idempotent）的消费者</Zh></li>
        </ul>
        <p>
          <En>Want more? <Link to="/week4/day18-event-driven-architecture/concepts">View all concepts?</Link></En>
          <Zh>想深入了解？<Link to="/week4/day18-event-driven-architecture/concepts">查看所有概念</Link></Zh>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

        {/* ============================================================ */}
        <h3 className="part"><En>Part A — Why go async</En><Zh>A 部分 — 为什么要用异步</Zh></h3>

        <h4 className="topic"><En>A.1 Checkout, the synchronous way</En><Zh>A.1 同步方式的结账流程</Zh></h4>
        <p><En>Services talk over HTTP: Orders calls each service it needs, and waits for each answer before the next.</En><Zh>服务之间通过 HTTP 通信：Orders 逐一调用所需的每个服务，等待每个响应后再发起下一个。</Zh></p>
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
        <p className="callout"><En>The customer is waiting on an email server they&apos;ve never heard of.</En><Zh>顾客正在等待一个他们甚至不知道存在的邮件服务器。</Zh></p>

        <h4 className="topic"><En>A.2 Where synchronous calls hurt</En><Zh>A.2 同步调用的痛点</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Pain point</En><Zh>痛点</Zh></th>
              <th><En>What it looks like</En><Zh>具体表现</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Latency adds up</En><Zh>延迟叠加</Zh></td>
              <td><En>The slowest service in the chain sets the checkout time</En><Zh>调用链中最慢的服务决定了结账时间</Zh></td>
            </tr>
            <tr>
              <td><En>Failures chain together</En><Zh>故障连锁</Zh></td>
              <td><En>Notifications is down, so checkout fails — even though the email wasn&apos;t essential</En><Zh>Notifications 宕机，导致结账失败——尽管发邮件并不是必需的</Zh></td>
            </tr>
            <tr>
              <td><En>Uptime multiplies down</En><Zh>可用率相乘下降</Zh></td>
              <td><En>Five services each up 99.9% → the chain is up 99.5%, about 3.6 hours down a month</En><Zh>五个服务各自可用率 99.9% → 整条链路可用率降至 99.5%，每月约宕机 3.6 小时</Zh></td>
            </tr>
            <tr>
              <td><En>Spikes pass straight through</En><Zh>流量峰值直接穿透</Zh></td>
              <td><En>A Black Friday burst hits every downstream service at the same instant</En><Zh>黑色星期五的流量洪峰同时冲击每个下游服务</Zh></td>
            </tr>
            <tr>
              <td><En>The caller knows everyone</En><Zh>调用方与所有服务耦合</Zh></td>
              <td><En>Adding a Loyalty service means editing and redeploying Orders</En><Zh>新增 Loyalty 服务就必须修改并重新部署 Orders</Zh></td>
            </tr>
            <tr>
              <td><En>Retries are ambiguous</En><Zh>重试结果不确定</Zh></td>
              <td><En>A timeout from Payments: did the charge go through or not?</En><Zh>Payments 超时：扣款到底成功了没有？</Zh></td>
            </tr>
          </tbody>
        </table>
        <p><En>One slow service backs up everything in front of it:</En><Zh>一个慢服务会让它前面所有的服务都堵住：</Zh></p>
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
            <li><En>None of this is a bug. It&apos;s the price of <strong>waiting for an answer you didn&apos;t need</strong>.</En><Zh>这些都不是 bug，而是<strong>等待一个本不需要的回应</strong>所付出的代价。</Zh></li>
            <li><En>Orders needs to know the stock is there and the card was charged. It does not need to know the email went out.</En><Zh>Orders 需要知道库存充足、扣款成功，但不需要等邮件是否发出。</Zh></li>
            <li><En>Timeouts and retries soften the damage, but the caller is still coupled to every service it calls.</En><Zh>超时和重试能减轻损失，但调用方仍然与它调用的每个服务耦合在一起。</Zh></li>
          </ul>
        </div>

        <h4 className="topic"><En>A.3 The alternative: async and eventual consistency</En><Zh>A.3 替代方案：异步与最终一致性</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Phone call (sync)</En><Zh>打电话（同步）</Zh></th>
              <th><En>Text message (async)</En><Zh>发短信（异步）</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Both sides available at once?</En><Zh>双方需同时在线？</Zh></td>
              <td><En>Yes, or it doesn&apos;t happen</En><Zh>是的，否则无法通话</Zh></td>
              <td><En>No — it&apos;s delivered when they&apos;re ready</En><Zh>不——对方就绪时才会收到</Zh></td>
            </tr>
            <tr>
              <td><En>You&apos;re blocked until…</En><Zh>你被阻塞直到……</Zh></td>
              <td><En>The call ends</En><Zh>通话结束</Zh></td>
              <td><En>You hit send</En><Zh>你点击发送</Zh></td>
            </tr>
            <tr>
              <td><En>They&apos;re busy</En><Zh>对方忙碌时</Zh></td>
              <td><En>You get nothing</En><Zh>你什么都得不到</Zh></td>
              <td><En>It waits in their inbox</En><Zh>消息在对方收件箱里等待</Zh></td>
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
          <En>The trade: the whole system becomes correct <em>eventually</em>, not instantly. That&apos;s{" "}
          <strong>eventual consistency</strong>:</En>
          <Zh>代价是：整个系统变为<em>最终</em>一致，而非即时一致。这就是<strong>最终一致性（eventual consistency）</strong>：</Zh>
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
              <th><En>Keep it sync when…</En><Zh>保持同步的场景……</Zh></th>
              <th><En>Make it async when…</En><Zh>改为异步的场景……</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>You need the answer to build your response</En><Zh>你需要对方的回应才能构造自己的响应</Zh></td>
              <td><En>It should happen <em>because</em> this happened</En><Zh>它应该<em>因为</em>这件事而发生</Zh></td>
            </tr>
            <tr>
              <td><En>Price lookup, stock check, card authorization</En><Zh>查询价格、检查库存、授权扣款</Zh></td>
              <td><En>Confirmation email, loyalty points, analytics, search re-index</En><Zh>确认邮件、积分奖励、数据分析、搜索重新索引</Zh></td>
            </tr>
          </tbody>
        </table>
        <p><En>What gets sent is an <strong>event</strong> — a fact about something that already happened:</En><Zh>发送的内容是一个<strong>事件（event）</strong>——关于已经发生的事实：</Zh></p>
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
              <En>An <strong>event</strong> states a fact in the past tense — <code>OrderPlaced</code>. A{" "}
              <strong>command</strong> names a receiver and tells it what to do — <code>SendEmail</code>.</En>
              <Zh><strong>event（事件）</strong>用过去时陈述一个事实——<code>OrderPlaced</code>。<strong>command（命令）</strong>则指定接收方并告知其该做什么——<code>SendEmail</code>。</Zh>
            </li>
            <li><En>Past-tense naming keeps the publisher ignorant of who&apos;s listening. A command-shaped event quietly re-couples the two sides.</En><Zh>用过去时命名让发布者不必知道谁在监听。形如命令的事件会悄悄将两端重新耦合。</Zh></li>
            <li><En>The event carries the data consumers need. Too little and every consumer calls back for details; too much and the contract can&apos;t evolve.</En><Zh>事件携带消费者所需的数据。数据太少，每个消费者都要回调获取详情；数据太多，契约就难以演进。</Zh></li>
          </ul>
        </div>

        {/* ============================================================ */}
        <h3 className="part"><En>Part B — Message queues (RabbitMQ)</En><Zh>B 部分 — 消息队列（RabbitMQ）</Zh></h3>

        <h4 className="topic"><En>B.1 A message queue: the mailbox in the middle</En><Zh>B.1 消息队列：中间的邮箱</Zh></h4>
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
              <th><En>Term</En><Zh>术语</Zh></th>
              <th><En>Meaning</En><Zh>含义</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Producer</td>
              <td><En>Whoever puts a message in</En><Zh>将消息放入队列的一方</Zh></td>
            </tr>
            <tr>
              <td>Queue</td>
              <td><En>A named line of messages, held by the broker (RabbitMQ) until someone takes them</En><Zh>一个有名称的消息队列，由 broker（RabbitMQ）持有，直到有人取走</Zh></td>
            </tr>
            <tr>
              <td>Consumer</td>
              <td><En>Whoever takes a message out and does the work</En><Zh>取出消息并执行任务的一方</Zh></td>
            </tr>
            <tr>
              <td>Ack</td>
              <td><En>The consumer saying &quot;done&quot; — only now is the message deleted</En><Zh>消费者发出"已完成"信号——此时消息才被删除</Zh></td>
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
              <th><En>Situation</En><Zh>情况</Zh></th>
              <th><En>What the queue does</En><Zh>队列的行为</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Consumer is down</En><Zh>消费者宕机</Zh></td>
              <td><En>Messages wait. It catches up when it&apos;s back</En><Zh>消息等待。消费者恢复后继续处理</Zh></td>
            </tr>
            <tr>
              <td><En>Traffic spike</En><Zh>流量峰值</Zh></td>
              <td><En>The queue absorbs it; the consumer works through it at its own pace</En><Zh>队列吸收峰值，消费者按自己的节奏处理</Zh></td>
            </tr>
            <tr>
              <td><En>Consumer too slow</En><Zh>消费者处理太慢</Zh></td>
              <td><En>Start more copies of the consumer (next section)</En><Zh>启动更多消费者副本（见下一节）</Zh></td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic"><En>B.2 More workers on one queue</En><Zh>B.2 一个队列，多个工作者</Zh></h4>
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
          <En><strong>Competing consumers</strong>: each message goes to exactly one copy. That&apos;s how a
          queue scales — and exactly why it can&apos;t fan out.</En>
          <Zh><strong>竞争消费（competing consumers）</strong>：每条消息只发给一个副本。这就是队列的扩展方式——也正因如此，它无法广播。</Zh>
        </p>

        <h4 className="topic"><En>B.3 The limit: one message, one reader</En><Zh>B.3 局限：一条消息，只有一个读取者</Zh></h4>
        <p><En>Inventory, Notifications, and Loyalty all need <em>every</em> <code>OrderPlaced</code>. Put all three on one queue:</En><Zh>Inventory、Notifications 和 Loyalty 都需要收到<em>每一条</em> <code>OrderPlaced</code> 消息。如果把三者都放在同一个队列上：</Zh></p>
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
        <p><En>The tempting fix puts the coupling right back:</En><Zh>看似显而易见的解决方法会重新引入耦合：</Zh></p>
        <CodeBlock
          language="typescript"
          bad={[2, 3, 4]}
          code={`// Orders now has to know every consumer by name.
channel.sendToQueue("inventory", body);
channel.sendToQueue("notifications", body);
channel.sendToQueue("loyalty", body); // …and edit this list for every new team`}
        />

        <h4 className="topic"><En>B.4 Exchanges and fan-out (pub/sub)</En><Zh>B.4 交换机与广播（pub/sub）</Zh></h4>
        <p>
          <En>The fix is one more piece in front of the queues: an <strong>exchange</strong>. Orders publishes
          to the exchange; the exchange copies each message into every queue bound to it.</En>
          <Zh>解决方案是在队列前面加一个组件：<strong>exchange（交换机）</strong>。Orders 发布消息到 exchange，exchange 将每条消息复制到所有与之绑定的队列。</Zh>
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
          <En>The exchange copies messages <strong>between</strong> services. The queue splits them{" "}
          <strong>within</strong> a service. Hold on to that — it comes back with Kafka.</En>
          <Zh>exchange 在服务<strong>之间</strong>复制消息；queue 在服务<strong>内部</strong>分发消息。记住这个区别——Kafka 部分还会用到。</Zh>
        </p>
        <p><En>Orders publishes to the exchange, not to any service:</En><Zh>Orders 只发布到 exchange，不直接面向任何服务：</Zh></p>
        <CodeBlock
          language="typescript"
          code={`await channel.assertExchange("orders", "fanout", { durable: true });

// Orders has no idea who is subscribed: Inventory, Notifications, Loyalty, or nobody.
channel.publish("orders", "", Buffer.from(JSON.stringify(event)), { persistent: true });`}
        />
        <p><En>Each subscriber declares its own queue and binds it to the exchange:</En><Zh>每个订阅方声明自己的队列并绑定到 exchange：</Zh></p>
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
            <li><En>Adding Loyalty tomorrow = one new queue bound to <code>orders</code>. Orders&apos; code doesn&apos;t change, and it isn&apos;t redeployed.</En><Zh>明天新增 Loyalty = 只需绑定一个新队列到 <code>orders</code>。Orders 的代码不用改，也不需要重新部署。</Zh></li>
            <li><En>An exchange <strong>stores nothing</strong>. A message published while no queue is bound is simply dropped.</En><Zh>exchange <strong>不存储任何内容</strong>。若发布消息时没有绑定的队列，消息直接丢弃。</Zh></li>
            <li><En>A queue keeps collecting while its service is down — the messages wait for it, not for the others.</En><Zh>服务宕机时，它对应的队列继续收集消息——消息等待该服务，不影响其他服务。</Zh></li>
          </ul>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Exchange type</En><Zh>交换机类型</Zh></th>
              <th><En>Copies a message to…</En><Zh>将消息复制到……</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>fanout</code>
              </td>
              <td><En>Every bound queue</En><Zh>所有绑定的队列</Zh></td>
            </tr>
            <tr>
              <td>
                <code>direct</code>
              </td>
              <td><En>Queues bound with the exact routing key, e.g. <code>order.placed</code></En><Zh>与精确 routing key 绑定的队列，如 <code>order.placed</code></Zh></td>
            </tr>
            <tr>
              <td>
                <code>topic</code>
              </td>
              <td><En>Queues whose pattern matches, e.g. <code>order.*</code> gets placed, paid, and shipped</En><Zh>模式匹配的队列，如 <code>order.*</code> 匹配 placed、paid、shipped</Zh></td>
            </tr>
          </tbody>
        </table>
        <p>
          <En><code>direct</code> — the publisher tags each message with a <strong>routing key</strong>, and a
          queue is bound to one exact key:</En>
          <Zh><code>direct</code> — 发布者为每条消息附上 <strong>routing key（路由键）</strong>，队列绑定到一个精确的 key：</Zh>
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
        <p>
          <En><code>topic</code> — keys are dot-separated words, and a queue binds to a <strong>pattern</strong>{" "}
          instead:</En>
          <Zh><code>topic</code> — key 是以点分隔的词语，队列绑定的是一个<strong>模式</strong>：</Zh>
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
          <li><En><code>*</code> matches exactly one word, so <code>order.*</code> does not match <code>order.item.added</code></En><Zh><code>*</code> 精确匹配一个词，所以 <code>order.*</code> 不匹配 <code>order.item.added</code></Zh></li>
          <li><En><code>#</code> matches zero or more words, so <code>order.#</code> does</En><Zh><code>#</code> 匹配零个或多个词，所以 <code>order.#</code> 可以匹配</Zh></li>
          <li><En>A <code>fanout</code> exchange ignores the routing key completely, which is why our code passes <code>&quot;&quot;</code></En><Zh><code>fanout</code> 交换机完全忽略 routing key，这就是代码传入 <code>&quot;&quot;</code> 的原因</Zh></li>
        </ul>

        <h4 className="topic"><En>B.5 The same thing on AWS: SQS + SNS</En><Zh>B.5 AWS 上的同等方案：SQS + SNS</Zh></h4>
        <p><En>AWS sells both halves of this pattern as managed services — no broker to run:</En><Zh>AWS 将这一模式的两个组件作为托管服务提供——无需自己运行 broker：</Zh></p>
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
              <td><En>Queue</En><Zh>队列</Zh></td>
              <td>SQS queue</td>
            </tr>
            <tr>
              <td><En>Fanout exchange</En><Zh>Fanout 交换机</Zh></td>
              <td>SNS topic</td>
            </tr>
            <tr>
              <td><En>Binding a queue to an exchange</En><Zh>将队列绑定到交换机</Zh></td>
              <td><En>Subscribing an SQS queue to an SNS topic</En><Zh>将 SQS 队列订阅到 SNS topic</Zh></td>
            </tr>
            <tr>
              <td>
                <code>ack</code>
              </td>
              <td>
                <En><code>DeleteMessage</code> — until then, the message is only hidden for a visibility timeout</En>
                <Zh><code>DeleteMessage</code> — 在此之前，消息仅在可见性超时期间被隐藏</Zh>
              </td>
            </tr>
            <tr>
              <td><En>Dead-letter queue</En><Zh>死信队列</Zh></td>
              <td>SQS redrive policy → a DLQ</td>
            </tr>
            <tr>
              <td><En>You run and patch the broker</En><Zh>你自己运维和修补 broker</Zh></td>
              <td><En>AWS runs it; you pay per request</En><Zh>AWS 运维，按请求付费</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout"><En>&quot;SNS fan-out to SQS&quot; is the same pattern as an exchange with one queue per subscriber, just managed.</En><Zh>"SNS 广播到 SQS"与 exchange 加每个订阅者一个队列的模式完全相同，只是由 AWS 托管。</Zh></p>

        <h4 className="topic"><En>B.6 Where queues run out</En><Zh>B.6 队列的局限</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>How a queue works</En><Zh>队列的工作方式</Zh></th>
              <th><En>What that costs you</En><Zh>带来的代价</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>An acked message is deleted</En><Zh>ack 后消息被删除</Zh></td>
              <td><En>No history. Fix a bug in a consumer and you can&apos;t re-run last week&apos;s orders through it</En><Zh>没有历史记录。修复消费者的 bug 后，无法重跑上周的订单</Zh></td>
            </tr>
            <tr>
              <td><En>A queue only collects from the moment it&apos;s bound</En><Zh>队列只从绑定那一刻起收集消息</Zh></td>
              <td><En>A Fraud service added today can&apos;t learn from last month&apos;s orders</En><Zh>今天新增的 Fraud 服务无法从上个月的订单中学习</Zh></td>
            </tr>
            <tr>
              <td><En>Competing consumers take whatever&apos;s next</En><Zh>竞争消费者取下一条可用消息</Zh></td>
              <td><En>Two events for the same order can be handled out of order</En><Zh>同一订单的两个事件可能被乱序处理</Zh></td>
            </tr>
            <tr>
              <td><En>Every subscriber gets its own copy of every message</En><Zh>每个订阅者都获得每条消息的独立副本</Zh></td>
              <td><En>At millions of events a second and dozens of subscribers, all that copying gets expensive</En><Zh>每秒数百万条事件加上数十个订阅者，大量复制开销变得很大</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout"><En>A queue is a to-do list: once a job is done, it&apos;s crossed off. Some systems need a <em>record</em> instead.</En><Zh>队列是一份待办清单：任务完成就划掉。有些系统需要的是一份<em>记录</em>。</Zh></p>

        {/* ============================================================ */}
        <h3 className="part"><En>Part C — Kafka: a log, not a mailbox</En><Zh>C 部分 — Kafka：日志，而非邮箱</Zh></h3>

        <h4 className="topic"><En>C.1 A different model, not an upgrade</En><Zh>C.1 不同的模型，而非升级版</Zh></h4>
        <ul>
          <li><En><strong>A mailbox</strong> (a queue): once you take a letter out, it&apos;s gone from the box.</En><Zh><strong>邮箱</strong>（队列）：取出信件后，信件就从箱子里消失了。</Zh></li>
          <li><En><strong>A group chat&apos;s history</strong> (Kafka): nothing is removed when read — each reader just remembers how far they&apos;ve scrolled.</En><Zh><strong>群聊记录</strong>（Kafka）：读取后内容不删除——每个读者只记住自己滚动到哪里了。</Zh></li>
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
              <td><En>Mental model</En><Zh>概念模型</Zh></td>
              <td><En>Mailbox / to-do list</En><Zh>邮箱 / 待办清单</Zh></td>
              <td><En>Log / ledger</En><Zh>日志 / 账本</Zh></td>
            </tr>
            <tr>
              <td><En>After a message is read</En><Zh>消息被读取后</Zh></td>
              <td><En>Deleted</En><Zh>删除</Zh></td>
              <td><En>Kept — for a retention period (e.g. 7 days) or forever</En><Zh>保留——在 retention 期内（如 7 天）或永久</Zh></td>
            </tr>
            <tr>
              <td><En>Who tracks progress</En><Zh>谁追踪进度</Zh></td>
              <td><En>The broker, per message</En><Zh>broker，逐条消息追踪</Zh></td>
              <td><En>The consumer group, as one number per partition (the offset)</En><Zh>consumer group，每个 partition 用一个数字追踪（即 offset）</Zh></td>
            </tr>
            <tr>
              <td><En>Delivery</En><Zh>投递方式</Zh></td>
              <td><En>The broker pushes messages to consumers</En><Zh>broker 推送消息给消费者</Zh></td>
              <td><En>Consumers pull from the log</En><Zh>消费者从日志中拉取</Zh></td>
            </tr>
            <tr>
              <td><En>Fan-out</En><Zh>广播</Zh></td>
              <td><En>An exchange copies into one queue per subscriber</En><Zh>exchange 将消息复制到每个订阅者的队列</Zh></td>
              <td><En>Every consumer group reads the same log</En><Zh>每个 consumer group 读取同一份日志</Zh></td>
            </tr>
            <tr>
              <td><En>Replay</En><Zh>回放</Zh></td>
              <td><En>No</En><Zh>不支持</Zh></td>
              <td><En>Yes — move the offset back</En><Zh>支持——将 offset 移回去即可</Zh></td>
            </tr>
            <tr>
              <td><En>Ordering</En><Zh>顺序保证</Zh></td>
              <td><En>Weak once several consumers share a queue</En><Zh>多个消费者共享队列后顺序较弱</Zh></td>
              <td><En>Guaranteed within a partition</En><Zh>在 partition 内保证有序</Zh></td>
            </tr>
            <tr>
              <td><En>Sweet spot</En><Zh>适用场景</Zh></td>
              <td><En>Distributing jobs, commands, moderate volume, flexible routing</En><Zh>分发任务、命令，中等吞吐量，灵活路由</Zh></td>
              <td><En>Event streams, analytics, audit trails, very high throughput</En><Zh>事件流、分析、审计追踪、极高吞吐量</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>On AWS, Kafka is <strong>Amazon MSK</strong> (Managed Streaming for Apache Kafka) — the same Kafka,
          with AWS running the brokers.</En>
          <Zh>在 AWS 上，Kafka 对应 <strong>Amazon MSK</strong>（Managed Streaming for Apache Kafka）——同样的 Kafka，由 AWS 托管 broker。</Zh>
        </p>

        <h4 className="topic"><En>C.2 Topics and partitions</En><Zh>C.2 Topic 与 partition</Zh></h4>
        <ul>
          <li><En>A <strong>topic</strong> is a named log — e.g. <code>orders</code>.</En><Zh><strong>topic</strong> 是一个有名称的日志，如 <code>orders</code>。</Zh></li>
          <li><En>A topic is split into <strong>partitions</strong>: separate logs that can be written and read in parallel.</En><Zh>topic 被分成多个 <strong>partition（分区）</strong>：各自独立的日志，可以并行写入和读取。</Zh></li>
          <li><En>Each message has a <strong>key</strong>. Same key → same partition, every time.</En><Zh>每条消息都有一个 <strong>key</strong>。相同的 key 始终路由到相同的 partition。</Zh></li>
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
          <En>Kafka guarantees order <em>within a partition</em>, never across a whole topic — which is why the
          key matters.</En>
          <Zh>Kafka 保证<em>同一 partition 内</em>的顺序，而非整个 topic 级别——这就是 key 很重要的原因。</Zh>
        </p>

        <h4 className="topic"><En>C.3 Offsets: the bookmark</En><Zh>C.3 Offset：书签</Zh></h4>
        <p>
          <En>Every message in a partition has a position, its <strong>offset</strong>. Each consumer group
          stores one number per partition: the next offset it will read.</En>
          <Zh>partition 中的每条消息都有一个位置，即它的 <strong>offset（偏移量）</strong>。每个 consumer group 为每个 partition 存储一个数字：它下次要读取的 offset。</Zh>
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
          <li><En><strong>Resume</strong> — a consumer crashes, restarts, and picks up at its committed offset. Nothing lost.</En><Zh><strong>恢复</strong>——消费者崩溃后重启，从已提交的 offset 继续。不丢失任何消息。</Zh></li>
          <li><En><strong>Replay</strong> — fix a bug, move the group&apos;s offset back, and re-process history with the fixed code.</En><Zh><strong>回放</strong>——修复 bug 后，将 group 的 offset 移回，用修复后的代码重新处理历史消息。</Zh></li>
          <li><En><strong>Late joiners</strong> — a brand-new group can start at offset 0 and read everything the topic still holds.</En><Zh><strong>后来者</strong>——全新的 consumer group 可以从 offset 0 开始，读取 topic 至今保留的所有内容。</Zh></li>
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
          <En><code>fromBeginning</code> only matters the first time a group ever reads a topic. After that, the
          committed offset decides.</En>
          <Zh><code>fromBeginning</code> 只在 group 第一次读取 topic 时生效。之后由已提交的 offset 决定从哪里读。</Zh>
        </p>

        <h4 className="topic"><En>C.4 Consumer groups: fan-out and scaling in one idea</En><Zh>C.4 Consumer group：广播与扩展合二为一</Zh></h4>
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
            <li><En><strong>Across groups = fan-out.</strong> Each group has its own offsets, so each gets every event — like one queue per subscriber.</En><Zh><strong>跨 group = 广播。</strong>每个 group 有自己的 offset，因此每个 group 都能收到每个事件——类似每个订阅者一个队列。</Zh></li>
            <li><En><strong>Within a group = split the work.</strong> Each partition is owned by exactly one copy — like competing consumers on one queue.</En><Zh><strong>同一 group 内 = 分担工作。</strong>每个 partition 恰好由一个副本负责——类似同一队列上的竞争消费者。</Zh></li>
            <li><En><strong>Partition count caps parallelism.</strong> Three partitions → at most three busy copies per group; a fourth sits idle.</En><Zh><strong>partition 数量限制并行度。</strong>三个 partition → 每个 group 最多三个副本同时工作；第四个副本空闲。</Zh></li>
            <li><En>A copy joining or leaving triggers a <strong>rebalance</strong>: the group hands the partitions out again.</En><Zh>副本加入或离开会触发 <strong>rebalance（再平衡）</strong>：group 重新分配各 partition 的归属。</Zh></li>
          </ul>
        </div>
        <CodeBlock
          language="plaintext"
          code={`🔀 [inventory :4302] I own partitions: orders [0]
🔀 [inventory :4312] I own partitions: orders [2]
🔀 [inventory :4332] I own partitions: orders [1]
🔀 [inventory :4322] I own partitions: none (idle)`}
        />

        <h4 className="topic"><En>C.5 Choosing: a queue or Kafka</En><Zh>C.5 如何选择：队列还是 Kafka</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Scenario</En><Zh>场景</Zh></th>
              <th><En>Pick</En><Zh>选择</Zh></th>
              <th><En>Why</En><Zh>原因</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Send a welcome email after sign-up</En><Zh>注册后发送欢迎邮件</Zh></td>
              <td><En>Queue</En><Zh>队列</Zh></td>
              <td><En>A job to do once; nobody needs it afterwards</En><Zh>只需执行一次，之后无人需要</Zh></td>
            </tr>
            <tr>
              <td><En>Resize every uploaded image</En><Zh>对每张上传图片进行压缩</Zh></td>
              <td><En>Queue</En><Zh>队列</Zh></td>
              <td><En>Spread work across workers</En><Zh>将任务分发给多个工作者</Zh></td>
            </tr>
            <tr>
              <td><En>Several teams react to orders, and new teams keep appearing</En><Zh>多个团队响应订单事件，且团队不断增加</Zh></td>
              <td><En>Either</En><Zh>均可</Zh></td>
              <td><En>Exchange/SNS fan-out handles this at moderate scale</En><Zh>exchange / SNS 广播在中等规模下足够用</Zh></td>
            </tr>
            <tr>
              <td><En>A new service must learn from past orders</En><Zh>新服务需要从历史订单中学习</Zh></td>
              <td>Kafka</td>
              <td><En>Retention + a new group starting at offset 0</En><Zh>retention + 新 group 从 offset 0 开始</Zh></td>
            </tr>
            <tr>
              <td><En>Clickstream analytics, millions of events a second</En><Zh>点击流分析，每秒数百万事件</Zh></td>
              <td>Kafka</td>
              <td><En>Built for throughput; partitions scale out</En><Zh>为高吞吐量而生；partition 可水平扩展</Zh></td>
            </tr>
            <tr>
              <td><En>Audit trail, or re-processing after a bug</En><Zh>审计追踪，或 bug 修复后重新处理</Zh></td>
              <td>Kafka</td>
              <td><En>The log is the history; replay by moving offsets</En><Zh>日志即历史；移动 offset 即可回放</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Most systems start with a queue. Kafka earns its extra operational weight when you need history or
          massive scale. On AWS, besides MSK, there&apos;s <strong>Kinesis</strong> — AWS&apos;s own log-style
          stream.</En>
          <Zh>大多数系统从队列开始。当需要历史记录或超大规模时，Kafka 的额外运维成本才值得付出。AWS 上除 MSK 外，还有 <strong>Kinesis</strong>——AWS 自家的日志流服务。</Zh>
        </p>

        {/* ============================================================ */}
        <hr className="section-divider" />
        <p className="section-label">Advanced</p>
        <p className="section-note"><En>Past today&apos;s bare minimum — what it takes to live with async in production.</En><Zh>超出今天必知范围——在生产环境中与异步系统共存所需掌握的内容。</Zh></p>

        <h3 className="part"><En>Part D — Living with async</En><Zh>D 部分 — 与异步系统共存</Zh></h3>

        <h4 className="topic"><En>D.1 Duplicates are normal: at-least-once delivery</En><Zh>D.1 重复是正常的：至少一次投递</Zh></h4>
        <p>
          <En>A consumer does two things with every message: <strong>the work</strong> (send the email) and{" "}
          <strong>the ack</strong> (tell the broker &quot;done, delete it&quot;). A crash can land between the two —
          so which one goes first?</En>
          <Zh>消费者处理每条消息时做两件事：<strong>执行任务</strong>（发邮件）和<strong>发送 ack</strong>（告知 broker "完成，删除它"）。崩溃可能发生在两者之间——那先做哪个？</Zh>
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
              <th><En>Order</En><Zh>顺序</Zh></th>
              <th><En>A crash in between…</En><Zh>中间崩溃……</Zh></th>
              <th><En>Called</En><Zh>称为</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Work, then ack</En><Zh>先执行，后 ack</Zh></td>
              <td><En>The message comes back and the work runs <strong>twice</strong></En><Zh>消息重新投递，任务执行<strong>两次</strong></Zh></td>
              <td><En>At-least-once</En><Zh>至少一次</Zh></td>
            </tr>
            <tr>
              <td><En>Ack, then work</En><Zh>先 ack，后执行</Zh></td>
              <td><En>The message is gone and the work <strong>never</strong> runs</En><Zh>消息已删除，任务<strong>永远</strong>不会执行</Zh></td>
              <td><En>At-most-once</En><Zh>至多一次</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>Almost every system picks <strong>at-least-once</strong>. A lost message is silent — nobody notices
              the stock was never deducted. A duplicate is something you can guard against in code.</En>
              <Zh>几乎所有系统都选择<strong>至少一次</strong>。丢失的消息是无声的——没人会注意到库存没有被扣减。重复消息则可以在代码中防范。</Zh>
            </li>
            <li>
              <En>So duplicates aren&apos;t a rare bug: crashes, deploys, and network blips all cause redelivery. Every
              consumer has to expect them.</En>
              <Zh>因此重复消息不是罕见的 bug：崩溃、部署和网络抖动都会触发重新投递。每个消费者都必须做好应对准备。</Zh>
            </li>
            <li>
              <En>The guard is making the consumer <strong>idempotent</strong>: handling the same message twice ends in
              the same state as handling it once.</En>
              <Zh>防范方法是让消费者具备<strong>幂等性（idempotent）</strong>：处理同一条消息两次与处理一次结果相同。</Zh>
            </li>
            <li>
              <En>&quot;Exactly-once&quot; exists in Kafka only for Kafka-to-Kafka work. The moment a handler writes to a
              database or sends an email, you&apos;re back to at-least-once.</En>
              <Zh>"精确一次"在 Kafka 中仅适用于 Kafka 到 Kafka 的操作。一旦 handler 写入数据库或发送邮件，就回到了至少一次的语义。</Zh>
            </li>
          </ul>
        </div>
        <p><En>Some work is already safe to repeat; some isn&apos;t:</En><Zh>有些操作天然可以重复，有些则不行：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Safe to repeat — same result the 2nd time</En><Zh>可以重复——第二次结果相同</Zh></th>
              <th><En>Not safe — the 2nd time does it again</En><Zh>不可重复——第二次会再执行一遍</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>SET status = &apos;paid&apos;</code>
              </td>
              <td>
                <En><code>SET qty = qty - 1</code> — stock drops twice</En>
                <Zh><code>SET qty = qty - 1</code> — 库存被扣两次</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <En><code>DELETE</code> a row by its id</En>
                <Zh>按 id <code>DELETE</code> 一行</Zh>
              </td>
              <td>
                <En><code>INSERT</code> a new row — two rows</En>
                <Zh><code>INSERT</code> 新行——会产生两行</Zh>
              </td>
            </tr>
            <tr>
              <td><En>Upsert a row keyed by the order id</En><Zh>以 order id 为键做 upsert</Zh></td>
              <td><En>Send an email, charge a card, add loyalty points</En><Zh>发送邮件、扣款、添加积分</Zh></td>
            </tr>
          </tbody>
        </table>
        <p>
          <En>For the unsafe kind, remember which events you&apos;ve already handled. Every event carries a unique{" "}
          <code>eventId</code>; record it <strong>in the same transaction</strong> as the work:</En>
          <Zh>对于不可重复的操作，需要记录哪些事件已经处理过。每个事件都携带唯一的 <code>eventId</code>；将它与业务操作<strong>放在同一个事务中</strong>记录：</Zh>
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
            <En><strong>Why the event id, not the order id?</strong> <code>OrderPlaced</code> and <code>OrderPaid</code>{" "}
            for the same order are different events, and both must run.</En>
            <Zh><strong>为什么用 event id 而不是 order id？</strong>同一订单的 <code>OrderPlaced</code> 和 <code>OrderPaid</code> 是不同的事件，两者都必须被处理。</Zh>
          </li>
          <li>
            <En><strong>Why one transaction?</strong> Record the id and crash before the work, and the redelivery is
            wrongly skipped. Together, they either both happen or neither does.</En>
            <Zh><strong>为什么用同一个事务？</strong>如果记录了 id 却在执行任务前崩溃，重新投递会被错误地跳过。放在一个事务里，要么都执行，要么都不执行。</Zh>
          </li>
          <li>
            <En><strong>Work outside your database</strong> (an email, a card charge) can&apos;t join that transaction.
            Pass the event id to the provider as an idempotency key — Stripe, for one, answers a repeated key with
            the first result instead of charging again.</En>
            <Zh><strong>数据库之外的操作</strong>（发邮件、扣款）无法加入事务。将 event id 作为幂等键传给服务提供商——Stripe 等服务对相同的幂等键只响应第一次的结果，不会重复扣款。</Zh>
          </li>
        </ul>

        <h4 className="topic"><En>D.2 When a message keeps failing: the dead-letter queue</En><Zh>D.2 消息持续失败时：死信队列</Zh></h4>
        <ul>
          <li><En>A <strong>poison message</strong> — bad JSON, a missing field — fails every time it&apos;s retried.</En><Zh><strong>毒消息（poison message）</strong>——格式错误的 JSON、缺少必需字段——每次重试都会失败。</Zh></li>
          <li><En>Requeued forever, it blocks the queue behind it and burns CPU.</En><Zh>无限重新入队会阻塞后续消息并浪费 CPU。</Zh></li>
          <li><En>Fix: after it fails (or after N retries), move it to a <strong>dead-letter queue</strong> for a human to look at.</En><Zh>解决方案：失败后（或经过 N 次重试后），将其移入<strong>死信队列（dead-letter queue）</strong>，等待人工排查。</Zh></li>
        </ul>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Broker</th>
              <th><En>Dead-letter support</En><Zh>死信队列支持</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RabbitMQ</td>
              <td><En>Built in — declare the queue with a dead-letter exchange, then reject without requeue</En><Zh>内置——声明队列时指定 dead-letter exchange，然后拒绝消息且不重新入队</Zh></td>
            </tr>
            <tr>
              <td>SQS</td>
              <td><En>Built in — a redrive policy moves a message to a DLQ after N failed receives</En><Zh>内置——redrive policy 在 N 次接收失败后将消息移入 DLQ</Zh></td>
            </tr>
            <tr>
              <td>Kafka</td>
              <td>
                <En><strong>Not built in.</strong> Your consumer publishes the bad event to a topic of your own (e.g.{" "}
                <code>orders.dlq</code>) and commits past it</En>
                <Zh><strong>不内置。</strong>由消费者自行将坏消息发布到自定义 topic（如 <code>orders.dlq</code>），然后提交 offset 跳过它</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <p><En>In RabbitMQ:</En><Zh>在 RabbitMQ 中：</Zh></p>
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

        <h4 className="topic"><En>D.3 What async costs you</En><Zh>D.3 异步的代价</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>You gain</En><Zh>收益</Zh></th>
              <th><En>You pay</En><Zh>代价</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Fast responses; one slow service doesn&apos;t slow the rest</En><Zh>响应更快；一个慢服务不会拖慢其他服务</Zh></td>
              <td><En>The UI shows &quot;processing&quot; states — the data is eventually consistent</En><Zh>UI 需要展示"处理中"状态——数据是最终一致的</Zh></td>
            </tr>
            <tr>
              <td><En>New subscribers without touching the publisher</En><Zh>新增订阅者无需修改发布者</Zh></td>
              <td><En>&quot;Who reacts to this event?&quot; is no longer answered by reading one file</En><Zh>"谁响应这个事件？"不再能通过读一个文件来回答</Zh></td>
            </tr>
            <tr>
              <td><En>Bursts are buffered</En><Zh>流量峰值被缓冲</Zh></td>
              <td><En>A broker to run, monitor, and pay for</En><Zh>需要运维、监控并为 broker 付费</Zh></td>
            </tr>
            <tr>
              <td><En>Services fail independently</En><Zh>服务独立失败</Zh></td>
              <td><En>Debugging one request across hops — a correlation ID goes in every message&apos;s headers</En><Zh>跨多个跳点调试一个请求——每条消息的 header 中都需要加入 correlation ID</Zh></td>
            </tr>
            <tr>
              <td><En>Teams deploy independently</En><Zh>团队独立部署</Zh></td>
              <td><En>Event shapes are now contracts; changing one is a versioning problem</En><Zh>事件结构现在是契约；修改契约是一个版本管理问题</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Real systems mix both: sync for questions you need answered, async for facts you&apos;re announcing.</En>
          <Zh>真实系统两者兼用：需要回答的问题用同步，公告已发生事实用异步。</Zh>
        </p>
        <p>
          <En>Going further — the outbox pattern, sagas, consumer lag, and choosing a partition count:{" "}
          <Link to="/additional/backend/event-driven-deep-dive/notes">Event-Driven Deep Dive</Link>.</En>
          <Zh>深入了解——outbox 模式、saga、consumer lag 以及如何选择 partition 数量：
          <Link to="/additional/backend/event-driven-deep-dive/notes">Event-Driven Deep Dive</Link>。</Zh>
        </p>
      </section>
    </div>
  );
}
