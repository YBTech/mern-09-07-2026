import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { JobBoardDemo, SupportQueueDemo } from "./_solution";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 6 Lab</title>
      <DayNav day="day6-components-basics" current="lab" />
      <h1>Day 6 — Lab</h1>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Job board.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
const postings = [
  { id: "j1", role: "Support Engineer", salaryK: 78, skills: ["Windows", "Networking"],
    remote: false, perks: "Transit stipend" },
  { id: "j2", role: "Frontend Developer", salaryK: 95, skills: ["React", "TypeScript"], remote: true },
  { id: "j3", role: "Data Analyst", salaryK: 88, skills: ["SQL", "Excel"],
    remote: true, perks: "Four-day week" },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Split it into <code>JobList</code> and <code>JobCard</code>, each
              its own file with a default export.
            </li>
            <li>
              Type <code>JobCard</code>'s props with an interface —{" "}
              <code>perks</code> is optional.
            </li>
            <li>
              Map over the array keyed on each posting's own id, and pass the
              skills array down.
            </li>
            <li>
              Show a "Remote" badge only when the flag is true, and "No perks
              listed" when perks is missing.
            </li>
            <li>
              Pass an <code>onApply</code> callback down; each card's button
              calls it with that posting's id.
            </li>
            <li>
              Wrap the whole list in a <code>Panel</code> that takes{" "}
              <code>children</code>.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// after clicking Apply on Frontend Developer, then on Data Analyst
apply j2
apply j3
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <JobBoardDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Support queue.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
const tickets = [
  { ref: "INC-4021", subject: "Laptop won't boot", status: "Open",
    assignee: "Ana", minutesWaiting: 0 },
  { ref: "INC-4022", subject: "Email quota full", status: "Waiting",
    assignee: "Wes", minutesWaiting: 25 },
  { ref: "INC-4023", subject: "Badge reader offline", status: "Open", minutesWaiting: 90 },
  { ref: "INC-4024", subject: "New hire setup", status: "Scheduled",
    assignee: "Kim", minutesWaiting: 0 },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              <code>QueueRow</code> takes the whole ticket as one object prop,
              plus an <code>onSelect</code> callback.
            </li>
            <li>
              <code>Queue</code> maps over the array with a stable key and
              renders each row.
            </li>
            <li>
              One ticket has no assignee — fall back to "Unassigned" without
              touching the data.
            </li>
            <li>Show the waiting line only for tickets that have waited.</li>
            <li>
              Render "Queue is clear" for an empty array, without painting a
              bare <code>0</code>.
            </li>
            <li>
              Clicking a row calls <code>onSelect</code> with that ticket's ref.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// after clicking the Email quota row, then the Badge reader row
selected INC-4022
selected INC-4023
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <SupportQueueDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
