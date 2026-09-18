import React, { createContext, useContext, useState } from "react";

const DemoContext = createContext<any>(null);

export default function ContextDemo() {
  const [people, setPeople] = useState([
    { id: 1, name: "John", age: 11 },
    { id: 2, name: "Mary", age: 22 },
    { id: 3, name: "Alex", age: 30 },
    { id: 4, name: "Priya", age: 27 },
  ]);

  const deleteById = (id: number) => {
    setPeople((prev: any) => prev.filter((person: any) => person.id !== id));
  };

  const addPerson = () => {};
  const editPerson = (id: number) => {};
  const applyFilter = () => {};

  return (
    // provider's value can be accessed by all children
    <DemoContext.Provider
      value={{ people, deleteById, addPerson, editPerson, applyFilter }}
    >
      <>
        <h2>Solution to prop drilling: Context Demo</h2>
        <A />
      </>
    </DemoContext.Provider>
  );
}

function A() {
  return (
    <div>
      <h3>This is A</h3>
      <B />
    </div>
  );
}

function B() {
  return (
    <div>
      <h3>This is B</h3>
      <C />
    </div>
  );
}

function C() {
  // pass the context you need
  const { people, deleteById } = useContext(DemoContext);

  return (
    <div>
      <h3>This is C</h3>
      <div>
        {people.map((person: any) => (
          <div>
            {person.id}. {person.name} {person.age}
            <button onClick={() => deleteById(person.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
