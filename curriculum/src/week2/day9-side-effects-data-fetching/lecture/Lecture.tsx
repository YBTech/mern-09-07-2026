import { useEffect, useState } from "react";
import DayNav from "../../../components/DayNav";
import { ProductsList, ProductsList2 } from "./ProductsList";
import ProductSearch from "./ProductSearch";
import CleanUpDemo from "./CleanUpDemo";

export default function Lecture() {
  const [isShown, setIsShown] = useState(true);

  const toggle = () => setIsShown((prev) => !prev);

  return (
    <div className="page lecture-page">
      <title>Day 9 — Lecture Canvas</title>
      <DayNav day="day9-side-effects-data-fetching" current="lecture" />
      <h1>Day 9 — Lecture Canvas</h1>
      {/* <button onClick={toggle}>{isShown ? "Hide" : "Show"}</button>
      {isShown && <Counter />} */}

      {/* <ProductsList /> */}
      {/* <ProductsList2 /> */}
      {/* <ProductSearch /> */}
      <CleanUpDemo />
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  // reacts to component update/re-render
  // will trigger after update completes
  useEffect(() => {
    console.log("1. whole component updated");
  });

  // 2nd arg: dependency array
  // only when variables inside dep array changes, the cb will trigger
  useEffect(() => {
    console.log("2. count updates");
  }, [count]);

  useEffect(() => {
    console.log("3. theme updates");
  }, [theme]);

  // empty dependency array: only trigger once at mounting phase
  // only once
  useEffect(() => {
    console.log("4. component did mount");

    // returns a cleanup function
    // will trigger before component unmounts
    return () => {
      console.log("5. component will be unmounted right after this");
    };
  }, []);

  return (
    <div className="counter">
      <h3>Count: {count}</h3>
      <div onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        theme: {theme}
      </div>
      <button onClick={() => setCount((prev) => prev + 1)}>Add</button>
    </div>
  );
}

// lifecycle
// born => grow => death
// mounting => updating => unmounting
