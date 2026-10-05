import { Link } from "react-router-dom";

// The day's notes are two pages, since GraphQL and real-time communication are separate topics,
// so they carry their own second nav row under DayNav. Kept local to this folder because no
// other day needs it.
const BASE = "/week4/day19-realtime-graphql/notes";

const PAGES = [
  { key: "graphql", label: "GraphQL", href: `${BASE}/graphql` },
  { key: "realtime", label: "Real-time communication", href: `${BASE}/realtime` },
] as const;

export default function NotesNav({ current }: { current: (typeof PAGES)[number]["key"] }) {
  return (
    <p className="page-subnav">
      {PAGES.map((page, index) => (
        <span key={page.key}>
          {index > 0 && " · "}
          {page.key === current ? <strong>{page.label}</strong> : <Link to={page.href}>{page.label}</Link>}
        </span>
      ))}
    </p>
  );
}
