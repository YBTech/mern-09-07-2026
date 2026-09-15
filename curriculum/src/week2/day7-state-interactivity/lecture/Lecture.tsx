import { useState } from "react";
import DayNav from "../../../components/DayNav";

export default function Lecture() {
  return (
    <div className="page lecture-page">
      <title>Day 7 — Lecture Canvas</title>
      <DayNav day="day7-state-interactivity" current="lecture" />
      <h1>Day 7 — Lecture Canvas</h1>

      {/* <BasicCounter /> */}
      {/* <FullCounter /> */}
      {/* <StringState /> */}
      {/* <ConditionalRendering /> */}
      {/* <Logger /> */}
      <PeopleList />
    </div>
  );
}

// state, an internal data in components
// state updates, and component will re-render (update the UI)

function BasicCounter() {
  // 1st: state, 2nd: updater function
  // we cannot change state directly
  // the only way to update state is by calling updater function
  // useState takes an initial value
  const [count, setCount] = useState(10);

  // object: name matters, order doesn't
  // array: order matters, name doesn't

  const handleClick = () => {
    // new value
    setCount(count + 1);
    // console.log(count);
  };

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={handleClick}>Add</button>
      <div>{count}</div>
      <div>{count}</div>
      <div>{count}</div>
      <div>{count}</div>
    </div>
  );
}

function FullCounter() {
  const [count, setCount] = useState(0);

  const add = () => setCount(count + 1);

  return (
    <div>
      <div>Count: {count}</div>
      <div>
        <button onClick={add}>Add</button>
        <button onClick={() => setCount(count - 1)}>Minus</button>
        <button onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}

function StringState() {
  const [text, setText] = useState("");
  const appendText = () => {
    setText(`${text} new`);
  };

  return (
    <div>
      <div>{text}</div>
      <button onClick={appendText}>Append text</button>
    </div>
  );
}

function ConditionalRendering() {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggle}>{isOpen ? "Hide" : "Show"}</button>
      {isOpen && <div>secrets</div>}
    </div>
  );
}

function Logger() {
  const [logs, setLogs] = useState(["14:21:54", "14:21:56"]);

  // update an array state
  const logTime = () => {
    const newLog = new Date().toTimeString().split(" ")[0];
    setLogs([...logs, newLog]);
  };

  return (
    <div>
      <button onClick={logTime}>Log Current Timestamps</button>
      <div>
        {logs.map((log, index) => {
          return <div key={index}>{log}</div>;
        })}
      </div>
    </div>
  );
}

interface Person {
  id: string;
  name: string;
  salary: number;
}

function PeopleList() {
  const [people, setPeople] = useState<Person[]>([
    { id: crypto.randomUUID(), name: "Alice", salary: 50000 },
    { id: crypto.randomUUID(), name: "Bob", salary: 60000 },
    { id: crypto.randomUUID(), name: "Charlie", salary: 70000 },
  ]);

  [
    { id: crypto.randomUUID(), name: "Alice", salary: 5000 },
    { id: crypto.randomUUID(), name: "Bob", salary: 60000 },
    { id: crypto.randomUUID(), name: "Charlie", salary: 71000 },
  ];

  const hireRandomPerson = () => {
    const newPerson = {
      id: crypto.randomUUID(),
      name: "John",
      salary: 56000,
    };

    setPeople([...people, newPerson]);
  };

  const raiseSalary = (id: string) => {
    // wrong, although it works, it mutated people array
    // const newPeople = [...people];
    // newPeople[0].salary += 1000;

    // correct but long version
    // const newPeople = people.map((person) => {
    //   if (person.id === id) {
    //     const newPerson = { ...person };
    //     newPerson.salary += 1000;
    //     return newPerson;
    //   }
    //   // if not the person, just return it unchanged
    //   return person;
    // });

    // a clean way
    const newPeople = people.map((person) =>
      person.id === id
        ? {
            ...person,
            salary: person.salary + 1000,
          }
        : person,
    );

    setPeople(newPeople);
  };

  const removePerson = (id: string) => {
    const newPeople = people.filter((person) => person.id !== id);
    setPeople(newPeople);
  };

  return (
    <div>
      <button onClick={hireRandomPerson}>Hire New Person</button>
      <ul>
        {people.map((person) => {
          const { id, name, salary } = person;
          return (
            <li key={id}>
              <div>
                {name} * ${salary.toLocaleString()}
              </div>
              <div>
                <button onClick={() => raiseSalary(id)}>Raise 1k</button>
                <button onClick={() => removePerson(id)}>Remove</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
