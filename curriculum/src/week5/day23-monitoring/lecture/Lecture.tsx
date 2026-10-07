import DayNav from "../../../components/DayNav";
import { ClsDemos } from "./ClsSection";
import { InpDemos } from "./InpSection";

export default function Lecture() {
  return (
    <div className="page lecture-page lecture-wide">
      <title>Day 23 — Lecture Canvas</title>
      <DayNav day="day23-monitoring" current="lecture" />
      <h1>Day 23 — Lecture Canvas</h1>
      <InpDemos />
      <ClsDemos />
    </div>
  );
}
