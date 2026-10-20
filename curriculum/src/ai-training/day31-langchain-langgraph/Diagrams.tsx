// Diagrams for Notes.tsx (LangChain and LangGraph, taught through the Slice Pizza ordering bot).
// One component per picture; arrowheads come from the <ArrowDefs /> in Notes.tsx.
//
// Colour key used on every diagram that draws the pizza bot (same as backend-lecture-code's architecture.html):
//   blue = a model call   purple = an agent (model + tools in a loop)   orange = waits for a person
//   grey = plain code     yellow = LangGraph (the engine)
import { Arrow, Box, T } from "../../components/Diagram";
import type { Kind } from "../../components/Diagram";

type Tone = "blue" | "purple" | "orange" | "gray" | "yellow" | "green";
const TONE: Record<Tone, [string, string]> = {
  blue: ["#eef3ff", "#7ea6e0"],
  purple: ["#f3eefc", "#8e5fd6"],
  orange: ["#fff1e6", "#e8a060"],
  gray: ["#f5f5f5", "#bbbbbb"],
  yellow: ["#fff7e0", "#e8b400"],
  green: ["#eef8ee", "#7dbb7d"],
};

function Panel({ x, y, w, h, tone = "gray", dashed }: { x: number; y: number; w: number; h: number; tone?: Tone; dashed?: boolean }) {
  const [fill, stroke] = TONE[tone];
  return <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={dashed ? "5,4" : undefined} />;
}

// Two columns of "this → that" rows, with optional column headings
function Rows({ rows, leftKind = "service", rightKind = "ok", label, head }: { rows: [string, string][]; leftKind?: Kind; rightKind?: Kind; label: string; head: [string, string] }) {
  const top = 26;
  return (
    <svg viewBox={`0 0 680 ${rows.length * 44 + 14 + top}`} role="img" aria-label={label}>
      <T x={160} y={18} size={11} color="#2e5fa8" bold>{head[0]}</T>
      <T x={520} y={18} size={11} color="#2f7a33" bold>{head[1]}</T>
      {rows.map(([a, b], i) => (
        <g key={a}>
          <Box x={10} y={top + 10 + i * 44} w={300} h={34} kind={leftKind} label={a} size={10.5} />
          <Arrow d={`M312,${top + 27 + i * 44} L368,${top + 27 + i * 44}`} />
          <Box x={370} y={top + 10 + i * 44} w={300} h={34} kind={rightKind} label={b} size={10.5} />
        </g>
      ))}
    </svg>
  );
}

// Plain-code box: grey fill with dark text (the shared "muted" Box is deliberately faint)
function Plain({ x, y, w, h, label, sub, size = 12 }: { x: number; y: number; w: number; h: number; label: string; sub?: string; size?: number }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#f1f1f1" stroke="#9a9a9a" strokeWidth={1.5} />
      <T x={cx} y={sub ? cy - 2 : cy + 4} size={size} color="#1c1c1c" bold>{label}</T>
      {sub && <T x={cx} y={cy + 12} size={9} color="#555">{sub}</T>}
    </g>
  );
}

function Swatch({ x, y, tone, label }: { x: number; y: number; tone: Tone; label: string }) {
  const [fill, stroke] = TONE[tone];
  return (
    <g>
      <rect x={x} y={y} width={12} height={12} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <T x={x + 18} y={y + 10} anchor="start" size={10} color="#33415c">{label}</T>
    </g>
  );
}

/* ───────────── 1. the big idea ───────────── */

export function HandBuiltRows() {
  return (
    <Rows
      head={["What we wrote by hand", "What the framework gives"]}
      label="Each piece of plumbing written by hand maps to one framework feature: the agent loop to createAgent, tool schemas to tool and zod, the RAG code to loaders and a retriever, the state object to graph state, checkpoint files to a checkpointer, the approval pause to interrupt, and the router if/else to a conditional edge."
      rows={[
        ["the agent loop + turn cap", "createAgent + a call limit"],
        ["JSON tool schemas + a switch", "tool() + a zod schema"],
        ["our chunk / embed / search code", "loaders, splitters, a retriever"],
        ["our state object", "graph state"],
        ["our router (if / else)", "a conditional edge"],
        ["runs/<id>.json checkpoint files", "a checkpointer + thread_id"],
        ["our approval pause", "interrupt()"],
      ]}
    />
  );
}

export function Stack() {
  return (
    <svg viewBox="0 0 680 330" role="img" aria-label="Two layers of one stack. LangChain on top is the parts: a model, tools, a retriever, and createAgent. LangGraph below is the engine: state, nodes, edges, saved progress, pausing. createAgent is itself a LangGraph graph, and the parts are also used inside the nodes of your own graph. LangSmith sits to the side as a separate tool for tracing and evals.">
      <Panel x={10} y={10} w={520} h={140} tone="blue" />
      <T x={26} y={32} anchor="start" size={13} color="#1c1c1c" bold>LangChain: the parts</T>
      <Box x={26} y={50} w={200} h={52} kind="broker" label="createAgent" sub="a ready-made agent" size={12} />
      <Box x={246} y={50} w={82} h={52} label="Model" sub="initChatModel" size={11} />
      <Box x={336} y={50} w={92} h={52} label="Tools" sub="+ zod schema" size={11} />
      <Box x={436} y={50} w={80} h={52} label="Retriever" sub="RAG search" size={11} />
      <T x={26} y={128} anchor="start" size={10} color="#5b6b82">import them, call them, swap them</T>

      <Panel x={10} y={190} w={520} h={130} tone="yellow" />
      <T x={26} y={212} anchor="start" size={13} color="#1c1c1c" bold>LangGraph: the engine</T>
      <T x={26} y={230} anchor="start" size={10} color="#5b6b82">state · nodes · edges · saved progress · pause for a human · streaming</T>
      <Box x={26} y={250} w={200} h={52} kind="broker" label="createAgent's graph" sub="built in, you never see it" size={11} />
      <Box x={246} y={250} w={270} h={52} kind="primary" label="your own graph (the pizza bot)" sub="you draw the nodes and edges" size={11} />

      <Arrow d="M126,150 L126,188" ink="purple" />
      <T x={134} y={174} anchor="start" size={10} color="#6b3fb3" bold>is a LangGraph graph</T>
      <Arrow d="M387,150 L387,188" ink="orange" />
      <T x={395} y={174} anchor="start" size={10} color="#c0702a" bold>used inside your nodes</T>

      <Box x={548} y={104} w={122} h={80} kind="muted" dashed label="LangSmith" sub="traces + evals" size={12} />
      <T x={609} y={204} size={9.5} color="#5b6b82">a separate tool,</T>
      <T x={609} y={218} size={9.5} color="#5b6b82">for any LLM app</T>
    </svg>
  );
}

export function PizzaOverview() {
  const cards: [string, string, Kind][] = [
    ["Ask a question", "answers from the menu and allergen documents (RAG)", "service"],
    ["Order pizzas", "an agent adds and removes cart items with tools", "broker"],
    ["Check out", "asks the customer first, then charges the card", "warn"],
    ["Where is my order?", "looks the order up: plain code, no model", "muted"],
  ];
  return (
    <svg viewBox="0 0 680 246" role="img" aria-label="The Slice Pizza bot is one chat window that can do four things: answer a question from the menu documents, take an order with an agent that edits the cart, check out after asking the customer, and look up an order's status.">
      <Box x={10} y={90} w={120} h={60} kind="primary" label="Customer" sub="one chat window" size={12} />
      {cards.map(([label, sub, kind], i) => (
        <g key={label}>
          <Arrow d={`M132,120 L208,${34 + i * 58}`} />
          {kind === "muted" ? (
            <Plain x={210} y={10 + i * 58} w={460} h={48} label={label} sub={sub} />
          ) : (
            <Box x={210} y={10 + i * 58} w={460} h={48} kind={kind} label={label} sub={sub} size={12} />
          )}
        </g>
      ))}
    </svg>
  );
}

/* ───────────── 2. LangChain: the parts ───────────── */

export function ZodTwoUses() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="One zod schema is used two ways. With withStructuredOutput, the model's reply is a typed, validated object. With tool(), it becomes the input the model may ask for, and your own code runs the function.">
      <Box x={10} y={70} w={170} h={60} kind="broker" label="one zod schema" sub="OrderItem: item, size, quantity" size={12} />
      <Arrow d="M182,92 L328,52" />
      <Arrow d="M182,108 L328,148" />
      <Box x={330} y={20} w={340} h={64} kind="ok" label="withStructuredOutput" sub="the reply is a typed object, already validated" size={12} />
      <Box x={330} y={118} w={340} h={64} kind="service" label="tool()" sub="the model may ask for it; your code runs the function" size={12} />
      <T x={95} y={152} size={9.5} color="#5b6b82">the model sees it as a JSON schema</T>
    </svg>
  );
}

export function AgentLoop() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="The agent loop that createAgent runs for you: the model decides the next step and asks for a tool, the tool runs and returns a result, and the model reads it, repeating until it asks for no more tools, when its answer is the final reply. A call limit stops it after six model calls.">
      <Box x={20} y={40} w={180} h={62} label="model call" sub="decides the next step" size={12} />
      <Plain x={330} y={40} w={200} h={62} label="tools" sub="add / remove / view the cart" />
      <Arrow d="M202,58 L328,58" />
      <T x={265} y={50} size={9.5} color="#33415c">asks for a tool</T>
      <Arrow d="M328,86 L202,86" />
      <T x={265} y={100} size={9.5} color="#33415c">result</T>
      <Arrow d="M110,104 L110,146 L640,146" ink="green" />
      <T x={380} y={138} size={10} color="#2f7a33" bold>no tool left to ask for: this is the final reply</T>
      <Box x={558} y={40} w={112} h={62} kind="warn" dashed label="call limit" sub="stop after 6" size={11} />
      <T x={10} y={188} anchor="start" size={10.5} color="#33415c">This is the while loop we wrote by hand. createAgent runs it, plus the limit.</T>
    </svg>
  );
}

/* ───────────── 3. LangGraph: your own flow ───────────── */

export function NodeEdgeAnatomy() {
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="The three parts of a graph, shown on a slice of the pizza bot. One shared state sits on top. A node is a function that reads the state and returns an update: classify, answer and orderAgent. An edge is an arrow to the next node. A conditional edge is a function that reads the state and names the next node: question goes to answer, order goes to orderAgent.">
      <Box x={10} y={10} w={660} h={36} kind="broker" label="state: { messages, intent, cart, confirmed }    one shared object every node reads and updates" size={10.5} />
      <Arrow d="M177,48 L177,84" ink="purple" dashed />
      <Arrow d="M475,48 L475,68" ink="purple" dashed />
      <Box x={10} y={100} w={56} h={30} kind="muted" label="START" size={9.5} />
      <Arrow d="M68,115 L110,115" />
      <T x={89} y={106} size={9} color="#33415c" bold>edge</T>
      <Box x={112} y={86} w={130} h={56} label="classify" sub="a node" size={12} />
      <Arrow d="M244,104 L398,94" ink="green" dashed />
      <T x={300} y={90} size={9.5} color="#2f7a33" bold>question</T>
      <Arrow d="M244,126 L398,170" ink="green" dashed />
      <T x={300} y={158} size={9.5} color="#2f7a33" bold>order</T>
      <Box x={400} y={70} w={150} h={48} label="answer" sub="a node" size={12} />
      <Box x={400} y={146} w={150} h={48} kind="broker" label="orderAgent" sub="a node" size={12} />
      <Arrow d="M552,94 L598,122" />
      <Arrow d="M552,170 L598,138" />
      <Box x={600} y={116} w={70} h={30} kind="muted" label="END" size={9.5} />
      <T x={322} y={214} size={10} color="#2f7a33" bold>conditional edge: a function reads the state and names the next node</T>
      <T x={10} y={240} anchor="start" size={10.5} color="#33415c">node = a function: reads the state, returns only the keys it changed</T>
      <T x={10} y={258} anchor="start" size={10.5} color="#33415c">edge = an arrow to the next node (solid: always · dashed: a condition picks one)</T>
    </svg>
  );
}

export function PizzaGraph() {
  return (
    <svg viewBox="0 0 680 350" role="img" aria-label="The whole pizza graph. classify routes by intent to one of four paths: answer (a model call with retrieval), orderAgent (the only agent), confirm (waits for a person, then placeOrder or cancel), and orderStatus (plain code). All paths end. The paths are fixed by our code, so the graph is a workflow; only orderAgent lets the model choose its own steps.">
      <Box x={10} y={134} w={112} h={50} label="classify" sub="labels the message" size={12} />
      <Arrow d="M124,159 L154,159" />
      <path d="M156,33 L156,259" stroke="#444" strokeWidth="1.5" fill="none" />
      <Arrow d="M156,33 L248,33" ink="green" dashed />
      <Arrow d="M156,105 L248,105" ink="green" dashed />
      <Arrow d="M156,177 L248,177" ink="green" dashed />
      <Arrow d="M156,259 L248,259" ink="green" dashed />
      <T x={164} y={26} anchor="start" size={9} color="#2f7a33" bold>question</T>
      <T x={164} y={98} anchor="start" size={9} color="#2f7a33" bold>order</T>
      <T x={164} y={170} anchor="start" size={9} color="#2f7a33" bold>checkout</T>
      <T x={164} y={252} anchor="start" size={9} color="#2f7a33" bold>order_status</T>

      <Box x={250} y={10} w={172} h={46} label="answer" sub="RAG: retrieve, then write" size={12} />
      <Box x={250} y={82} w={172} h={46} kind="broker" label="orderAgent" sub="the only agent: a tool loop" size={12} />
      <Box x={250} y={154} w={172} h={46} kind="warn" label="confirm" sub="interrupt(): waits for a person" size={12} />
      <Plain x={250} y={236} w={172} h={46} label="orderStatus" sub="plain code, no model" />

      <Arrow d="M424,171 L446,171 L446,158 L468,158" ink="green" dashed />
      <Arrow d="M446,171 L446,204 L468,204" ink="green" dashed />
      <T x={440} y={150} size={9} color="#2f7a33" bold>yes</T>
      <T x={440} y={222} size={9} color="#2f7a33" bold>no</T>
      <Plain x={470} y={140} w={120} h={36} label="placeOrder" size={11} />
      <Plain x={470} y={186} w={120} h={36} label="cancel" size={11} />

      <path d="M424,33 L610,33 M424,105 L610,105 M592,158 L610,158 M592,204 L610,204 M424,259 L610,259 M610,33 L610,259" stroke="#444" strokeWidth="1.5" fill="none" />
      <Arrow d="M610,146 L626,146" />
      <Box x={628} y={132} w={42} h={30} kind="muted" label="END" size={9.5} />

      <Swatch x={10} y={304} tone="blue" label="a model call" />
      <Swatch x={130} y={304} tone="purple" label="an agent" />
      <Swatch x={230} y={304} tone="orange" label="waits for a person" />
      <Swatch x={380} y={304} tone="gray" label="plain code" />
      <T x={10} y={338} anchor="start" size={10.5} color="#33415c">Our code fixed every path, so the whole graph is a workflow. Only orderAgent lets the model choose its steps.</T>
    </svg>
  );
}

export function CheckpointResume() {
  return (
    <svg viewBox="0 0 680 232" role="img" aria-label="Run 1: the graph runs classify then orderAgent for the message 'A large pepperoni', saving a checkpoint after each node, then the server restarts. Run 2 with the same thread_id loads the saved state, so 'And a coke' finds the pepperoni already in the cart.">
      <T x={10} y={42} anchor="start" size={11} color="#1c1c1c" bold>message 1</T>
      <T x={10} y={58} anchor="start" size={9.5} color="#5b6b82">“A large pepperoni”</T>
      <Box x={130} y={26} w={90} h={36} label="classify" size={11} />
      <circle cx={236} cy={44} r={7} fill="#e8b400" />
      <Box x={252} y={26} w={100} h={36} kind="broker" label="orderAgent" size={11} />
      <circle cx={368} cy={44} r={7} fill="#e8b400" />
      <Box x={410} y={26} w={140} h={36} kind="fail" label="server restarts" size={11} />
      <T x={130} y={84} anchor="start" size={9.5} color="#a8780a" bold>● = a checkpoint (the state, saved)</T>

      <Arrow d="M368,52 L368,100 L205,100 L205,122" ink="purple" dashed />
      <T x={290} y={112} size={9.5} color="#6b3fb3" bold>same thread_id</T>

      <T x={10} y={146} anchor="start" size={11} color="#1c1c1c" bold>message 2</T>
      <T x={10} y={162} anchor="start" size={9.5} color="#5b6b82">“And a coke”</T>
      <Box x={130} y={126} w={150} h={44} kind="primary" label="load saved state" sub="messages + cart" size={11} />
      <Arrow d="M282,148 L312,148" />
      <Box x={314} y={130} w={90} h={36} label="classify" size={11} />
      <Arrow d="M406,148 L436,148" />
      <Box x={438} y={130} w={110} h={36} kind="broker" label="orderAgent" size={11} />
      <T x={10} y={206} anchor="start" size={10.5} color="#33415c">The cart survived the restart: the pepperoni is still in it when the coke is added.</T>
    </svg>
  );
}

export function InterruptResume() {
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="Checkout pause and resume. First run: classify, then confirm calls interrupt and the run stops with its state saved. Later, the customer clicks Confirm, and the graph resumes: confirm runs again from its first line and interrupt now returns the answer, then placeOrder charges the card. Because confirm runs twice, the charge belongs in placeOrder, after the answer.">
      <T x={10} y={34} anchor="start" size={11} color="#1c1c1c" bold>1. “check out”</T>
      <Box x={130} y={16} w={90} h={36} label="classify" size={11} />
      <Arrow d="M222,34 L250,34" />
      <Box x={252} y={10} w={178} h={48} kind="warn" label="confirm" sub="interrupt() stops here" size={12} />
      <circle cx={452} cy={34} r={7} fill="#e8b400" />
      <T x={466} y={32} anchor="start" size={10} color="#a8780a" bold>⏸ saved</T>
      <T x={466} y={46} anchor="start" size={9.5} color="#5b6b82">waiting for the customer</T>

      <Arrow d="M452,64 L452,98 L340,98 L340,122" ink="purple" dashed />
      <T x={462} y={92} anchor="start" size={9.5} color="#6b3fb3" bold>minutes later, same thread_id</T>

      <T x={10} y={152} anchor="start" size={11} color="#1c1c1c" bold>2. customer clicks</T>
      <T x={10} y={168} anchor="start" size={11} color="#1c1c1c" bold>Confirm</T>
      <Box x={252} y={126} w={178} h={52} kind="warn" label="confirm (again)" sub="interrupt() now returns yes" size={11} />
      <Arrow d="M432,152 L470,152" />
      <Plain x={472} y={134} w={130} h={36} label="placeOrder" sub="charge the card" size={11} />

      <T x={10} y={216} anchor="start" size={10.5} color="#33415c">confirm ran twice, so anything above interrupt() would have run twice too.</T>
      <T x={10} y={238} anchor="start" size={10.5} color="#33415c">That is why the charge lives in placeOrder, after the yes.</T>
    </svg>
  );
}

/* ───────────── 3.5 together ───────────── */

export function TwoLanes() {
  const left = ["draws the paths: nodes and edges", "keeps the shared state", "saves a checkpoint after every node", "pauses at confirm for the customer", "streams which node is running"];
  const right = ["classify: a model + structured output", "answer: a retriever + a model", "orderAgent: createAgent + cart tools", "confirm and the others: plain functions", "every model call: one model interface"];
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="LangGraph does the flow: it draws the paths, keeps the state, saves checkpoints, pauses for a person, and streams node updates. LangChain does the work inside the boxes: structured output for classify, a retriever for answer, createAgent with tools for orderAgent, and one model interface behind every call.">
      <Panel x={10} y={10} w={325} h={170} tone="yellow" />
      <T x={26} y={34} anchor="start" size={12.5} color="#1c1c1c" bold>LangGraph: the flow</T>
      {left.map((l, i) => (
        <T key={l} x={26} y={60 + i * 22} anchor="start" size={10.5} color="#33415c">{l}</T>
      ))}
      <Panel x={345} y={10} w={325} h={170} tone="blue" />
      <T x={361} y={34} anchor="start" size={12.5} color="#1c1c1c" bold>LangChain: the work in each box</T>
      {right.map((l, i) => (
        <T key={l} x={361} y={60 + i * 22} anchor="start" size={10.5} color="#33415c">{l}</T>
      ))}
      <T x={340} y={206} size={11} color="#2e5fa8" bold>LangGraph decides what runs next. LangChain does the work inside each box.</T>
    </svg>
  );
}

/* ───────────── 4. choosing ───────────── */

export function WhichLevel() {
  return (
    <Rows
      head={["The job", "Reach for"]}
      label="Choose the simplest level that works: one call or a short fixed chain needs only plain code and the model interface; one open-ended agent with tools needs createAgent; fixed steps with branches, saved progress and approval need a LangGraph graph, with createAgent inside the node that needs judgment."
      rows={[
        ["one call, or a short fixed chain", "plain code + the model interface"],
        ["one open-ended agent with tools", "createAgent"],
        ["fixed steps, branches, saved progress, approval", "a LangGraph graph (createAgent inside a node)"],
      ]}
    />
  );
}
