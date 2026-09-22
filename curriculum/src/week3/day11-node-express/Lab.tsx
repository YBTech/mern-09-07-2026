import DayNav from "../../components/DayNav";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 11 Lab</title>
      <DayNav day="day11-node-express" current="lab" />
      <h1>Day 11 — Lab</h1>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>
            Work on the Express CRUD app in the other folder
          </p>
        </div>
      </div>
    </div>
  );
}
