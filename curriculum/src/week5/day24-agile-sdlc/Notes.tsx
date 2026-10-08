import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { En, Zh } from "../../components/Lang";
import { Arrow, ArrowDefs, Box, T } from "../../components/Diagram";
import { AdHocGrid, AiSplit, BacklogStack, Bottleneck, Capacity, ConfluenceGrid, GroomingCards, PlanningSteps, PointsRuler, RetroBoard, ScrumLoop, WhyHurts } from "./Flows";

// ── two-week sprint calendar ──
// Ten working days, Wed → Tue. 9am sits at y=56 and every hour is 32px tall.
const CAL_DAYS = ["Wed", "Thu", "Fri", "Mon", "Tue", "Wed", "Thu", "Fri", "Mon", "Tue"];
const CAL_HOURS = ["9am", "10", "11", "12pm", "1", "2", "3", "4", "5pm"];
const colX = (i: number) => 48 + i * 65;
const hourY = (h: number) => 56 + (h - 9) * 32;

// ── one product, many teams ──
const PRODUCT_TEAMS = [
  { x: 10, name: "Team Catalog", mfes: ["product-list", "product-page"], svcs: ["product-svc", "search-svc"] },
  { x: 240, name: "Team Checkout", mfes: ["cart", "checkout"], svcs: ["cart-svc", "order-svc", "payment-svc"] },
  { x: 470, name: "Team Account", mfes: ["login", "profile", "my-orders"], svcs: ["user-svc", "auth-svc", "notify-svc"] },
];

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 24 Notes</title>
      <DayNav day="day24-agile-sdlc" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">Week 5 · Day 24 · Notes</p>
        <h1>Agile &amp; SDLC</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. Nothing here is code; every item is something an interviewer will ask you to describe from your own (real or project) experience.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。这里没有一行代码；每一条都是面试官会让你结合自己（真实或项目中的）经历来描述的东西。</Zh>
        </p>
        <ul>
          <li>
            <En>Walk through the SDLC phases, explain how waterfall runs them, and why that hurts when requirements change</En>
            <Zh>讲清楚 SDLC 的各个阶段、waterfall 是怎么走这些阶段的，以及需求一变它为什么就很痛苦</Zh>
          </li>
          <li>
            <En>Explain Agile&apos;s core idea — small iterations, fast feedback — and that Scrum is one concrete way of doing it</En>
            <Zh>解释 Agile 的核心思想——小步迭代、快速反馈——以及 Scrum 是它的一种具体落地方式</Zh>
          </li>
          <li>
            <En>Explain what a ticket is: user story, acceptance criteria, story points — and how it fits in a backlog under an epic</En>
            <Zh>解释 ticket 是什么：user story、acceptance criteria、story point——以及它如何挂在某个 epic 下、躺在 backlog 里</Zh>
          </li>
          <li>
            <En>Describe what actually happens in each Scrum meeting, and sketch a two-week sprint on a calendar</En>
            <Zh>描述每个 Scrum 会议里实际在做什么，并能画出一个两周 sprint 的日程</Zh>
          </li>
          <li>
            <En>Explain that a sprint isn&apos;t a release, and what decides how often a team ships</En>
            <Zh>解释 sprint 不等于 release，以及什么决定了团队多久发一次版</Zh>
          </li>
          <li>
            <En>Explain how a ticket gets estimated and how it ends up assigned to you</En>
            <Zh>解释一张 ticket 是怎么被估点的，以及它最后是怎么落到你手上的</Zh>
          </li>
          <li>
            <En>Describe your team&apos;s roles and how your team fits into a larger company</En>
            <Zh>描述你所在团队的角色构成，以及你的团队在整个公司里处于什么位置</Zh>
          </li>
          <li>
            <En>State a Definition of Done, and say what lives in Confluence instead of in a ticket</En>
            <Zh>说出一套 Definition of Done，并说明哪些东西放在 Confluence 而不是 ticket 里</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/week5/day24-agile-sdlc/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ───────────────────────── 1. SDLC ───────────────────────── */}
        <h3>
          <En>1. The SDLC — what every project goes through</En>
          <Zh>1. SDLC——每个项目都要经历的阶段</Zh>
        </h3>
        <p>
          <En>The <strong>Software Development Life Cycle</strong> is the list of phases any piece of software passes through, from idea to running in production.</En>
          <Zh><strong>Software Development Life Cycle</strong>（软件开发生命周期）是任何一个软件从想法到在生产环境运行所要经过的阶段。</Zh>
        </p>
        <svg viewBox="0 0 680 140" role="img" aria-label="The SDLC: Requirements, Design, Develop, Test, Release, Monitor, left to right. A dashed arrow loops from Monitor back to Requirements: feedback from users becomes the requirements for the next version.">
          <Box x={14} y={30} w={96} h={50} kind="muted" label="Requirements" sub="what to build" />
          <Box x={126} y={30} w={96} h={50} label="Design" sub="how to build it" />
          <Box x={238} y={30} w={96} h={50} label="Develop" sub="write the code" />
          <Box x={350} y={30} w={96} h={50} label="Test" sub="does it work?" />
          <Box x={462} y={30} w={96} h={50} kind="primary" label="Release" sub="ship to users" />
          <Box x={574} y={30} w={96} h={50} kind="ok" label="Monitor" sub="maintain + learn" />
          <Arrow d="M110,55 L124,55" />
          <Arrow d="M222,55 L236,55" />
          <Arrow d="M334,55 L348,55" />
          <Arrow d="M446,55 L460,55" />
          <Arrow d="M558,55 L572,55" />
          <Arrow d="M622,80 L622,108 L62,108 L62,82" ink="purple" dashed />
          <T x={342} y={126}>feedback from real users → requirements for the next version</T>
        </svg>
        <p className="callout">
          <En>Every process — waterfall, Agile, anything — runs these same phases. The only question is how much work goes through them at once.</En>
          <Zh>无论什么流程——waterfall、Agile 还是别的——走的都是这几个阶段。唯一的区别是：一次有多少工作量一起走过这些阶段。</Zh>
        </p>

        {/* ───────────────────────── 2. Waterfall ───────────────────────── */}
        <h3>
          <En>2. Waterfall — the whole project, one phase at a time</En>
          <Zh>2. Waterfall——整个项目，一次只走一个阶段</Zh>
        </h3>
        <p>
          <En>Waterfall is the traditional way: finish <em>all</em> the requirements, then <em>all</em> the design, then <em>all</em> the code, and so on. Like water flowing down steps, you don&apos;t go back up.</En>
          <Zh>Waterfall（瀑布模型）是传统做法：先把<em>全部</em>需求做完，再做<em>全部</em>设计，再写<em>全部</em>代码，依次往下。就像水顺着台阶往下流，不会往回走。</Zh>
        </p>
        <svg viewBox="0 0 680 280" role="img" aria-label="Waterfall drawn as a staircase. Requirements in months 1 to 2, Design in months 2 to 3, Develop in months 3 to 8, Test in months 8 to 10, Release in month 11, then Maintain. Each phase finishes before the next starts, and users see the product for the first time at Release.">
          <Box x={10} y={10} w={100} h={36} kind="muted" label="Requirements" sub="months 1–2" />
          <Box x={122} y={54} w={100} h={36} label="Design" sub="months 2–3" />
          <Box x={234} y={98} w={100} h={36} label="Develop" sub="months 3–8" />
          <Box x={346} y={142} w={100} h={36} label="Test" sub="months 8–10" />
          <Box x={458} y={186} w={100} h={36} kind="primary" label="Release" sub="month 11" />
          <Box x={570} y={230} w={100} h={36} kind="ok" label="Maintain" sub="after launch" />
          <Arrow d="M110,28 L126,28 L126,52" />
          <Arrow d="M222,72 L238,72 L238,96" />
          <Arrow d="M334,116 L350,116 L350,140" />
          <Arrow d="M446,160 L462,160 L462,184" />
          <Arrow d="M558,204 L574,204 L574,228" />
          <T x={10} y={196} anchor="start">Each phase must finish</T>
          <T x={10} y={210} anchor="start">before the next one starts.</T>
          <T x={10} y={224} anchor="start">There is no going back up.</T>
          <T x={508} y={238} color="#c0392b" bold>▲ users&apos; first look</T>
        </svg>
        <p>
          <En>Where it still lives:</En>
          <Zh>今天仍在使用的地方：</Zh>
        </p>
        <ul>
          <li>
            <En><strong>Fixed-price contracts</strong> — scope and price signed before any work.</En>
            <Zh><strong>固定总价合同</strong>——开工前就签好范围和价格。</Zh>
          </li>
          <li>
            <En><strong>Hardware and safety-critical systems</strong> — a late change is hugely expensive.</En>
            <Zh><strong>硬件和安全关键系统</strong>——后期改动代价极高。</Zh>
          </li>
          <li>
            <En><strong>Heavily regulated industries</strong> — every phase needs an approval.</En>
            <Zh><strong>强监管行业</strong>——每个阶段都要审批。</Zh>
          </li>
        </ul>

        {/* ───────────────────────── 3. Why waterfall hurts ───────────────────────── */}
        <h3>
          <En>3. Why waterfall hurts</En>
          <Zh>3. Waterfall 的痛点</Zh>
        </h3>
        <p>
          <En>Picture an online store building checkout for a year from a month-1 requirements doc:</En>
          <Zh>设想一家网店花了一年，按第 1 个月写好的需求文档来做结账功能：</Zh>
        </p>
        <WhyHurts />

        {/* ───────────────────────── 4. Agile ───────────────────────── */}
        <h3>
          <En>4. Agile — the same phases, in small loops</En>
          <Zh>4. Agile——同样的阶段，用小循环来走</Zh>
        </h3>
        <p>
          <En>Agile keeps every SDLC phase but shrinks the batch: instead of one year-long pass, run the whole cycle on a small slice of the product every couple of weeks.</En>
          <Zh>Agile（敏捷）保留了 SDLC 的每个阶段，但把批量缩小：不再一次走一整年，而是每隔几周就对产品的一小块完整地走一遍。</Zh>
        </p>
        <svg viewBox="0 0 680 170" role="img" aria-label="Waterfall versus Agile on the same timeline. Waterfall is one long bar: Requirements, Design, a long Develop, Test, then Release at the very end, so feedback only arrives at the end. Agile is eight two-week sprints, each a mini SDLC, each ending with working software and feedback.">
          <T x={10} y={44} anchor="start" size={12} bold color="#1c1c1c">Waterfall</T>
          <Box x={100} y={24} w={80} h={32} kind="muted" label="Req." size={10} />
          <Box x={182} y={24} w={70} h={32} label="Design" size={10} />
          <Box x={254} y={24} w={200} h={32} label="Develop" size={10} />
          <Box x={456} y={24} w={110} h={32} label="Test" size={10} />
          <Box x={568} y={24} w={92} h={32} kind="primary" label="Release" size={10} />
          <T x={614} y={72} color="#3d8b40">▲ feedback</T>
          <T x={330} y={72}>one big pass — users see it only at the end</T>
          <T x={10} y={118} anchor="start" size={12} bold color="#1c1c1c">Agile</T>
          {Array.from({ length: 8 }, (_, i) => (
            <Box key={i} x={100 + i * 70} y={98} w={68} h={34} kind="ok" label={`Sprint ${i + 1}`} sub="mini SDLC" size={10} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <T key={i} x={134 + i * 70} y={146} color="#3d8b40">▲</T>
          ))}
          <T x={380} y={162}>working software + feedback every 2 weeks</T>
        </svg>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>Agile is a <strong>philosophy</strong>, not a process: short iterations, something usable each time, feedback steers the next one.</En>
              <Zh>Agile 是一种<strong>理念</strong>，不是流程：短迭代、每次交付可用的东西、让反馈决定下一步。</Zh>
            </li>
            <li>
              <En>Short loops limit how much gets built on a wrong assumption.</En>
              <Zh>短循环限制了建立在错误假设上的工作量。</Zh>
            </li>
            <li>
              <En>It only works if shipping is safe — automated tests and CI/CD.</En>
              <Zh>前提是发布足够安全——自动化测试和 CI/CD。</Zh>
            </li>
          </ul>
        </div>


        {/* ───────────────────────── 5. Scrum at a glance ───────────────────────── */}
        <h3>
          <En>5. Scrum — Agile, made concrete</En>
          <Zh>5. Scrum——把 Agile 落地</Zh>
        </h3>
        <p>
          <En>Agile says what to value; <strong>Scrum</strong> says how to run the team. A job post that says Agile almost always means Scrum.</En>
          <Zh>Agile 说的是重视什么；<strong>Scrum</strong> 说的是怎么运作团队。招聘里写 Agile，几乎都指 Scrum。</Zh>
        </p>
        <ScrumLoop />
        {/* <p>
          <En>A <strong>sprint</strong> is a fixed time box, usually 2 weeks — the date is fixed, the scope moves. In order:</En>
          <Zh><strong>sprint</strong> 是固定的时间盒，通常 2 周——日期固定，变的是范围。按顺序来看：</Zh>
        </p>
        <ul>
          <li>
            <En><strong>Backlog</strong> — everything still to do, in priority order. The PO keeps adding to it.</En>
            <Zh><strong>Backlog</strong>——所有还没做的事，按优先级排列。PO 不断往里加。</Zh>
          </li>
          <li>
            <En><strong>Sprint planning</strong> (day 1) — the whole team decides what to take on:</En>
            <Zh><strong>Sprint planning</strong>（第 1 天）——全员一起决定要接哪些活：</Zh>
            <ol>
              <li>
                <En>Decide what to work on this sprint, starting from the top of the backlog.</En>
                <Zh>决定本 sprint 要做什么，从 backlog 最上面开始。</Zh>
              </li>
              <li>
                <En>The tech lead goes over each ticket&apos;s details; the PO joins when needed.</En>
                <Zh>tech lead 逐张讲解 ticket 的细节；需要时 PO 也会参加。</Zh>
              </li>
              <li>
                <En>The team votes on story points for anything new.</En>
                <Zh>团队对新的 ticket 投票估 story point。</Zh>
              </li>
              <li>
                <En>People volunteer for tickets (or the tech lead assigns them).</En>
                <Zh>大家主动认领 ticket（或由 tech lead 分配）。</Zh>
              </li>
            </ol>
          </li>
          <li>
            <En><strong>Daily standup</strong> (from day 2) — 15 minutes: what I did yesterday, what I&apos;ll do today, any blockers.</En>
            <Zh><strong>Daily standup</strong>（从第 2 天开始）——15 分钟：昨天做了什么、今天做什么、有没有 blocker。</Zh>
          </li>
          <li>
            <En><strong>Daily development</strong> — heads-down coding, PRs and testing. Some teams add an optional daily or weekly sync-up.</En>
            <Zh><strong>日常开发</strong>——专心写代码、提 PR、测试。有些团队会加一个可选的每日或每周 sync-up。</Zh>
          </li>
          <li>
            <En><strong>Grooming / refinement</strong> (mid-sprint) — adjust the tickets: someone falling behind? Re-assign or let a teammate help. Prep the next sprint&apos;s tickets.</En>
            <Zh><strong>Grooming / refinement</strong>（sprint 中段）——调整 ticket：有人落后了？重新分配或让队友帮忙。同时准备下个 sprint 的 ticket。</Zh>
          </li>
          <li>
            <En><strong>Sprint review / demo</strong> (last day) — show the finished features to the PO, PM and stakeholders. Often already deployed to a QA environment, but every team differs.</En>
            <Zh><strong>Sprint review / demo</strong>（最后一天）——向 PO、PM 和相关方演示做完的功能。通常已经部署到 QA 环境，但每个团队不同。</Zh>
          </li>
          <li>
            <En><strong>Retrospective</strong> — what went well, what to improve next sprint.</En>
            <Zh><strong>Retrospective</strong>——哪些做得好，下个 sprint 要改进什么。</Zh>
          </li>
        </ul> */}


        {/* ───────────────────────── 6. The meetings ───────────────────────── */}
        <h3>
          <En>6. The Scrum Ceremonies / Meetings in more detail</En>
          <Zh>6. Scrum 会议详解</Zh>
        </h3>

        <h4 className="topic">
          <En>6.1 Sprint planning — the first morning</En>
          <Zh>6.1 Sprint planning——第一天上午</Zh>
        </h4>
        <p>
          <En>Whole team, 1–2 hours. Leave with a sprint backlog everyone believes they can finish.</En>
          <Zh>全员参加，1–2 小时。会后得到一份每个人都相信能完成的 sprint backlog。</Zh>
        </p>
        <PlanningSteps />

        <h4 className="topic">
          <En>6.2 Daily standup — every morning, 15 minutes</En>
          <Zh>6.2 Daily standup——每天早上 15 分钟</Zh>
        </h4>
        <p>
          <En>Whole team, standing up so it stays short. Each person answers three questions:</En>
          <Zh>全员参加，站着开，好让会议保持简短。每人回答三个问题：</Zh>
        </p>
        <CodeBlock
          language="yaml"
          code={`yesterday: "finished the re-route API (ORD-101), PR is up"
today: "start the store-picker modal"
blockers:
  - "need the inventory-svc team to expose a release-stock endpoint"
  - "can the PM ping them?"`}
        />
        <ul>
          <li>
            <En>The point is <strong>blockers</strong>: stuck? Say so today, not on the last day.</En>
            <Zh>重点是 <strong>blocker</strong>：卡住了今天就说，别等最后一天。</Zh>
          </li>
          <li>
            <En>Long discussions go &quot;offline&quot; with only the people who need them.</En>
            <Zh>需要长讨论的问题会后&quot;线下&quot;聊，只叫需要的人。</Zh>
          </li>
          <li>
            <En>Some teams add a developers-only <strong>tag-up</strong> late in the afternoon.</En>
            <Zh>有些团队下午晚些时候还有只有开发者参加的 <strong>tag-up</strong>。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>6.3 Backlog grooming (refinement) — mid-sprint</En>
          <Zh>6.3 Backlog grooming（refinement）——sprint 中段</Zh>
        </h4>
        <p>
          <En>PO, BA, tech lead and developers, about an hour, mid-sprint. It looks two ways:</En>
          <Zh>PO、BA、tech lead 和开发者参加，约一小时，在 sprint 中段。它同时看两个方向：</Zh>
        </p>
        <GroomingCards />
        <p className="callout">
          <En>Mid-sprint is the right time to say &quot;I won&apos;t finish this ticket&quot;.</En>
          <Zh>sprint 中段正是说&quot;这张 ticket 我做不完&quot;的时机。</Zh>
        </p>

        <h4 className="topic">
          <En>6.4 Sprint review / demo — the last day</En>
          <Zh>6.4 Sprint review / demo——最后一天</Zh>
        </h4>
        <ul>
          <li>
            <En>Developers demo <strong>running software</strong> on dev or QA — not slides.</En>
            <Zh>开发者在 dev 或 QA 上演示<strong>跑起来的软件</strong>——不是 PPT。</Zh>
          </li>
          <li>
            <En>The PO checks each ticket against its acceptance criteria and accepts it or not.</En>
            <Zh>PO 对照 acceptance criteria 逐个检查并决定是否验收。</Zh>
          </li>
          <li>
            <En>Unfinished tickets <strong>carry over</strong>; the sprint is never extended.</En>
            <Zh>没完成的 ticket <strong>顺延</strong>；sprint 从不延长。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>6.5 Retrospective — right after the demo</En>
          <Zh>6.5 Retrospective——紧接在 demo 之后</Zh>
        </h4>
        <p>
          <En>Team only. The review looks at the <em>product</em>; the retro looks at <em>how the team worked</em>.</En>
          <Zh>只有团队成员。review 看<em>产品</em>；retro 看<em>团队的工作方式</em>。</Zh>
        </p>
        <RetroBoard />
        <ul>
          <li>
            <En>End with one or two <strong>action items, each with an owner</strong>.</En>
            <Zh>以一两条<strong>行动项结束，每条都有负责人</strong>。</Zh>
          </li>
          <li>
            <En><strong>Blameless</strong>: talk about the process, not whose fault it was.</En>
            <Zh><strong>不追责</strong>：谈流程，不谈是谁的错。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>6.6 Ad hoc meetings — everything else on your calendar</En>
          <Zh>6.6 临时会议——日历上的其他会议</Zh>
        </h4>
        <p>
          <En>Not Scrum ceremonies, but you will see them on a real calendar:</En>
          <Zh>它们不是 Scrum 仪式，但你在真实的日历上一定会看到：</Zh>
        </p>
        <AdHocGrid />
        <ul>
          <li>
            <En><strong>Core hours</strong> — a daily window when everyone is online, so meetings and pairing happen here and the rest of the day stays free for coding.</En>
            <Zh><strong>Core hours</strong>——每天大家都在线的一个时间段，会议和结对都放在这里，其余时间留给写代码。</Zh>
          </li>
          <li>
            <En>Every team mixes these differently — treat the calendar below as one example, not a rule.</En>
            <Zh>每个团队的组合都不一样——把下面的日历当作一个例子，而不是规则。</Zh>
          </li>
        </ul>


        {/* ───────────────────────── 7. Calendar ───────────────────────── */}
        <h3>
          <En>7. A two-week sprint on the calendar</En>
          <Zh>7. 日历上的两周 sprint</Zh>
        </h3>
        <svg viewBox="0 0 700 400" role="img" aria-label="A two-week sprint calendar from Wednesday to the Tuesday twelve days later. Every day has a 15-minute standup at 9:30 and a developer tag-up at 4pm. The first Wednesday has sprint planning from 10 to 12. The second Wednesday has backlog grooming at 2pm. The second Thursday has a business meeting with the client at 11. The final Tuesday has the sprint demo at 10 and the retrospective at 2pm. A yellow band marks core hours from 1 to 3pm every day. Dashed boxes are ad hoc meetings: a designer sync, a design review, a manager one-on-one, a cross-team sync and a tech talk. Two evening releases at 6pm, on the second Thursday and after the final demo, each with someone on call.">
          {CAL_HOURS.map((h, i) => (
            <g key={h}>
              <line x1={46} x2={697} y1={hourY(9 + i)} y2={hourY(9 + i)} stroke="#e3e8ef" />
              <T x={40} y={hourY(9 + i) + 4} anchor="end" size={9}>{h}</T>
            </g>
          ))}
          {CAL_DAYS.map((d, i) => (
            <g key={i}>
              <rect x={colX(i)} y={8} width={64} height={40} rx={4} fill={i < 5 ? "#eef3ff" : "#f3eefc"} />
              <T x={colX(i) + 32} y={24} bold color="#1c1c1c">{d}</T>
              <T x={colX(i) + 32} y={39} size={9}>{`day ${i + 1}`}</T>
              <Box x={colX(i) + 2} y={hourY(9.5)} w={60} h={14} label="Standup" size={9} />
              <Box x={colX(i) + 2} y={hourY(16)} w={60} h={16} kind="muted" label="Tag-up" size={9} />
            </g>
          ))}
          <rect x={colX(0)} y={hourY(13)} width={colX(9) + 64 - colX(0)} height={64} rx={4} fill="#fff7e0" opacity={0.7} />
          <T x={colX(0) + 32} y={hourY(13) + 13} size={9} color="#b58900" bold>Core hours</T>
          <line x1={colX(5) - 1} x2={colX(5) - 1} y1={8} y2={hourY(19)} stroke="#8e5fd6" strokeDasharray="4,3" />
          <Box x={colX(0) + 2} y={hourY(10)} w={60} h={64} kind="primary" label="Planning" sub="10 – 12" size={10} />
          <Box x={colX(5) + 2} y={hourY(14)} w={60} h={32} kind="broker" label="Grooming" sub="next sprint" size={10} />
          <Box x={colX(6) + 2} y={hourY(11)} w={60} h={32} kind="service" label="Business" sub="PO + client" size={10} dashed />
          <Box x={colX(2) + 2} y={hourY(11)} w={60} h={32} kind="service" label="Designer" sub="sync" size={9} dashed />
          <Box x={colX(3) + 2} y={hourY(11)} w={60} h={32} kind="service" label="Design" sub="review" size={9} dashed />
          <Box x={colX(4) + 2} y={hourY(15)} w={60} h={32} kind="service" label="1-on-1" sub="manager" size={9} dashed />
          <Box x={colX(7) + 2} y={hourY(11)} w={60} h={32} kind="service" label="Sync" sub="platform" size={9} dashed />
          <Box x={colX(8) + 2} y={hourY(12)} w={60} h={32} kind="service" label="Tech talk" sub="optional" size={9} dashed />
          <rect x={colX(0)} y={hourY(18)} width={colX(9) + 64 - colX(0)} height={32} rx={4} fill="#f1f1f1" opacity={0.8} />
          <T x={colX(0) + 32} y={hourY(18) + 13} size={9} color="#777" bold>After hours</T>
          <Box x={colX(6) + 2} y={hourY(18)} w={60} h={32} kind="fail" label="Release" sub="on call" size={9} />
          <Box x={colX(9) + 2} y={hourY(18)} w={60} h={32} kind="fail" label="Release" sub="on call" size={9} />
          <Box x={colX(9) + 2} y={hourY(10)} w={60} h={32} kind="ok" label="Demo" sub="review" size={10} />
          <Box x={colX(9) + 2} y={hourY(14)} w={60} h={32} kind="warn" label="Retro" sub="team only" size={10} />
          <T x={372} y={392}>Sprint 14 runs Wed → Tue. Sprint 15&apos;s planning is the next morning.</T>
        </svg>
        <ul>
          <li>
            <En>Dashed boxes are ad hoc meetings and vary by team; the yellow band is core hours.</En>
            <Zh>虚线框是临时会议，因团队而异；黄色带是 core hours。</Zh>
          </li>
          <li>
            <En>Releases often go out after hours (here 6pm), with the releasing developer on call in case something breaks.</En>
            <Zh>发布常常安排在下班后（这里是 6 点），发布的开发者会 on call，以防出问题。</Zh>
          </li>
          <li>
            <En>Most of the calendar is empty on purpose — that&apos;s coding time. Scrum keeps meetings to roughly 10% of the sprint.</En>
            <Zh>日历大部分是空的，这是故意的——那是写代码的时间。Scrum 把会议控制在 sprint 的大约 10%。</Zh>
          </li>
          <li>
            <En>Many teams start sprints mid-week, as here: a Monday holiday never eats sprint planning, and the sprint doesn&apos;t end on a Friday release.</En>
            <Zh>很多团队像这里一样在周中开始 sprint：周一放假不会吃掉 sprint planning，sprint 也不会在周五发版时结束。</Zh>
          </li>
          <li>
            <En>The last day is heavy: demo in the morning, retro after lunch, and the next sprint&apos;s planning first thing the following day.</En>
            <Zh>最后一天最忙：上午 demo、午饭后 retro，第二天一早就是下个 sprint 的 planning。</Zh>
          </li>
        </ul>

        {/* ───────────────────────── 8. Roles ───────────────────────── */}
        <h3>
          <En>8. Who&apos;s on a Scrum team</En>
          <Zh>8. Scrum 团队里都有谁</Zh>
        </h3>
        <p>
          <En>A typical team is about <strong>8–12 people</strong>. Here is a common shape:</En>
          <Zh>一个典型团队大约 <strong>8–12 人</strong>。常见的构成是这样的：</Zh>
        </p>
        <svg viewBox="0 0 680 232" role="img" aria-label="One Scrum team of roughly 8 to 12 people. Top row: Product Owner, Project Manager, Business Analyst, and a dashed Designer box shared with other teams. Below: a development team with a tech lead and five developers, some front-end leaning, some back-end leaning, and a dashed QA box: a central department shared with other teams, with one or two testers who regularly work with this team.">
          <rect x={10} y={10} width={660} height={212} rx={8} fill="none" stroke="#bbb" strokeDasharray="5,4" />
          <T x={24} y={28} anchor="start" bold color="#1c1c1c">One Scrum team (~8–12 people)</T>
          <Box x={30} y={40} w={140} h={46} kind="primary" label="Product Owner" sub="what + priority" />
          <Box x={190} y={40} w={140} h={46} kind="primary" label="Project Manager" sub="meetings + timeline" />
          <Box x={350} y={40} w={140} h={46} kind="primary" label="Business Analyst" sub="requirements → tickets" />
          <Box x={510} y={40} w={140} h={46} kind="muted" label="Designer" sub="shared with other teams" dashed />
          <rect x={30} y={102} width={420} height={110} rx={6} fill="none" stroke="#7ea6e0" strokeDasharray="4,3" />
          <T x={40} y={120} anchor="start" bold color="#1c1c1c">Development team</T>
          <Box x={40} y={130} w={96} h={72} kind="primary" label="Tech Lead" sub="senior dev" />
          <Box x={146} y={130} w={92} h={34} label="Dev" sub="FE-leaning" />
          <Box x={244} y={130} w={92} h={34} label="Dev" sub="FE-leaning" />
          <Box x={342} y={130} w={98} h={34} label="Dev" sub="BE-leaning" />
          <Box x={146} y={170} w={92} h={34} label="Dev" sub="BE-leaning" />
          <Box x={244} y={170} w={92} h={34} label="Dev" sub="full stack" />
          <Box x={480} y={110} w={170} h={56} kind="ok" dashed label="QA" sub="central department, shared" />
          <T x={565} y={184} size={9}>1–2 testers work with our team</T>
          <T x={565} y={198} size={9}>regularly, but report to QA</T>
        </svg>

        <h4 className="topic">
          <En>Product Owner (PO)</En>
          <Zh>Product Owner（PO，产品负责人）</Zh>
        </h4>
        <ul>
          <li>
            <En>Owns the <strong>what</strong>: what the product does and the backlog&apos;s priority order.</En>
            <Zh>负责<strong>做什么</strong>：产品做什么，以及 backlog 的优先级顺序。</Zh>
          </li>
          <li>
            <En>Accepts or rejects finished work at the sprint review.</En>
            <Zh>在 sprint review 上验收或拒绝完成的工作。</Zh>
          </li>
        </ul>
        <h4 className="topic">
          <En><s>Scrum Master</s> → Project Manager (PM)</En>
          <Zh><s>Scrum Master</s> → Project Manager（PM，项目经理）</Zh>
        </h4>
        <ul>
          <li>
            <En>The classic Scrum Master (runs meetings, clears blockers) has mostly merged into the PM.</En>
            <Zh>经典的 Scrum Master（主持会议、清除障碍）基本并入了 PM。</Zh>
          </li>
          <li>
            <En>The PM tracks the <strong>timeline</strong> — asks <em>when</em> and <em>what&apos;s blocking</em>, not <em>how</em>.</En>
            <Zh>PM 负责<strong>进度</strong>——问<em>什么时候</em>和<em>被什么卡住</em>，而不是<em>怎么做</em>。</Zh>
          </li>
        </ul>
        <h4 className="topic">
          <En>Development team</En>
          <Zh>开发团队</Zh>
        </h4>
        <ul>
          <li>
            <En><strong>4–7 engineers</strong> own the <strong>how</strong> and the sprint commitment together.</En>
            <Zh><strong>4–7 名工程师</strong>共同负责<strong>怎么做</strong>和 sprint 承诺。</Zh>
          </li>
          <li>
            <En>The <strong>tech lead</strong> is the most senior engineer: still codes, makes design calls, reviews tricky PRs, assigns tickets.</En>
            <Zh><strong>tech lead</strong> 是最资深的工程师：依然写代码，做设计决策、review 棘手的 PR、分配 ticket。</Zh>
          </li>
          <li>
            <En>Most teams expect <strong>full stack with a lean</strong>, e.g. front-end leaning.</En>
            <Zh>多数团队要求<strong>全栈但有侧重</strong>，如偏前端。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>In an interview say &quot;full-stack, mostly front-end&quot; — not &quot;front-end only&quot;.</En>
          <Zh>面试时说&quot;全栈，偏前端&quot;——而不是&quot;只做前端&quot;。</Zh>
        </p>

        <h4 className="topic">
          <En>The other roles you&apos;ll work with</En>
          <Zh>你还会打交道的其他角色</Zh>
        </h4>
        <ul>
          <li>
            <En><strong>QA</strong> — a central department: tests tickets against their acceptance criteria, writes E2E tests, runs regression for several teams.</En>
            <Zh><strong>QA</strong>——一个中央部门：对照 acceptance criteria 测试 ticket、写 E2E 测试、为多个团队做回归。</Zh>
          </li>
          <li>
            <En><strong>BA</strong> — turns client requirements into tickets, takes user feedback.</En>
            <Zh><strong>BA</strong>——把客户需求拆成 ticket，收集用户反馈。</Zh>
          </li>
          <li>
            <En><strong>Engineering manager</strong> — your people manager (1-on-1s, reviews), not the tech lead.</En>
            <Zh><strong>Engineering manager</strong>——你的直属经理（1 对 1、绩效），不是 tech lead。</Zh>
          </li>
          <li>
            <En><strong>UI / UX designer</strong> — Figma mockups you build from.</En>
            <Zh><strong>UI / UX designer</strong>——你照着做的 Figma 设计稿。</Zh>
          </li>
          <li>
            <En><strong>DBA, data analyst</strong> — shared specialists for databases and user behavior.</En>
            <Zh><strong>DBA、data analyst</strong>——负责数据库和用户行为的共享专家。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>Even when QA is a central department, one or two testers usually work with your team regularly — &quot;for QA I mostly talk to John and Michael&quot;.</En>
          <Zh>即使 QA 是中央部门，通常也会有一两位测试固定和你的团队合作——&quot;QA 方面我主要找 John 和 Michael&quot;。</Zh>
        </p>


        {/* ───────────────────────── 9. Company structure ───────────────────────── */}
        <h3>
          <En>9. Zooming out — teams inside a big company</En>
          <Zh>9. 放大来看——大公司里的团队</Zh>
        </h3>
        <p>
          <En>Picture an e-commerce platform of micro frontends and microservices. Too big for one team, so work is split by <strong>business area</strong>:</En>
          <Zh>设想一个由 micro frontend 和 microservice 构成的电商平台。一个团队管不过来，所以按<strong>业务领域</strong>来分：</Zh>
        </p>
        <svg viewBox="0 0 700 318" role="img" aria-label="One e-commerce product built by many teams. At the top, a shell app and API gateway owned by the platform team. Below, three product teams, each with PO, PM, tech lead and developers. Team Catalog owns the product-list and product-page micro frontends and the product and search services. Team Checkout owns cart and checkout micro frontends and the cart, order and payment services. Team Account owns login, profile and my-orders micro frontends and the user, auth and notify services. At the bottom, shared teams: Platform and DevOps, Design, QA, Data and analytics, and DBA, security and SRE.">
          <Box x={10} y={10} w={680} h={40} kind="primary" label="Shell app (loads every micro frontend)  +  API gateway (routes to every service)" sub="owned by the Platform team" />
          {PRODUCT_TEAMS.map((t) => (
            <g key={t.name}>
              <Arrow d={`M${t.x + 110},50 L${t.x + 110},62`} />
              <rect x={t.x} y={64} width={220} height={156} rx={8} fill="none" stroke="#bbb" strokeDasharray="5,4" />
              <T x={t.x + 110} y={82} bold size={12} color="#1c1c1c">{t.name}</T>
              <T x={t.x + 110} y={96} size={9}>PO · PM · tech lead · 4–6 devs</T>
              <T x={t.x + 8} y={114} anchor="start" size={9}>micro frontends</T>
              {t.mfes.map((m, j) => (
                <Box key={m} x={t.x + 8 + j * 70} y={120} w={66} h={30} kind="ok" label={m} size={8} />
              ))}
              <T x={t.x + 8} y={170} anchor="start" size={9}>microservices</T>
              {t.svcs.map((s, j) => (
                <Box key={s} x={t.x + 8 + j * 70} y={176} w={66} h={30} label={s} size={8} />
              ))}
            </g>
          ))}
          <Box x={10} y={236} w={128} h={44} kind="warn" label="Platform / DevOps" sub="CI/CD · K8s · cloud" size={10} />
          <Box x={148} y={236} w={128} h={44} kind="warn" label="Design team" sub="Figma · design system" size={10} />
          <Box x={286} y={236} w={128} h={44} kind="warn" label="QA department" sub="testers per team" size={10} />
          <Box x={424} y={236} w={128} h={44} kind="warn" label="Data / analytics" sub="user data → tickets" size={10} />
          <Box x={562} y={236} w={128} h={44} kind="warn" label="DBA · Security · SRE" sub="shared specialists" size={10} />
          <T x={350} y={302}>shared teams serve every product team — reached via Slack channels, their own Jira board, or design reviews</T>
        </svg>
        <ul>
          <li>
            <En>Each team <strong>builds and runs</strong> what it owns, and is on call when it breaks.</En>
            <Zh>每个团队对自己负责的东西<strong>既开发也运维</strong>，出问题自己 on call。</Zh>
          </li>
          <li>
            <En>PO and PM often span 2–3 teams; shared specialists are reached via Slack or a ticket on <em>their</em> board.</En>
            <Zh>PO 和 PM 常常跨 2–3 个团队；共享专家通过 Slack 或在<em>他们的</em>看板上提 ticket 找。</Zh>
          </li>
          <li>
            <En>Teams talk through <strong>API contracts and events</strong>, not by editing each other&apos;s code.</En>
            <Zh>团队之间通过 <strong>API 约定和事件</strong>沟通，而不是改别人的代码。</Zh>
          </li>
          <li>
            <En>A cross-team dependency is a classic blocker — raise it in planning.</En>
            <Zh>跨团队依赖是典型的 blocker——在 planning 时就提出来。</Zh>
          </li>
        </ul>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En><strong>Conway&apos;s law</strong>: a system&apos;s architecture ends up mirroring the communication structure of the organization that built it.</En>
              <Zh><strong>Conway 定律</strong>：一个系统的架构最终会映射出构建它的组织的沟通结构。</Zh>
            </li>
            <li>
              <En>That&apos;s why microservice boundaries and team boundaries tend to be drawn in the same places — one team, one area of the business, its own services.</En>
              <Zh>这就是为什么 microservice 的边界和团队的边界往往画在同一处——一个团队、一块业务、一组自己的 service。</Zh>
            </li>
          </ul>
        </div>


        {/* ───────────────────────── 10. Release cadence ───────────────────────── */}
        <h3>
          <En>10. Sprint ≠ release — how often do teams ship?</En>
          <Zh>10. Sprint ≠ release——团队多久发一次版？</Zh>
        </h3>
        <p>
          <En>A <strong>sprint</strong> is how the team plans; a <strong>release</strong> is when users get it. How often depends on team, product and company.</En>
          <Zh><strong>sprint</strong> 是团队规划的节奏；<strong>release</strong> 是用户拿到新功能的时刻。多久一次取决于团队、产品和公司。</Zh>
        </p>
        <svg viewBox="0 0 680 190" role="img" aria-label="Three release cadences over twelve two-week sprints. Every few months: one release at the end of sprint 6 and one at sprint 12. Every sprint: a release at the end of each sprint. Continuous: many small releases, several per sprint, even daily.">
          <T x={10} y={20} anchor="start" bold color="#1c1c1c">Sprints</T>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={110 + i * 46} y={8} width={44} height={16} rx={3} fill="#f3eefc" stroke="#8e5fd6" />
          ))}
          <T x={10} y={70} anchor="start" bold color="#1c1c1c">Every few months</T>
          <line x1={110} x2={662} y1={66} y2={66} stroke="#e3e8ef" />
          {[6, 12].map((n) => (
            <circle key={n} cx={110 + n * 46 - 4} cy={66} r={8} fill="#fff7e0" stroke="#e8b400" strokeWidth={2} />
          ))}
          <T x={10} y={120} anchor="start" bold color="#1c1c1c">Every sprint</T>
          <line x1={110} x2={662} y1={116} y2={116} stroke="#e3e8ef" />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={110 + (i + 1) * 46 - 4} cy={116} r={6} fill="#eef8ee" stroke="#7dbb7d" strokeWidth={2} />
          ))}
          <T x={10} y={170} anchor="start" bold color="#1c1c1c">Continuous</T>
          <line x1={110} x2={662} y1={166} y2={166} stroke="#e3e8ef" />
          {Array.from({ length: 48 }, (_, i) => (
            <circle key={i} cx={114 + i * 11.5} cy={166} r={3} fill="#eef3ff" stroke="#7ea6e0" strokeWidth={1.5} />
          ))}
          <T x={10} y={84} anchor="start" size={9}>banks, installed software</T>
          <T x={10} y={134} anchor="start" size={9}>B2B products, mobile apps</T>
          <T x={10} y={184} anchor="start" size={9}>SaaS, big tech</T>
        </svg>
        <p>
          <En>What decides the cadence:</En>
          <Zh>什么决定发布频率：</Zh>
        </p>
        <ul>
          <li>
            <En><strong>Cost and risk</strong> of one release — manual testing, downtime.</En>
            <Zh><strong>一次发布的成本和风险</strong>——手动测试、停机。</Zh>
          </li>
          <li>
            <En><strong>Compliance and customers</strong> — audits, approvals, UAT.</En>
            <Zh><strong>合规与客户</strong>——审计、审批、UAT。</Zh>
          </li>
          <li>
            <En><strong>Test automation</strong> — the more is automatic, the safer to ship often.</En>
            <Zh><strong>自动化测试</strong>——自动化越多，越能安全地频繁发布。</Zh>
          </li>
          <li>
            <En><strong>Platform and calendar</strong> — app-store review, code freeze before Black Friday.</En>
            <Zh><strong>平台与日程</strong>——应用商店审核、黑色星期五前的 code freeze。</Zh>
          </li>
        </ul>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En><strong>Done</strong> is not <strong>released</strong> — a ticket may wait for a release date or sit behind a feature flag.</En>
              <Zh><strong>done</strong> 不等于 <strong>released</strong>——ticket 可能在等发布日期，或藏在 feature flag 后面。</Zh>
            </li>
            <li>
              <En>A <strong>feature flag</strong> is an on/off switch: ship the code anytime, turn the feature on later.</En>
              <Zh><strong>feature flag</strong> 是开关：代码随时上线，功能之后再打开。</Zh>
            </li>
            <li>
              <En>Urgent production bugs are <strong>hotfixes</strong> and skip the schedule.</En>
              <Zh>紧急线上 bug 走 <strong>hotfix</strong>，不受排期限制。</Zh>
            </li>
          </ul>
        </div>
        <p className="callout">
          <En>On a new team, ask early: how often do we release, who approves it, and how do we roll back?</En>
          <Zh>加入新团队时，尽早问清楚：我们多久发一次版、谁批准、怎么回滚？</Zh>
        </p>


        {/* ───────────────────────── 11. Confluence ───────────────────────── */}
        <h3>
          <En>11. Confluence — the team&apos;s long-term memory</En>
          <Zh>11. Confluence——团队的长期记忆</Zh>
        </h3>
        <p>
          <En>A ticket closes within a sprint. Anything that must outlive one goes in <strong>Confluence</strong> (or Notion / Google Docs).</En>
          <Zh>ticket 一个 sprint 内就关闭。需要活得更久的内容放进 <strong>Confluence</strong>（或 Notion / Google Docs）。</Zh>
        </p>
        <ConfluenceGrid />
        <p className="callout">
          <En>Documents like these are called <strong>artifacts</strong>: anything produced along the way. Scrum names three official ones: the product backlog, the sprint backlog and the increment. (Not to be confused with a build artifact, such as a Docker image.)</En>
          <Zh>这类文档统称 <strong>artifact</strong>（产出物）：开发过程中产生的任何东西。Scrum 正式定义了三个：product backlog、sprint backlog 和 increment。（别和构建产物混淆，比如 Docker image。）</Zh>
        </p>
        <p>
          <En>A typical design doc outline:</En>
          <Zh>一份典型的 design doc 大纲：</Zh>
        </p>
        <CodeBlock
          language="yaml"
          code={`title: "Design Doc: Order re-routing"   # epic ORD-100
author: tech lead
reviewers: [team, platform]
status: Approved

context: "Why are we doing this? What problem does it solve?"
goals: "What will be true when we're done"
non_goals: "What we deliberately skip (automatic re-routing)"
design: "Diagram of the flow, which services change"
api_changes: "POST /orders/:id/reroute — request, response, errors"
data_model: "New order_status_history table"
alternatives: "Other options we considered, and why we rejected them"
rollout: "Feature flag, migration steps, how to roll back"
risks: "Open questions"`}
        />
        <p className="callout">
          <En>Rule of thumb: if someone will ask &quot;why did we do it this way?&quot; in six months, the answer belongs in Confluence, linked from the ticket.</En>
          <Zh>经验法则：如果半年后有人会问&quot;当初为什么这么做？&quot;，答案就该写进 Confluence，并从 ticket 链过去。</Zh>
        </p>


        {/* ───────────────────────── 12. AI ───────────────────────── */}
        <h3>
          <En>12. AI and the industry — what has actually changed</En>
          <Zh>12. AI 与软件行业——到底改变了什么</Zh>
        </h3>
        <p>
          <En>AI assistants are part of the normal workflow. What the big studies agree on:</En>
          <Zh>AI 助手已是日常工作流的一部分。大型研究的共识是：</Zh>
        </p>
        <Bottleneck />
        <ul>
          <li>
            <En>Nearly everyone uses it, fewer trust it — 84% use or plan to; more distrust its accuracy than trust it.</En>
            <Zh>几乎人人在用，信任的人更少——84% 在用或打算用；不信任其准确性的人比信任的多。</Zh>
          </li>
          <li>
            <En>It speeds up writing code, not delivering software (DORA, METR 2025).</En>
            <Zh>它加快的是写代码，不是交付软件（DORA、METR 2025）。</Zh>
          </li>
          <li>
            <En>AI is an amplifier: strong tests and CI/CD get faster, messy teams get messier.</En>
            <Zh>AI 是放大器：测试和 CI/CD 扎实的团队更快，混乱的团队更乱。</Zh>
          </li>
          <li>
            <En><strong>You own every line you submit</strong> — &quot;the AI wrote it&quot; is never an answer.</En>
            <Zh><strong>你提交的每一行都由你负责</strong>——&quot;是 AI 写的&quot;永远不是答案。</Zh>
          </li>
          <li>
            <En>Reviewing code is a core skill; fundamentals let you spot &quot;almost right&quot;.</En>
            <Zh>review 代码是核心技能；基础让你能看出&quot;差不多对&quot;。</Zh>
          </li>
          <li>
            <En>Follow your company&apos;s AI policy — no proprietary code or customer data in outside tools.</En>
            <Zh>遵守公司的 AI 政策——不要把专有代码或客户数据贴进外部工具。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>These studies are 2025 snapshots; the lasting takeaway is the pattern, not the percentages.</En>
          <Zh>这些研究是 2025 年的快照；长期有效的是这个规律，而不是具体的百分比。</Zh>
        </p>

        {/* ───────────────────────── 13. Jira & work items ───────────────────────── */}
        <h3>
          <En>13. Jira — where the work lives</En>
          <Zh>13. Jira——工作都放在这里</Zh>
        </h3>

        <h4 className="topic">
          <En>13.1 What Jira is</En>
          <Zh>13.1 Jira 是什么</Zh>
        </h4>
        <p>
          <En><strong>Jira</strong> holds the backlog, tickets, sprints and board. Linear, Azure DevOps and GitHub Projects do the same job.</En>
          <Zh><strong>Jira</strong> 里有 backlog、ticket、sprint 和看板。Linear、Azure DevOps、GitHub Projects 做的是同样的事。</Zh>
        </p>

        <h4 className="topic">
          <En>13.2 The backlog</En>
          <Zh>13.2 Backlog</Zh>
        </h4>
        <BacklogStack />
        <ul>
          <li>
            <En>The PO keeps the important items on top; the bottom can stay vague.</En>
            <Zh>PO 负责把重要的放在最上面；靠下的可以只有一句模糊的话。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>13.3 Epic → Story → Sub-task</En>
          <Zh>13.3 Epic → Story → Sub-task</Zh>
        </h4>
        <svg viewBox="0 0 680 200" role="img" aria-label="Jira hierarchy. An Epic, ORD-100 Order re-routing, spans several sprints. Under it are two stories, ORD-101 manager re-routes an order and ORD-102 customer sees live status, and a bug, ORD-109. Each story is broken into two sub-tasks.">
          <Box x={230} y={10} w={220} h={44} kind="broker" label="EPIC · ORD-100" sub="Order re-routing — spans several sprints" />
          <Box x={20} y={84} w={180} h={44} label="STORY · ORD-101" sub="Manager re-routes an order" />
          <Box x={250} y={84} w={180} h={44} label="STORY · ORD-102" sub="Customer sees live status" />
          <Box x={480} y={84} w={180} h={44} kind="fail" label="BUG · ORD-109" sub="Re-route fails on shipped orders" />
          <Arrow d="M300,54 L112,82" />
          <Arrow d="M340,54 L340,82" />
          <Arrow d="M380,54 L568,82" />
          <Box x={10} y={150} w={100} h={40} kind="muted" label="Sub-task" sub="re-route API" />
          <Box x={116} y={150} w={100} h={40} kind="muted" label="Sub-task" sub="re-route modal UI" />
          <Box x={240} y={150} w={100} h={40} kind="muted" label="Sub-task" sub="emit status event" />
          <Box x={346} y={150} w={100} h={40} kind="muted" label="Sub-task" sub="listen in the UI" />
          <Arrow d="M110,128 L62,148" />
          <Arrow d="M110,128 L166,148" />
          <Arrow d="M340,128 L292,148" />
          <Arrow d="M340,128 L396,148" />
        </svg>
        <ul>
          <li>
            <En><strong>Task</strong> — technical work with no direct user value, like upgrading a library.</En>
            <Zh><strong>Task</strong>——没有直接用户价值的技术工作，如升级依赖库。</Zh>
          </li>
          <li>
            <En><strong>Bug</strong> — something works wrong; write the steps to reproduce.</En>
            <Zh><strong>Bug</strong>——某个功能行为不对；写清复现步骤。</Zh>
          </li>
          <li>
            <En><strong>Spike</strong> — time-boxed research; the output is an answer, not shipped code.</En>
            <Zh><strong>Spike</strong>——有时间上限的调研；产出是结论，不是上线的代码。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>13.4 Anatomy of a ticket</En>
          <Zh>13.4 一张 ticket 的组成</Zh>
        </h4>
        <svg viewBox="0 0 680 350" role="img" aria-label="A mock Jira ticket, ORD-101, titled Re-route an order to a different store. The main column holds the description written as a user story plus details, four acceptance criteria as checkboxes, links to a Figma mockup, a Confluence design doc, a pull request and a blocked ticket, and comments from the tech lead and QA. The sidebar holds status, assignee, reporter, story points, priority, sprint, epic, labels and fix version.">
          <rect x={10} y={10} width={660} height={330} rx={8} fill="#fff" stroke="#cfd6e0" />
          <T x={26} y={32} anchor="start" size={10}>ORD-100 Order re-routing  /  ORD-101  ·  Story</T>
          <T x={26} y={56} anchor="start" size={15} bold color="#1c1c1c">Re-route an order to a different store</T>

          <T x={26} y={86} anchor="start" size={9} bold>DESCRIPTION</T>
          <T x={26} y={102} anchor="start" color="#1c1c1c">As a fulfillment manager, I want to re-route an order to another store,</T>
          <T x={26} y={116} anchor="start" color="#1c1c1c">so that a customer isn&apos;t stuck when the assigned store is out of stock.</T>
          <T x={26} y={132} anchor="start" color="#1c1c1c">Details: a &quot;Re-route&quot; button on the order page; pick the new store from a list.</T>

          <T x={26} y={160} anchor="start" size={9} bold>ACCEPTANCE CRITERIA</T>
          <T x={26} y={176} anchor="start" color="#1c1c1c">☐ Only managers and admins can see the button</T>
          <T x={26} y={190} anchor="start" color="#1c1c1c">☐ Stock is released at the old store and reserved at the new one</T>
          <T x={26} y={204} anchor="start" color="#1c1c1c">☐ The customer&apos;s order page updates without a refresh</T>
          <T x={26} y={218} anchor="start" color="#1c1c1c">☐ Re-routing an already-shipped order shows an error</T>

          <T x={26} y={246} anchor="start" size={9} bold>LINKS</T>
          <T x={26} y={262} anchor="start" color="#2f5fa8">↗ Figma mockup   ↗ Confluence design doc   ↗ PR #482   ⛔ blocks ORD-102</T>

          <T x={26} y={290} anchor="start" size={9} bold>COMMENTS</T>
          <T x={26} y={306} anchor="start" color="#1c1c1c">Tech lead: reuse the existing inventory lock — don&apos;t write a new one.</T>
          <T x={26} y={320} anchor="start" color="#1c1c1c">QA: verified on staging ✓</T>

          <rect x={456} y={72} width={200} height={258} rx={6} fill="#f6f8fb" stroke="#e3e8ef" />
          {[
            ["Status", "IN PROGRESS"],
            ["Assignee", "Alex Kim"],
            ["Reporter", "Sam Lee (BA)"],
            ["Story points", "5"],
            ["Priority", "High"],
            ["Sprint", "Sprint 14"],
            ["Epic", "ORD-100"],
            ["Labels", "frontend, backend"],
            ["Fix version", "v2.3.0"],
          ].map(([k, v], i) => (
            <g key={k}>
              <T x={468} y={98 + i * 26} anchor="start">{k}</T>
              <T x={644} y={98 + i * 26} anchor="end" bold color="#1c1c1c">{v}</T>
            </g>
          ))}
        </svg>
        <ul>
          <li>
            <En><code>ORD-101</code> goes in your branch name and PR title.</En>
            <Zh><code>ORD-101</code> 要写进你的 branch 名和 PR 标题。</Zh>
          </li>
          <li>
            <En>Acceptance criteria are the checklist QA tests against.</En>
            <Zh>acceptance criteria 就是 QA 对照测试的清单。</Zh>
          </li>
          <li>
            <En>Agreed something on Slack? Write it in Comments too.</En>
            <Zh>在 Slack 上谈定的事，也要写进 Comments。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>13.5 User stories and acceptance criteria</En>
          <Zh>13.5 User story 与 acceptance criteria</Zh>
        </h4>
        <CodeBlock
          language="yaml"
          code={`# Template: As a <user>, I want <goal>, so that <benefit>.
user_story:
  as_a: shopper
  i_want: save items to a wishlist
  so_that: I can buy them later without searching again

acceptance_criteria:
  - "A logged-in shopper sees a heart icon on every product card"
  - "Clicking it adds the item; clicking again removes it"
  - "The wishlist page lists saved items, newest first"
  - "A logged-out shopper who clicks the heart is sent to login"`}
        />
        <ul>
          <li>
            <En>The <strong>&quot;so that&quot;</strong> line records <em>why</em> — it tells you what to cut when time runs short.</En>
            <Zh><strong>&quot;so that&quot;</strong> 记录了<em>为什么</em>——时间不够时告诉你哪些可以砍。</Zh>
          </li>
          <li>
            <En>Each criterion must be testable: &quot;loads in under 1 second&quot;, not &quot;is fast&quot;.</En>
            <Zh>每条标准都要能测试：&quot;1 秒内加载完成&quot;，而不是&quot;很快&quot;。</Zh>
          </li>
          <li>
            <En>Unclear criteria? Ask before you code, not after.</En>
            <Zh>标准不清楚？写代码前就问，别等写完。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>13.6 Story points — estimating size, not time</En>
          <Zh>13.6 Story point——估的是大小，不是时间</Zh>
        </h4>
        <p>
          <En>Hours are always wrong, so teams estimate <strong>story points</strong>: one number for amount of work, complexity and unknowns.</En>
          <Zh>小时数总是不准，所以团队估 <strong>story point</strong>：用一个数字综合工作量、复杂度和未知因素。</Zh>
        </p>
        <CodeBlock
          language="yaml"
          code={`# Fibonacci-like scale: 0, 0.5, 1, 2, 3, 5, 8, 13, 21
1:  "trivial, well understood"   # change a validation message
2:  "small"                      # add a field to an existing form
3:  "normal, no surprises"       # a new endpoint like five existing ones
5:  "some unknowns"              # the re-route story above
8:  "real unknowns"              # first time using a new library
13: "too big — split it"         # or do a spike first`}
        />
        <p>
          <En>Points are estimated by <strong>planning poker</strong>: the team discusses the ticket, then everyone reveals a number at the same time so nobody anchors on the tech lead&apos;s guess.</En>
          <Zh>估点用 <strong>planning poker</strong>：团队先讨论这张 ticket，然后所有人同时亮出数字，这样没人会被 tech lead 的数字带偏。</Zh>
        </p>
        <svg viewBox="0 0 680 120" role="img" aria-label="Planning poker. Five developers vote 3, 5, 5, 5 and 13 at the same time. The 3 and the 13 are outliers and explain their reasoning, then the team re-votes and settles on 5 points.">
          <Box x={20} y={12} w={64} h={78} kind="warn" label="3" size={26} />
          <Box x={96} y={12} w={64} h={78} label="5" size={26} />
          <Box x={172} y={12} w={64} h={78} label="5" size={26} />
          <Box x={248} y={12} w={64} h={78} label="5" size={26} />
          <Box x={324} y={12} w={64} h={78} kind="warn" label="13" size={26} />
          {["Dev A", "Dev B", "Dev C", "Dev D", "Dev E"].map((n, i) => (
            <T key={n} x={52 + i * 76} y={108}>{n}</T>
          ))}
          <Arrow d="M396,51 L428,51" />
          <Box x={430} y={22} w={236} h={58} kind="ok" label="Re-vote → 5 points" sub="after the 3 and the 13 explain their reasoning" />
        </svg>
        <ul>
          <li>
            <En>The outliers matter most. The &quot;3&quot; may know a shortcut; the &quot;13&quot; may have spotted a hidden problem. Both explain, then everyone votes again.</En>
            <Zh>最重要的是离群值。投&quot;3&quot;的人可能知道捷径；投&quot;13&quot;的人可能发现了隐藏的问题。两人先解释，然后大家重新投票。</Zh>
          </li>
        </ul>

        <p>
          <En>Rule of thumb: <strong>1 point ≈ one working day for one engineer</strong>, all-in — code, tests, review, QA rework.</En>
          <Zh>经验法则：<strong>1 点 ≈ 一名工程师一个工作日</strong>，全部算在内——代码、测试、review、QA 返工。</Zh>
        </p>
        <PointsRuler />
        <p className="callout">
          <En>A rough sanity check, not a conversion rate — never promise &quot;5 points = 4 days&quot;.</En>
          <Zh>只是粗略参考，不是换算公式——别承诺&quot;5 点 = 4 天&quot;。</Zh>
        </p>
        <p>
          <En><strong>Velocity</strong> = points the team finishes per sprint, averaged. It tells the team how much to take on next.</En>
          <Zh><strong>Velocity</strong> = 团队每个 sprint 完成的点数的平均值，用来判断下次该接多少活。</Zh>
        </p>
        <Capacity />
        <ul>
          <li>
            <En>Tech leads and new hires run lower.</En>
            <Zh>tech lead 和新人的数字更低。</Zh>
          </li>
        </ul>
        <p>
          <En>AI coding tools speed up the <em>coding</em> part only:</En>
          <Zh>AI 编码工具只加快了<em>写代码</em>这一环节：</Zh>
        </p>
        <AiSplit />
        <ul>
          <li>
            <En>Recalibrate points against your recent sprints — don&apos;t compare pre-AI and post-AI velocity.</En>
            <Zh>以最近几个 sprint 为准重新校准点数——别拿 AI 前后的 velocity 对比。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>Velocity is for forecasting, never for comparing teams — push a team to raise it and it just estimates bigger.</En>
          <Zh>Velocity 只用来预测，绝不用来比较团队——逼团队提高它，只会让团队把点估得更大。</Zh>
        </p>

        <h4 className="topic">
          <En>13.7 The board — a ticket&apos;s life</En>
          <Zh>13.7 看板——一张 ticket 的一生</Zh>
        </h4>
        <svg viewBox="0 0 680 222" role="img" aria-label="A Jira board with five columns: To Do, In Progress, Code Review, QA, Done. Tickets move left to right. A red dashed arrow shows QA sending a ticket back to In Progress when it finds a bug.">
          {["TO DO", "IN PROGRESS", "CODE REVIEW", "QA", "DONE"].map((col, i) => (
            <g key={col}>
              <rect x={10 + i * 134} y={10} width={128} height={168} rx={6} fill="#f6f8fb" stroke="#e3e8ef" />
              <T x={74 + i * 134} y={30} bold color="#1c1c1c">{col}</T>
            </g>
          ))}
          <Box x={16} y={44} w={116} h={38} label="ORD-104 · 3" sub="order history filter" size={10} />
          <Box x={16} y={88} w={116} h={38} label="ORD-107 · 2" sub="email on re-route" size={10} />
          <Box x={150} y={44} w={116} h={38} kind="primary" label="ORD-101 · 5" sub="re-route an order" size={10} />
          <Box x={284} y={44} w={116} h={38} label="ORD-103 · 3" sub="store picker UI" size={10} />
          <Box x={418} y={44} w={116} h={38} label="ORD-102 · 5" sub="live status push" size={10} />
          <Box x={418} y={88} w={116} h={38} kind="fail" label="ORD-109 · 2" sub="bug: shipped orders" size={10} />
          <Box x={552} y={44} w={116} h={38} kind="ok" label="ORD-098 · 2" sub="store list API" size={10} />
          <Arrow d="M476,180 L476,196 L208,196 L208,182" ink="red" dashed />
          <T x={342} y={214} color="#c0392b">QA finds a bug → the ticket goes back to In Progress</T>
        </svg>
        <p className="callout">
          <En>Name your branch after the ticket — <code>feature/ORD-101-reroute-order</code> — and Jira links the branch, commits and PR to the ticket automatically.</En>
          <Zh>用 ticket 来命名 branch——<code>feature/ORD-101-reroute-order</code>——Jira 会自动把 branch、commit 和 PR 关联到这张 ticket 上。</Zh>
        </p>
        <ul>
          <li>
            <En><strong>Kanban</strong> — the same board with no sprints and a <strong>WIP limit</strong> per column. Common for support and DevOps.</En>
            <Zh><strong>Kanban</strong>——同样的看板，但没有 sprint，每列有 <strong>WIP limit</strong>。常见于支持和 DevOps 团队。</Zh>
          </li>
        </ul>

        <h4 className="topic">
          <En>13.8 Definition of Done</En>
          <Zh>13.8 Definition of Done</Zh>
        </h4>
        <p>
          <En>Acceptance criteria are different for every ticket. The <strong>Definition of Done (DoD)</strong> is one checklist the whole team agrees on, and it applies to <em>every</em> ticket:</En>
          <Zh>acceptance criteria 每张 ticket 都不一样。<strong>Definition of Done（DoD）</strong>是整个团队约定的同一份清单，适用于<em>每一张</em> ticket：</Zh>
        </p>
        <CodeBlock
          language="yaml"
          code={`# A ticket is Done when every item is true
definition_of_done:
  - "all acceptance criteria are met"
  - "code is reviewed and approved (e.g. 2 approvals)"
  - "unit tests written, CI pipeline green"
  - "merged to the main branch"
  - "deployed to the test / staging environment"
  - "QA tested and passed"
  - "docs updated (API docs, Confluence) if anything changed"
  - "PO accepted it"`}
        />
        <p className="callout">
          <En>Without a DoD, &quot;done&quot; means &quot;works on my laptop.&quot; With one, &quot;done&quot; means the same thing for everybody.</En>
          <Zh>没有 DoD，&quot;做完了&quot;的意思是&quot;在我电脑上能跑&quot;。有了 DoD，&quot;做完了&quot;对每个人的含义都一样。</Zh>
        </p>
        <ul>
          <li>
            <En>Every Done ticket adds to the sprint&apos;s <strong>increment</strong>: the working, usable software built so far.</En>
            <Zh>每张 Done 的 ticket 都会累加进本 sprint 的 <strong>increment</strong>：到目前为止做出来的、能用的软件。</Zh>
          </li>
          <li>
            <En>The DoD is what decides whether something counts as part of the increment — and the increment is what gets shown at the demo.</En>
            <Zh>DoD 决定某样东西算不算进 increment——而 increment 就是 demo 上展示的东西。</Zh>
          </li>
        </ul>


        <div className="concept">
          <p className="concept-label">Putting it together</p>
          <ul>
            <li>
              <En>The PO and BA turn client needs into tickets in the backlog; grooming makes them clear and estimated.</En>
              <Zh>PO 和 BA 把客户需求变成 backlog 里的 ticket；grooming 让它们变得清晰、估好点。</Zh>
            </li>
            <li>
              <En>Planning pulls them into a sprint and onto your name; you build them on a branch named after the ticket.</En>
              <Zh>planning 把它们拉进 sprint、分到你名下；你在以 ticket 命名的 branch 上实现。</Zh>
            </li>
            <li>
              <En>The PR, CI, QA and the Definition of Done carry each one to Done; the demo shows it, the retro improves how the next one goes.</En>
              <Zh>PR、CI、QA 和 Definition of Done 把每张 ticket 推到 Done；demo 展示它，retro 让下一轮做得更好。</Zh>
            </li>
            <li>
              <En>That&apos;s the process. What&apos;s left is the system itself — every layer of the stack, front to back, explained as one piece.</En>
              <Zh>流程就是这样。剩下的是系统本身——技术栈的每一层，从前到后，作为一个整体讲清楚。</Zh>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
