import { Link } from "react-router-dom";
import DayNav from "../../../components/DayNav";
import { DEMOS, LECTURE_PATH } from "./demos";

export default function Lecture() {
  return (
    <div className="page lecture-page">
      <title>Day 30 — Lecture Canvas</title>
      <DayNav day="day30-workflows-agents-context" current="lecture" />
      <h1>Day 30 — Lecture Canvas</h1>
      <ul className="lecture-demo-links">
        {DEMOS.map((d) => (
          <li key={d.slug}>
            <Link to={`${LECTURE_PATH}/${d.slug}`}>
              {d.section} {d.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
