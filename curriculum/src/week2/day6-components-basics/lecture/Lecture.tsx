import DayNav from "../../../components/DayNav";
import Book from "./Book";
import "./lecture.css";
import PeopleDemo from "./People";

export default function Lecture() {
  return (
    <div className="page lecture-page">
      <title>Day 6 — Lecture Canvas</title>
      <DayNav day="day6-components-basics" current="lecture" />
      <h1>Day 6 — Lecture Canvas</h1>
      {/* below are notes */}

      {/* all components will be self closing, unless you need open/close tags */}
      <Person name="Mike" age="12" />
      <Person name="Joe" age="110" />

      <Book
        authors={["John"]}
        title="React Tutorial"
        year={2020}
        isPublished={true}
        problem={`${1 + 1 + 1} very big problem`} // string literal has to use {}
        misc={{ policy: "yes policy", isPatented: true }}
      />
      <Book
        authors={["Jack"]}
        title="oqidjiowq"
        year={1230}
        isPublished={false}
        problem={null}
      />

      <PeopleDemo />
    </div>
  );
}

// first letter capitalized
// props is an object, to receive inputs from parent component
function Person(props: any) {
  // console.log(props)
  const { name, age } = props;
  console.log(name);
  console.log(age);

  const ageAfterFiveYears = age + 5;

  // return JSX / TSX, looks like HTML, not HTML
  return (
    <div className="person">
      {/* JSX render with { } */}
      <div>Name: {name}</div>
      <div>Age: {age} years old</div>
      <div>age after 5 years: {ageAfterFiveYears}</div>
      <div>Today: {getTodayDate()}</div>
    </div>
  );
}

function getTodayDate() {
  return new Date().toLocaleDateString();
}
