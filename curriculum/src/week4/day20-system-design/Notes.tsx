import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";

function Tag({ x, y, n, color = "#2255cc" }: { x: number; y: number; n: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={color} />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
        {n}
      </text>
    </g>
  );
}

type Tone = "blue" | "gold" | "purple" | "red" | "green" | "grey";
const TONES: Record<Tone, [string, string]> = {
  blue: ["#eef3ff", "#7ea6e0"],
  gold: ["#fff7e0", "#e8b400"],
  purple: ["#f3eefc", "#8e5fd6"],
  red: ["#fdeceb", "#d9534f"],
  green: ["#eaf6ec", "#7cc08a"],
  grey: ["#f4f4f4", "#999"],
};
const ARROW_COLOR: Record<string, string> = { grey: "#444", purple: "#8e5fd6", red: "#d9534f" };

function SharedDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {Object.entries(ARROW_COLOR).map(([name, color]) => (
          <marker key={name} id={`dg-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={color} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

type N = number | string;

function Box({ x, y, w, h, title, sub, tone = "blue", dashed }: { x: N; y: N; w: N; h: N; title: string; sub?: string; tone?: Tone; dashed?: boolean }) {
  const [fill, stroke] = TONES[tone];
  [x, y, w, h] = [Number(x), Number(y), Number(w), Number(h)];
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dashed ? "5 3" : undefined} />
      <text x={cx} y={sub ? y + h / 2 - 2 : y + h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">{title}</text>
      {sub && <text x={cx} y={y + h / 2 + 11} textAnchor="middle" fontSize="8.5" fill="#5b6b82">{sub}</text>}
    </g>
  );
}

function Arrow({ d, tone = "grey", dashed, both }: { d: string; tone?: "grey" | "purple" | "red"; dashed?: boolean; both?: boolean }) {
  return (
    <path d={d} fill="none" stroke={ARROW_COLOR[tone]} strokeWidth="1.5" strokeDasharray={dashed ? "4 3" : undefined} markerEnd={`url(#dg-${tone})`} markerStart={both ? `url(#dg-${tone})` : undefined} />
  );
}

function Note({ x, y, children, anchor = "middle", color = "#5b6b82" }: { x: N; y: N; children: string; anchor?: "start" | "middle" | "end"; color?: string }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize="9" fontStyle="italic" fill={color}>{children}</text>;
}

function Diagram({ viewBox, label, children }: { viewBox: string; label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label}>
      {children}
    </svg>
  );
}

export default function Notes() {
  return (
    <div className="page notes-page">
      <SharedDefs />
      <title>Day 20 Notes</title>
      <DayNav day="day20-system-design" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 20 · Notes</p>
        <h1>System Design</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>精华要点 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节——精华要点</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>精华要点——今天结束时，你必须能够做到以下几点：</Zh></p>
        <ul>
          <li><En>Walk through the five-step interview framework without being prompted</En><Zh>无需提示，自己走完面试的五步框架</Zh></li>
          <li><En>State the CAP theorem correctly, and apply it to a real decision in this system</En><Zh>正确阐述 CAP 定理，并将其应用到本系统中的一个实际决策</Zh></li>
          <li><En>Compare horizontal and vertical scaling, and say what makes a service scalable at all</En><Zh>比较水平扩展与垂直扩展，并说明什么让一个服务具备可扩展性</Zh></li>
          <li><En>Name the four fault-tolerance patterns and say which problem each solves</En><Zh>说出四种容错模式，并说明各自解决什么问题</Zh></li>
          <li><En>Say where in the stack each caching strategy belongs</En><Zh>说明每种缓存策略应放在技术栈的哪一层</Zh></li>
          <li><En>Trace a DNS lookup from a browser to an IP address</En><Zh>追踪从浏览器到 IP 地址的 DNS 查询过程</Zh></li>
          <li><En>Explain what belongs on a CDN and what never does</En><Zh>说明哪些内容适合放在 CDN 上，哪些绝对不适合</Zh></li>
          <li><En>Explain when to choose React, Angular, or Next.js, and what server-side rendering fixes</En><Zh>说明何时选择 React、Angular 或 Next.js，以及服务端渲染解决了什么问题</Zh></li>
          <li><En>Place a load balancer in an architecture and name a balancing algorithm</En><Zh>在架构图中标注负载均衡器，并说出一种负载均衡算法</Zh></li>
          <li><En>Place the security boundaries (WAF, TLS termination, private subnets) on an AWS diagram</En><Zh>在 AWS 架构图上标出安全边界（WAF、TLS 终止、私有子网）</Zh></li>
          <li><En>Draw the whole system as it now stands, and defend each boundary in it</En><Zh>画出当前整个系统的架构，并为其中每条边界作出解释</Zh></li>
        </ul>
        <p>
          <En>Want more? <Link to="/week4/day20-system-design/concepts">View all concepts?</Link></En>
          <Zh>想了解更多？<Link to="/week4/day20-system-design/concepts">查看全部概念</Link></Zh>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节——完整讲解</Zh></h2>

        <h3><En>1. The interview framework</En><Zh>1. 面试答题框架</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Step</En><Zh>步骤</Zh></th>
              <th><En>Time</En><Zh>时间</Zh></th>
              <th><En>What you do</En><Zh>做什么</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>1. Clarify requirements</En><Zh>1. 明确需求</Zh></td>
              <td>~5 min</td>
              <td>
                <En>Functional: what does it do? Non-functional: users, read/write ratio, latency, data size. Ask before you draw.</En>
                <Zh>功能需求：它做什么？非功能需求：用户量、读写比、延迟、数据量。先提问，再画图。</Zh>
              </td>
            </tr>
            <tr>
              <td><En>2. Estimate capacity</En><Zh>2. 估算容量</Zh></td>
              <td>~5 min</td>
              <td>
                <En>Back-of-envelope: requests per second, storage, bandwidth. Rough is fine.</En>
                <Zh>粗略估算：每秒请求数、存储量、带宽。数量级正确即可。</Zh>
              </td>
            </tr>
            <tr>
              <td><En>3. High-level design</En><Zh>3. 高层设计</Zh></td>
              <td>~10 min</td>
              <td>
                <En>Boxes and arrows: client → edge → services → data. Say what each box is for.</En>
                <Zh>画方框和箭头：客户端 → 边缘 → 服务 → 数据。说明每个方框的作用。</Zh>
              </td>
            </tr>
            <tr>
              <td><En>4. Deep-dive</En><Zh>4. 深入细节</Zh></td>
              <td>~20 min</td>
              <td>
                <En>The interviewer picks — usually the database, the hot path, or a failure. Go deep there.</En>
                <Zh>由面试官选择方向——通常是数据库、热点路径或故障场景。在那里深入展开。</Zh>
              </td>
            </tr>
            <tr>
              <td><En>5. Trade-offs</En><Zh>5. 权衡取舍</Zh></td>
              <td>~5 min</td>
              <td>
                <En>Say what you chose and what you gave up.</En>
                <Zh>说明你选了什么，又放弃了什么。</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <p><En>Step 2 in practice — the retail system:</En><Zh>第 2 步的实际例子——零售系统：</Zh></p>
        <CodeBlock
          language="plaintext"
          code={`10M users, 10% active daily      → 1M daily active users
2 orders each per day            → 2M orders/day
2M / 86,400 s                    → ~25 orders/s average, ~250/s at peak (10x)
reads : writes = 100 : 1         → ~25,000 reads/s at peak
1 order ≈ 2 KB                   → ~4 GB/day, ~1.5 TB/year`}
        />
        <p className="callout">
          <En>
            Interviewers grade your reasoning, not a &quot;correct&quot; answer — say your assumptions out loud.
          </En>
          <Zh>
            面试官评估的是你的思考过程，而不是"标准答案"——把你的假设大声说出来。
          </Zh>
        </p>

        <Diagram viewBox="0 0 660 70" label="Five steps in order: clarify requirements, estimate capacity, high-level design, deep-dive, trade-offs.">
          <Box x="10" y="12" w="108" h="46" title="Clarify" sub="~5 min" />
          <Box x="142" y="12" w="108" h="46" title="Estimate" sub="~5 min" />
          <Box x="274" y="12" w="108" h="46" title="Design" sub="~10 min" />
          <Box x="406" y="12" w="108" h="46" title="Deep-dive" sub="~20 min" tone="gold" />
          <Box x="538" y="12" w="108" h="46" title="Trade-offs" sub="~5 min" />
          <Arrow d="M118,35 L142,35" />
          <Arrow d="M250,35 L274,35" />
          <Arrow d="M382,35 L406,35" />
          <Arrow d="M514,35 L538,35" />
        </Diagram>

        <h3><En>2. The system so far</En><Zh>2. 当前系统架构</Zh></h3>
        <Diagram viewBox="0 0 710 500" label="The client side groups DNS, CDN and the browser. The browser calls an API Gateway, then a load balancer, then a GraphQL BFF, which fans out to Core Orders, Notification and Inventory services. A separate Realtime service holds a two-way WebSocket connection with the browser. Core publishes order.placed to Kafka, which Notification, Inventory and Realtime consume.">
          <rect x="10" y="8" width="345" height="118" rx="10" fill="#f8faff" stroke="#7ea6e0" strokeWidth="1.2" strokeDasharray="6 4" />
          <Note x="22" y="22" anchor="start">first stops for the client</Note>
          <Box x="25" y="32" w="115" h="34" title="DNS" sub="name → IP" />
          <Box x="25" y="76" w="115" h="34" title="CDN" sub="static files" />
          <Box x="225" y="42" w="115" h="54" title="Browser" />
          <Arrow d="M225,58 L140,49" />
          <Arrow d="M225,80 L140,93" />

          <Box x="170" y="160" w="200" h="38" title="API Gateway" tone="gold" sub="routing · auth" />
          <Arrow d="M282,96 L282,160" />
          <Note x="290" y="136" anchor="start">API calls</Note>
          <Box x="170" y="222" w="200" h="38" title="Load balancer" tone="gold" sub="spreads load across instances" />
          <Arrow d="M270,198 L270,222" />
          <Box x="170" y="284" w="200" h="38" title="GraphQL BFF" tone="gold" sub="one response from many services" />
          <Arrow d="M270,260 L270,284" />

          <Box x="20" y="360" w="150" h="50" title="Core / Orders" sub="EC2 + RDS" />
          <Box x="190" y="360" w="150" h="50" title="Notification" sub="Fargate" />
          <Box x="360" y="360" w="150" h="50" title="Inventory" sub="Fargate" />
          <Box x="540" y="360" w="150" h="50" title="Realtime" sub="Fargate · WebSocket server" />
          <Arrow d="M270,322 C270,345 95,335 95,360" />
          <Arrow d="M270,322 L265,360" />
          <Arrow d="M270,322 C270,345 435,335 435,360" />
          <Arrow d="M370,241 L615,241 L615,360" />
          <Note x="500" y="235">routed straight through — no BFF</Note>

          <Arrow d="M340,60 L640,60 L640,360" />
          <Arrow d="M670,360 L670,76 L340,76" />
          <Note x="520" y="54">WebSocket: browser → Realtime</Note>
          <Note x="520" y="92">live status pushed back ← Realtime</Note>

          <Box x="20" y="448" w="670" h="34" title="Kafka: order.placed" tone="purple" />
          <Arrow d="M95,410 L95,448" tone="purple" />
          <Arrow d="M265,448 L265,410" tone="purple" />
          <Arrow d="M435,448 L435,410" tone="purple" />
          <Arrow d="M615,448 L615,410" tone="purple" />
        </Diagram>
        <ul>
          <li>
            <En><strong>DNS</strong> — the browser asks it first, to turn the domain name into an IP address, before any request is sent.</En>
            <Zh><strong>DNS</strong>——浏览器首先向它查询，把域名解析成 IP 地址，之后才会发出任何请求。</Zh>
          </li>
          <li>
            <En><strong>CDN</strong> — static files (JS, CSS, images) come from the nearest edge location and never touch our servers.</En>
            <Zh><strong>CDN</strong>——静态文件（JS、CSS、图片）来自最近的边缘节点，完全不会经过我们的服务器。</Zh>
          </li>
          <li>
            <En><strong>API Gateway → Load balancer</strong> — API calls enter through the gateway, the single front door that handles routing and auth. The load balancer behind it spreads those requests across multiple instances of the services.</En>
            <Zh><strong>API Gateway → 负载均衡器</strong>——API 调用先通过网关这个统一入口，由它负责路由和身份验证；其后的负载均衡器再把请求分摊到服务的多个实例上。</Zh>
          </li>
          <li>
            <En><strong>GraphQL BFF</strong> — sits behind the gateway and stitches one order-detail response out of several services, so the browser makes one request instead of three.</En>
            <Zh><strong>GraphQL BFF</strong>——位于网关之后，将多个服务的数据整合成一个订单详情响应，浏览器只需发一次请求而不是三次。</Zh>
          </li>
          <li>
            <En><strong>Realtime service</strong> — holds an open two-way WebSocket with the browser, so the server can push live status without being asked. It skips the BFF because it isn&apos;t request/response.</En>
            <Zh><strong>Realtime 服务</strong>——与浏览器保持一条双向的 WebSocket 连接，服务端无需被询问就能推送实时状态。它不经过 BFF，因为这不是请求/响应模式。</Zh>
          </li>
          <li>
            <En><strong>Kafka</strong> — Core publishes <code>order.placed</code> once; Notification, Inventory and Realtime each react in their own time.</En>
            <Zh><strong>Kafka</strong>——Core 只发布一次 <code>order.placed</code>；Notification、Inventory 和 Realtime 各自按自己的节奏处理。</Zh>
          </li>
        </ul>

        <h3><En>3. CAP theorem</En><Zh>3. CAP 定理</Zh></h3>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                <strong>C</strong>onsistency: every read sees the latest write.{" "}
                <strong>A</strong>vailability: every request gets a response.{" "}
                <strong>P</strong>artition tolerance: the system keeps working when the network splits.
              </En>
              <Zh>
                <strong>一致性（C</strong>onsistency）：每次读取都能看到最新的写入。
                <strong>可用性（A</strong>vailability）：每个请求都能得到响应。
                <strong>分区容错性（P</strong>artition tolerance）：网络发生分区时系统仍能运行。
              </Zh>
            </li>
            <li>
              <En>
                The real statement is narrower than &quot;pick two&quot;:{" "}
                <strong>during a network partition</strong> you must choose C or A. With no partition
                you get both.
              </En>
              <Zh>
                CAP 定理的真实含义比"三选二"更精准：<strong>在网络分区期间</strong>，你必须在 C 和 A 之间选一个。没有分区时，两者可以兼得。
              </Zh>
            </li>
            <li>
              <En>
                Partitions aren&apos;t optional in a distributed system, so P is a given — the actual
                choice is always CP or AP.
              </En>
              <Zh>
                在分布式系统中，分区是不可避免的，所以 P 是默认前提——实际的选择永远是 CP 或 AP。
              </Zh>
            </li>
            <li>
              <En>
                It&apos;s a per-operation decision, not a per-system one. The same system can be CP for
                inventory reservation and AP for order status display.
              </En>
              <Zh>
                这是针对每个操作的决策，而不是针对整个系统的。同一个系统，库存扣减可以是 CP，订单状态展示可以是 AP。
              </Zh>
            </li>
          </ul>
        </div>
        <p><En>The decision that matters here — the Inventory service is unreachable:</En><Zh>以下是核心决策场景——Inventory 服务不可达时：</Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Choose availability (AP)</En><Zh>选择可用性（AP）</Zh></th>
              <th><En>Choose consistency (CP)</En><Zh>选择一致性（CP）</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Behavior</En><Zh>行为</Zh></td>
              <td><En>Accept the order, reserve stock later</En><Zh>接受订单，稍后再扣库存</Zh></td>
              <td><En>Reject the order until Inventory answers</En><Zh>拒绝订单，直到 Inventory 响应</Zh></td>
            </tr>
            <tr>
              <td><En>Risk</En><Zh>风险</Zh></td>
              <td><En>Overselling — the same race condition, now accepted by design</En><Zh>超卖——同样的竞态条件，但这次是有意为之</Zh></td>
              <td><En>Lost sales during the outage</En><Zh>故障期间损失订单</Zh></td>
            </tr>
            <tr>
              <td><En>Recovery</En><Zh>恢复方式</Zh></td>
              <td><En>Cancellation email, apology, restock</En><Zh>发送取消邮件、道歉、重新补货</Zh></td>
              <td><En>Nothing to undo</En><Zh>无需撤销</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            Retail almost always picks AP for order intake — a rare oversell is cheaper than refusing
            every customer during a flash sale. That is a business decision the architecture encodes,
            not a technical one.
          </En>
          <Zh>
            零售业几乎总是在下单环节选择 AP——偶尔超卖的代价，远比在秒杀时拒绝所有顾客来得低。这是架构所编码的业务决策，而非技术决策。
          </Zh>
        </p>

        <Diagram viewBox="0 0 640 100" label="During a network partition the link between Orders and Inventory is broken. Choosing availability accepts the order and risks overselling; choosing consistency rejects the order until Inventory answers.">
          <Box x="60" y="8" w="150" h="38" title="Orders" />
          <Box x="430" y="8" w="150" h="38" title="Inventory" />
          <Arrow d="M210,27 L295,27" tone="red" dashed />
          <Arrow d="M430,27 L345,27" tone="red" dashed />
          <text x="320" y="31" textAnchor="middle" fontSize="12" fontWeight="700" fill="#d9534f">✕</text>
          <Note x="320" y="16" color="#d9534f">network partition</Note>
          <Box x="60" y="70" w="230" h="28" title="AP: accept the order, fix oversell later" tone="green" />
          <Box x="350" y="70" w="230" h="28" title="CP: reject until Inventory answers" tone="red" />
          <Arrow d="M300,42 L200,70" />
          <Arrow d="M340,42 L450,70" />
        </Diagram>

        <h3><En>4. Scaling</En><Zh>4. 扩展</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th><En>Vertical (scale up)</En><Zh>垂直扩展（升配）</Zh></th>
              <th><En>Horizontal (scale out)</En><Zh>水平扩展（加机）</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Move</En><Zh>方式</Zh></td>
              <td><En>Bigger instance</En><Zh>换更大的实例</Zh></td>
              <td><En>More instances</En><Zh>增加实例数量</Zh></td>
            </tr>
            <tr>
              <td><En>Ceiling</En><Zh>上限</Zh></td>
              <td><En>Hard — the largest machine that exists</En><Zh>有硬上限——受限于现有最大机器</Zh></td>
              <td><En>Effectively none</En><Zh>几乎无上限</Zh></td>
            </tr>
            <tr>
              <td><En>Downtime</En><Zh>停机</Zh></td>
              <td><En>Usually a restart</En><Zh>通常需要重启</Zh></td>
              <td><En>None</En><Zh>无需停机</Zh></td>
            </tr>
            <tr>
              <td><En>Fault tolerance</En><Zh>容错性</Zh></td>
              <td><En>Still one box, still one failure</En><Zh>仍是单点，仍是单点故障</Zh></td>
              <td><En>Lose one, the rest serve</En><Zh>丢一台，其余继续服务</Zh></td>
            </tr>
            <tr>
              <td><En>Requires</En><Zh>前提条件</Zh></td>
              <td><En>Nothing</En><Zh>无特殊要求</Zh></td>
              <td><En>Statelessness, or shared state</En><Zh>无状态设计，或共享状态</Zh></td>
            </tr>
            <tr>
              <td><En>Typical for</En><Zh>适用场景</Zh></td>
              <td><En>Databases — RDS scales up, then adds read replicas</En><Zh>数据库——RDS 先升配，再加读副本</Zh></td>
              <td><En>App servers and services</En><Zh>应用服务器和微服务</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                A service is horizontally scalable when any instance can serve any request — which is
                exactly why stateless JWTs beat server-side sessions here: no instance holds anything
                another instance would need.
              </En>
              <Zh>
                当任意实例都能处理任意请求时，服务才具备水平可扩展性——这正是无状态 JWT 优于服务端 session 的原因：没有实例持有其他实例所需的数据。
              </Zh>
            </li>
            <li>
              <En>
                Anything held in one process&apos;s memory blocks this: an in-memory cache, an upload
                buffer, a WebSocket room. Move it to Redis or make it shared.
              </En>
              <Zh>
                任何只存在于单个进程内存中的数据都会阻碍水平扩展：内存缓存、上传缓冲区、WebSocket 房间。将它们迁移到 Redis 或改为共享存储。
              </Zh>
            </li>
            <li>
              <En>
                Scaling the app tier just moves the bottleneck to the database. That&apos;s when the
                database tools come back — indexes, replicas, caching, partitioning.
              </En>
              <Zh>
                扩展应用层只是把瓶颈转移到了数据库。这时数据库层面的工具就派上用场了——索引、读副本、缓存、分区。
              </Zh>
            </li>
          </ul>
        </div>
        <p><En>The flash-sale scenario — what actually needs to scale, in order:</En><Zh>秒杀场景——按优先级排列，真正需要扩展的是：</Zh></p>
        <ul>
          <li>
            <En>
              <strong>Order intake</strong> — accept fast and queue. Publishing to Kafka is cheap;
              everything downstream drains at its own pace.
            </En>
            <Zh>
              <strong>下单入口</strong>——快速接收并入队。发布到 Kafka 的开销很低；下游各服务按各自的节奏消费。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Reads, not writes</strong> — far more people check status than place orders.
              Cache and use read replicas.
            </En>
            <Zh>
              <strong>读操作，而非写操作</strong>——查看状态的人远多于下单的人。使用缓存和读副本。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Inventory</strong> — the true bottleneck, because it&apos;s the one thing that
              must be correct under contention, and correctness resists parallelism.
            </En>
            <Zh>
              <strong>库存</strong>——真正的瓶颈，因为它是唯一在并发情况下必须保证正确性的环节，而正确性天然抵制并行。
            </Zh>
          </li>
        </ul>

        <Diagram viewBox="0 0 640 130" label="Vertical scaling replaces a small machine with one big machine. Horizontal scaling puts a load balancer in front of three machines.">
          <Box x="10" y="30" w="70" h="40" title="2 CPU" />
          <Arrow d="M82,50 L128,50" />
          <Box x="130" y="14" w="110" h="72" title="16 CPU" />
          <Note x="125" y="108">Vertical — one bigger box</Note>
          <line x1="285" y1="8" x2="285" y2="120" stroke="#ccc" strokeDasharray="4 3" />
          <Box x="320" y="35" w="80" h="38" title="LB" tone="gold" />
          <Box x="470" y="8" w="130" h="28" title="instance 1" />
          <Box x="470" y="44" w="130" h="28" title="instance 2" />
          <Box x="470" y="80" w="130" h="28" title="instance 3" />
          <Arrow d="M400,48 L470,22" />
          <Arrow d="M400,54 L470,58" />
          <Arrow d="M400,60 L470,94" />
          <Note x="460" y="124">Horizontal — more boxes</Note>
        </Diagram>

        <h3><En>5. Availability and fault tolerance</En><Zh>5. 可用性与容错</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Pattern</En><Zh>模式</Zh></th>
              <th><En>Problem it solves</En><Zh>解决的问题</Zh></th>
              <th><En>Without it</En><Zh>没有它会怎样</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Timeout</En><Zh>超时（Timeout）</Zh></td>
              <td><En>A hung dependency ties up your threads and connections</En><Zh>卡住的依赖会占满你的线程和连接</Zh></td>
              <td><En>One slow service freezes every caller waiting on it</En><Zh>一个慢服务会冻结所有等待它的调用方</Zh></td>
            </tr>
            <tr>
              <td><En>Retry with backoff</En><Zh>退避重试（Retry with backoff）</Zh></td>
              <td><En>Transient failures — a dropped packet, a restart</En><Zh>瞬时故障——丢包、重启</Zh></td>
              <td><En>A blip becomes a user-visible error; instant retries stampede a recovering service</En><Zh>一次抖动就变成用户可见的错误；立即重试则会冲垮正在恢复的服务</Zh></td>
            </tr>
            <tr>
              <td><En>Circuit breaker</En><Zh>熔断器（Circuit breaker）</Zh></td>
              <td><En>A dependency that stays down</En><Zh>持续宕机的依赖</Zh></td>
              <td><En>Every request waits out the timeout, then fails — and the failure spreads upstream</En><Zh>每个请求都要等到超时才失败——故障还会向上游蔓延</Zh></td>
            </tr>
            <tr>
              <td><En>Bulkhead</En><Zh>舱壁隔离（Bulkhead）</Zh></td>
              <td><En>One slow dependency eating shared resources</En><Zh>一个慢依赖耗尽共享资源</Zh></td>
              <td><En>Slow Notification calls use up the connections Inventory also needs</En><Zh>Notification 的慢调用占满了 Inventory 同样需要的连接</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="plaintext"
          code={`Retry backoff:  wait 1s → 2s → 4s → 8s (+ random jitter), then give up

CLOSED      calls pass through normally
  │  N failures in a row
  ▼
OPEN        calls fail instantly with a fallback — no waiting
  │  after T seconds
  ▼
HALF-OPEN   let one trial call through
  ├─ succeeds → CLOSED
  └─ fails    → OPEN`}
        />
        <p className="callout">
          <En>
            Only retry calls that are safe to repeat — retrying &quot;place order&quot; without an idempotency
            key can charge the customer twice.
          </En>
          <Zh>
            只重试可以安全重复执行的调用——对"下单"重试而不带幂等键（idempotency key），可能会重复扣款。
          </Zh>
        </p>

        <Diagram viewBox="0 0 640 130" label="Orders calls Inventory through a circuit breaker that applies a timeout and retries with backoff. When Inventory is down, the breaker opens and returns a fallback immediately.">
          <Box x="10" y="20" w="110" h="44" title="Orders" />
          <Box x="190" y="10" w="170" h="64" title="Circuit breaker" sub="timeout · retry + backoff" tone="gold" />
          <Box x="430" y="20" w="110" h="44" title="Inventory" sub="down" tone="red" />
          <Arrow d="M120,42 L190,42" />
          <Arrow d="M360,42 L430,42" tone="red" dashed />
          <Note x="395" y="36" color="#d9534f">hung</Note>
          <Box x="190" y="92" w="170" h="30" title="fallback: cached answer" tone="green" />
          <Arrow d="M275,74 L275,92" />
          <Note x="385" y="111" anchor="start">Bulkhead: Orders keeps a separate pool per dependency</Note>
        </Diagram>

        <h3><En>6. Caching</En><Zh>6. 缓存</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Layer</En><Zh>层级</Zh></th>
              <th><En>Caches</En><Zh>缓存内容</Zh></th>
              <th><En>Trade-off</En><Zh>权衡</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Browser</En><Zh>浏览器</Zh></td>
              <td><En>Static files, responses marked <code>Cache-Control</code></En><Zh>静态文件、带 <code>Cache-Control</code> 的响应</Zh></td>
              <td><En>Fastest — but you can&apos;t clear it on a user&apos;s device</En><Zh>最快——但你无法清除用户设备上的缓存</Zh></td>
            </tr>
            <tr>
              <td><En>CDN edge</En><Zh>CDN 边缘节点</Zh></td>
              <td><En>Static files, public pages</En><Zh>静态文件、公开页面</Zh></td>
              <td><En>Close to the user — stale until the TTL ends or you invalidate</En><Zh>离用户近——TTL 到期或主动失效前内容会过时</Zh></td>
            </tr>
            <tr>
              <td><En>Application (Redis)</En><Zh>应用层（Redis）</Zh></td>
              <td><En>Query results, sessions, computed values</En><Zh>查询结果、会话、计算结果</Zh></td>
              <td><En>Shared by every instance — you manage invalidation</En><Zh>所有实例共享——需要自己管理失效</Zh></td>
            </tr>
            <tr>
              <td><En>Database</En><Zh>数据库</Zh></td>
              <td><En>Hot pages in the database&apos;s own memory</En><Zh>数据库自身内存中的热点数据页</Zh></td>
              <td><En>Automatic — no control</En><Zh>自动完成——无法控制</Zh></td>
            </tr>
          </tbody>
        </table>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Strategy</En><Zh>策略</Zh></th>
              <th><En>How</En><Zh>做法</Zh></th>
              <th><En>Strength</En><Zh>优点</Zh></th>
              <th><En>Weakness</En><Zh>缺点</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cache-aside</td>
              <td><En>App checks the cache; on a miss it reads the DB and fills the cache</En><Zh>应用先查缓存；未命中则读数据库并回填缓存</Zh></td>
              <td><En>Simple; caches only what&apos;s asked for</En><Zh>简单；只缓存被请求过的数据</Zh></td>
              <td><En>First read after expiry is slow; can serve stale data</En><Zh>过期后的第一次读取很慢；可能返回过时数据</Zh></td>
            </tr>
            <tr>
              <td>Write-through</td>
              <td><En>Every write goes to the cache and the DB together</En><Zh>每次写入同时写缓存和数据库</Zh></td>
              <td><En>Cache is always fresh</En><Zh>缓存始终是最新的</Zh></td>
              <td><En>Slower writes; caches data nobody reads</En><Zh>写入变慢；会缓存无人读取的数据</Zh></td>
            </tr>
            <tr>
              <td>Write-behind</td>
              <td><En>Write to the cache, flush to the DB later</En><Zh>先写缓存，稍后再刷入数据库</Zh></td>
              <td><En>Fastest writes</En><Zh>写入最快</Zh></td>
              <td><En>Data lost if the cache dies before the flush</En><Zh>缓存在刷盘前宕机会丢数据</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          code={`async function getProduct(id: string) {
  const cached = await redis.get(\`product:\${id}\`);
  if (cached) return JSON.parse(cached);

  const product = await db.products.findById(id);
  await redis.set(\`product:\${id}\`, JSON.stringify(product), { EX: 300 });
  return product;
}`}
        />
        <p className="callout">
          <En>
            Redis, not in-process memory, is what lets every instance share one cache — and a stale entry is
            fixed either by a TTL or by deleting the key on write.
          </En>
          <Zh>
            让所有实例共享同一份缓存的是 Redis，而不是进程内存——过时的缓存条目要么靠 TTL 过期，要么在写入时删除对应的 key。
          </Zh>
        </p>

        <Diagram viewBox="0 0 640 74" label="A request travels through four cache layers, each closer to the data: the browser cache, the CDN edge, Redis in the application tier, and finally the database. A miss moves to the next layer.">
          <Box x="10" y="12" w="120" h="38" title="Browser" sub="per device" />
          <Box x="180" y="12" w="120" h="38" title="CDN edge" sub="per region" />
          <Box x="350" y="12" w="120" h="38" title="Redis" sub="shared by all instances" />
          <Box x="520" y="12" w="110" h="38" title="Database" sub="source of truth" tone="gold" />
          <Arrow d="M130,31 L180,31" />
          <Arrow d="M300,31 L350,31" />
          <Arrow d="M470,31 L520,31" />
          <Note x="155" y="64">miss →</Note>
          <Note x="325" y="64">miss →</Note>
          <Note x="495" y="64">miss →</Note>
        </Diagram>

        <h3><En>7. Storage selection</En><Zh>7. 存储选型</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Type</En><Zh>类型</Zh></th>
              <th><En>Use when</En><Zh>适用场景</Zh></th>
              <th><En>Avoid when</En><Zh>不适用场景</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Relational — PostgreSQL</En><Zh>关系型——PostgreSQL</Zh></td>
              <td><En>Strong consistency, joins, transactions</En><Zh>强一致性、关联查询、事务</Zh></td>
              <td><En>Schema varies wildly at huge scale</En><Zh>超大规模且数据结构千变万化</Zh></td>
            </tr>
            <tr>
              <td><En>Document — MongoDB</En><Zh>文档型——MongoDB</Zh></td>
              <td><En>Flexible schema, nested objects, fast iteration</En><Zh>灵活的结构、嵌套对象、快速迭代</Zh></td>
              <td><En>You need multi-document transactions</En><Zh>需要跨文档事务</Zh></td>
            </tr>
            <tr>
              <td><En>Key-value — Redis</En><Zh>键值型——Redis</Zh></td>
              <td><En>Cache, sessions, counters, rate limits</En><Zh>缓存、会话、计数器、限流</Zh></td>
              <td><En>Data is relational or needs rich queries</En><Zh>数据具有关联性或需要复杂查询</Zh></td>
            </tr>
            <tr>
              <td><En>Time-series — TimescaleDB</En><Zh>时序型——TimescaleDB</Zh></td>
              <td><En>Metrics, IoT readings, anything queried by time range</En><Zh>监控指标、物联网数据、按时间范围查询的数据</Zh></td>
              <td><En>General application data</En><Zh>通用业务数据</Zh></td>
            </tr>
            <tr>
              <td><En>Search — Elasticsearch</En><Zh>搜索型——Elasticsearch</Zh></td>
              <td><En>Full-text search, filtering by many facets</En><Zh>全文搜索、多维度筛选</Zh></td>
              <td><En>As the primary source of truth</En><Zh>作为主数据源</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            The safe default answer: PostgreSQL as the source of truth, Redis for speed — justify anything beyond that.
          </En>
          <Zh>
            稳妥的默认答案：PostgreSQL 作为主数据源，Redis 提速——超出这个组合的选择，都需要给出理由。
          </Zh>
        </p>

        <Diagram viewBox="0 0 640 118" label="The services layer uses different stores for different jobs: PostgreSQL for orders, MongoDB for the product catalog, Redis for cache and sessions, Elasticsearch for search, and TimescaleDB for metrics.">
          <Box x="250" y="6" w="140" h="30" title="Services" />
          <Box x="10" y="76" w="112" h="40" title="PostgreSQL" sub="orders, payments" />
          <Box x="136" y="76" w="112" h="40" title="MongoDB" sub="product catalog" />
          <Box x="262" y="76" w="112" h="40" title="Redis" sub="cache, sessions" />
          <Box x="388" y="76" w="112" h="40" title="Elasticsearch" sub="product search" />
          <Box x="514" y="76" w="116" h="40" title="TimescaleDB" sub="metrics over time" />
          <Arrow d="M320,36 L66,76" />
          <Arrow d="M320,36 L192,76" />
          <Arrow d="M320,36 L318,76" />
          <Arrow d="M320,36 L444,76" />
          <Arrow d="M320,36 L572,76" />
        </Diagram>

        <h3><En>8. DNS</En><Zh>8. DNS</Zh></h3>
        <ol>
          <li>
            <En>The browser is given a domain, such as <code>orders.retailco.com</code>, but needs an IP address to connect to.</En>
            <Zh>浏览器拿到一个域名，例如 <code>orders.retailco.com</code>，但连接服务器需要的是 IP 地址。</Zh>
          </li>
          <li>
            <En>It asks a <strong>DNS server</strong>: &quot;what is the IP address for this domain?&quot;</En>
            <Zh>它向 <strong>DNS 服务器</strong>询问：“这个域名对应的 IP 地址是什么？”</Zh>
          </li>
          <li>
            <En>The DNS server finds the matching record and returns the IP address, <code>52.10.4.18</code>.</En>
            <Zh>DNS 服务器找到匹配的记录，并返回 IP 地址 <code>52.10.4.18</code>。</Zh>
          </li>
          <li>
            <En>The browser sends its request to that IP address.</En>
            <Zh>浏览器向这个 IP 地址发送请求。</Zh>
          </li>
        </ol>
        <Diagram viewBox="0 0 640 126" label="The browser asks a DNS server for the IP address of orders.retailco.com, the DNS server replies with 52.10.4.18, and the browser then sends its request to the web server at that IP address.">
          <Box x="10" y="40" w="110" h="44" title="Browser" />
          <Box x="270" y="40" w="110" h="44" title="DNS server" tone="gold" sub="domain → IP" />
          <Box x="500" y="40" w="130" h="44" title="Web server" sub="52.10.4.18" />
          <Arrow d="M120,52 L270,52" />
          <Note x="195" y="46" color="#444">1  orders.retailco.com?</Note>
          <Arrow d="M270,74 L120,74" tone="purple" />
          <Note x="195" y="88" color="#8e5fd6">2  52.10.4.18</Note>
          <Arrow d="M65,84 L65,114 L565,114 L565,84" />
          <Note x="315" y="108" color="#444">3  request sent to 52.10.4.18</Note>
        </Diagram>

        <h3><En>9. CDN</En><Zh>9. CDN</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Put on the CDN</En><Zh>放到 CDN 上</Zh></th>
              <th><En>Never on the CDN</En><Zh>绝不放到 CDN 上</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>JS/CSS bundles, fonts</En><Zh>JS/CSS 打包文件、字体</Zh></td>
              <td><En>Order status — personal and changes constantly</En><Zh>订单状态——包含个人信息且频繁变动</Zh></td>
            </tr>
            <tr>
              <td><En>Product images</En><Zh>商品图片</Zh></td>
              <td><En>Inventory counts — must be correct, not fast</En><Zh>库存数量——需要准确，而不是快速</Zh></td>
            </tr>
            <tr>
              <td><En>Anything with a content hash in its filename</En><Zh>文件名含内容哈希的任何资源</Zh></td>
              <td><En>Any authenticated response</En><Zh>任何需要身份验证的响应</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            Cache by content hash (<code>app.9f2c1a.js</code>) and you can set a one-year TTL safely —
            a new build is a new filename, so invalidation stops being a problem you have.
          </En>
          <Zh>
            按内容哈希缓存（如 <code>app.9f2c1a.js</code>），就可以安全地设置一年的 TTL——新构建会生成新文件名，缓存失效问题从此不再存在。
          </Zh>
        </p>

        <Diagram viewBox="0 0 640 124" label="Static files take the CDN path from the browser to the CDN edge and then to the S3 origin on a miss. Personal data such as GET /api/orders skips the CDN and goes straight to the load balancer and services.">
          <Box x="10" y="34" w="90" h="56" title="Browser" />
          <Box x="210" y="8" w="140" h="38" title="CDN edge" tone="gold" sub="hit: answered here" />
          <Box x="470" y="8" w="150" h="38" title="S3 origin" sub="only on a miss" dashed />
          <Arrow d="M100,50 C150,50 160,27 210,27" />
          <Arrow d="M350,27 L470,27" dashed />
          <Note x="150" y="22" color="#444">app.9f2c1a.js</Note>
          <Box x="210" y="78" w="140" h="38" title="Load balancer" tone="gold" />
          <Box x="470" y="78" w="150" h="38" title="Services" />
          <Arrow d="M100,74 C150,74 160,97 210,97" />
          <Arrow d="M350,97 L470,97" />
          <Note x="10" y="120" anchor="start" color="#444">GET /api/orders — never cached</Note>
        </Diagram>

        <h3><En>10. The frontend layer</En><Zh>10. 前端层</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>React</th>
              <th>Angular</th>
              <th>Next.js</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>What it is</En><Zh>是什么</Zh></td>
              <td><En>A UI library</En><Zh>UI 库</Zh></td>
              <td><En>A full framework — routing, forms, HTTP built in</En><Zh>完整框架——内置路由、表单、HTTP</Zh></td>
              <td><En>A React framework that adds routing and server rendering</En><Zh>基于 React 的框架，增加了路由和服务端渲染</Zh></td>
            </tr>
            <tr>
              <td><En>Opinions</En><Zh>约束程度</Zh></td>
              <td><En>Few — you pick the router, state, data fetching</En><Zh>很少——路由、状态管理、数据请求都自己选</Zh></td>
              <td><En>Many — one prescribed way to do things</En><Zh>很多——只有一种规定的做法</Zh></td>
              <td><En>Some — conventions for files and routes</En><Zh>适中——文件和路由有约定</Zh></td>
            </tr>
            <tr>
              <td><En>Early speed</En><Zh>早期开发速度</Zh></td>
              <td><En>Fast and flexible</En><Zh>快速且灵活</Zh></td>
              <td><En>Slower start, more to learn</En><Zh>起步较慢，要学的更多</Zh></td>
              <td><En>Fast — setup is already done</En><Zh>快——基础配置已经就绪</Zh></td>
            </tr>
            <tr>
              <td><En>As the team grows</En><Zh>团队变大后</Zh></td>
              <td><En>Conventions drift; every team invents its own</En><Zh>约定逐渐分化，每个团队各搞一套</Zh></td>
              <td><En>Consistent; a new engineer already knows the layout</En><Zh>高度一致；新人一看就懂项目结构</Zh></td>
              <td><En>More structure than plain React</En><Zh>比纯 React 更有章法</Zh></td>
            </tr>
            <tr>
              <td><En>Best fit</En><Zh>最适合</Zh></td>
              <td><En>Startups, experiments, mixed stacks</En><Zh>创业公司、实验项目、混合技术栈</Zh></td>
              <td><En>Large teams, long-lived enterprise apps</En><Zh>大型团队、长期维护的企业应用</Zh></td>
              <td><En>Public pages that need SEO and a fast first load</En><Zh>需要 SEO 和快速首屏的公开页面</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="plaintext"
          code={`Plain React app (client-side rendering)
  1. Browser receives almost-empty HTML:   <div id="root"></div>
  2. Browser downloads and runs the JS bundle
  3. React builds the page                 ← blank screen until here
  Crawlers that don't run JS see an empty page → poor SEO

Server-side rendering (Next.js)
  1. Server runs React and builds the full HTML
  2. Browser gets real content immediately ← fast first paint, crawlers see it
  3. JS loads and "hydrates" the page: attaches the click handlers`}
        />
        <p className="callout">
          <En>
            Choose by team size and project lifespan, not by which is &quot;better&quot; — and reach for Next.js when
            SEO and first-load speed matter.
          </En>
          <Zh>
            根据团队规模和项目生命周期来选择，而不是看谁"更好"——当 SEO 和首屏速度重要时，选 Next.js。
          </Zh>
        </p>

        <Diagram viewBox="0 0 640 150" label="A React single-page app receives an empty HTML shell, then downloads and runs JavaScript before any content appears. Next.js server-side rendering sends full HTML so content is visible first, and JavaScript hydrates it afterwards.">
          <Note x="10" y="26" anchor="start" color="#1c1c1c">React SPA</Note>
          <Box x="100" y="10" w="150" h="38" title="Empty HTML shell" />
          <Box x="280" y="10" w="150" h="38" title="Download + run JS" tone="red" sub="blank screen" />
          <Box x="460" y="10" w="170" h="38" title="Content appears" />
          <Arrow d="M250,29 L280,29" />
          <Arrow d="M430,29 L460,29" />
          <Note x="10" y="106" anchor="start" color="#1c1c1c">Next.js SSR</Note>
          <Box x="100" y="90" w="150" h="38" title="Server builds HTML" />
          <Box x="280" y="90" w="150" h="38" title="Content visible" tone="green" sub="crawlers see it too" />
          <Box x="460" y="90" w="170" h="38" title="JS hydrates" sub="becomes interactive" />
          <Arrow d="M250,109 L280,109" />
          <Arrow d="M430,109 L460,109" />
        </Diagram>

        <h3><En>11. Load balancing</En><Zh>11. 负载均衡</Zh></h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Algorithm</En><Zh>算法</Zh></th>
              <th><En>How it picks</En><Zh>选择方式</Zh></th>
              <th><En>Good when</En><Zh>适用场景</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Round robin</En><Zh>轮询（Round robin）</Zh></td>
              <td><En>Next instance in order</En><Zh>按顺序选下一个实例</Zh></td>
              <td><En>Requests cost about the same</En><Zh>请求耗时相近</Zh></td>
            </tr>
            <tr>
              <td><En>Least connections</En><Zh>最少连接（Least connections）</Zh></td>
              <td><En>Fewest open connections</En><Zh>选当前连接数最少的实例</Zh></td>
              <td><En>Request durations vary a lot</En><Zh>请求耗时差异较大</Zh></td>
            </tr>
            <tr>
              <td><En>IP hash / sticky</En><Zh>IP 哈希 / 粘性会话（Sticky）</Zh></td>
              <td><En>Same client → same instance</En><Zh>同一客户端始终路由到同一实例</Zh></td>
              <td><En>Forced to, by WebSockets or sessions</En><Zh>因 WebSocket 或 session 而被迫使用</Zh></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                The <strong>health check</strong> is the part that matters most — it&apos;s what lets
                the balancer pull a sick instance out before users notice.
              </En>
              <Zh>
                <strong>健康检查</strong>是最关键的部分——它让负载均衡器在用户察觉之前，将故障实例从轮询中剔除。
              </Zh>
            </li>
            <li>
              <En>
                A health check must test what the service actually needs. One that returns{" "}
                <code>200</code> without touching the database will happily keep routing traffic to an
                instance that can&apos;t serve a single request.
              </En>
              <Zh>
                健康检查必须真正测试服务所依赖的内容。一个不查询数据库就返回 <code>200</code> 的检查，会继续把流量路由到根本无法处理任何请求的实例。
              </Zh>
            </li>
            <li>
              <En>
                <strong>Connection draining</strong> is what makes a zero-downtime deploy possible:
                stop sending new requests to an instance, let in-flight ones finish, then replace it —
                a single server with no load balancer in front of it has no way to do this.
              </En>
              <Zh>
                <strong>连接排空（Connection draining）</strong>是实现零停机部署的关键：停止向某个实例发送新请求，等待进行中的请求完成，再替换它——没有负载均衡器的单台服务器无法做到这一点。
              </Zh>
            </li>
          </ul>
        </div>

        <Diagram viewBox="0 0 640 130" label="Clients send requests to a load balancer, which runs a health check against three instances. Two pass and receive traffic; the third fails, is shown in red, and receives none.">
          <Box x="10" y="46" w="90" h="38" title="Clients" />
          <Box x="170" y="46" w="120" h="38" title="Load balancer" tone="gold" sub="health checks" />
          <Box x="390" y="8" w="150" h="30" title="instance A  ✓" tone="green" />
          <Box x="390" y="50" w="150" h="30" title="instance B  ✓" tone="green" />
          <Box x="390" y="92" w="150" h="30" title="instance C  ✕" tone="red" />
          <Arrow d="M100,65 L170,65" />
          <Arrow d="M290,58 L390,23" />
          <Arrow d="M290,65 L390,65" />
          <Arrow d="M290,72 L390,107" tone="red" dashed />
          <Note x="565" y="110" anchor="start" color="#d9534f">pulled out</Note>
        </Diagram>

        <h3><En>12. Security in architecture</En><Zh>12. 架构中的安全</Zh></h3>
        <ol>
          <li>
            <En><strong>Keep databases and services off the internet</strong> (private subnet) — only the load balancer has a public address.</En>
            <Zh><strong>让数据库和服务远离公网</strong>（私有子网，private subnet）——只有负载均衡器拥有公网地址。</Zh>
          </li>
          <li>
            <En><strong>Block bad traffic before it reaches your servers</strong> (WAF) — a filter at the edge drops known attack patterns and caps requests per IP.</En>
            <Zh><strong>在恶意流量到达服务器之前拦截它</strong>（WAF）——边缘的过滤器丢弃已知攻击模式，并限制每个 IP 的请求数。</Zh>
          </li>
          <li>
            <En><strong>Encrypt at the front door</strong> (TLS termination) — HTTPS ends at the load balancer; traffic inside the private network is plain HTTP, so there is one certificate to manage.</En>
            <Zh><strong>在入口处加密</strong>（TLS 终止）——HTTPS 在负载均衡器处结束；私有网络内部使用普通 HTTP，因此只需管理一张证书。</Zh>
          </li>
          <li>
            <En><strong>Never hard-code passwords</strong> (secrets manager) — services fetch the database password from a vault at startup.</En>
            <Zh><strong>永远不要把密码写死在代码里</strong>（密钥管理服务）——服务在启动时从保险库中获取数据库密码。</Zh>
          </li>
        </ol>
        <svg viewBox="0 0 640 430" role="img" aria-label="AWS security layout. Users reach Route 53 for DNS and CloudFront with AWS WAF at the edge. Inside a VPC, an Application Load Balancer sits in a public subnet and terminates TLS. Below it, in a private subnet with no public IP, the services talk to RDS PostgreSQL and ElastiCache Redis, and fetch passwords from Secrets Manager.">
          <defs>
            <marker id="sec-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#444" />
            </marker>
          </defs>

          <rect x="220" y="8" width="170" height="28" rx="14" fill="#f4f4f4" stroke="#999" strokeWidth="1.5" />
          <text x="305" y="26" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">Internet / users</text>

          <rect x="20" y="55" width="130" height="34" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="85" y="70" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">Route 53</text>
          <text x="85" y="82" textAnchor="middle" fontSize="8" fill="#5b6b82">DNS</text>
          <path d="M220,22 Q85,22 85,55" fill="none" stroke="#444" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#sec-arrow)" />

          <rect x="220" y="55" width="400" height="44" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="420" y="74" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">CloudFront CDN + AWS WAF</text>
          <text x="420" y="88" textAnchor="middle" fontSize="8" fill="#5b6b82">cache static files · filter bad traffic · HTTPS</text>
          <path d="M305,36 L305,55" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#sec-arrow)" />
          <Tag x={606} y={66} n={2} color="#d9730d" />

          <rect x="20" y="125" width="600" height="295" rx="8" fill="none" stroke="#666" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="32" y="141" fontSize="10" fontWeight="700" fill="#555">VPC</text>

          <rect x="35" y="150" width="570" height="62" rx="6" fill="#eaf6ec" stroke="#7cc08a" strokeWidth="1.5" />
          <text x="595" y="166" textAnchor="end" fontSize="9" fill="#3a7a49">Public subnet</text>
          <rect x="90" y="163" width="240" height="38" rx="6" fill="#fff7e0" stroke="#e8b400" strokeWidth="2" />
          <text x="210" y="179" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">Application Load Balancer</text>
          <text x="210" y="193" textAnchor="middle" fontSize="8" fill="#5b6b82">TLS ends here · health checks</text>
          <Tag x={90} y={163} n={3} color="#d9730d" />
          <path d="M420,99 C420,150 360,182 330,182" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#sec-arrow)" />

          <rect x="35" y="232" width="570" height="175" rx="6" fill="#f1f4fa" stroke="#9aa9c4" strokeWidth="1.5" />
          <Tag x={48} y={246} n={1} color="#d9730d" />
          <text x="62" y="250" fontSize="9" fill="#4a5a78">Private subnet — no public IP</text>
          <path d="M210,201 L210,262" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#sec-arrow)" />

          <rect x="60" y="262" width="300" height="50" rx="8" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="210" y="283" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">Users · Orders · Inventory services</text>
          <text x="210" y="300" textAnchor="middle" fontSize="9" fill="#5b6b82">ECS / EC2, scaled out</text>

          <rect x="60" y="345" width="140" height="45" rx="8" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="130" y="365" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">RDS PostgreSQL</text>
          <text x="130" y="380" textAnchor="middle" fontSize="8" fill="#5b6b82">no route from the internet</text>
          <rect x="220" y="345" width="140" height="45" rx="8" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="290" y="365" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">ElastiCache</text>
          <text x="290" y="380" textAnchor="middle" fontSize="8" fill="#5b6b82">Redis cache</text>
          <path d="M130,312 L130,345" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#sec-arrow)" />
          <path d="M290,312 L290,345" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#sec-arrow)" />

          <rect x="410" y="285" width="175" height="50" rx="8" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
          <text x="497" y="306" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">Secrets Manager</text>
          <text x="497" y="321" textAnchor="middle" fontSize="8" fill="#5b6b82">DB passwords, API keys</text>
          <Tag x={585} y={285} n={4} color="#d9730d" />
          <path d="M360,293 L410,305" fill="none" stroke="#8e5fd6" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#sec-arrow)" />
        </svg>

        <h3><En>13. Worth knowing by name</En><Zh>13. 值得记住的名词</Zh></h3>
        <ul>
          <li>
            <En><strong>Observability</strong> — logs (what happened), metrics (how much, how fast), traces (which service made this request slow). Tools: CloudWatch, Prometheus + Grafana, OpenTelemetry.</En>
            <Zh><strong>可观测性（Observability）</strong>——日志（发生了什么）、指标（多少、多快）、链路追踪（哪个服务拖慢了请求）。工具：CloudWatch、Prometheus + Grafana、OpenTelemetry。</Zh>
          </li>
        </ul>

        <Diagram viewBox="0 0 640 112" label="Every service emits logs, metrics and traces, which flow into a monitoring tool such as CloudWatch or Grafana that drives dashboards and alerts.">
          <Box x="10" y="38" w="110" h="34" title="Services" />
          <Box x="190" y="2" w="120" h="32" title="Logs" sub="what happened" />
          <Box x="190" y="40" w="120" h="32" title="Metrics" sub="how much, how fast" />
          <Box x="190" y="78" w="120" h="32" title="Traces" sub="which hop was slow" />
          <Box x="390" y="33" w="130" h="44" title="CloudWatch / Grafana" tone="grey" />
          <Box x="560" y="41" w="70" h="28" title="Alerts" tone="red" />
          <Arrow d="M120,55 L190,18" />
          <Arrow d="M120,55 L190,56" />
          <Arrow d="M120,55 L190,94" />
          <Arrow d="M310,18 L390,45" />
          <Arrow d="M310,56 L390,55" />
          <Arrow d="M310,94 L390,65" />
          <Arrow d="M520,55 L560,55" />
        </Diagram>

        <h3><En>14. The whole system, one diagram</En><Zh>14. 整个系统，一张图</Zh></h3>
        <Diagram viewBox="0 0 800 700" label="The complete architecture. A browser resolves DNS through Route 53 and reaches CloudFront with WAF, which fetches from S3 and Next.js. Inside a VPC, the API Gateway feeds a load balancer, then a GraphQL BFF, which fans out to Users, Orders, Inventory and Notification services, each run as several instances. A separate Realtime service holds a two-way WebSocket with the browser and is routed straight through the load balancer, skipping the BFF. Users use a Redis cache, Orders has an RDS database with a read replica, Inventory has its own RDS database, and Orders publishes order.placed to Kafka, which Inventory, Notification and Realtime consume. Secrets Manager serves the services and CloudWatch collects logs, metrics and traces from all of them.">
          <Box x="130" y="14" w="120" h="38" title="Route 53" sub="DNS" />
          <Box x="340" y="8" w="120" h="50" title="Browser" sub="React SPA / Next.js" />
          <Arrow d="M340,33 L250,33" dashed />
          <Tag x={250} y={14} n={8} />

          <Box x="280" y="85" w="240" h="44" title="CloudFront CDN + WAF" sub="cache static · filter bad traffic" />
          <Arrow d="M400,58 L400,85" />
          <Tag x={520} y={85} n={9} />
          <Box x="560" y="85" w="130" h="44" title="S3 · Next.js SSR" sub="static files · rendered HTML" />
          <Arrow d="M520,107 L560,107" />
          <Tag x={690} y={85} n={10} />

          <Arrow d="M460,26 L700,26 L700,400" />
          <Arrow d="M725,400 L725,42 L460,42" />
          <Note x="580" y="20" color="#444">WebSocket: events →</Note>
          <Note x="580" y="60" color="#444">← live status pushed</Note>

          <rect x="10" y="150" width="780" height="480" rx="8" fill="none" stroke="#666" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="22" y="167" fontSize="10" fontWeight="700" fill="#555">VPC — services and data in private subnets</text>
          <Tag x={262} y={163} n={12} />

          <Box x="300" y="175" w="200" h="46" title="API Gateway" sub="routing · auth · rate limit" tone="gold" />
          <Arrow d="M400,129 L400,175" />
          <Tag x={500} y={245} n={11} />
          <Box x="300" y="245" w="200" h="46" title="Load balancer" sub="health checks · multi-AZ" tone="gold" />
          <Arrow d="M400,221 L400,245" />
          <Box x="300" y="315" w="200" h="46" title="GraphQL BFF" sub="one response from many services" tone="gold" />
          <Arrow d="M400,291 L400,315" />

          <Box x="20" y="245" w="150" h="46" title="Secrets Manager" sub="passwords, keys" tone="purple" />
          <Arrow d="M60,291 L60,400" tone="purple" dashed />

          <Note x="285" y="334" anchor="end" color="#b04a00">timeout · retry</Note>
          <Note x="285" y="346" anchor="end" color="#b04a00">circuit breaker</Note>
          <Tag x={190} y={340} n={5} />

          <Box x="20" y="400" w="130" h="46" title="Users" sub="× N instances" />
          <Box x="170" y="400" w="130" h="46" title="Orders" sub="× N instances" />
          <Box x="320" y="400" w="130" h="46" title="Inventory" sub="× N instances" />
          <Box x="470" y="400" w="130" h="46" title="Notification" sub="× N instances" />
          <Box x="640" y="400" w="140" h="46" title="Realtime" sub="WebSocket server" />
          <Tag x={150} y={400} n={4} />

          <Arrow d="M400,361 C400,380 100,380 100,400" />
          <Arrow d="M400,361 C400,380 235,380 235,400" />
          <Arrow d="M400,361 C400,380 385,380 385,400" />
          <Arrow d="M400,361 C400,380 535,380 535,400" />
          <Arrow d="M500,268 L670,268 L670,400" />
          <Note x="585" y="262" color="#444">routed straight through — no BFF</Note>

          <Box x="20" y="490" w="130" h="46" title="ElastiCache" sub="Redis cache" tone="red" />
          <Tag x={150} y={490} n={6} />
          <Arrow d="M85,446 L85,490" />
          <Box x="170" y="490" w="110" h="46" title="RDS" sub="+ read replica" />
          <Tag x={280} y={490} n={7} />
          <Arrow d="M225,446 L225,490" />
          <Box x="320" y="490" w="110" h="46" title="RDS" sub="stock — CP" />
          <Tag x={430} y={490} n={3} />
          <Arrow d="M375,446 L375,490" />

          <Box x="170" y="560" w="610" h="34" title="Kafka / SQS: order.placed" tone="purple" />
          <Arrow d="M290,446 L290,560" tone="purple" />
          <Arrow d="M440,560 L440,446" tone="purple" />
          <Arrow d="M535,560 L535,446" tone="purple" />
          <Arrow d="M710,560 L710,446" tone="purple" />

          <Box x="170" y="655" w="610" h="32" title="CloudWatch — logs · metrics · traces from every service" tone="grey" />
          <Arrow d="M475,630 L475,655" dashed />
          <Tag x={780} y={655} n={13} />
        </Diagram>
        <CodeBlock
          language="plaintext"
          code={`3 CAP · 4 Scaling · 5 Fault tolerance · 6 Caching · 7 Storage · 8 DNS
9 CDN · 10 Frontend · 11 Load balancing · 12 Security · 13 Observability`}
        />
        <p className="callout">
          <En>
            Point at any box and say which section explains it — that is the review.
          </En>
          <Zh>
            指着任意一个方框，说出是哪一节在讲它——这就是复习。
          </Zh>
        </p>
      </section>
    </div>
  );
}
