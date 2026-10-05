import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 17 Notes</title>
      <DayNav day="day17-microservices" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow"><En>Week 4 · Day 17 · Notes</En><Zh>第四周 · 第十七天 · 笔记</Zh></p>
        <h1><En>Microservices</En><Zh>微服务</Zh></h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>今天必须掌握的核心技能：</Zh></p>
        <ul>
          <li><En>Argue both sides of monolith vs. microservices, and say what actually forces the split</En><Zh>能说清 monolith 与 microservices 各自的优劣，以及真正触发拆分的原因</Zh></li>
          <li><En>List the pain points a monolith hits as its team and codebase grow</En><Zh>列出 monolith 随团队和代码库增长后暴露的痛点</Zh></li>
          <li><En>Define what makes something a microservice, and trace a request from the client through the API Gateway to a service, and between services</En><Zh>定义 microservice 的特征，并能追踪一个请求从客户端经 API Gateway 到服务、再在服务间流转的全过程</Zh></li>
          <li><En>Explain why each service owns its own database, and what you give up by it</En><Zh>解释为什么每个服务要独占自己的数据库，以及这样做的代价</Zh></li>
          <li><En>Say why a real system mixes languages and databases, and what actually drives that choice</En><Zh>说明真实系统为何混用多种语言和数据库，以及驱动这一选择的实际因素</Zh></li>
          <li><En>Describe at a high level what ECS/Fargate and Kubernetes/EKS each do</En><Zh>从高层次描述 ECS/Fargate 和 Kubernetes/EKS 各自的作用</Zh></li>
        </ul>
        <p>
          <En>Want more? <Link to="/week4/day17-microservices/concepts">View all concepts?</Link></En>
          <Zh>想了解更多？<Link to="/week4/day17-microservices/concepts">查看所有概念</Link></Zh>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

        <h3><En>1. The e-commerce monolith</En><Zh>1. 电商 monolith</Zh></h3>
        <p><En>Start here: one codebase, one database, one deploy — for a small team, this is correct.</En><Zh>从这里开始：一个代码库、一个数据库、一次部署——对小团队来说，这是正确的。</Zh></p>
        <svg viewBox="0 0 560 260" role="img" aria-label="A single monolith box containing eight modules — Users, Catalog, Inventory, Cart, Orders, Payments, Notifications, and Recommendations — all sharing one database, deployed as one artifact.">
          <rect x="20" y="20" width="520" height="160" rx="8" fill="#fdf3f3" stroke="#d98b8b" strokeWidth="2" />
          <text x="280" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1c1c1c">the monolith — one codebase, one deploy</text>
          {[
            ["Users", 36, 58], ["Catalog", 152, 58], ["Inventory", 268, 58], ["Cart", 384, 58],
            ["Orders", 36, 108], ["Payments", 152, 108], ["Notifications", 268, 108], ["Recommendations", 384, 108],
          ].map(([label, x, y]) => (
            <g key={label as string}>
              <rect x={x as number} y={y as number} width={104} height={34} rx="5" fill="#fff" stroke="#b98a8a" strokeWidth="1.2" />
              <text x={(x as number) + 52} y={(y as number) + 21} textAnchor="middle" fontSize="10" fill="#1c1c1c">{label}</text>
            </g>
          ))}
          <rect x="230" y="205" width="100" height="36" rx="18" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="280" y="228" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">one database</text>
          <path d="M280,180 L280,205" fill="none" stroke="#444" strokeWidth="1.5" />
        </svg>
        <p className="callout">
          <En>Everything you&apos;re about to see is what happens to this picture once the team and the
          traffic outgrow it — not a sign the monolith was built wrong.</En>
          <Zh>接下来的内容，都是这张图在团队和流量超出承受范围后发生的变化——不是说 monolith 本身写错了。</Zh>
        </p>

        <h3><En>2. Where it starts to hurt</En><Zh>2. 痛点在哪里出现</Zh></h3>
        <p><En>None of these show up with 3 developers. They show up with 100+, all in one codebase:</En><Zh>这些问题在 3 个开发者时不会出现，在 100+ 人共用一个代码库时才会浮现：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Pain point</En><Zh>痛点</Zh></th>
              <th><En>What it looks like at scale</En><Zh>规模化后的表现</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Team coordination</En><Zh>团队协调</Zh></td>
              <td><En>The Payments team can&apos;t ship until the Catalog team&apos;s branch merges first</En><Zh>Payments 团队必须等 Catalog 团队的分支先合并才能发布</Zh></td>
            </tr>
            <tr>
              <td><En>Merge conflicts</En><Zh>合并冲突</Zh></td>
              <td><En>Everyone edits the same <code>server.ts</code>, <code>schema.sql</code>, <code>package.json</code></En><Zh>所有人都在改同一个 <code>server.ts</code>、<code>schema.sql</code>、<code>package.json</code></Zh></td>
            </tr>
            <tr>
              <td><En>Release train</En><Zh>发布列车</Zh></td>
              <td><En>One broken test in Reviews blocks a Payments hotfix from shipping</En><Zh>Reviews 里一个失败的测试会阻塞 Payments 的紧急修复上线</Zh></td>
            </tr>
            <tr>
              <td><En>Blast radius</En><Zh>故障波及范围</Zh></td>
              <td><En>An unhandled error in the notification code crashes the whole process — checkout too</En><Zh>notification 代码里一个未捕获的错误会让整个进程崩溃——包括结账流程</Zh></td>
            </tr>
            <tr>
              <td><En>All-or-nothing scaling</En><Zh>整体扩容</Zh></td>
              <td><En>Catalog needs 20 instances at peak, so Payments runs 20 idle copies too</En><Zh>Catalog 高峰需要 20 个实例，结果 Payments 也跟着跑了 20 个空闲副本</Zh></td>
            </tr>
            <tr>
              <td><En>Noisy neighbor</En><Zh>嘈杂邻居</Zh></td>
              <td><En>A slow recommendations query eats the CPU every other request needed</En><Zh>一个慢查询吃掉了其他所有请求需要的 CPU</Zh></td>
            </tr>
            <tr>
              <td><En>Tech-stack lock-in</En><Zh>技术栈锁定</Zh></td>
              <td><En>One language, one framework, one database — for every module, forever</En><Zh>一种语言、一个框架、一个数据库——所有模块，永远如此</Zh></td>
            </tr>
            <tr>
              <td><En>Shared-database coupling</En><Zh>共享数据库耦合</Zh></td>
              <td><En>Nobody can change the <code>users</code> table without checking every module that joins on it</En><Zh>没人敢改 <code>users</code> 表，因为要核查所有 JOIN 它的模块</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En>These are problems of <strong>scale</strong> — team size and traffic — not of code quality.</En><Zh>这些都是<strong>规模</strong>问题——团队规模和流量——与代码质量无关。</Zh></li>
            <li><En>A small, well-written monolith has none of these problems. A messy one with 3 developers still doesn&apos;t need microservices.</En><Zh>一个小而整洁的 monolith 完全没有这些问题。即使写得乱，3 个开发者也不需要 microservices。</Zh></li>
            <li><En>Microservices are, first, an <strong>organizational</strong> fix — they let teams ship without waiting on each other.</En><Zh>Microservices 首先是一种<strong>组织</strong>层面的解决方案——让团队可以独立发布，不必互相等待。</Zh></li>
          </ul>
        </div>

        <h3><En>3. What traffic actually looks like</En><Zh>3. 流量的真实分布</Zh></h3>
        <p><En>Before splitting anything up, it helps to know which parts of the store actually get hit hardest.</En><Zh>拆分之前，先搞清楚系统的哪些部分承受的压力最大。</Zh></p>
        <p className="callout">
          <En>Most visits never turn into an order — a typical e-commerce conversion rate is around
          <strong> 2–3%</strong>. Dozens of product views happen for every one purchase.</En>
          <Zh>大多数访问不会变成订单——典型的电商转化率约为<strong> 2–3%</strong>。每一笔购买背后，有几十次商品浏览。</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Service</En><Zh>服务</Zh></th>
              <th><En>Request volume</En><Zh>请求量</Zh></th>
              <th><En>What stresses it</En><Zh>压力来源</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Catalog / Search</En><Zh>Catalog / Search</Zh></td>
              <td><En>Highest — every page view, every search</En><Zh>最高——每次页面浏览、每次搜索</Zh></td>
              <td><En>Raw read throughput — solved with caching, not more logic</En><Zh>纯读吞吐量——靠缓存解决，而非更多逻辑</Zh></td>
            </tr>
            <tr>
              <td>Inventory</td>
              <td><En>High reads, low writes</En><Zh>读多写少</Zh></td>
              <td><En>Contention: 10,000 people buying the same flash-sale item at once</En><Zh>争抢：1 万人同时抢同一件限时特卖商品</Zh></td>
            </tr>
            <tr>
              <td>Orders</td>
              <td><En>Low — only the ~2–3% who actually buy</En><Zh>低——只有约 2–3% 真正下单的用户</Zh></td>
              <td><En>Correctness, not volume — this table must never be wrong</En><Zh>正确性，而非量级——这张表绝对不能出错</Zh></td>
            </tr>
            <tr>
              <td>Payments</td>
              <td><En>Lowest</En><Zh>最低</Zh></td>
              <td><En>Reliability and third-party latency, never raw volume</En><Zh>可靠性和第三方延迟，而非请求量</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>Traffic and importance are <strong>opposites</strong> here: Catalog takes the most
              requests but can serve slightly stale data from a cache. Orders takes the fewest but can
              never be wrong.</En>
              <Zh>流量和重要性在这里是<strong>反向关系</strong>：Catalog 请求量最大，但可以从缓存返回略旧的数据。Orders 请求量最少，但绝对不能出错。</Zh>
            </li>
            <li>
              <En>That mismatch is exactly why you&apos;d want to scale and harden these differently — a
              monolith can&apos;t do that; it scales as one unit.</En>
              <Zh>这种不匹配正是你希望对它们分别扩容、分别加固的原因——monolith 做不到，它只能作为整体扩缩。</Zh>
            </li>
            <li>
              <En>In practice nobody guesses this. Teams watch metrics — requests/sec, latency, error
              rate per endpoint — and split where the data says to.</En>
              <Zh>实际上没人靠猜测。团队观察指标——每秒请求数、延迟、各接口错误率——数据指哪里就拆哪里。</Zh>
            </li>
          </ul>
        </div>

        <h3><En>4. What a microservice actually is</En><Zh>4. microservice 到底是什么</Zh></h3>
        <ul>
          <li><En><strong>Independently deployable</strong> — ship it without touching anyone else&apos;s code</En><Zh><strong>独立部署</strong>——无需触碰其他人的代码即可发布</Zh></li>
          <li><En><strong>Owns its data</strong> — its database, nobody else&apos;s to query directly</En><Zh><strong>独占数据</strong>——它的数据库，其他服务不能直接查询</Zh></li>
          <li><En><strong>Talks only over its API</strong> — HTTP/JSON (or gRPC), never a shared function call</En><Zh><strong>只通过 API 通信</strong>——HTTP/JSON（或 gRPC），绝不共享函数调用</Zh></li>
        </ul>
        <p className="callout">
          <En>One team owns a service end to end — this is why splitting up code is really about
          splitting up <em>teams</em>.</En>
          <Zh>一个团队端到端负责一个服务——这就是为什么拆分代码本质上是在拆分<em>团队</em>。</Zh>
        </p>
        <svg viewBox="0 0 560 200" role="img" aria-label="The same eight modules as separate boxes, each with its own small database, no longer inside one shared monolith box.">
          {[
            ["Users", 8], ["Catalog", 78], ["Inventory", 148], ["Cart", 218],
            ["Orders", 288], ["Payments", 358], ["Notifications", 428], ["Recs", 498],
          ].map(([label, x]) => (
            <g key={label as string}>
              <rect x={x as number} y="20" width="54" height="34" rx="5" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.2" />
              <text x={(x as number) + 27} y="41" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1c1c1c">{label}</text>
              <path d={`M${(x as number) + 27},54 L${(x as number) + 27},80`} fill="none" stroke="#999" strokeWidth="1.2" />
              <ellipse cx={(x as number) + 27} cy="92" rx="20" ry="8" fill="#fff" stroke="#999" strokeWidth="1.2" />
              <path d={`M${(x as number) + 7},92 L${(x as number) + 7},110 A20,8 0 0 0 ${(x as number) + 47},110 L${(x as number) + 47},92`} fill="#fff" stroke="#999" strokeWidth="1.2" />
            </g>
          ))}
          <text x="280" y="150" textAnchor="middle" fontSize="11" fill="#5b6b82">eight services, eight databases — no shared tables</text>
        </svg>

        <h3><En>5. How requests get in: the API Gateway</En><Zh>5. 请求如何进入：API Gateway</Zh></h3>
        <p><En>One public door in front of every private service. Clients only ever call the gateway.</En><Zh>所有私有服务前面只有一扇公共入口。客户端永远只调用 gateway。</Zh></p>
        <svg viewBox="0 0 640 190" role="img" aria-label="A browser calling the API Gateway, which routes to three private-subnet services: Catalog, Orders, and Notifications.">
          <defs>
            <marker id="gw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#444" />
            </marker>
          </defs>
          <rect x="20" y="70" width="110" height="40" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="75" y="95" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">browser</text>
          <rect x="200" y="70" width="150" height="40" rx="6" fill="#fff7e0" stroke="#e8b400" strokeWidth="2" />
          <text x="275" y="95" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">API Gateway</text>
          <path d="M130,90 L200,90" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
          <rect x="440" y="15" width="180" height="46" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="530" y="34" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Catalog</text>
          <text x="530" y="50" textAnchor="middle" fontSize="9" fill="#5b6b82">private subnet</text>
          <rect x="440" y="72" width="180" height="46" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="530" y="91" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Orders</text>
          <text x="530" y="107" textAnchor="middle" fontSize="9" fill="#5b6b82">private subnet</text>
          <rect x="440" y="129" width="180" height="46" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="530" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Notifications</text>
          <text x="530" y="164" textAnchor="middle" fontSize="9" fill="#5b6b82">private subnet</text>
          <path d="M350,88 Q400,38 440,38" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
          <path d="M350,90 L440,95" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
          <path d="M350,92 Q400,142 440,152" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
        </svg>
        <p className="callout">
          <En>At the gateway: TLS, auth (checked once), rate limiting, routing, request logging —
          everything you don&apos;t want duplicated in every service.</En>
          <Zh>Gateway 处理：TLS、鉴权（只验证一次）、限流、路由、请求日志——所有你不想在每个服务里重复实现的事情。</Zh>
        </p>

        <h3><En>6. How services talk to each other</En><Zh>6. 服务之间如何通信</Zh></h3>
        <p><En>Placing an order means the Orders service calling four other services, over the network:</En><Zh>下一个订单，意味着 Orders 服务要通过网络调用其他四个服务：</Zh></p>
        <svg viewBox="0 0 560 220" role="img" aria-label="Orders service in the center calling Users, Catalog, Inventory, and Payments synchronously, and Notifications as a fire-and-forget call.">
          <rect x="230" y="90" width="100" height="40" rx="6" fill="#fff7e0" stroke="#e8b400" strokeWidth="2" />
          <text x="280" y="115" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Orders</text>
          {[
            ["Users", 20, 10], ["Catalog", 220, 10], ["Inventory", 420, 10],
            ["Payments", 20, 180], ["Notifications", 420, 180],
          ].map(([label, x, y]) => (
            <g key={label as string}>
              <rect x={x as number} y={y as number} width={120} height={34} rx="5" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.2" />
              <text x={(x as number) + 60} y={(y as number) + 21} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1c1c1c">{label}</text>
            </g>
          ))}
          <path d="M280,90 L200,44" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,90 L280,44" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,90 L420,44" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,130 L200,180" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,130 L420,180" fill="none" stroke="#999" strokeWidth="1.3" strokeDasharray="4,3" />
          <text x="280" y="205" textAnchor="middle" fontSize="9" fill="#5b6b82">dashed = fire-and-forget, no waiting</text>
        </svg>
        <CodeBlock
          language="typescript"
          code={`// Orders calling Payments — a network call now, not a function call.
// No timeout here means a slow Payments service hangs every checkout.
const res = await fetch(\`\${PAYMENTS_URL}/charges\`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ orderId, amount, customerId }),
  signal: AbortSignal.timeout(3000),
});`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En>A function call always succeeds or throws. A network call can also time out, retry, or arrive twice.</En><Zh>函数调用要么成功要么抛异常。网络调用还可能超时、需要重试，或者到达两次。</Zh></li>
            <li><En>Every outbound call needs a timeout — a missing one is the classic first microservices outage: one slow service holds every caller&apos;s connections open.</En><Zh>每个对外调用都必须设置超时——忘了这一点是 microservices 最经典的初级故障：一个慢服务把所有调用方的连接全部挂住。</Zh></li>
            <li><En>Notification doesn&apos;t need to block checkout, so it&apos;s called and its failure is logged, not rethrown — the order already succeeded.</En><Zh>Notification 不需要阻塞结账，所以调用后若失败只记日志，不重新抛出——订单已经成功了。</Zh></li>
          </ul>
        </div>
        <p className="callout">
          <En>A call like this can also be made <em>asynchronous</em>: instead of waiting on
          Notification directly, Orders publishes an <code>OrderPlaced</code> event and moves on —
          whoever&apos;s listening picks it up.</En>
          <Zh>这类调用也可以改成<em>异步</em>：Orders 不直接等待 Notification，而是发布一个 <code>OrderPlaced</code> 事件继续执行——监听方自行消费。</Zh>
        </p>

        <h3><En>7. One database per service</En><Zh>7. 每个服务独占一个数据库</Zh></h3>
        <p><En>No shared tables. Two things a single database gave you for free now have to be rebuilt by hand:</En><Zh>没有共享表。单数据库曾经免费提供的两件事，现在必须手动重建：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>What the monolith had</En><Zh>Monolith 原本拥有的</Zh></th>
              <th><En>What replaces it</En><Zh>替代方案</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>A cross-table JOIN (<code>orders JOIN users JOIN products</code>)</En><Zh>跨表 JOIN（<code>orders JOIN users JOIN products</code>）</Zh></td>
              <td><En>Orders stores its own snapshot of what it needs</En><Zh>Orders 自己存储所需字段的快照</Zh></td>
            </tr>
            <tr>
              <td><En>One transaction across every write</En><Zh>跨所有写操作的单一事务</Zh></td>
              <td><En>A hand-written compensating action if a later step fails</En><Zh>后续步骤失败时手动执行补偿操作</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          code={`// Orders never joins into users/products — it stores what it needed, at that moment.
const order = {
  id: orderId,
  customerEmail: user.email,       // copied from Users at checkout time
  productName: product.name,       // copied from Catalog at checkout time
  unitPriceAtPurchase: product.price,
  status: "placed",
};`}
        />
        <p className="callout">
          <En>If two services genuinely need the same transaction, that&apos;s usually a sign they
          should be one service, not two.</En>
          <Zh>如果两个服务真的需要同一个事务，这通常意味着它们应该是一个服务，而不是两个。</Zh>
        </p>

        <h3><En>8. Different tools for different services</En><Zh>8. 不同服务用不同工具</Zh></h3>
        <p><En>Nothing forces every service onto the same language or database:</En><Zh>没有什么规定每个服务必须用同一种语言或数据库：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Stack</En><Zh>技术栈</Zh></th>
              <th><En>Good at</En><Zh>擅长</Zh></th>
              <th><En>Typical service</En><Zh>典型服务</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Node.js</td>
              <td><En>I/O-bound work, many concurrent connections, JSON APIs</En><Zh>I/O 密集型任务、大量并发连接、JSON API</Zh></td>
              <td><En>Gateway, Catalog, Cart</En><Zh>Gateway、Catalog、Cart</Zh></td>
            </tr>
            <tr>
              <td>Java / Spring Boot</td>
              <td><En>Large, long-lived, transaction-heavy business logic</En><Zh>大型、长期运行、事务密集的业务逻辑</Zh></td>
              <td><En>Payments, Orders, banking/ERP integrations</En><Zh>Payments、Orders、银行/ERP 集成</Zh></td>
            </tr>
            <tr>
              <td>Python</td>
              <td><En>Data, machine learning, analytics</En><Zh>数据、机器学习、数据分析</Zh></td>
              <td>Recommendations</td>
            </tr>
          </tbody>
        </table>
        <p><En>Same logic for databases — pick the one that fits the data, not one default for everything:</En><Zh>数据库也是同样的逻辑——选适合数据特性的，而不是一个默认选项用到底：</Zh></p>
        <ul>
          <li><En><strong>SQL</strong> — relationships and correctness matter (Orders, Payments)</En><Zh><strong>SQL</strong> ——关系和正确性至关重要（Orders、Payments）</Zh></li>
          <li><En><strong>MongoDB</strong> — every record&apos;s shape is different, or it needs easy horizontal scaling (Catalog: a shoe has a size, a TV has a resolution)</En><Zh><strong>MongoDB</strong> ——每条记录结构各异，或需要轻松水平扩展（Catalog：鞋有尺码，电视有分辨率）</Zh></li>
          <li><En><strong>Redis</strong> — short-lived data you can afford to lose (Cart)</En><Zh><strong>Redis</strong> ——可以接受丢失的短期数据（Cart）</Zh></li>
        </ul>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>In practice, the choice is often <strong>who&apos;s on the team</strong> and{" "}
              <strong>what already exists</strong> — not a pure technical ranking.</En>
              <Zh>实际上，选择往往取决于<strong>团队里有谁</strong>和<strong>已有什么</strong>——而不是纯技术排名。</Zh>
            </li>
            <li>
              <En>A company with 40 Java developers writes the new service in Java. A legacy billing
              system stays in Java because rewriting it is a risk nobody signs off on.</En>
              <Zh>有 40 个 Java 开发者的公司会用 Java 写新服务。遗留计费系统继续用 Java，因为重写的风险没人敢批准。</Zh>
            </li>
            <li>
              <En>Node and Spring Boot running in the same system is normal, and is what you&apos;ll see
              at real client sites.</En>
              <Zh>Node 和 Spring Boot 在同一个系统里共存是常态，这正是你在真实客户现场会看到的。</Zh>
            </li>
          </ul>
        </div>
        <p><En>The same endpoint, two stacks — the gateway can&apos;t tell the difference, and doesn&apos;t care:</En><Zh>同一个接口，两种技术栈——gateway 看不出区别，也不在乎：</Zh></p>
        <CodeBlock
          language="typescript"
          code={`// Express (Node) — GET /payments/:id
app.get("/payments/:id", async (req, res) => {
  const payment = await db.payments.findById(req.params.id);
  res.json(payment);
});`}
        />
        <CodeBlock
          language="plaintext"
          code={`// Spring Boot (Java) — GET /payments/{id}
@GetMapping("/payments/{id}")
public Payment getPayment(@PathVariable Long id) {
    return paymentRepository.findById(id).orElseThrow();
}`}
        />
        <p className="callout">
          <En>Both speak HTTP + JSON. Behind the gateway, a service is a box that answers requests —
          nothing about the gateway&apos;s routing changes based on what&apos;s inside the box.</En>
          <Zh>两者都说 HTTP + JSON。在 gateway 背后，一个服务就是一个响应请求的黑盒——gateway 的路由规则不会因为盒子里装的是什么而改变。</Zh>
        </p>

        <h3><En>9. Pain point → fix → new cost</En><Zh>9. 痛点 → 解决方案 → 新代价</Zh></h3>
        <p><En>Each row from Section 2 now has an answer — and each answer has a price:</En><Zh>第二节里的每个痛点现在都有了答案——每个答案也都有代价：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Pain point</En><Zh>痛点</Zh></th>
              <th><En>Microservices fix</En><Zh>Microservices 解决方案</Zh></th>
              <th><En>New cost</En><Zh>新代价</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Team coordination</En><Zh>团队协调</Zh></td>
              <td><En>Independent deploys, per service</En><Zh>每个服务独立部署</Zh></td>
              <td><En>Contracts between services must stay compatible</En><Zh>服务间的契约必须保持兼容</Zh></td>
            </tr>
            <tr>
              <td><En>Merge conflicts</En><Zh>合并冲突</Zh></td>
              <td><En>Separate codebases, no shared files</En><Zh>独立代码库，无共享文件</Zh></td>
              <td><En>Some logic gets duplicated instead of shared</En><Zh>部分逻辑变为重复，而非共享</Zh></td>
            </tr>
            <tr>
              <td><En>Blast radius</En><Zh>故障波及范围</Zh></td>
              <td><En>One service crashing doesn&apos;t take down the rest</En><Zh>一个服务崩溃不会拖垮其他服务</Zh></td>
              <td><En>Partial failures — some of a request&apos;s work succeeded, some didn&apos;t</En><Zh>部分失败——一个请求的部分操作成功，部分未成功</Zh></td>
            </tr>
            <tr>
              <td><En>All-or-nothing scaling</En><Zh>整体扩容</Zh></td>
              <td><En>Scale only the service under load</En><Zh>只扩容承压的服务</Zh></td>
              <td><En>More infrastructure to run and pay for</En><Zh>需要运行和付费的基础设施更多</Zh></td>
            </tr>
            <tr>
              <td><En>Tech-stack lock-in</En><Zh>技术栈锁定</Zh></td>
              <td><En>Pick the right language/DB per service</En><Zh>为每个服务选择合适的语言/数据库</Zh></td>
              <td><En>More tooling, more things engineers need to know</En><Zh>更多工具，工程师需要掌握的东西更多</Zh></td>
            </tr>
            <tr>
              <td><En>Shared-database coupling</En><Zh>共享数据库耦合</Zh></td>
              <td><En>Each service owns its data</En><Zh>每个服务独占自己的数据</Zh></td>
              <td><En>No cross-service JOIN or transaction (Section 7)</En><Zh>无法跨服务 JOIN 或使用事务（第 7 节）</Zh></td>
            </tr>
          </tbody>
        </table>

        <h3><En>10. Scaling one service: the load balancer</En><Zh>10. 单服务扩容：load balancer</Zh></h3>
        <p><En>Scaling Catalog means running several identical copies of it. Something has to spread the traffic across them:</En><Zh>扩容 Catalog 意味着运行多个完全相同的副本。需要有东西来分发流量：</Zh></p>
        <svg viewBox="0 0 600 200" role="img" aria-label="The API Gateway sends Catalog traffic to a load balancer, which spreads it across three identical Catalog copies. The third copy failed its health check and receives no traffic.">
          <defs>
            <marker id="lb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#444" />
            </marker>
          </defs>
          <rect x="20" y="80" width="120" height="40" rx="6" fill="#fff7e0" stroke="#e8b400" strokeWidth="2" />
          <text x="80" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">API Gateway</text>
          <rect x="200" y="80" width="130" height="40" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="2" />
          <text x="265" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Load balancer</text>
          <path d="M140,100 L200,100" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#lb-arrow)" />
          <rect x="420" y="15" width="160" height="40" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="500" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Catalog copy 1</text>
          <rect x="420" y="80" width="160" height="40" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="500" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Catalog copy 2</text>
          <rect x="420" y="145" width="160" height="40" rx="6" fill="#f5f5f5" stroke="#bbb" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="500" y="163" textAnchor="middle" fontSize="12" fontWeight="700" fill="#999">Catalog copy 3</text>
          <text x="500" y="177" textAnchor="middle" fontSize="9" fill="#999">failed health check — skipped</text>
          <path d="M330,95 Q380,40 420,35" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#lb-arrow)" />
          <path d="M330,100 L420,100" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#lb-arrow)" />
        </svg>
        <ul>
          <li><En><strong>Spreads requests</strong> across identical copies — take turns (round robin), or send each one to the least busy copy (least connections)</En><Zh><strong>分发请求</strong>到相同副本——轮流（round robin），或每次发给最空闲的副本（least connections）</Zh></li>
          <li><En><strong>Health checks</strong> — it pings every copy, and stops sending traffic to one that fails</En><Zh><strong>健康检查</strong>——持续 ping 每个副本，停止向失败的副本发送流量</Zh></li>
          <li><En><strong>Copies come and go</strong> — add three more for a sale, remove them after; the load balancer just updates its list</En><Zh><strong>副本动态增减</strong>——促销时加三个，结束后移除；load balancer 只需更新列表</Zh></li>
        </ul>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Load balancer</En><Zh>Load balancer</Zh></th>
              <th><En>API Gateway</En><Zh>API Gateway</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Picks between</En><Zh>在…之间选择</Zh></td>
              <td><En>Identical copies of <em>one</em> service</En><Zh><em>同一</em>服务的相同副本</Zh></td>
              <td><En>Different services, by path</En><Zh>不同服务，按路径区分</Zh></td>
            </tr>
            <tr>
              <td><En>Decides by</En><Zh>决策依据</Zh></td>
              <td><En>Health and how busy each copy is</En><Zh>健康状态和各副本的繁忙程度</Zh></td>
              <td><En>The request — path, token, rate limit</En><Zh>请求本身——路径、token、限流</Zh></td>
            </tr>
            <tr>
              <td><En>On AWS</En><Zh>AWS 对应</Zh></td>
              <td><En>Application Load Balancer (ALB)</En><Zh>Application Load Balancer（ALB）</Zh></td>
              <td><En>Amazon API Gateway</En><Zh>Amazon API Gateway</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>They&apos;re usually stacked: the gateway picks <em>which service</em>, a load balancer picks{" "}
          <em>which copy</em> of it.</En>
          <Zh>两者通常叠加使用：gateway 决定找<em>哪个服务</em>，load balancer 决定用该服务的<em>哪个副本</em>。</Zh>
        </p>

        <h3><En>11. When not to do this</En><Zh>11. 什么时候不该这样做</Zh></h3>
        <ul>
          <li><En>A small team, or an early product where the boundaries aren&apos;t clear yet — stay monolithic</En><Zh>小团队，或边界还不清晰的早期产品——保持 monolith</Zh></li>
          <li><En>Split when a real seam proves itself, not because the file count looks big</En><Zh>当真实的拆分边界自然显现时再拆，而不是因为文件数量看起来多</Zh></li>
          <li><En>A premature split hardens a guess into a network protocol, which is expensive to undo</En><Zh>过早拆分会把一个猜测固化成网络协议，代价高昂且难以撤销</Zh></li>
        </ul>
        <p className="callout">
          <En>The <strong>distributed monolith</strong>: services that look separate but must all deploy
          together to work — all of the network cost, none of the independence.</En>
          <Zh><strong>分布式 monolith</strong>：服务看起来是分开的，但必须一起部署才能工作——付出了所有网络代价，却没有得到任何独立性。</Zh>
        </p>

        <h3><En>12. Running a fleet: containers and orchestration</En><Zh>12. 运行一组服务：容器与编排</Zh></h3>
        <p><En>Every service, in any language, ships the same way: as a container. Something still has to keep them running.</En><Zh>任何语言写的服务，交付方式都一样：打包成容器。但还需要有东西来保证它们持续运行。</Zh></p>
        <ul>
          <li><En>Keep N copies of each service alive, restart any that crash</En><Zh>保持每个服务运行 N 个副本，崩溃时自动重启</Zh></li>
          <li><En>Scale a service up or down based on load</En><Zh>根据负载对服务进行扩缩容</Zh></li>
          <li><En>Roll out a new version without downtime</En><Zh>无停机发布新版本</Zh></li>
          <li><En>Route traffic between services</En><Zh>在服务之间路由流量</Zh></li>
        </ul>
        <p><En>That &quot;something&quot; is an orchestrator. Two you&apos;ll hear about constantly:</En><Zh>这个"东西"就是编排器（orchestrator）。有两个你会经常听到：</Zh></p>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En><strong>ECS</strong> is AWS&apos;s own orchestrator: give it a container image and a
              desired count, it keeps that many copies running.</En>
              <Zh><strong>ECS</strong> 是 AWS 自己的编排器：给它一个容器镜像和期望数量，它负责保持那么多副本在运行。</Zh>
            </li>
            <li>
              <En><strong>Fargate</strong> is a launch mode for ECS where AWS supplies the compute — no
              EC2 instances to patch, size, or scale.</En>
              <Zh><strong>Fargate</strong> 是 ECS 的一种启动模式，由 AWS 提供计算资源——无需管理 EC2 实例的补丁、规格或扩缩容。</Zh>
            </li>
            <li>
              <En>The pairing you&apos;ll hear: &quot;ECS on Fargate&quot; — ECS decides <em>what</em>{" "}
              runs, Fargate provides <em>where</em> it runs.</En>
              <Zh>你会经常听到的组合：「ECS on Fargate」——ECS 决定<em>跑什么</em>，Fargate 提供<em>在哪里跑</em>。</Zh>
            </li>
            <li>
              <En>Running one server yourself means patching, sizing, and scaling it by hand. A
              container definition like this hands all of that to AWS instead — and it matters
              because each service now scales independently.</En>
              <Zh>自己管理服务器意味着手动打补丁、调规格、做扩缩容。像这样的容器定义把这些全部交给 AWS——这很重要，因为每个服务现在可以独立扩缩容。</Zh>
            </li>
          </ul>
        </div>
        <CodeBlock
          language="json"
          code={`{
  "family": "notification-service",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "notification",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/notification:1.4.0",
      "portMappings": [{ "containerPort": 3001 }],
      "environment": [{ "name": "NODE_ENV", "value": "production" }]
    }
  ]
}`}
        />
        <p><En>Three ways to run code on AWS, from most control to least to manage:</En><Zh>在 AWS 上运行代码的三种方式，按管理负担从高到低排列：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>EC2</th>
              <th>ECS on Fargate</th>
              <th>Lambda</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>You hand AWS</En><Zh>你交给 AWS 的</Zh></td>
              <td><En>Nothing — you rent a server</En><Zh>无——你只是租了一台服务器</Zh></td>
              <td><En>A container image</En><Zh>一个容器镜像</Zh></td>
              <td><En>A single function</En><Zh>一个函数</Zh></td>
            </tr>
            <tr>
              <td><En>You manage</En><Zh>你负责管理</Zh></td>
              <td><En>The OS, patches, scaling</En><Zh>操作系统、补丁、扩缩容</Zh></td>
              <td><En>Only what&apos;s inside the container</En><Zh>只需管理容器内部</Zh></td>
              <td><En>Only the code</En><Zh>只需管理代码本身</Zh></td>
            </tr>
            <tr>
              <td><En>Runs</En><Zh>运行方式</Zh></td>
              <td><En>Always on</En><Zh>持续运行</Zh></td>
              <td><En>Always on, N copies</En><Zh>持续运行，N 个副本</Zh></td>
              <td><En>Only when a request or event arrives</En><Zh>只在请求或事件到来时运行</Zh></td>
            </tr>
            <tr>
              <td><En>You pay for</En><Zh>计费方式</Zh></td>
              <td><En>Every hour the server exists</En><Zh>服务器存在的每一小时</Zh></td>
              <td><En>CPU and memory reserved, per second</En><Zh>按秒计费，按预留的 CPU 和内存</Zh></td>
              <td><En>Each call and how long it ran</En><Zh>每次调用及其运行时长</Zh></td>
            </tr>
            <tr>
              <td><En>Good for</En><Zh>适用场景</Zh></td>
              <td><En>Full control, legacy apps</En><Zh>完全控制、遗留应用</Zh></td>
              <td><En>Long-running services — most microservices</En><Zh>长期运行的服务——大多数 microservices</Zh></td>
              <td><En>Short, spiky jobs — e.g. resize an image on upload</En><Zh>短期、突发性任务——例如上传时压缩图片</Zh></td>
            </tr>
            <tr>
              <td><En>Catch</En><Zh>注意事项</Zh></td>
              <td><En>All the ops work is yours</En><Zh>所有运维工作都由你承担</Zh></td>
              <td><En>Costs more than a well-used EC2 box</En><Zh>比充分利用的 EC2 成本更高</Zh></td>
              <td><En>15-minute limit; a slow first call after idle (cold start)</En><Zh>15 分钟限制；空闲后首次调用较慢（cold start）</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En><strong>Kubernetes</strong> does the same job as ECS — keep containers running, scale, roll out — but it&apos;s open-source and runs on any cloud, not just AWS.</En><Zh><strong>Kubernetes</strong> 做的事和 ECS 一样——保持容器运行、扩缩容、滚动发布——但它是开源的，可以运行在任何云上，不只限于 AWS。</Zh></li>
            <li><En><strong>EKS</strong> is AWS running Kubernetes&apos;s control plane for you, the same relationship Fargate has to ECS.</En><Zh><strong>EKS</strong> 是 AWS 帮你托管 Kubernetes 控制面，就像 Fargate 和 ECS 的关系一样。</Zh></li>
            <li><En>Vocabulary only for today: a <strong>Pod</strong> is one or more containers running together; a <strong>Deployment</strong> keeps a set of Pods alive; a <strong>Service</strong> gives them a stable address.</En><Zh>今天只需记住词汇：<strong>Pod</strong> 是一个或多个容器的组合；<strong>Deployment</strong> 负责保持一组 Pod 存活；<strong>Service</strong> 为它们提供稳定的访问地址。</Zh></li>
          </ul>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>ECS (on Fargate)</th>
              <th>Kubernetes (on EKS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Runs on</En><Zh>运行平台</Zh></td>
              <td><En>AWS only</En><Zh>仅限 AWS</Zh></td>
              <td><En>Any cloud, or your own servers</En><Zh>任意云平台或自有服务器</Zh></td>
            </tr>
            <tr>
              <td><En>Setup</En><Zh>配置复杂度</Zh></td>
              <td><En>Simpler, fewer concepts</En><Zh>更简单，概念更少</Zh></td>
              <td><En>More powerful, steeper learning curve</En><Zh>功能更强，学习曲线更陡</Zh></td>
            </tr>
            <tr>
              <td><En>Ecosystem</En><Zh>生态</Zh></td>
              <td><En>AWS-native tooling</En><Zh>AWS 原生工具链</Zh></td>
              <td><En>Huge open-source ecosystem, industry standard</En><Zh>庞大的开源生态，行业标准</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Same job, different tools. We&apos;re not deploying either one today — this is vocabulary so
          the words aren&apos;t new the first time you see them on a job.</En>
          <Zh>相同的工作，不同的工具。今天我们不实际部署任何一个——这是词汇课，让你在工作中第一次看到这些词时不会陌生。</Zh>
        </p>

        <h3><En>13. What this still costs you</En><Zh>13. 这仍然会带来的代价</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>New problem</En><Zh>新问题</Zh></th>
              <th><En>How it&apos;s handled</En><Zh>处理方式</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>A network call can fail in ways a function call never did</En><Zh>网络调用的失败方式是函数调用从未有过的</Zh></td>
              <td><En>Retries, and switching a call to an async event instead</En><Zh>重试，以及将调用改为异步事件</Zh></td>
            </tr>
            <tr>
              <td><En>No single database, no cross-service transaction</En><Zh>没有单一数据库，无法跨服务事务</Zh></td>
              <td><En>Accepting eventual consistency instead of forcing an atomic write</En><Zh>接受最终一致性，而不是强制原子写入</Zh></td>
            </tr>
            <tr>
              <td><En>One request now touches five services — no single stack trace</En><Zh>一个请求现在经过五个服务——没有单一的 stack trace</Zh></td>
              <td><En>A correlation ID passed through every call, and distributed tracing</En><Zh>每次调用传递 correlation ID，配合分布式链路追踪</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>These aren&apos;t exotic edge cases — they&apos;re the normal operating condition of any
          multi-service system.</En>
          <Zh>这些不是罕见的边缘情况——它们是任何多服务系统的日常运行状态。</Zh>
        </p>
      </section>
    </div>
  );
}
