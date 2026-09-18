import { Link } from "react-router-dom";

// The day's lab is two pages rather than one, so they carry their own second nav row under
// DayNav. Kept local to this folder because no other day needs it.
const BASE = "/week2/day10-routing-global-state/lab";

const PAGES = [
  { key: "recipe-book", label: "Recipe Book", href: BASE },
  { key: "problems", label: "Problem set", href: `${BASE}/problem-set` },
] as const;

export default function LabNav({ current }: { current: "recipe-book" | "problems" }) {
  return (
    <p className="lab-subnav">
      {PAGES.map((page, index) => (
        <span key={page.key}>
          {index > 0 && " · "}
          {page.key === current ? (
            <strong>{page.label}</strong>
          ) : (
            <Link to={page.href}>{page.label}</Link>
          )}
        </span>
      ))}
    </p>
  );
}
