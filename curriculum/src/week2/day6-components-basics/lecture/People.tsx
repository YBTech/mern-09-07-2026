import React from "react";

interface Person {
  id: string;
  name: string;
  age: number;
  gender: "M" | "F";
}

const data: Person[] = [
  { id: "1", name: "John", age: 11, gender: "F" },
  { id: "2", name: "Alice", age: 22, gender: "F" },
  { id: "3", name: "Mike", age: 19, gender: "M" },
  { id: "4", name: "Sara", age: 28, gender: "F" },
];

export default function PeopleDemo() {
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <h3>People Demo: list rendering</h3>
      <People people={data} school="Harvard" />
    </div>
  );
}

interface PeopleProps {
  school: string;
  people: Person[];
}

function People({ people, school }: PeopleProps) {
  return (
    <div>
      <h2>School: {school}</h2>
      {people.map((person, index) => {
        return (
          <article key={person.id}>
            <div>
              Name: {person.name}, {person.gender === "M" ? "Male" : "Female"},
              is {person.age} years old
            </div>
            <button>click</button>
          </article>
        );
      })}
    </div>
  );
}
