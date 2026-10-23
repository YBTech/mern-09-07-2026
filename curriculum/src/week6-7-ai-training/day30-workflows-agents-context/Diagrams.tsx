// Diagrams for Notes.tsx (Workflows, Agents & Context Engineering). One component per picture; arrowheads
// come from the <ArrowDefs /> in Notes.tsx.
import type { ReactNode } from "react";
import { Arrow, Box, T } from "../../components/Diagram";

type Tone = "blue" | "green" | "orange" | "red" | "purple" | "gray" | "yellow";
const TONE: Record<Tone, [string, string]> = {
  blue: ["#eef3ff", "#7ea6e0"],
  green: ["#eef8ee", "#7dbb7d"],
  orange: ["#fff1e6", "#e8a060"],
  red: ["#fdf3f3", "#d98b8b"],
  purple: ["#f3eefc", "#8e5fd6"],
  gray: ["#f5f5f5", "#bbbbbb"],
  yellow: ["#fff7e0", "#e8b400"],
};

function Panel({ x, y, w, h, tone = "gray", dashed }: { x: number; y: number; w: number; h: number; tone?: Tone; dashed?: boolean }) {
  const [fill, stroke] = TONE[tone];
  return <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={dashed ? "5,4" : undefined} />;
}

type CardSpec = { tone: Tone; title: string; lines: string[]; foot?: string };

function CardAt({ x, w, h, spec }: { x: number; w: number; h: number; spec: CardSpec }) {
  return (
    <g>
      <Panel x={x} y={10} w={w} h={h} tone={spec.tone} />
      <T x={x + 16} y={34} anchor="start" size={12.5} color="#1c1c1c" bold>{spec.title}</T>
      {spec.lines.map((l, i) => (
        <T key={l} x={x + 16} y={60 + i * 21} anchor="start" size={10.5} color="#33415c">{l}</T>
      ))}
      {spec.foot && <T x={x + 16} y={h - 2} anchor="start" size={10.5} color="#1c1c1c" bold>{spec.foot}</T>}
    </g>
  );
}

/* ───────────── 1. three core pieces ───────────── */

export function ThreeCores() {
  const x = [10, 233, 456];
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="Three core pieces. The LLM call takes a prompt and returns text or a tool request. The control flow is picked by your code, through chain, route, parallel and loop, or by the model, through tool calls and delegation. The state carries results either as a return value passed to the next call or through a shared state that calls write to and read from.">
      <Panel x={x[0]} y={10} w={213} h={190} tone="yellow" />
      <T x={x[0] + 106} y={36} size={12.5} color="#1c1c1c" bold>1. LLM call</T>
      <T x={x[0] + 106} y={58} size={10} color="#5b6b82">one request to the model</T>
      <Box x={x[0] + 12} y={74} w={189} h={44} label="Prompt in" size={11} />
      <Arrow d={`M${x[0] + 106},120 L${x[0] + 106},134`} />
      <Box x={x[0] + 12} y={136} w={189} h={44} kind="ok" label="Text out" sub="or a tool request" size={11} />

      <Panel x={x[1]} y={10} w={213} h={190} tone="blue" />
      <T x={x[1] + 106} y={36} size={12.5} color="#1c1c1c" bold>2. Control flow</T>
      <T x={x[1] + 106} y={58} size={10} color="#5b6b82">who picks the next step?</T>
      <Box x={x[1] + 12} y={74} w={189} h={44} label="Your code" sub="chain · route · parallel · loop" size={11} />
      <Box x={x[1] + 12} y={136} w={189} h={44} kind="primary" label="The model" sub="tool calls · delegation" size={11} />

      <Panel x={x[2]} y={10} w={213} h={190} tone="purple" />
      <T x={x[2] + 106} y={36} size={12.5} color="#1c1c1c" bold>3. State</T>
      <T x={x[2] + 106} y={58} size={10} color="#5b6b82">how results reach the next call</T>
      <Box x={x[2] + 12} y={74} w={189} h={44} label="Return value" sub="passed into the next prompt" size={11} />
      <Box x={x[2] + 12} y={136} w={189} h={44} kind="broker" label="Shared state" sub="an object or a file" size={11} />
    </svg>
  );
}

export function DataChannel() {
  const checks = ["Check refund", "Check warranty", "Check firmware"];
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Two ways to pass a result. When a call needs the previous answer, pass the return value and wait, as in look up the order, then decide, then draft. When calls are independent, run them together and let each write its own key into a shared state object or file, which the merge step reads.">
      <Panel x={10} y={10} w={325} h={200} tone="blue" />
      <T x={172} y={34} size={12} color="#1c1c1c" bold>Return value: wait for the answer</T>
      {["Look up", "Decide", "Draft"].map((l, i) => (
        <g key={l}>
          <Box x={24 + i * 104} y={62} w={88} h={40} label={l} size={11} />
          {i < 2 && <Arrow d={`M${114 + i * 104},82 L${126 + i * 104},82`} />}
        </g>
      ))}
      <T x={172} y={130} size={10.5} color="#33415c">each call needs the one before it</T>
      <text x={30} y={166} fontSize={10.5} fontFamily="monospace" fill="#33415c">{"const ruling = await decide(order);"}</text>
      <T x={172} y={194} size={10.5} color="#2e5fa8" bold>one after another</T>

      <Panel x={345} y={10} w={325} h={200} tone="yellow" />
      <T x={507} y={34} size={12} color="#1c1c1c" bold>Shared state: write, then read</T>
      {checks.map((l, i) => (
        <g key={l}>
          <Box x={358} y={50 + i * 42} w={130} h={32} label={l} size={10} />
          <Arrow d={`M490,${66 + i * 42} L518,${96}`} ink="purple" />
        </g>
      ))}
      <Box x={520} y={70} w={140} h={52} kind="broker" label="state" sub="refund · warranty · firmware" size={11} />
      <T x={507} y={194} size={10.5} color="#9a7400" bold>all at once, each writes its own key</T>
      <T x={340} y={238} size={11} color="#1c1c1c" bold>Needs the previous answer: pass it. Independent: write to shared state.</T>
    </svg>
  );
}

/* ───────────── 3. workflow or agent ───────────── */

export function CoreMap() {
  return (
    <svg viewBox="0 0 680 296" role="img" aria-label="The core is one LLM call. Around it, either your code decides the flow, which is a workflow made of prompt chaining, routing and parallelization, or the model decides the flow, which is an agent made of the tool loop and subagents. Evaluator-optimizer is written as a workflow but often appears inside agent systems.">
      <Box x={190} y={8} w={300} h={46} kind="primary" label="LLM call" sub="prompt in, text or tool request out" size={12} />
      <Arrow d="M300,56 L190,86" />
      <Arrow d="M380,56 L490,86" />
      <Panel x={10} y={88} w={325} h={150} tone="blue" />
      <T x={172} y={112} size={12.5} color="#1c1c1c" bold>Workflow: your code decides</T>
      {["Prompt chain", "Router", "Parallelization"].map((l, i) => (
        <Box key={l} x={22 + i * 102} y={128} w={94} h={44} label={l} size={10} />
      ))}
      <T x={172} y={204} size={10.5} color="#2e5fa8" bold>fixed path · predictable · cheaper</T>
      <Panel x={345} y={88} w={325} h={150} tone="yellow" />
      <T x={507} y={112} size={12.5} color="#1c1c1c" bold>Agent: the model decides</T>
      <Box x={364} y={128} w={140} h={44} kind="primary" label="Agent loop" sub="model + tools" size={11} />
      <Box x={520} y={128} w={132} h={44} label="Subagents" sub="a tool with a loop" size={11} />
      <T x={507} y={204} size={10.5} color="#9a7400" bold>path varies · flexible · costlier</T>
      <Box x={10} y={252} w={660} h={36} kind="muted" label="Evaluator-optimizer: written as a workflow, but it shows up inside many agent systems" size={10.5} />
    </svg>
  );
}

export function TradeoffAxes() {
  const rows: [string, string, string, boolean][] = [
    ["Predictable", "same path every run", "path changes per run", true],
    ["Cost", "few calls, known tokens", "many turns, unknown tokens", true],
    ["Speed", "fixed length, can run in parallel", "unknown number of turns", true],
    ["Debugging", "find the one failing step", "read the whole trace", true],
    ["Flexible", "only the cases you coded", "handles the unexpected", false],
  ];
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="Workflows win on predictability, cost, speed and debugging; agents win on flexibility. Choosing is trading flexibility against control.">
      <T x={270} y={20} size={11} color="#2e5fa8" bold>Workflow</T>
      <T x={545} y={20} size={11} color="#9a7400" bold>Agent</T>
      {rows.map(([name, w, a, wf], i) => (
        <g key={name}>
          <T x={14} y={52 + i * 46} anchor="start" size={11.5} color="#1c1c1c" bold>{name}</T>
          <Box x={140} y={32 + i * 46} w={260} h={32} kind={wf ? "ok" : "muted"} label={w} size={10.5} />
          <Box x={410} y={32 + i * 46} w={260} h={32} kind={wf ? "muted" : "ok"} label={a} size={10.5} />
        </g>
      ))}
    </svg>
  );
}

/* ───────────── 2. patterns ───────────── */

export function PromptChain() {
  return (
    <svg viewBox="0 0 680 222" role="img" aria-label="A refund prompt chain: code looks up the order, code retrieves the refund policy, and let the model decide using that policy. Code branches on the decision. Eligible: process the refund. Not eligible: deny. Both paths meet at the draft reply, then the tone check.">
      <Box x={6} y={80} w={92} h={44} kind="broker" label="Look up order" sub="code" size={10.5} />
      <Arrow d="M100,102 L108,102" />
      <Box x={110} y={80} w={92} h={44} kind="broker" label="Fetch policy" sub="code · RAG" size={10.5} />
      <Arrow d="M204,102 L212,102" />
      <Box x={214} y={80} w={92} h={44} label="Decide" sub="model reads policy" size={10.5} />

      <Arrow d="M308,96 L330,48" ink="green" />
      <T x={324} y={34} anchor="end" size={10} color="#3d8b40" bold>✓ eligible</T>
      <Box x={332} y={22} w={124} h={44} kind="broker" label="Process refund" sub="code: refund API" size={10.5} />
      <Arrow d="M458,48 L478,96" />

      <Arrow d="M308,108 L330,156" ink="red" />
      <T x={324} y={178} anchor="end" size={10} color="#c0392b" bold>✗ not eligible</T>
      <Box x={332} y={138} w={124} h={44} kind="fail" label="Deny return" sub="code" size={10.5} />
      <Arrow d="M458,156 L478,108" />

      <Box x={480} y={80} w={92} h={44} label="Draft reply" sub="model" size={10.5} />
      <Arrow d="M574,102 L582,102" />
      <Box x={584} y={80} w={90} h={44} kind="ok" label="Check tone" sub="model + code" size={10.5} />

      <T x={340} y={210} size={10.5}>The model decides, your code branches on its answer. Blue: model. Purple: code.</T>
    </svg>
  );
}

export function RouterPattern() {
  const paths = ["Refund path", "Product question", "Order status"];
  const subs = ["tools: order, refund", "tools: search docs", "tools: order only"];
  return (
    <svg viewBox="0 0 680 284" role="img" aria-label="A router first classifies the input, then sends it down one of several specialised paths, each with its own prompt and tool set. An input that fits no path goes to a person.">
      <Box x={10} y={113} w={100} h={44} kind="muted" label="Question" size={11.5} />
      <Arrow d="M112,135 L146,135" />
      <Box x={148} y={113} w={140} h={44} kind="primary" label="Router" sub="classify the intent" size={12} />
      {paths.map((l, i) => (
        <g key={l}>
          <Box x={400} y={12 + i * 64} w={180} h={46} label={l} sub={subs[i]} size={11.5} />
          <Arrow d={`M290,135 L398,${35 + i * 64}`} ink="orange" />
        </g>
      ))}
      <Arrow d="M290,135 L398,227" ink="red" dashed />
      <T x={330} y={204} size={10} color="#c0392b" bold>no match</T>
      <Box x={400} y={204} w={180} h={46} kind="fail" label="Hand to a person" sub="category: other" size={11.5} />
      <T x={340} y={276} size={10.5}>Every path is written in advance. Anything else needs a fallback.</T>
    </svg>
  );
}

export function ParallelPattern() {
  return (
    <svg viewBox="0 0 680 290" role="img" aria-label="Parallelization has two forms. Sectioning splits a job into independent parts that run at the same time and are merged. Voting runs the same check several times and takes the majority.">
      <T x={10} y={16} anchor="start" size={11} color="#2e5fa8" bold>SECTIONING: different parts at the same time</T>
      <Box x={10} y={60} w={100} h={40} kind="muted" label="Request" size={11} />
      {["Check refund window", "Check warranty", "Check firmware notes"].map((l, i) => (
        <g key={l}>
          <Box x={170} y={26 + i * 40} w={190} h={34} label={l} size={10.5} />
          <Arrow d={`M112,80 L168,${43 + i * 40}`} />
          <Arrow d={`M362,${43 + i * 40} L428,80`} />
        </g>
      ))}
      <Box x={430} y={60} w={110} h={40} kind="primary" label="Merge" size={11.5} />
      <Arrow d="M542,80 L578,80" />
      <Box x={580} y={60} w={90} h={40} kind="ok" label="Answer" size={11} />

      <T x={10} y={168} anchor="start" size={11} color="#2e5fa8" bold>VOTING: the same check, several times</T>
      <Box x={10} y={218} w={100} h={40} kind="muted" label="Request" size={11} />
      {["Judge 1", "Judge 2", "Judge 3"].map((l, i) => (
        <g key={l}>
          <Box x={170} y={180 + i * 36} w={190} h={28} label={l} size={10.5} />
          <Arrow d={`M112,238 L168,${194 + i * 36}`} />
          <Arrow d={`M362,${194 + i * 36} L428,238`} />
        </g>
      ))}
      <Box x={430} y={218} w={110} h={40} kind="primary" label="Majority" size={11.5} />
      <Arrow d="M542,238 L578,238" />
      <Box x={580} y={218} w={90} h={40} kind="ok" label="Verdict" size={11} />
    </svg>
  );
}

export function TwoWaysToDrive() {
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="Two ways to drive the same worker. Code-driven: a model plans, then your code starts every worker at once and a final call combines the reports. Agent-driven: a lead agent calls a research tool whenever it decides to, one worker at a time, and the second brief carries facts from the first report. The worker is the same in both; only the caller changes.">
      <Panel x={10} y={10} w={325} h={214} tone="blue" />
      <T x={172} y={32} size={12} color="#1c1c1c" bold>Code-driven: your code calls them</T>
      <Box x={97} y={46} w={150} h={36} kind="primary" label="Plan (model)" size={10.5} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Box x={22 + i * 102} y={110} w={96} h={34} label="Worker" size={10.5} />
          <Arrow d={`M172,84 L${70 + i * 102},108`} />
          <Arrow d={`M${70 + i * 102},146 L172,166`} ink="green" />
        </g>
      ))}
      <Box x={97} y={168} w={150} h={34} kind="ok" label="Combine (model)" size={10.5} />
      <T x={172} y={218} size={10} color="#2e5fa8" bold>all at once, in an order fixed by code</T>

      <Panel x={345} y={10} w={325} h={214} tone="purple" />
      <T x={507} y={32} size={12} color="#1c1c1c" bold>Agent-driven: the lead calls them</T>
      <Box x={360} y={46} w={120} h={156} kind="primary" label="Lead agent" sub="its own loop" size={11.5} />
      <Box x={530} y={56} w={128} h={40} label="Worker" sub="brief 1 → report 1" size={10.5} />
      <Arrow d="M482,68 L528,68" />
      <Arrow d="M528,86 L482,86" ink="green" />
      <Box x={530} y={146} w={128} h={40} label="Worker" sub="brief 2 carries report 1" size={10.5} />
      <Arrow d="M482,158 L528,158" />
      <Arrow d="M528,176 L482,176" ink="green" />
      <T x={507} y={218} size={10} color="#8e5fd6" bold>one at a time, when the model decides</T>

      <T x={340} y={250} size={11} color="#1c1c1c" bold>The same worker in both. Only the caller changes.</T>
    </svg>
  );
}

export function EvaluatorOptimizer() {
  return (
    <svg viewBox="0 0 680 165" role="img" aria-label="An evaluator-optimizer pair: a writer drafts, an evaluator checks the draft against a rubric, and failing drafts go back to the writer with feedback, up to a maximum number of rounds.">
      <Box x={20} y={30} w={150} h={54} label="Writer" sub="drafts a reply" size={12} />
      <Arrow d="M172,57 L238,57" />
      <Box x={240} y={30} w={170} h={54} kind="primary" label="Evaluator" sub="checks against the rules" size={12} />
      <Arrow d="M412,57 L508,57" ink="green" />
      <T x={460} y={48} size={10} color="#2e7d32" bold>pass</T>
      <Box x={510} y={30} w={150} h={54} kind="ok" label="Send" size={12} />
      <Arrow d="M325,86 L325,130 L95,130 L95,86" ink="orange" />
      <T x={210} y={150} size={10.5} color="#c0702a" bold>fail + feedback: write again (max 2 rounds)</T>
    </svg>
  );
}

export function AgentLoopPattern() {
  return (
    <svg viewBox="0 0 680 165" role="img" aria-label="The agent loop: the model calls a tool, gets the result, and decides again, until it has no more tool calls and returns the answer. A turn cap always bounds it.">
      <Box x={10} y={66} w={90} h={44} kind="muted" label="Task" size={11.5} />
      <Arrow d="M102,88 L148,88" />
      <Box x={150} y={56} w={150} h={64} kind="primary" label="Model" sub="decides what is next" size={12} />
      <Box x={390} y={56} w={140} h={64} label="Tools" sub="your code runs them" size={12} />
      <Arrow d="M302,76 L388,76" />
      <T x={345} y={68} size={9.5}>tool call</T>
      <Arrow d="M388,102 L302,102" ink="green" />
      <T x={345} y={116} size={9.5}>result</T>
      <Arrow d="M225,54 L225,26 L625,26 L625,64" />
      <T x={425} y={20} size={9.5}>no more tool calls: finished</T>
      <Box x={580} y={66} w={90} h={44} kind="ok" label="Answer" size={11.5} />
      <T x={345} y={150} size={10.5} color="#c0392b" bold>always cap the number of turns</T>
    </svg>
  );
}

/* ───────────── 3. context ───────────── */

export function WindowFills() {
  const turns = Array.from({ length: 6 }, (_, i) => {
    const t = i + 1;
    return { t, fixed: 4, history: 0.6 * t, tools: 2.2 * t };
  });
  const k = 150 / 24;
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Each turn of an agent loop re-sends the whole window. Instructions and tool definitions stay the same size, but history and especially tool results pile up, so every turn is bigger and costlier than the last.">
      <T x={14} y={20} anchor="start" size={11} color="#1c1c1c" bold>Tokens sent on each turn (illustrative, in thousands)</T>
      {turns.map((d, i) => {
        const x = 50 + i * 80;
        const hf = d.fixed * k;
        const hh = d.history * k;
        const ht = d.tools * k;
        const total = d.fixed + d.history + d.tools;
        return (
          <g key={d.t}>
            <rect x={x} y={204 - hf} width={54} height={hf} fill="#7ea6e0" />
            <rect x={x} y={204 - hf - hh} width={54} height={hh} fill="#8e5fd6" />
            <rect x={x} y={204 - hf - hh - ht} width={54} height={ht} fill="#e8a060" />
            <T x={x + 27} y={198 - hf - hh - ht} size={10.5} color="#1c1c1c" bold>{`${Math.round(total)}k`}</T>
            <T x={x + 27} y={222} size={10}>{`turn ${d.t}`}</T>
          </g>
        );
      })}
      {[
        ["#e8a060", "tool results"],
        ["#8e5fd6", "conversation"],
        ["#7ea6e0", "instructions + tools"],
      ].map(([c, l], i) => (
        <g key={l}>
          <rect x={540} y={80 + i * 26} width={14} height={14} fill={c} />
          <T x={560} y={92 + i * 26} anchor="start" size={10.5}>{l}</T>
        </g>
      ))}
    </svg>
  );
}

export function FourMoves() {
  const cards: [string, string, string, Tone][] = [
    ["WRITE", "Save it outside the window", "notes file · scratchpad · memory store", "green"],
    ["SELECT", "Pull in only what is needed now", "search on demand · skills · tool search", "blue"],
    ["COMPRESS", "Shrink what is already inside", "summarise history · drop old tool output", "yellow"],
    ["ISOLATE", "Do noisy work in another window", "subagents · separate contexts", "purple"],
  ];
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="Context engineering has four moves: write information outside the window, select only what is needed, compress what is already inside, and isolate noisy work in a separate window.">
      {cards.map(([t, a, b, tone], i) => {
        const x = 10 + (i % 2) * 340;
        const y = 10 + Math.floor(i / 2) * 128;
        return (
          <g key={t}>
            <Panel x={x} y={y} w={320} h={116} tone={tone} />
            <T x={x + 18} y={y + 34} anchor="start" size={16} color="#1c1c1c" bold>{t}</T>
            <T x={x + 18} y={y + 64} anchor="start" size={11.5} color="#1c1c1c">{a}</T>
            <T x={x + 18} y={y + 90} anchor="start" size={10.5} color="#5b6b82">{b}</T>
          </g>
        );
      })}
    </svg>
  );
}

/* ───────────── 4. multi-agent ───────────── */

export function SubagentIsolation() {
  const noise = ["read 12 files", "grep results", "dead ends", "more searching"];
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="A worker is another agent loop in its own window. The caller sends a brief; the worker does the noisy reading in its own window; only a short report returns, so the caller's window stays small.">
      <Panel x={10} y={10} w={250} h={250} tone="blue" />
      <T x={135} y={32} size={12} color="#1c1c1c" bold>Caller's window</T>
      <Box x={30} y={48} w={210} h={36} kind="muted" label="user task" size={10.5} />
      <Box x={30} y={106} w={210} h={44} kind="primary" label="call: runWorker(brief)" sub="a function call or a tool call" size={10.5} />
      <Box x={30} y={196} w={210} h={44} kind="ok" label="result: a short report" sub="small" size={10.5} />
      <Panel x={330} y={10} w={340} h={250} tone="purple" dashed />
      <T x={500} y={32} size={12} color="#1c1c1c" bold>Worker window (its own loop)</T>
      {noise.map((l, i) => (
        <Box key={l} x={354} y={48 + i * 38} w={292} h={30} kind="muted" label={l} size={10.5} />
      ))}
      <Box x={354} y={206} w={292} h={34} kind="ok" label="final answer: the report" size={10.5} />
      <Arrow d="M242,128 L328,128" />
      <T x={285} y={120} size={9.5}>brief</T>
      <Arrow d="M328,218 L242,218" ink="green" />
      <T x={285} y={236} size={9.5}>report only</T>
    </svg>
  );
}

export function AgentContract() {
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="The contract between agents: the brief going in must state the goal, limits and output format; the report coming back should be short, cite its sources, and say what it could not find. Anything left out of the report is lost.">
      <Box x={10} y={20} w={190} h={78} label="Brief (in)" sub="goal · limits · output format" size={12.5} />
      <Arrow d="M202,59 L248,59" />
      <Box x={250} y={20} w={170} h={78} kind="primary" label="Worker" sub="its own window" size={12.5} />
      <Arrow d="M422,59 L468,59" ink="green" />
      <Box x={470} y={20} w={200} h={78} kind="ok" label="Report (out)" sub="short · sources · gaps" size={12.5} />
      <T x={340} y={134} size={11} color="#c0392b" bold>Anything not in the report is gone for the parent</T>
      <T x={340} y={158} size={10.5} color="#33415c">So ask for source references and "what you could not find", not only prose</T>
    </svg>
  );
}

export function AgentChannels() {
  const seq = ["Lead → Worker A: brief", "Worker A → Lead: report (a tool result)", "Lead → Worker B: brief + A's key facts"];
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Sharing state between agents. Sequential: a worker's report comes back to the lead as a tool result, and the lead copies what matters into the next brief. Parallel: workers write findings into a shared file, each in its own section, and the lead reads the file when they are done. A whole window is never shared.">
      <Panel x={10} y={10} w={325} h={200} tone="blue" />
      <T x={172} y={34} size={12} color="#1c1c1c" bold>Sequential: through the lead</T>
      {seq.map((l, i) => (
        <g key={l}>
          <Box x={26} y={50 + i * 50} w={292} h={34} kind={i === 1 ? "ok" : "service"} label={l} size={10.5} />
          {i < 2 && <Arrow d={`M172,${86 + i * 50} L172,${98 + i * 50}`} />}
        </g>
      ))}
      <T x={172} y={198} size={10.5} color="#2e5fa8" bold>the lead decides what to pass on</T>

      <Panel x={345} y={10} w={325} h={200} tone="yellow" />
      <T x={507} y={34} size={12} color="#1c1c1c" bold>Parallel: a shared file</T>
      {["Worker: engineering", "Worker: support", "Worker: finance"].map((l, i) => (
        <g key={l}>
          <Box x={358} y={50 + i * 44} w={140} h={32} label={l} size={10} />
          <Arrow d={`M500,${66 + i * 44} L534,96`} ink="purple" />
        </g>
      ))}
      <Box x={536} y={66} w={122} h={60} kind="broker" label="findings.md" sub="one section each" size={11} />
      <T x={597} y={150} size={10} color="#33415c">lead reads it</T>
      <T x={597} y={164} size={10} color="#33415c">when all are done</T>
      <T x={507} y={198} size={10.5} color="#9a7400" bold>no worker waits for another</T>
      <T x={340} y={238} size={11} color="#1c1c1c" bold>Share a report or a file between agents, never a whole window</T>
    </svg>
  );
}

export function Topologies() {
  const Cell = ({ x, y, title, children }: { x: number; y: number; title: string; children: ReactNode }) => (
    <g transform={`translate(${x},${y})`}>
      <Panel x={0} y={0} w={325} h={170} tone="gray" />
      <T x={162} y={22} size={12} color="#1c1c1c" bold>{title}</T>
      {children}
    </g>
  );
  return (
    <svg viewBox="0 0 680 360" role="img" aria-label="Four multi-agent shapes: a supervisor with workers, a hierarchy with managers, a handoff chain where one agent is active at a time, and a peer network where agents talk freely, which is only named here.">
      <Cell x={10} y={8} title="Supervisor">
        <Box x={112} y={38} w={100} h={30} kind="primary" label="Supervisor" size={10.5} />
        {[22, 122, 222].map((x) => (
          <g key={x}>
            <Box x={x} y={116} w={80} h={30} label="Worker" size={10.5} />
            <Arrow d={`M162,70 L${x + 40},114`} />
          </g>
        ))}
      </Cell>
      <Cell x={345} y={8} title="Hierarchical">
        <Box x={132} y={34} w={60} h={26} kind="primary" label="Lead" size={10} />
        {[44, 220].map((x) => (
          <g key={x}>
            <Box x={x} y={78} w={60} h={26} kind="warn" label="Manager" size={9.5} />
            <Arrow d={`M162,62 L${x + 30},76`} />
            <Box x={x - 30} y={128} w={52} h={26} label="Worker" size={9.5} />
            <Box x={x + 38} y={128} w={52} h={26} label="Worker" size={9.5} />
            <Arrow d={`M${x + 24},106 L${x - 4},126`} />
            <Arrow d={`M${x + 36},106 L${x + 64},126`} />
          </g>
        ))}
      </Cell>
      <Cell x={10} y={186} title="Handoff">
        {["Triage", "Billing", "Refunds"].map((l, i) => (
          <g key={l}>
            <Box x={20 + i * 102} y={72} w={84} h={36} kind={i === 0 ? "primary" : "service"} label={l} size={10.5} />
            {i < 2 && <Arrow d={`M${106 + i * 102},90 L${120 + i * 102},90`} />}
          </g>
        ))}
        <T x={162} y={136} size={10}>one agent active at a time,</T>
        <T x={162} y={150} size={10}>the conversation moves with it</T>
      </Cell>
      <Cell x={345} y={186} title="Peer network (named only)">
        {[[80, 62], [245, 62], [80, 128], [245, 128]].map(([cx, cy]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={17} fill="#f3eefc" stroke="#8e5fd6" strokeWidth={1.5} />
        ))}
        <path d="M97,62 L228,62 M97,128 L228,128 M80,79 L80,111 M245,79 L245,111 M94,74 L231,116 M231,74 L94,116" stroke="#8e5fd6" strokeWidth={1.2} strokeDasharray="3,3" fill="none" />
        <T x={162} y={44} size={9.5}>anyone talks to anyone</T>
        <T x={162} y={158} size={10}>hard to control and to trace</T>
      </Cell>
    </svg>
  );
}

/* ───────────── 5. long-running + memory ───────────── */

export function CheckpointLoop() {
  return (
    <svg viewBox="0 0 680 230" role="img" aria-label="After every step the run saves its state to a store. After a crash it loads the latest saved state and continues. Steps must be safe to repeat, so a resumed step does not, for example, refund twice.">
      {[1, 2, 3, 4].map((n, i) => (
        <g key={n}>
          <Box x={10 + i * 170} y={20} w={130} h={42} label={`Step ${n}`} size={11.5} />
          {i < 3 && <Arrow d={`M${142 + i * 170},41 L${178 + i * 170},41`} />}
          <Arrow d={`M${75 + i * 170},64 L${75 + i * 170},114`} ink="purple" />
        </g>
      ))}
      <T x={86} y={96} anchor="start" size={9.5} color="#6a3fb5">save state</T>
      <Box x={10} y={116} w={660} h={42} kind="broker" label="State store" sub="database or file: one saved state per step" size={12} />
      <Arrow d="M405,158 L405,176 L630,176 L630,64" ink="green" dashed />
      <T x={300} y={196} size={10.5} color="#2e7d32" bold>after a crash: load the latest state, continue</T>
      <T x={340} y={218} size={10.5} color="#c0392b" bold>every step must be safe to repeat (never refund twice)</T>
    </svg>
  );
}

export function ApprovalPause() {
  const steps: [string, "service" | "broker" | "warn" | "ok"][] = [
    ["Draft reply", "service"],
    ["Save state, stop", "broker"],
    ["Human decides", "warn"],
    ["Load state", "broker"],
    ["Send", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="A human approval is a pause, not a wait: the run saves its state and stops, the process can exit, and when the human decides, the run loads the state and continues, even days later.">
      {steps.map(([l, k], i) => (
        <g key={l}>
          <Box x={10 + i * 136} y={40} w={112} h={46} kind={k} label={l} size={10.5} />
          {i < 4 && <Arrow d={`M${124 + i * 136},63 L${144 + i * 136},63`} />}
        </g>
      ))}
      <T x={216} y={112} size={10} color="#6a3fb5">the process can exit here</T>
      <T x={352} y={132} size={10} color="#c0702a">minutes, hours, days later</T>
      <T x={340} y={172} size={11} color="#1c1c1c" bold>The run does not wait in memory. It waits in storage.</T>
    </svg>
  );
}

export function StopConditions() {
  const cards: [string, string, string][] = [
    ["Turn cap", "max 10 loops", "stops endless loops"],
    ["Token budget", "stop at 50k tokens", "stops runaway cost"],
    ["Timeout", "stop after 2 minutes", "stops hanging calls"],
    ["Repeat check", "same call twice = stop", "stops going in circles"],
  ];
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="Four stop conditions bound a run: a turn cap, a token budget, a timeout, and a repeated-call check. Whichever hits first ends the run and reports why.">
      {cards.map(([t, a, b], i) => (
        <g key={t}>
          <Panel x={10 + i * 166} y={10} w={158} h={110} tone="orange" />
          <T x={89 + i * 166} y={38} size={12.5} color="#1c1c1c" bold>{t}</T>
          <T x={89 + i * 166} y={66} size={10.5} color="#33415c">{a}</T>
          <T x={89 + i * 166} y={96} size={10} color="#c0702a" bold>{b}</T>
        </g>
      ))}
      <T x={340} y={156} size={11} color="#1c1c1c" bold>Whichever hits first ends the run, and the run reports why</T>
    </svg>
  );
}

export function MemoryTypes() {
  return (
    <svg viewBox="0 0 680 330" role="img" aria-label="Both kinds of memory are stored in a database; they differ in scope. Short-term memory is one conversation, keyed by thread id, and its whole history is sent back every turn until the conversation ends. Long-term memory is one user across all conversations, keyed by user id, and only a few selected facts are put into the prompt. Memory must be able to forget: stale, conflicting, or privacy-deleted entries.">
      <CardAt x={10} w={325} h={150} spec={{ tone: "blue", title: "Short-term memory", lines: ["One conversation (key: thread id)", "The whole history goes in, every turn", "Ends when the conversation ends"] }} />
      <CardAt x={345} w={325} h={150} spec={{ tone: "purple", title: "Long-term memory", lines: ["One user, every chat (key: user id)", "Only a few selected facts go in", "Kept until it expires or is deleted"] }} />
      <T x={340} y={192} size={11.5} color="#1c1c1c" bold>Memory needs a way to forget</T>
      {[
        ["Stale", "the address changed"],
        ["Conflicting", "two versions of a fact"],
        ["Must delete", "a privacy request"],
      ].map(([a, b], i) => (
        <Box key={a} x={10 + i * 224} y={208} w={212} h={50} kind="warn" label={a} sub={b} size={12} />
      ))}
      <T x={340} y={290} size={10.5} color="#33415c">Give each memory a source and a date, so it can be checked, expired or deleted</T>
    </svg>
  );
}

/* ───────────── 6. recap ───────────── */

export function IncidentBrief() {
  const w = ["Worker: engineering", "Worker: support", "Worker: finance"];
  return (
    <svg viewBox="0 0 680 350" role="img" aria-label="One request using every idea: a router picks the path, an orchestrator splits the job, three workers read their own part in separate windows, an evaluator checks the combined brief, a human approves, and only then is it sent. Shared state is saved after every step and every step is traced.">
      <Box x={10} y={14} w={100} h={42} kind="muted" label="Dana's email" size={10.5} />
      <Arrow d="M112,35 L140,35" />
      <Box x={142} y={14} w={110} h={42} kind="primary" label="Router" sub="picks the path" size={11} />
      <Arrow d="M254,35 L292,35" />
      <Box x={294} y={14} w={140} h={42} kind="primary" label="Orchestrator" sub="splits the job" size={11} />
      {w.map((l, i) => (
        <g key={l}>
          <Box x={30 + i * 220} y={110} w={180} h={44} label={l} sub="own window" size={10.5} />
          <Arrow d={`M364,58 L${120 + i * 220},108`} />
          <Arrow d={`M${120 + i * 220},156 L${i === 1 ? 340 : i === 0 ? 300 : 380},198`} ink="green" />
        </g>
      ))}
      <Box x={250} y={200} w={180} h={42} kind="primary" label="Evaluator" sub="checks the brief" size={11} />
      <Arrow d="M432,221 L468,221" />
      <Box x={470} y={200} w={120} h={42} kind="warn" label="Human approval" sub="pause + resume" size={10.5} />
      <Arrow d="M592,221 L618,221" ink="green" />
      <Box x={620} y={200} w={50} h={42} kind="ok" label="Send" size={10.5} />
      <T x={340} y={262} size={9.5} color="#c0702a" bold>evaluator fails the brief: revise (max 2 rounds)</T>
      <Box x={10} y={284} w={660} h={50} kind="broker" label="Shared state, saved after every step" sub="turn + token caps · every step traced · safe to resume" size={11.5} />
    </svg>
  );
}
