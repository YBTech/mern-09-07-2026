import { useState } from "react";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import TodoListDemo from "./lecture/TodoListDemo";

function ControlledInputDemo() {
  const [name, setName] = useState("");
  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="type your name" />
      <p>You typed: {name || "(nothing yet)"}</p>
    </div>
  );
}

function SignupFormDemo() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("That doesn't look like an email address.");
      return;
    }
    setError("");
    setSubmitted(email.trim());
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{ padding: "0.3rem 0.5rem", marginRight: "0.4rem" }}
      />
      <button type="submit" disabled={email.trim().length === 0}>
        Sign up
      </button>
      <button type="button" onClick={() => setEmail("")} style={{ marginLeft: "0.3rem" }}>
        Clear
      </button>
      {error && <p style={{ color: "#c62828", margin: "0.5rem 0 0" }}>{error}</p>}
      {submitted && <p style={{ margin: "0.5rem 0 0" }}>Signed up: {submitted}</p>}
    </form>
  );
}

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 8 Notes</title>
      <DayNav day="day8-inputs-forms" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 8 · Notes</p>
        <h1>Inputs &amp; Forms</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>
            Build a controlled input: state behind every field, feeding <code>value</code>, written
            back by <code>onChange</code>
          </li>
          <li>
            Handle a form with <code>onSubmit</code> + <code>e.preventDefault()</code>, validating
            before you accept the input
          </li>
          <li>
            Build a Todo List combining all of it: add, edit (cancel/save), delete, title validation,
            priority dropdown
          </li>
        </ul>
        <p>
          Want more? <a href="/week2/day8-inputs-forms/concepts">View all concepts.</a>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}>Section 2 — Full Walkthrough</h2>

      <h2>1. Controlled components</h2>
      <p>
        An input is <strong>controlled</strong> when its displayed value comes from state and every
        keystroke writes back to that state. This is the pattern for every form field you write —
        there is always a <code>useState</code> behind the input:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function NameField() {
  const [name, setName] = useState("");

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <ControlledInputDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            The loop: state → <code>value</code> renders it → user types →{" "}
            <code>onChange</code> reads <code>e.target.value</code> → setter → re-render → the input
            shows the new state.
          </li>
          <li>
            The DOM node never holds the truth. State does — which is why you can validate, trim,
            uppercase, disable the button, or clear the field just by touching state.
          </li>
          <li>
            <code>value</code> without <code>onChange</code> freezes the input: React re-renders it
            back to the state value on every keystroke, so nothing you type sticks.
          </li>
          <li>
            Neither one — an <em>uncontrolled</em> input — means React has no idea what the user
            typed, and you'd have to reach into the DOM to find out.
          </li>
        </ul>
      </div>
      <CodeBlock
        code={`
function Fields() {
  const [name, setName] = useState("");

  return (
    <>
      <input placeholder="uncontrolled — React never sees what you type" />
      <input value={name} />
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  );
}
`}
        bad={[6, 7]}
        good={[8]}
      />
      <p>Checkboxes and selects are the same pattern with a different value prop:</p>
      <CodeBlock
        code={`
function Options() {
  const [isDone, setIsDone] = useState(false);
  const [priority, setPriority] = useState<Priority>("medium");

  return (
    <>
      <input
        type="checkbox"
        checked={isDone}
        onChange={(e) => setIsDone(e.target.checked)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </>
  );
}
`}
      />
      <p>
        Several fields can share one state object — compute the key to update from the input's own{" "}
        <code>name</code>:
      </p>
      <CodeBlock
        code={`
function ProfileForm() {
  const [form, setForm] = useState({ name: "", email: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </>
  );
}
`}
      />

      <h2>2. Forms, submitting, and validation</h2>
      <p>
        Put <code>onSubmit</code> on the <code>&lt;form&gt;</code>, not <code>onClick</code> on the
        button — that's what makes pressing Enter in a field work too. The handler's first line is
        almost always <code>e.preventDefault()</code>, which stops the browser's default behaviour of
        reloading the whole page:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function SignupForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("That doesn't look like an email address.");
      return;
    }
    setError("");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" disabled={email.trim().length === 0}>
        Sign up
      </button>
      <button type="button" onClick={() => setEmail("")}>Clear</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — try submitting without an @</p>
          <SignupFormDemo />
        </div>
      </div>
      <p className="callout">
        Inside a <code>&lt;form&gt;</code>, a button is <code>type="submit"</code> by default — give
        any button that shouldn't submit (Cancel, Clear, Edit) an explicit{" "}
        <code>type="button"</code>.
      </p>

      <h2>3. Putting it together: Todo List</h2>
      <p>The capstone for today combines nearly every concept above into one component:</p>
      <div className="demo-result">
        <p className="demo-result-label">Live demo — try adding, editing, and deleting a todo</p>
        <TodoListDemo />
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Piece</th>
            <th>Concept used</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Add form", "Controlled inputs + onSubmit/preventDefault + title-length validation"],
            ["New todo id", "crypto.randomUUID() generated once at creation — a stable list key"],
            ["Adding a todo", "Immutable array update via spread"],
            ["Deleting a todo", "Immutable array update via .filter"],
            ["Editing a todo", "Conditional rendering (row vs. edit form) + .map to update one item"],
            ["Cancel button", 'type="button" so it does not trigger form submission'],
            ["Priority dropdown", "Controlled <select>, typed with the Priority union"],
          ].map(([piece, concept]) => (
            <tr key={piece}>
              <td>
                <code>{piece}</code>
              </td>
              <td>{concept}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
