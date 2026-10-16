import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  McpBuildConsume,
  McpBackendFlow,
  MessyVsTidy,
  NoHands,
  PickAnOption,
  PlugAnalogy,
  ProposeApprove,
  ReactLoop,
  ToolDesignRules,
  ToolRoundTrip,
} from "./Diagrams";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 28 Notes</title>
      <DayNav day="day28-tools-mcp-agent-loop" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 28 · Notes</p>
        <h1>Tools, MCP &amp; the Agent Loop</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. A model cannot act on its own: tools let it ask your code to act, MCP packages those tools for any app, and an agent is the loop that keeps asking.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。模型自己无法行动：tools 让它请求你的代码去行动，MCP 把这些 tools 打包给任何应用使用，而 agent 就是不断发出请求的那个循环。</Zh>
        </p>
        <ul>
          <li>
            <En>Explain why a model alone cannot act: it only writes text, so your code must do the work</En>
            <Zh>解释为什么模型自己不能&quot;做事&quot;：它只会写文字，真正的工作必须由你的代码完成</Zh>
          </li>
          <li>
            <En>Build tool calling by hand: describe functions, get the model's choice as JSON, run it, send the result back</En>
            <Zh>手工实现 tool calling：描述函数、以 JSON 拿到模型的选择、执行它、再把结果发回去</Zh>
          </li>
          <li>
            <En>Use the built-in tools parameter: tool definitions, the tool_use block, and the tool_result reply</En>
            <Zh>使用内置的 tools 参数：tool 定义、tool_use 块，以及 tool_result 回复</Zh>
          </li>
          <li>
            <En>Explain MCP: the problem it solves, and how your backend uses an MCP client to connect to an MCP server and hand its tools to the model</En>
            <Zh>解释 MCP：它解决的问题，以及你的后端如何用 MCP client 连接 MCP server，并把 server 里的 tools 交给模型</Zh>
          </li>
          <li>
            <En>Explain that an agent is a while loop around tool calls, where the model decides each step, and how the loop stops</En>
            <Zh>解释 agent 就是包着 tool 调用的 while 循环，每一步由模型决定，以及循环如何终止</Zh>
          </li>
          <li>
            <En>Keep an agent safe: check permissions inside each tool, and make risky actions proposals a human approves</En>
            <Zh>让 agent 保持安全：在每个 tool 内部检查权限，并把高风险操作变成需要人审批的提议</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/ai-training/day28-tools-mcp-agent-loop/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ───────────── 1. no hands ───────────── */}
        <h3 className="part part-lg">
          <En>1. What an LLM cannot do</En>
          <Zh>1. LLM 做不到什么</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>1.1 Text in, text out</En>
          <Zh>1.1 输入文字，输出文字</Zh>
        </h4>
        <p>
          <En>A model has no hands: it cannot do anything in the real world, it can only write a reply.</En>
          <Zh>模型没有&quot;手脚&quot;：它在现实世界里什么都做不了，只能写一段回复。</Zh>
        </p>
        <NoHands />
        <ul>
          <li>
            <En>Ask it to add an event and it may say &quot;Done!&quot;. That is only text: nothing was saved.</En>
            <Zh>让它添加一个日程，它可能会回答&quot;搞定！&quot;。但那只是文字，什么都没有被保存。</Zh>
          </li>
          <li>
            <En>Anything that changes the world (save, send, pay, look up live data) has to be done by your code.</En>
            <Zh>任何改变现实的事（保存、发送、付款、查实时数据）都必须由你的代码来做。</Zh>
          </li>
        </ul>

        {/* ───────────── 2. by hand ───────────── */}
        <h3 className="part part-lg">
          <En>2. Tools, the hand-made way</En>
          <Zh>2. 手工实现 tools</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>2.1 The trick: let the model pick</En>
          <Zh>2.1 诀窍：让模型来选</Zh>
        </h4>
        <p>
          <En>A model is good at choosing between options you describe, so describe your functions as the options.</En>
          <Zh>模型很擅长在你描述的选项之间做选择，那就把你的函数当作选项描述给它。</Zh>
        </p>
        <PickAnOption />
        <ul>
          <li>
            <En>It answers with structured output: the function name and its arguments, as JSON.</En>
            <Zh>它用 structured output 回答：以 JSON 形式给出函数名和参数。</Zh>
          </li>
          <li>
            <En>Your code parses that JSON and calls the real function. The model never runs anything.</En>
            <Zh>你的代码解析这个 JSON，然后调用真正的函数。模型从来不执行任何东西。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.2 Doing it by hand</En>
          <Zh>2.2 动手实现</Zh>
        </h4>
        <p>
          <En>Step one: list the functions in the system prompt and ask for a JSON choice.</En>
          <Zh>第一步：在 system prompt 里列出函数，并要求模型用 JSON 做出选择。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const SYSTEM = \`You can ask me to run one of these functions:
- create_event(title, date, time): add an event to the calendar
- list_events(date): list the events on one date
Reply with the function to run and its arguments.\`;

const response = await client.messages.create({
  model: "claude-haiku-5-5",
  max_tokens: 500,
  system: SYSTEM,
  messages: [{ role: "user", content: "Add lunch with Sam on Friday at 1pm" }],
  output_config: { format: { type: "json_schema", schema: CHOICE_SCHEMA } },
});
// text: {"tool": "create_event",
//        "args": {"title": "Lunch with Sam", "date": "2026-10-23", "time": "13:00"}}`}
        />
        <p>
          <En>Step two: your code reads the choice and runs the matching function.</En>
          <Zh>第二步：你的代码读取这个选择，并运行对应的函数。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const choice = JSON.parse(text);

let result = "";
if (choice.tool === "create_event") result = createEvent(choice.args);
if (choice.tool === "list_events") result = listEvents(choice.args);
// result: "Created event 42"`}
        />
        <ul>
          <li>
            <En>To get a friendly reply, send the result back in a second call: &quot;the function returned …, now answer the user&quot;.</En>
            <Zh>想要一句友好的回复，就在第二次调用里把结果发回去：&quot;函数返回了……，现在回答用户&quot;。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>That function is a tool. A tool is just a function you let the model ask for.</En>
          <Zh>这个函数就是一个 tool。tool 就是一个你允许模型&quot;请求调用&quot;的函数。</Zh>
        </p>

        {/* ───────────── 3. built-in ───────────── */}
        <h3 className="part part-lg">
          <En>3. Built-in tool use</En>
          <Zh>3. 内置的 tool use</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>3.1 The tools parameter</En>
          <Zh>3.1 tools 参数</Zh>
        </h4>
        <p>
          <En>The API does the same trick for you: you pass tool definitions, it replies with a tool call.</En>
          <Zh>API 已经替你内置了同样的做法：你传入 tool 定义，它就回复一个 tool 调用。</Zh>
        </p>
        <ToolRoundTrip />
        <CodeBlock
          language="typescript"
          code={`const tools: Anthropic.Tool[] = [
  {
    name: "create_event",
    description: "Add an event to the user's calendar.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
        time: { type: "string", description: "HH:MM, 24-hour" },
      },
      required: ["title", "date", "time"],
    },
  },
];

const response = await client.messages.create({
  model, max_tokens: 1000, tools, messages,
});
// stop_reason: "tool_use"
// content: [{ type: "tool_use", id: "toolu_01…", name: "create_event",
//             input: { title: "Lunch with Sam", date: "2026-10-23", time: "13:00" } }]`}
        />
        <ul>
          <li>
            <En>A tool definition is a name, a description, and a JSON Schema for the arguments.</En>
            <Zh>一个 tool 定义包括：名称、描述，以及参数的 JSON Schema。</Zh>
          </li>
          <li>
            <En>The model picks a tool by reading the description, so write it like documentation.</En>
            <Zh>模型靠阅读 description 来选择 tool，所以要像写文档一样认真写。</Zh>
          </li>
          <li>
            <En><code>stop_reason: &quot;tool_use&quot;</code> means &quot;I am waiting for you to run this&quot;.</En>
            <Zh><code>stop_reason: &quot;tool_use&quot;</code> 的意思是&quot;我在等你去执行它&quot;。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.2 Sending the result back</En>
          <Zh>3.2 把结果发回去</Zh>
        </h4>
        <p>
          <En>Run the function, then add two messages to the history: the model's tool call and your result.</En>
          <Zh>运行函数，然后往历史里加两条消息：模型的 tool 调用，以及你的执行结果。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const call = response.content.find((block) => block.type === "tool_use")!;
const result = createEvent(call.input as EventInput);

messages.push({ role: "assistant", content: response.content });
messages.push({
  role: "user",
  content: [{ type: "tool_result", tool_use_id: call.id, content: result }],
});

const final = await client.messages.create({
  model, max_tokens: 1000, tools, messages,
});
// "Done! Lunch with Sam is on your calendar for Friday at 1pm."`}
        />
        <ul>
          <li>
            <En><code>tool_use_id</code> links each result to the call that asked for it.</En>
            <Zh><code>tool_use_id</code> 把每个结果和请求它的那次调用对应起来。</Zh>
          </li>
          <li>
            <En>One reply can ask for several tools at once; answer every one of them in the same message.</En>
            <Zh>一次回复里可能同时请求多个 tool；要在同一条消息里把它们全部回复。</Zh>
          </li>
        </ul>

        {/* ───────────── 4. many tools ───────────── */}
        <h3 className="part part-lg">
          <En>4. Managing many tools</En>
          <Zh>4. 管理大量 tools</Zh>
        </h3>

        <p>
          <En>Pain point: with ten tools, the schemas, the switch, and the functions end up in different places.</En>
          <Zh>痛点：有了十个 tool 之后，schema、switch 语句和函数本身会散落在不同的地方。</Zh>
        </p>
        <MessyVsTidy />
        <ToolDesignRules />
        <ul>
          <li>
            <En>Keep each tool in one object, and keep the objects in one list.</En>
            <Zh>每个 tool 放进一个对象，所有对象放进一个列表。</Zh>
          </li>
          <li>
            <En>If the model picks the wrong tool, fix the description first. Validate every argument: the model wrote it.</En>
            <Zh>模型选错 tool 时，先改 description。每个参数都要校验：它是模型写的。</Zh>
          </li>
          <li>
            <En>These tools still live inside one backend. Another app that wants them has to copy them.</En>
            <Zh>这些 tool 仍然只存在于一个后端里。另一个应用想用，就只能复制一份。</Zh>
          </li>
        </ul>

        {/* ───────────── 5. MCP ───────────── */}
        <h3 className="part part-lg">
          <En>5. MCP: one standard plug for tools</En>
          <Zh>5. MCP：tools 的统一插头</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>5.1 The problem MCP solves</En>
          <Zh>5.1 MCP 解决的问题</Zh>
        </h4>
        <p>
          <En>Pain point: every AI app writes its own calendar, GitHub, and database tools, in its own format.</En>
          <Zh>痛点：每个 AI 应用都用自己的格式，重复编写日历、GitHub、数据库这些 tool。</Zh>
        </p>
        <PlugAnalogy />
        <ul>
          <li>
            <En>MCP (Model Context Protocol) is a standard way to package tools so any AI app can plug them in.</En>
            <Zh>MCP（Model Context Protocol，模型上下文协议）是一种打包 tool 的标准方式，任何 AI 应用都能直接接入。</Zh>
          </li>
          <li>
            <En>It changes where tools live, not what they are: still a name, a description, a schema, and a function.</En>
            <Zh>它改变的是 tool 放在哪里，而不是 tool 是什么：依然是名称、描述、schema 和一个函数。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>5.2 Your backend connects to an MCP server</En>
          <Zh>5.2 你的后端连接 MCP server</Zh>
        </h4>
        <p>
          <En>Your backend uses an MCP client to get the server's tools, then hands those tools to the AI.</En>
          <Zh>你的后端用 MCP client 从 server 拿到 tools，再把这些 tools 交给 AI。</Zh>
        </p>
        <McpBackendFlow />
        <ul>
          <li>
            <En>MCP server: a program that holds the tools and shares them in the standard way.</En>
            <Zh>MCP server：存放 tools 并用标准方式把它们共享出来的程序。</Zh>
          </li>
          <li>
            <En>MCP client: the part of your backend that talks to that server.</En>
            <Zh>MCP client：你的后端里负责和这个 server 通信的那一部分。</Zh>
          </li>
          <li>
            <En>The AI never talks to the server. Your backend passes the tools to it, and forwards its calls.</En>
            <Zh>AI 从不直接和 server 通信。你的后端把 tools 交给它，并转发它发出的调用。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>5.3 Using a server vs. writing one</En>
          <Zh>5.3 使用 server 与自己编写 server</Zh>
        </h4>
        <McpBuildConsume />
        <ul>
          <li>
            <En>Most of the time you use a ready-made server (GitHub, Slack, a database), and only add it to a config.</En>
            <Zh>大多数时候你直接用现成的 server（GitHub、Slack、数据库），只需要把它加进配置。</Zh>
          </li>
          <li>
            <En>Claude Desktop, Claude Code, and most IDEs are already hosts, so they do the connecting for you.</En>
            <Zh>Claude Desktop、Claude Code 和大多数 IDE 本身就是 host，连接的工作它们替你做了。</Zh>
          </li>
        </ul>

        {/* ───────────── 6. agent loop ───────────── */}
        <h3 className="part part-lg">
          <En>6. The agent loop</En>
          <Zh>6. Agent 循环</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>6.1 When one tool call is not enough</En>
          <Zh>6.1 一次 tool 调用不够的时候</Zh>
        </h4>
        <p>
          <En>&quot;If Friday is sunny, book a picnic with Sam, otherwise lunch indoors&quot; needs the weather first, then an event.</En>
          <Zh>&quot;如果周五天晴，就和 Sam 约野餐，否则就在室内吃午饭&quot;——这需要先查天气，再创建日程。</Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`turn 1  model → get_weather({ date: "2026-10-23" })        you → "sunny, 22°C"
turn 2  model → create_event({ title: "Picnic with Sam", … })  you → "created"
turn 3  model → "It will be sunny, so I booked a picnic with Sam at noon."`}
        />
        <ul>
          <li>
            <En>Nobody wrote &quot;weather first, then event&quot; in code: the model decided the steps.</En>
            <Zh>没人在代码里写过&quot;先查天气、再建日程&quot;：步骤是模型自己决定的。</Zh>
          </li>
          <li>
            <En>Each turn is one of the &quot;searching…&quot;, &quot;running…&quot; steps you see in AI chat apps.</En>
            <Zh>每一轮就是你在 AI 聊天应用里看到的&quot;正在搜索…&quot;、&quot;正在运行…&quot;这样的一步。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.2 It is a while (true) loop</En>
          <Zh>6.2 它就是一个 while (true) 循环</Zh>
        </h4>
        <p>
          <En>Repeat the tool round trip until the model stops asking for tools. That loop is an agent.</En>
          <Zh>不断重复 tool 的往返，直到模型不再请求 tool。这个循环就是 agent。</Zh>
        </p>
        <ReactLoop />
        <CodeBlock
          language="typescript"
          code={`const MAX_TURNS = 10;
let turns = 0;

while (true) {
  if (++turns > MAX_TURNS) throw new Error("The agent took too many turns");

  const response = await client.messages.create({
    model, max_tokens: 1000, tools, messages,
  });
  messages.push({ role: "assistant", content: response.content });

  if (response.stop_reason !== "tool_use") break; // the model has its answer

  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const call of response.content) {
    if (call.type !== "tool_use") continue;
    const tool = TOOLS.find((t) => t.name === call.name)!;
    const output = await tool.run(call.input);
    results.push({ type: "tool_result", tool_use_id: call.id, content: output });
  }
  messages.push({ role: "user", content: results });
}`}
        />
        <ul>
          <li>
            <En>The loop is yours; every decision inside it (which tool, which arguments, when to stop) is the model's.</En>
            <Zh>循环是你写的；循环里的每个决定（用哪个 tool、什么参数、何时停止）都是模型做的。</Zh>
          </li>
          <li>
            <En>Always cap the turns: a model can keep trying a task it cannot finish.</En>
            <Zh>一定要限制轮数：模型可能会不停地尝试一个它完成不了的任务。</Zh>
          </li>
          <li>
            <En>Claude Code is this exact loop, with tools that read files, edit files, and run commands.</En>
            <Zh>Claude Code 就是这个循环，只是它的 tool 是读文件、改文件和执行命令。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.3 Letting the SDK run the loop</En>
          <Zh>6.3 让 SDK 来跑这个循环</Zh>
        </h4>
        <p>
          <En>With tools made by the SDK's tool helper (<code>betaZodTool</code>), the tool runner writes the loop for you.</En>
          <Zh>如果 tool 是用 SDK 的 tool 辅助函数（<code>betaZodTool</code>）创建的，tool runner 会替你写好这个循环。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const final = await client.beta.messages.toolRunner({
  model: "claude-haiku-5-5",
  max_tokens: 1000,
  max_iterations: 10,
  tools: [getWeather, createEvent],
  messages: [{ role: "user", content: "If Friday is sunny, book a picnic." }],
});`}
        />

        <h4 className="topic topic-line">
          <En>6.4 Keeping the agent safe</En>
          <Zh>6.4 让 agent 保持安全</Zh>
        </h4>
        <p>
          <En>Pain point: a model can be talked into anything, so it must never hold the power to do damage.</En>
          <Zh>痛点：模型可以被说服去做任何事，所以绝不能让它拥有造成破坏的权力。</Zh>
        </p>
        <ProposeApprove />
        <ul>
          <li>
            <En>Check permissions inside the tool, with the logged-in user's identity, like any API endpoint.</En>
            <Zh>在 tool 内部用当前登录用户的身份检查权限，就像任何 API 接口一样。</Zh>
          </li>
          <li>
            <En>For anything that moves money or deletes data, give the agent a tool that proposes, and let a human approve.</En>
            <Zh>凡是涉及资金或删除数据的操作，只给 agent 一个&quot;提议&quot;型 tool，由人来批准。</Zh>
          </li>
        </ul>

        {/* ───────────── reference ───────────── */}
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
              <td>Tool</td>
              <td><En>A function the model may ask your code to run</En><Zh>模型可以请求你的代码去运行的函数</Zh></td>
            </tr>
            <tr>
              <td><code>tool_use</code></td>
              <td><En>The block where the model asks for a tool, with its input</En><Zh>模型请求调用 tool 的内容块，附带输入参数</Zh></td>
            </tr>
            <tr>
              <td><code>tool_result</code></td>
              <td><En>The block where you send back what the tool returned</En><Zh>你把 tool 返回结果发回去的内容块</Zh></td>
            </tr>
            <tr>
              <td>MCP server</td>
              <td><En>A program that exposes tools over the MCP standard</En><Zh>按照 MCP 标准暴露 tools 的程序</Zh></td>
            </tr>
            <tr>
              <td>MCP client</td>
              <td><En>The connector inside an app that talks to one server</En><Zh>应用内部负责和某个 server 通信的连接器</Zh></td>
            </tr>
            <tr>
              <td>MCP host</td>
              <td><En>The AI app itself: your app, Claude Desktop, an IDE</En><Zh>AI 应用本身：你的应用、Claude Desktop、IDE</Zh></td>
            </tr>
            <tr>
              <td>Agent</td>
              <td><En>A model calling tools in a loop until it decides it is done</En><Zh>在循环中调用 tools，直到自己判断完成为止的模型</Zh></td>
            </tr>
          </tbody>
        </table>

        <p className="callout">
          <En>The agent can now act. How does it look things up in your own documents?</En>
          <Zh>agent 现在能&quot;做事&quot;了。那它怎么查阅你自己的文档？</Zh>
        </p>
      </section>
    </div>
  );
}
