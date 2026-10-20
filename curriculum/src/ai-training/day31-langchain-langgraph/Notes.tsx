import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  AgentLoop,
  CheckpointResume,
  HandBuiltRows,
  InterruptResume,
  NodeEdgeAnatomy,
  PizzaGraph,
  PizzaOverview,
  Stack,
  TwoLanes,
  WhichLevel,
  ZodTwoUses,
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

function Topic({ en, zh }: { en: string; zh: string }) {
  return (
    <h4 className="topic topic-line">
      <En>{en}</En>
      <Zh>{zh}</Zh>
    </h4>
  );
}

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 31 Notes</title>
      <DayNav day="day31-langchain-langgraph" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 31 · Notes</p>
        <h1>LangChain, LangGraph &amp; LangSmith</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. You already hand-built the agent loop, tool plumbing, RAG, state, saved progress and the approval pause; LangChain and LangGraph are that plumbing, packaged.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。你已经手写过 agent 循环、tool 的样板代码、RAG、state、保存进度和审批暂停；LangChain 和 LangGraph 就是把这些样板代码打包好。</Zh>
        </p>
        <ul>
          <li>
            <En>Explain what LangChain is (the parts, plus a ready-made agent), what LangGraph adds (your own flow, saved progress, pausing for a person), and how the two fit together</En>
            <Zh>解释 LangChain 是什么（零件，加一个现成的 agent）、LangGraph 增加了什么（你自己的流程、保存进度、暂停等人），以及两者如何配合</Zh>
          </li>
          <li>
            <En>Explain which hand-written plumbing each framework feature replaces</En>
            <Zh>解释每个框架功能替代了哪些手写的样板代码</Zh>
          </li>
          <li>
            <En>Read a LangGraph graph: state, nodes, edges and conditional edges</En>
            <Zh>读懂一张 LangGraph 图：state、节点、边和条件边</Zh>
          </li>
          <li>
            <En>Explain why the pizza bot is a workflow with one agent inside it, and how to choose between plain code, <code>createAgent</code> and a custom graph</En>
            <Zh>解释为什么披萨机器人是一个“里面带一个 agent 的 workflow”，以及如何在纯代码、<code>createAgent</code> 和自定义图之间做选择</Zh>
          </li>
          <li>
            <En>Explain how a checkpointer and <code>thread_id</code> let a run survive a restart, and how <code>interrupt</code> pauses it for a person (and why code before <code>interrupt</code> runs twice)</En>
            <Zh>解释 checkpointer 和 <code>thread_id</code> 如何让一次运行在重启后继续，以及 <code>interrupt</code> 如何让它暂停等人（以及为什么 <code>interrupt</code> 之前的代码会执行两次）</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/ai-training/day31-langchain-langgraph/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ───────────── 1. the big idea ───────────── */}
        <Part en="1. The big idea" zh="1. 核心思路" />

        <Topic en="1.1 You already built all of this" zh="1.1 这些你都已经亲手写过了" />
        <Lead
          en="Pain point: every AI app needs the same plumbing: a loop, tool schemas, RAG, state, saved progress and an approval pause. Does every project rewrite it?"
          zh="痛点：每个 AI 应用都需要同一套样板：循环、tool schema、RAG、state、保存进度和审批暂停。难道每个项目都要重写一遍？"
        />
        <HandBuiltRows />
        <Bullets
          items={[
            ["Left column: code you already wrote and understand. Right column: the framework feature that replaces it.", "左列：你已经写过、也理解的代码。右列：替代它的框架功能。"],
            ["Nothing on the right is magic: each one is the same plumbing, packaged.", "右列没有任何魔法：每一项都是同样的样板代码，只是被打包好了。"],
          ]}
        />

        <Topic en="1.2 One stack, two layers" zh="1.2 一个技术栈，两个层" />
        <Lead
          en="LangChain is the parts, LangGraph is the engine that runs them, and they are two layers of one stack, not two products to choose between."
          zh="LangChain 是零件，LangGraph 是运行它们的引擎；它们是同一个技术栈的两层，而不是二选一的两个产品。"
        />
        <Stack />
        <Bullets
          items={[
            ["createAgent is itself a LangGraph graph, so even a ready-made agent gets saved progress and pausing.", "createAgent 本身就是一张 LangGraph 图，所以即使是现成的 agent 也有保存进度和暂停的能力。"],
            ["Draw your own graph when you want to control the flow; its boxes use the same LangChain parts.", "想自己控制流程时，就画一张自己的图；图里的每个框用的还是同样的 LangChain 零件。"],
            ["LangSmith is a separate tool for tracing and evaluating any LLM app, with or without the other two.", "LangSmith 是另一个独立的工具，用来追踪和评测任何 LLM 应用，不管有没有用另外两个。"],
          ]}
        />

        <Topic en="1.3 Our example: a pizza ordering bot" zh="1.3 我们的例子：披萨点单机器人" />
        <Lead
          en="Every code snippet today comes from Slice Pizza, a chat bot that can do four things."
          zh="今天所有的代码片段都来自 Slice Pizza，一个能做四件事的聊天机器人。"
        />
        <PizzaOverview />
        <Bullets
          items={[
            ["The front end is only a chat window; all the agent logic lives in the backend.", "前端只是一个聊天窗口；所有 agent 逻辑都在后端。"],
            ["It is the plumbing you already know, in a business everyone understands.", "还是你熟悉的那套样板，只是放在人人都懂的业务里。"],
          ]}
        />

        {/* ───────────── 2. LangChain ───────────── */}
        <Part en="2. LangChain: the parts" zh="2. LangChain：零件" />

        <Topic en="2.1 One model interface" zh="2.1 统一的模型接口" />
        <Lead
          en="Pain point: each vendor's SDK is shaped differently, so switching vendors means rewriting calls."
          zh="痛点：每家厂商的 SDK 形状都不同，换厂商就得重写调用代码。"
        />
        <CodeBlock
          language="typescript"
          code={`import { initChatModel } from "langchain";

const model = await initChatModel("anthropic:claude-haiku-5-5");
// another vendor, same calls: "openai:<model>" or "google-genai:<model>"
const reply = await model.invoke("Is the Margherita vegetarian?");`}
        />
        <Bullets
          items={[
            ["Only the model string changes; invoke, stream and tools stay the same.", "只改模型字符串；invoke、stream 和 tools 都不变。"],
            ["Messages have the same types for every vendor: system, human, AI, tool.", "每家厂商的消息类型都一样：system、human、AI、tool。"],
            ["Not portable: provider-only features, model names, prices and limits.", "不能直接迁移的：厂商独有的功能、模型名称、价格和上限。"],
          ]}
        />

        <Topic en="2.2 Structured output and tools from one schema" zh="2.2 同一个 schema 同时用于结构化输出和 tools" />
        <Lead
          en="Replaces “ask for JSON, validate, retry” and the hand-written tool schemas."
          zh="替代“要求返回 JSON、校验、重试”，以及手写的 tool schema。"
        />
        <ZodTwoUses />
        <CodeBlock
          language="typescript"
          code={`const Intent = z.object({ intent: z.enum(["question", "order", "checkout"]) });
const { intent } = await model.withStructuredOutput(Intent).invoke(messages);

const addToCart = tool(async (line) => { cart.push(line); return "ok"; }, {
  name: "add_to_cart",
  description: "Add items to the customer's cart.",
  schema: OrderItem,
});`}
        />
        <Bullets
          items={[
            ["The zod schema becomes the JSON schema the model sees, and it validates what comes back.", "zod schema 会变成模型看到的 JSON schema，并校验返回的内容。"],
            ["A tool is still only a request: the model asks, your code runs the function.", "tool 依然只是一个“请求”：模型提出，函数由你的代码执行。"],
          ]}
        />

        <Topic en="2.3 createAgent: the loop in a few lines" zh="2.3 createAgent：几行代码的循环" />
        <Lead
          en="The agent loop you wrote by hand, with a call limit built in."
          zh="你手写过的那个 agent 循环，还自带调用次数上限。"
        />
        <AgentLoop />
        <CodeBlock
          language="typescript"
          code={`const agent = createAgent({
  model,
  tools: [addToCart, removeFromCart, viewCart],
  systemPrompt: "You manage the cart for Slice Pizza. Use the tools.",
  middleware: [modelCallLimitMiddleware({ runLimit: 6 })],
});
const result = await agent.invoke({ messages });`}
        />
        <Bullets
          items={[
            ["Give it a model, tools and a prompt; it loops until the model has nothing left to ask for.", "给它模型、tools 和 prompt；它会一直循环，直到模型没有要请求的了。"],
            ["The result holds the whole message list; the last AI message is the answer.", "结果里包含完整的消息列表；最后一条 AI 消息就是答案。"],
            ["In the pizza bot this is orderAgent: the model edits the cart through three tools.", "在披萨机器人里，这就是 orderAgent：模型通过三个 tool 修改购物车。"],
          ]}
        />

        <Topic en="2.4 Also in the box (one line each)" zh="2.4 工具箱里还有（每项一句话）" />
        <Bullets
          items={[
            ["RAG: loaders, text splitters, embeddings, vector stores and retrievers are the pieces you wrote by hand as swappable parts; a retriever is the search step wrapped as one object.", "RAG：loader、文本切分器、embedding、vector store 和 retriever 就是你手写过的那些步骤，变成了可替换的部件；retriever 是把搜索这一步包成的一个对象。"],
            ["Middleware: hooks around the model and tool calls (a call limit, summarising old messages, human approval), like Express middleware.", "Middleware：包在模型和 tool 调用外围的钩子（调用次数上限、总结旧消息、人工审批），就像 Express middleware。"],
            ["Chains: older tutorials join a prompt template, a model and a parser with .pipe() (LCEL); new agent code uses createAgent and LangGraph instead.", "Chain：旧教程用 .pipe()（LCEL）把 prompt template、模型和解析器串起来；新的 agent 代码改用 createAgent 和 LangGraph。"],
          ]}
        />

        {/* ───────────── 3. LangGraph ───────────── */}
        <Part en="3. LangGraph: your own flow" zh="3. LangGraph：你自己的流程" />

        <Topic en="3.1 Nodes, edges and state" zh="3.1 节点、边和 state" />
        <Lead
          en="createAgent gives you one fixed loop. For your own flow (branches, fixed steps, a pause) you draw a graph: one shared state, nodes that do the work, and edges that say what runs next."
          zh="createAgent 给你的是一个固定的循环。想要自己的流程（分支、固定步骤、暂停），就画一张图：一个共享的 state、负责干活的节点，以及决定下一步运行谁的边。"
        />
        <NodeEdgeAnatomy />
        <CodeBlock
          language="typescript"
          code={`const PizzaState = new StateSchema({
  messages: MessagesValue, // new messages are appended
  intent: z.enum(["question", "order", "checkout", "order_status"]).optional(),
  cart: z.array(OrderItem).default(() => []),
  confirmed: z.boolean().default(false),
});`}
        />
        <CodeBlock
          language="typescript"
          code={`const graph = new StateGraph(PizzaState)
  .addNode("classify", classify)
  .addNode("answer", answer)
  .addNode("orderAgent", orderAgent)
  .addEdge(START, "classify")
  .addConditionalEdges("classify", routeByIntent, ["answer", "orderAgent"])
  .addEdge("answer", END)
  .addEdge("orderAgent", END)
  .compile({ checkpointer });`}
        />
        <Bullets
          items={[
            ["A node is a plain function, an edge is one line, and a conditional edge is a function that names the next node.", "节点就是一个普通函数，边就是一行代码，条件边是一个返回下一个节点名字的函数。"],
            ["A state key is overwritten by default; messages appends because it has a reducer, a rule for merging an update into the old value.", "state 的 key 默认会被覆盖；messages 是追加的，因为它有 reducer，也就是把更新合并进旧值的规则。"],
            ["stream() reports which node just finished, so a UI can show classify → answer instead of a spinner.", "stream() 会报告刚完成的是哪个节点，所以 UI 可以显示 classify → answer，而不是一个转圈。"],
          ]}
        />

        <Topic en="3.2 The pizza graph: a workflow with one agent inside" zh="3.2 披萨图：一个里面带 agent 的 workflow" />
        <Lead
          en="The whole graph is a workflow, because our code fixed the paths; only one box is an agent."
          zh="整张图是一个 workflow，因为路径是由我们的代码固定的；只有一个框是 agent。"
        />
        <PizzaGraph />
        <CodeBlock
          language="typescript"
          code={`async function orderAgent(state: State) {
  const cart = [...state.cart]; // the agent's tools edit this copy
  const agent = createAgent({ model, tools: cartTools(cart), systemPrompt });
  const result = await agent.invoke({ messages: state.messages });
  return { cart, messages: [result.messages.at(-1)!] };
}`}
        />
        <Bullets
          items={[
            ["A createAgent agent is just a function, so it can sit inside any node of a graph.", "createAgent 的 agent 只是一个函数，所以它可以放在图的任何一个节点里。"],
            ["Why an agent here: cart edits are open-ended (“remove the coke, add the cheapest vegetarian pizza”), so the number of steps is not known in advance.", "为什么这里用 agent：购物车的修改是开放式的（“去掉可乐，加最便宜的素食披萨”），所以事先不知道要几步。"],
            ["Every other box has a known path: one model call, one retrieval, or plain code.", "其他每个框的路径都是已知的：一次模型调用、一次检索，或者纯代码。"],
          ]}
        />
        <p className="callout">
          <En>Workflow or agent is a choice per box, not per app: use an agent only where the path cannot be known in advance.</En>
          <Zh>用 workflow 还是 agent 是“每个框”的选择，而不是“每个应用”的选择：只有路径无法事先确定的地方才用 agent。</Zh>
        </p>

        <Topic en="3.3 Checkpointer and thread_id: survive a restart" zh="3.3 Checkpointer 与 thread_id：重启后继续" />
        <Lead
          en="Pain point: a crash or restart meant starting over, and our checkpoint files were hand-made."
          zh="痛点：崩溃或重启就得从头再来，而我们的 checkpoint 文件是手工做的。"
        />
        <CheckpointResume />
        <CodeBlock
          language="typescript"
          code={`const graph = builder.compile({ checkpointer }); // SQLite in the app
const config = { configurable: { thread_id: "table-7" } };
const turn = (text: string) => ({ messages: [new HumanMessage(text)] });

await graph.invoke(turn("A large pepperoni"), config);
// restart the server; the same thread_id continues with the same cart
await graph.invoke(turn("And a coke"), config);`}
        />
        <Bullets
          items={[
            ["The state is saved after every node, keyed by thread_id, like a git commit you can return to.", "每个节点之后都会保存 state，以 thread_id 为 key，就像一个可以回到的 git commit。"],
            ["The same thread_id continues the conversation; a new one starts fresh. In the app, one id per chat window.", "相同的 thread_id 接着聊；新的 thread_id 就是全新的对话。在应用里，一个聊天窗口对应一个 id。"],
            ["The graph code does not change with the storage: memory for tests, SQLite or Postgres in production.", "换哪种存储，图的代码都不变：测试用内存，生产用 SQLite 或 Postgres。"],
          ]}
        />

        <Topic en="3.4 interrupt: pause for a person" zh="3.4 interrupt：暂停等人" />
        <Lead
          en="Checkout must wait for the customer's yes, which may take minutes, and the server may restart in between."
          zh="结账必须等顾客点头，可能要几分钟，中间服务器还可能重启。"
        />
        <InterruptResume />
        <CodeBlock
          language="typescript"
          code={`// the customer clicks Confirm; the same thread_id picks the run up again
await graph.invoke(new Command({ resume: true }), config);`}
        />
        <CodeBlock
          language="typescript"
          bad={[2]}
          code={`async function confirm(state: State) {
  chargeCard(state.cart); // runs on the pause AND again on resume
  const approved = interrupt({ question: "Place this order?" });
  return { confirmed: approved === true };
}`}
        />
        <CodeBlock
          language="typescript"
          good={[7]}
          code={`async function confirm(state: State) {
  const approved = interrupt({ question: "Place this order?" });
  return { confirmed: approved === true };
}

async function placeOrder(state: State) {
  chargeCard(state.cart); // only reached after a yes
  return { cart: [] };
}`}
        />
        <Bullets
          items={[
            ["interrupt() saves a checkpoint and stops; the paused run is just saved state waiting for its thread_id.", "interrupt() 会保存一个 checkpoint 然后停下；暂停的运行只是一份保存好的 state，在等它的 thread_id。"],
            ["On resume the node starts again from its first line, so a side effect like a charge goes in the next node.", "恢复时节点会从第一行重新执行，所以像扣款这样的副作用要放在下一个节点里。"],
            ["For a createAgent agent, humanInTheLoopMiddleware does the same for the tool calls you choose.", "对于 createAgent 的 agent，humanInTheLoopMiddleware 对你指定的 tool 调用做同样的事。"],
          ]}
        />

        <Topic en="3.5 Putting it together" zh="3.5 合在一起" />
        <Lead
          en="In a real app the two layers work together: LangGraph draws the flow, and LangChain parts do the work inside each box."
          zh="在真实应用里，两层是一起工作的：LangGraph 画出流程，LangChain 的零件在每个框里干活。"
        />
        <TwoLanes />
        <Bullets
          items={[
            ["One chat message is one run of the graph; the browser only sees the replies and the node names.", "一条聊天消息就是图的一次运行；浏览器只看到回复和节点名称。"],
            ["The state, the checkpoints and the pause belong to the engine, not to your own code.", "state、checkpoint 和暂停都属于引擎，不需要你自己写代码。"],
          ]}
        />

        {/* ───────────── 4. choosing ───────────── */}
        <Part en="4. Choosing, and what else exists" zh="4. 如何选择，以及还有什么" />

        <Topic en="4.1 Which level for which job" zh="4.1 什么任务用哪一层" />
        <WhichLevel />
        <Bullets
          items={[
            ["Start with the simplest row that works; move down only when you can name what is missing.", "从能用的最简单的一行开始；只有能说出缺了什么，才往下一行走。"],
            ["The costs are real: the APIs change quickly, the abstraction hides the raw model calls, and you adopt the framework's vocabulary.", "代价是真实的：API 变化很快，抽象层会把原始的模型调用藏起来，而且你要接受这个框架自己的术语。"],
            ["The layers (model, tools, state, memory, flow, tracing) do not change, so knowing them lets you read any framework.", "分层（模型、tools、state、记忆、流程、tracing）不会变，所以理解了它们，你就能读懂任何框架。"],
          ]}
        />

        <Topic en="4.2 What else exists" zh="4.2 还有什么" />
        <Bullets
          items={[
            ["LangSmith: tracing and evaluation for any LLM app, a separate tool that works with or without LangChain.", "LangSmith：用于追踪和评测任何 LLM 应用，是一个独立的工具，用不用 LangChain 都行。"],
            ["Deep Agents: a ready-made harness on top of LangGraph (planning, a virtual filesystem, subagents) for long, coding-agent-style jobs.", "Deep Agents：构建在 LangGraph 之上的现成 harness（规划、虚拟文件系统、subagent），适合长时间的、coding agent 风格的任务。"],
            ["Other agent SDKs and frameworks exist and use the same layers; MCP servers plug in through an adapter, and A2A connects one agent to another.", "还有其他 agent SDK 和框架，用的也是同样的分层；MCP server 通过适配器接入，A2A 则把一个 agent 连接到另一个 agent。"],
          ]}
        />
        <p className="callout">
          <En>Most agent tutorials and jobs use Python; the names and shapes are the same (create_agent, StateGraph, interrupt), so you can read either.</En>
          <Zh>多数 agent 教程和岗位用 Python；名称和结构是一样的（create_agent、StateGraph、interrupt），所以两种你都能读懂。</Zh>
        </p>
        <p className="callout">
          <En>Names and versions change quickly, so re-check them before you pick a tool.</En>
          <Zh>名称和版本变化很快，选型之前请重新确认。</Zh>
        </p>

        {/* ───────────── 5. recap ───────────── */}
        <Part en="5. Recap and interview answers" zh="5. 回顾与面试回答" />

        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>“LangChain vs LangGraph vs LangSmith?” LangChain is the parts and a ready-made agent, LangGraph is the engine that runs a graph with saved progress and pauses, and LangSmith is tracing and evaluation. createAgent is itself a LangGraph graph.</En>
              <Zh>“LangChain、LangGraph、LangSmith 的区别？”LangChain 是零件和现成的 agent，LangGraph 是运行一张图的引擎，带保存进度和暂停，LangSmith 负责追踪和评测。createAgent 本身就是一张 LangGraph 图。</Zh>
            </li>
            <li>
              <En>“What does LangGraph give you that a while loop does not?” Saved state after every step, resume after a crash or restart, a pause for a person, streaming per step, and a flow you can draw and test node by node.</En>
              <Zh>“LangGraph 能给你什么 while 循环给不了的？”每一步之后保存 state、崩溃或重启后恢复、暂停等人、按步骤流式输出，以及可以画出来、逐个节点测试的流程。</Zh>
            </li>
            <li>
              <En>“How does LangGraph resume a run?” A checkpointer saves state under a thread_id; the same thread_id continues, and a paused interrupt continues with Command({"{"} resume {"}"}). The interrupted node runs again from its first line.</En>
              <Zh>“LangGraph 如何恢复一次运行？”checkpointer 以 thread_id 保存 state；用相同的 thread_id 就会继续，暂停的 interrupt 则用 Command({"{"} resume {"}"}) 继续。被中断的节点会从第一行重新执行。</Zh>
            </li>
            <li>
              <En>“Plain code, createAgent or a custom graph?” One call or a short fixed chain: plain code. One open-ended agent with tools: createAgent. Fixed steps, branches, saved progress and approval: a graph, with createAgent inside the node that needs judgment.</En>
              <Zh>“纯代码、createAgent 还是自定义图？”一次调用或一条很短的固定链路：纯代码。一个带 tools 的开放式 agent：createAgent。固定步骤、分支、保存进度和审批：用图，在需要判断的节点里放 createAgent。</Zh>
            </li>
            <li>
              <En>“Is it vendor-locked?” Not to a model vendor, because the model interface is swappable. It does lock you to the framework's own concepts.</En>
              <Zh>“会被厂商绑定吗？”不会绑定模型厂商，因为模型接口可以替换。但会让你绑定在框架自己的概念上。</Zh>
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
              <td>Retriever</td>
              <td><En>Returns the top chunks for a query</En><Zh>为一个查询返回最相关的 chunk</Zh></td>
            </tr>
            <tr>
              <td>createAgent</td>
              <td><En>LangChain's ready-made tool-calling agent</En><Zh>LangChain 现成的 tool-calling agent</Zh></td>
            </tr>
            <tr>
              <td>StateGraph</td>
              <td><En>A graph of nodes over one shared state</En><Zh>基于一个共享 state 的节点图</Zh></td>
            </tr>
            <tr>
              <td>State</td>
              <td><En>The one object every node reads and updates</En><Zh>每个节点读取并更新的那个对象</Zh></td>
            </tr>
            <tr>
              <td>Node</td>
              <td><En>A function that reads the state and returns an update</En><Zh>读取 state 并返回更新的函数</Zh></td>
            </tr>
            <tr>
              <td>Edge</td>
              <td><En>An arrow to the next node; a conditional edge picks one with a function</En><Zh>指向下一个节点的箭头；条件边用一个函数来选择</Zh></td>
            </tr>
            <tr>
              <td>Checkpointer</td>
              <td><En>Saves the state after every node</En><Zh>每个节点之后保存 state</Zh></td>
            </tr>
            <tr>
              <td>thread_id</td>
              <td><En>The key that names one conversation's saved state</En><Zh>标识一次对话所保存 state 的 key</Zh></td>
            </tr>
            <tr>
              <td>interrupt</td>
              <td><En>Pause the run until a person resumes it</En><Zh>暂停运行，直到有人恢复</Zh></td>
            </tr>
          </tbody>
        </table>

        <p className="callout">
          <En>It runs, and you can see it run. How do you know it is actually right?</En>
          <Zh>它能运行，你也能看到它在运行。你怎么知道它真的是对的？</Zh>
        </p>
      </section>
    </div>
  );
}
