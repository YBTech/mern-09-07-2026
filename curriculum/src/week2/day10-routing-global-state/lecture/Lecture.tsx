import DayNav from "../../../components/DayNav";
import ContextDemo from "./ContextDemo";
import PropDrilling from "./PropDrilling";
import TodoApp from "./TodoList/TodoApp";

export default function Lecture() {
  return (
    <div className="page lecture-page">
      <title>Day 10 — Lecture Canvas</title>
      <DayNav day="day10-routing-global-state" current="lecture" />
      <h1>Day 10 — Lecture Canvas</h1>

      {/* <PropDrilling /> */}
      {/* <ContextDemo /> */}
      <TodoApp />
    </div>
  );
}
