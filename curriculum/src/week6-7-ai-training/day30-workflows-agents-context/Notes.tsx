import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  AgentChannels,
  AgentContract,
  AgentLoopPattern,
  ApprovalPause,
  CheckpointLoop,
  CoreMap,
  DataChannel,
  EvaluatorOptimizer,
  FourMoves,
  IncidentBrief,
  MemoryTypes,
  TwoWaysToDrive,
  ParallelPattern,
  PromptChain,
  RouterPattern,
  StopConditions,
  SubagentIsolation,
  ThreeCores,
  Topologies,
  TradeoffAxes,
  WindowFills,
} from "./Diagrams";

type Pair = [string, string];

function Lead({ en, zh }: { en: string; zh: string }) {
  return (
    <p>
      <En>{en}</En>
      <Zh>{zh}</Zh>
    </p>
  );
}

function Bullets({ items }: { items: Pair[] }) {
  return (
    <ul>
      {items.map(([en, zh]) => (
        <li key={en}>
          <En>{en}</En>
          <Zh>{zh}</Zh>
        </li>
      ))}
    </ul>
  );
}

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 30 Notes</title>
      <DayNav day="day30-workflows-agents-context" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 30 · Notes</p>
        <h1>Workflows, Agents &amp; Context Engineering</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. Every design is built from three pieces: the LLM call, the control flow between calls, and the state that carries results from one call to the next.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。所有设计都由三部分组成：LLM 调用、调用之间的控制流，以及把结果从一次调用带到下一次调用的 state。</Zh>
        </p>
        <ul>
          <li>
            <En>Name the three core pieces: the LLM call, the control flow (decided by your code or by the model), and the state that passes results between them</En>
            <Zh>说出三个核心部分：LLM 调用、控制流（由你的代码或由模型决定）、在它们之间传递结果的 state</Zh>
          </li>
          <li>
            <En>Explain the workflow patterns (prompt chain, router, parallelization, evaluator-optimizer) and when each one breaks</En>
            <Zh>解释几种 workflow 模式（prompt chain、router、parallelization、evaluator-optimizer），以及它们各自在什么情况下会失效</Zh>
          </li>
          <li>
            <En>Pass results the right way: hand them on when the next call depends on them, write them to a shared state when calls are independent, and between agents share a report or a file, never a whole window</En>
            <Zh>正确地传递结果：下一步依赖它时直接传递，调用互不依赖时写入共享 state，agent 之间共享报告或文件，绝不共享整个窗口</Zh>
          </li>
          <li>
            <En>Explain the difference between a workflow and an agent, and choose between them: a workflow when you can write the steps, an agent when you only have a goal</En>
            <Zh>解释 workflow 和 agent 的区别并做出选择：能写出步骤时用 workflow，只有目标时用 agent</Zh>
          </li>
          <li>
            <En>Explain why a long-running agent gets costlier, slower and worse, and name the four context moves: write, select, compress, isolate</En>
            <Zh>解释为什么运行很久的 agent 会变贵、变慢、变差，并说出上下文工程的四个动作：write、select、compress、isolate</Zh>
          </li>
          <li>
            <En>Explain orchestrator-workers: a worker is another agent loop in its own window, started either by your code or by a lead agent's tool call</En>
            <Zh>解释 orchestrator-workers：worker 是在自己窗口里运行的另一个 agent 循环，由你的代码或 lead agent 的 tool 调用来启动</Zh>
          </li>
          <li>
            <En>Explain how checkpoints let a run survive a crash, how an approval step pauses it, and why memory needs a way to forget</En>
            <Zh>解释 checkpoint 如何让运行在崩溃后恢复、审批步骤如何暂停运行，以及为什么记忆需要&quot;遗忘&quot;的机制</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/ai-training/day30-workflows-agents-context/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ───────────── 1. three core pieces ───────────── */}
        <h3 className="part part-lg">
          <En>1. Three core pieces</En>
          <Zh>1. 三个核心部分</Zh>
        </h3>
        <Lead
          en="Everything today is built from the same three pieces. Each pattern is just a different choice for the second and the third."
          zh="今天的所有内容都由同样的三个部分搭成。每种模式只是对第二和第三部分做了不同的选择。"
        />
        <ThreeCores />
        <Bullets
          items={[
            ["LLM call: one request to the model. It returns text, or a request to use a tool.", "LLM 调用：向模型发一次请求。它返回文本，或者一个使用 tool 的请求。"],
            ["Control flow: who picks the next step. Your code (chain, route, parallel, loop) or the model (tool calls, delegation).", "控制流：谁来选下一步。你的代码（chain、route、parallel、loop），或者模型（tool 调用、委派）。"],
            ["State: how one call's result reaches the next. Passed on as a return value, or written to a shared state that other calls read (section 6).", "State：一次调用的结果如何到达下一次。要么作为返回值直接传下去，要么写入共享 state 供其他调用读取（第 6 节）。"],
          ]}
        />

        {/* ───────────── 2. workflow patterns ───────────── */}
        <h3 className="part part-lg">
          <En>2. Workflows: your code controls the flow</En>
          <Zh>2. Workflow：由你的代码控制流程</Zh>
        </h3>
        <Lead
          en="Scenario for the whole page: Dana emails Lumen Audio, a headphone store. “My Aria 500 broke after 10 days. I want a refund, and is this the firmware bug?” Each pattern below ends with the same footer: use when, costs, breaks."
          zh="贯穿全文的场景：Dana 给耳机商店 Lumen Audio 发邮件：“我的 Aria 500 用了 10 天就坏了。我要退款，这是不是那个固件 bug？”下面每种模式都用同样的结尾：适用场景、代价、会在哪里出问题。"
        />

        <h4 className="topic topic-line">
          <En>2.1 Prompt chain</En>
          <Zh>2.1 Prompt chain（提示链）</Zh>
        </h4>
        <Lead
          en="A fixed sequence of small prompts. Returns-form emails are always refunds, so there is no classify step."
          zh="一串固定顺序的小 prompt。退货表单的邮件一定是退款，所以没有分类这一步。"
        />
        <PromptChain />
        <Bullets
          items={[
            ["🔧 Look up order is plain code, not a tool call. A tool is something the model chooses to call; in a workflow your code already knows the next step, so it just calls getOrder().", "🔧 查订单是普通代码，不是 tool 调用。tool 是由模型决定是否调用的；在 workflow 里，你的代码已经知道下一步，所以直接调用 getOrder() 就行。"],
            ["📄 Fetch policy is RAG in miniature: retrieve the document, put it in the next prompt.", "📄 取政策就是一个迷你 RAG：检索文档，放进下一个 prompt。"],
            ["✅ Use when: the steps are fixed and known.", "✅ 适用：步骤固定且已知。"],
            ["💸 Costs: more calls, more latency.", "💸 代价：调用更多，延迟更高。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>2.2 Router</En>
          <Zh>2.2 Router（路由）</Zh>
        </h4>
        <Lead
          en="Classify the input first, then send it down the path built for it."
          zh="先对输入分类，再把它送到专门为它准备的路径。"
        />
        <RouterPattern />
        <Bullets
          items={[
            ["✅ Use when: different inputs need different prompts or tools.", "✅ 适用：不同输入需要不同的 prompt 或 tools。"],
            ["💸 Costs: one extra call to classify.", "💸 代价：多一次分类调用。"],
            ["🛑 Breaks: an input that fits two boxes. Dana gets half an answer.", "🛑 出问题：输入同时属于两类。Dana 只得到一半的回答。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>2.3 Parallelization</En>
          <Zh>2.3 Parallelization（并行）</Zh>
        </h4>
        <Lead
          en="Run independent model calls at the same time. Sectioning splits a job into parts and merges them. Voting asks the same question several times and takes the majority."
          zh="让互不依赖的模型调用同时运行。分段（sectioning）把任务拆成几部分再合并；投票（voting）把同一个问题问多次，取多数。"
        />
        <ParallelPattern />
        <Bullets
          items={[
            ["✅ Use when: parts are independent (speed) or you want votes (confidence).", "✅ 适用：各部分互不依赖（求快），或需要投票（求稳）。"],
            ["💸 Costs: more tokens in total.", "💸 代价：总 token 更多。"],
            ["🛑 Breaks: when one part needs another part's result.", "🛑 出问题：某一部分需要另一部分的结果时。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>2.4 Evaluator-optimizer: a loop in your code</En>
          <Zh>2.4 Evaluator-optimizer：写在代码里的循环</Zh>
        </h4>
        <Lead
          en="One call writes, another checks, and failures go back with feedback. Your code owns the loop, so it is a workflow, but the same pair shows up inside many agent systems."
          zh="一次调用负责写，另一次负责检查，不合格的带着反馈退回重写。循环由你的代码掌控，所以它是 workflow，但同样的组合也常出现在 agent 系统里。"
        />
        <EvaluatorOptimizer />
        <Bullets
          items={[
            ["✅ Use when: “good” fits in a rubric.", "✅ 适用：“好”可以写成评分标准。"],
            ["💸 Costs: an extra call every round.", "💸 代价：每轮多一次调用。"],
            ["🛑 Breaks: a vague rubric or no round cap loops forever.", "🛑 出问题：评分标准含糊或没有轮数上限，就会无限循环。"],
          ]}
        />

        {/* ───────────── 3. agents ───────────── */}
        <h3 className="part part-lg">
          <En>3. Agents: the model controls the flow</En>
          <Zh>3. Agent：由模型控制流程</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>3.1 The agent loop</En>
          <Zh>3.1 Agent 循环</Zh>
        </h4>
        <Lead
          en="In a workflow, your code picks the next step. In an agent, the model does, through tool calls and stop reasons. This is the loop you already know."
          zh="在 workflow 里，下一步由你的代码选择。在 agent 里，由模型通过 tool 调用和 stop reason 来选择。这就是你已经熟悉的那个循环。"
        />
        <AgentLoopPattern />
        <CodeBlock
          language="typescript"
          code={`for (let turn = 0; turn < MAX_TURNS; turn++) {
  const reply = await callModel(messages, tools);
  if (reply.stop_reason !== "tool_use") break; // "end_turn": the model is done
  messages.push(reply, await runTools(reply)); // the model picked the tool
}`}
        />
        <Bullets
          items={[
            ["✅ Use when: the path can't be known in advance.", "✅ 适用：路径无法提前知道。"],
            ["💸 Costs: unknown turns and tokens; harder to test.", "💸 代价：轮数和 token 不确定，更难测试。"],
            ["🛑 Breaks: loops or picks the wrong tool, so cap the turns.", "🛑 出问题：可能循环或选错 tool，所以要限制轮数。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>3.2 Workflow or agent?</En>
          <Zh>3.2 Workflow 还是 agent？</Zh>
        </h4>
        <CoreMap />
        <Bullets
          items={[
            ["Workflow: the order of steps is written in your code. The model fills in each step.", "Workflow：步骤的顺序写在你的代码里，模型只负责完成每一步。"],
            ["Agent: the model chooses the next step itself, in a loop, and may hand work to subagents.", "Agent：模型自己在循环里选择下一步，还可以把工作交给 subagent。"],
            ["Most real systems are a workflow with an agent step inside.", "多数真实系统是在 workflow 里嵌一个 agent 步骤。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>3.3 The trade-off</En>
          <Zh>3.3 取舍</Zh>
        </h4>
        <TradeoffAxes />
        <h5 className="topic-sub">
          <En>When to choose which</En>
          <Zh>什么时候选哪个</Zh>
        </h5>
        <ul>
          <li>
            <En><strong>🛤️ Choose a workflow when</strong></En>
            <Zh><strong>🛤️ 以下情况选 workflow</strong></Zh>
            <ul>
              <li>
                <En><strong>The steps are well-defined:</strong> you can write them down before the task starts.</En>
                <Zh><strong>步骤明确：</strong>任务开始前就能把步骤写下来。</Zh>
              </li>
              <li>
                <En><strong>Each step's output is predictable:</strong> you know what the next step will get.</En>
                <Zh><strong>每一步的输出可预测：</strong>你知道下一步会拿到什么。</Zh>
              </li>
              <li>
                <En><strong>You need cost and speed you can count on:</strong> the same path and the same calls every run, so it is easy to test.</En>
                <Zh><strong>需要可控的成本和速度：</strong>每次都是同一条路径、同样的调用，所以容易测试。</Zh>
              </li>
              <li>
                <En><strong>Examples:</strong></En>
                <Zh><strong>例子：</strong></Zh>
                <Bullets
                  items={[
                    ["Support ticket triage and routing", "客服工单分类与分发"],
                    ["Extracting fields from invoices or forms", "从发票或表单中提取字段"],
                    ["Moderating posts against a written policy", "按书面规则审核帖子"],
                    ["Translating or summarising documents", "翻译或总结文档"],
                    ["Drafting marketing copy, then checking it against a rubric", "先写营销文案再按评分标准检查"],
                    ["A nightly report from the same queries", "用固定查询生成每晚的报表"],
                  ]}
                />
              </li>
            </ul>
          </li>
          <li>
            <En><strong>🧭 Choose an agent when</strong></En>
            <Zh><strong>🧭 以下情况选 agent</strong></Zh>
            <ul>
              <li>
                <En><strong>You only have a goal:</strong> nobody can list the steps in advance.</En>
                <Zh><strong>你只有目标：</strong>没人能提前列出步骤。</Zh>
              </li>
              <li>
                <En><strong>Each step's output decides the next:</strong> what to do next depends on what was just found.</En>
                <Zh><strong>每一步的输出决定下一步：</strong>下一步做什么取决于刚刚发现了什么。</Zh>
              </li>
              <li>
                <En><strong>The inputs are too varied to code for:</strong> every case looks different, so you give the model tools and let it choose.</En>
                <Zh><strong>输入太多样，没法逐一写代码：</strong>每个案例都不一样，所以给模型 tools，让它自己选。</Zh>
              </li>
              <li>
                <En><strong>Examples:</strong></En>
                <Zh><strong>例子：</strong></Zh>
                <Bullets
                  items={[
                    ["Coding agents (read the code, run the tests, fix, repeat)", "编程 agent（读代码、跑测试、修改，循环往复）"],
                    ["Research and data analysis", "研究与数据分析"],
                    ["Web browser automation", "网页浏览器自动化"],
                    ["Investigating an outage across logs, metrics and code", "在日志、指标和代码之间排查故障"],
                    ["Support cases with several problems at once", "同时包含多个问题的客服案例"],
                    ["Planning a trip across flights, hotels and calendars", "跨航班、酒店和日历规划行程"],
                  ]}
                />
              </li>
            </ul>
          </li>
        </ul>

        {/* ───────────── 4. context ───────────── */}
        <h3 className="part part-lg">
          <En>4. Where one agent breaks: the context window</En>
          <Zh>4. 单个 agent 的瓶颈：上下文窗口</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>4.1 The window fills up</En>
          <Zh>4.1 窗口越来越满</Zh>
        </h4>
        <Lead
          en="Pain point: the loop re-sends the entire window on every turn, and every tool result is added to it."
          zh="痛点：循环每一轮都会把整个窗口重新发送一遍，而且每个 tool 结果都会被追加进去。"
        />
        <WindowFills />
        <Bullets
          items={[
            ["Instructions and tool definitions stay the same size. Tool results are what grow fastest.", "指令和 tool 定义的大小不变，增长最快的是 tool 结果。"],
            ["Every turn costs more and takes longer. Quality drops too, because old noise buries what matters now.", "每一轮都更贵、更慢。质量也会下降，因为旧的噪音会淹没当前重要的内容。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>4.2 Context engineering: write, select, compress</En>
          <Zh>4.2 上下文工程：write、select、compress</Zh>
        </h4>
        <Lead
          en="Context engineering is deciding what is in the window at each step. The first three moves are cheap: they change one agent, not the shape of the system."
          zh="上下文工程就是决定每一步窗口里放什么。前三个动作成本很低：它们只改动一个 agent，而不改变系统的结构。"
        />
        <FourMoves />
        <Bullets
          items={[
            ["Write and select: keep plans and findings in a file, and fetch documents just in time. A tool should return ids and short snippets, not a whole database row.", "Write 和 select：计划和发现写进文件，文档在用到时再取。tool 应该返回 id 和简短片段，而不是整条数据库记录。"],
            ["Compress: summarise old turns and keep the recent ones. Write anything critical down first, because a summary loses detail.", "Compress：总结旧的轮次，保留最近几轮。关键内容要先写下来，因为总结会丢失细节。"],
            ["Layout: put the stable parts first so a provider can cache them, and the current task last.", "排布：稳定的部分放前面，服务商可以缓存它们；当前任务放最后。"],
            ["When all of that is done and the job is still too big for one window, use the fourth move: isolate.", "这些都做完了，任务仍然超出一个窗口时，就用第四个动作：isolate。"],
          ]}
        />

        {/* ───────────── 5. subagents ───────────── */}
        <h3 className="part part-lg">
          <En>5. Isolate: orchestrator and subagents</En>
          <Zh>5. Isolate：orchestrator 与 subagent</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>5.1 Isolate: one worker, one fresh window</En>
          <Zh>5.1 Isolate：一个 worker，一个全新的窗口</Zh>
        </h4>
        <Lead
          en="Pain point: to tell Dana whether the firmware bug is real, an agent must read dozens of pages of incident reports, and that noise would fill the main window."
          zh="痛点：要告诉 Dana 固件 bug 是不是真的，agent 得读几十页事故报告，这些噪音会把主窗口塞满。"
        />
        <SubagentIsolation />
        <CodeBlock
          language="typescript"
          code={`// a worker: to whoever calls it, this is just a function (or a tool)
async function runWorker(brief: string) {
  const messages = [{ role: "user", content: brief }];
  const report = await runAgentLoop(messages, readTools); // its own window
  return report; // only this goes back to the caller
}`}
        />
        <Bullets
          items={[
            ["🔁 No new machinery: a worker is the same agent loop, started with its own messages.", "🔁 没有新的机制：worker 就是同一个 agent 循环，只是从自己的 messages 开始。"],
            ["🗑️ The 20,000 tokens of reading are thrown away. Only the short report comes back.", "🗑️ 两万 token 的阅读内容被丢弃，只有简短的报告返回。"],
            ["🏷️ Worker and subagent mean the same thing. So do orchestrator, lead agent and supervisor.", "🏷️ Worker 和 subagent 是一回事；orchestrator、lead agent 和 supervisor 也是一回事。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>5.2 Two ways to drive the workers</En>
          <Zh>5.2 驱动 worker 的两种方式</Zh>
        </h4>
        <Lead
          en="The worker is the same. What changes is who decides when to start one: your code or the lead agent. It is the workflow-or-agent choice from section 3, one level up."
          zh="worker 是一样的。变的是谁决定什么时候启动它：你的代码，还是 lead agent。这就是第 3 节 workflow 与 agent 的选择，只是上升了一层。"
        />
        <TwoWaysToDrive />
        <ul>
          <li>
            <En><strong>🛤️ Code-driven: orchestrator-workers (step 10)</strong></En>
            <Zh><strong>🛤️ 代码驱动：orchestrator-workers（第 10 步）</strong></Zh>
            <ul>
              <li>
                <En><strong>Who starts the workers:</strong> your code, after one planning call.</En>
                <Zh><strong>谁启动 worker：</strong>你的代码，在一次规划调用之后。</Zh>
              </li>
              <li>
                <En><strong>Order:</strong> all at once, in parallel. Each writes its own section of a shared file.</En>
                <Zh><strong>顺序：</strong>同时并行。每个 worker 写共享文件里自己的那一部分。</Zh>
              </li>
              <li>
                <En><strong>Choose it when:</strong> the subtasks are known once you have a plan, such as one worker per report for incident 011.</En>
                <Zh><strong>适用：</strong>有了计划就知道子任务，比如 011 号事故每份报告一个 worker。</Zh>
              </li>
            </ul>
          </li>
          <li>
            <En><strong>🧭 Agent-driven: a lead agent with a research tool (step 11)</strong></En>
            <Zh><strong>🧭 Agent 驱动：带 research tool 的 lead agent（第 11 步）</strong></Zh>
            <ul>
              <li>
                <En><strong>Who starts the workers:</strong> the lead model, by calling the tool.</En>
                <Zh><strong>谁启动 worker：</strong>lead 模型，通过调用 tool。</Zh>
              </li>
              <li>
                <En><strong>Order:</strong> one at a time, as the lead decides. Each report comes back as a tool result.</En>
                <Zh><strong>顺序：</strong>由 lead 决定，一次一个。每份报告作为 tool 结果返回。</Zh>
              </li>
              <li>
                <En><strong>Choose it when:</strong> each answer decides the next question, such as needing the fix date before asking what happened up to it.</En>
                <Zh><strong>适用：</strong>每个答案决定下一个问题，比如先要知道修复日期，才能问到那天为止发生了什么。</Zh>
              </li>
            </ul>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>5.3 The contract: brief in, report out</En>
          <Zh>5.3 约定：brief 进，报告出</Zh>
        </h4>
        <AgentContract />
        <Bullets
          items={[
            ["A worker starts with an empty window, so the brief must contain everything it needs.", "worker 从空白窗口开始，所以 brief 必须包含它需要的一切。"],
            ["Treat a report as untrusted input: it may contain text copied from a web page or document.", "把报告当作不可信输入：里面可能带有从网页或文档复制来的文字。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>5.4 When to split, and when not to</En>
          <Zh>5.4 什么时候拆，什么时候不拆</Zh>
        </h4>
        <Bullets
          items={[
            ["Split for broad, parallel, noisy work: research across many documents, logs, searches.", "适合拆的是范围广、可并行、噪音大的工作：跨大量文档的研究、日志、搜索。"],
            ["Do not split steps that depend on each other, or work where two agents would edit the same thing.", "不要拆互相依赖的步骤，也不要拆两个 agent 会改同一样东西的工作。"],
            ["Isolation is not a discount: every worker pays for its own instructions, so the total tokens go up.", "隔离不是打折：每个 worker 都要为自己的指令付费，所以总 token 会增加。"],
            ["Cap the hops and the tokens per run, and trace every call with a run id.", "限制跳转次数和每次运行的 token，并用 run id 追踪每一次调用。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>5.5 Other shapes, briefly</En>
          <Zh>5.5 其他形状，简单了解</Zh>
        </h4>
        <Topologies />
        <Bullets
          items={[
            ["Supervisor is orchestrator-workers. Hierarchical stacks it: a lead with managers, each with workers.", "Supervisor 就是 orchestrator-workers。Hierarchical 是把它叠起来：一个 lead 带几个 manager，每个 manager 再带 worker。"],
            ["Handoff passes the whole conversation to another agent, such as triage passing Dana's refund to a refunds agent.", "Handoff 是把整个对话交给另一个 agent，比如分诊 agent 把 Dana 的退款交给退款 agent。"],
            ["Peer networks are flexible but hard to control, so they are rarely the first choice.", "对等网络很灵活但难以控制，所以很少作为首选。"],
          ]}
        />

        {/* ───────────── 6. shared state ───────────── */}
        <h3 className="part part-lg">
          <En>6. Shared state: how steps and agents pass results</En>
          <Zh>6. 共享 state：步骤和 agent 之间如何传递结果</Zh>
        </h3>
        <Lead
          en="Every pattern so far had to get one call's result to the next. There are only two ways to do it, and the choice depends on one question: does the next call need this answer before it can start?"
          zh="到目前为止的每种模式，都要把一次调用的结果交给下一次。方法只有两种，选哪种取决于一个问题：下一次调用是否必须先拿到这个答案才能开始？"
        />

        <h4 className="topic topic-line">
          <En>6.1 Pass it on, or share it</En>
          <Zh>6.1 直接传递，还是共享</Zh>
        </h4>
        <DataChannel />
        <ul>
          <li>
            <En><strong>➡️ Pass it on</strong> when the next call depends on it</En>
            <Zh><strong>➡️ 直接传递</strong>：下一次调用依赖它时</Zh>
            <ul>
              <li>
                <En><strong>How:</strong> await the answer and hand it to the next call as input.</En>
                <Zh><strong>怎么做：</strong>await 这个答案，把它作为输入交给下一次调用。</Zh>
              </li>
              <li>
                <En><strong>In the code:</strong> step 01 prints every value it hands on (look up the order → decide → draft).</En>
                <Zh><strong>代码里：</strong>第 01 步会打印每一个传下去的值（查订单 → 判断 → 写回复）。</Zh>
              </li>
            </ul>
          </li>
          <li>
            <En><strong>🗂️ Share it</strong> when the calls are independent</En>
            <Zh><strong>🗂️ 共享</strong>：调用之间互不依赖时</Zh>
            <ul>
              <li>
                <En><strong>How:</strong> run the calls at once; each writes its own key into one state object (or file), and the next step reads the state.</En>
                <Zh><strong>怎么做：</strong>同时运行这些调用；每个把结果写进同一个 state 对象（或文件）里自己的字段，下一步再读取这个 state。</Zh>
              </li>
              <li>
                <En><strong>In the code:</strong> step 03's refund, warranty and firmware checks fill one <code>state</code> object, and the merge call reads only that.</En>
                <Zh><strong>代码里：</strong>第 03 步的退款、保修和固件检查填进同一个 <code>state</code> 对象，合并调用只读它。</Zh>
              </li>
              <li>
                <En><strong>Rule:</strong> one key per writer, so parallel calls never overwrite each other.</En>
                <Zh><strong>规则：</strong>每个写入者一个字段，这样并行调用就不会互相覆盖。</Zh>
              </li>
            </ul>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.2 Between agents: a report or a file, never a whole window</En>
          <Zh>6.2 agent 之间：共享报告或文件，绝不共享整个窗口</Zh>
        </h4>
        <AgentChannels />
        <ul>
          <li>
            <En><strong>➡️ Through the lead</strong> (agent-driven, step 11): a worker's report comes back as a tool result, and the lead copies the key facts into the next brief. The log prints which facts it carried.</En>
            <Zh><strong>➡️ 经过 lead</strong>（agent 驱动，第 11 步）：worker 的报告作为 tool 结果返回，lead 把关键事实抄进下一个 brief。日志会打印它带过去了哪些事实。</Zh>
          </li>
          <li>
            <En><strong>🗂️ Through a shared file</strong> (code-driven, step 10): each worker writes its own section of <code>findings.md</code>, and the orchestrator reads the file when all are done.</En>
            <Zh><strong>🗂️ 经过共享文件</strong>（代码驱动，第 10 步）：每个 worker 写 <code>findings.md</code> 里自己的那一部分，全部完成后 orchestrator 再读这个文件。</Zh>
          </li>
          <li>
            <En><strong>🚫 Never share a whole window</strong> between agents: that would undo the isolation from section 5.</En>
            <Zh><strong>🚫 绝不在 agent 之间共享整个窗口</strong>：那样就等于取消了第 5 节的隔离。</Zh>
          </li>
          <li>
            <En><strong>💾 Save the state to disk</strong> and a run can survive a crash or wait for a person. That is the next section.</En>
            <Zh><strong>💾 把 state 存到磁盘</strong>，运行就能在崩溃后恢复，或者等待人工审批。这就是下一节的内容。</Zh>
          </li>
        </ul>

        {/* ───────────── 7. long-running + memory ───────────── */}
        <h3 className="part part-lg">
          <En>7. Long-running work and memory</En>
          <Zh>7. 长时间运行的工作与记忆</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>7.1 Checkpoint after every step</En>
          <Zh>7.1 每一步之后做 checkpoint</Zh>
        </h4>
        <Lead
          en="Pain point: a long run will meet a timeout, a rate limit or a deploy. Without saved state, a crash at step 6 repeats the time, the money and the side effects of steps 1 to 5."
          zh="痛点：长时间的运行迟早会遇到超时、限流或部署重启。没有保存状态的话，第 6 步崩溃就意味着第 1 到 5 步的时间、费用和副作用全部重来。"
        />
        <CheckpointLoop />
        <CodeBlock
          language="typescript"
          code={`for (const step of plan) {
  if (state.done.includes(step.id)) continue; // finished before the crash
  state.results[step.id] = await runStep(step, state);
  state.done.push(step.id);
  saveState(runId, state); // checkpoint after every step
}`}
        />
        <Bullets
          items={[
            ["The saved state is the shared state from section 6, kept on disk instead of in memory.", "保存下来的 state 就是第 6 节的共享 state，只是存在磁盘上而不是内存里。"],
            ["The step that crashed may run twice, so steps must be idempotent: a repeated refund must not pay twice.", "崩溃的那一步可能会再跑一次，所以步骤必须幂等：重复的退款不能付两次钱。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>7.2 Human approval is a pause</En>
          <Zh>7.2 人工审批是一次&quot;暂停&quot;</Zh>
        </h4>
        <ApprovalPause />
        <Bullets
          items={[
            ["An approval step saves the state and stops. The process does not sit there waiting.", "审批步骤会保存状态然后停止，进程不会一直坐在那里等。"],
            ["The same mechanism that survives a crash also survives a human who answers tomorrow.", "能在崩溃后恢复的同一套机制，也能应对明天才回复的人。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>7.3 Know when to stop</En>
          <Zh>7.3 知道何时停止</Zh>
        </h4>
        <StopConditions />
        <Bullets
          items={[
            ["Whichever limit hits first ends the run. Report why, and hand over to a person instead of retrying forever.", "哪个限制先触发，就由它结束运行。要报告原因，并交给人处理，而不是无限重试。"],
            ["The demo (step 13) shows the turn cap. The others work the same way: check the limit before each model call.", "演示（第 13 步）展示的是轮数上限。其他几种原理相同：每次调用模型之前先检查限制。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>7.4 Memory, and forgetting</En>
          <Zh>7.4 记忆与遗忘</Zh>
        </h4>
        <MemoryTypes />
        <Bullets
          items={[
            ["🧠 The model remembers nothing between calls. Memory is your app's feature: store it, then put the relevant part back into the prompt.", "🧠 模型在两次调用之间什么都不记得。记忆是你的应用的功能：把它存起来，再把相关的部分放回 prompt。"],
            ["🗄️ In production both live in the database. What separates them is scope, not storage.", "🗄️ 在生产环境里两者都存在数据库中。区分它们的是范围，而不是存储位置。"],
            ["💬 Short-term: one conversation. Its whole history is sent back on every turn.", "💬 短期记忆：一次对话。它的全部历史每一轮都会被重新发送。"],
            ["👤 Long-term: one user, across conversations. The server selects a few facts and puts them in the prompt (step 14).", "👤 长期记忆：一个用户，跨越所有对话。服务器挑出几条事实放进 prompt（第 14 步）。"],
          ]}
        />

        {/* ───────────── 8. recap ───────────── */}
        <h3 className="part part-lg">
          <En>8. Putting it together</En>
          <Zh>8. 把它们组合起来</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>8.1 Dana's email, every idea</En>
          <Zh>8.1 Dana 的邮件，用上所有想法</Zh>
        </h4>
        <IncidentBrief />
        <Bullets
          items={[
            ["A router and a workflow give the control. Workers in separate windows give the isolation.", "Router 和 workflow 提供控制，各自独立窗口里的 worker 提供隔离。"],
            ["An evaluator guards the quality, and a human approves before anything leaves the system.", "Evaluator 守住质量，任何内容离开系统之前都要经过人工审批。"],
            ["State is saved after every step, so the whole thing can crash, pause or resume.", "每一步之后都保存 state，所以整个流程可以崩溃、暂停、恢复。"],
          ]}
        />

        <h4 className="topic topic-line">
          <En>8.2 The interview answer</En>
          <Zh>8.2 面试回答</Zh>
        </h4>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>“Workflow or agent?” A workflow when I can write the steps, because it is cheaper and predictable. An agent only where the path cannot be known in advance, with a turn cap.</En>
              <Zh>“Workflow 还是 agent？”能写出步骤时用 workflow，因为更便宜、更可预测。只有路径无法提前知道时才用 agent，并设置轮数上限。</Zh>
            </li>
            <li>
              <En>“It gets worse on long jobs.” The window fills with tool output, so I write, select and compress first, and isolate with subagents when the job is still too big.</En>
              <Zh>“长任务会变差。”因为窗口被 tool 输出塞满，所以我先用 write、select、compress，任务仍然太大时再用 subagent 做 isolate。</Zh>
            </li>
            <li>
              <En>“Multi-agent?” An orchestrator with workers, only for broad, parallel, noisy work. Each worker gets a clear brief and returns a short report with sources, or writes to a shared file.</En>
              <Zh>“多 agent？”用 orchestrator 加 worker，只用于范围广、可并行、噪音大的工作。每个 worker 拿到清晰的 brief，返回带来源的简短报告，或写入共享文件。</Zh>
            </li>
            <li>
              <En>“Long runs?” State saved after every step, idempotent steps, approval as a pause, and caps on turns, tokens and time.</En>
              <Zh>“长时间运行？”每一步保存状态、步骤幂等、审批是暂停，并为轮数、token 和时间设置上限。</Zh>
            </li>
          </ul>
        </div>

        <h3 className="part part-lg">
          <En>Reference: vocabulary</En>
          <Zh>参考：术语表</Zh>
        </h3>

        <table className="ref-table">
          <thead>
            <tr>
              <th>Term</th>
              <th><En>Meaning</En><Zh>含义</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Control flow</td>
              <td><En>What decides the next step: your code or the model</En><Zh>由什么决定下一步：你的代码还是模型</Zh></td>
            </tr>
            <tr>
              <td>Shared state</td>
              <td><En>One object or file that several calls or agents write to (each its own key) and read from</En><Zh>多个调用或 agent 写入（各占一个字段）并读取的同一个对象或文件</Zh></td>
            </tr>
            <tr>
              <td>Workflow</td>
              <td><En>Model calls arranged by your code in a fixed path</En><Zh>由你的代码按固定路径编排的模型调用</Zh></td>
            </tr>
            <tr>
              <td>Agent</td>
              <td><En>A model that chooses its next step in a loop</En><Zh>在循环中自己选择下一步的模型</Zh></td>
            </tr>
            <tr>
              <td>Stop reason</td>
              <td><En>Why a model reply ended: wants a tool, or is done</En><Zh>模型回复结束的原因：要调用 tool，或已完成</Zh></td>
            </tr>
            <tr>
              <td>Orchestrator / worker</td>
              <td><En>The one that plans and combines / the ones that do one job each</En><Zh>负责规划与汇总的一方 / 各做一件事的一方</Zh></td>
            </tr>
            <tr>
              <td>Subagent</td>
              <td><En>An agent loop started from inside a tool, with its own window</En><Zh>从 tool 内部启动、拥有独立窗口的 agent 循环</Zh></td>
            </tr>
            <tr>
              <td>Context engineering</td>
              <td><En>Deciding what is in the window at each step: write, select, compress, isolate</En><Zh>决定每一步窗口里放什么：write、select、compress、isolate</Zh></td>
            </tr>
            <tr>
              <td>Checkpoint</td>
              <td><En>The run state saved after a step, so the run can resume</En><Zh>每一步后保存的运行状态，使运行可以恢复</Zh></td>
            </tr>
            <tr>
              <td>Idempotent</td>
              <td><En>Safe to run twice with the same result</En><Zh>重复执行也安全、结果相同</Zh></td>
            </tr>
            <tr>
              <td>Handoff</td>
              <td><En>One agent passes the conversation to another</En><Zh>一个 agent 把对话交给另一个 agent</Zh></td>
            </tr>
          </tbody>
        </table>

        <p className="callout">
          <En>You wired the control flow, the shared state, the checkpoints and the pause by hand, and every agent project needs the same plumbing. Do teams really rewrite it each time?</En>
          <Zh>你手工搭好了控制流、共享 state、checkpoint 和暂停，而每个 agent 项目都需要同样的这套基础设施。团队真的每次都要重写一遍吗？</Zh>
        </p>
      </section>
    </div>
  );
}
