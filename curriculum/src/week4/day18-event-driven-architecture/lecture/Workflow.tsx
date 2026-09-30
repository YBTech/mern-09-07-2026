import type { ReactNode } from "react";

// A short "how does this store work" panel for the top of the lecture page: every call the
// checkout makes, in order, for both versions. Nothing here talks to the backend.

const BLUE = ["#eef3ff", "#7ea6e0"];
const YELLOW = ["#fff7e0", "#e8b400"];
const PURPLE = ["#fdf0e6", "#e08a3c"]; // the exchange, drawn as a hexagon
const GREY = ["#f5f5f5", "#bbbbbb"];

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      {[
        ["dark", "#444"],
        ["red", "#c0392b"],
        ["green", "#3d8b40"],
        ["orange", "#e08a3c"],
      ].map(([name, color]) => (
        <marker key={name} id={`${id}-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      ))}
    </defs>
  );
}

function Node(props: { x: number; y: number; w: number; h: number; colors: string[]; label: string; sub?: string; dashed?: boolean }) {
  const { x, y, w, h, colors, label, sub, dashed } = props;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={colors[0]} stroke={colors[1]} strokeWidth="1.6" strokeDasharray={dashed ? "5,4" : undefined} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 1 : y + h / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={dashed ? "#888" : "#1c1c1c"}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize="9" fill="#5b6b82">
          {sub}
        </text>
      )}
    </g>
  );
}

/** A numbered dot sitting on an arrow, matching the numbered list beside the diagram. */
function Step({ x, y, n, color = "#1c1c1c" }: { x: number; y: number; n: number; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill="#fff" stroke={color} strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
        {n}
      </text>
    </g>
  );
}

function Caption({ x, y, children, color = "#5b6b82", anchor = "middle" }: { x: number; y: number; children: ReactNode; color?: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="10" fill={color}>
      {children}
    </text>
  );
}

function SyncDiagram() {
  const id = "d18-sync";
  return (
    <svg viewBox="0 0 520 250" role="img" aria-label="Synchronous checkout. 1: the browser posts to Orders. 2: Orders calls Inventory to reserve stock. 3: Orders calls Notifications to send the email. 4: only after both answer, Orders replies to the browser.">
      <ArrowDefs id={id} />
      <Node x={8} y={100} w={90} h={46} colors={GREY} label="Browser" />
      <Node x={190} y={100} w={100} h={46} colors={YELLOW} label="Orders" sub=":4201" />
      <Node x={400} y={22} w={112} h={46} colors={BLUE} label="Inventory" sub=":4202" />
      <Node x={400} y={178} w={112} h={46} colors={BLUE} label="Notifications" sub=":4203" />

      <path d="M98,113 L188,113" fill="none" stroke="#444" strokeWidth="1.6" markerEnd={`url(#${id}-dark)`} />
      <Step x={143} y={100} n={1} />
      <path d="M188,134 L98,134" fill="none" stroke="#3d8b40" strokeWidth="1.6" strokeDasharray="4,3" markerEnd={`url(#${id}-green)`} />
      <Step x={143} y={148} n={4} color="#3d8b40" />

      <path d="M290,110 Q345,60 398,50" fill="none" stroke="#444" strokeWidth="1.6" markerEnd={`url(#${id}-dark)`} />
      <Step x={335} y={68} n={2} />
      <Caption x={345} y={30} anchor="middle">reserve the stock</Caption>

      <path d="M290,136 Q345,190 398,198" fill="none" stroke="#c0392b" strokeWidth="1.6" markerEnd={`url(#${id}-red)`} />
      <Step x={335} y={180} n={3} color="#c0392b" />
      <Caption x={345} y={230} color="#c0392b">send the email (the slow one)</Caption>

      <Caption x={143} y={172} color="#3d8b40">201 — only after 2 and 3</Caption>
    </svg>
  );
}

function AsyncDiagram() {
  const id = "d18-async";
  const hex = "306,100 322,78 358,78 374,100 358,122 322,122";
  return (
    <svg viewBox="0 0 520 250" role="img" aria-label="Asynchronous checkout. 1: the browser posts to Orders. 2: Orders publishes an OrderPlaced event to the RabbitMQ exchange. 3: Orders replies to the browser right away. 4: afterwards RabbitMQ copies the event to Inventory, Notifications, and Loyalty, which each do their work on their own.">
      <ArrowDefs id={id} />
      <Node x={8} y={88} w={82} h={46} colors={GREY} label="Browser" />
      <Node x={150} y={88} w={92} h={46} colors={YELLOW} label="Orders" sub=":4201" />
      <polygon points={hex} fill={PURPLE[0]} stroke={PURPLE[1]} strokeWidth="1.8" />
      <text x="340" y="98" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">
        exchange
      </text>
      <text x="340" y="112" textAnchor="middle" fontSize="9" fill="#5b6b82">
        RabbitMQ
      </text>
      <Node x={420} y={12} w={92} h={44} colors={BLUE} label="Inventory" sub=":4202" />
      <Node x={420} y={92} w={92} h={44} colors={BLUE} label="Notifications" sub=":4203" />
      <Node x={420} y={172} w={92} h={44} colors={BLUE} label="Loyalty" sub="added later" dashed />

      <path d="M90,101 L148,101" fill="none" stroke="#444" strokeWidth="1.6" markerEnd={`url(#${id}-dark)`} />
      <Step x={119} y={88} n={1} />
      <path d="M148,122 L90,122" fill="none" stroke="#3d8b40" strokeWidth="1.6" strokeDasharray="4,3" markerEnd={`url(#${id}-green)`} />
      <Step x={119} y={136} n={3} color="#3d8b40" />
      <Caption x={119} y={160} color="#3d8b40">201 right away</Caption>

      <path d="M242,105 L304,105" fill="none" stroke="#e08a3c" strokeWidth="1.8" markerEnd={`url(#${id}-orange)`} />
      <Step x={273} y={92} n={2} color="#e08a3c" />
      <Caption x={273} y={128} color="#e08a3c">publish</Caption>
      <Caption x={273} y={140} color="#e08a3c">OrderPlaced</Caption>

      <path d="M366,90 Q392,40 418,36" fill="none" stroke="#e08a3c" strokeWidth="1.6" markerEnd={`url(#${id}-orange)`} />
      <path d="M376,105 L418,112" fill="none" stroke="#e08a3c" strokeWidth="1.6" markerEnd={`url(#${id}-orange)`} />
      <path d="M366,120 Q392,180 418,192" fill="none" stroke="#e08a3c" strokeWidth="1.6" strokeDasharray="4,3" markerEnd={`url(#${id}-orange)`} />
      <Step x={392} y={62} n={4} color="#e08a3c" />
      <Caption x={340} y={236} color="#e08a3c">each copy is picked up on its own time</Caption>
    </svg>
  );
}

export default function Workflow() {
  return (
    <details className="co-flow" open>
      <summary>How the two checkouts work</summary>

      <ul className="co-flow-facts">
        <li>
          One small store: <strong>Orders</strong> takes the order, <strong>Inventory</strong> reserves the stock, and{" "}
          <strong>Notifications</strong> emails the customer. <strong>Loyalty</strong> (points) is a fourth service we add later.
        </li>
        <li>It is the same order both times. Only how Orders talks to the other services changes.</li>
        <li>The clock in each panel is how long the customer waits for Orders&apos; reply.</li>
      </ul>

      <div className="co-flow-grid">
        <section className="co-flow-col is-sync">
          <h3>Synchronous: call, then wait</h3>
          <SyncDiagram />
          <ol className="co-calls">
            <li>
              <code>POST /orders/sync</code> <span>browser → Orders. The customer presses “Place order”.</span>
            </li>
            <li>
              <code>POST /internal/reserve</code> <span>Orders → Inventory. Reserves the stock, and Orders waits for the answer.</span>
            </li>
            <li>
              <code>POST /internal/order-confirmation</code> <span>Orders → Notifications. Sends the email, and Orders waits again.</span>
            </li>
            <li>
              <code>201 Created</code> <span>Orders → browser. Only now. That is the wait on the clock.</span>
            </li>
          </ol>
        </section>

        <section className="co-flow-col is-async">
          <h3>Asynchronous: publish, then reply</h3>
          <AsyncDiagram />
          <ol className="co-calls">
            <li>
              <code>POST /orders</code> <span>browser → Orders. The customer presses “Place order”.</span>
            </li>
            <li>
              <code>publish OrderPlaced</code> <span>Orders → RabbitMQ exchange <code>orders</code>. Not an HTTP call, and Orders does not wait.</span>
            </li>
            <li>
              <code>201 Created</code> <span>Orders → browser, right away.</span>
            </li>
            <li>
              <code>consume OrderPlaced</code>{" "}
              <span>
                RabbitMQ copies the event into <code>inventory.q</code>, <code>notifications.q</code> (and <code>loyalty.q</code> if it&apos;s
                running). Each service reserves, emails, or adds points on its own.
              </span>
            </li>
          </ol>
        </section>
      </div>

      <p className="co-flow-helpers">
        <strong>Helper calls the page makes itself</strong> (not part of checkout): <code>POST :4203/debug/slow</code> is the Fast / Slow
        switch. <code>GET /health</code> and <code>GET :4202/inventory</code> fill the status bar. <code>GET /inventory/reservations</code>,{" "}
        <code>/notifications</code> and <code>/loyalty/orders</code> drive the ✓ chips under each order.
      </p>
    </details>
  );
}
