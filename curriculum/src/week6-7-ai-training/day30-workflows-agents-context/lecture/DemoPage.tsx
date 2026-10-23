import { useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import DayNav from "../../../components/DayNav";
import { ShowReasoning } from "./ChatDemo";
import { DEMOS, LECTURE_PATH } from "./demos";

const STORAGE_KEY = "day30-show-reasoning";

function readSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

// /lecture/:demo — one route for every demo; the slug picks the entry in demos.ts.
export default function DemoPage() {
  const { demo } = useParams();
  const current = DEMOS.find((d) => d.slug === demo);
  // one switch for every demo; remembered across tabs and reloads
  const [showReasoning, setShowReasoning] = useState(readSaved);

  function toggle() {
    const next = !showReasoning;
    setShowReasoning(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      // storage blocked: the switch still works for this visit
    }
  }

  return (
    <div className="page lecture-page">
      <title>{`Day 30 — ${current?.title ?? "Demo"}`}</title>
      <DayNav day="day30-workflows-agents-context" current="lecture" />
      <div className="wf-topbar">
        <Link to={LECTURE_PATH}>← All demos</Link>
        <label className="wf-switch">
          <input type="checkbox" checked={showReasoning} onChange={toggle} />
          <span className="wf-switch-track" />
          Show AI reasoning
          <span className="wf-switch-hint">{showReasoning ? "every step, at lecture pace" : "what a real customer sees"}</span>
        </label>
      </div>
      <nav className="wf-tabs">
        {DEMOS.map((d) => (
          <NavLink key={d.slug} to={`${LECTURE_PATH}/${d.slug}`} className={({ isActive }) => (isActive ? "is-active" : "")}>
            {d.section} {d.title}
          </NavLink>
        ))}
      </nav>
      {current ? (
        <>
          <h1>
            {current.section} {current.title}
          </h1>
          <p className="wf-blurb">{current.blurb}</p>
          {/* key: switching tabs starts a fresh chat */}
          <ShowReasoning.Provider value={showReasoning}>
            <current.Component key={current.slug} />
          </ShowReasoning.Provider>
        </>
      ) : (
        <p>No demo called “{demo}”.</p>
      )}
    </div>
  );
}
