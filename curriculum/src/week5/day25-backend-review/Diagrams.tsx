// Diagrams for Notes.tsx. One component per picture; arrowheads come from the <ArrowDefs /> in Notes.tsx.
import { Arrow, Box, T } from "../../components/Diagram";

// ───────────────────────── 2. where does state live ─────────────────────────

export function StateLadder() {
  const steps: { label: string; sub: string; kind: "muted" | "service" | "primary" | "ok"; why: string[] }[] = [
    { label: "useState", sub: "one component", kind: "muted", why: ["start here"] },
    { label: "Lift up", sub: "nearest parent", kind: "service", why: ["two siblings", "need it"] },
    { label: "Context", sub: "theme, auth, locale", kind: "service", why: ["prop drilling", "gets painful"] },
    { label: "Redux Toolkit", sub: "cart, many readers", kind: "primary", why: ["changes often,", "many readers"] },
    { label: "Server cache", sub: "React Query", kind: "ok", why: ["it is really", "API data"] },
  ];
  return (
    <svg viewBox="0 0 680 150" role="img" aria-label="A ladder of five places for frontend state: useState, lifted state, Context, Redux, and a server cache, each reached when the previous one starts to hurt.">
      {steps.map((s, i) => {
        const x = 12 + i * 138;
        return (
          <g key={s.label}>
            <Box x={x} y={16} w={104} h={52} label={s.label} sub={s.sub} kind={s.kind} size={11} />
            {s.why.map((line, j) => (
              <T key={line} x={x + 52} y={96 + j * 14}>{line}</T>
            ))}
            {i < steps.length - 1 && <Arrow d={`M${x + 106},42 L${x + 136},42`} />}
          </g>
        );
      })}
      <T x={340} y={142} size={10.5} color="#1c1c1c">move right only when the current spot starts to hurt</T>
    </svg>
  );
}

// ───────────────────────── 3. frontend performance ─────────────────────────

export function FrontendPerf() {
  const rows: [string, string][] = [
    ["Whole list re-renders per keystroke", "React.memo row + useCallback handler"],
    ["Same filter recomputed every render", "useMemo (only after you measured)"],
    ["Big JS bundle delays first paint", "lazy() + Suspense code splitting"],
    ["API call fires on every keystroke", "debounce the input"],
  ];
  return (
    <svg viewBox="0 0 680 280" role="img" aria-label="Frontend slowness has four common causes, each with a one-line fix: memo for needless re-renders, useMemo for repeated work, lazy loading for big bundles, and debounce for chatty inputs.">
      <Box x={20} y={10} w={150} h={40} label="Render" sub="run components" />
      <Box x={215} y={10} w={150} h={40} label="Commit" sub="update the DOM" />
      <Box x={410} y={10} w={190} h={40} label="Paint" sub="what the user sees (LCP · CLS · INP)" />
      <Arrow d="M172,30 L213,30" />
      <Arrow d="M367,30 L408,30" />
      {rows.map(([cause, fix], i) => (
        <g key={cause}>
          <Box x={20} y={78 + i * 50} w={280} h={36} label={cause} kind="warn" size={11} />
          <Arrow d={`M302,${96 + i * 50} L378,${96 + i * 50}`} />
          <Box x={380} y={78 + i * 50} w={280} h={36} label={fix} kind="ok" size={11} />
        </g>
      ))}
    </svg>
  );
}

// ───────────────────────── 4. one order, end to end ─────────────────────────

export function OrderSequence() {
  const lanes = [
    { x: 50, label: "Browser", sub: "" },
    { x: 155, label: "Gateway", sub: "" },
    { x: 260, label: "Orders", sub: "" },
    { x: 365, label: "Postgres", sub: "" },
    { x: 470, label: "Kafka", sub: "" },
    { x: 590, label: "Consumers", sub: "inventory + email" },
  ];
  const hops: { from: number; to: number; label: string; dashed?: boolean; ink?: "dark" | "green" }[] = [
    { from: 0, to: 1, label: "1 POST + JWT" },
    { from: 1, to: 2, label: "2 verified" },
    { from: 2, to: 3, label: "3 txn insert" },
    { from: 2, to: 4, label: "4 order.placed" },
    { from: 2, to: 0, label: "5 201 Created", dashed: true },
    { from: 4, to: 5, label: "6 deliver" },
    { from: 5, to: 2, label: "7 status event" },
    { from: 2, to: 0, label: "8 WebSocket push", dashed: true, ink: "green" },
  ];
  return (
    <svg viewBox="0 0 680 310" role="img" aria-label="One order in eight numbered hops: the browser posts with a token, the gateway verifies it, Orders inserts in a transaction and publishes an event, answers 201, the consumers react, and a WebSocket pushes the new status back.">
      {lanes.map((l) => (
        <g key={l.label}>
          <line x1={l.x} x2={l.x} y1={48} y2={300} stroke="#ccc" strokeDasharray="3,4" />
          <Box x={l.x - 44} y={6} w={88} h={l.sub ? 40 : 34} label={l.label} sub={l.sub || undefined} size={11} kind={l.label === "Orders" ? "primary" : l.label === "Postgres" || l.label === "Kafka" ? "broker" : "service"} />
        </g>
      ))}
      {hops.map((h, i) => {
        const y = 78 + i * 29;
        const x1 = lanes[h.from].x;
        const x2 = lanes[h.to].x;
        const dir = x2 > x1 ? 1 : -1;
        return (
          <g key={h.label}>
            <Arrow d={`M${x1 + dir * 2},${y} L${x2 - dir * 4},${y}`} dashed={h.dashed} ink={h.ink} />
            <T x={(x1 + x2) / 2} y={y - 5} size={10} color="#1c1c1c">{h.label}</T>
          </g>
        );
      })}
    </svg>
  );
}

// ───────────────────────── 5. who may touch what ─────────────────────────

export function OwnershipAndAuth() {
  return (
    <svg viewBox="0 0 680 240" role="img" aria-label="Two checks and one rule: the gateway verifies who you are, the service checks the thing is yours, and each service owns its own database that no other service reads.">
      <Box x={10} y={14} w={90} h={46} label="Client" sub="sends a JWT" kind="muted" />
      <Box x={150} y={14} w={190} h={46} label="Gateway" sub="who are you? bad token → 401" />
      <Box x={390} y={14} w={200} h={46} label="Service layer" sub="is it yours? not yours → 403" kind="primary" />
      <Arrow d="M102,37 L148,37" />
      <Arrow d="M342,37 L388,37" />
      <T x={340} y={84} size={10.5} color="#c0392b">skip the second check and any logged-in user can read anyone's order (IDOR)</T>
      {[40, 270, 500].map((x, i) => (
        <g key={x}>
          <Box x={x} y={118} w={110} h={40} label={["Catalog", "Orders", "Inventory"][i]} size={11} />
          <Box x={x} y={190} w={110} h={40} label={["Catalog DB", "Orders DB", "Inventory DB"][i]} kind="broker" size={11} />
          <Arrow d={`M${x + 55},160 L${x + 55},188`} />
        </g>
      ))}
      <T x={210} y={146} size={9.5} color="#c0392b">✗ no shared tables</T>
      <T x={440} y={146} size={9.5} color="#c0392b">✗ no shared tables</T>
    </svg>
  );
}

// ───────────────────────── 6. sync vs async ─────────────────────────

export function SyncVsAsync() {
  const Card = ({ x, title, sub, items, cost, kind }: { x: number; title: string; sub: string; items: string[]; cost: string; kind: "service" | "broker" }) => (
    <g>
      <rect x={x} y={4} width={320} height={232} rx={8} fill="#fff" stroke="#d6dbe6" />
      <T x={x + 14} y={28} anchor="start" size={14} color="#1c1c1c" bold>{title}</T>
      <T x={x + 14} y={46} anchor="start" size={10.5}>{sub}</T>
      {items.map((it, i) => (
        <Box key={it} x={x + 14} y={62 + i * 44} w={292} h={34} label={it} kind={kind} size={11} />
      ))}
      <Box x={x + 14} y={196} w={292} h={32} label={cost} kind="warn" size={10} />
    </g>
  );
  return (
    <svg viewBox="0 0 680 240" role="img" aria-label="Two kinds of service-to-service call: ones that stay synchronous HTTP because the caller needs the answer, and ones that become events because nobody should wait for them.">
      <Card x={10} title="Stays HTTP" sub="the caller needs the answer to continue" items={["log in → get a token", "read a product and its price", "check who owns an order"]} cost="cost: the caller fails if the callee is down" kind="service" />
      <Card x={350} title="Becomes an event" sub="nobody should wait for the result" items={["reserve stock", "send the confirmation email", "analytics, loyalty points"]} cost="cost: duplicates + eventual consistency" kind="broker" />
    </svg>
  );
}

// ───────────────────────── 7. cache-aside ─────────────────────────

export function CacheAside() {
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="Cache-aside: the service asks Redis first; a hit returns immediately, a miss reads Postgres and stores the result with a TTL. A write updates Postgres and then deletes the key, and skipping that delete leaves stale reads.">
      <Box x={20} y={62} w={110} h={46} label="Service" sub="GET /products/7" />
      <Box x={200} y={62} w={110} h={46} label="Redis" sub="product:7" kind="broker" />
      <Box x={410} y={14} w={130} h={40} label="HIT → return" sub="sub-millisecond" kind="ok" />
      <Box x={410} y={96} w={130} h={46} label="Postgres" sub="the source of truth" kind="broker" />
      <Arrow d="M132,85 L198,85" />
      <T x={165} y={78}>1 GET</T>
      <Arrow d="M312,72 L408,38" ink="green" />
      <Arrow d="M312,98 L408,116" ink="orange" />
      <T x={372} y={96} color="#e08a3c">2 miss</T>
      <Arrow d="M475,144 L475,176 L255,176 L255,110" />
      <T x={365} y={170}>3 SET key + TTL</T>
      <Box x={20} y={206} w={140} h={40} label="PUT /products/7" kind="muted" size={11} />
      <Box x={200} y={206} w={140} h={40} label="UPDATE Postgres" kind="broker" size={11} />
      <Box x={380} y={206} w={110} h={40} label="DEL key" kind="fail" size={11} />
      <Arrow d="M162,226 L198,226" />
      <Arrow d="M342,226 L378,226" />
      <T x={505} y={221} anchor="start" color="#c0392b">skip the DEL →</T>
      <T x={505} y={236} anchor="start" color="#c0392b">stale reads until the TTL</T>
    </svg>
  );
}

// ───────────────────────── 8. what every boundary cost ─────────────────────────

export function BoundaryCosts() {
  const rows: [string, string, string][] = [
    ["Controller / service / repo", "One reason to change per layer", "More files for a trivial endpoint"],
    ["Redux store", "One predictable place for shared state", "Boilerplate for small state"],
    ["Gateway", "One door: auth, limits, routing", "An extra hop, a single choke point"],
    ["Service split", "Independent deploy and scaling", "Network calls, no shared transaction"],
    ["Database per service", "One owner for every table", "No joins; eventual consistency"],
    ["Events instead of HTTP", "Fan-out; publisher blind to consumers", "Duplicates; consumers must dedupe"],
    ["Redis cache", "Fast reads, the database relaxes", "Stale data and invalidation"],
    ["WebSocket", "Push instead of poll", "Stateful, harder to scale out"],
    ["CI/CD gate", "Every change tested and shippable", "Slower merges, a pipeline to maintain"],
  ];
  return (
    <svg viewBox="0 0 680 392" role="img" aria-label="Nine architectural boundaries, each shown with what it bought in green and what it cost in orange.">
      <T x={10} y={16} anchor="start" size={11} color="#1c1c1c" bold>Boundary</T>
      <T x={180} y={16} anchor="start" size={11} color="#2e7d32" bold>Bought</T>
      <T x={462} y={16} anchor="start" size={11} color="#c0702a" bold>Cost</T>
      {rows.map(([b, bought, cost], i) => {
        const y = 26 + i * 40;
        return (
          <g key={b}>
            <T x={10} y={y + 21} anchor="start" size={10.5} color="#1c1c1c" bold>{b}</T>
            <Box x={178} y={y} w={254} h={32} label={bought} kind="ok" size={10} />
            <Arrow d={`M434,${y + 16} L458,${y + 16}`} />
            <Box x={460} y={y} w={212} h={32} label={cost} kind="warn" size={10} />
          </g>
        );
      })}
    </svg>
  );
}

// ───────────────────────── 9. ticket to production ─────────────────────────

export function Pipeline() {
  const top = [
    ["Ticket", "story + criteria"],
    ["Branch + PR", "teammate reviews"],
    ["CI", "lint · unit · integration"],
    ["Image", "one Docker image"],
  ];
  const bottom = [
    ["Watch", "alerts · traces"],
    ["Prod", "the same image"],
    ["Approve", "a human gate"],
    ["Dev", "auto-deploy · e2e"],
  ];
  const x = (i: number) => 10 + i * 172;
  return (
    <svg viewBox="0 0 680 240" role="img" aria-label="The path of a change: ticket, branch and pull request, CI, one Docker image, automatic deploy to dev with end-to-end tests, human approval, the same image to prod, then watching alerts, with rollback as redeploying an older image.">
      {top.map(([l, s], i) => (
        <Box key={l} x={x(i)} y={16} w={130} h={52} label={l} sub={s} kind={l === "CI" ? "primary" : "service"} />
      ))}
      {bottom.map(([l, s], i) => (
        <Box key={l} x={x(i)} y={126} w={130} h={52} label={l} sub={s} kind={l === "Approve" ? "primary" : l === "Watch" ? "ok" : "service"} />
      ))}
      <Arrow d="M142,42 L180,42" />
      <Arrow d="M314,42 L352,42" />
      <Arrow d="M486,42 L524,42" />
      <Arrow d="M575,70 L575,124" />
      <Arrow d="M524,152 L486,152" />
      <Arrow d="M352,152 L314,152" />
      <Arrow d="M180,152 L142,152" />
      <Arrow d="M75,180 L75,226 L247,226 L247,180" ink="red" dashed />
      <T x={161} y={219} color="#c0392b">rollback = redeploy an older image</T>
    </svg>
  );
}

// ───────────────────────── BIG PICTURES ─────────────────────────

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill="#fff7e0" stroke="#e8b400" strokeWidth="1.5" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1c1c1c">{n}</text>
    </g>
  );
}

function Band({ y, h, label }: { y: number; h: number; label: string }) {
  return (
    <g>
      <rect x={96} y={y} width={578} height={h} rx={8} fill="#fafbfd" stroke="#e3e8f0" />
      <T x={10} y={y + 18} anchor="start" size={10} color="#8e5fd6" bold>{label}</T>
    </g>
  );
}

function Chips({ x, y, labels }: { x: number; y: number; labels: string[] }) {
  return (
    <g>
      {labels.map((l, i) => (
        <g key={l}>
          <rect x={x + i * 62} y={y} width={56} height={22} rx={4} fill="#fff" stroke="#7ea6e0" />
          <T x={x + i * 62 + 28} y={y + 14} size={9} color="#1c1c1c">{l}</T>
        </g>
      ))}
    </g>
  );
}

/** Big picture 1: every runtime piece in one stack, with the order's path numbered 1–7. */
export function BigArchitecture() {
  return (
    <svg viewBox="0 0 680 770" role="img" aria-label="The full runtime architecture as seven layers from the browser down to the platform, with one order's path through it numbered one to seven.">
      <Band y={8} h={126} label="BROWSER" />
      <Box x={106} y={26} w={130} h={46} label="Components" sub="memo · lazy · keys" />
      <Box x={256} y={26} w={120} h={46} label="Redux store" sub="cart · auth slices" kind="primary" />
      <Box x={396} y={26} w={120} h={46} label="fetch + JWT" sub="debounced, async" />
      <Box x={536} y={26} w={116} h={46} label="WebSocket" sub="order status push" kind="ok" />
      <Arrow d="M238,49 L254,49" />
      <Arrow d="M378,49 L394,49" />
      <Box x={106} y={86} w={190} h={30} label="Core Web Vitals: LCP · INP · CLS" kind="muted" size={9.5} />
      <Box x={306} y={86} w={120} h={30} label="JWT kept in memory" kind="muted" size={9.5} />

      <Band y={146} h={50} label="EDGE" />
      <Box x={106} y={156} w={80} h={30} label="DNS" size={11} kind="muted" />
      <Box x={206} y={156} w={170} h={30} label="CDN · static JS and CSS" size={10.5} kind="muted" />
      <Box x={406} y={156} w={140} h={30} label="Load balancer" size={11} />
      <Arrow d="M456,74 L456,154" />
      <Badge x={472} y={114} n={1} />

      <Band y={208} h={52} label="GATEWAY" />
      <Box x={256} y={216} w={290} h={36} label="API Gateway" sub="TLS · rate limit · verify JWT · CORS · route" />
      <Arrow d="M456,188 L456,214" />
      <Badge x={472} y={200} n={2} />

      <Band y={272} h={176} label="SERVICES" />
      <Box x={106} y={286} w={200} h={94} label="" kind="service" />
      <T x={206} y={302} size={11} color="#1c1c1c" bold>Catalog service</T>
      <Chips x={114} y={312} labels={["Controller", "Service", "Repo"]} />
      <T x={206} y={358} size={9}>one rule per layer</T>
      <Box x={366} y={286} w={200} h={94} label="" kind="primary" />
      <T x={466} y={302} size={11} color="#1c1c1c" bold>Orders service</T>
      <Chips x={374} y={312} labels={["Controller", "Service", "Repo"]} />
      <T x={466} y={358} size={9}>owner check · idempotency key</T>
      <Arrow d="M280,254 L280,284" />
      <Arrow d="M480,254 L480,284" />
      <Badge x={494} y={268} n={3} />
      <Box x={106} y={398} w={84} h={36} label="Redis" sub="cache-aside" kind="broker" size={11} />
      <Box x={206} y={398} w={100} h={36} label="Catalog DB" sub="indexed" kind="broker" size={11} />
      <Box x={366} y={398} w={120} h={36} label="Orders DB" sub="transaction" kind="broker" size={11} />
      <Arrow d="M148,382 L148,396" />
      <Arrow d="M256,382 L256,396" />
      <Arrow d="M426,382 L426,396" />
      <Badge x={442} y={390} n={4} />

      <Band y={460} h={64} label="MESSAGING" />
      <Box x={106} y={470} w={200} h={44} label="Dead letter queue" sub="poison messages parked" kind="fail" size={11} />
      <Box x={356} y={470} w={300} h={44} label="Kafka · order.placed" sub="partitions P0 P1 P2 · key = orderId · replayable log" kind="broker" size={11} />
      <Arrow d="M354,492 L308,492" ink="red" dashed />

      <Band y={536} h={76} label="CONSUMERS" />
      <Box x={106} y={548} w={180} h={52} label="Inventory" sub="group: inventory · conditional UPDATE" size={11} />
      <Box x={306} y={548} w={170} h={52} label="Notification" sub="group: email · idempotent" size={11} />
      <Box x={496} y={548} w={168} h={52} label="Analytics" sub="new group · replays the log" size={11} />
      <Arrow d="M370,516 L370,530 L196,530 L196,546" />
      <Arrow d="M391,516 L391,546" />
      <Arrow d="M584,516 L584,546" />
      <Badge x={404} y={531} n={6} />

      <Band y={624} h={138} label="PLATFORM" />
      <T x={106} y={640} anchor="start" size={9.5}>every box above emits traces, metrics, and logs</T>
      <Box x={106} y={650} w={130} h={40} label="OpenTelemetry" sub="one instrumented SDK" size={11} />
      <Box x={256} y={650} w={170} h={40} label="Tempo · Loki · Prometheus" sub="traces · logs · metrics" kind="broker" size={10.5} />
      <Box x={446} y={650} w={104} h={40} label="Grafana" sub="dashboards" kind="ok" size={11} />
      <Box x={570} y={650} w={94} h={40} label="On-call" sub="alert pages" kind="fail" size={11} />
      <Arrow d="M238,670 L254,670" />
      <Arrow d="M428,670 L444,670" />
      <Arrow d="M552,670 L568,670" />
      <Box x={106} y={706} w={240} h={42} label="AWS" sub="EC2 / Fargate · RDS · ElastiCache · S3" kind="muted" size={11} />
      <Box x={366} y={706} w={298} h={42} label="Docker image from CI/CD" sub="the same image runs in dev and prod" kind="muted" size={11} />
      <Arrow d="M540,382 L540,468" />
      <Badge x={556} y={430} n={5} />
      <Arrow d="M566,340 L668,340 L668,50 L654,50" ink="green" dashed />
      <Badge x={668} y={200} n={7} />
    </svg>
  );
}

/** Big picture 2: the team's sprint loop wrapped around one ticket's journey to production. */
export function BigDelivery() {
  const x = (i: number) => 14 + i * 136;
  const sprint: [string, string][] = [
    ["Backlog", "epics → stories"],
    ["Planning", "pick + estimate"],
    ["Daily", "stand-up · build"],
    ["Review", "demo the result"],
    ["Retro", "what to improve"],
  ];
  const top: [string, string, "service" | "primary" | "muted"][] = [
    ["Ticket", "story + criteria", "service"],
    ["Branch", "small commits", "service"],
    ["PR + review", "a teammate reads it", "service"],
    ["CI", "lint · unit · integration", "primary"],
    ["Image", "one Docker image", "service"],
  ];
  const bottom: [string, string, "service" | "primary" | "ok"][] = [
    ["Monitor", "alerts · traces", "ok"],
    ["Prod", "flag or canary first", "service"],
    ["Approve", "a human gate", "primary"],
    ["E2E + smoke", "real browser on dev", "service"],
    ["Dev", "auto-deploy on merge", "service"],
  ];
  return (
    <svg viewBox="0 0 680 570" role="img" aria-label="Two loops: the team's sprint cycle from backlog to retro, and one ticket's path from branch through CI, image, dev, approval, and prod to monitoring, with rollback and incident tickets feeding back, plus the test pyramid, environments, and release-safety tools.">
      <T x={14} y={18} anchor="start" size={10} color="#8e5fd6" bold>THE TEAM'S RHYTHM · one sprint, about two weeks</T>
      {sprint.map(([l, s], i) => (
        <g key={l}>
          <Box x={x(i)} y={28} w={108} h={50} label={l} sub={s} size={11} kind="muted" />
          {i < 4 && <Arrow d={`M${x(i) + 110},53 L${x(i) + 134},53`} />}
        </g>
      ))}
      <Arrow d="M622,80 L622,100 L68,100 L68,80" ink="purple" dashed />
      <T x={345} y={95} color="#8e5fd6">the next sprint starts from the backlog again</T>

      <T x={14} y={138} anchor="start" size={10} color="#8e5fd6" bold>A TICKET'S JOURNEY · from idea to users</T>
      {top.map(([l, s, k], i) => (
        <g key={l}>
          <Box x={x(i)} y={150} w={108} h={52} label={l} sub={s} kind={k} size={11} />
          {i < 4 && <Arrow d={`M${x(i) + 110},176 L${x(i) + 134},176`} />}
        </g>
      ))}
      <Arrow d="M622,204 L622,240" />
      {bottom.map(([l, s, k], i) => (
        <g key={l}>
          <Box x={x(i)} y={242} w={108} h={52} label={l} sub={s} kind={k} size={11} />
          {i < 4 && <Arrow d={`M${x(i) + 134},268 L${x(i) + 110},268`} />}
        </g>
      ))}
      <Arrow d="M40,240 L40,204" ink="purple" dashed />
      <T x={48} y={226} anchor="start" size={9} color="#8e5fd6">incident → new ticket</T>
      <Arrow d="M68,296 L68,318 L204,318 L204,296" ink="red" dashed />
      <T x={136} y={332} color="#c0392b">rollback: redeploy the previous image</T>

      <T x={14} y={366} anchor="start" size={10} color="#8e5fd6" bold>WHAT KEEPS EACH STEP SAFE</T>
      <rect x={14} y={376} width={204} height={186} rx={8} fill="#fff" stroke="#d6dbe6" />
      <T x={26} y={396} anchor="start" size={12} color="#1c1c1c" bold>Test pyramid</T>
      <polygon points="74,412 58,448 90,448" fill="#fdf3f3" stroke="#d98b8b" />
      <polygon points="58,448 90,448 107,486 41,486" fill="#fff7e0" stroke="#e8b400" />
      <polygon points="41,486 107,486 124,524 24,524" fill="#eef8ee" stroke="#7dbb7d" />
      <T x={132} y={436} anchor="start" size={9} color="#1c1c1c" bold>e2e</T>
      <T x={132} y={448} anchor="start" size={8.5}>few · slow</T>
      <T x={132} y={474} anchor="start" size={9} color="#1c1c1c" bold>integration</T>
      <T x={132} y={486} anchor="start" size={8.5}>some</T>
      <T x={132} y={512} anchor="start" size={9} color="#1c1c1c" bold>unit</T>
      <T x={132} y={524} anchor="start" size={8.5}>many · fast</T>
      <T x={116} y={548} size={9}>more of the cheap, fewer of the dear</T>

      <rect x={234} y={376} width={204} height={186} rx={8} fill="#fff" stroke="#d6dbe6" />
      <T x={246} y={396} anchor="start" size={12} color="#1c1c1c" bold>Git event → environment</T>
      <Box x={246} y={410} w={180} h={34} label="push to a branch" sub="CI only · nothing deployed" size={10.5} kind="muted" />
      <Box x={246} y={460} w={180} h={34} label="merge to main" sub="auto-deploy to dev" size={10.5} kind="service" />
      <Box x={246} y={510} w={180} h={34} label="release click" sub="the same image goes to prod" size={10.5} kind="ok" />
      <Arrow d="M336,445 L336,458" />
      <Arrow d="M336,495 L336,508" />

      <rect x={454} y={376} width={204} height={186} rx={8} fill="#fff" stroke="#d6dbe6" />
      <T x={466} y={396} anchor="start" size={12} color="#1c1c1c" bold>Release safety</T>
      <Box x={466} y={410} w={180} h={28} label="feature flag · ship it dark" size={9.5} kind="service" />
      <Box x={466} y={446} w={180} h={28} label="canary · 5% of traffic first" size={9.5} kind="service" />
      <Box x={466} y={482} w={180} h={28} label="rollback · redeploy old image" size={9.5} kind="warn" />
      <Box x={466} y={518} w={180} h={28} label="on-call · the alert pages a human" size={9.5} kind="fail" />
    </svg>
  );
}

/** Big picture 3: for each layer, what goes wrong, the defence, and the signal that shows it. */
export function BigFailureMap() {
  const rows: [string, string, string, string][] = [
    ["Browser", "Needless re-renders, big bundle", "memo · lazy · debounce", "Core Web Vitals"],
    ["Browser", "Double-click places two orders", "idempotency key", "one order row, same ID"],
    ["Gateway", "Stolen or expired token", "short JWT + refresh token", "401 and refresh rate"],
    ["Service", "Reading someone else's order", "owner check in the service", "integration test: 403"],
    ["Redis", "Stale product price", "DEL on write + TTL", "cache hit ratio"],
    ["Postgres", "Slow query, N+1", "index · JOIN · pagination", "slow-query log, DB span"],
    ["Kafka", "Duplicate delivery", "idempotent consumer", "DLQ depth, dedupe count"],
    ["Inventory", "Oversell under concurrency", "conditional UPDATE + CHECK", "concurrency test"],
    ["Deploy", "A bad release reaches users", "CI gate · canary · rollback", "error-rate and p99 alert"],
  ];
  return (
    <svg viewBox="0 0 680 424" role="img" aria-label="Nine failure modes, one per layer, each shown with the defence that prevents it and the signal that reveals it.">
      <T x={10} y={16} anchor="start" size={11} color="#1c1c1c" bold>Layer</T>
      <T x={84} y={16} anchor="start" size={11} color="#c0702a" bold>What goes wrong</T>
      <T x={330} y={16} anchor="start" size={11} color="#2e7d32" bold>The defence</T>
      <T x={520} y={16} anchor="start" size={11} color="#6a3fb5" bold>The signal</T>
      {rows.map(([layer, bad, fix, signal], i) => {
        const y = 26 + i * 44;
        return (
          <g key={layer + bad}>
            <T x={10} y={y + 21} anchor="start" size={10.5} color="#1c1c1c" bold>{layer}</T>
            <Box x={82} y={y} w={214} h={34} label={bad} kind="warn" size={9.5} />
            <Arrow d={`M298,${y + 17} L326,${y + 17}`} />
            <Box x={328} y={y} w={172} h={34} label={fix} kind="ok" size={9.5} />
            <Arrow d={`M502,${y + 17} L516,${y + 17}`} />
            <Box x={518} y={y} w={154} h={34} label={signal} kind="broker" size={9.5} />
          </g>
        );
      })}
    </svg>
  );
}
