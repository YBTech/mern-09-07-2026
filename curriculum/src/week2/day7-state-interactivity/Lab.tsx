import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ScoreboardDemo } from "./_solution";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 7 Lab</title>
      <DayNav day="day7-state-interactivity" current="lab" />
      <h1>Day 7 — Lab</h1>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Game night scoreboard.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
type Player = { id: string; name: string; score: number };

const initial: Player[] = [
  { id: "p1", name: "Ada", score: 0 },
  { id: "p2", name: "Ben", score: 0 },
  { id: "p3", name: "Cleo", score: 0 },
];
`}
          />
          <p className="callout">
            A fixed roster of three — no "add player" text field. Every interaction is a click,
            which keeps this a pure state + event-handlers exercise.
          </p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>A +1 and a -1 button per player, updating that player's score immutably.</li>
            <li>
              Disable a player's -1 button once their score reaches 0 — it should never go negative.
            </li>
            <li>
              Crown whoever currently has the highest score — computed from the array on every
              render, never stored as its own state.
            </li>
            <li>A Delete button per player that drops them from the board, by id.</li>
            <li>A Reset all button that puts every score back to 0 in one update.</li>
            <li>
              Every update goes through the setter immutably; no mutating a player object or the
              array in place.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// Ada at 0, clicking her -1
nothing happens — the button is disabled

// Ben reaches the highest score
👑 appears next to Ben's name, moves the moment someone else passes him

// clicking Reset all
every score back to 0, the roster itself unchanged
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ScoreboardDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
