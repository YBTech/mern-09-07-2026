// Diagrams for Notes.tsx (Tools, MCP & the Agent Loop). One component per picture; arrowheads come from the
// <ArrowDefs /> in Notes.tsx.
import type { ReactNode } from "react";
import { Arrow, Box, T } from "../../components/Diagram";

function Mini({ x, y, w = 44, label, kind = "#7ea6e0" }: { x: number; y: number; w?: number; label: string; kind?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={4} fill="#fff" stroke={kind} strokeWidth="1.3" />
      <T x={x + w / 2} y={y + 17} size={9} color="#1c1c1c">{label}</T>
    </g>
  );
}

function Card({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#fff" stroke="#d6dbe6" />
      {children}
    </g>
  );
}

export function ToolDesignRules() {
  const cards: [string, string, string][] = [
    ["Few, sharp tools", "overlapping tools confuse the model", "merge or remove near-duplicates"],
    ["Describe like docs", "when to use it, and when not to", "the description is the interface"],
    ["Narrow inputs", "enums and ids, not free text", "validate every argument"],
    ["Idempotent", "safe to call twice", "idempotency key for any write"],
    ["Helpful errors", "say what to fix, not a stack trace", "the model reads and recovers"],
    ["Small outputs", "only the fields needed", "paginate; summarize big results"],
  ];
  return (
    <svg viewBox="0 0 680 218" role="img" aria-label="Six rules for designing tools an LLM can use reliably: few sharp tools, descriptions written like documentation, narrow inputs, idempotent calls, helpful error messages, and small outputs.">
      {cards.map(([t, a, b], i) => {
        const x = 10 + (i % 3) * 225;
        const y = 8 + Math.floor(i / 3) * 106;
        return (
          <Card key={t} x={x} y={y} w={210} h={96}>
            <T x={x + 14} y={y + 26} anchor="start" size={12} color="#1c1c1c" bold>{t}</T>
            <T x={x + 14} y={y + 52} anchor="start" size={9.5}>{a}</T>
            <T x={x + 14} y={y + 72} anchor="start" size={9.5} color="#2e7d32">{b}</T>
          </Card>
        );
      })}
    </svg>
  );
}

// ───────────────────────── 1. what an LLM cannot do ─────────────────────────

export function NoHands() {
  const cant = ["send an email", "create a calendar event", "query your database"];
  return (
    <svg viewBox="0 0 680 222" role="img" aria-label="An LLM only turns text into text. Asked to add lunch to a calendar, it can reply 'Done, it's added!', but nothing happened: it cannot send email, create events, or query a database on its own.">
      <Box x={10} y={40} w={170} h={56} label="You" sub="“Add lunch with Sam Friday 1pm”" />
      <Arrow d="M182,68 L238,68" />
      <Box x={240} y={30} w={200} h={76} label="LLM" sub="text in → text out" kind="primary" size={14} />
      <Arrow d="M442,68 L498,68" />
      <Box x={500} y={40} w={170} h={56} label="“Done, it's added!”" sub="just text: nothing happened" kind="warn" size={11} />
      {cant.map((c, i) => (
        <Box key={c} x={10 + i * 230} y={136} w={200} h={44} label={`✗ ${c}`} sub="it has no hands" kind="fail" size={11} />
      ))}
      <T x={340} y={208} size={11} color="#1c1c1c" bold>Your calendar is still empty. A model can only write text.</T>
    </svg>
  );
}

// ───────────────────────── 2. let it pick ─────────────────────────

export function PickAnOption() {
  return (
    <svg viewBox="0 0 680 246" role="img" aria-label="A model can choose between options you describe. Asked to pick an activity for a rainy day, it answers B. The same trick works for functions: describe create_event and list_events, the model replies with JSON naming the function and its arguments, and your code runs the function.">
      <T x={10} y={18} anchor="start" size={10} color="#8e5fd6" bold>IT CAN CHOOSE</T>
      <Box x={10} y={28} w={170} h={56} label="Rainy Saturday. Pick one:" sub="A picnic · B cinema · C hike" size={11} />
      <Arrow d="M182,56 L208,56" />
      <Box x={210} y={28} w={90} h={56} label="LLM" kind="primary" />
      <Arrow d="M302,56 L328,56" />
      <Box x={330} y={28} w={170} h={56} label="“B”" sub="a sensible choice" kind="ok" />

      <T x={10} y={124} anchor="start" size={10} color="#8e5fd6" bold>SO LET IT CHOOSE A FUNCTION</T>
      <Box x={10} y={134} w={170} h={66} label="Functions you may ask for:" sub="create_event · list_events" size={11} />
      <Arrow d="M182,167 L208,167" />
      <Box x={210} y={134} w={90} h={66} label="LLM" kind="primary" />
      <Arrow d="M302,167 L328,167" />
      <Box x={330} y={134} w={170} h={66} label="{ tool, args }" sub="“create_event”, { title, date, time }" size={11} />
      <Arrow d="M502,167 L528,167" ink="green" />
      <Box x={530} y={134} w={140} h={66} label="Your code runs it" sub="createEvent(args)" kind="ok" size={11} />
      <T x={340} y={232} size={11} color="#c0392b" bold>The model only picks. Your code does the work.</T>
    </svg>
  );
}

// ───────────────────────── 3. built-in tool use ─────────────────────────

export function ToolRoundTrip() {
  const steps: [string, string, string, "service" | "primary" | "ok"][] = [
    ["1 Send", "messages + tools", "tools: [create_event]", "service"],
    ["2 Model asks", "a tool_use block", "create_event, {…}", "primary"],
    ["3 You run it", "your own function", "createEvent(input)", "ok"],
    ["4 Send result", "a tool_result block", "“Created, id 42”", "service"],
    ["5 Model answers", "plain text", "“Added for Friday!”", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="One tool call takes two API calls: send the messages and tool definitions, the model replies with a tool_use block, your code runs the function, you send back a tool_result, and the model writes the final answer.">
      {steps.map(([t, s, ex, k], i) => (
        <g key={t}>
          <Box x={10 + i * 136} y={20} w={116} h={52} label={t} sub={s} kind={k} size={11} />
          {i < 4 && <Arrow d={`M${128 + i * 136},46 L${144 + i * 136},46`} />}
          <T x={68 + i * 136} y={90} size={9} color="#1c1c1c">{ex}</T>
        </g>
      ))}
      <T x={340} y={130} size={11} color="#1c1c1c" bold>Two API calls. The model never touches the calendar.</T>
    </svg>
  );
}

// ───────────────────────── 4. many tools ─────────────────────────

export function MessyVsTidy() {
  const cols: { x: number; title: string; lines: string[]; ink: string }[] = [
    { x: 10, title: "Spread out", ink: "#c0392b", lines: ["schemas in one list at the top", "a switch(name) somewhere else", "add a tool → edit 3 places", "the schema and the code drift apart"] },
    { x: 345, title: "One object per tool", ink: "#2e7d32", lines: ["{ name, description, schema, run }", "the list of objects = the registry", "add a tool → add one object", "one generic line runs any tool"] },
  ];
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="With many tools, keeping schemas in one place and a switch statement in another gets messy. Keeping each tool's name, description, schema and run function in one object, collected in a list, makes adding a tool a one-place change.">
      {cols.map((c) => (
        <Card key={c.title} x={c.x} y={8} w={325} h={150}>
          <T x={c.x + 16} y={32} anchor="start" size={13} color="#1c1c1c" bold>{c.title}</T>
          {c.lines.map((l, j) => (
            <T key={l} x={c.x + 16} y={60 + j * 24} anchor="start" size={10.5} color={j >= 2 ? c.ink : undefined}>{l}</T>
          ))}
        </Card>
      ))}
      <T x={340} y={182} size={11} color="#1c1c1c" bold>Same tools, same API call. Only the code is easier to manage.</T>
    </svg>
  );
}

// ───────────────────────── 5. MCP ─────────────────────────

export function PlugAnalogy() {
  const apps = ["Your app", "Claude Desktop", "IDE"];
  const services = ["Calendar", "GitHub", "Database"];
  const ys = [34, 84, 134];
  return (
    <svg viewBox="0 0 680 246" role="img" aria-label="Without MCP every app writes its own integration for every service: three apps times three services is nine integrations. With MCP each app and each service plugs into one standard once: three plus three. Like USB-C, any device works with any charger.">
      <T x={170} y={18} size={11} color="#c0392b" bold>Without MCP: 3 × 3 = 9 integrations</T>
      {ys.map((ya) => ys.map((ys2) => (
        <path key={`${ya}-${ys2}`} d={`M102,${ya + 15} L238,${ys2 + 15}`} stroke="#d98b8b" strokeWidth="1.2" fill="none" />
      )))}
      {apps.map((a, i) => <Box key={a} x={10} y={ys[i]} w={90} h={30} label={a} size={9.5} />)}
      {services.map((s, i) => <Box key={s} x={240} y={ys[i]} w={80} h={30} label={s} kind="broker" size={9.5} />)}

      <T x={515} y={18} size={11} color="#2e7d32" bold>With MCP: 3 + 3, each plugs in once</T>
      {ys.map((y) => (
        <g key={y}>
          <path d={`M448,${y + 15} L486,${y + 15}`} stroke="#7dbb7d" strokeWidth="1.5" />
          <path d={`M528,${y + 15} L588,${y + 15}`} stroke="#7dbb7d" strokeWidth="1.5" />
        </g>
      ))}
      {apps.map((a, i) => <Box key={a} x={356} y={ys[i]} w={90} h={30} label={a} size={9.5} />)}
      <Box x={488} y={30} w={38} h={138} label="MCP" kind="primary" size={10} />
      {services.map((s, i) => <Box key={s} x={590} y={ys[i]} w={80} h={30} label={s} kind="broker" size={9.5} />)}

      <T x={340} y={206} size={11} color="#1c1c1c" bold>Like USB-C: any device works with any charger.</T>
      <T x={340} y={226} size={10}>Write a calendar integration once, as an MCP server, and every MCP app can use it.</T>
    </svg>
  );
}

export function McpBackendFlow() {
  const left: [string, string][] = [["2. here are the tools", "M268,112 L122,112"], ["3. call create_event", "M122,138 L268,138"], ["5. here is the result", "M268,236 L122,236"]];
  const right: [string, string][] = [["1. what tools do you have?", "M412,62 L558,62"], ["the list of tools", "M558,88 L412,88"], ["4. run create_event", "M412,186 L558,186"], ["the result", "M558,212 L412,212"]];
  return (
    <svg viewBox="0 0 680 280" role="img" aria-label="How MCP fits together: your backend contains an MCP client. The client asks the MCP server what tools it has. The backend gives those tools to the AI model. When the model asks for a tool, the backend forwards the call through the client to the MCP server and sends the result back to the model. The model never talks to the server directly.">
      <rect x={10} y={24} width={110} height={236} rx={8} fill="#fff8e1" stroke="#e8b400" strokeWidth="1.5" />
      <T x={65} y={46} size={12} color="#1c1c1c" bold>AI model</T>
      <T x={65} y={62} size={9}>Claude</T>
      <T x={65} y={150} size={9}>only writes text,</T>
      <T x={65} y={164} size={9}>never touches</T>
      <T x={65} y={178} size={9}>the server</T>
      <rect x={270} y={24} width={140} height={236} rx={8} fill="#eef4fd" stroke="#7ea6e0" strokeWidth="1.5" />
      <T x={340} y={46} size={12} color="#1c1c1c" bold>Your backend</T>
      <T x={340} y={62} size={9}>the MCP host</T>
      <Mini x={285} y={100} w={110} label="MCP client" kind="#4a78c2" />
      <T x={340} y={150} size={9}>talks to the model</T>
      <T x={340} y={164} size={9}>and to the server</T>
      <T x={340} y={178} size={9}>for it</T>
      <rect x={560} y={24} width={110} height={236} rx={8} fill="#eaf6ea" stroke="#7dbb7d" strokeWidth="1.5" />
      <T x={615} y={46} size={12} color="#1c1c1c" bold>MCP server</T>
      <T x={615} y={62} size={9}>holds the tools</T>
      <Mini x={570} y={100} w={90} label="create_event" kind="#e8b400" />
      <Mini x={570} y={132} w={90} label="list_events" kind="#e8b400" />
      <Mini x={570} y={164} w={90} label="get_weather" kind="#e8b400" />
      {left.map(([t, p]) => (
        <g key={t}>
          <Arrow d={p} />
          <T x={195} y={Number(p.split(",")[1].split(" ")[0]) - 6} size={10.5} color="#1c1c1c" bold>{t}</T>
        </g>
      ))}
      {right.map(([t, p]) => (
        <g key={t}>
          <Arrow d={p} />
          <T x={485} y={Number(p.split(",")[1].split(" ")[0]) - 6} size={10.5} color="#1c1c1c" bold>{t}</T>
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────── 3. propose, do not execute ─────────────────────────

export function ProposeApprove() {
  const steps: [string, string, "primary" | "service" | "broker" | "fail" | "ok"][] = [
    ["Agent", "reads and decides", "primary"],
    ["propose_refund", "a tool that only asks", "service"],
    ["refund_proposals", "status: pending", "broker"],
    ["Human approves", "in a dashboard", "fail"],
    ["Refund API runs", "authorized again", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 206" role="img" aria-label="Propose then approve: the agent calls a propose tool that only writes a pending proposal; a human approves it in a dashboard; then the normal, authorized API performs the action. The agent has no tool that executes the write.">
      {steps.map(([t, s, k], i) => (
        <g key={t}>
          <Box x={10 + i * 138} y={24} w={116} h={52} label={t} sub={s} kind={k} size={10.5} />
          {i < 4 && <Arrow d={`M${128 + i * 138},50 L${146 + i * 138},50`} />}
        </g>
      ))}
      <Box x={10} y={104} w={325} h={46} label="No tool that executes the write exists" sub="the agent can only ask; it cannot be talked into doing" kind="fail" size={11} />
      <Box x={345} y={104} w={325} h={46} label="The write goes through the normal API" sub="with the same authorization any request would face" kind="ok" size={11} />
      <T x={340} y={184} size={11} color="#1c1c1c" bold>Anything that changes money, data, or access gets a human in the middle.</T>
    </svg>
  );
}

// ───────────────────────── 5. building and consuming an MCP server ─────────────────────────

export function McpBuildConsume() {
  const cols: { x: number; title: string; steps: string[] }[] = [
    { x: 10, title: "You write a server", steps: ["1  wrap your function once", "2  give it a name, schema, handler", "3  run it: stdio (local) or HTTP", "4  every MCP host can now use it"] },
    { x: 345, title: "You use a server", steps: ["1  add it to the host's config", "2  its tools appear to the model", "3  review the code, pin the version", "4  grant the least access it needs"] },
  ];
  return (
    <svg viewBox="0 0 680 232" role="img" aria-label="Two sides of MCP: writing a server means wrapping a function once with a name, schema and handler and running it over stdio or HTTP; using a server means adding it to a host's configuration, reviewing and pinning it, and granting the least access. A third-party server runs with your permissions.">
      {cols.map((c) => (
        <Card key={c.title} x={c.x} y={8} w={325} h={150}>
          <T x={c.x + 16} y={32} anchor="start" size={13} color="#1c1c1c" bold>{c.title}</T>
          {c.steps.map((s, j) => (
            <T key={s} x={c.x + 16} y={60 + j * 24} anchor="start" size={10.5}>{s}</T>
          ))}
        </Card>
      ))}
      <Box x={10} y={172} w={660} h={48} label="A server runs with your permissions" sub="treat a third-party server like a dependency you install: review it, pin it, limit it" kind="warn" size={11.5} />
    </svg>
  );
}

// ───────────────────────── 6. from loop to agent ─────────────────────────

export function ReactLoop() {
  const stops: [string, string][] = [
    ["No tool call", "stop_reason: end_turn"],
    ["Turn cap hit", "stop, report, never loop forever"],
    ["Budget spent", "tokens or time ran out"],
    ["Needs approval", "pause for a human"],
  ];
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="An agent is the tool-calling loop repeated: think, act with a tool call, observe the tool result, and repeat until the model answers without a tool call, a turn cap is reached, a budget is spent, or a human approval is needed. Coding tools such as Claude Code and Codex run exactly this loop with tools for reading files, editing files, and running commands.">
      <Box x={10} y={34} w={150} h={50} label="Think" sub="the model decides the next step" kind="primary" size={12} />
      <Box x={205} y={34} w={150} h={50} label="Act" sub="it asks for tools (tool_use)" size={12} />
      <Box x={400} y={34} w={150} h={50} label="Observe" sub="your code returns the result" kind="broker" size={12} />
      <Arrow d="M162,59 L203,59" /><Arrow d="M357,59 L398,59" />
      <Arrow d="M475,86 L475,112 L85,112 L85,86" ink="purple" dashed />
      <T x={280} y={106} size={9.5} color="#6a3fb5">repeat</T>
      <T x={585} y={52} anchor="middle" size={10} color="#1c1c1c" bold>one pass</T>
      <T x={585} y={68} anchor="middle" size={10}>= one turn</T>
      <T x={14} y={142} anchor="start" size={10} color="#8e5fd6" bold>THE LOOP ENDS WHEN</T>
      {stops.map(([t, s], i) => (
        <Box key={t} x={10 + i * 168} y={152} w={158} h={46} label={t} sub={s} kind={i === 1 ? "warn" : "service"} size={10.5} />
      ))}
      <T x={340} y={228} size={11} color="#1c1c1c" bold>Claude Code and Codex run this exact loop:</T>
      <T x={340} y={244} size={10}>their tools are read a file, edit a file, and run a command.</T>
    </svg>
  );
}
