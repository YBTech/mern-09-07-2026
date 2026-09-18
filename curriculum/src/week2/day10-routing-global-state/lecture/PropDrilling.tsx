import React, { useState } from "react";
export default function PropDrilling() {
  const [people, setPeople] = useState([
    { id: 1, name: "John", age: 11 },
    { id: 2, name: "Mary", age: 22 },
    { id: 3, name: "Alex", age: 30 },
    { id: 4, name: "Priya", age: 27 },
  ]);

  return (
    <div>
      <h2>Prop Drilling Demo</h2>
      <A people={people} setPeople={setPeople} a="a" />
    </div>
  );
}

function A({ people, setPeople }: any) {
  return (
    <div>
      <h3>This is A</h3>
      <B people={people} setPeople={setPeople} />
    </div>
  );
}

function B({ people, setPeople }: any) {
  return (
    <div>
      <h3>This is B</h3>
      <C people={people} setPeople={setPeople} />
    </div>
  );
}

function C({ people, setPeople }: any) {
  const deleteById = (id: number) => {
    setPeople((prev: any) => prev.filter((person: any) => person.id !== id));
  };

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
