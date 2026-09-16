import { useState } from "react";
import DayNav from "../../../components/DayNav";
import SignUp from "./SignUp";
import { SelectDemo, SelectDemoAdvanced } from "./SelectDemo";

const EMAIL = "123";
const PASSWORD = "123";

function ControlledComponentDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (email === EMAIL && password === PASSWORD) {
      console.log("login success");
    } else console.log("login fail");
  };

  return (
    <div>
      {/* example 1 */}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          value={email}
          onChange={(event) => {
            // console.log(event.target.value);
            setEmail(event.target.value);
          }}
        />
      </div>

      {/* example 2 */}
      <div>
        <label>
          <div>Password: </div>
          <input
            // type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default function Lecture() {
  return (
    <div className="page lecture-page">
      <title>Day 8 — Lecture Canvas</title>
      <DayNav day="day8-inputs-forms" current="lecture" />
      <h1>Day 8 — Lecture Canvas</h1>
      {/* <ControlledComponentDemo /> */}

      {/* <SignUp /> */}
      {/* <SelectDemo /> */}
      <SelectDemoAdvanced />
    </div>
  );
}

// document.getElementById("input")!.value

// function foo(cb:any){
//     cb("hello world")
// }

// const callback = (msg:any)=>console.log(msg)

// foo((a:any)=>hello(a))
// foo(callback)
