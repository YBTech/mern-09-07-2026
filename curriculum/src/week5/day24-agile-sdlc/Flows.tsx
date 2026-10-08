// Diagrams for Notes.tsx (replacing the tables and long paragraphs). One component per picture.
// Arrowheads come from the <ArrowDefs /> in Notes.tsx.
import { Arrow, Box, T } from "../../components/Diagram";

const COL = {
  ok: ["#eef8ee", "#7dbb7d"],
  warn: ["#fff1e6", "#e8a060"],
  primary: ["#fff7e0", "#e8b400"],
  service: ["#eef3ff", "#7ea6e0"],
} as const;

// ───────────────────────── 3. why waterfall hurts ─────────────────────────

export function WhyHurts() {
  const rows = [
    ["Requirements change", "Month 5: business wants Apple Pay", "The plan can't change", "Design is 'done' — paperwork, or wait a year"],
    ["Feedback comes last", "Users first see it in month 11", "Wrong thing found too late", "'Not what we meant' — after the money is spent"],
    ["Development runs late", "The release date doesn't move", "Testing gets squeezed", "The test phase is what gets cut"],
    ["A year of changes ships at once", "Big-bang release", "Impossible to find the cause", "Which of thousands of changes broke it?"],
    ["90% done", "No half-product to ship early", "Worth zero", "Nothing is usable until the end"],
  ];
  return (
    <svg viewBox="0 0 680 240" role="img" aria-label="Five waterfall problems as cause to effect rows: changing requirements leave the plan stuck, late feedback finds the wrong build too late, a late development squeezes testing, a big-bang release hides the cause of a failure, and 90 percent done is worth zero.">
      {rows.map(([a, as, b, bs], i) => (
        <g key={a}>
          <Box x={10} y={10 + i * 46} w={300} h={38} kind="warn" label={a} sub={as} />
          <Arrow d={`M312,${29 + i * 46} L368,${29 + i * 46}`} />
          <Box x={370} y={10 + i * 46} w={300} h={38} kind="fail" label={b} sub={bs} />
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────── 4. agile manifesto ─────────────────────────

export function Manifesto() {
  const rows = [
    ["Individuals and interactions", "talk to a teammate, don't file a form", "Processes and tools"],
    ["Working software", "demo a running feature, not a slide", "Comprehensive documentation"],
    ["Customer collaboration", "show the client every sprint", "Contract negotiation"],
    ["Responding to change", "re-order the backlog when priorities move", "Following a plan"],
  ];
  return (
    <svg viewBox="0 0 680 218" role="img" aria-label="The four Agile Manifesto values, each with the left side valued over the right: individuals over processes, working software over documentation, customer collaboration over contracts, responding to change over following a plan.">
      {rows.map(([a, as, b], i) => (
        <g key={a}>
          <Box x={10} y={10 + i * 52} w={290} h={44} kind="ok" label={a} sub={as} />
          <T x={340} y={37 + i * 52} size={12} bold color="#1c1c1c">over</T>
          <Box x={380} y={10 + i * 52} w={290} h={44} kind="muted" label={b} />
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────── 5. scrum loop ─────────────────────────

export function ScrumLoop() {
  return (
    <svg viewBox="0 0 680 222" role="img" aria-label="The Scrum loop. The backlog feeds sprint planning, which starts a two-week sprint with a daily standup. Backlog grooming in the middle of the sprint prepares the next sprint's tickets. The sprint ends with a review demo and then a retrospective, and the loop returns to the backlog.">
      <Box x={10} y={30} w={100} h={56} kind="broker" label="Backlog" sub="everything to do" />
      <Arrow d="M112,58 L138,58" />
      <Box x={140} y={30} w={110} h={56} kind="primary" label="Planning" sub="pick the tickets" />
      <Arrow d="M252,58 L288,58" />
      <rect x={290} y={14} width={250} height={88} rx={8} fill="none" stroke="#8e5fd6" strokeDasharray="5,4" />
      <T x={415} y={32} bold size={12} color="#1c1c1c">Sprint · 2 weeks</T>
      <Box x={300} y={42} w={112} h={48} label="Standup" sub="daily, 15 min" />
      <Box x={420} y={42} w={112} h={48} label="Build" sub="code → PR → QA" />
      <Box x={290} y={126} w={250} h={44} kind="broker" dashed label="Backlog grooming" sub="mid-sprint: prep next sprint's tickets" />
      <Arrow d="M415,126 L415,104" />
      <Arrow d="M542,58 L578,58" />
      <Box x={580} y={30} w={90} h={56} kind="ok" label="Review" sub="demo" />
      <Arrow d="M625,86 L625,128" />
      <Box x={580} y={130} w={90} h={46} kind="warn" label="Retro" sub="how we worked" />
      <Arrow d="M625,178 L625,196 L60,196 L60,88" ink="purple" dashed />
      <T x={340} y={212}>the next sprint starts the next morning</T>
    </svg>
  );
}

// ───────────────────────── 6.2 backlog ─────────────────────────

export function BacklogStack() {
  const top = ["Re-route an order · 5", "Live order status · 5", "Order history filter · 3"];
  const rest = ["Email on re-route", "Export orders to CSV", "Rework search?"];
  return (
    <svg viewBox="0 0 680 232" role="img" aria-label="The product backlog drawn as a priority-ordered stack. The top three tickets are detailed and estimated and form the sprint backlog. The lower tickets are vague, one-line ideas that may never be built.">
      <T x={160} y={14} bold color="#1c1c1c">Product backlog (top = most important)</T>
      {top.map((t, i) => (
        <Box key={t} x={10} y={22 + i * 34} w={300} h={28} kind="ok" label={t} size={11} />
      ))}
      {rest.map((t, i) => (
        <Box key={t} x={10} y={124 + i * 34} w={300} h={28} kind="muted" label={t} size={11} dashed={i === 2} />
      ))}
      <path d="M318,22 L326,22 L326,118 L318,118" fill="none" stroke="#7dbb7d" strokeWidth={1.5} />
      <path d="M318,124 L326,124 L326,220 L318,220" fill="none" stroke="#bbb" strokeWidth={1.5} />
      <Box x={350} y={48} w={230} h={44} kind="ok" label="Sprint backlog" sub="detailed + estimated, committed" />
      <Box x={350} y={150} w={230} h={44} kind="muted" label="The rest" sub="one vague line is fine" />
    </svg>
  );
}

// ───────────────────────── 6.6 points ─────────────────────────

export function PointsRuler() {
  const x = (d: number) => 120 + d * 54;
  const rows: [string, number, number, string][] = [
    ["1", 0.5, 1, "half a day to a day"],
    ["2", 1, 2, "1–2 days"],
    ["3", 2, 3, "2–3 days"],
    ["5", 3, 5, "3–5 days"],
    ["8", 5, 7, "about a week or more"],
  ];
  return (
    <svg viewBox="0 0 680 222" role="img" aria-label="A ruler from 0 to 10 working days showing very rough elapsed time per story point size: 1 point is up to a day, 2 is one to two days, 3 is two to three, 5 is three to five, 8 is about a week or more, and 13 or more should be split or researched instead of guessed.">
      {[0, 2, 4, 6, 8, 10].map((d) => (
        <g key={d}>
          <line x1={x(d)} x2={x(d)} y1={8} y2={192} stroke="#e3e8ef" />
          <T x={x(d)} y={210} size={9}>{d === 0 ? "0" : `${d} days`}</T>
        </g>
      ))}
      {rows.map(([p, lo, hi, txt], i) => (
        <g key={p}>
          <T x={10} y={25 + i * 30} anchor="start" size={12} bold color="#1c1c1c">{p} pt</T>
          <rect x={x(lo)} y={10 + i * 30} width={(hi - lo) * 54} height={20} rx={4} fill={p === "8" ? "#fff1e6" : "#eef3ff"} stroke={p === "8" ? "#e8a060" : "#7ea6e0"} strokeWidth={1.5} />
          <T x={x(hi) + 8} y={24 + i * 30} anchor="start">{txt}</T>
        </g>
      ))}
      <T x={10} y={175} anchor="start" size={12} bold color="#1c1c1c">13+</T>
      <Box x={120} y={160} w={250} h={20} kind="fail" label="don't guess — split it or run a spike" size={10} />
    </svg>
  );
}

export function Capacity() {
  return (
    <svg viewBox="0 0 680 140" role="img" aria-label="Velocity capacity. One engineer has 10 working days in a sprint; minus meetings, reviews and rework that is about 8 to 12 points. A team of five has 50 points on paper; minus the tech lead, vacations and on-call it is about 35 to 50 points.">
      <Box x={10} y={10} w={190} h={48} kind="muted" label="10 working days" sub="one engineer, one sprint" />
      <Arrow d="M202,34 L248,34" />
      <Box x={250} y={10} w={190} h={48} kind="warn" label="minus overhead" sub="meetings, reviews, rework" />
      <Arrow d="M442,34 L488,34" />
      <Box x={490} y={10} w={180} h={48} kind="ok" label="≈ 8–12 points" sub="per engineer per sprint" />
      <Box x={10} y={80} w={190} h={48} kind="muted" label="5 developers" sub="5 × 10 = 50 on paper" />
      <Arrow d="M202,104 L248,104" />
      <Box x={250} y={80} w={190} h={48} kind="warn" label="minus even more" sub="tech lead, vacation, on-call" />
      <Arrow d="M442,104 L488,104" />
      <Box x={490} y={80} w={180} h={48} kind="primary" label="≈ 35–50 points" sub="team velocity (rough guide)" />
    </svg>
  );
}

// ───────────────────────── two side-by-side cards ─────────────────────────

type Card = { title: string; kind: keyof typeof COL; lines: string[] };

function Cards({ a, b, label, footer }: { a: Card; b: Card; label: string; footer?: string }) {
  const n = Math.max(a.lines.length, b.lines.length);
  const h = 44 + n * 20;
  const H = h + 20 + (footer ? 24 : 0);
  return (
    <svg viewBox={`0 0 680 ${H}`} role="img" aria-label={label}>
      {[a, b].map((c, k) => {
        const x = 10 + k * 345;
        const [fill, stroke] = COL[c.kind];
        return (
          <g key={c.title}>
            <rect x={x} y={10} width={325} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
            <T x={x + 14} y={34} anchor="start" size={12} bold color="#1c1c1c">{c.title}</T>
            {c.lines.map((l, i) => (
              <T key={l} x={x + 14} y={58 + i * 20} anchor="start" size={11} color="#1c1c1c">{`• ${l}`}</T>
            ))}
          </g>
        );
      })}
      {footer && <T x={340} y={h + 34} size={11} bold color="#1c1c1c">{footer}</T>}
    </svg>
  );
}

export function AiSplit() {
  return (
    <Cards
      label="What AI coding tools change. Faster: boilerplate, CRUD endpoints, tests, small well-defined tickets, getting oriented in new code. Not much faster: clarifying requirements, waiting on reviews and QA, deployment and cross-team dependencies, ambiguous or high-risk work."
      a={{ title: "Faster", kind: "ok", lines: ["Boilerplate and CRUD endpoints", "Tests", "Small, well-defined tickets", "Getting oriented in new code"] }}
      b={{ title: "Not much faster", kind: "warn", lines: ["Clarifying requirements", "Waiting on reviews and QA", "Deployment, cross-team dependencies", "Ambiguous or high-risk work"] }}
      footer="More code gets written → reviewing it is a bigger share of the work"
    />
  );
}

export function GroomingCards() {
  return (
    <Cards
      label="Backlog grooming looks in two directions. Forward: prepare the next sprint by clarifying requirements, adding acceptance criteria, splitting big tickets and estimating. Now: check this sprint, moving at-risk tickets out and swapping urgent ones in."
      a={{ title: "Forward — prepare next sprint", kind: "primary", lines: ["Clarify requirements", "Add missing acceptance criteria", "Split anything too big", "Estimate with planning poker"] }}
      b={{ title: "Now — check this sprint", kind: "service", lines: ["Is everyone on track?", "At-risk tickets → back to backlog", "Urgent ticket in = same-size one out"] }}
    />
  );
}

// ───────────────────────── 7. meetings ─────────────────────────

export function PlanningSteps() {
  const steps = [
    ["1 · Priorities", "PO: top of backlog + sprint goal"],
    ["2 · Walk the tickets", "read acceptance criteria, ask now"],
    ["3 · Confirm points", "vote on anything new"],
    ["4 · Check capacity", "velocity − vacation − on-call"],
    ["5 · Pull tickets in", "top down until capacity is full"],
    ["6 · Assign", "volunteer, or tech lead picks"],
  ];
  return (
    <svg viewBox="0 0 680 164" role="img" aria-label="Sprint planning in six steps: the PO presents priorities and a sprint goal, the team walks through each ticket, confirms story points, checks capacity from velocity minus vacations and on-call, pulls tickets in from the top until full, and assigns them.">
      {steps.map(([t, s], i) => (
        <g key={t}>
          <Box x={10 + (i % 3) * 240} y={10 + Math.floor(i / 3) * 84} w={190} h={54} kind={i === 5 ? "ok" : "service"} label={t} sub={s} />
          {i % 3 < 2 && <Arrow d={`M${202 + (i % 3) * 240},${37 + Math.floor(i / 3) * 84} L${248 + (i % 3) * 240},${37 + Math.floor(i / 3) * 84}`} />}
        </g>
      ))}
      <Arrow d="M585,66 L585,77 L105,77 L105,92" />
    </svg>
  );
}

export function RetroBoard() {
  const cols: [string, "ok" | "fail" | "primary", string, string][] = [
    ["What went well", "ok", "Pairing on the WebSocket work", "unblocked us fast"],
    ["What didn't", "fail", "3 tickets sat in Code Review", "for 2+ days"],
    ["What we'll change", "primary", "Review PRs right after standup", "owner: Alex"],
  ];
  return (
    <svg viewBox="0 0 680 126" role="img" aria-label="A retrospective board with three columns: what went well, what didn't, and what we'll change, each with one example sticky note, and the change has a named owner.">
      {cols.map(([h, k, l1, l2], i) => (
        <g key={h}>
          <Box x={10 + i * 230} y={10} w={210} h={34} kind={k} label={h} />
          <rect x={10 + i * 230} y={52} width={210} height={62} rx={6} fill="#fff" stroke="#e3e8ef" />
          <T x={22 + i * 230} y={78} anchor="start" size={10} color="#1c1c1c">{l1}</T>
          <T x={22 + i * 230} y={94} anchor="start" size={10} color="#1c1c1c">{l2}</T>
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────── 12. confluence ─────────────────────────

export function ConfluenceGrid() {
  const cards: [string, string][] = [
    ["Design doc", "written before coding"],
    ["Requirements", "business need per epic"],
    ["Architecture + API", "diagrams, APIs, data"],
    ["Onboarding guide", "setup, access, contacts"],
    ["Runbooks", "deploy, rollback, alerts"],
    ["Team process", "DoD, branches, reviews"],
    ["Meeting notes", "decisions + actions"],
    ["Releases + postmortems", "what shipped, what broke"],
  ];
  return (
    <svg viewBox="0 0 680 138" role="img" aria-label="What lives in Confluence instead of a ticket: design docs, requirements, architecture and API docs, onboarding guides, runbooks, team process, meeting notes, and release notes with postmortems.">
      {cards.map(([t, s], i) => (
        <Box key={t} x={10 + (i % 4) * 167} y={10 + Math.floor(i / 4) * 64} w={157} h={50} kind={i === 0 ? "primary" : "service"} label={t} sub={s} size={11} />
      ))}
    </svg>
  );
}

// ───────────────────────── 13. AI ─────────────────────────

export function Bottleneck() {
  return (
    <svg viewBox="0 0 680 164" role="img" aria-label="With AI coding tools the share of effort spent writing code shrinks, while the share spent clarifying, reviewing, testing and proving it works grows. The bottleneck moves from typing code to everything around it.">
      <T x={10} y={46} anchor="start" size={12} bold color="#1c1c1c">Before AI</T>
      <Box x={100} y={24} w={330} h={34} kind="ok" label="Writing code" />
      <Box x={432} y={24} w={208} h={34} kind="warn" label="Clarify · review · test" size={11} />
      <T x={10} y={106} anchor="start" size={12} bold color="#1c1c1c">With AI</T>
      <Box x={100} y={84} w={140} h={34} kind="ok" label="Writing code" />
      <Box x={242} y={84} w={398} h={34} kind="warn" label="Clarify · review · test · prove it works" size={11} />
      <T x={370} y={148}>share of the effort — illustrative, not measured</T>
    </svg>
  );
}

// ───────────────────────── 6.6 ad hoc meetings ─────────────────────────

export function AdHocGrid() {
  const cards: [string, string][] = [
    ["Core hours", "daily overlap, e.g. 1–3pm"],
    ["Designer sync", "weekly design review"],
    ["Manager 1-on-1", "weekly or biweekly"],
    ["Design review", "walk through a design doc"],
    ["Cross-team sync", "dependencies, platform"],
    ["Business meeting", "PO / BA + the client"],
    ["Tech talk", "optional, learn together"],
    ["All-hands", "company news, monthly"],
  ];
  return (
    <svg viewBox="0 0 680 138" role="img" aria-label="Common ad hoc meetings outside the Scrum ceremonies: core hours, designer sync, manager one-on-one, design review, cross-team sync, business meeting with the client, tech talk, and company all-hands.">
      {cards.map(([t, s], i) => (
        <Box key={t} x={10 + (i % 4) * 167} y={10 + Math.floor(i / 4) * 64} w={157} h={50} kind={i === 0 ? "primary" : "service"} dashed={i !== 0} label={t} sub={s} size={11} />
      ))}
    </svg>
  );
}
