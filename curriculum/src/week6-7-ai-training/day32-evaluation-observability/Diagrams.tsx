// Diagrams for Notes.tsx (evaluation, observability and tracing for AI apps).
// One component per picture; arrowheads come from the <ArrowDefs /> in Notes.tsx.
// Examples use a pizza shop's order bot, so no picture needs to explain its domain.
import type { ReactNode } from "react";
import { Arrow, Box, T } from "../../components/Diagram";
import type { Kind } from "../../components/Diagram";

const BLUE = "#3b6fd6";
const PURPLE = "#8e5fd6";
const ORANGE = "#e08a3c";
const RED = "#c0392b";
const GREEN = "#3d8b40";

// Two columns of "this → that" rows, with column headings
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

// A card with a title and a few short lines, for side-by-side comparisons
function Card({ x, w, h, title, color, fill, lines }: { x: number; w: number; h: number; title: string; color: string; fill: string; lines: string[] }) {
  return (
    <g>
      <rect x={x} y={10} width={w} height={h} rx={8} fill={fill} stroke={color} strokeWidth={1.5} />
      <T x={x + 16} y={36} anchor="start" size={13} color="#1c1c1c" bold>{title}</T>
      {lines.map((l, i) => (
        <T key={l} x={x + 16} y={62 + i * 24} anchor="start" size={11} color="#33415c">{`• ${l}`}</T>
      ))}
    </g>
  );
}

/* ───────────── 1. why AI is different ───────────── */

export function TwoWorlds() {
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="Traditional software gives the same output for the same input, fails loudly with an error, and is tested with exact assertions that pass or fail. An AI app gives different wording each run, fails quietly with a fluent wrong answer and a 200 OK, and is evaluated by scoring many cases against criteria.">
      <Card
        x={10} w={322} h={150} title="Traditional software" color="#7ea6e0" fill="#eef3ff"
        lines={["Same input → same output", "A bug throws an error or a 500", "Test: expect(actual).toBe(expected)", "Result: pass or fail"]}
      />
      <Card
        x={348} w={322} h={150} title="An AI app" color="#8e5fd6" fill="#f3eefc"
        lines={["Same input → different wording", "A bug is a fluent wrong answer, 200 OK", "Eval: score the answer against criteria", "Result: a score over many cases, 46 / 50"]}
      />
      <T x={340} y={186} size={11.5} color="#1c1c1c" bold>You can't assert-equal a paragraph, so you score it, over many cases.</T>
    </svg>
  );
}

export function QualityLoop() {
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="The quality loop. Change the prompt, model or tools; run the eval suite offline; ship gradually; observe production with traces, metrics and user feedback; turn bad cases into new eval tasks; and repeat. Evaluation happens before shipping, observability after.">
      <rect x={10} y={10} width={384} height={110} rx={8} fill="#fffaf0" stroke="#e8b400" strokeDasharray="5,4" />
      <T x={22} y={28} anchor="start" size={11} color="#a07800" bold>Before you ship: EVALUATE</T>
      <rect x={462} y={10} width={208} height={204} rx={8} fill="#f4fbf4" stroke="#7dbb7d" strokeDasharray="5,4" />
      <T x={474} y={28} anchor="start" size={11} color={GREEN} bold>After you ship: OBSERVE</T>

      <Box x={24} y={44} w={150} h={60} kind="service" label="1. Change" sub="prompt, model, tools" size={12} />
      <Arrow d="M176,74 L206,74" />
      <Box x={208} y={44} w={170} h={60} kind="primary" label="2. Offline eval" sub="run the eval suite" size={12} />
      <Arrow d="M380,74 L478,74" />
      <T x={428} y={66} size={9.5}>pass?</T>
      <Box x={480} y={44} w={170} h={60} kind="ok" label="3. Ship gradually" sub="canary, then everyone" size={12} />
      <Arrow d="M565,106 L565,140" />
      <Box x={480} y={142} w={170} h={60} kind="ok" label="4. Observe" sub="traces, metrics, thumbs-down" size={12} />
      <Arrow d="M478,172 L332,172" ink="red" />
      <Box x={150} y={142} w={180} h={60} kind="fail" label="5. Bad cases" sub="become new eval tasks" size={12} />
      <Arrow d="M150,172 L99,172 L99,108" ink="red" />
      <T x={340} y={240} size={11} color="#1c1c1c" bold>Every production failure becomes a test, so the same bug can't come back silently.</T>
    </svg>
  );
}

/* ───────────── 2. evaluation ───────────── */

export function EvalAnatomy() {
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="The parts of an eval. A task has an input and success criteria. The agent runs it, producing a transcript (replies and tool calls) and an outcome (the final state, such as the cart or whether a card was charged). Graders check the transcript and the outcome and give pass or fail. A suite is many tasks, scored together, such as 4 out of 6.">
      <Box x={10} y={50} w={130} h={56} kind="primary" label="Task" sub="input + success criteria" size={13} />
      <Arrow d="M142,78 L170,78" />
      <Box x={172} y={50} w={100} h={56} kind="broker" label="Agent" sub="runs the task" size={13} />
      <Arrow d="M274,70 L304,40" />
      <Arrow d="M274,86 L304,116" />
      <Box x={306} y={12} w={160} h={52} kind="service" label="Transcript" sub="replies, tool calls" size={12} />
      <Box x={306} y={92} w={160} h={52} kind="service" label="Outcome" sub="final state: cart, card charged?" size={12} />
      <Arrow d="M468,40 L492,70" />
      <Arrow d="M468,116 L492,86" />
      <Box x={494} y={50} w={122} h={56} kind="ok" label="Graders" sub="code · model · human" size={12} />
      <Arrow d="M618,78 L628,78" />
      <Box x={630} y={56} w={44} h={44} kind="ok" label="✅❌" size={11} />
      <T x={340} y={180} size={11} color="#1c1c1c" bold>An eval suite is many tasks graded together: “agent v1 passed 4 / 6”.</T>
    </svg>
  );
}

export function CodeCheckGrid() {
  const cards: [string, string, string, boolean][] = [
    ["Outcome / business rule", "no charge without a confirmation", "total matches the prices in code", true],
    ["Pattern match", "no phone number (a regex)", "no code block in the reply", true],
    ["Tool call + arguments", "called add_to_cart", "with pepperoni, large, 2", true],
    ["Schema", "the output parses as { intent }", "valid JSON with the required keys", true],
    ["Static analysis", "lint and type-check generated code", "run the tests on it", false],
  ];
  return (
    <svg viewBox="0 0 680 236" role="img" aria-label="Five kinds of code check. Outcome or business rule, such as no charge without a confirmation. Pattern match, such as no phone number. Tool call and arguments, such as add_to_cart with pepperoni, large, 2. Schema, such as the output parses as the expected shape. Static analysis, such as linting and testing generated code, which matters for coding agents. The first four are used in the pizza bot's evals.">
      {cards.map(([title, a, b, ours], i) => {
        const x = 10 + (i % 3) * 223;
        const y = 10 + Math.floor(i / 3) * 112;
        return (
          <g key={title}>
            <Box x={x} y={y} w={213} h={100} kind={ours ? "ok" : "muted"} label="" />
            <T x={x + 12} y={y + 24} anchor="start" size={12} color="#1c1c1c" bold>{title}</T>
            <T x={x + 12} y={y + 50} anchor="start" size={10.5} color="#33415c">{`• ${a}`}</T>
            <T x={x + 12} y={y + 70} anchor="start" size={10.5} color="#33415c">{`• ${b}`}</T>
            <T x={x + 12} y={y + 90} anchor="start" size={9} color={ours ? GREEN : "#888"}>{ours ? "in the pizza bot's evals" : "for coding agents"}</T>
          </g>
        );
      })}
      <T x={556} y={160} size={10.5} color="#33415c">Fast, free, and the same</T>
      <T x={556} y={176} size={10.5} color="#33415c">answer every time.</T>
    </svg>
  );
}

export function ScorerLadder() {
  const rungs: [string, string, string][] = [
    ["Code evaluator", "outcome, rule, regex, tool call, schema", "free · instant"],
    ["Decision model", "another model answers one YES / NO question", "a model call"],
    ["LLM judge", "another model scores 1–5 against a rubric", "a model call"],
    ["Pairwise judge", "old vs new answer: which is better?", "a model call"],
    ["Human review", "a person labels the answer", "slow · expensive"],
  ];
  const colors: Kind[] = ["ok", "service", "service", "service", "warn"];
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="Five kinds of grader from cheapest to most expensive: a code evaluator, a decision model, an LLM judge, a pairwise judge, and human review. Use the cheapest one that can catch the failure, and move down only for open-ended quality.">
      {rungs.map(([name, what, cost], i) => {
        const y = 10 + i * 48;
        return (
          <g key={name}>
            <Box x={60} y={y} w={150} h={38} kind={colors[i]} label={name} size={12} />
            <T x={226} y={y + 23} anchor="start" size={11} color="#33415c">{what}</T>
            <T x={670} y={y + 23} anchor="end" size={10} color="#5b6b82" bold>{cost}</T>
          </g>
        );
      })}
      <Arrow d="M30,14 L30,244" />
      <T x={40} y={262} anchor="start" size={10} color="#1c1c1c" bold>Use the cheapest grader that can catch the failure; move down only for open-ended quality.</T>
    </svg>
  );
}

export function JudgeFlow() {
  return (
    <svg viewBox="0 0 680 160" role="img" aria-label="An LLM judge takes the question, the app's answer, a rubric and optionally a reference answer, and returns its reasoning and a 1 to 5 score. Ask for the reasoning before the score.">
      <Box x={10} y={10} w={150} h={30} kind="muted" label="question" size={11} />
      <Box x={10} y={46} w={150} h={30} kind="service" label="the app's answer" size={11} />
      <Box x={10} y={82} w={150} h={30} kind="primary" label="rubric" size={11} />
      <Box x={10} y={118} w={150} h={30} kind="muted" dashed label="reference (optional)" size={11} />
      <Arrow d="M162,25 L246,72" />
      <Arrow d="M162,61 L246,76" />
      <Arrow d="M162,97 L246,82" />
      <Arrow d="M162,133 L246,88" dashed />
      <Box x={248} y={46} w={170} h={70} kind="broker" label="Judge model" sub="its own prompt + rubric" size={13} />
      <Arrow d="M420,81 L466,81" />
      <Box x={468} y={40} w={202} h={82} kind="ok" label="" />
      <T x={480} y={62} anchor="start" size={11} color="#1c1c1c" bold>{"{ reasoning: “correct, but"}</T>
      <T x={480} y={80} anchor="start" size={11} color="#1c1c1c" bold>{"  misses the rennet warning”,"}</T>
      <T x={480} y={98} anchor="start" size={11} color="#1c1c1c" bold>{"  score: 3 }"}</T>
      <T x={569} y={140} size={10}>reasoning first, then the score</T>
    </svg>
  );
}

export function JudgeBiases() {
  return (
    <Rows
      head={["A judge's bias", "The fix"]}
      leftKind="warn"
      label="Judge biases and their fixes. Position bias: run both orders and keep only agreements. Length bias: a rubric that rewards correctness, not length. Self-preference: judge with a different model family. A vague rubric: specific pass or fail checks. Unknown accuracy: compare the judge with about 50 human labels."
      rows={[
        ["Position: prefers whichever answer is first", "run both orders, keep only agreements"],
        ["Length: prefers the longer answer", "rubric rewards correct, not long"],
        ["Self-preference: likes its own family", "judge with a different model family"],
        ["Vague rubric: “is it good? 1–10”", "specific pass / fail checks, one per line"],
        ["You don't know if the judge is right", "check it against ~50 human labels"],
      ]}
    />
  );
}

export function WholeVsStep() {
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="Two levels of eval. The whole agent, end to end: a full conversation goes in, and the outcome and transcript are checked; like an end-to-end test, realistic but slower, and it tells you that something broke. One step: one message goes into one node and only that node's output is checked; like a unit test, fast and cheap, and it tells you where it broke.">
      <Card
        x={10} w={322} h={150} title="Whole agent (end to end)" color="#8e5fd6" fill="#f3eefc"
        lines={["A full conversation goes in", "Check the outcome and the transcript", "Like an E2E test: realistic, slower", "Tells you THAT something broke"]}
      />
      <Card
        x={348} w={322} h={150} title="One step (one node)" color="#7ea6e0" fill="#eef3ff"
        lines={["One message goes into one node", "Check only that node's output", "Like a unit test: fast and cheap", "Tells you WHERE it broke"]}
      />
      <T x={340} y={186} size={11.5} color="#1c1c1c" bold>Use both: end-to-end tasks for behavior, node tests for the steps you can split out.</T>
    </svg>
  );
}

export function RagThreeQuestions() {
  const steps: [string, string, string][] = [
    ["1. Is the fact in the documents?", "fix the data: add or update the doc", "context recall"],
    ["2. Did the search retrieve it?", "fix retrieval: chunking, query, top-k", "recall@k"],
    ["3. Did the answer use it faithfully?", "fix generation: the prompt", "faithfulness"],
  ];
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="Diagnosing a wrong RAG answer with three questions in order. Is the fact in the documents? If not, fix the data. Was it retrieved? If not, fix retrieval. Did the answer use it faithfully? If not, fix the prompt or generation. Each question has a metric.">
      <Box x={10} y={10} w={190} h={40} kind="fail" label="A wrong RAG answer" size={12} />
      {steps.map(([q, fix, metric], i) => {
        const y = 66 + i * 50;
        return (
          <g key={q}>
            <Box x={10} y={y} w={250} h={38} kind="service" label={q} size={11} />
            <Arrow d={`M262,${y + 19} L330,${y + 19}`} ink="red" />
            <T x={296} y={y + 13} size={9} color={RED}>no</T>
            <Box x={332} y={y} w={250} h={38} kind="ok" label={fix} size={10.5} />
            <T x={670} y={y + 23} anchor="end" size={9.5} color={PURPLE} bold>{metric}</T>
          </g>
        );
      })}
      <Arrow d="M40,52 L40,64" />
      <Arrow d="M40,106 L40,114" />
      <Arrow d="M40,156 L40,164" />
      <T x={48} y={112} anchor="start" size={9} color={GREEN}>yes</T>
      <T x={48} y={162} anchor="start" size={9} color={GREEN}>yes</T>
    </svg>
  );
}

export function OfflineOnline() {
  const roll: [string, string][] = [
    ["Shadow", "runs hidden"],
    ["Canary", "5% of users"],
    ["A/B test", "compare metrics"],
    ["Everyone", "100%"],
  ];
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="Offline evaluation runs the eval suite before release, compares the new version with the old one, and can block a merge in CI. Online evaluation scores a sample of live traffic and collects user feedback after release. Between them, roll out gradually: shadow, canary, A/B test, then everyone.">
      <Card
        x={10} w={322} h={126} title="Offline eval (before release)" color="#e8b400" fill="#fff7e0"
        lines={["Run the eval suite on v1 and v2", "Compare scores side by side", "A drop blocks the merge in CI"]}
      />
      <Card
        x={348} w={322} h={126} title="Online eval (after release)" color="#7dbb7d" fill="#eef8ee"
        lines={["A judge scores a sample of live traffic", "Users click thumbs up / down", "Catches what the evals missed"]}
      />
      <T x={10} y={168} anchor="start" size={11} color="#1c1c1c" bold>Roll out gradually</T>
      {roll.map(([name, sub], i) => {
        const x = 10 + i * 170;
        return (
          <g key={name}>
            <Box x={x} y={180} w={140} h={52} kind={i === 3 ? "ok" : "service"} label={name} sub={sub} size={12} />
            {i < 3 && <Arrow d={`M${x + 142},206 L${x + 168},206`} />}
          </g>
        );
      })}
      <T x={340} y={258} size={10.5}>A bad version stops at the step where its numbers drop.</T>
    </svg>
  );
}

/* ───────────── 3. observability and tracing ───────────── */

export function ClassicVsAi() {
  return (
    <Rows
      head={["Classic backend monitoring", "What an AI app adds"]}
      label="An AI app keeps classic backend monitoring and adds to it. Metrics add tokens, cost and time to first token. Logs add the full prompt and response. Traces add model calls, tool calls and retrieval steps. Alerts on errors add alerts on quality, such as eval scores and thumbs-down rate."
      rows={[
        ["Metrics: requests, errors, latency", "+ tokens, cost, time to first token"],
        ["Logs: what happened", "+ the full prompt and the full answer"],
        ["Traces: service → service → database", "+ model calls, tool calls, retrieval"],
        ["Alert: error rate above 1%", "+ alert: quality score or 👎 rate drops"],
      ]}
    />
  );
}

export function TraceTree() {
  // [name, depth, start s, end s, kind, detail]
  const spans: [string, number, number, number, string, string][] = [
    ["POST /chat", 0, 0, 2.4, "#7ea6e0", "2.4s · 2,950 tok · $0.004"],
    ["classify (model)", 1, 0.02, 0.42, "#7ea6e0", "0.40s · 310 tok"],
    ["orderAgent (agent)", 1, 0.45, 2.38, "#8e5fd6", "1.93s"],
    ["model call", 2, 0.46, 1.16, "#7ea6e0", "0.70s · 1,200 tok"],
    ["tool: add_to_cart", 2, 1.18, 1.2, "#e08a3c", "0.02s · qty 2"],
    ["model call", 2, 1.22, 2.36, "#7ea6e0", "1.14s · 1,440 tok"],
  ];
  const x0 = 200;
  const scale = 300 / 2.4;
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="A trace of one chat message drawn as a waterfall. The root span POST /chat takes 2.4 seconds. Under it, classify is one model call, then orderAgent runs a model call, the add_to_cart tool, and a second model call. Each span shows its time and tokens, so you can see which step was slow, expensive or wrong.">
      <T x={x0} y={16} anchor="start" size={9}>0s</T>
      <T x={x0 + 300} y={16} anchor="end" size={9}>2.4s</T>
      {spans.map(([name, depth, s, e, color, detail], i) => {
        const y = 26 + i * 32;
        return (
          <g key={`${name}${i}`}>
            <T x={14 + depth * 16} y={y + 15} anchor="start" size={11} color="#1c1c1c" bold={depth === 0}>{name}</T>
            <rect x={x0} y={y + 2} width={300} height={20} fill="#fafafa" />
            <rect x={x0 + s * scale} y={y + 4} width={Math.max((e - s) * scale, 3)} height={16} rx={3} fill={color} />
            <T x={512} y={y + 15} anchor="start" size={10}>{detail}</T>
          </g>
        );
      })}
      <rect x={10} y={222} width={660} height={32} rx={6} fill="#f5f5f5" stroke="#ddd" />
      <T x={340} y={242} size={10.5} color="#33415c">Each span records: input · output · tokens · latency · cost · error · metadata (user, prompt version)</T>
    </svg>
  );
}

function MCard(props: { title: string; question: string; value: string; valueColor?: string; label: string; children: ReactNode }) {
  const { title, question, value, valueColor = "#1c1c1c", label, children } = props;
  return (
    <svg viewBox="0 0 320 170" role="img" aria-label={label}>
      <rect x="1" y="1" width="318" height="168" rx="8" fill="#fff" stroke="#d6dbe6" />
      <T x={14} y={24} anchor="start" size={13} color="#1c1c1c" bold>{title}</T>
      <T x={14} y={40} anchor="start" size={10.5}>{question}</T>
      {children}
      <line x1="14" x2="306" y1="142" y2="142" stroke="#eee" />
      <T x={14} y={160} anchor="start" size={13} color={valueColor} bold>{value}</T>
    </svg>
  );
}

function Spark({ v, color }: { v: number[]; color: string }) {
  const pts = v.map((y, i) => `${14 + (i * 292) / (v.length - 1)},${130 - y * 70}`).join(" ");
  return (
    <g>
      <line x1="14" x2="306" y1="130" y2="130" stroke="#ddd" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  );
}

export function MonitorGrid() {
  return (
    <div className="metric-grid">
      <MCard title="Latency" question="How long until the user sees words?" value="first token 0.6s · total p95 4.1s" label="Latency: time to first token and total response time, tracked as p95.">
        <Spark v={[0.3, 0.32, 0.3, 0.35, 0.33, 0.4, 0.38, 0.36, 0.34, 0.37, 0.35, 0.33]} color={BLUE} />
      </MCard>
      <MCard title="Tokens and cost" question="What does one request cost us?" value="$0.004 / request · $310 / day" valueColor={ORANGE} label="Tokens and cost: cost per request and per day, which jumps when a prompt grows or an agent loops.">
        <Spark v={[0.2, 0.22, 0.21, 0.23, 0.22, 0.24, 0.6, 0.65, 0.62, 0.64, 0.63, 0.66]} color={ORANGE} />
        <T x={200} y={70} anchor="start" size={9} color={ORANGE}>longer prompt shipped</T>
      </MCard>
      <MCard title="Errors" question="Did the model API or a tool fail?" value="tool errors 0.8% · timeouts 0.2%" label="Errors: model API errors, rate limits, timeouts and failing tool calls.">
        <Spark v={[0.1, 0.1, 0.12, 0.1, 0.11, 0.5, 0.12, 0.1, 0.11, 0.1, 0.12, 0.1]} color={RED} />
      </MCard>
      <MCard title="Guardrails" question="How often did a safety check fire?" value="2.1% blocked or refused" label="Guardrails: how often inputs are blocked, answers refused, or private data caught.">
        <Spark v={[0.2, 0.22, 0.25, 0.21, 0.23, 0.24, 0.22, 0.26, 0.24, 0.23, 0.25, 0.22]} color={PURPLE} />
      </MCard>
      <MCard title="User feedback" question="Do people like the answers?" value="👎 rate 3% → 9%" valueColor={RED} label="User feedback: the thumbs-down rate, which tripled after a change.">
        <Spark v={[0.15, 0.14, 0.16, 0.15, 0.14, 0.16, 0.45, 0.5, 0.48, 0.52, 0.5, 0.49]} color={RED} />
      </MCard>
      <MCard title="Quality" question="Is the live quality drifting?" value="judge score on 5% of traffic: 0.91" valueColor={GREEN} label="Quality: an LLM judge scores a small sample of live traffic so quality drift shows up as a line.">
        <Spark v={[0.8, 0.82, 0.81, 0.83, 0.8, 0.82, 0.81, 0.79, 0.82, 0.81, 0.8, 0.82]} color={GREEN} />
      </MCard>
    </div>
  );
}

export function PlatformLayer() {
  const parts: [string, string][] = [
    ["Traces", "every run"],
    ["Datasets", "eval tasks"],
    ["Experiments", "v1 vs v2"],
    ["Monitoring", "alerts, evals"],
  ];
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="Your app sends traces through an SDK or OpenTelemetry to an LLM observability platform. The platform stores traces, datasets, experiments and monitoring in one place. LangSmith, Langfuse, Braintrust and Arize Phoenix are examples of the same layer.">
      <Box x={10} y={40} w={130} h={70} kind="primary" label="Your AI app" sub="+ SDK or OpenTelemetry" size={12} />
      <Arrow d="M142,75 L182,75" />
      <T x={162} y={66} size={9}>traces</T>
      <rect x={184} y={10} width={486} height={130} rx={8} fill="#f3eefc" stroke="#8e5fd6" strokeWidth={1.5} />
      <T x={198} y={30} anchor="start" size={12} color="#1c1c1c" bold>LLM observability + eval platform</T>
      {parts.map(([name, sub], i) => (
        <Box key={name} x={198 + i * 118} y={46} w={108} h={78} kind="service" label={name} sub={sub} size={12} />
      ))}
      <T x={427} y={166} size={10.5} color="#33415c">Same layer, different vendors: LangSmith · Langfuse (open source) · Braintrust · Arize Phoenix</T>
      <T x={427} y={182} size={9.5}>The concepts on this page work in any of them.</T>
    </svg>
  );
}
