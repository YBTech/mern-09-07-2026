import DayNav from "../../components/DayNav";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  AutonomyLadder,
  CostSpeed,
  DesignSteps,
  FrameworkStack,
  OneCall,
  PromptLayers,
  QualityLoop,
  RagLanes,
  SystemMap,
  ThreeDoors,
  ToolLoop,
  WhoDecides,
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

function Part({ en, zh }: { en: string; zh: string }) {
  return (
    <h3 className="part part-lg">
      <En>{en}</En>
      <Zh>{zh}</Zh>
    </h3>
  );
}

const VOCAB: [string, string, string][] = [
  ["Token / context window", "The unit a model reads and writes / the most it can hold in one call", "模型读写的单位 / 一次调用最多能装下的量"],
  ["Structured output", "A reply forced into a schema, then validated like user input", "被约束成某个 schema 的回复，并像用户输入一样被校验"],
  ["Tool call", "The model asks for a function; your code decides whether to run it", "模型请求调用某个函数；是否执行由你的代码决定"],
  ["MCP", "One standard plug so a tool written once works in every app", "一个标准接口，工具写一次就能用在所有应用里"],
  ["RAG", "Retrieve relevant chunks first, then let the model answer from them", "先检索相关片段，再让模型据此回答"],
  ["Workflow / agent", "Your code picks the next step / the model picks it", "下一步由你的代码决定 / 由模型决定"],
  ["Context engineering", "Keep the window healthy: write, select, compress, isolate", "让窗口保持健康：写出去、选出来、压缩、隔离"],
  ["Checkpoint", "State saved after each step so a run can pause or resume", "每一步之后保存的状态，让运行可以暂停或恢复"],
  ["Human in the loop", "A person approves before a risky step runs", "有风险的步骤执行前由人审批"],
  ["Eval / LLM judge", "A scored test of the app / a model that grades another's answer", "对应用的打分测试 / 给另一个模型的回答打分的模型"],
  ["Trace", "The tree of steps behind one answer", "一个回答背后的步骤树"],
  ["Prompt injection", "Text the model reads that quietly steers it", "模型读到的、悄悄操控它的文本"],
  ["Guardrail", "A check around the model: on input, on what it reads, on its output", "模型外围的检查：对输入、对它读取的内容、对它的输出"],
  ["Prompt cache / batch", "Cheaper repeated input / half price for work that can wait", "更便宜的重复输入 / 可以等待的任务半价"],
  ["TTFT", "Time to first token: how soon the first words appear", "首个 token 的时间：第一批字多久出现"],
];

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 34 Notes</title>
      <DayNav day="day34-ai-system-design" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 34 · Notes</p>
        <h1>AI System Design &amp; Review</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. Interviews ask these as scenarios, not as tool trivia.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。面试会以场景题的形式问这些，而不是问工具细节。</Zh>
        </p>
        <ul>
          <li>
            <En>Explain how a complete AI application fits together: guards, router or agent, model, tools, RAG, memory, evals and tracing</En>
            <Zh>解释一个完整的 AI 应用是如何组合起来的：guard、路由或 agent、模型、工具、RAG、记忆、eval 和 tracing</Zh>
          </li>
          <li>
            <En>Explain what happens in one model call: tokens, the context window, statelessness, and structured output</En>
            <Zh>解释一次模型调用里发生了什么：token、上下文窗口、无状态，以及结构化输出</Zh>
          </li>
          <li>
            <En>Explain tools, MCP and the agent loop, and why the model only asks while your code acts</En>
            <Zh>解释工具、MCP 和 agent 循环，以及为什么模型只负责请求、真正执行的是你的代码</Zh>
          </li>
          <li>
            <En>Explain RAG end to end: ingestion, embeddings, hybrid search, and permission filtering</En>
            <Zh>完整解释 RAG：摄取、embedding、混合检索和权限过滤</Zh>
          </li>
          <li>
            <En>Explain when to use a workflow, an agent, or multiple agents, and how context engineering keeps a long run healthy</En>
            <Zh>解释什么时候用 workflow、agent 或多个 agent，以及上下文工程如何让长时间运行保持健康</Zh>
          </li>
          <li>
            <En>Explain how you know it works and what it is doing: evals, LLM judges, tracing, monitoring</En>
            <Zh>解释你如何知道它有效、以及它在做什么：eval、LLM judge、tracing、监控</Zh>
          </li>
          <li>
            <En>Explain how you keep it safe, cheap and fast: prompt injection, guardrails, caching, batch, routing, time to first token</En>
            <Zh>解释如何让它安全、便宜、快：prompt injection、guardrail、缓存、batch、路由、首个 token 的时间</Zh>
          </li>
          <li>
            <En>Explain a system-design answer: business → requirements → architecture → deep dive → why this shape</En>
            <Zh>解释一个系统设计的回答：业务 → 需求 → 架构 → 深入探讨 → 为什么是这种形态</Zh>
          </li>
        </ul>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        <Part en="1. The whole system on one page" zh="1. 一页看完整个系统" />
        <Lead
          en="Every AI app is these same pieces, wired differently."
          zh="每个 AI 应用都是这些同样的零件，只是接法不同。"
        />
        <SystemMap />
        <Bullets
          items={[
            ["A router or agent decides the path, and the model, tools, retrieval and memory do the work.", "路由或 agent 决定走哪条路，模型、工具、检索和记忆负责干活。"],
            ["Guards sit on both ends. Tracing wraps everything. Evals test it before shipping, monitoring watches it after.", "两端各有 guard。Tracing 包住一切。eval 在上线前测试，监控在上线后盯着。"],
          ]}
        />

        <Part en="2. One model call" zh="2. 一次模型调用" />
        <Lead
          en="Everything else is built on this one request and reply."
          zh="其余一切都建立在这一次请求和回复之上。"
        />
        <OneCall />
        <Bullets
          items={[
            ["The model is stateless: your app resends the conversation each time, and the context window is one shared budget.", "模型是无状态的：你的应用每次都要重发对话，上下文窗口是一个共享的预算。"],
            ["Tokens in and out set the price. Pick the smallest model that passes your evals.", "输入和输出的 token 决定价格。选能通过你 eval 的最小模型。"],
            ["Need machine-readable output? Ask for a schema and validate it, because a valid shape is not the same as a correct answer.", "需要机器可读的输出？要求按 schema 返回并校验，因为形状合法不等于答案正确。"],
          ]}
        />

        <Part en="3. Prompting" zh="3. Prompt 写法" />
        <Lead
          en="A prompt has layers, and each has an owner."
          zh="prompt 有好几层，每层都有它的负责人。"
        />
        <PromptLayers />
        <Bullets
          items={[
            ["Give a role, the rules, the output format, and the data. Few-shot examples teach a format better than a description.", "给出角色、规则、输出格式和数据。few-shot 示例比描述更能教会格式。"],
            ["A reasoning model thinks before it answers, so you write less step-by-step instruction. Keep prompts in version control.", "推理模型会先思考再回答，所以你不用写太多分步指令。prompt 要放进版本控制。"],
          ]}
        />

        <Part en="4. Tools, MCP and the agent loop" zh="4. 工具、MCP 和 agent 循环" />
        <Lead
          en="A model can only produce text. Tools let your code act on its behalf."
          zh="模型只会产出文本。工具让你的代码替它去行动。"
        />
        <ToolLoop />
        <Bullets
          items={[
            ["The model asks, your code runs the tool and decides what is allowed.", "模型提出请求，你的代码执行工具并决定什么被允许。"],
            ["An agent is this loop with a stop condition. Always cap the turns.", "agent 就是带停止条件的这个循环。一定要限制轮数。"],
            ["MCP is one standard plug, so each tool is written once instead of once per app.", "MCP 是一个标准接口，每个工具只需写一次，而不是每个应用写一次。"],
          ]}
        />

        <Part en="5. RAG" zh="5. RAG" />
        <Lead
          en="The model does not know your documents, so retrieve first and answer from what you found."
          zh="模型不认识你的文档，所以先检索，再根据找到的内容回答。"
        />
        <RagLanes />
        <Bullets
          items={[
            ["Embeddings find meaning, keyword search finds exact terms, and hybrid search uses both.", "embedding 找语义，关键词检索找精确词，混合检索两者兼用。"],
            ["Keep the source and the access groups on every chunk, and filter by permission inside the search.", "每个片段都保留来源和访问组，并且在检索内部按权限过滤。"],
            ["A bad answer has three possible causes: not in the documents, not retrieved, or not used faithfully.", "一个差的回答有三种可能：文档里没有、没检索到、或没有忠实地使用。"],
          ]}
        />

        <Part en="6. Workflows, agents and context" zh="6. Workflow、agent 与上下文" />
        <Lead
          en="Who decides the next step: your code or the model?"
          zh="下一步由谁决定：你的代码，还是模型？"
        />
        <WhoDecides />
        <Bullets
          items={[
            ["Use the simplest thing that works. Add autonomy only where the path cannot be known in advance.", "用能行得通的最简单方案。只有路径无法提前确定的地方才加自主性。"],
            ["Subagents isolate noisy work in their own small context and hand back a short result.", "subagent 把嘈杂的工作隔离在它们自己的小上下文里，只交回一个简短结果。"],
            ["Checkpoints save state after every step, so a run can pause for a human and resume after a crash.", "checkpoint 在每一步之后保存状态，所以运行可以为人暂停，崩溃后也能恢复。"],
          ]}
        />

        <Part en="7. Frameworks" zh="7. 框架" />
        <Lead
          en="Frameworks package the plumbing you would otherwise rewrite."
          zh="框架把你否则要反复重写的管道代码打包好了。"
        />
        <FrameworkStack />
        <Bullets
          items={[
            ["Nothing in them is magic. Each feature is code you could write by hand, so choose a framework for speed, not necessity.", "它们没有任何魔法。每个功能都是你能手写的代码，所以选框架是为了快，而不是因为非用不可。"],
          ]}
        />

        <Part en="8. Quality: evals and observability" zh="8. 质量：eval 与可观测性" />
        <Lead
          en="“It looked fine” is one sample. Score many cases, then watch the live system."
          zh="“看起来没问题”只是一个样本。要给很多用例打分，再盯着线上系统。"
        />
        <QualityLoop />
        <Bullets
          items={[
            ["Use the cheapest grader that catches the failure. A judge model is biased, so calibrate it against humans.", "用能抓到问题的最便宜的 grader。judge 模型有偏差，所以要用人工标注来校准。"],
            ["Roll out gradually, and turn every production failure into a permanent test.", "逐步上线，并把每一次线上故障变成永久的测试。"],
          ]}
        />

        <Part en="9. Production: safe, cheap, fast" zh="9. 生产环境：安全、便宜、快" />
        <Lead
          en="Prompt injection can arrive three ways, and each needs its own guard."
          zh="prompt injection 可以从三条路进来，每一条都需要自己的 guard。"
        />
        <ThreeDoors />
        <Bullets
          items={[
            ["The blatant attacks are mostly refused by the model. The ones that matter are harmless-looking text that breaks your business rules.", "明显的攻击大多被模型自己拒绝了。真正要紧的是看似无害、却违反你业务规则的文本。"],
          ]}
        />
        <CostSpeed />
        <Bullets
          items={[
            ["Put the stable part of the prompt first so it caches. Batch what nobody waits for. Route easy work to a small model.", "把 prompt 里稳定的部分放在最前面，它才能被缓存。没人等的任务放进 batch。简单的活交给小模型。"],
            ["For a chat, time to first token matters most: stream the reply, and shorten or cache the prompt.", "对聊天来说，首个 token 的时间最重要：用流式输出，并缩短或缓存 prompt。"],
          ]}
        />

        <Part en="10. Designing a system" zh="10. 设计一个系统" />
        <Lead
          en="Any design question can be answered in five steps."
          zh="任何设计题都可以用五个步骤来回答。"
        />
        <DesignSteps />
        <AutonomyLadder />
        <Bullets
          items={[
            ["Ask what it must do before how to build it, and how wrong it may be.", "先问它必须做什么、再问怎么做，以及它可以错到什么程度。"],
            ["Pick the lowest rung of autonomy that solves the problem. Anything that moves money or reaches a customer gets a human or a hard limit.", "选能解决问题的最低一档自主性。凡是涉及资金或要触达客户的，都要有人或硬性限制。"],
          ]}
        />

        <Part en="Recap: scenario answers" zh="回顾：场景题回答" />

        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>“Design a support bot for an online store.” Clarify what it may do, then: input guard, a router into cheap fixed paths (tools for orders, RAG for policy) plus a fallback agent with every tool for multi-part requests, a human for refunds, an output guard, tracing and evals around it.</En>
              <Zh>“为一家网店设计一个客服机器人。”先弄清它可以做什么，然后：输入 guard、路由到便宜的固定路径（订单用工具、政策用 RAG），再加一个拥有全部工具的兜底 agent 处理多件事的请求，退款由人把关、输出 guard，外面包上 tracing 和 eval。</Zh>
            </li>
            <li>
              <En>“Workflow or agent?” If the path is known, use a workflow: it is cheaper, predictable and easy to test. Use an agent only where the next step cannot be known in advance, with a turn cap.</En>
              <Zh>“用 workflow 还是 agent？”路径已知就用 workflow：更便宜、可预测、容易测试。只有下一步无法提前确定的地方才用 agent，并且要限制轮数。</Zh>
            </li>
            <li>
              <En>“How do you know it works?” Run a test set on every change with the cheapest grader that catches each failure, calibrate any judge model, roll out gradually, and turn production failures into new tests.</En>
              <Zh>“你怎么知道它有效？”每次改动都跑一组测试，对每种失败用能抓到它的最便宜的 grader，校准 judge 模型，逐步上线，并把线上故障变成新的测试。</Zh>
            </li>
            <li>
              <En>“How do you stop prompt injection?” You cannot stop the text, so guard each door: the user's message, retrieved content, and tool results, then check the output in code. Models lower the odds, code holds.</En>
              <Zh>“你怎么防 prompt injection？”文本本身拦不住，所以给每扇门都加 guard：用户消息、检索内容、工具结果，再用代码检查输出。模型只降低概率，代码才有保证。</Zh>
            </li>
            <li>
              <En>“It is too slow and too expensive.” Cache the stable prompt prefix, batch work nobody waits for, route easy steps to a smaller model, and stream so the first token appears fast.</En>
              <Zh>“它太慢也太贵了。”缓存稳定的 prompt 前缀，把没人等的任务放进 batch，让简单步骤走小模型，并用流式输出让首个 token 尽早出现。</Zh>
            </li>
          </ul>
        </div>

        <p className="callout">
          <En>You now have every piece. What is left is judgment: pick the simplest design that solves the problem, put a human or a hard limit wherever it matters, and measure it.</En>
          <Zh>每一块零件你都有了。剩下的是判断力：选能解决问题的最简单设计，在关键处放一个人或一道硬性限制，并且去度量它。</Zh>
        </p>

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
            {VOCAB.map(([term, en, zh]) => (
              <tr key={term}>
                <td>{term}</td>
                <td><En>{en}</En><Zh>{zh}</Zh></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
