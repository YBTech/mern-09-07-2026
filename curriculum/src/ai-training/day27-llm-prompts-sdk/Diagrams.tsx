// Diagrams for Notes.tsx (LLM Fundamentals, Prompting & SDK). One component per picture; arrowheads come from the
// <ArrowDefs /> in Notes.tsx.
import type { ReactNode } from "react";
import { Arrow, Box, T } from "../../components/Diagram";
import type { Kind } from "../../components/Diagram";

function Card({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#fff" stroke="#d6dbe6" />
      {children}
    </g>
  );
}

export function ContextBudget() {
  const segs: [string, number, string][] = [
    ["system", 70, "#dbe6fb"],
    ["tools", 90, "#e6dcf6"],
    ["retrieved docs", 170, "#fde9b8"],
    ["history", 190, "#d3ecd3"],
    ["user", 50, "#fbd9d9"],
    ["answer", 70, "#eeeeee"],
  ];
  let x = 20;
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="The context window is one fixed budget shared by the system prompt, tool definitions, retrieved documents, history, the user message and room for the answer; when it fills, you summarize, slide a window, or retrieve on demand, and an unchanged prefix can be cached.">
      <T x={20} y={20} anchor="start" size={11} color="#1c1c1c" bold>One context window = everything the model reads and writes in a single call</T>
      {segs.map(([label, w, fill]) => {
        const seg = (
          <g key={label}>
            <rect x={x} y={34} width={w} height={44} fill={fill} stroke="#fff" strokeWidth="2" />
            <T x={x + w / 2} y={60} size={10} color="#1c1c1c">{label}</T>
          </g>
        );
        x += w;
        return seg;
      })}
      <T x={20} y={98} anchor="start" size={9.5}>stable parts first</T>
      <T x={660} y={98} anchor="end" size={9.5}>grows every turn</T>
      <T x={340} y={124} size={11} color="#1c1c1c" bold>When it fills up</T>
      <Box x={20} y={134} w={200} h={56} label="Summarize" sub="compress old turns into notes" kind="service" />
      <Box x={240} y={134} w={200} h={56} label="Slide a window" sub="keep only the last N turns" kind="service" />
      <Box x={460} y={134} w={200} h={56} label="Retrieve" sub="pull facts in on demand (RAG)" kind="service" />
      <Box x={20} y={212} w={640} h={44} label="Prompt caching: an unchanged prefix is cheaper and faster, so put stable content first" kind="ok" size={11} />
    </svg>
  );
}

export function PromptParts() {
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="A prompt is the whole request: a system prompt the developer writes once, optional earlier messages such as chat history or examples, and the latest user message, which can hold data your app pasted in plus the question the user typed.">
      <T x={10} y={16} anchor="start" size={11} color="#1c1c1c" bold>One request = one prompt. Who writes each part?</T>
      <T x={10} y={50} anchor="start" size={10.5} color="#1c1c1c" bold>You, the developer</T>
      <T x={10} y={66} anchor="start" size={9.5}>written once, same every call</T>
      <Box x={170} y={30} w={500} h={50} label="system" sub="who the model is · the rules · the output format" kind="primary" size={12} />
      <T x={10} y={112} anchor="start" size={10.5} color="#1c1c1c" bold>Your app (optional)</T>
      <T x={10} y={128} anchor="start" size={9.5}>chat history or examples</T>
      <Box x={170} y={96} w={500} h={44} label="earlier messages" sub="user → assistant → user → …" kind="service" dashed size={12} />
      <T x={10} y={184} anchor="start" size={10.5} color="#1c1c1c" bold>Your app + the user</T>
      <T x={10} y={200} anchor="start" size={9.5}>data pasted in, then the question</T>
      <rect x={170} y={156} width={500} height={86} rx={6} fill="#f7f9ff" stroke="#7ea6e0" strokeWidth="1.5" />
      <T x={184} y={174} anchor="start" size={11} color="#1c1c1c" bold>latest user message</T>
      <Box x={184} y={182} w={226} h={50} label="context (optional)" sub="<order> PT-123456, shipped </order>" kind="ok" size={11} />
      <Box x={430} y={182} w={226} h={50} label="the user's question" sub="“Where is my book?”" kind="service" size={11} />
    </svg>
  );
}

export function ReliabilityLadder() {
  const rows: [string, string, string][] = [
    ["Ask for JSON in the prompt", "nothing", "chatty text, code fences"],
    ["+ an example of the JSON", "the format, usually", "still not guaranteed"],
    ["Structured output (schema)", "valid JSON in your shape", "values your app rejects"],
    ["+ Zod validation + retry", "shape and your own rules", "wrong facts: evals"],
  ];
  return (
    <svg viewBox="0 0 680 206" role="img" aria-label="The fixes stacked up: asking for JSON guarantees nothing, adding an example usually fixes the format, structured output guarantees valid JSON in your shape, and Zod validation with a retry also enforces your own rules; only evals catch a wrong answer.">
      <T x={10} y={16} anchor="start" size={11} color="#1c1c1c" bold>Method</T>
      <T x={250} y={16} anchor="start" size={11} color="#2e7d32" bold>Guarantees</T>
      <T x={490} y={16} anchor="start" size={11} color="#c0702a" bold>Can still fail with</T>
      {rows.map(([m, g, f], i) => {
        const y = 26 + i * 44;
        return (
          <g key={m}>
            <Box x={10} y={y} w={210} h={34} label={m} size={10} />
            <Arrow d={`M222,${y + 17} L246,${y + 17}`} />
            <Box x={248} y={y} w={210} h={34} label={g} kind="ok" size={10} />
            <Arrow d={`M460,${y + 17} L484,${y + 17}`} />
            <Box x={486} y={y} w={184} h={34} label={f} kind="warn" size={9.5} />
          </g>
        );
      })}
    </svg>
  );
}

export function RepairLoop() {
  return (
    <svg viewBox="0 0 680 176" role="img" aria-label="The validate-and-repair loop: call the model, validate the output against the schema and rules; if it passes use it, if it fails add the error message to the conversation and retry up to two times, then escalate to a human or a fallback.">
      <Box x={10} y={36} w={100} h={48} label="LLM call" sub="schema attached" kind="primary" />
      <Box x={150} y={36} w={110} h={48} label="Validate" sub="schema + rules" />
      <Box x={310} y={10} w={140} h={40} label="Use the data" kind="ok" size={11} />
      <Box x={310} y={92} w={190} h={44} label="Add the error, retry" sub="the model sees what was wrong" kind="warn" size={11} />
      <Box x={540} y={92} w={130} h={44} label="Escalate" sub="human or fallback" kind="fail" size={11} />
      <Arrow d="M112,60 L148,60" />
      <Arrow d="M262,50 L308,34" ink="green" />
      <T x={286} y={36} size={9} color="#2e7d32">pass</T>
      <Arrow d="M262,70 L308,108" ink="orange" />
      <T x={282} y={96} size={9} color="#c0702a">fail</T>
      <Arrow d="M308,126 L60,126 L60,86" ink="orange" dashed />
      <T x={184} y={142} size={9.5} color="#c0702a">max 2 retries</T>
      <Arrow d="M502,114 L538,114" ink="red" />
      <T x={520} y={106} size={9} color="#c0392b">still bad</T>
    </svg>
  );
}

// ───────────────────────── 4. choosing a model ─────────────────────────

// ───────────────────────── 5. the SDK in practice ─────────────────────────

// ───────────────────────── 6. prompt, RAG, or fine-tune ─────────────────────────

export function PromptRagFinetune() {
  const cards: [string, string, string, string, "ok" | "service" | "warn"][] = [
    ["Prompt", "change what you ask", "minutes to try, cheapest", "try this first", "ok"],
    ["RAG", "give it your facts per question", "fresh data, with citations", "a retrieval pipeline to run", "service"],
    ["Fine-tune", "change how it behaves", "teaches style and format", "not for facts; a training job", "warn"],
  ];
  const fill = { ok: "#eef8ee", service: "#eef3ff", warn: "#fff1e6" };
  const stroke = { ok: "#7dbb7d", service: "#7ea6e0", warn: "#e8a060" };
  return (
    <svg viewBox="0 0 680 214" role="img" aria-label="Three ways to improve an LLM feature, in the order to try them: change the prompt, add retrieval so the model sees your facts at question time, and fine-tune only to change style or behavior, never to teach facts.">
      <T x={14} y={16} anchor="start" size={10} color="#8e5fd6" bold>TRY IN THIS ORDER</T>
      {cards.map(([t, a, b, c, k], i) => (
        <g key={t}>
          <rect x={10 + i * 225} y={26} width={210} height={124} rx={8} fill={fill[k]} stroke={stroke[k]} strokeWidth="1.5" />
          <T x={24 + i * 225} y={52} anchor="start" size={14} color="#1c1c1c" bold>{t}</T>
          <T x={24 + i * 225} y={78} anchor="start" size={10} color="#1c1c1c">{a}</T>
          <T x={24 + i * 225} y={98} anchor="start" size={10} color="#2e7d32">{b}</T>
          <T x={24 + i * 225} y={122} anchor="start" size={10} color="#c0702a">{c}</T>
          {i < 2 && <Arrow d={`M${222 + i * 225},88 L${233 + i * 225},88`} />}
        </g>
      ))}
      <T x={340} y={184} size={11} color="#1c1c1c" bold>Fine-tuning changes how a model writes, not what it knows.</T>
      <T x={340} y={202} size={10} color="#5b6b82">For new facts, use retrieval.</T>
    </svg>
  );
}

// ───────────────────────── round 2: deeper call anatomy, techniques, SDK, eval ─────────────────────────

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

function CauseFix({ rows, aria }: { rows: [string, string, string][]; aria: string }) {
  return (
    <svg viewBox={`0 0 680 ${rows.length * 56 + 6}`} role="img" aria-label={aria}>
      {rows.map(([cause, fix, sub], i) => (
        <g key={cause}>
          <Box x={10} y={6 + i * 56} w={250} h={46} label={cause} kind="warn" size={11.5} />
          <Arrow d={`M262,${29 + i * 56} L288,${29 + i * 56}`} />
          <Box x={290} y={6 + i * 56} w={380} h={46} label={fix} sub={sub} kind="ok" size={11.5} />
        </g>
      ))}
    </svg>
  );
}

export function ApiCallAnatomy() {
  const req: [string, string][] = [
    ["model", "which model to run"],
    ["max_tokens", "cap on the reply length"],
    ["system", "the role and the rules"],
    ["messages", "the whole conversation so far"],
    ["temperature", "how random the reply is"],
  ];
  const res: [string, string][] = [
    ["content", "the generated text"],
    ["stop_reason", "end_turn, or max_tokens (cut off)"],
    ["usage", "input and output tokens you pay for"],
  ];
  return (
    <svg viewBox="0 0 680 244" role="img" aria-label="One API call: the request carries the model, max tokens, system prompt, the whole conversation, and temperature; the response carries the generated text, a stop reason that shows whether it was cut off, and the token usage you pay for.">
      <Card x={10} y={8} w={320} h={186}>
        <T x={26} y={32} anchor="start" size={13} color="#1c1c1c" bold>Request</T>
        {req.map(([k, v], i) => (
          <g key={k}>
            <T x={26} y={60 + i * 26} anchor="start" size={11} color="#6a3fb5" bold>{k}</T>
            <T x={118} y={60 + i * 26} anchor="start" size={10.5} color="#1c1c1c">{v}</T>
          </g>
        ))}
      </Card>
      <Arrow d="M332,100 L358,100" />
      <Card x={360} y={8} w={310} h={186}>
        <T x={376} y={32} anchor="start" size={13} color="#1c1c1c" bold>Response</T>
        {res.map(([k, v], i) => (
          <g key={k}>
            {k !== "content" && <rect x={368} y={44 + i * 36} width={294} height={30} rx={5} fill={k === "stop_reason" ? "#fff1e6" : "#fff7e0"} />}
            <T x={376} y={64 + i * 36} anchor="start" size={11} color="#6a3fb5" bold>{k}</T>
            <T x={462} y={64 + i * 36} anchor="start" size={10} color="#1c1c1c">{v}</T>
          </g>
        ))}
      </Card>
      <Box x={10} y={204} w={660} h={34} label="Stateless: every request carries the whole conversation" kind="muted" size={11} />
    </svg>
  );
}

export function SamplingDials() {
  return (
    <CardGrid
      cols={2}
      h={108}
      aria="Four sampling settings: temperature controls randomness, top_p cuts off the unlikely words, max_tokens caps the reply length and cost, and stop sequences end the reply when a chosen text appears."
      items={[
        { title: "temperature", lines: ["how random the next word is", "low: the same answer every time", "high: varied, more creative"] },
        { title: "top_p", lines: ["pick only from the likeliest words", "0.9 = the top words adding up to 90%", "cuts off the strange long tail"] },
        { title: "max_tokens", lines: ["a hard cap on the reply length", "too low cuts the answer off", "also caps what one call can cost"] },
        { title: "stop sequences", lines: ["text that ends the reply early", "e.g. stop when it writes \"</answer>\"", "stop_reason becomes \"stop_sequence\""] },
      ]}
    />
  );
}

// The odds for the next word, and how temperature and top_p reshape them. Every bar and label
// is computed from BASE, so the picture and the numbers cannot disagree.
const WORDS = ["mat", "floor", "sofa", "roof", "moon"];
const BASE = [0.5, 0.25, 0.15, 0.07, 0.03];

function withTemperature(p: number[], t: number) {
  const w = p.map((x) => x ** (1 / t));
  const sum = w.reduce((a, b) => a + b, 0);
  return w.map((x) => x / sum);
}

function withTopP(p: number[], topP: number) {
  let before = 0;
  const keep = p.map((x) => {
    const k = before < topP - 1e-9;
    before += x;
    return k;
  });
  const sum = p.reduce((a, x, i) => a + (keep[i] ? x : 0), 0);
  return p.map((x, i) => (keep[i] ? x / sum : -1)); // -1 = cut
}

export function TokenOdds() {
  const panels: [string, number[], string][] = [
    ["temperature 0.2", withTemperature(BASE, 0.2), "almost always “mat”"],
    ["temperature 0.5", withTemperature(BASE, 0.5), "mostly “mat”"],
    ["temperature 1 (default)", BASE, "any word can win"],
    ["top_p 0.9", withTopP(BASE, 0.9), "“roof”, “moon” impossible"],
  ];
  return (
    <svg viewBox="0 0 680 210" role="img" aria-label="The odds for the next word after 'The cat sat on the': at temperature 1 mat is 50 percent and moon 3 percent; lowering the temperature concentrates almost all the odds on mat; top_p 0.9 keeps only mat, floor and sofa, which add up to 90 percent, and removes roof and moon entirely.">
      <T x={10} y={18} anchor="start" size={11} color="#1c1c1c" bold>Choosing the next word after “The cat sat on the ___”</T>
      {panels.map(([title, probs, caption], i) => {
        const x0 = 10 + i * 167;
        return (
          <g key={title}>
            <rect x={x0} y={30} width={160} height={172} rx={8} fill="#fff" stroke="#d6dbe6" />
            <T x={x0 + 10} y={50} anchor="start" size={10.5} color="#1c1c1c" bold>{title}</T>
            {WORDS.map((word, j) => {
              const y = 62 + j * 20;
              const p = probs[j];
              return (
                <g key={word}>
                  <T x={x0 + 10} y={y + 11} anchor="start" size={9.5} color="#1c1c1c">{word}</T>
                  {p < 0 ? (
                    <T x={x0 + 46} y={y + 11} anchor="start" size={9.5} color="#c0392b" bold>cut</T>
                  ) : (
                    <g>
                      <rect x={x0 + 46} y={y + 2} width={Math.max(1, p * 76)} height={12} rx={2} fill="#7ea6e0" />
                      <T x={x0 + 50 + Math.max(1, p * 76)} y={y + 12} anchor="start" size={9}>{`${Math.round(p * 100)}%`}</T>
                    </g>
                  )}
                </g>
              );
            })}
            <T x={x0 + 80} y={196} size={9.5} color="#b36b1c">{caption}</T>
          </g>
        );
      })}
    </svg>
  );
}

export function CostMath() {
  const rows: [string, string, string, string, Kind][] = [
    ["Small model", "$1 in · $5 out per 1M tokens", "$0.0035", "$3.50", "ok"],
    ["Frontier model", "$5 in · $25 out per 1M tokens", "$0.0175", "$17.50", "warn"],
  ];
  return (
    <svg viewBox="0 0 680 218" role="img" aria-label="A worked cost example with illustrative prices: a request with 2,000 input tokens and 300 output tokens costs about 0.35 cents on a small model and 1.75 cents on a frontier model, which is 3.50 dollars versus 17.50 dollars per 1,000 requests.">
      <T x={10} y={18} anchor="start" size={11} color="#1c1c1c" bold>One request: 2,000 input tokens and 300 output tokens (example prices only)</T>
      {rows.map(([name, price, per, thousand, k], i) => (
        <g key={name}>
          <Box x={10} y={32 + i * 62} w={230} h={50} label={name} sub={price} kind="service" size={12} />
          <Arrow d={`M242,${57 + i * 62} L268,${57 + i * 62}`} />
          <Box x={270} y={32 + i * 62} w={180} h={50} label={per} sub="per request" kind={k} size={13} />
          <Arrow d={`M452,${57 + i * 62} L478,${57 + i * 62}`} />
          <Box x={480} y={32 + i * 62} w={190} h={50} label={thousand} sub="per 1,000 requests" kind={k} size={13} />
        </g>
      ))}
      <Box x={10} y={162} w={660} h={44} label="cost = input tokens × input price + output tokens × output price" sub="check the vendor's pricing page for real numbers" kind="muted" size={11.5} />
    </svg>
  );
}

export function StreamingTimeline() {
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="Without streaming the user sees a blank screen for the whole time and then the full answer at once. With streaming the user waits only for the time to first token and then watches the answer appear.">
      <T x={10} y={20} anchor="start" size={11} color="#1c1c1c" bold>Without streaming</T>
      <rect x={10} y={30} width={520} height={34} rx={5} fill="#f5f5f5" stroke="#bbb" />
      <T x={270} y={52} size={10.5} color="#1c1c1c">blank screen while the model works</T>
      <rect x={530} y={30} width={140} height={34} rx={5} fill="#eef8ee" stroke="#7dbb7d" />
      <T x={600} y={52} size={10.5} color="#1c1c1c">full answer</T>
      <T x={10} y={104} anchor="start" size={11} color="#1c1c1c" bold>With streaming</T>
      <rect x={10} y={114} width={150} height={34} rx={5} fill="#fff1e6" stroke="#e8a060" />
      <T x={85} y={136} size={10.5} color="#1c1c1c">time to first token</T>
      <rect x={160} y={114} width={510} height={34} rx={5} fill="#eef8ee" stroke="#7dbb7d" />
      <T x={415} y={136} size={10.5} color="#1c1c1c">words appear as they are generated</T>
      <T x={340} y={178} size={10}>Same total time, but the user starts reading after the first wait</T>
    </svg>
  );
}

// A card that shows what we send, then what comes back: used by the shots and thinking diagrams.
type Exchange = { title: string; send: string[]; reply: string[]; kind: Kind; caption: string };

function ExchangeCards({ items, aria, replyH = 44 }: { items: Exchange[]; aria: string; replyH?: number }) {
  const w = 213;
  const sendRows = Math.max(...items.map((it) => it.send.length));
  const arrowY = 58 + sendRows * 18;
  const replyY = arrowY + 22;
  const captionY = replyY + replyH + 22;
  const h = captionY + 14;
  return (
    <svg viewBox={`0 0 680 ${h + 16}`} role="img" aria-label={aria}>
      {items.map((it, i) => {
        const x = 10 + i * (w + 10.5);
        return (
          <Card key={it.title} x={x} y={8} w={w} h={h}>
            <T x={x + 14} y={32} anchor="start" size={13} color="#1c1c1c" bold>{it.title}</T>
            {it.send.map((line, j) => (
              <T key={line} x={x + 14} y={56 + j * 18} anchor="start" size={10.5} color="#1c1c1c">{line}</T>
            ))}
            <Arrow d={`M${x + w / 2},${arrowY} L${x + w / 2},${replyY - 4}`} />
            <rect x={x + 10} y={replyY} width={w - 20} height={replyH} rx={6} fill={it.kind === "ok" ? "#eef8ee" : "#fff1e6"} stroke={it.kind === "ok" ? "#7dbb7d" : "#e8a060"} />
            {it.reply.map((line, j) => (
              <T key={line} x={x + w / 2} y={replyY + 18 + j * 16} size={10.5} color="#1c1c1c">{line}</T>
            ))}
            <T x={x + w / 2} y={captionY} size={9.5} color="#b36b1c">{it.caption}</T>
          </Card>
        );
      })}
    </svg>
  );
}

export function ShotsCompare() {
  return (
    <ExchangeCards
      aria="Zero-shot sends only the movie title, so the model guesses the format and adds chatty text. One-shot shows one example, so the model copies its format. Few-shot shows three examples, so every answer comes back as exactly three emojis."
      items={[
        { title: "Zero-shot", send: ["The Lion King"], reply: ["Sure! Here are some emojis:", "🦁👑🌅🐗🐒 Hakuna…"], kind: "warn", caption: "no example: it guesses the format" },
        { title: "One-shot", send: ["Titanic → 🚢🧊💔", "The Lion King →"], reply: ["🦁👑🌅"], kind: "ok", caption: "one example: it copies the format" },
        { title: "Few-shot", send: ["Titanic → 🚢🧊💔", "Finding Nemo → 🐠🔍👨‍👦", "Jaws → 🦈🏊😱", "The Lion King →"], reply: ["🦁👑🌅"], kind: "ok", caption: "a few: the pattern holds every time" },
      ]}
    />
  );
}

export function ThinkingOptions() {
  return (
    <ExchangeCards
      replyH={52}
      aria="The same trick question asked three ways. Asked directly, the model can blurt the intuitive wrong answer of 10 cents. Asked to think step by step, it writes the working and gets 5 cents. A reasoning model thinks privately first and gets 5 cents without being told to."
      items={[
        { title: "1 Ask directly", send: ["Bat + ball cost $1.10.", "The bat is $1 more.", "Ball price? Number only."], reply: ["$0.10  ✗"], kind: "warn", caption: "fast, but can blurt a guess" },
        { title: "2 Chain of thought", send: ["(the same question)", "+ Think step by step,", "then give the answer."], reply: ["ball = x, bat = x + 1", "2x + 1 = 1.10 → $0.05 ✓"], kind: "ok", caption: "the steps cost output tokens" },
        { title: "3 Reasoning model", send: ["(the same question,", "no extra instructions)"], reply: ["[thinks privately first]", "$0.05 ✓"], kind: "ok", caption: "you pay for the thinking tokens" },
      ]}
    />
  );
}

export function PromptMistakes() {
  return (
    <CauseFix
      aria="Six common prompt mistakes, each mapped to its fix: a vague task, no output format, facts the model must guess, user text mixed into instructions, edge cases never shown, and changing many things at once."
      rows={[
        ["Vague task: “write a description”", "Say what, for whom, how long", "audience, length, tone"],
        ["No output format", "Show the format", "an example, or a schema for JSON"],
        ["Facts the model has to guess", "Paste the facts in", "it invents whatever you leave out"],
        ["User text mixed with your rules", "Wrap it in tags", "<review> … </review> is data, not orders"],
        ["Tricky cases never shown", "Add examples of them", "few-shot covers the edge cases"],
        ["Five changes at once", "Change one thing, re-run", "so you know which change helped"],
      ]}
    />
  );
}

export function ShapeVsTruth() {
  const checks: [string, string, Kind][] = [
    ["Schema", "catches a wrong shape", "ok"],
    ["Zod / your own checks", "catch impossible values", "service"],
    ["Evals", "catch a wrong answer", "primary"],
  ];
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="A model can return valid JSON with the wrong answer: the text says lunch at 1pm, but the model returns 01:00, which is 1am. A schema catches a wrong shape, your own checks catch impossible values, and only evals catch a wrong answer.">
      <Card x={10} y={8} w={320} h={180}>
        <T x={26} y={32} anchor="start" size={12} color="#1c1c1c" bold>The model returned</T>
        <T x={26} y={58} anchor="start" size={11} color="#1c1c1c">{`{ "title": "Lunch with Sam", "time": "01:00" }`}</T>
        <T x={26} y={80} anchor="start" size={10.5} color="#2e7d32" bold>✓ valid JSON, passes Zod</T>
        <T x={26} y={112} anchor="start" size={10.5} color="#1c1c1c">The text said:</T>
        <T x={26} y={130} anchor="start" size={10.5} color="#1c1c1c">&quot;Lunch with Sam next Friday at 1pm&quot;</T>
        <T x={26} y={158} anchor="start" size={10.5} color="#c0392b" bold>✗ wrong: 1pm is 13:00, not 01:00 (1am)</T>
      </Card>
      {checks.map(([t, s, k], i) => (
        <Box key={t} x={350} y={8 + i * 62} w={320} h={54} label={t} sub={s} kind={k} size={12} />
      ))}
    </svg>
  );
}

export function StreamToBrowser() {
  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="The model streams tokens to your server, and your server streams them on to the browser, for example as server-sent events. The API key stays on your server.">
      <Box x={10} y={14} w={150} h={52} label="Model API" sub="generates tokens" kind="broker" size={12} />
      <Box x={265} y={14} w={150} h={52} label="Your server" sub="holds the API key" kind="primary" size={12} />
      <Box x={520} y={14} w={150} h={52} label="Browser" sub="shows words as they arrive" kind="service" size={12} />
      <Arrow d="M162,40 L263,40" />
      <Arrow d="M417,40 L518,40" />
      <T x={212} y={32} size={9.5}>stream</T>
      <T x={467} y={32} size={9.5}>SSE</T>
      <Box x={10} y={90} w={660} h={44} label="The API key stays on your server: the browser never calls the model directly" kind="warn" size={11.5} />
    </svg>
  );
}

export function ErrorMap() {
  return (
    <CauseFix
      aria="How to react to API errors: a 400 means fix the request, a 401 means check the key, a 429 means wait and retry with backoff, and a 5xx or timeout means retry a few times and then fail clearly."
      rows={[
        ["400  bad request", "Fix the request", "retrying will not help"],
        ["401  bad API key", "Check the key", "environment variable, not the code"],
        ["429  rate limited", "Wait, then retry", "a growing delay between tries"],
        ["5xx or timeout", "Retry a few times", "then fail with a clear message"],
      ]}
    />
  );
}

export function ModelChoice() {
  return (
    <Steps
      aria="Choosing a model by measuring: start with the smallest tier, run your test cases, check whether the score is good enough, and either ship it or move up one tier."
      steps={[["1 Start small", "the cheapest tier", "service"], ["2 Run your cases", "the same test set", "primary"], ["3 Good enough?", "score vs your bar", "ok"], ["4 Ship it", "keep the name in config", "ok"]]}
      loop={[2, 0, "not good enough? try the next tier up"]}
    />
  );
}

export function EvalLoop() {
  return (
    <Steps
      aria="A classifier eval: write test cases with the right answers, run the prompt with the same settings every time, count how many are correct, change one thing, and run again."
      steps={[["1 Test cases", "10 inputs + answers", "service"], ["2 Run the prompt", "same settings every run", "primary"], ["3 Score", "correct out of total", "ok"], ["4 Change one thing", "then run again", "warn"]]}
      loop={[3, 1, "repeat until it passes your bar"]}
      note="Keep the failures: they show you what to fix next"
    />
  );
}

export function HistoryGrowth() {
  const msgs: [string, "user" | "assistant"][] = [
    ["Hi, I'm Felix", "user"],
    ["Hi Felix!", "assistant"],
    ["What's my name?", "user"],
    ["Felix.", "assistant"],
    ["Spell it", "user"],
  ];
  const calls = [1, 3, 5]; // how many messages each call sends
  return (
    <svg viewBox="0 0 680 228" role="img" aria-label="Each call sends the whole conversation so far: call 1 sends one message, call 2 sends three, call 3 sends five. The newest user message is always last, and the array keeps growing.">
      <T x={80} y={16} anchor="start" size={9.5}>blue = user · green = assistant · yellow = the new message</T>
      {calls.map((count, row) => {
        const y = 28 + row * 50;
        return (
          <g key={count}>
            <T x={10} y={y + 15} anchor="start" size={11} color="#1c1c1c" bold>{`call ${row + 1}`}</T>
            <T x={10} y={y + 29} anchor="start" size={9}>{`sends ${count}`}</T>
            {msgs.slice(0, count).map(([text, role], i) => (
              <Box key={text} x={80 + i * 116} y={y} w={108} h={34} label={text} size={10} kind={i === count - 1 ? "primary" : role === "user" ? "service" : "ok"} />
            ))}
          </g>
        );
      })}
      <Box x={10} y={182} w={660} h={38} label="The model only knows what is in the array you send. Your app keeps the array." kind="muted" size={11} />
    </svg>
  );
}

export function GraderEval() {
  return (
    <Steps
      aria="A prompt eval with a grader model: write test inputs with criteria, run your system prompt to get replies, have a grader model score each reply against the criteria, average the scores, then change the prompt and run again."
      steps={[["1 Test cases", "inputs + criteria", "service"], ["2 Your prompt", "writes the replies", "primary"], ["3 Grader model", "scores each reply", "broker"], ["4 Score", "e.g. 4.3 out of 5", "ok"]]}
      loop={[3, 1, "change the prompt or settings, run again"]}
      note="No single right answer to compare? A grader model reads each reply against your criteria"
    />
  );
}

export function RagFlow() {
  return (
    <Steps
      aria="RAG in four steps: the user asks a question, your app searches your own documents for the best matches, puts those matches into the prompt next to the question, and the model answers from your facts and can cite them."
      steps={[["1 Question", "“Can I return a gift?”", "service"], ["2 Search your docs", "find the 3 best matches", "broker"], ["3 Build the prompt", "matches + question", "primary"], ["4 Answer", "from your facts, cited", "ok"]]}
      note="The model is not retrained: it reads your documents fresh for every question"
    />
  );
}
