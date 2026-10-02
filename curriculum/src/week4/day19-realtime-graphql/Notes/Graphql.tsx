import { Link } from "react-router-dom";
import CodeBlock from "../../../components/CodeBlock";
import DayNav from "../../../components/DayNav";
import { Arrow, ArrowDefs, Box, T } from "../../../components/Diagram";
import { En, Zh } from "../../../components/Lang";
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
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心要点 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心要点</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心内容——今天结束时你需要能做到的：</Zh></p>
        <ul>
          <li><En>Explain why one screen calling several microservices from the browser gets slow — especially on a phone on cellular</En><Zh>解释为什么一个页面从浏览器直接调用多个微服务会很慢——尤其是在手机移动网络上</Zh></li>
          <li><En>Explain over-fetching and under-fetching with a concrete example</En><Zh>用具体例子解释 over-fetching（过度获取）和 under-fetching（获取不足）</Zh></li>
          <li><En>Explain what an aggregation layer (a BFF) does, and why GraphQL is mostly used there</En><Zh>解释聚合层（BFF）的作用，以及为什么 GraphQL 主要用在这里</Zh></li>
          <li><En>Read and write a basic GraphQL schema, query, and mutation, and explain what a resolver is</En><Zh>读写基本的 GraphQL schema、query 和 mutation，并解释 resolver 是什么</Zh></li>
          <li>
            <En>Explain how GraphQL differs from REST on the wire: one <code>POST</code> endpoint, <code>200</code> even with
            errors, no free HTTP caching</En><Zh>解释 GraphQL 与 REST 在网络层面的差异：只有一个 <code>POST</code> 端点，出错时也返回 <code>200</code>，没有免费的 HTTP 缓存</Zh>
          </li>
          <li><En>Explain what GraphQL costs — N+1 resolvers, expensive queries, caching, per-field authorization — and why so many teams walked it back</En><Zh>解释 GraphQL 的代价——N+1 resolver、高消耗查询、缓存、字段级授权——以及为什么很多团队最终放弃了它</Zh></li>
          <li><En>Choose between REST and GraphQL for a given service, and defend it</En><Zh>针对具体场景选择 REST 还是 GraphQL，并能说明理由</Zh></li>
        </ul>
        <p>
          <En>Want more? <Link to="/week4/day19-realtime-graphql/concepts">View all concepts?</Link></En><Zh>想了解更多？<Link to="/week4/day19-realtime-graphql/concepts">查看所有概念？</Link></Zh>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

        {/* ============================================================ */}
        <h3 className="part"><En>Part A — The problem: one page, four REST services</En><Zh>A 部分 — 问题：一个页面，四个 REST 服务</Zh></h3>

        <h4 className="topic"><En>A.1 The &quot;My Account&quot; page</En><Zh>A.1 「我的账户」页面</Zh></h4>
        <p><En>Once a store is split into microservices, a single screen often needs data from several of them:</En><Zh>当商店拆分成微服务后，单个页面往往需要从多个服务中获取数据：</Zh></p>
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
        <p className="callout"><En>Four services own pieces of this one page: Users, Orders, Shipping, and Reviews.</En><Zh>这个页面的数据由四个服务分别提供：Users、Orders、Shipping 和 Reviews。</Zh></p>

        <h4 className="topic"><En>A.2 Calling them all from the browser</En><Zh>A.2 从浏览器直接调用所有服务</Zh></h4>
        <ul>
          <li>
            <En><code>GET /orders?customerId=c-1</code> returns each order <em>with</em> its items, joined inside the Orders
            service&apos;s own database.</En><Zh><code>GET /orders?customerId=c-1</code> 返回每个订单及其商品，数据在 Orders 服务自己的数据库中已完成关联。</Zh>
          </li>
          <li>
            <En>Each item keeps a <strong>snapshot</strong> of the product from checkout (its name, and the price paid), so the
            list needs no call to Catalog.</En><Zh>每件商品保存了结账时的产品<strong>快照</strong>（名称和当时的价格），因此不需要调用 Catalog 服务。</Zh>
          </li>
          <li>
            <En>What Orders can&apos;t join is another service&apos;s data: shipment status lives in Shipping&apos;s database.</En><Zh>Orders 无法关联的是其他服务的数据：物流状态存在 Shipping 服务的数据库里。</Zh>
          </li>
        </ul>
        <p><En>So the browser makes four calls, in two waves. Wave 2 needs the order ids that wave 1 returns:</En><Zh>因此浏览器需要发出四个请求，分两波进行。第二波需要等第一波返回的订单 id：</Zh></p>
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
              <th><En>What hurts</En><Zh>痛点</Zh></th>
              <th><En>Why</En><Zh>原因</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Many round trips</En><Zh>大量往返请求</Zh></td>
              <td><En>Each one crosses the internet: 100–200 ms on a phone, more on a bad network</En><Zh>每次请求都要跨越网络：手机上需要 100–200 ms，网络差时更长</Zh></td>
            </tr>
            <tr>
              <td><En>A waterfall</En><Zh>瀑布式依赖</Zh></td>
              <td><En>Wave 2 can&apos;t start until wave 1 answers, so the delays stack</En><Zh>第二波必须等第一波完成才能开始，延迟叠加</Zh></td>
            </tr>
            <tr>
              <td><En>Every client re-does the work</En><Zh>每个客户端重复相同的工作</Zh></td>
              <td><En>Web, iOS, and Android each write the same four calls and the same stitching code</En><Zh>Web、iOS 和 Android 各自写相同的四个请求和数据拼接代码</Zh></td>
            </tr>
            <tr>
              <td><En>Mobile suffers most</En><Zh>移动端体验最差</Zh></td>
              <td><En>Slow, flaky networks multiply every one of those round trips</En><Zh>慢速、不稳定的网络让每次往返的代价成倍放大</Zh></td>
            </tr>
            <tr>
              <td><En>Internals leak out</En><Zh>内部实现暴露在外</Zh></td>
              <td><En>The browser needs every service&apos;s address, and every service needs CORS and public auth</En><Zh>浏览器需要知道每个服务的地址，每个服务都要处理 CORS 和公开认证</Zh></td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic"><En>A.3 Fine on a laptop, painful on a phone</En><Zh>A.3 笔记本上没问题，手机上很痛苦</Zh></h4>
        <p><En>The same four calls cost very different amounts depending on where the customer is:</En><Zh>同样的四个请求，根据用户所处环境的不同，代价差异巨大：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Laptop on good Wi-Fi</En><Zh>笔记本 + 良好 Wi-Fi</Zh></th>
              <th><En>Phone on cellular</En><Zh>手机 + 移动网络</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>One round trip to the datacenter</En><Zh>到数据中心的一次往返</Zh></td>
              <td>~20 ms</td>
              <td><En>~100–300 ms, and it jumps around</En><Zh>~100–300 ms，且不稳定</Zh></td>
            </tr>
            <tr>
              <td><En>Two waves of calls</En><Zh>两波请求</Zh></td>
              <td><En>~40 ms — nobody notices</En><Zh>~40 ms——无感知</Zh></td>
              <td><En>~300–600 ms — a visible spinner</En><Zh>~300–600 ms——明显的加载转圈</Zh></td>
            </tr>
            <tr>
              <td><En>Data downloaded</En><Zh>下载的数据量</Zh></td>
              <td><En>Plenty of bandwidth</En><Zh>带宽充足</Zh></td>
              <td><En>Metered data plan and battery</En><Zh>流量计费，消耗电量</Zh></td>
            </tr>
            <tr>
              <td><En>What the screen shows</En><Zh>屏幕能展示的内容</Zh></td>
              <td><En>The full page</En><Zh>完整页面</Zh></td>
              <td><En>A small screen: a fraction of the fields</En><Zh>小屏幕：只显示部分字段</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>On a laptop this page is fine as it is. The trouble starts on a slow network with a small screen.</En><Zh>在笔记本上这个页面完全没问题。问题出现在网络慢、屏幕小的时候。</Zh>
        </p>

        <h4 className="topic"><En>A.4 The two core problems: under-fetching and over-fetching</En><Zh>A.4 两个核心问题：under-fetching 与 over-fetching</Zh></h4>
        <p><En>Everything that hurts on the phone comes down to two problems — and they pull in opposite directions:</En><Zh>手机上所有的痛点都归结为两个问题——而且它们的方向相反：</Zh></p>
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
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li>
              <En><strong>Under-fetching</strong> — no single endpoint returns everything the screen needs, so the client makes
              several requests, often in waves. It costs <strong>time</strong>: every request is another trip across a slow
              network.</En><Zh><strong>Under-fetching（获取不足）</strong>——没有一个端点能返回页面所需的全部数据，客户端不得不发出多个请求，往往分多波进行。代价是<strong>时间</strong>：每个请求都是一次跨越慢速网络的往返。</Zh>
            </li>
            <li>
              <En><strong>Over-fetching</strong> — an endpoint returns more than the screen needs. It costs{" "}
              <strong>data</strong>: bandwidth, battery, and time spent downloading fields nobody looks at.</En><Zh><strong>Over-fetching（过度获取）</strong>——端点返回的数据超出页面所需。代价是<strong>流量</strong>：带宽、电量，以及下载无用字段的时间。</Zh>
            </li>
            <li>
              <En>Fixing one with REST tends to cause the other: one big endpoint that returns everything ends under-fetching,
              but over-fetches for every screen that needs less.</En><Zh>用 REST 解决其中一个问题往往会引发另一个：一个返回所有数据的大端点解决了 under-fetching，却对每个只需要部分数据的页面造成 over-fetching。</Zh>
            </li>
          </ul>
        </div>
        <p className="callout">
          <En>GraphQL was designed to fix both at once: <strong>one request</strong> per screen, carrying{" "}
          <strong>exactly the fields</strong> that screen asks for.</En><Zh>GraphQL 的设计目标就是同时解决这两个问题：每个页面<strong>一个请求</strong>，只携带该页面所需的<strong>精确字段</strong>。</Zh>
        </p>

        {/* ============================================================ */}
        <h3 className="part"><En>Part B — The fix: an aggregation layer</En><Zh>B 部分 — 解法：聚合层</Zh></h3>

        <h4 className="topic"><En>B.1 One request in, many requests out</En><Zh>B.1 一个请求进来，多个请求发出去</Zh></h4>
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
          <li><En>It runs next to the services, so its calls to them are almost free.</En><Zh>它与各服务运行在同一数据中心，彼此间的调用几乎没有延迟。</Zh></li>
          <li><En>It makes those calls in parallel wherever it can, and stitches the results together once, for every client.</En><Zh>它尽可能并行发起调用，然后统一拼接结果，供所有客户端使用。</Zh></li>
          <li><En>The services don&apos;t change. They stay plain REST, owned by their own teams.</En><Zh>各服务本身不需要改变，仍然是普通的 REST 服务，由各自的团队维护。</Zh></li>
        </ul>
        <p className="callout">
          <En>You&apos;ll hear this called a <strong>BFF</strong> (&quot;backend for frontend&quot;). Strictly, a BFF is one
          aggregation layer <em>per</em> frontend (a web BFF, a mobile BFF). The general idea is just an aggregation layer.</En><Zh>这种模式通常被称为 <strong>BFF</strong>（"backend for frontend"，前端专用后端）。严格来说，BFF 是每个前端各自独立的聚合层（Web BFF、移动端 BFF）。广义上就是聚合层的概念。</Zh>
        </p>
        <div className="concept">
          <p className="concept-label"><En>Concept — it makes the same calls, so why is it faster?</En><Zh>概念——它发的请求数量相同，为什么更快？</Zh></p>
          <ul>
            <li><En>It doesn&apos;t make fewer calls: the same two waves still happen, because wave 2 still needs the order ids.</En><Zh>请求数量并没有减少：同样的两波请求仍然发生，因为第二波仍然需要第一波的订单 id。</Zh></li>
            <li>
              <En>What changes is <strong>where</strong> they travel. The browser pays for one slow trip across the internet;
              the second wave runs inside the datacenter, where a call takes about a millisecond.</En><Zh>改变的是<strong>请求走的路</strong>。浏览器只需跨越一次慢速网络；第二波请求在数据中心内部完成，每次调用只需约 1 毫秒。</Zh>
            </li>
            <li>
              <En>So the win depends on the client being far away. On a fast local network there&apos;s nothing to win — the
              extra hop through the aggregation layer can even make it slightly slower.</En><Zh>因此收益取决于客户端是否距离遥远。在快速局域网上没有任何优势——多经过一层聚合反而会稍微慢一点。</Zh>
            </li>
          </ul>
        </div>

        <h4 className="topic"><En>B.2 Version 1: a REST aggregation endpoint</En><Zh>B.2 版本一：REST 聚合端点</Zh></h4>
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
        <p><En>It works: one request, ~170 ms. But one endpoint means one fixed response shape:</En><Zh>可以正常运行：一个请求，约 170 ms。但一个端点意味着一种固定的响应结构：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>New need</En><Zh>新需求</Zh></th>
              <th><En>What happens to the REST endpoint</En><Zh>REST 端点的应对方式</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>The mobile app shows half the fields</En><Zh>移动端只显示一半字段</Zh></td>
              <td><En>It downloads all of them anyway (over-fetching), or someone writes <code>/mobile-dashboard</code></En><Zh>依然下载全部字段（over-fetching），或者有人专门写一个 <code>/mobile-dashboard</code></Zh></td>
            </tr>
            <tr>
              <td><En>The order-detail page wants a different mix</En><Zh>订单详情页需要不同的字段组合</Zh></td>
              <td><En>Another endpoint, and another backend release</En><Zh>再加一个端点，再发布一次后端</Zh></td>
            </tr>
            <tr>
              <td><En>The web team adds a field to a card</En><Zh>Web 团队在卡片上新增一个字段</Zh></td>
              <td><En>A backend change, a deploy, and coordination between teams</En><Zh>改后端、发布、跨团队协调</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout"><En>The endpoint count grows with the number of screens and clients.</En><Zh>端点数量随着页面和客户端的增加而不断膨胀。</Zh></p>

        <h4 className="topic"><En>B.3 Version 2: GraphQL as the BFF</En><Zh>B.3 版本二：以 GraphQL 作为 BFF</Zh></h4>
        <p><En>GraphQL was built for exactly this problem:</En><Zh>GraphQL 正是为这个问题而生的：</Zh></p>
        <ul>
          <li>
            <En>Facebook created it in 2012 for its mobile app. Phones on cellular networks were loading the news feed through
            many REST calls, each returning far more than a small screen could show.</En><Zh>Facebook 在 2012 年为其移动应用创建了 GraphQL。当时手机通过移动网络加载 News Feed，需要发起多个 REST 请求，每个返回的数据远超小屏幕能显示的内容。</Zh>
          </li>
          <li>
            <En>Their fix: one endpoint, where the client sends a query describing <strong>exactly</strong> the data the screen
            needs — no extra round trips, no extra fields. Facebook open-sourced it in 2015.</En><Zh>他们的解法：一个端点，客户端发送一个 query 来<strong>精确</strong>描述页面所需的数据——没有多余的往返，没有多余的字段。Facebook 于 2015 年将其开源。</Zh>
          </li>
        </ul>
        <p><En>The same endpoint then serves every screen and every client, each asking for its own shape:</En><Zh>同一个端点服务所有页面和所有客户端，每个客户端请求自己所需的数据结构：</Zh></p>
        <div className="code-compare">
          <div>
            <p className="compare-label"><En>Web dashboard</En><Zh>Web 控制台</Zh></p>
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
            <p className="compare-label"><En>Mobile dashboard</En><Zh>移动端控制台</Zh></p>
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
        <p><En>The same page, loaded the three ways in the lecture demo:</En><Zh>同一个页面，在课堂演示中用三种方式加载的对比：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Requests</En><Zh>请求数</Zh></th>
              <th><En>Downloaded</En><Zh>下载量</Zh></th>
              <th><En>Time</En><Zh>耗时</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Browser calls each service</En><Zh>浏览器直接调用各服务</Zh></td>
              <td>4</td>
              <td>~2.3 KB</td>
              <td><En>~340 ms (two trips)</En><Zh>~340 ms（两波往返）</Zh></td>
            </tr>
            <tr>
              <td><En>REST aggregation endpoint</En><Zh>REST 聚合端点</Zh></td>
              <td>1</td>
              <td><En>~3.1 KB (whole objects, for every client)</En><Zh>~3.1 KB（返回完整对象，所有客户端一样）</Zh></td>
              <td>~170 ms</td>
            </tr>
            <tr>
              <td><En>GraphQL aggregation (web query)</En><Zh>GraphQL 聚合（Web query）</Zh></td>
              <td>1</td>
              <td>~1 KB</td>
              <td>~170 ms</td>
            </tr>
            <tr>
              <td><En>GraphQL aggregation (mobile query)</En><Zh>GraphQL 聚合（移动端 query）</Zh></td>
              <td>1</td>
              <td>~0.65 KB</td>
              <td>~160 ms</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>This is GraphQL&apos;s most common job today: a <strong>BFF in front of REST services</strong>. The services stay
          plain REST; only the layer facing the frontends speaks GraphQL.</En><Zh>这是 GraphQL 目前最常见的用途：<strong>位于 REST 服务前面的 BFF</strong>。各服务保持普通 REST；只有面向前端的那一层才使用 GraphQL。</Zh>
        </p>

        {/* ============================================================ */}
        <h3 className="part"><En>Part C — GraphQL basics</En><Zh>C 部分 — GraphQL 基础</Zh></h3>

        <h4 className="topic"><En>C.1 The schema: the contract</En><Zh>C.1 Schema：数据契约</Zh></h4>
        <p><En>Everything a client can ask for is declared up front, in the schema:</En><Zh>客户端能请求的所有内容都在 schema 中预先声明：</Zh></p>
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
              <th><En>Building block</En><Zh>构成要素</Zh></th>
              <th><En>Meaning</En><Zh>含义</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>type Order {"{ … }"}</code>
              </td>
              <td><En>An object type: a named set of fields</En><Zh>对象类型：一组有名称的字段集合</Zh></td>
            </tr>
            <tr>
              <td><En>Scalars</En><Zh>标量类型</Zh></td>
              <td>
                <En>The leaves: <code>ID</code>, <code>String</code>, <code>Int</code>, <code>Float</code>, <code>Boolean</code>{" "}
                (plus custom ones like <code>DateTime</code>)</En><Zh>叶子节点：<code>ID</code>、<code>String</code>、<code>Int</code>、<code>Float</code>、<code>Boolean</code>（以及自定义类型如 <code>DateTime</code>）</Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>!</code>
              </td>
              <td><En>Non-null: this field always has a value</En><Zh>非空：该字段始终有值</Zh></td>
            </tr>
            <tr>
              <td>
                <code>[Order!]!</code>
              </td>
              <td><En>A list (never null) of orders (never null)</En><Zh>一个非空的订单列表（列表和每个元素都非空）</Zh></td>
            </tr>
            <tr>
              <td>
                <code>enum</code>
              </td>
              <td><En>A field limited to a fixed set of values</En><Zh>枚举：字段值限定在固定集合内</Zh></td>
            </tr>
            <tr>
              <td>
                <code>input</code>
              </td>
              <td><En>A type used only as an argument, e.g. to a mutation</En><Zh>仅用作参数的类型，例如 mutation 的输入参数</Zh></td>
            </tr>
            <tr>
              <td>
                <code>union</code>
              </td>
              <td><En>&quot;One of these types&quot;, e.g. a page block that&apos;s a hero <em>or</em> a carousel</En><Zh>"这些类型之一"，例如页面区块可以是 hero <em>或</em> carousel</Zh></td>
            </tr>
            <tr>
              <td>
                <code>Query</code> / <code>Mutation</code>
              </td>
              <td><En>The entry points: reads, and writes</En><Zh>入口类型：读操作和写操作</Zh></td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic"><En>C.2 Queries and mutations</En><Zh>C.2 Query 与 mutation</Zh></h4>
        <p><En>The response mirrors the query&apos;s shape, field for field:</En><Zh>响应结构与 query 的结构一一对应：</Zh></p>
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
            <p className="compare-label"><En>Response</En><Zh>响应</Zh></p>
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
          <li><En>A <strong>query</strong> reads; a <strong>mutation</strong> writes, and also returns fields you choose.</En><Zh><strong>query</strong> 用于读取；<strong>mutation</strong> 用于写入，同时也可以返回你指定的字段。</Zh></li>
          <li>
            <En>Pass values as <strong>variables</strong> (<code>$id</code>, sent separately as JSON), never by building the
            query string, for the same reason you don&apos;t build SQL strings.</En><Zh>通过<strong>变量</strong>（如 <code>$id</code>，以独立 JSON 发送）传递参数，不要拼接 query 字符串——原因和不拼接 SQL 字符串一样。</Zh>
          </li>
        </ul>

        <h4 className="topic"><En>C.3 Resolvers: where the data comes from</En><Zh>C.3 Resolver：数据从哪里来</Zh></h4>
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
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En>A <strong>resolver</strong> is a function that returns the value of one field.</En><Zh><strong>Resolver</strong> 是一个函数，负责返回某个字段的值。</Zh></li>
            <li>
              <En>Its first argument is the <strong>parent</strong> object: <code>Order.shipment</code> receives the order, so
              it knows which id to look up.</En><Zh>第一个参数是<strong>父对象</strong>：<code>Order.shipment</code> 接收到订单对象，因此知道要查询哪个 id。</Zh>
            </li>
            <li>
              <En>Fields without a resolver just read the property of the same name (<code>order.total</code>). You only write
              resolvers where data comes from somewhere else.</En><Zh>没有 resolver 的字段直接读取同名属性（如 <code>order.total</code>）。只有当数据来自其他地方时，才需要编写 resolver。</Zh>
            </li>
            <li><En>The server walks the query tree and calls only the resolvers for fields that were asked for.</En><Zh>服务器遍历 query 树，只调用被请求字段对应的 resolver。</Zh></li>
          </ul>
        </div>

        <h4 className="topic"><En>C.4 How it differs from REST on the wire</En><Zh>C.4 与 REST 在网络层面的差异</Zh></h4>
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
              <td><En>Endpoints</En><Zh>端点</Zh></td>
              <td>
                <En>One per resource: <code>/orders</code>, <code>/products/:sku</code></En><Zh>每个资源一个：<code>/orders</code>、<code>/products/:sku</code></Zh>
              </td>
              <td>
                <En>One: <code>POST /graphql</code></En><Zh>只有一个：<code>POST /graphql</code></Zh>
              </td>
            </tr>
            <tr>
              <td><En>HTTP method</En><Zh>HTTP 方法</Zh></td>
              <td><En>GET / POST / PUT / DELETE carry meaning</En><Zh>GET / POST / PUT / DELETE 各有语义</Zh></td>
              <td>
                <En>Almost always <code>POST</code></En><Zh>几乎全部使用 <code>POST</code></Zh>
              </td>
            </tr>
            <tr>
              <td><En>Response shape</En><Zh>响应结构</Zh></td>
              <td><En>Fixed by the server</En><Zh>由服务端固定</Zh></td>
              <td><En>Chosen by the client&apos;s query</En><Zh>由客户端 query 决定</Zh></td>
            </tr>
            <tr>
              <td><En>Errors</En><Zh>错误处理</Zh></td>
              <td><En>Status codes: 400, 404, 500</En><Zh>状态码：400、404、500</Zh></td>
              <td>
                <En>Usually <code>200</code>, with an <code>errors</code> array next to the data</En><Zh>通常返回 <code>200</code>，错误放在响应体的 <code>errors</code> 数组中</Zh>
              </td>
            </tr>
            <tr>
              <td><En>HTTP caching</En><Zh>HTTP 缓存</Zh></td>
              <td><En>Free: GET + Cache-Control, CDNs</En><Zh>免费：GET + Cache-Control、CDN</Zh></td>
              <td><En>Not free: every request is a POST to one URL</En><Zh>不免费：所有请求都是 POST 到同一个 URL</Zh></td>
            </tr>
            <tr>
              <td><En>Contract</En><Zh>接口契约</Zh></td>
              <td><En>OpenAPI, if someone writes it</En><Zh>OpenAPI，如果有人写的话</Zh></td>
              <td><En>The schema: required, and clients can read it (introspection)</En><Zh>Schema：强制存在，客户端可以通过内省（introspection）读取</Zh></td>
            </tr>
          </tbody>
        </table>
        <p>
          <En>Asking for an order that doesn&apos;t exist still comes back <code>200 OK</code>:</En><Zh>查询一个不存在的订单，返回的仍然是 <code>200 OK</code>：</Zh>
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
          <li><En>A client has to check <code>errors</code> in the body, not just the status code.</En><Zh>客户端必须检查响应体中的 <code>errors</code>，不能只看状态码。</Zh></li>
          <li>
            <En>One field can fail while the rest still returns data — a <strong>partial success</strong>. REST has no
            equivalent.</En><Zh>某个字段可能失败，而其余字段仍然正常返回——即<strong>部分成功</strong>。REST 没有对应的机制。</Zh>
          </li>
          <li><En>Monitoring that only counts 5xx responses will miss GraphQL errors completely.</En><Zh>只统计 5xx 响应的监控系统会完全漏掉 GraphQL 错误。</Zh></li>
        </ul>

        <h4 className="topic"><En>C.5 The tools: Apollo Server and Apollo Client</En><Zh>C.5 工具：Apollo Server 与 Apollo Client</Zh></h4>
        <p><En>GraphQL is a specification, not a library. In JavaScript, the most common pair of libraries comes from Apollo:</En><Zh>GraphQL 是一套规范，不是一个库。在 JavaScript 生态中，最常用的一对库来自 Apollo：</Zh></p>
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
              <td><En>Runs on</En><Zh>运行在</Zh></td>
              <td><En>The backend (Node)</En><Zh>后端（Node）</Zh></td>
              <td><En>The frontend (React, and others)</En><Zh>前端（React 等）</Zh></td>
            </tr>
            <tr>
              <td><En>Takes</En><Zh>接收</Zh></td>
              <td><En>Your schema and resolvers</En><Zh>你定义的 schema 和 resolver</Zh></td>
              <td><En>The queries your components need</En><Zh>组件所需的 query</Zh></td>
            </tr>
            <tr>
              <td><En>Does</En><Zh>功能</Zh></td>
              <td>
                <En>Serves <code>POST /graphql</code>: checks each query against the schema, runs the resolvers, and returns{" "}
                <code>data</code> and <code>errors</code></En><Zh>提供 <code>POST /graphql</code>：根据 schema 校验每个 query，执行 resolver，返回 <code>data</code> 和 <code>errors</code></Zh>
              </td>
              <td><En>Sends the queries, tracks loading and error state, and caches the results</En><Zh>发送 query，追踪加载和错误状态，缓存结果</Zh></td>
            </tr>
            <tr>
              <td><En>Extra</En><Zh>附加功能</Zh></td>
              <td>
                <En>In development, opening <code>/graphql</code> in a browser shows <strong>Apollo Sandbox</strong>: write and
                run queries, with autocomplete from the schema</En><Zh>开发环境中，在浏览器打开 <code>/graphql</code> 会显示 <strong>Apollo Sandbox</strong>：可以编写并运行 query，支持基于 schema 的自动补全</Zh>
              </td>
              <td>
                <En>The cache is <strong>normalized</strong>: each object is stored once by its id, so the same order shown on
                two screens is fetched once and updates in both</En><Zh>缓存是<strong>规范化</strong>的：每个对象按 id 存储一次，同一个订单在两个页面显示时只获取一次，更新也会同步反映</Zh>
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
          <En>Neither is required: a GraphQL request is just an HTTP <code>POST</code> with a JSON body, so plain{" "}
          <code>fetch</code> works too. Alternatives exist on both sides (e.g. GraphQL Yoga on the server; Relay or urql on
          the client).</En><Zh>两者都不是必须的：GraphQL 请求本质上就是一个携带 JSON 正文的 HTTP <code>POST</code>，普通的 <code>fetch</code> 也能用。两端都有其他可选方案（服务端如 GraphQL Yoga；客户端如 Relay 或 urql）。</Zh>
        </p>

        {/* ============================================================ */}
        <h3 className="part"><En>Part D — The hype, and what GraphQL really costs</En><Zh>D 部分 — 热潮退去后，GraphQL 真正的代价</Zh></h3>

        <h4 className="topic"><En>D.1 From &quot;use it everywhere&quot; to &quot;use it where it fits&quot;</En><Zh>D.1 从"到处用"到"用在合适的地方"</Zh></h4>
        <ul>
          <li>
            <En>Facebook built GraphQL for a large company&apos;s problem: many teams, many clients, and phones on slow networks.</En><Zh>Facebook 创建 GraphQL 是为了解决大公司的问题：多个团队、多个客户端、手机在慢速网络上运行。</Zh>
          </li>
          <li>
            <En>Once it was open-sourced, it became the new thing. Teams adopted it because it was popular, not because they had
            that problem — often as a layer on top of their own internal REST API, translating one to the other and adding
            nothing.</En><Zh>开源之后，它迅速成为新潮流。很多团队采用它是因为它流行，而不是因为真的遇到了那个问题——常常只是在内部 REST API 上套了一层 GraphQL，做了翻译，没有带来任何额外价值。</Zh>
          </li>
          <li>
            <En>After a few years of running it, many teams moved back to REST (with OpenAPI for typed, documented contracts) and
            kept GraphQL only where several clients really did need different views of the same data.</En><Zh>运行几年后，很多团队回归了 REST（配合 OpenAPI 提供类型化的接口文档），只在多个客户端确实需要同一数据的不同视图时才保留 GraphQL。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>The same cycle as microservices and NoSQL: a big company&apos;s tool for a big company&apos;s problem, copied by
          small teams that didn&apos;t have the problem — and paid for the complexity anyway.</En><Zh>这和微服务、NoSQL 的轨迹如出一辙：大公司为大公司的问题打造的工具，被没有那个问题的小团队照搬——却同样承担了全部复杂度。</Zh>
        </p>
        <p>
          <En>The rest of this part is that complexity. Most of it doesn&apos;t exist with REST, and every one of these has to
          be solved before GraphQL is safe in production.</En><Zh>本节剩余部分就是这些复杂度。它们大多在 REST 中不存在，而且每一项都必须在 GraphQL 投入生产前解决。</Zh>
        </p>

        <h4 className="topic"><En>D.2 The N+1 problem, and DataLoader</En><Zh>D.2 N+1 问题与 DataLoader</Zh></h4>
        <p>
          <En>A resolver runs once per object. Ask each order for its <code>shipment</code>, and each item for its{" "}
          <em>live</em> <code>product</code> (today&apos;s price and rating, not the snapshot), and a naive server makes one
          call per order and one per item:</En><Zh>每个对象都会触发一次 resolver。如果每个订单都请求 <code>shipment</code>，每件商品都请求<em>实时</em> <code>product</code>（当前价格和评分，而非快照），一个朴素的服务端就会对每个订单和每件商品各发一次请求：</Zh>
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
          <En><strong>DataLoader</strong> collects every key asked for in the same moment, and fetches them in one batch:</En><Zh><strong>DataLoader</strong> 收集同一时刻所有请求的 key，然后批量获取：</Zh>
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
          <En>The same N+1 shows up against a database: one <code>SELECT … WHERE id = $1</code> per row, until DataLoader turns
          them into one <code>WHERE id IN (…)</code>.</En><Zh>同样的 N+1 问题也会出现在数据库查询中：每行一个 <code>SELECT … WHERE id = $1</code>，直到 DataLoader 将它们合并为一个 <code>WHERE id IN (…)</code>。</Zh>
        </p>

        <h4 className="topic"><En>D.3 Unpredictable and malicious queries</En><Zh>D.3 不可预测的查询和恶意查询</Zh></h4>
        <ul>
          <li>
            <En>With REST, the backend team decides every query that runs, and indexes the database for them. With GraphQL the
            <strong> client</strong> writes the query, so load patterns can change with any frontend release.</En><Zh>REST 下，后端团队决定所有执行的查询，并针对性地建立索引。GraphQL 下，<strong>客户端</strong>编写 query，因此任何前端发布都可能改变负载模式。</Zh>
          </li>
          <li><En>And a client can write a very expensive query on purpose. When types point back at each other, it can nest forever:</En><Zh>客户端还可以故意发出代价极高的 query。当类型相互引用时，查询可以无限嵌套：</Zh></li>
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
              <th><En>Attack</En><Zh>攻击方式</Zh></th>
              <th><En>Defence</En><Zh>防御手段</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Very deep nesting (above)</En><Zh>极深嵌套（如上）</Zh></td>
              <td><En>A depth limit, checked before anything runs</En><Zh>深度限制，在执行任何操作前检查</Zh></td>
            </tr>
            <tr>
              <td><En>The same expensive field requested 500 times under different aliases</En><Zh>同一个高消耗字段用不同别名请求 500 次</Zh></td>
              <td><En>A query cost limit: give each field a cost, reject queries over budget</En><Zh>查询代价限制：给每个字段标注代价，超出预算则拒绝</Zh></td>
            </tr>
            <tr>
              <td><En>Huge lists</En><Zh>超大列表</Zh></td>
              <td>
                <En>Require pagination arguments (<code>first: 20</code>) and cap them</En><Zh>要求传入分页参数（如 <code>first: 20</code>）并设置上限</Zh>
              </td>
            </tr>
            <tr>
              <td><En>Anything the frontend never sends</En><Zh>前端从未发送过的 query</Zh></td>
              <td>
                <En><strong>Persisted queries</strong>: the server only accepts queries registered ahead of time</En><Zh><strong>持久化 query（persisted queries）</strong>：服务端只接受预先注册的 query</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout"><En>Plus the usual: timeouts and rate limiting.</En><Zh>加上常规手段：超时和请求限速。</Zh></p>

        <h4 className="topic"><En>D.4 Everything else it costs</En><Zh>D.4 其他代价</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Cost</En><Zh>代价</Zh></th>
              <th><En>Why it happens</En><Zh>原因</Zh></th>
              <th><En>What teams do about it</En><Zh>团队的应对方式</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>No free HTTP caching</En><Zh>没有免费的 HTTP 缓存</Zh></td>
              <td><En>Every request is a <code>POST</code> to one URL, so browsers, proxies, and CDNs can&apos;t cache it</En><Zh>所有请求都是 <code>POST</code> 到同一个 URL，浏览器、代理和 CDN 无法缓存</Zh></td>
              <td><En>A client-side cache (e.g. Apollo Client), or persisted queries sent as <code>GET</code></En><Zh>客户端缓存（如 Apollo Client），或将持久化 query 通过 <code>GET</code> 发送</Zh></td>
            </tr>
            <tr>
              <td><En>Authorization per field</En><Zh>字段级授权</Zh></td>
              <td><En>One query can reach public and private data at once; there&apos;s no &quot;this endpoint needs admin&quot;</En><Zh>一个 query 可以同时访问公开和私密数据；没有"这个端点需要管理员权限"这种简单规则</Zh></td>
              <td><En>Checks in every resolver, or schema-level rules — easy to miss one</En><Zh>在每个 resolver 中检查，或使用 schema 级规则——容易遗漏</Zh></td>
            </tr>
            <tr>
              <td><En>Errors hide behind <code>200</code></En><Zh>错误隐藏在 <code>200</code> 背后</Zh></td>
              <td><En>A failed field still returns <code>200 OK</code>, with the failure inside the body</En><Zh>字段失败时仍返回 <code>200 OK</code>，错误信息藏在响应体内</Zh></td>
              <td><En>Monitoring and alerts that read the <code>errors</code> array, not just status codes</En><Zh>监控和告警要读取 <code>errors</code> 数组，不能只看状态码</Zh></td>
            </tr>
            <tr>
              <td><En>Harder to trace</En><Zh>链路追踪更难</Zh></td>
              <td><En>One request becomes a tree of resolvers, each calling a different service</En><Zh>一个请求变成一棵 resolver 树，每个节点调用不同的服务</Zh></td>
              <td><En>Per-resolver tracing and logging</En><Zh>对每个 resolver 进行链路追踪和日志记录</Zh></td>
            </tr>
            <tr>
              <td><En>Over-fetching moves to the server</En><Zh>over-fetching 转移到服务端</Zh></td>
              <td>
                <En>The client asks for 3 fields, but a resolver calls a REST service that returns 25 — or loads the whole row
                from the database</En><Zh>客户端只请求 3 个字段，但 resolver 调用的 REST 服务返回了 25 个——或者从数据库加载了整行数据</Zh>
              </td>
              <td><En>Accept it, or teach the services to return less</En><Zh>接受这个现实，或者让服务端返回更少的数据</Zh></td>
            </tr>
            <tr>
              <td><En>The frontend gains, the backend pays</En><Zh>前端得益，后端买单</Zh></td>
              <td><En>Frontend teams get flexibility; backend teams inherit the load, the security, and the performance problems</En><Zh>前端团队获得了灵活性；后端团队承担了性能、安全和负载问题</Zh></td>
              <td><En>Clear ownership of the schema, and backend review of new queries</En><Zh>明确 schema 的归属权，后端对新 query 进行审查</Zh></td>
            </tr>
            <tr>
              <td><En>It grows into one big layer</En><Zh>演变成一个巨大的层</Zh></td>
              <td><En>Every team adds its types to the same schema; at scale it gets split up again (&quot;federation&quot;)</En><Zh>每个团队都往同一个 schema 里添加类型；规模变大后又不得不拆分（"federation"）</Zh></td>
              <td><En>Federation (e.g. Apollo Federation) — one more layer to run</En><Zh>Federation（如 Apollo Federation）——又多了一层需要维护</Zh></td>
            </tr>
            <tr>
              <td><En>Awkward for some data</En><Zh>某些数据场景不适合</Zh></td>
              <td><En>File uploads; trees of unknown depth (every level must be written out in the query)</En><Zh>文件上传；深度未知的树形数据（每一层都必须在 query 中写出来）</Zh></td>
              <td><En>Plain REST for files; special handling for deep trees</En><Zh>文件用普通 REST；深层树结构特殊处理</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>None of these are reasons to never use GraphQL — they&apos;re the price. Pay it only when GraphQL solves a problem
          you actually have.</En><Zh>这些都不是"永远不用 GraphQL"的理由——它们只是代价。只有当 GraphQL 真正解决了你面临的问题时，才值得付出这些代价。</Zh>
        </p>

        {/* ============================================================ */}
        <h3 className="part"><En>Part E — When GraphQL genuinely fits</En><Zh>E 部分 — GraphQL 真正适合的场景</Zh></h3>

        <h4 className="topic"><En>E.1 As a BFF for many clients, or many roles</En><Zh>E.1 作为多客户端或多角色的 BFF</Zh></h4>
        <ul>
          <li>
            <En><strong>Web, mobile, and partner apps</strong> that each need a different slice of the same data — the problem
            GraphQL was built for.</En><Zh><strong>Web、移动端和合作伙伴应用</strong>各自需要同一份数据的不同子集——这正是 GraphQL 被创造出来要解决的问题。</Zh>
          </li>
          <li>
            <En><strong>Internal tools used by many roles.</strong> A customer support portal: a front-line agent needs a compact
            view, a billing specialist needs invoices and refunds, a compliance officer needs identity and audit history — all
            of it from different services, about the same customer.</En><Zh><strong>多角色使用的内部工具。</strong>例如客户支持门户：一线客服需要简洁视图，财务专员需要发票和退款信息，合规人员需要身份验证和审计历史——所有数据来自不同服务，但都关于同一个客户。</Zh>
          </li>
          <li>
            <En><strong>Screens that change often.</strong> When every new view would otherwise mean another custom endpoint,
            each view can ask for its own fields instead.</En><Zh><strong>频繁变化的页面。</strong>当每个新视图都需要新建一个专用端点时，GraphQL 让每个视图直接请求自己所需的字段即可。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>With one fixed screen, a REST endpoint is still simpler. The case for GraphQL is <em>many</em> different views of
          the same data.</En><Zh>如果只有一个固定页面，REST 端点仍然更简单。GraphQL 的优势在于对同一份数据有<em>多种</em>不同视图的场景。</Zh>
        </p>

        <h4 className="topic"><En>E.2 Services where GraphQL is the natural API</En><Zh>E.2 GraphQL 天然适合作为 API 的服务类型</Zh></h4>
        <p>
          <En>A few kinds of service are worth building as GraphQL themselves, not just behind a BFF: their data is complicated,
          heavily connected, and every client wants a different part of it.</En><Zh>有几类服务值得直接用 GraphQL 构建，而不只是作为 BFF 背后的一层：它们的数据复杂、关联紧密，且每个客户端都想要其中不同的部分。</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Service</En><Zh>服务类型</Zh></th>
              <th><En>Its data</En><Zh>数据特点</Zh></th>
              <th><En>Why GraphQL helps</En><Zh>为什么 GraphQL 适合</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Headless CMS</En><Zh>无头 CMS</Zh></td>
              <td><En>Pages built from blocks — banners, carousels, articles — each with many optional fields</En><Zh>由区块组成的页面——横幅、轮播、文章——每种区块都有很多可选字段</Zh></td>
              <td><En>The web site, the app, and an email each need a different slice of the same page</En><Zh>网站、App 和邮件各自只需要同一个页面内容的不同子集</Zh></td>
            </tr>
            <tr>
              <td><En>Product catalog management (PIM)</En><Zh>商品信息管理（PIM）</Zh></td>
              <td>
                <En>Attributes that differ by category — a laptop has CPU and RAM, a shirt has size and fabric — plus variants and
                translations</En><Zh>按类别不同的属性——笔记本有 CPU 和内存，衬衫有尺码和面料——加上变体和多语言翻译</Zh>
              </td>
              <td><En>The storefront, the admin editor, and marketplace exports each need different fields</En><Zh>店面、管理员编辑器和市场导出各自需要不同的字段</Zh></td>
            </tr>
            <tr>
              <td><En>Media library (DAM)</En><Zh>媒体库（DAM）</Zh></td>
              <td><En>Images and video, their sizes and crops, alt text, usage rights</En><Zh>图片和视频、尺寸和裁切、替代文本、使用授权</Zh></td>
              <td><En>A phone wants a small image, a desktop a large one, the legal team the licence details</En><Zh>手机需要小图，桌面端需要大图，法务团队需要授权详情</Zh></td>
            </tr>
            <tr>
              <td><En>Product compatibility</En><Zh>产品兼容性查询</Zh></td>
              <td><En>A camera → compatible lenses → batteries → replacement parts → …</En><Zh>相机 → 兼容镜头 → 电池 → 备用零件 → ……</Zh></td>
              <td><En>Each screen starts at a different product and follows different links</En><Zh>每个页面从不同产品出发，沿着不同的关系链查询</Zh></td>
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
          <En>The common thread: complicated, connected data, and frontends that need to query it flexibly — without a backend
          team building a new endpoint for every new screen.</En><Zh>共同特点：复杂、高度关联的数据，以及需要灵活查询的前端——无需后端团队为每个新页面构建新端点。</Zh>
        </p>

        <h4 className="topic"><En>E.3 REST or GraphQL: when to choose which</En><Zh>E.3 REST 还是 GraphQL：何时选哪个</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Situation</En><Zh>场景</Zh></th>
              <th><En>Pick</En><Zh>选择</Zh></th>
              <th><En>Why</En><Zh>原因</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Calls between services inside the backend</En><Zh>后端服务间调用</Zh></td>
              <td>REST (or gRPC)</td>
              <td><En>Simple, cacheable, fixed contracts</En><Zh>简单、可缓存、契约固定</Zh></td>
            </tr>
            <tr>
              <td><En>A CRUD app with one web client</En><Zh>只有一个 Web 客户端的 CRUD 应用</Zh></td>
              <td>REST</td>
              <td><En>GraphQL adds a server, a schema, and tooling for no gain</En><Zh>GraphQL 增加了服务端、schema 和工具链，却没有任何收益</Zh></td>
            </tr>
            <tr>
              <td><En>One fixed screen that needs several services</En><Zh>一个固定页面需要多个服务的数据</Zh></td>
              <td><En>REST aggregation endpoint</En><Zh>REST 聚合端点</Zh></td>
              <td><En>One round trip, and simpler than GraphQL</En><Zh>一次往返，比 GraphQL 更简单</Zh></td>
            </tr>
            <tr>
              <td><En>Public, cache-heavy reads (catalog pages behind a CDN)</En><Zh>公开的、高缓存读取（CDN 后的目录页面）</Zh></td>
              <td>REST</td>
              <td><En>HTTP caching for free</En><Zh>免费的 HTTP 缓存</Zh></td>
            </tr>
            <tr>
              <td><En>File upload and download, streaming</En><Zh>文件上传下载、流式传输</Zh></td>
              <td>REST</td>
              <td><En>GraphQL handles binary data poorly</En><Zh>GraphQL 对二进制数据支持很差</Zh></td>
            </tr>
            <tr>
              <td><En>Web, mobile, and partner apps needing different views of the same data</En><Zh>Web、移动端和合作伙伴应用需要同一数据的不同视图</Zh></td>
              <td>GraphQL BFF</td>
              <td><En>One API, each client asks for its own fields</En><Zh>一个 API，各客户端请求自己需要的字段</Zh></td>
            </tr>
            <tr>
              <td><En>An internal portal where many roles need different views</En><Zh>多角色需要不同视图的内部门户</Zh></td>
              <td>GraphQL BFF</td>
              <td><En>No new endpoint per role or per screen</En><Zh>无需为每个角色或每个页面新建端点</Zh></td>
            </tr>
            <tr>
              <td><En>Complicated, connected data queried many ways (CMS, PIM, DAM)</En><Zh>以多种方式查询的复杂关联数据（CMS、PIM、DAM）</Zh></td>
              <td>GraphQL service</td>
              <td><En>Flexible queries instead of a growing pile of endpoints</En><Zh>灵活查询，不再需要不断堆积端点</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Default to REST. Reach for GraphQL when many clients keep needing different combinations of the same data — and
          budget for what it costs.</En><Zh>默认选 REST。当多个客户端持续需要同一数据的不同组合时，才考虑 GraphQL——并为其代价做好预算。</Zh>
        </p>
      </section>
    </div>
  );
}
