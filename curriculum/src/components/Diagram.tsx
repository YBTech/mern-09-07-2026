import type { ReactNode } from "react";

// Small SVG building blocks for architecture diagrams in notes pages (first used by day 18
// and the Event-Driven Deep Dive). One visual vocabulary, so every diagram reads the same:
//   blue box = a service    purple = a queue / log    orange hexagon = an exchange
//   yellow = the service in focus    red = failure    green = success
//
// Render <ArrowDefs /> once near the top of any page that uses <Arrow>: it defines the
// arrowheads every arrow on the page points at.

const FILL = {
  service: ["#eef3ff", "#7ea6e0"],
  broker: ["#f3eefc", "#8e5fd6"],
  primary: ["#fff7e0", "#e8b400"],
  fail: ["#fdf3f3", "#d98b8b"],
  warn: ["#fff1e6", "#e8a060"],
  ok: ["#eef8ee", "#7dbb7d"],
  muted: ["#f5f5f5", "#bbbbbb"],
} as const;
export type Kind = keyof typeof FILL;

const STROKE = { dark: "#444", red: "#c0392b", green: "#3d8b40", purple: "#8e5fd6", orange: "#e08a3c" } as const;
type Ink = keyof typeof STROKE;

/** Arrowheads, defined once for the whole page. */
export function ArrowDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {(Object.keys(STROKE) as Ink[]).map((ink) => (
          <marker key={ink} id={`dg-${ink}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={STROKE[ink]} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

export function Box(props: { x: number; y: number; w: number; h: number; kind?: Kind; label: string; sub?: string; dashed?: boolean; size?: number }) {
  const { x, y, w, h, kind = "service", label, sub, dashed, size = 12 } = props;
  const [fill, stroke] = FILL[kind];
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" strokeDasharray={dashed ? "5,4" : undefined} />
      <text x={cx} y={sub ? cy - 2 : cy + 4} textAnchor="middle" fontSize={size} fontWeight="700" fill={kind === "muted" ? "#999" : "#1c1c1c"}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill={kind === "muted" ? "#999" : "#5b6b82"}>
          {sub}
        </text>
      )}
    </g>
  );
}

export function Arrow({ d, ink = "dark", dashed }: { d: string; ink?: Ink; dashed?: boolean }) {
  return <path d={d} fill="none" stroke={STROKE[ink]} strokeWidth="1.5" strokeDasharray={dashed ? "4,3" : undefined} markerEnd={`url(#dg-${ink})`} />;
}

export function T(props: { x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: "start" | "middle" | "end"; bold?: boolean }) {
  const { x, y, children, size = 10, color = "#5b6b82", anchor = "middle", bold } = props;
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={color} fontWeight={bold ? 700 : 400}>
      {children}
    </text>
  );
}

/** An exchange: a hexagon, so it never gets mistaken for a queue. */
export function Exchange({ cx, cy, label, sub }: { cx: number; cy: number; label: string; sub: string }) {
  const pts = [
    [cx - 44, cy],
    [cx - 24, cy - 30],
    [cx + 24, cy - 30],
    [cx + 44, cy],
    [cx + 24, cy + 30],
    [cx - 24, cy + 30],
  ]
    .map((p) => p.join(","))
    .join(" ");
  return (
    <g>
      <polygon points={pts} fill="#fdf0e6" stroke="#e08a3c" strokeWidth="1.8" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">
        {label}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#5b6b82">
        {sub}
      </text>
    </g>
  );
}

/** One message sitting in a queue or log. */
export function Chip({ x, y, label, w = 26, h = 22, read }: { x: number; y: number; label: string; w?: number; h?: number; read?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={read ? "#e4dcf3" : "#fff"} stroke="#8e5fd6" />
      <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle" fontSize="9" fill="#1c1c1c">
        {label}
      </text>
    </g>
  );
}
