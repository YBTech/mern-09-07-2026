import { useSearchParams } from "react-router-dom";
import DayNav from "../../../components/DayNav";
import { ArrowDefs } from "../../../components/Diagram";
import CaseA from "./CaseA";
import CaseB from "./CaseB";
import CaseC from "./CaseC";
import Framework from "./Framework";

// Day 34 lecture: one page, four tabs (the framework, then three case studies).
// The selected tab lives in the address (?case=c), so it can be bookmarked and projected.
// Days have no sub-pages in curriculum.ts, so the tabs live inside this one route.

const TABS = [
  { key: "framework", label: "The framework" },
  { key: "a", label: "A · Policy assistant" },
  { key: "b", label: "B · Customer support" },
  { key: "c", label: "C · Claim intake" },
] as const;

export default function Lecture() {
  const [params, setParams] = useSearchParams();
  const current = TABS.find((tab) => tab.key === params.get("case"))?.key ?? "framework";

  return (
    <div className="page lecture-page lecture-guide">
      <title>Day 34 — Lecture</title>
      <DayNav day="day34-ai-system-design" current="lecture" />
      <ArrowDefs />
      <h1>Day 34 — AI System Design</h1>

      <nav className="case-tabs" aria-label="Case studies">
        {TABS.map((tab) => (
          <button key={tab.key} className={tab.key === current ? "active" : ""} onClick={() => setParams({ case: tab.key })}>
            {tab.label}
          </button>
        ))}
      </nav>

      {current === "framework" && <Framework />}
      {current === "a" && <CaseA />}
      {current === "b" && <CaseB />}
      {current === "c" && <CaseC />}
    </div>
  );
}
