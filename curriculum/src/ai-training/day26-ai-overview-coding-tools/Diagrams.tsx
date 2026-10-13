// Diagrams for Notes.tsx (AI Overview & AI Coding Tools). One component per picture; arrowheads come from the
// <ArrowDefs /> in Notes.tsx.
import type { ReactNode } from "react";
import { Arrow, Box, T } from "../../components/Diagram";
import type { Kind } from "../../components/Diagram";

export type ToolId = "claude" | "codex";

function Card({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#fff" stroke="#d6dbe6" />
      {children}
    </g>
  );
}

export function AiLandscape() {
  const rings: { x: number; y: number; w: number; h: number; fill: string; stroke: string; name: string; what: string; eg: string }[] = [
    { x: 10, y: 8, w: 330, h: 344, fill: "#f7f9fc", stroke: "#cfd8e6", name: "Artificial intelligence", what: "any machine that seems to act smart", eg: "e.g. a chess program, GPS route finding" },
    { x: 26, y: 88, w: 298, h: 254, fill: "#eef3ff", stroke: "#7ea6e0", name: "Machine learning", what: "learns patterns from past data, not fixed rules", eg: "e.g. spam filter, fraud detection" },
    { x: 42, y: 168, w: 266, h: 174 - 10, fill: "#f3eefc", stroke: "#8e5fd6", name: "Deep learning", what: "learns with many-layered neural networks", eg: "e.g. speech recognition, self-driving cars" },
    { x: 58, y: 248, w: 234, h: 74, fill: "#fff7e0", stroke: "#e8b400", name: "Generative AI", what: "creates new text, images, audio and code", eg: "e.g. ChatGPT, Claude: the closest to human-like" },
  ];
  return (
    <svg viewBox="0 0 680 360" role="img" aria-label="Four nested layers of AI, from broadest to newest: artificial intelligence, machine learning, deep learning, and generative AI, each with a one-line description and an everyday example.">
      {rings.map((r) => (
        <rect key={r.name} x={r.x} y={r.y} width={r.w} height={r.h} rx={12} fill={r.fill} stroke={r.stroke} strokeWidth="1.5" />
      ))}
      {rings.map((r) => (
        <g key={r.name + "t"}>
          <T x={r.x + 14} y={r.y + 24} anchor="start" size={12} color="#1c1c1c" bold>{r.name}</T>
          <line x1={r.x + r.w} y1={r.y + 20} x2={364} y2={r.y + 20} stroke="#b9c2d2" strokeDasharray="3 3" />
          <circle cx={364} cy={r.y + 20} r={3} fill="#8e5fd6" />
          <T x={376} y={r.y + 16} anchor="start" size={11.5} color="#1c1c1c" bold>{r.name}</T>
          <T x={376} y={r.y + 34} anchor="start" size={10} color="#1c1c1c">{r.what}</T>
          <T x={376} y={r.y + 50} anchor="start" size={10} color="#2e7d32">{r.eg}</T>
        </g>
      ))}
    </svg>
  );
}

export function CodingAssistants() {
  const shapes: [string, string, "muted" | "service" | "primary"][] = [
    ["Autocomplete", "inline suggestions as you type", "muted"],
    ["Chat + edit", "ask, then apply a diff in the IDE", "service"],
    ["Agent", "multi-file work, runs tests and commands", "primary"],
  ];
  const loop: [string, string][] = [
    ["Plan", "spec or plan mode"],
    ["Write", "the agent edits"],
    ["Run tests", "hooks and CI"],
    ["Review diff", "you read it all"],
    ["Commit", "small, reviewable"],
  ];
  const gives: [string, string][] = [
    ["Knowledge file", "CLAUDE.md · AGENTS.md"],
    ["Skills", "reusable procedures"],
    ["Hooks", "rules the harness enforces"],
    ["MCP servers", "tools and live context"],
  ];
  return (
    <svg viewBox="0 0 680 300" role="img" aria-label="Three shapes of AI coding tool with growing autonomy, the loop of plan, write, test, review and commit, and the four things you give an agent: a knowledge file, skills, hooks, and MCP servers.">
      <T x={14} y={16} anchor="start" size={10} color="#8e5fd6" bold>THREE SHAPES · more autonomy, more review needed</T>
      {shapes.map(([t, s, k], i) => (
        <g key={t}>
          <Box x={14 + i * 226} y={24} w={200} h={52} label={t} sub={s} kind={k} size={11.5} />
          {i < 2 && <Arrow d={`M${216 + i * 226},50 L${238 + i * 226},50`} />}
        </g>
      ))}
      <T x={14} y={108} anchor="start" size={10} color="#8e5fd6" bold>THE WORKING LOOP</T>
      {loop.map(([t, s], i) => (
        <g key={t}>
          <Box x={14 + i * 136} y={118} w={108} h={46} label={t} sub={s} kind={t === "Review diff" ? "primary" : "service"} size={11} />
          {i < 4 && <Arrow d={`M${124 + i * 136},141 L${148 + i * 136},141`} />}
        </g>
      ))}
      <Arrow d="M422,166 L422,184 L204,184 L204,166" ink="orange" dashed />
      <T x={313} y={198} size={9.5} color="#c0702a">ask for changes</T>
      <T x={14} y={226} anchor="start" size={10} color="#8e5fd6" bold>WHAT YOU GIVE THE AGENT</T>
      {gives.map(([t, s], i) => (
        <Box key={t} x={14 + i * 166} y={236} w={150} h={46} label={t} sub={s} kind="ok" size={11} />
      ))}
    </svg>
  );
}

export function SdlcWithAi() {
  const cols: [string, string[], string[]][] = [
    ["1 Ticket", ["summarizes it,", "finds the code", "it touches"], ["clarify what", "done means"]],
    ["2 Plan", ["explores the repo,", "drafts a plan"], ["approve the", "approach"]],
    ["3 Build", ["edits files,", "runs commands"], ["steer in small", "steps"]],
    ["4 Test", ["writes and", "runs tests"], ["check the tests", "test the right", "thing"]],
    ["5 Review", ["first-pass bot", "review"], ["final approval", "(a human)"]],
    ["6 Ship", ["PR text,", "changelog"], ["gate the", "release"]],
    ["7 Run", ["triages alerts,", "drafts a fix"], ["own the", "incident"]],
  ];
  return (
    <svg viewBox="0 0 680 284" role="img" aria-label="The seven stages of a ticket, from requirement to production, with what the AI does at each stage on top and the decision a human still owns underneath.">
      <T x={8} y={14} anchor="start" size={10} color="#2e7d32" bold>AI DOES</T>
      <T x={8} y={146} anchor="start" size={10} color="#b8860b" bold>YOU DECIDE</T>
      {cols.map(([t, ai, you], i) => {
        const x = 8 + i * 96;
        return (
          <g key={t}>
            <rect x={x} y={20} width={90} height={26} rx={5} fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.3" />
            <T x={x + 45} y={37} size={10.5} color="#1c1c1c" bold>{t}</T>
            <rect x={x} y={54} width={90} height={74} rx={6} fill="#eef8ee" stroke="#7dbb7d" />
            {ai.map((l, j) => <T key={l} x={x + 45} y={78 + j * 15} size={9}>{l}</T>)}
            <rect x={x} y={152} width={90} height={74} rx={6} fill="#fff7e0" stroke="#e8b400" />
            {you.map((l, j) => <T key={l} x={x + 45} y={176 + j * 15} size={9}>{l}</T>)}
          </g>
        );
      })}
      <T x={340} y={254} size={11} color="#1c1c1c" bold>AI speeds up every stage; a human decision still gates every stage.</T>
    </svg>
  );
}

export function ParallelAgents() {
  const agents = [
    ["Agent A", "worktree: feat/search"],
    ["Agent B", "worktree: fix/login"],
    ["Agent C", "worktree: chore/deps"],
  ];
  return (
    <svg viewBox="0 0 680 288" role="img" aria-label="Locally, several agents work on separate tasks at once, each in its own git worktree, and their results queue up for your review. In the background, an issue or chat message starts an agent in a sandbox that opens a pull request. The same agent can also run headless in CI. The bottleneck moves from writing code to reviewing it.">
      <T x={14} y={14} anchor="start" size={10} color="#8e5fd6" bold>LOCAL · parallel agents</T>
      <T x={520} y={14} anchor="start" size={10} color="#8e5fd6" bold>BACKGROUND · from a ticket</T>
      <Box x={14} y={92} w={90} h={60} label="3 tasks" sub="independent" kind="muted" />
      {agents.map(([a, w], i) => (
        <Box key={a} x={150} y={24 + i * 66} w={170} h={46} label={a} sub={w} kind="service" size={11} />
      ))}
      <Box x={370} y={86} w={120} h={60} label="Review queue" sub="you read every diff" kind="primary" size={11} />
      <T x={430} y={166} size={10} color="#c0392b" bold>the new bottleneck</T>
      <Arrow d="M106,114 L148,48" /><Arrow d="M106,122 L148,114" /><Arrow d="M106,130 L148,180" />
      <Arrow d="M322,48 L368,102" /><Arrow d="M322,114 L368,116" /><Arrow d="M322,180 L368,130" />
      <Box x={520} y={24} w={150} h={42} label="Issue or chat message" kind="muted" size={10.5} />
      <Box x={520} y={86} w={150} h={42} label="Agent in a sandbox" sub="own branch, no prod access" kind="service" size={10.5} />
      <Box x={520} y={148} w={150} h={42} label="Opens a pull request" kind="ok" size={10.5} />
      <Arrow d="M595,68 L595,84" /><Arrow d="M595,130 L595,146" />
      <Arrow d="M518,176 L492,138" />
      <Box x={14} y={226} w={656} h={42} label="Headless mode in CI: the same agent reviews pull requests, labels issues, and fixes lint, with no terminal open" kind="muted" size={10.5} />
    </svg>
  );
}

export function VerificationGates() {
  const rows: [string, string][] = [
    ["Type check + lint", "invented APIs, wrong signatures"],
    ["Unit tests", "wrong logic (only if the tests are real)"],
    ["End-to-end / screenshot test", "a UI that compiles but does not work"],
    ["Dependency + secret scan", "made-up packages, leaked keys"],
    ["AI review bot", "first-pass bugs and style"],
    ["Human review", "intent, design, missing authorization"],
  ];
  return (
    <svg viewBox="0 0 680 318" role="img" aria-label="Six gates a change passes before merge, each catching a different failure of AI-written code: type check, unit tests, end-to-end tests, dependency and secret scans, an AI review bot, and finally a human reviewer. Cheap automatic gates come first.">
      <T x={10} y={16} anchor="start" size={11} color="#2e7d32" bold>Gate</T>
      <T x={350} y={16} anchor="start" size={11} color="#c0702a" bold>Catches</T>
      {rows.map(([g, c], i) => {
        const y = 26 + i * 42;
        return (
          <g key={g}>
            <Box x={10} y={y} w={290} h={34} label={`${i + 1}  ${g}`} kind="ok" size={10.5} />
            <Arrow d={`M302,${y + 17} L346,${y + 17}`} />
            <Box x={348} y={y} w={322} h={34} label={c} kind="warn" size={10.5} />
          </g>
        );
      })}
      <T x={340} y={298} size={11} color="#1c1c1c" bold>Give the agent the command that proves it works, and make it run it.</T>
    </svg>
  );
}

export function CompanyPolicy() {
  const cards: [string, string[]][] = [
    ["Approved tools", ["enterprise plans only", "SSO · no training on data", "retention you control"]],
    ["Data classes", ["public: send freely", "internal: approved tools", "secrets · PII: never"]],
    ["Permissions", ["allowlist safe commands", "deny deploy · delete · curl", "no production credentials"]],
    ["MCP + plugins", ["vetted servers only", "pin versions, review code", "least-privilege tokens"]],
    ["IP + licensing", ["who owns generated code", "license-scan the output", "no copying restricted code"]],
    ["Review rules", ["a human approves every PR", "label AI-assisted changes", "extra care: auth, payments"]],
    ["Security scans", ["secret + dependency scan", "SAST on every PR", "catch made-up packages"]],
    ["Audit + logs", ["who used which model", "spend per team", "retain per compliance"]],
  ];
  return (
    <svg viewBox="0 0 680 290" role="img" aria-label="Eight areas a company AI-usage policy typically covers: approved tools, data classes, permissions, MCP and plugins, IP and licensing, review rules, security scans, and audit logs.">
      {cards.map(([title, lines], i) => {
        const x = 10 + (i % 4) * 167;
        const y = 8 + Math.floor(i / 4) * 142;
        return (
          <Card key={title} x={x} y={y} w={158} h={132}>
            <T x={x + 12} y={y + 24} anchor="start" size={11.5} color="#1c1c1c" bold>{title}</T>
            {lines.map((l, j) => (
              <T key={l} x={x + 12} y={y + 54 + j * 22} anchor="start" size={9.5}>{l}</T>
            ))}
          </Card>
        );
      })}
    </svg>
  );
}

export function HowCompaniesPay() {
  return (
    <svg viewBox="0 0 680 222" role="img" aria-label="Two ways companies pay for AI tools: a per-seat plan with usage limits, which is predictable, or metered API usage through a company account, which is flexible but needs spending caps. Many companies mix both.">
      <Card x={10} y={10} w={325} h={140}>
        <T x={24} y={34} anchor="start" size={13} color="#1c1c1c" bold>Per-seat plan</T>
        <T x={24} y={62} anchor="start" size={10}>a monthly fee per developer</T>
        <T x={24} y={82} anchor="start" size={10}>usage included, up to a limit</T>
        <T x={24} y={108} anchor="start" size={10} color="#2e7d32">+ easy to budget</T>
        <T x={24} y={126} anchor="start" size={10} color="#c0702a">- heavy users hit the limit</T>
      </Card>
      <Card x={345} y={10} w={325} h={140}>
        <T x={359} y={34} anchor="start" size={13} color="#1c1c1c" bold>Metered API, through the company</T>
        <T x={359} y={62} anchor="start" size={10}>pay per token, with per-team keys</T>
        <T x={359} y={82} anchor="start" size={10}>for automation, CI, internal apps</T>
        <T x={359} y={108} anchor="start" size={10} color="#2e7d32">+ flexible, scales with use</T>
        <T x={359} y={126} anchor="start" size={10} color="#c0702a">- a surprise bill without caps</T>
      </Card>
      <Box x={10} y={166} w={660} h={42} label="Common mix: seats for everyone, plus a capped API budget for automation and power users" kind="primary" size={11} />
    </svg>
  );
}

export function AiGateway() {
  const tools = ["Claude Code", "Cursor / IDE", "CI agents", "Internal apps"];
  const providers = ["Anthropic", "OpenAI", "Bedrock / Vertex", "Self-hosted"];
  const features = ["SSO identity on every request", "budget per team or key", "rate limits", "model allowlist", "logging + PII redaction", "fallbacks + caching"];
  return (
    <svg viewBox="0 0 680 290" role="img" aria-label="An LLM gateway sits between every AI tool a company uses and the model providers, giving one place for identity, per-team budgets, rate limits, a model allowlist, logging with redaction, and fallbacks.">
      {tools.map((t, i) => (
        <g key={t}>
          <Box x={10} y={24 + i * 56} w={130} h={40} label={t} size={11} />
          <Arrow d={`M142,${44 + i * 56} L228,${44 + i * 56}`} />
        </g>
      ))}
      <Box x={230} y={14} w={220} h={226} label="" kind="primary" />
      <T x={340} y={38} size={13} color="#1c1c1c" bold>LLM gateway</T>
      {features.map((f, i) => (
        <T key={f} x={248} y={68 + i * 27} anchor="start" size={10} color="#1c1c1c">{`• ${f}`}</T>
      ))}
      {providers.map((p, i) => (
        <g key={p}>
          <Arrow d={`M452,${44 + i * 56} L538,${44 + i * 56}`} />
          <Box x={540} y={24 + i * 56} w={130} h={40} label={p} kind="broker" size={11} />
        </g>
      ))}
      <T x={340} y={268} size={11} color="#1c1c1c" bold>One door out: central keys, one bill, one audit trail.</T>
      <T x={340} y={284} size={9.5}>examples: LiteLLM, Portkey, Cloudflare AI Gateway, cloud-native proxies</T>
    </svg>
  );
}

export function TokenGrowth() {
  // Illustrative numbers: a fixed 20k-token start, 3k new tokens per turn, 30 turns.
  const FIXED = 20000;
  const PER_TURN = 3000;
  const TURNS = 30;
  const input = (n: number) => FIXED + PER_TURN * n;
  const plain: number[] = [];
  const cached: number[] = [];
  let a = 0;
  let b = 0;
  for (let n = 1; n <= TURNS; n++) {
    a += input(n);
    b += n === 1 ? 1.25 * input(1) : 0.1 * input(n - 1) + 1.25 * PER_TURN; // reads ~10%, writes ~125%
    plain.push(a);
    cached.push(b);
  }
  const max = plain[TURNS - 1];
  const X0 = 70;
  const X1 = 640;
  const Y0 = 220;
  const Y1 = 40;
  const px = (i: number) => X0 + ((X1 - X0) * i) / (TURNS - 1);
  const py = (v: number) => Y0 - ((Y0 - Y1) * v) / max;
  const line = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const M = (v: number) => `${(v / 1e6).toFixed(2)}M`;
  return (
    <svg viewBox="0 0 680 304" role="img" aria-label={`A chart over ${TURNS} turns of an agent session: because every turn re-reads the whole context, the total input tokens processed grows to about ${M(max)} without caching, but only about ${M(cached[TURNS - 1])} token-equivalents of cost with prompt caching.`}>
      <T x={X0} y={20} anchor="start" size={11} color="#1c1c1c" bold>Every turn re-reads the whole conversation, so the total climbs fast</T>
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#bbb" />
      <line x1={X0} y1={Y1} x2={X0} y2={Y0} stroke="#bbb" />
      <T x={X0 - 6} y={Y1 + 4} anchor="end" size={9}>{M(max)}</T>
      <T x={X0 - 6} y={Y0} anchor="end" size={9}>0</T>
      <T x={X0} y={Y0 + 16} anchor="start" size={9}>turn 1</T>
      <T x={X1} y={Y0 + 16} anchor="end" size={9}>turn {TURNS}</T>
      <path d={line(plain)} fill="none" stroke="#e08a3c" strokeWidth="2.2" />
      <path d={line(cached)} fill="none" stroke="#3d8b40" strokeWidth="2.2" />
      <T x={X1 - 6} y={py(max) - 6} anchor="end" size={10} color="#c0702a" bold>no caching · {M(max)}</T>
      <T x={X1 - 6} y={py(cached[TURNS - 1]) - 8} anchor="end" size={10} color="#2e7d32" bold>prompt caching · {M(cached[TURNS - 1])}</T>
      <T x={X0} y={252} anchor="start" size={9.5}>Illustrative: a 20k-token start, 3k new tokens per turn. Y axis = input tokens billed</T>
      <T x={X0} y={266} anchor="start" size={9.5}>(cached reads are billed at roughly a tenth, cache writes slightly above normal).</T>
      <T x={340} y={292} size={10.5} color="#1c1c1c" bold>Long sessions, big tool lists, and big files all multiply the bill.</T>
    </svg>
  );
}

export function VanityVsOutcome() {
  const vanity = ["lines of code generated", "suggestions accepted", "tokens used per developer", "number of AI-assisted PRs"];
  const real = ["PR cycle time: open → merged", "change failure rate + reverts", "bugs escaping to production", "developer survey: trust, time saved"];
  return (
    <svg viewBox="0 0 680 212" role="img" aria-label="Easy-to-count numbers such as lines generated and suggestions accepted say little about value; outcome measures such as pull request cycle time, change failure rate and escaped bugs are closer to the truth.">
      <Card x={10} y={10} w={300} h={150}>
        <T x={24} y={32} anchor="start" size={12} color="#c0702a" bold>Easy to count, easy to game</T>
        {vanity.map((v, i) => <T key={v} x={24} y={60 + i * 24} anchor="start" size={10.5} color="#1c1c1c">{v}</T>)}
      </Card>
      <Arrow d="M312,85 L368,85" />
      <Card x={370} y={10} w={300} h={150}>
        <T x={384} y={32} anchor="start" size={12} color="#2e7d32" bold>Closer to the truth</T>
        {real.map((v, i) => <T key={v} x={384} y={60 + i * 24} anchor="start" size={10.5} color="#1c1c1c">{v}</T>)}
      </Card>
      <T x={340} y={190} size={11} color="#1c1c1c" bold>Feeling faster and being faster are different things: measure it.</T>
    </svg>
  );
}

// ───────────────────────── 1.1 kinds of AI ─────────────────────────

export function KindsOfAi() {
  const cards: [string, string, string][] = [
    ["Predicting", "spots patterns in past data to guess what comes next", "fraud detection, price forecasts, movie picks"],
    ["Seeing", "understands photos, video and the road", "face unlock, medical diagnosis, driving cars"],
    ["Listening and translating", "turns speech and language into something usable", "speech recognition, translating languages"],
    ["Generating", "creates new text, images, audio or code", "ChatGPT, image makers, AI voices"],
  ];
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="Four broad kinds of AI in everyday life: predicting, seeing, listening and translating, and generating new content, each with a plain description and everyday examples.">
      {cards.map(([t, a, b], i) => {
        const x = 10 + (i % 2) * 335;
        const y = 8 + Math.floor(i / 2) * 124;
        return (
          <Card key={t} x={x} y={y} w={325} h={112}>
            <T x={x + 16} y={y + 30} anchor="start" size={13} color="#1c1c1c" bold>{t}</T>
            <T x={x + 16} y={y + 56} anchor="start" size={10.5} color="#1c1c1c">{a}</T>
            <T x={x + 16} y={y + 84} anchor="start" size={10.5} color="#2e7d32">{`e.g. ${b}`}</T>
          </Card>
        );
      })}
    </svg>
  );
}

// ───────────────────────── 2. chatbot, assistant, agent ─────────────────────────

export function AutonomySpectrum() {
  const steps: [string, string, string, string, "muted" | "service" | "primary"][] = [
    ["Chatbot", "answers in a chat window", "you copy the result out", "e.g. asking a question in a chat app", "muted"],
    ["Assistant", "works inside your tools", "you accept or reject each edit", "e.g. inline code suggestions", "service"],
    ["Agent", "runs tools in a loop until done", "you review the finished result", "e.g. fixes a bug and runs the tests", "primary"],
  ];
  const fill = { muted: "#f5f5f5", service: "#eef3ff", primary: "#fff7e0" };
  const stroke = { muted: "#bbbbbb", service: "#7ea6e0", primary: "#e8b400" };
  return (
    <svg viewBox="0 0 680 236" role="img" aria-label="A spectrum of autonomy: a chatbot answers in a window and you copy the result, an assistant works inside your tools and you approve each edit, and an agent runs tools in a loop until the task is done and you review the result. Coding tools exist at all three levels.">
      <T x={14} y={16} anchor="start" size={10} color="#8e5fd6" bold>MORE AUTONOMY, MORE REVIEW NEEDED</T>
      {steps.map(([t, a, b, c, k], i) => (
        <g key={t}>
          <rect x={10 + i * 225} y={26} width={210} height={140} rx={8} fill={fill[k]} stroke={stroke[k]} strokeWidth="1.5" />
          <T x={115 + i * 225} y={52} size={14} color="#1c1c1c" bold>{t}</T>
          <T x={115 + i * 225} y={80} size={10} color="#1c1c1c">{a}</T>
          <T x={115 + i * 225} y={100} size={10} color="#1c1c1c">{b}</T>
          <T x={115 + i * 225} y={136} size={9.5}>{c}</T>
          {i < 2 && <Arrow d={`M${222 + i * 225},96 L${233 + i * 225},96`} />}
        </g>
      ))}
      <T x={340} y={200} size={11} color="#1c1c1c" bold>Coding tools exist at all three levels:</T>
      <T x={340} y={218} size={11} color="#1c1c1c" bold>know which one you are using, and review to match.</T>
    </svg>
  );
}

// ───────────────────────── 5.1 rollout stages ─────────────────────────

export function RolloutStages() {
  const stages: [string, string, string][] = [
    ["Pilot", "one team of volunteers", "learn what breaks"],
    ["Team", "policy + knowledge files", "cycle time not worse"],
    ["Organization", "enterprise plan, SSO, budgets", "spend stays in the cap"],
    ["Steady state", "share techniques, drop misses", "reviewed every quarter"],
  ];
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="Four stages of rolling out AI coding tools in a company: a pilot with one team, a team stage with policy and knowledge files, an organization-wide stage with an enterprise plan, single sign-on and budgets, then a steady state with quarterly review; each stage has a gate to pass.">
      {stages.map(([t, s, gate], i) => (
        <g key={t}>
          <Box x={10 + i * 168} y={14} w={158} h={56} label={t} sub={s} kind={i === 3 ? "ok" : "service"} size={12} />
          {i < 3 && <Arrow d={`M${170 + i * 168},42 L${178 + i * 168},42`} />}
          <rect x={10 + i * 168} y={84} width={158} height={50} rx={6} fill="#fff7e0" stroke="#e8b400" />
          <T x={89 + i * 168} y={102} size={9} color="#b8860b" bold>GATE</T>
          <T x={89 + i * 168} y={120} size={10}>{gate}</T>
        </g>
      ))}
      <T x={340} y={166} size={11} color="#1c1c1c" bold>Each step is gated by usage data and incident count, not by enthusiasm.</T>
    </svg>
  );
}

// ───────────────────────── Part A + B: lighter intro and hands-on diagrams ─────────────────────────

type CardItem = { title: string; tag?: string; lines: string[] };

function CardGrid({ cols, h, items, aria }: { cols: number; h: number; items: CardItem[]; aria: string }) {
  const w = (660 - (cols - 1) * 10) / cols;
  const rows = Math.ceil(items.length / cols);
  return (
    <svg viewBox={`0 0 680 ${rows * (h + 10) + 6}`} role="img" aria-label={aria}>
      {items.map((it, i) => {
        const x = 10 + (i % cols) * (w + 10);
        const y = 6 + Math.floor(i / cols) * (h + 10);
        return (
          <Card key={it.title} x={x} y={y} w={w} h={h}>
            <T x={x + 16} y={y + 28} anchor="start" size={13} color="#1c1c1c" bold>{it.title}</T>
            {it.tag && <T x={x + w - 16} y={y + 28} anchor="end" size={9.5} color="#6a3fb5" bold>{it.tag}</T>}
            {it.lines.map((l, j) => (
              <T key={l} x={x + 16} y={y + 54 + j * 20} anchor="start" size={10.5} color="#1c1c1c">{l}</T>
            ))}
          </Card>
        );
      })}
    </svg>
  );
}

function Steps({ steps, aria, loop, note, w = 140 }: { steps: [string, string, Kind][]; aria: string; loop?: [number, number, string]; note?: string; w?: number }) {
  const n = steps.length;
  const gap = (660 - n * w) / (n - 1);
  const xs = steps.map((_, i) => 10 + i * (w + gap));
  const noteY = loop ? 134 : 92;
  const height = note ? noteY + 48 : loop ? 134 : 84;
  return (
    <svg viewBox={`0 0 680 ${height}`} role="img" aria-label={aria}>
      {steps.map(([t, s, k], i) => (
        <Box key={t} x={xs[i]} y={10} w={w} h={62} label={t} sub={s} kind={k} size={11} />
      ))}
      {steps.slice(0, -1).map((_, i) => (
        <Arrow key={i} d={`M${xs[i] + w},41 L${xs[i + 1] - 2},41`} />
      ))}
      {loop && (
        <g>
          <Arrow d={`M${xs[loop[0]] + w / 2},74 L${xs[loop[0]] + w / 2},102 L${xs[loop[1]] + w / 2},102 L${xs[loop[1]] + w / 2},76`} ink="orange" />
          <T x={(xs[loop[0]] + xs[loop[1]] + w) / 2} y={120} size={10} color="#b36b1c">{loop[2]}</T>
        </g>
      )}
      {note && <Box x={10} y={noteY} w={660} h={40} label={note} kind="muted" size={11} />}
    </svg>
  );
}

// 2.1 prompt in, response out
export function PromptResponse() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="A prompt (system rules plus your question) goes into a model, which predicts the next word piece by piece and returns a response. The model remembers nothing between calls.">
      <Box x={10} y={20} w={200} h={64} label="Prompt" sub="system rules + your question" kind="service" />
      <Box x={260} y={20} w={160} h={64} label="Model" sub="predicts the next token" kind="primary" />
      <Box x={470} y={20} w={200} h={64} label="Response" sub="text, code, or a tool call" kind="ok" />
      <Arrow d="M212,52 L258,52" />
      <Arrow d="M422,52 L468,52" />
      <T x={20} y={106} anchor="start" size={10} color="#1c1c1c">system prompt = the role and the rules</T>
      <T x={20} y={122} anchor="start" size={10} color="#1c1c1c">user prompt = the task you ask for</T>
      <T x={340} y={106} size={10} color="#1c1c1c">one word-piece at a time</T>
      <Box x={10} y={146} w={660} h={40} label="The model remembers nothing: every call re-sends the whole conversation" kind="muted" size={11} />
    </svg>
  );
}

// 2.2 tokens
export function Tokens() {
  const toks = ["Vibe", " coding", " is", " fast", " and", " fun", "."];
  let x = 10;
  const chips = toks.map((t) => {
    const w = 18 + t.length * 8;
    const c = { x, w, t };
    x += w + 4;
    return c;
  });
  return (
    <svg viewBox="0 0 680 220" role="img" aria-label="Text is split into tokens, roughly three quarters of a word each. You pay for input tokens (what you send) and output tokens (what the model writes), and limits are counted in tokens.">
      <T x={10} y={22} anchor="start" size={11} color="#1c1c1c" bold>&quot;Vibe coding is fast and fun.&quot; becomes 7 tokens:</T>
      {chips.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={34} width={c.w} height={30} rx={5} fill={i % 2 ? "#eef3ff" : "#fff7e0"} stroke={i % 2 ? "#7ea6e0" : "#e8b400"} />
          <T x={c.x + c.w / 2} y={54} size={11} color="#1c1c1c">{c.t.trim() || c.t}</T>
        </g>
      ))}
      <Box x={10} y={96} w={210} h={60} label="Rule of thumb" sub="1 token is about 4 characters" kind="broker" />
      <Box x={235} y={96} w={210} h={60} label="Input tokens" sub="your prompt + context" kind="service" />
      <Box x={460} y={96} w={210} h={60} label="Output tokens" sub="the reply (costs more)" kind="primary" />
      <Box x={10} y={172} w={660} h={40} label="Price, speed, and limits are all counted in tokens" kind="ok" size={11} />
    </svg>
  );
}

// 2.3 context window
export function ContextWindow() {
  const segs: [string, number, string, string][] = [
    ["System prompt", 90, "#eef3ff", "#7ea6e0"],
    ["Conversation", 230, "#f3eefc", "#8e5fd6"],
    ["Files you add", 190, "#fff7e0", "#e8b400"],
    ["Question", 60, "#fff1e6", "#e8a060"],
    ["Reply room", 90, "#f5f5f5", "#bbbbbb"],
  ];
  let x = 10;
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="The context window is the maximum number of tokens the model can see in one call: system prompt, conversation, files, your question, and room for the reply all share it. When it overflows, the oldest text is dropped or quality drops.">
      <T x={10} y={22} anchor="start" size={11} color="#1c1c1c" bold>Context window = everything the model can see in one call</T>
      {segs.map(([label, w, fill, stroke]) => {
        const sx = x;
        x += w;
        return (
          <g key={label}>
            <rect x={sx} y={36} width={w} height={46} fill={fill} stroke={stroke} strokeDasharray={label === "Reply room" ? "4 3" : undefined} />
            <T x={sx + w / 2} y={63} size={10} color="#1c1c1c">{label}</T>
          </g>
        );
      })}
      <Box x={10} y={110} w={320} h={64} label="Fits" sub="the model sees all of it" kind="ok" />
      <Box x={350} y={110} w={320} h={64} label="Overflows" sub="old text is dropped, answers get worse" kind="warn" />
      <T x={340} y={198} size={10} color="#1c1c1c">Bigger window = more it can read, but more tokens to pay for</T>
    </svg>
  );
}

export function PayModels() {
  return (
    <CardGrid
      cols={2}
      h={108}
      aria="Two ways companies pay for AI coding tools: per seat, a fixed monthly price per developer, or per token, paying for what the model reads and writes."
      items={[
        { title: "Per seat", lines: ["a fixed monthly price per developer", "predictable bill, usage limits apply", "typical for Copilot and team plans"] },
        { title: "Per token", lines: ["pay for what the model reads and writes", "bill grows with agent usage", "companies add budgets and caps"] },
      ]}
    />
  );
}

export function TwoModes() {
  return (
    <CardGrid
      cols={2}
      h={108}
      aria="Two ways to use an AI coding tool: tab completion, where the AI finishes the line and you press Tab, and agentic mode, where you describe a task and the AI reads, edits, and runs commands."
      items={[
        { title: "Tab completion", lines: ["AI finishes the line as you type", "you press Tab to accept", "small, fast, you stay in control"] },
        { title: "Agentic mode", lines: ["describe a task in a side chat or terminal", "AI reads files, edits, runs commands", "bigger jobs; you review the result"] },
      ]}
    />
  );
}

export function PlanFirst() {
  return (
    <Steps
      aria="The plan-first workflow: explore the code, write a plan you review, build in small steps, then verify with tests and your own review. Plan mode keeps the agent read-only until you approve."
      steps={[["1 Explore", "agent reads the code", "service"], ["2 Plan", "you review the steps", "primary"], ["3 Build", "small, tested edits", "service"], ["4 Verify", "tests + your review", "ok"]]}
      note="Plan mode: the agent proposes and changes nothing until you approve"
    />
  );
}

export function DebugLoop() {
  return (
    <Steps
      aria="Debugging with an agent: share the exact failure, let it find the root cause, apply the smallest fix, re-run, and loop back to the root cause if it still fails."
      steps={[["1 Share failure", "error text + repro", "fail"], ["2 Find root cause", "agent reads and tests", "service"], ["3 Fix", "the smallest change", "primary"], ["4 Re-run", "does it pass now?", "ok"]]}
      loop={[3, 1, "still failing? back to the root cause"]}
    />
  );
}

export function TestLoop() {
  return (
    <Steps
      aria="Testing with an agent: write a test, run it and watch it fail, let the agent implement, run again until green. Always read the tests too."
      steps={[["1 Write the test", "describe the behavior", "service"], ["2 Run: red", "it must fail first", "fail"], ["3 Implement", "agent writes the code", "primary"], ["4 Run: green", "all tests pass", "ok"]]}
      loop={[3, 2, "still red? let the agent fix it"]}
      note="Read the tests too: a test that cannot fail proves nothing"
    />
  );
}

// ───────────────────────── round 3: provider examples, logos, company patterns, per-tool setup ─────────────────────────

export function ModelTiers() {
  const rows: [string, string, string, string, string, Kind][] = [
    ["Small", "fast and cheap", "Haiku", "Luna", "simple, high-volume tasks", "service"],
    ["Mid-size", "the balanced default", "Sonnet", "Terra", "most day-to-day coding", "ok"],
    ["Frontier", "smartest, slowest, priciest", "Opus / Fable", "Sol / Astra", "hard planning and bugs", "primary"],
  ];
  const cols: [number, number, string][] = [[10, 170, "Tier"], [190, 130, "Claude"], [330, 130, "OpenAI"], [470, 200, "Best for"]];
  return (
    <svg viewBox="0 0 680 232" role="img" aria-label="A table of model tiers. Small and fast: Claude Haiku, OpenAI Luna, for simple high-volume tasks. Mid-size and balanced: Claude Sonnet, OpenAI Terra, for most coding. Frontier, the smartest and priciest: Claude Opus or Fable, OpenAI Sol or Astra, for hard planning and bugs.">
      {cols.map(([x, w, t]) => (
        <T key={t} x={x + w / 2} y={20} size={11.5} color="#8e5fd6" bold>{t}</T>
      ))}
      <line x1={10} y1={30} x2={670} y2={30} stroke="#d6dbe6" />
      {rows.map(([tier, sub, cl, oa, best, k], i) => {
        const y = 40 + i * 62;
        return (
          <g key={tier}>
            <Box x={10} y={y} w={170} h={52} label={tier} sub={sub} kind={k} size={13} />
            <rect x={190} y={y} width={130} height={52} rx={8} fill="#fff" stroke="#d6dbe6" />
            <T x={255} y={y + 31} size={13} color="#1c1c1c" bold>{cl}</T>
            <rect x={330} y={y} width={130} height={52} rx={8} fill="#fff" stroke="#d6dbe6" />
            <T x={395} y={y + 31} size={13} color="#1c1c1c" bold>{oa}</T>
            <T x={570} y={y + 31} size={11} color="#1c1c1c">{best}</T>
          </g>
        );
      })}
      <T x={340} y={226} size={10}>smaller is faster and cheaper; bigger is smarter, slower, and pricier</T>
    </svg>
  );
}

export function DefaultSkills({ tool }: { tool: ToolId }) {
  const claude: CardItem[] = [
    { title: "/init", lines: ["draft CLAUDE.md"] },
    { title: "/review", lines: ["review a pull request"] },
    { title: "/security-review", lines: ["scan changes for risks"] },
    { title: "/compact", lines: ["shrink the chat"] },
    { title: "/resume", lines: ["continue a past session"] },
    { title: "/permissions", lines: ["edit allow and deny rules"] },
  ];
  const codex: CardItem[] = [
    { title: "/init", lines: ["draft AGENTS.md"] },
    { title: "/review", lines: ["review your changes"] },
    { title: "/diff", lines: ["show the git diff"] },
    { title: "/compact", lines: ["shrink the chat"] },
    { title: "/new", lines: ["start a fresh chat"] },
    { title: "/model", lines: ["switch the model"] },
  ];
  return (
    <CardGrid
      cols={3}
      h={70}
      aria="The most common built-in commands and skills for the chosen coding agent, such as init, review, compact, and resume."
      items={tool === "claude" ? claude : codex}
    />
  );
}

export function ToolCompare() {
  const rows: { name: string; by: string; line: string; tag?: string }[] = [
    { name: "Claude Code", by: "Anthropic", line: "terminal-first coding agent", tag: "used in this course" },
    { name: "Codex", by: "OpenAI", line: "agent in terminal, IDE, and cloud" },
    { name: "GitHub Copilot", by: "GitHub / Microsoft", line: "built into the IDE and GitHub" },
    { name: "Cursor", by: "Anysphere", line: "an AI-first code editor" },
  ];
  return (
    <svg viewBox="0 0 680 244" role="img" aria-label="Four common AI coding tools, each with its vendor and one-line description: Claude Code from Anthropic, Codex from OpenAI, GitHub Copilot, and Cursor.">
      {rows.map((r, i) => {
        const y = 6 + i * 58;
        return (
          <g key={r.name}>
            <rect x={10} y={y} width={660} height={50} rx={8} fill="#fff" stroke="#d6dbe6" />
            <T x={26} y={y + 22} anchor="start" size={13} color="#1c1c1c" bold>{r.name}</T>
            <T x={26} y={y + 38} anchor="start" size={9.5} color="#6a3fb5">{r.by}</T>
            <T x={260} y={y + 30} anchor="start" size={11} color="#1c1c1c">{r.line}</T>
            {r.tag && (
              <g>
                <rect x={528} y={y + 14} width={130} height={22} rx={11} fill="#eef8ee" stroke="#7dbb7d" />
                <T x={593} y={y + 29} size={10} color="#2e7d32" bold>{r.tag}</T>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function CompanyPatterns() {
  const rows: [string, string, string, string, Kind][] = [
    ["Pick and allocate", "Engineers request a tool", "approved requests get a monthly cost allocation", "", "service"],
    ["One company standard", "Everyone uses the same tool", "bought in bulk, easiest to secure and support", "", "ok"],
    ["Migrating", "Two tools overlap for a while", "then the old one is retired when the move is done", "", "warn"],
  ];
  return (
    <svg viewBox="0 0 680 186" role="img" aria-label="Three ways companies handle AI coding tools: engineers request a tool and get a monthly cost allocation, the whole company standardizes on one tool, or the company migrates and briefly pays for two tools at once.">
      {rows.map(([a, b, c, , k], i) => (
        <g key={a}>
          <Box x={10} y={6 + i * 60} w={210} h={50} label={a} kind={k} size={12} />
          <Arrow d={`M222,${31 + i * 60} L248,${31 + i * 60}`} />
          <Box x={250} y={6 + i * 60} w={420} h={50} label={b} sub={c} kind="muted" size={11.5} />
        </g>
      ))}
    </svg>
  );
}

export function BudgetRanges() {
  const x0 = 200;
  const k = 0.45;
  const rows: [string, string, number, number, string, string][] = [
    ["Entry seat", "about $19 to $40", 19, 40, "#eef8ee", "#7dbb7d"],
    ["Premium seat", "about $100 to $200", 100, 200, "#eef3ff", "#7ea6e0"],
    ["Typical token spend", "about $150 to $250", 150, 250, "#fff7e0", "#e8b400"],
    ["Heavy users", "$500 to $1,000+", 500, 1000, "#fff1e6", "#e8a060"],
  ];
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="Rough monthly cost per developer: an entry seat around 19 to 40 dollars, a premium seat around 100 to 200 dollars, typical token spend around 150 to 250 dollars, and heavy users from 500 to over 1,000 dollars. Ballpark figures that vary by company.">
      <T x={10} y={20} anchor="start" size={11} color="#1c1c1c" bold>Rough monthly cost per developer (ballpark only)</T>
      {rows.map(([name, range, lo, hi, fill, stroke], i) => {
        const y = 36 + i * 42;
        return (
          <g key={name}>
            <T x={10} y={y + 14} anchor="start" size={11} color="#1c1c1c" bold>{name}</T>
            <T x={10} y={y + 28} anchor="start" size={9.5}>{range}</T>
            <rect x={x0 + lo * k} y={y + 2} width={(hi - lo) * k} height={26} rx={5} fill={fill} stroke={stroke} strokeWidth="1.5" />
          </g>
        );
      })}
      <line x1={x0} y1={208} x2={x0 + 1000 * k} y2={208} stroke="#bbb" />
      {[0, 250, 500, 750, 1000].map((v) => (
        <g key={v}>
          <line x1={x0 + v * k} y1={204} x2={x0 + v * k} y2={212} stroke="#bbb" />
          <T x={x0 + v * k} y={226} size={9.5}>{`$${v}`}</T>
        </g>
      ))}
      <T x={340} y={252} size={10} color="#1c1c1c">Figures differ by company and change often: check your vendor and your policy.</T>
    </svg>
  );
}

export function ClaudeSetup({ tool }: { tool: ToolId }) {
  const items: [string, string, string][] =
    tool === "claude"
      ? [["CLAUDE.md", "your project's memory", "read every session"], [".claude/skills/", "reusable prompts", "loaded only when relevant"], [".claude/settings.json", "permissions + hooks", "enforced by the tool"]]
      : [["AGENTS.md", "your project's memory", "read every session"], [".codex/skills/", "reusable prompts", "loaded only when relevant"], ["~/.codex/config.toml", "approvals, sandbox, hooks", "enforced by the tool"]];
  return (
    <svg viewBox="0 0 680 218" role="img" aria-label="A project set up for a coding agent has three parts: an instructions file as the project memory read every session, a skills folder of reusable prompts loaded when relevant, and a settings file holding permissions and hooks that the tool enforces.">
      <Box x={240} y={8} w={200} h={34} label="my-app/" kind="muted" />
      {items.map(([t, s2, n], i) => (
        <g key={t}>
          <Arrow d={`M340,43 L${115 + i * 225},78`} />
          <Box x={10 + i * 225} y={80} w={210} h={70} label={t} sub={s2} kind={i === 0 ? "primary" : "service"} size={12} />
          <T x={115 + i * 225} y={172} size={10} color="#1c1c1c">{n}</T>
        </g>
      ))}
      <T x={340} y={204} size={10}>write it once, and every session starts with it</T>
    </svg>
  );
}

export function SkillExamples() {
  return (
    <CardGrid
      cols={3}
      h={70}
      aria="Six everyday skills a team writes: review a pull request, write tests, write a commit message, scaffold an endpoint, debug a failing CI run, and draft release notes."
      items={[
        { title: "review-pr", lines: ["review a diff by checklist"] },
        { title: "write-tests", lines: ["add tests in our style"] },
        { title: "commit-message", lines: ["summarize the staged diff"] },
        { title: "new-endpoint", lines: ["route + service + test"] },
        { title: "debug-ci", lines: ["read a failing CI log"] },
        { title: "release-notes", lines: ["merged PRs into notes"] },
      ]}
    />
  );
}

export function PermissionModes({ tool }: { tool: ToolId }) {
  const modes: [string, string, Kind][] =
    tool === "claude"
      ? [["Plan", "reads only, proposes", "ok"], ["Default", "asks each action", "service"], ["Accept edits", "edits free, asks to run", "primary"], ["Auto", "AI judges the risk", "warn"], ["Bypass", "no prompts at all", "fail"]]
      : [["Read-only", "browses, asks to change", "ok"], ["Auto", "edits the workspace, asks outside", "primary"], ["Full access", "no sandbox, no prompts", "fail"]];
  const n = modes.length;
  const w = n === 5 ? 120 : 200;
  const gap = (660 - n * w) / (n - 1);
  return (
    <svg viewBox="0 0 680 120" role="img" aria-label="Permission modes from most careful to most free. Claude Code: plan, default, accept edits, auto, bypass. Codex: read-only, auto, full access. The freest mode belongs only in a throwaway sandbox.">
      <T x={10} y={16} anchor="start" size={10} color="#8e5fd6" bold>MORE FREEDOM, MORE RISK</T>
      {modes.map(([t, s2, k], i) => (
        <g key={t}>
          <Box x={10 + i * (w + gap)} y={26} w={w} h={52} label={t} sub={s2} kind={k} size={12} />
          {i < n - 1 && <Arrow d={`M${10 + i * (w + gap) + w + 2},52 L${10 + (i + 1) * (w + gap) - 2},52`} />}
        </g>
      ))}
      <T x={340} y={104} size={10} color="#1c1c1c">
        {tool === "claude" ? "Press Shift+Tab to cycle modes. Bypass belongs in a throwaway sandbox only." : "Choose the mode at startup or with a slash command. Full access only in a sandbox."}
      </T>
    </svg>
  );
}

export function HookExamples() {
  const rows: [string, string][] = [
    ["After every edit", "format and lint the changed file"],
    ["Before a commit", "run the tests, stop if they fail"],
    ["Before a shell command", "block rm -rf and force-push"],
    ["Before reading files", "block .env and secret files"],
    ["When it needs you", "send a desktop or Slack ping"],
  ];
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="Common hooks: format and lint after every edit, run tests before a commit, block dangerous shell commands, block reading secret files, and send a notification when the agent needs you.">
      {rows.map(([a, b], i) => (
        <g key={a}>
          <Box x={10} y={6 + i * 48} w={230} h={40} label={a} kind="service" size={11.5} />
          <Arrow d={`M242,${26 + i * 48} L268,${26 + i * 48}`} />
          <Box x={270} y={6 + i * 48} w={400} h={40} label={b} kind="ok" size={11.5} />
        </g>
      ))}
    </svg>
  );
}

export function KnowledgeBase({ tool }: { tool: ToolId }) {
  const docs: [string, string][] = [
    ["docs/architecture.md", "layers, folders, data flow"],
    ["docs/conventions.md", "naming, errors, patterns"],
    ["docs/testing.md", "how to run and write tests"],
  ];
  return (
    <svg viewBox="0 0 680 186" role="img" aria-label="The instructions file stays short and links to a small knowledge base of markdown files covering architecture, conventions, and testing, so the agent reads only what it needs.">
      <Box x={10} y={64} w={200} h={60} label={tool === "claude" ? "CLAUDE.md" : "AGENTS.md"} sub="short index, read every session" kind="primary" />
      {docs.map(([t, s2], i) => (
        <g key={t}>
          <Arrow d={`M212,94 L278,${30 + i * 62}`} />
          <Box x={280} y={8 + i * 62} w={390} h={44} label={t} sub={s2} kind="service" size={11.5} />
        </g>
      ))}
    </svg>
  );
}

export function ContextFill({ tool }: { tool: ToolId }) {
  const segs: [string, number, string, string][] = [
    [tool === "claude" ? "CLAUDE.md + tools" : "AGENTS.md + tools", 120, "#eef3ff", "#7ea6e0"],
    ["Chat", 120, "#f3eefc", "#8e5fd6"],
    ["File reads", 150, "#fff7e0", "#e8b400"],
    ["Command output", 160, "#fff1e6", "#e8a060"],
    ["Free", 110, "#f5f5f5", "#bbbbbb"],
  ];
  let x = 10;
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="An agent's context fills with instructions, chat, file reads, and command output as a session goes on. Three fixes: start a new chat for a new task, compact to summarize the old chat, and subagents that research in their own window and return a summary.">
      <T x={10} y={20} anchor="start" size={11} color="#1c1c1c" bold>What fills the agent&apos;s context as a session runs</T>
      {segs.map(([label, w, fill, stroke]) => {
        const sx = x;
        x += w;
        return (
          <g key={label}>
            <rect x={sx} y={32} width={w} height={40} fill={fill} stroke={stroke} strokeDasharray={label === "Free" ? "4 3" : undefined} />
            <T x={sx + w / 2} y={57} size={10} color="#1c1c1c">{label}</T>
          </g>
        );
      })}
      <Box x={10} y={100} w={210} h={64} label={tool === "claude" ? "/clear" : "/new"} sub="new task, fresh start" kind="ok" />
      <Box x={235} y={100} w={210} h={64} label="/compact" sub="summarize the old chat" kind="service" />
      <Box x={460} y={100} w={210} h={64} label="Subagent" sub="researches in its own window" kind="primary" />
      <T x={340} y={188} size={10} color="#1c1c1c">The agent fills this itself, by reading files and running commands.</T>
    </svg>
  );
}

export function SecurityBasics({ tool }: { tool: ToolId }) {
  return (
    <CardGrid
      cols={2}
      h={96}
      aria="Four security basics when coding with AI: keep secrets out of prompts, review what the AI writes, limit what it is allowed to do, and use only company-approved tools."
      items={[
        { title: "Keep secrets out", lines: ["never paste keys or customer data", tool === "claude" ? "deny reading .env in settings" : "keep .env out of the workspace"] },
        { title: "Review what it writes", lines: ["check auth, input checks, SQL", "confirm every new dependency is real"] },
        { title: "Limit its power", lines: ["no production credentials", tool === "claude" ? "bypass mode only in a sandbox" : "full access only in a sandbox"] },
        { title: "Use approved tools", lines: ["company accounts and tools only", "know your company's data rules"] },
      ]}
    />
  );
}

export function CodeFirstTests() {
  return (
    <Steps
      aria="Code first, then tests: write the code, ask the agent for tests covering the happy path and edge cases, run them and fix failures, then break the code on purpose to prove the tests catch bugs."
      steps={[["1 Write the code", "you or the agent", "service"], ["2 Ask for tests", "happy path + edge cases", "primary"], ["3 Run them", "fix what fails", "ok"], ["4 Break it", "do the tests catch a bug?", "warn"]]}
      note="AI-written tests often pass trivially: prove they can fail"
    />
  );
}

export function WorkflowSummary() {
  return (
    <Steps
      w={120}
      aria="My AI workflow in five steps: plan first, give context, build in small steps, verify with tests and checks, and review every line myself."
      steps={[["1 Plan", "agent proposes first", "service"], ["2 Context", "rules file + focus", "primary"], ["3 Build", "small steps", "service"], ["4 Verify", "tests, lint, hooks", "ok"], ["5 Review", "I own every line", "warn"]]}
      note="The AI writes the draft; I own the result"
    />
  );
}

export function DailyDevLoop() {
  return (
    <Steps
      w={120}
      aria="AI in a developer's day: take a ticket, have the agent build it locally, open a pull request, let CI and a Claude review bot check it automatically, then a human approves and merges."
      steps={[["1 Ticket", "bug or feature", "service"], ["2 Agent builds", "plan, code, tests", "primary"], ["3 Open PR", "small diff", "service"], ["4 Bots check", "CI + Claude review", "ok"], ["5 Human merges", "I own every line", "warn"]]}
      note="AI is in the loop at steps 2 and 4; a person is always at step 5"
    />
  );
}

export function UnattendedChecks() {
  return (
    <Steps
      aria="Four checks for a run you did not watch: read the diff itself, make tests a hook that gates the turn, check a headless run by its JSON result and exit code, and get a cold second opinion from a fresh session."
      steps={[["1 Read the diff", "before the summary", "primary"], ["2 Test hook", "exit 2 blocks the turn", "ok"], ["3 Headless run", "JSON result + exit code", "service"], ["4 Cold review", "fresh session, no history", "warn"]]}
      note="The less you watched, the more you verify"
    />
  );
}
