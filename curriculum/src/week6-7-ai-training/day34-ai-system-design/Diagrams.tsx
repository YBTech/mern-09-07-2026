// Diagrams for Notes.tsx: a two-week review of building with AI. One component per picture, kept generic and simple.
// Arrowheads come from the <ArrowDefs /> in Notes.tsx. The design-steps and autonomy-ladder pictures are shared with the lecture page.
// Colors: orange = a guardrail, purple = a model, blue = plain code or data, yellow = a human, green = the result.
import { Arrow, Box, T } from "../../components/Diagram";
import type { ReactNode } from "react";

export { AutonomyLadder, DesignSteps } from "./lecture/CaseDiagrams";

const GREEN = "#3d8b40";

// A rounded panel for side-by-side comparisons
function Panel({ x, y, w, h, color, fill, children }: { x: number; y: number; w: number; h: number; color: string; fill: string; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={fill} stroke={color} strokeWidth={1.5} />
      {children}
    </g>
  );
}

/* 1. the whole system */
export function SystemMap() {
  return (
    <svg viewBox="0 0 680 272" role="img" aria-label="A complete AI application. A user message passes an input guard, then a router or agent decides what to do, using a model with tools, retrieval and memory. The answer passes an output guard and returns to the user. Tracing records every step, and evals test the whole thing before it ships and monitoring watches it after.">
      <rect x={6} y={8} width={668} height={26} rx={6} fill="#f5f5f5" stroke="#bbbbbb" strokeDasharray="5,4" />
      <T x={340} y={25} size={11} color="#1c1c1c" bold>Tracing: record every step, model call and tool call</T>

      <Box x={6} y={56} w={70} h={56} kind="service" label="User" size={12} />
      <Arrow d="M78,84 L90,84" />
      <Box x={92} y={56} w={92} h={56} kind="warn" label="Input guard" size={11} />
      <Arrow d="M186,84 L198,84" />
      <Box x={200} y={56} w={104} h={56} kind="broker" label="Router / agent" sub="decides the path" size={11} />
      <Arrow d="M306,84 L318,84" />
      <Box x={320} y={56} w={90} h={56} kind="broker" label="Model" size={12} />
      <Arrow d="M412,84 L424,84" />
      <Box x={426} y={56} w={100} h={56} kind="warn" label="Output guard" size={11} />
      <Arrow d="M528,84 L540,84" />
      <Box x={542} y={56} w={80} h={56} kind="ok" label="Reply" size={12} />

      <Box x={200} y={146} w={96} h={46} kind="service" label="Tools" sub="act on the world" size={11} />
      <Box x={308} y={146} w={96} h={46} kind="service" label="Retrieval" sub="your documents" size={11} />
      <Box x={416} y={146} w={96} h={46} kind="service" label="Memory" sub="state, history" size={11} />
      <Arrow d="M248,146 L252,114" />
      <Arrow d="M356,146 L360,114" />
      <Arrow d="M464,146 L380,114" />

      <rect x={6} y={212} width={668} height={26} rx={6} fill="#eef8ee" stroke="#7dbb7d" strokeDasharray="5,4" />
      <T x={340} y={229} size={11} color="#1c1c1c" bold>Evals before you ship · monitoring after you ship</T>
      <T x={340} y={260} size={9.5}>orange = guard · purple = model · blue = code or data</T>
    </svg>
  );
}

/* 2. one model call */
export function OneCall() {
  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="One model call. The request carries the system prompt, the whole conversation and the new question. The model returns a reply and a usage count. The model is stateless, so the app resends the history each time. Input and output tokens set the price and fill the context window.">
      <Box x={10} y={14} w={230} h={64} kind="service" label="Request" sub="system prompt + whole conversation + question" size={12} />
      <Arrow d="M242,46 L270,46" />
      <Box x={272} y={14} w={130} h={64} kind="broker" label="Model" sub="stateless" size={13} />
      <Arrow d="M404,46 L432,46" />
      <Box x={434} y={14} w={236} h={64} kind="ok" label="Reply + usage" sub="text, or a tool request, plus token counts" size={12} />
      <T x={340} y={106} size={11} color="#1c1c1c" bold>The app resends the history every call. Tokens in and out set the price and fill the window.</T>
      <T x={340} y={126} size={10.5}>Ask for structured output (a schema) and validate it like user input.</T>
    </svg>
  );
}

/* 3. prompt layers */
export function PromptLayers() {
  const rows: [string, string, string, "primary" | "service" | "ok"][] = [
    ["You write once", "system", "role, rules, output format", "primary"],
    ["Your app adds", "earlier messages / examples", "history, or a few worked examples", "service"],
    ["Your app + the user", "latest message", "data you pasted in, then the question", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="A prompt has three layers: the system prompt you write once, earlier messages or examples your app adds, and the latest message that holds data and the user's question.">
      {rows.map(([who, label, sub, kind], i) => (
        <g key={label}>
          <T x={10} y={42 + i * 56} anchor="start" size={11} color="#1c1c1c" bold>{who}</T>
          <Box x={170} y={16 + i * 56} w={500} h={46} kind={kind} label={label} sub={sub} size={12} />
        </g>
      ))}
    </svg>
  );
}

/* 4. tools and the loop */
export function ToolLoop() {
  const steps: [string, string, "broker" | "service" | "ok"][] = [
    ["1 Model asks", "names a tool + arguments", "broker"],
    ["2 Your code runs it", "and checks permission", "service"],
    ["3 Result goes back", "as a message", "service"],
    ["4 Model answers", "or asks again", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 160" role="img" aria-label="The tool loop. The model asks for a tool, your code runs it and checks permission, the result goes back as a message, and the model either answers or asks again. Repeat up to a turn cap. The model never runs anything itself.">
      {steps.map(([t, s, k], i) => (
        <g key={t}>
          <Box x={10 + i * 168} y={14} w={150} h={54} kind={k} label={t} sub={s} size={11.5} />
          {i < 3 && <Arrow d={`M${162 + i * 168},41 L${176 + i * 168},41`} />}
        </g>
      ))}
      <path d="M590,70 L590,100 L85,100 L85,72" fill="none" stroke="#8e5fd6" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#dg-purple)" />
      <T x={340} y={94} size={10}>repeat, up to a turn cap</T>
      <T x={340} y={132} size={11} color="#1c1c1c" bold>The model only asks. Your code runs the tool and decides what is allowed.</T>
      <T x={340} y={150} size={10}>MCP is one standard plug, so a tool written once works in every app.</T>
    </svg>
  );
}

/* 5. RAG */
export function RagLanes() {
  const ingest = ["Documents", "Chunk", "Embed", "Vector DB"];
  const answer = ["Question", "Filtered search", "Top chunks", "Model answers"];
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="RAG has two lanes. The ingest lane runs offline: documents are chunked, embedded and stored in a vector database with their access groups. The answer lane: the question runs a search filtered by what this user may see, the top chunks go into the prompt, and the model answers with sources.">
      <T x={10} y={16} anchor="start" size={11} color="#2e5fa8" bold>Ingest (offline)</T>
      {ingest.map((l, i) => (
        <g key={l}>
          <Box x={10 + i * 168} y={24} w={146} h={44} kind={i === 3 ? "ok" : "service"} label={l} sub={i === 3 ? "with access groups" : ""} size={11.5} />
          {i < 3 && <Arrow d={`M${158 + i * 168},46 L${176 + i * 168},46`} />}
        </g>
      ))}
      <Arrow d="M586,70 L246,116" dashed />
      <T x={10} y={106} anchor="start" size={11} color="#2e5fa8" bold>Answer</T>
      {answer.map((l, i) => (
        <g key={l}>
          <Box x={10 + i * 168} y={116} w={146} h={44} kind={i === 3 ? "broker" : "service"} label={l} sub={i === 1 ? "by permission" : ""} size={11.5} />
          {i < 3 && <Arrow d={`M${158 + i * 168},138 L${176 + i * 168},138`} />}
        </g>
      ))}
      <T x={340} y={188} size={11} color="#1c1c1c" bold>The model answers from what was retrieved. Filter by permission inside the search.</T>
    </svg>
  );
}

/* 6. workflows and agents */
export function WhoDecides() {
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="Workflow versus agent. In a workflow your code decides the path: fixed steps, predictable and cheap. In an agent the model decides the next step in a loop: flexible but costlier and harder to debug. Long runs fill the context window, so write notes outside it, select only what is needed, compress history, and isolate noisy work in subagents.">
      <Panel x={6} y={8} w={326} h={124} color="#7ea6e0" fill="#eef3ff">
        <T x={20} y={30} anchor="start" size={12.5} color="#1c1c1c" bold>Workflow: your code decides</T>
        <Box x={20} y={46} w={84} h={36} kind="service" label="Step A" size={11} />
        <Arrow d="M106,64 L120,64" />
        <Box x={122} y={46} w={84} h={36} kind="service" label="Step B" size={11} />
        <Arrow d="M208,64 L222,64" />
        <Box x={224} y={46} w={84} h={36} kind="service" label="Step C" size={11} />
        <T x={169} y={106} size={10.5}>fixed path · predictable · cheap · easy to test</T>
      </Panel>
      <Panel x={348} y={8} w={326} h={124} color="#8e5fd6" fill="#f3eefc">
        <T x={362} y={30} anchor="start" size={12.5} color="#1c1c1c" bold>Agent: the model decides</T>
        <Box x={362} y={46} w={100} h={36} kind="broker" label="Think" size={11} />
        <Arrow d="M464,64 L482,64" />
        <Box x={484} y={46} w={100} h={36} kind="service" label="Act (tool)" size={11} />
        <path d="M534,84 L534,96 L412,96 L412,84" fill="none" stroke="#8e5fd6" strokeWidth="1.5" markerEnd="url(#dg-purple)" />
        <T x={511} y={118} size={10.5}>flexible · costlier · harder to debug</T>
      </Panel>
      <T x={340} y={156} size={11} color="#1c1c1c" bold>A long run fills the context window. Four moves keep it healthy:</T>
      {["write", "select", "compress", "isolate"].map((m, i) => (
        <Box key={m} x={90 + i * 128} y={166} w={112} h={34} kind="ok" label={m} size={12} />
      ))}
    </svg>
  );
}

/* 7. the framework stack */
export function FrameworkStack() {
  const layers: [string, string, "ok" | "service" | "broker"][] = [
    ["LangSmith", "see every run, test it, compare versions", "ok"],
    ["LangGraph", "run the graph: state, checkpoints, pauses for a human", "service"],
    ["LangChain", "the parts: one model interface, tools, retrievers, a ready-made agent", "broker"],
  ];
  return (
    <svg viewBox="0 0 680 168" role="img" aria-label="The framework stack: LangChain provides the parts, LangGraph runs a graph of steps with saved state, checkpoints and human pauses, and LangSmith shows every run and tests it. A ready-made agent in LangChain is itself a LangGraph graph.">
      {layers.map(([name, what, kind], i) => (
        <g key={name}>
          <Box x={10} y={10 + i * 50} w={140} h={42} kind={kind} label={name} size={12.5} />
          <T x={168} y={36 + i * 50} anchor="start" size={11} color="#33415c">{what}</T>
        </g>
      ))}
      <T x={340} y={162} size={10.5}>A ready-made agent is itself a graph, so the layers mix freely.</T>
    </svg>
  );
}

/* 8. the quality loop */
export function QualityLoop() {
  const steps: [string, string, "service" | "broker" | "ok" | "fail"][] = [
    ["Change", "prompt, model, tools", "service"],
    ["Offline eval", "run the test set", "broker"],
    ["Ship gradually", "canary, then all", "ok"],
    ["Observe", "traces, metrics, feedback", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 168" role="img" aria-label="The quality loop. Change the prompt, model or tools, run the offline eval, ship gradually, observe production with traces, metrics and feedback, and turn every bad case into a new test. Graders go from cheap code checks to model judges to humans.">
      {steps.map(([t, s, k], i) => (
        <g key={t}>
          <Box x={10 + i * 168} y={14} w={146} h={54} kind={k} label={t} sub={s} size={12} />
          {i < 3 && <Arrow d={`M${158 + i * 168},41 L${176 + i * 168},41`} />}
        </g>
      ))}
      <path d="M580,70 L580,98 L96,98 L96,70" fill="none" stroke="#c0392b" strokeWidth="1.5" markerEnd="url(#dg-red)" />
      <T x={340} y={92} size={10.5} color="#c0392b" bold>every bad case becomes a new test</T>
      <T x={340} y={128} size={11} color="#1c1c1c" bold>Graders, cheapest first: code check → yes/no model → LLM judge → human</T>
      <T x={340} y={148} size={10.5}>A trace is the tree of steps behind one answer. Open it to find the step that went wrong.</T>
    </svg>
  );
}

/* 9a. the three doors and their guards */
export function ThreeDoors() {
  const doors: [string, string, string][] = [
    ["User's message", "Input guard", "keywords, then intent judge"],
    ["Retrieved content", "Screen", "drop what carries instructions"],
    ["Tool / MCP result", "Screen", "treat it as data, not orders"],
  ];
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="Injected text can enter three ways: the user's message, retrieved content, or a tool or MCP result. The user's message passes an input guard; retrieved content and tool results each need their own screen, because they skip the input guard. The model's reply then passes an output guard written in code.">
      {doors.map(([src, guard, what], i) => (
        <g key={src}>
          <Box x={6} y={8 + i * 60} w={130} h={46} kind="service" label={src} size={11} />
          <Arrow d={`M138,${31 + i * 60} L152,${31 + i * 60}`} />
          <Box x={154} y={8 + i * 60} w={150} h={46} kind="warn" label={guard} sub={what} size={11} />
          <Arrow d={`M306,${31 + i * 60} L346,96`} />
        </g>
      ))}
      <Box x={348} y={68} w={88} h={56} kind="broker" label="Model" size={12} />
      <Arrow d="M438,96 L462,96" />
      <Box x={464} y={68} w={110} h={56} kind="warn" label="Output guard" sub="code, always holds" size={11} />
      <Arrow d="M576,96 L590,96" />
      <Box x={592} y={68} w={82} h={56} kind="ok" label="Reply" size={12} />
      <T x={340} y={192} size={10.5} color="#1c1c1c" bold>Model checks lower the odds. Code checks hold every time. Let code decide what is allowed.</T>
    </svg>
  );
}

/* 9b. cheap and fast */
export function CostSpeed() {
  const levers: [string, string, string][] = [
    ["Cache", "stable prefix first", "repeat input ~10% price"],
    ["Batch", "work nobody waits for", "half price, results later"],
    ["Route", "small model first", "escalate only when needed"],
    ["Stream", "first token fast", "feels fast, cuts waiting"],
  ];
  return (
    <svg viewBox="0 0 680 128" role="img" aria-label="Four levers for cost and speed: cache the stable start of the prompt so repeated input costs about a tenth, batch work nobody waits for at half price, route to a small model first and escalate only when needed, and stream the reply so the first token appears quickly.">
      {levers.map(([name, what, gain], i) => (
        <g key={name}>
          <Box x={10 + i * 168} y={10} w={150} h={70} kind={i < 3 ? "ok" : "service"} label={name} sub={what} size={13} />
          <T x={85 + i * 168} y={98} size={10} color={GREEN} bold>{gain}</T>
        </g>
      ))}
      <T x={340} y={120} size={10} color="#1c1c1c">Measure first: the biggest saving is usually not paying for the same input twice.</T>
    </svg>
  );
}
