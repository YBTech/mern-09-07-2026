// Diagrams for the Day 34 lecture tabs. One component per picture; arrowheads come from the <ArrowDefs /> in Lecture.tsx.
// Colors mean the same thing in every architecture picture:
//   orange = a guardrail   purple = a model / agent   blue = plain code or data   yellow = a human   green = the result
import { Arrow, Box, T } from "../../../components/Diagram";

const GREEN = "#3d8b40";

/* ───────────── the framework ───────────── */

export function DesignSteps() {
  const steps: [string, string][] = [
    ["1 Business", "pain and cost"],
    ["2 Requirements", "must do, how well"],
    ["3 Architecture", "one diagram"],
    ["4 Deep dive", "risks, evals, cost"],
    ["5 Why this shape", "simplest that works"],
  ];
  return (
    <svg viewBox="0 0 680 110" role="img" aria-label="The five design steps in order: the business, the requirements, the architecture, the deep dive, and why this shape.">
      {steps.map(([title, sub], i) => (
        <g key={title}>
          <Box x={6 + i * 136} y={20} w={124} h={56} kind={i === 4 ? "ok" : "service"} label={title} sub={sub} size={12} />
          {i < steps.length - 1 && <Arrow d={`M${132 + i * 136},48 L${142 + i * 136},48`} />}
        </g>
      ))}
      <T x={340} y={102} size={10.5} color="#1c1c1c" bold>Every case study below follows these five steps in this order.</T>
    </svg>
  );
}

export function AutonomyLadder() {
  const rungs: [string, string, string][] = [
    ["Answer only", "a fixed pipeline (RAG)", "Case A"],
    ["Act with approval", "router + tools + a human OK", "Case B"],
    ["Multi-step, a human at the end", "workers + checkpoints + sign-off", "Case C"],
    ["Act alone", "a free agent: rare, high risk", ""],
  ];
  return (
    <svg viewBox="0 0 680 236" role="img" aria-label="The autonomy ladder, from least to most autonomy: answer only, act with approval, multi-step with a human at the end, and act alone. Case A sits on the first rung, case B on the second, case C on the third. Use the simplest rung that solves the problem.">
      {rungs.map(([name, what, caze], i) => {
        const y = 10 + i * 48;
        return (
          <g key={name}>
            <Box x={50 + i * 14} y={y} w={250} h={38} kind={i === 3 ? "muted" : "service"} label={name} size={12} />
            <T x={326 + i * 14} y={y + 23} anchor="start" size={11} color="#33415c">{what}</T>
            {caze && <Box x={590} y={y + 5} w={80} h={28} kind="ok" label={caze} size={11} />}
          </g>
        );
      })}
      <Arrow d="M26,196 L26,12" />
      <T x={36} y={222} anchor="start" size={11} color="#1c1c1c" bold>More autonomy, more risk. Use the simplest rung that solves the problem.</T>
    </svg>
  );
}

/* ───────────── how an insurance claim works ───────────── */

export function ClaimProcess() {
  const steps: [string, string][] = [
    ["1 Report", "first notice of loss"],
    ["2 Documents", "forms, photos"],
    ["3 Coverage", "covered? limits"],
    ["4 Investigate", "adds up? fraud?"],
    ["5 Decide", "approve / deny / ask"],
    ["6 Pay", "less the deductible"],
  ];
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="How an insurance claim works in six steps: the customer reports the loss, sends documents, the insurer checks coverage and limits, investigates whether the claim adds up and whether there are fraud signals, an adjuster decides to approve, deny, ask for more information or refer to the fraud team, and the payout is the approved estimate minus the deductible, capped at the policy limit. An AI system prepares steps 2 to 4; a person still makes the decision in step 5.">
      {steps.map(([title, sub], i) => (
        <g key={title}>
          <Box x={6 + i * 112} y={12} w={102} h={56} kind={i === 4 ? "primary" : "service"} label={title} sub={sub} size={11.5} />
          {i < steps.length - 1 && <Arrow d={`M${108 + i * 112},40 L${118 + i * 112},40`} />}
        </g>
      ))}
      <rect x={118} y={84} width={316} height={26} rx={6} fill="#f3eefc" stroke="#8e5fd6" />
      <T x={276} y={101} size={11} color="#1c1c1c" bold>our system prepares steps 2 to 4</T>
      <rect x={454} y={84} width={102} height={26} rx={6} fill="#fff7e0" stroke="#e8b400" />
      <T x={505} y={101} size={11} color="#1c1c1c" bold>a person decides</T>
      <T x={340} y={142} size={11} color="#1c1c1c" bold>Today an adjuster (a claims employee) does steps 2 to 5 by hand.</T>
      <T x={340} y={160} size={10.5}>Payout = approved estimate − deductible, never more than the policy limit.</T>
      <T x={340} y={178} size={10.5}>SIU = the special investigations unit that looks at suspected fraud.</T>
    </svg>
  );
}

/* ───────────── case A: policy assistant ───────────── */

export function CaseAArchitecture() {
  const answer: [string, string, "warn" | "service" | "broker"][] = [
    ["Question", "", "service"],
    ["Input guard", "", "warn"],
    ["Filtered search", "user's groups", "service"],
    ["Rerank", "best few", "service"],
    ["Model", "answers + cites", "broker"],
    ["Output guard", "citations?", "warn"],
    ["Answer", "", "service"],
  ];
  const ingest = ["Documents", "Parse + chunk", "Embed", "Vector DB"];
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="Case A architecture. Ingest lane, offline: documents are parsed and chunked, embedded, and stored in a vector database with the access groups of each chunk. Answer lane: the question passes an input guard, then a search that is filtered by the user's groups, then a rerank, then the model answers with citations, then an output guard checks the citations and for restricted text, and the answer is shown.">
      <T x={10} y={16} anchor="start" size={11} color="#2e5fa8" bold>Ingest lane (offline)</T>
      {ingest.map((label, i) => (
        <g key={label}>
          <Box x={10 + i * 150} y={24} w={130} h={44} kind={i === 3 ? "ok" : "service"} label={label} sub={i === 3 ? "with access groups" : ""} size={11} />
          {i < ingest.length - 1 && <Arrow d={`M${142 + i * 150},46 L${158 + i * 150},46`} />}
        </g>
      ))}
      <Arrow d="M475,70 L228,142" dashed />
      <T x={400} y={118} size={9.5}>chunks + their groups</T>

      <T x={10} y={132} anchor="start" size={11} color="#2e5fa8" bold>Answer lane</T>
      {answer.map(([label, sub, kind], i) => (
        <g key={label}>
          <Box x={6 + i * 97} y={144} w={86} h={52} kind={kind} label={label} sub={sub} size={10.5} />
          {i < answer.length - 1 && <Arrow d={`M${92 + i * 97},170 L${103 + i * 97},170`} />}
        </g>
      ))}
      <T x={340} y={228} size={10.5} color="#1c1c1c" bold>The permission filter lives inside the search, never after it. Nothing here acts, so no agent.</T>
      <T x={340} y={244} size={9.5}>orange = guard · purple = model · blue = code or data</T>
    </svg>
  );
}

/* ───────────── case B: customer support ───────────── */

export function CaseBArchitecture() {
  const routes: [string, string, "service" | "primary" | "broker"][] = [
    ["Order status", "tools, signed-in user", "service"],
    ["Policy question", "RAG over policies", "service"],
    ["Refund", "propose, then a human OK", "primary"],
    ["Off-topic", "polite decline", "service"],
    ["Talk to a human", "hand-off", "primary"],
    ["Agent with all tools", "multi-part or unclear", "broker"],
  ];
  const top = 8;
  const step = 50;
  const centre = top + (5 * step + 42) / 2;
  return (
    <svg viewBox="0 0 680 352" role="img" aria-label="Case B architecture. A customer message passes an input guard (a keyword filter, then an LLM intent judge) and reaches a router. For a simple request with one clear intent the router picks a fixed path: order status using tools with the signed-in user, a policy question answered with RAG, a refund that is proposed and waits for human approval, an off-topic polite decline, or a hand-off to a human. A multi-part or unclear request goes to an agent that has every tool and loops until it can answer. All paths pass an output guard and the reply is streamed.">
      <Box x={6} y={centre - 26} w={84} h={52} kind="service" label="Message" size={11} />
      <Arrow d={`M92,${centre} L104,${centre}`} />
      <Box x={106} y={centre - 32} w={104} h={64} kind="warn" label="Input guard" sub="keywords + judge" size={11} />
      <Arrow d={`M212,${centre} L226,${centre}`} />
      <Box x={228} y={centre - 32} w={84} h={64} kind="broker" label="Router" sub="one clear intent?" size={11} />
      {routes.map(([label, sub, kind], i) => (
        <g key={label}>
          <Arrow d={`M314,${centre} L356,${top + 21 + i * step}`} />
          <Box x={358} y={top + i * step} w={170} h={42} kind={kind} label={label} sub={sub} size={11} />
          <Arrow d={`M530,${top + 21 + i * step} L566,${centre}`} />
        </g>
      ))}
      <Box x={568} y={centre - 32} w={106} h={64} kind="warn" label="Output guard" sub="then stream the reply" size={11} />
      <T x={340} y={322} size={10.5} color="#1c1c1c" bold>Simple requests take a cheap fixed path. Anything else goes to an agent with every tool.</T>
      <T x={340} y={340} size={9.5}>orange = guard · purple = model · blue = code or data · yellow = human</T>
    </svg>
  );
}

/* a router alone, and a router with a fallback agent: the flaw and the fix */
export function RouterLimit() {
  const rows: [string, string, string, string, "service" | "broker", string, "fail" | "ok"][] = [
    ["Router only", "multi-part message", "Order path", "only the order tools", "service", "“I have no product info”", "fail"],
    ["Router + fallback", "multi-part message", "Agent loop · every tool", "orders · policy · products · refund proposal", "broker", "Answers both parts", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="The limit of a router and its fix. With a router only, a message that needs two things, such as finding the cheapest option and then ordering it, goes to the order path, which has only the order tools, so the assistant says it has no product information. With a fallback, the router sends multi-part or unclear messages to an agent loop that has every tool, so it can answer both parts.">
      {rows.map(([title, msg, path, tools, kind, result, resultKind], i) => {
        const y = 24 + i * 112;
        return (
          <g key={title}>
            <T x={10} y={y - 8} anchor="start" size={11} color={i === 0 ? "#c0392b" : "#3d8b40"} bold>{title}</T>
            <Box x={10} y={y} w={130} h={64} kind="service" label="Message" sub={msg} size={11.5} />
            <Arrow d={`M142,${y + 32} L158,${y + 32}`} />
            <Box x={160} y={y} w={74} h={64} kind="broker" label="Router" size={11.5} />
            <Arrow d={`M236,${y + 32} L252,${y + 32}`} />
            <Box x={254} y={y} w={230} h={64} kind={kind} label={path} sub={tools} size={11.5} />
            <Arrow d={`M486,${y + 32} L502,${y + 32}`} />
            <Box x={504} y={y} w={166} h={64} kind={resultKind} label={result} size={10.5} />
          </g>
        );
      })}
      <T x={340} y={246} size={10.5} color="#1c1c1c" bold>A path can only use the tools it was given. Keep one path that has all of them.</T>
    </svg>
  );
}

/* ───────────── case C: claim intake ───────────── */

export function CaseCArchitecture() {
  return (
    <svg viewBox="0 0 680 318" role="img" aria-label="Case C architecture. Claim documents are screened by a guardrail, then structured extraction reads the fields, then plain code looks up the policy, then an orchestrator plans which checks this claim needs. Three workers run in parallel: a coverage check using RAG over the policy wording, a documents check in plain code, and a fraud check by a model. Their findings are merged into a drafted claim file whose payout is computed in code. An evaluator checks the draft and can send it back for a rewrite at most twice. The state is checkpointed after every step. Then an adjuster approves, denies, asks for more information or refers to the fraud team, and the decision is recorded.">
      <Box x={6} y={10} w={110} h={46} kind="service" label="Claim documents" size={10.5} />
      <Arrow d="M118,33 L132,33" />
      <Box x={134} y={10} w={110} h={46} kind="warn" label="Screen" sub="instructions inside?" size={11} />
      <Arrow d="M246,33 L260,33" />
      <Box x={262} y={10} w={110} h={46} kind="broker" label="Extract" sub="structured output" size={11} />
      <Arrow d="M374,33 L388,33" />
      <Box x={390} y={10} w={110} h={46} kind="service" label="Policy lookup" sub="plain code" size={11} />
      <Arrow d="M502,33 L516,33" />
      <Box x={518} y={10} w={154} h={46} kind="broker" label="Orchestrator" sub="plans the checks" size={11.5} />

      <Arrow d="M595,58 L270,106" />
      <Arrow d="M595,58 L440,106" />
      <Arrow d="M595,58 L610,106" />
      <Box x={196} y={108} w={148} h={50} kind="broker" label="Coverage" sub="worker · RAG" size={11} />
      <Box x={366} y={108} w={148} h={50} kind="service" label="Documents" sub="worker · plain code" size={11} />
      <Box x={536} y={108} w={138} h={50} kind="broker" label="Fraud signals" sub="worker · model" size={11} />
      <T x={100} y={130} size={10.5} color="#2e5fa8" bold>in parallel</T>
      <T x={100} y={145} size={9.5}>each worker has its</T>
      <T x={100} y={158} size={9.5}>own small context</T>

      <Arrow d="M270,160 L440,206" />
      <Arrow d="M440,160 L440,206" />
      <Arrow d="M610,160 L460,206" />
      <Box x={366} y={208} w={148} h={52} kind="broker" label="Draft claim file" sub="payout computed in code" size={10.5} />
      <Arrow d="M364,234 L346,234" />
      <Box x={196} y={208} w={148} h={52} kind="broker" label="Evaluator" sub="max 2 rewrites" size={11} />
      <Arrow d="M194,234 L176,234" />
      <Box x={26} y={208} w={148} h={52} kind="primary" label="Adjuster decides" sub="pause, then resume" size={11} />
      <Arrow d="M100,262 L100,280" />
      <Box x={26} y={282} w={148} h={30} kind="ok" label="Decision recorded" size={10.5} />

      <rect x={186} y={200} width={338} height={68} rx={8} fill="none" stroke={GREEN} strokeDasharray="5,4" />
      <T x={518} y={286} anchor="end" size={10} color={GREEN} bold>state is checkpointed after every step</T>
      <T x={518} y={300} anchor="end" size={9.5}>orange guard · purple model · blue code · yellow human</T>
    </svg>
  );
}

/* inside the coverage worker (RAG) */
export function CoverageInside() {
  const steps: [string, string, "service" | "broker" | "ok"][] = [
    ["Claim fields", "loss type: flood", "service"],
    ["Build a search query", "“flood damage coverage”", "service"],
    ["Search the wording", "RAG over the policy", "service"],
    ["Model reads it", "wording + coverages", "broker"],
    ["Answer", "covered? + sources", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 250" role="img" aria-label="Inside the coverage worker. Solid boxes are built in the demo: take the loss type from the claim fields, build a search query from it, search the policy wording with RAG, let the model read the retrieved wording together with the coverages listed on this policy, and return covered or not with a reason and the sources. Dashed boxes are what you would add in production: hybrid search with a rerank, and a code check that every cited source really was in the retrieved text.">
      {steps.map(([title, sub, kind], i) => (
        <g key={title}>
          <Box x={6 + i * 136} y={22} w={124} h={64} kind={kind} label={title} sub={sub} size={10.5} />
          {i < steps.length - 1 && <Arrow d={`M${132 + i * 136},54 L${142 + i * 136},54`} />}
        </g>
      ))}
      <T x={6} y={14} anchor="start" size={10.5} color="#2e5fa8" bold>Built in the demo</T>
      <Box x={242} y={130} w={196} h={50} kind="service" dashed label="Hybrid search + rerank" sub="keyword and vector, best few first" size={10.5} />
      <Box x={494} y={130} w={180} h={50} kind="warn" dashed label="Check the citations (code)" sub="is each source in the results?" size={10.5} />
      <Arrow d="M340,128 L340,90" dashed />
      <Arrow d="M600,128 L600,90" dashed />
      <T x={340} y={206} size={10.5} color="#1c1c1c" bold>Solid = built in the demo · dashed = what you would add in production</T>
      <T x={340} y={226} size={10}>The worker sees only the claim fields and the policy wording, not the whole case file.</T>
    </svg>
  );
}

/* inside the documents worker (plain code) */
export function DocumentsInside() {
  const rules: [string, string][] = [
    ["Claim form", "always required"],
    ["Repair estimate", "always required"],
    ["Police report", "hit-and-run, theft, or a collision over $5,000"],
  ];
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="Inside the documents worker, which is plain code with no model call. The rules: a claim form is always required, a repair estimate is always required, and a police report is required for a hit-and-run, theft, or a collision over 5,000 dollars. The code compares these rules with the names of the uploaded documents and returns the missing ones.">
      {rules.map(([name, when], i) => (
        <Box key={name} x={10} y={12 + i * 48} w={360} h={40} kind="service" label={name} sub={when} size={11.5} />
      ))}
      <Arrow d="M372,32 L404,76" />
      <Arrow d="M372,80 L404,86" />
      <Arrow d="M372,128 L404,96" />
      <Box x={406} y={52} w={130} h={64} kind="service" label="Compare" sub="vs uploaded names" size={11} />
      <Arrow d="M538,84 L560,84" />
      <Box x={562} y={52} w={108} h={64} kind="warn" label="Missing list" sub="e.g. police report" size={11} />
      <T x={340} y={168} size={10.5} color="#1c1c1c" bold>Exact rules, no judgment: plain code is free, instant, and easy to test. No model call.</T>
      <T x={340} y={186} size={10}>Use a model only for what code cannot decide, such as reading messy text.</T>
    </svg>
  );
}

/* inside the fraud worker */
export function FraudInside() {
  const facts: [string, string][] = [
    ["Days from policy start to loss", "subtracted in code"],
    ["Claims in the last 12 months", "read from the policy record"],
    ["Estimate vs the review threshold", "e.g. just under $5,000"],
    ["The claimant's own description", "e.g. single car, no witnesses"],
  ];
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="Inside the fraud worker. Facts that code computes or reads, such as the days between policy start and loss, the number of claims in the last 12 months, the estimate compared with a review threshold, and the claimant's own description, go to a model that weighs the signals and returns a risk level, the list of signals and whether to refer to the special investigations unit. The rule: refer when the loss is within 30 days of the policy start or there are two or more claims in 12 months. A fraud flag sends the claim to a person; it never denies a claim by itself.">
      {facts.map(([name, sub], i) => (
        <g key={name}>
          <Box x={10} y={10 + i * 50} w={270} h={42} kind="service" label={name} sub={sub} size={11} />
          <Arrow d={`M282,${31 + i * 50} L316,110`} />
        </g>
      ))}
      <Box x={318} y={70} w={150} h={80} kind="broker" label="Model weighs the signals" sub="facts in, judgment out" size={11} />
      <Arrow d="M470,110 L494,110" />
      <Box x={496} y={70} w={176} h={80} kind="ok" label="Risk + signals" sub="and: refer to SIU?" size={11.5} />
      <T x={340} y={226} size={10.5} color="#1c1c1c" bold>Refer when the loss is within 30 days of the policy start, or there are 2+ claims in 12 months.</T>
      <T x={340} y={246} size={10.5}>A fraud flag sends the claim to a person. It never denies a claim by itself.</T>
    </svg>
  );
}

/* the evaluator loop */
export function EvaluatorLoop() {
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="The evaluator loop. The model drafts a claim file, then a second model checks it: does the recommendation match the findings, and is every flagged document mentioned. If it finds problems it lists them and the draft is rewritten, at most twice. If it passes, the draft goes to the adjuster.">
      <Box x={10} y={42} w={150} h={56} kind="broker" label="Draft claim file" sub="payout computed in code" size={11.5} />
      <Arrow d="M162,70 L226,70" />
      <Box x={228} y={42} w={226} h={56} kind="broker" label="Evaluator" sub="a second model checks the draft" size={12} />
      <Arrow d="M456,70 L520,70" />
      <T x={488} y={62} size={9.5} color="#3d8b40" bold>passes</T>
      <Box x={522} y={42} w={148} h={56} kind="primary" label="Adjuster" sub="a person decides" size={12} />
      <path d="M341,42 L341,18 L85,18 L85,40" fill="none" stroke="#c0392b" strokeWidth="1.5" markerEnd="url(#dg-red)" />
      <T x={213} y={12} size={10} color="#c0392b" bold>problems found: rewrite, at most 2 times</T>
      <T x={341} y={122} size={10.5} color="#33415c">1. Does the recommendation match the findings?  (not covered → deny, missing document → ask)</T>
      <T x={341} y={140} size={10.5} color="#33415c">2. Is every flagged document mentioned in the summary?</T>
      <T x={340} y={174} size={10.5} color="#1c1c1c" bold>Never ship the first draft unchecked, and never loop forever.</T>
    </svg>
  );
}
