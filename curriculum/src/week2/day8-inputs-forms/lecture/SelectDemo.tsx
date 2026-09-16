import React, { useState, type ChangeEvent, type SubmitEvent } from "react";

export function SelectDemo() {
  const [favFood, setFavFood] = useState("");

  // onChange => ChangeEvent
  // who triggered the change event?
  // select => HTMLSelectElement
  // input => HTMLInputElement
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFavFood(e.target.value);
  };

  // onSubmit => SubmitEvent
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    console.log(favFood);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <div>select your favorite food</div>
          <select value={favFood} onChange={handleChange}>
            {/* empty value for default option */}
            <option value="">Pick</option>
            <option value="Burger">Burger</option>
            <option value="Fries">Fries</option>
            <option value="Real Chinese Food">Real Chinese Food</option>
            <option value="Candies">Candies</option>
          </select>
        </label>
        <button>submit</button>
      </form>
    </div>
  );
}

export function SelectDemoAdvanced() {
  const [favFood, setFavFood] = useState("");
  const foodOptions = [
    { value: "apple", label: "apple" },
    { value: "burger", label: "Burger 🍔🍔🍔🍔🍔🍔" },
    { value: "fries", label: "Fries 🍟" },
    {
      value: "realChineseFood",
      label: "the Real ultimate authenticate Chinese Food",
    },
    { value: "candies", label: "Candies lots of candies" },
  ];
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          <div>select your favorite food</div>
          <select value={favFood} onChange={(e) => setFavFood(e.target.value)}>
            {/* empty value for default option */}
            <option value="">Pick</option>
            {foodOptions.map((opt) => {
              return <option key={opt.value}>{opt.label}</option>;
            })}
          </select>
        </label>
        <button>submit</button>
      </form>
    </div>
  );
}
