import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  StateLadder,
  FrontendPerf,
  OrderSequence,
  OwnershipAndAuth,
  SyncVsAsync,
  CacheAside,
  BoundaryCosts,
  Pipeline,
  BigArchitecture,
  BigDelivery,
  BigFailureMap,
} from "./Diagrams";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 25 Notes</title>
      <DayNav day="day25-backend-review" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">Week 5 · Day 25 · Notes</p>
        <h1>Full Framework Review</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to do by the end of today:</En>
          <Zh>核心要点——今天结束时你必须做到：</Zh>
        </p>
        <ul>
          <li>
            <En>Draw the whole system, browser to database, from memory and name what every box does</En>
            <Zh>凭记忆画出整个系统（从浏览器到数据库），并说出每个模块的作用</Zh>
          </li>
          <li>
            <En>Trace one order end to end across web, gateway, service, cache, database, Kafka, and consumers</En>
            <Zh>完整追踪一个订单的流转：web、gateway、service、缓存、数据库、Kafka 和 consumer</Zh>
          </li>
          <li>
            <En>Say where state lives on the frontend (local, Context, Redux, server cache) and why</En>
            <Zh>说清前端状态应该放在哪（本地、Context、Redux、服务端缓存）以及原因</Zh>
          </li>
          <li>
            <En>Name the cost of every boundary (layer, service, event, cache), not just the benefit</En>
            <Zh>说出每一道边界（分层、服务、事件、缓存）的代价，而不只是好处</Zh>
          </li>
          <li>
            <En>Explain how a change gets from ticket to production safely: tests, CI/CD, monitoring, rollback</En>
            <Zh>解释一个改动如何安全地从 ticket 走到生产：测试、CI/CD、监控、回滚</Zh>
          </li>
          <li>
            <En>Tell the overselling bug story, from seeded to fixed, in five minutes, out loud</En>
            <Zh>用五分钟口头讲完 overselling bug 的完整经过：从埋下到修复</Zh>
          </li>
        </ul>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ───────────── 1. big pictures ───────────── */}
        <h3>
          <En>1. The big pictures</En>
          <Zh>1. 三张总图</Zh>
        </h3>
        <p>
          <En>Look at these three maps first; everything below is a review of their parts.</En>
          <Zh>先看这三张图；下面的内容都是对图中各部分的复习。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>1.1 The architecture: seven layers, one order</En>
          <Zh>1.1 架构图：七层，一个订单</Zh>
        </h4>
        <BigArchitecture />
        <ul>
          <li>
            <En>Read top to bottom: each band is one layer, and each number is one hop of an order.</En>
            <Zh>从上往下读：每个色带是一层，每个数字是订单的一跳。</Zh>
          </li>
          <li>
            <En>Hops 1–5 are what the customer waits for; 6 and 7 happen afterwards, asynchronously.</En>
            <Zh>第 1–5 步是用户要等待的；第 6、7 步在之后异步发生。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.2 The cycle: from sprint to production and back</En>
          <Zh>1.2 流程图：从 sprint 到生产，再回到起点</Zh>
        </h4>
        <BigDelivery />
        <ul>
          <li>
            <En>The top loop is how the team plans; the middle loop is how one change ships.</En>
            <Zh>上面的循环是团队如何规划；中间的循环是一个改动如何上线。</Zh>
          </li>
          <li>
            <En>Both loops feed back: an incident becomes a ticket, and a retro changes how the next sprint runs.</En>
            <Zh>两个循环都会反馈：事故变成新的 ticket，retro 改变下一个 sprint 的做法。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.3 What breaks where, and what catches it</En>
          <Zh>1.3 什么会在哪里出问题，由什么来兜住</Zh>
        </h4>
        <BigFailureMap />
        <ul>
          <li>
            <En>Every failure needs both a defence that prevents it and a signal that proves it happened.</En>
            <Zh>每种故障都需要两样东西：预防它的防御手段，以及证明它发生过的信号。</Zh>
          </li>
        </ul>

        {/* ───────────── 2. frontend state ───────────── */}
        <h3>
          <En>2. Frontend: where does state live?</En>
          <Zh>2. 前端：状态应该放在哪？</Zh>
        </h3>
        <p>
          <En>Pain point: the cart is needed by the product list, the navbar badge, and checkout.</En>
          <Zh>痛点：购物车同时被商品列表、导航栏角标和结算页使用。</Zh>
        </p>
        <StateLadder />
        <CodeBlock
          language="typescript"
          code={`const cart = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[] },
  reducers: {
    added(state, a: PayloadAction<CartItem>) { state.items.push(a.payload); },
    removed(state, a: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.sku !== a.payload);
    },
  },
});`}
        />
        <ul>
          <li>
            <En>Context fits values that rarely change; every consumer re-renders when it does.</En>
            <Zh>Context 适合很少变化的值；一旦变化，所有使用者都会重新渲染。</Zh>
          </li>
          <li>
            <En>Redux Toolkit lets the reducer look like mutation; Immer copies behind the scenes.</En>
            <Zh>Redux Toolkit 的 reducer 看起来像直接修改，实际上 Immer 在背后做了拷贝。</Zh>
          </li>
          <li>
            <En>Data that comes from an API is a server cache, not hand-managed Redux state.</En>
            <Zh>来自 API 的数据属于服务端缓存，不应该手动塞进 Redux。</Zh>
          </li>
        </ul>

        {/* ───────────── 3. frontend performance ───────────── */}
        <h3>
          <En>3. Frontend: why does it feel slow?</En>
          <Zh>3. 前端：为什么感觉很慢？</Zh>
        </h3>
        <p>
          <En>Measure first, then pick the fix that matches the symptom.</En>
          <Zh>先测量，再选和症状对应的优化。</Zh>
        </p>
        <FrontendPerf />
        <CodeBlock
          language="typescript"
          code={`const Row = React.memo(function Row({ p, onAdd }: RowProps) {
  return <li onClick={() => onAdd(p.sku)}>{p.name}</li>;
});

const onAdd = useCallback((sku: string) => dispatch(added(sku)), [dispatch]);`}
        />
        <ul>
          <li>
            <En>memo only helps if the props stay the same; an inline function breaks it, hence useCallback.</En>
            <Zh>memo 只有在 props 不变时才有效；内联函数每次都是新的，所以要配合 useCallback。</Zh>
          </li>
          <li>
            <En>Core Web Vitals: LCP is load speed, INP is click response, CLS is layout jumping.</En>
            <Zh>Core Web Vitals：LCP 是加载速度，INP 是点击响应，CLS 是布局抖动。</Zh>
          </li>
        </ul>

        {/* ───────────── 4. one order ───────────── */}
        <h3>
          <En>4. One order, end to end</En>
          <Zh>4. 一个订单的完整旅程</Zh>
        </h3>
        <p>
          <En>Eight hops; the customer only waits for the first five.</En>
          <Zh>共八步；用户只需要等前五步。</Zh>
        </p>
        <OrderSequence />
        <ul>
          <li>
            <En>The transaction writes the order, its items, and its status history together or not at all.</En>
            <Zh>事务把订单、订单项和状态历史一起写入，要么全成功，要么全失败。</Zh>
          </li>
          <li>
            <En>The event carries an event ID and a trace ID, so consumers can dedupe and tracing can follow.</En>
            <Zh>事件带有 event ID 和 trace ID，consumer 可以据此去重，链路追踪也能接得上。</Zh>
          </li>
          <li>
            <En>A double-clicked button sends the same idempotency key, so it creates one order, not two.</En>
            <Zh>用户连点按钮会发送同一个 idempotency key，因此只会创建一个订单。</Zh>
          </li>
        </ul>

        {/* ───────────── 5. auth + ownership ───────────── */}
        <h3>
          <En>5. Who may touch what</En>
          <Zh>5. 谁能碰什么</Zh>
        </h3>
        <p>
          <En>Authentication happens once at the door; authorization happens where the data is.</En>
          <Zh>Authentication 在入口处做一次；authorization 在数据所在的地方做。</Zh>
        </p>
        <OwnershipAndAuth />
        <ul>
          <li>
            <En>401 means we do not know you; 403 means we know you and the answer is no.</En>
            <Zh>401 表示不知道你是谁；403 表示知道你是谁，但不允许。</Zh>
          </li>
          <li>
            <En>Because each service owns its tables, other services must ask it through its API or its events.</En>
            <Zh>每个服务独占自己的表，其他服务只能通过它的 API 或事件来获取数据。</Zh>
          </li>
        </ul>

        {/* ───────────── 6. sync vs async ───────────── */}
        <h3>
          <En>6. Sync vs. async: which hops become events</En>
          <Zh>6. 同步 vs. 异步：哪些调用变成事件</Zh>
        </h3>
        <p>
          <En>If the caller needs the answer to continue, keep it HTTP; otherwise publish an event.</En>
          <Zh>如果调用方需要结果才能继续，就保持 HTTP；否则发布事件。</Zh>
        </p>
        <SyncVsAsync />
        <CodeBlock
          language="typescript"
          code={`eachMessage: async ({ message }) => {
  const evt = JSON.parse(message.value!.toString());
  await db.tx(async (tx) => {
    if (await tx.seen(evt.eventId)) return;   // duplicate: do nothing
    await tx.reserveStock(evt);
    await tx.markSeen(evt.eventId);           // same transaction as the work
  });
}`}
        />
        <ul>
          <li>
            <En>Delivery is at-least-once, so duplicates are normal; the consumer must be idempotent.</En>
            <Zh>投递是 at-least-once，重复消息很正常；consumer 必须是幂等的。</Zh>
          </li>
          <li>
            <En>A message that keeps failing goes to a dead letter queue instead of blocking the topic.</En>
            <Zh>反复失败的消息进入死信队列（dead letter queue），而不是堵住整个 topic。</Zh>
          </li>
        </ul>

        {/* ───────────── 7. redis ───────────── */}
        <h3>
          <En>7. Redis: fast reads, and their price</En>
          <Zh>7. Redis：读得快，以及它的代价</Zh>
        </h3>
        <p>
          <En>Pain point: every product page hits Postgres for data that changes once a day.</En>
          <Zh>痛点：每个商品页都去查 Postgres，而这些数据一天才变一次。</Zh>
        </p>
        <CacheAside />
        <CodeBlock
          language="typescript"
          code={`const hit = await redis.get(\`product:\${id}\`);
if (hit) return JSON.parse(hit);

const row = await repo.findById(id);
await redis.set(\`product:\${id}\`, JSON.stringify(row), { EX: 60 });
return row;`}
        />
        <ul>
          <li>
            <En>Cache what is read often and changes rarely; never cache stock counts you must trust.</En>
            <Zh>缓存读得多、变得少的数据；绝不要缓存必须准确的库存数量。</Zh>
          </li>
          <li>
            <En>The TTL is the safety net for the day someone forgets to delete the key.</En>
            <Zh>TTL 是兜底：万一有人忘了删 key，数据最终也会过期。</Zh>
          </li>
        </ul>

        {/* ───────────── 8. boundaries ───────────── */}
        <h3>
          <En>8. Every boundary, and what it cost</En>
          <Zh>8. 每一道边界，以及它的代价</Zh>
        </h3>
        <p>
          <En>Every line you draw buys something and costs something.</En>
          <Zh>你画的每一条线，都有收益，也有代价。</Zh>
        </p>
        <BoundaryCosts />
        <p className="callout">
          <En>Naming the cost is what separates &quot;I used microservices&quot; from &quot;I understood why we split there.&quot;</En>
          <Zh>能说出代价，才是&quot;我用过微服务&quot;和&quot;我理解为什么在那里拆分&quot;的区别。</Zh>
        </p>

        {/* ───────────── 9. delivery ───────────── */}
        <h3>
          <En>9. How a change reaches production</En>
          <Zh>9. 一个改动如何到达生产环境</Zh>
        </h3>
        <p>
          <En>Pain point: shipping by hand means nobody trusts a Friday deploy.</En>
          <Zh>痛点：手动发布意味着没人敢在周五上线。</Zh>
        </p>
        <Pipeline />
        <ul>
          <li>
            <En>Test pyramid: many fast unit tests, fewer integration tests, a handful of e2e smoke tests.</En>
            <Zh>测试金字塔：大量快速的 unit test，较少的 integration test，少量 e2e 冒烟测试。</Zh>
          </li>
          <li>
            <En>The image tested on dev is the image promoted to prod; rollback redeploys an older one.</En>
            <Zh>在 dev 测过的镜像就是推到 prod 的镜像；回滚就是重新部署旧镜像。</Zh>
          </li>
          <li>
            <En>A sprint is how the team plans; a release is when users get it. They are not the same.</En>
            <Zh>Sprint 是团队的规划节奏；release 是用户拿到新版本的时刻，两者不是一回事。</Zh>
          </li>
        </ul>

        {/* ───────────── 10. interview map (reference) ───────────── */}
        <h3>
          <En>10. Reference: the interview map</En>
          <Zh>10. 参考：面试问题对照表</Zh>
        </h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Question</En><Zh>问题</Zh></th>
              <th><En>Your answer comes from</En><Zh>答案来自</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Where does frontend state go?</En><Zh>前端状态放哪里？</Zh></td>
              <td><En>The state ladder</En><Zh>状态阶梯</Zh></td>
            </tr>
            <tr>
              <td><En>A page feels slow</En><Zh>页面感觉慢</Zh></td>
              <td><En>Measure, then memo / lazy / debounce</En><Zh>先测量，再 memo / lazy / debounce</Zh></td>
            </tr>
            <tr>
              <td><En>What becomes a microservice?</En><Zh>什么该拆成微服务？</Zh></td>
              <td><En>Side effect, low coupling, no shared transaction</En><Zh>有副作用、低耦合、无共享事务</Zh></td>
            </tr>
            <tr>
              <td><En>Keep an API secure</En><Zh>如何保障 API 安全</Zh></td>
              <td><En>JWT at the gateway, ownership in the service</En><Zh>gateway 验 JWT，service 查归属</Zh></td>
            </tr>
            <tr>
              <td><En>Handle a traffic spike</En><Zh>应对流量高峰</Zh></td>
              <td><En>Cache reads, queue writes, isolate the hot row</En><Zh>缓存读、队列化写、隔离热点行</Zh></td>
            </tr>
            <tr>
              <td><En>Production is slow</En><Zh>生产环境变慢</Zh></td>
              <td><En>Metrics, then traces, then logs; p99</En><Zh>先 metrics，再 traces，再 logs；看 p99</Zh></td>
            </tr>
            <tr>
              <td><En>Is a change safe to ship?</En><Zh>改动能安全上线吗？</Zh></td>
              <td><En>Pyramid, pipeline, one promoted image</En><Zh>测试金字塔、pipeline、同一个镜像</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Answer with the specific decision and its trade-off, never the general principle.</En>
          <Zh>回答要讲具体的决策和取舍，而不是泛泛的原则。</Zh>
        </p>

      </section>
    </div>
  );
}
