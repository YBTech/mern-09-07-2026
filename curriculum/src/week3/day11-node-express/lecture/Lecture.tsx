import { useEffect } from "react";
import DayNav from "../../../components/DayNav";

export default function Lecture() {
  const getApi = async () => {
    fetch("http://localhost:3100");
  };
  const postApi = async () => {
    fetch("http://localhost:3100/wqeqwe", {
      method: "POST",
    });
  };


  return (
    <div className="page lecture-page lecture-console">
      <title>Day 11 — Lecture Canvas</title>
      <DayNav day="day11-node-express" current="lecture" />
      <h1>Day 11 — Lecture Canvas</h1>
      <button onClick={getApi}>Send get request</button>
      <button onClick={postApi}>Send post request</button>
    </div>
  );
}
