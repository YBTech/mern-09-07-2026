import { Link } from "react-router-dom";
import DayNav from "../../../components/DayNav";

export default function Lecture() {
  return (
    <div className="page lecture-page">
      <title>Day 19 — Lecture Canvas</title>
      <DayNav day="day19-realtime-graphql" current="lecture" />
      <h1>Day 19 — Lecture Canvas</h1>
      <ul className="lecture-demo-links">
        <li>
          <Link to="/week4/day19-realtime-graphql/lecture/graphql">GraphQL demo</Link>: one page, four REST services,
          loaded three ways
        </li>
        <li>
          <Link to="/week4/day19-realtime-graphql/lecture/realtime">Real-time demo</Link>: a dashboard, a notification bell,
          a chat room, and a live match, each built with the mechanism that fits it
        </li>
      </ul>
    </div>
  );
}
