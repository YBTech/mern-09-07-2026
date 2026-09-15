import { useState, useRef } from "react";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

function RenderCountDemo() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1; // debug-only trick: a ref update during render doesn't affect output

  return (
    <div>
      <p>
        count: <strong>{count}</strong> — this component has rendered <strong>{renderCount.current}</strong> time(s)
      </p>
      <button onClick={() => setCount(count + 1)}>Increment</button>{" "}
      <button onClick={() => setCount(count)}>Set to same value</button>
    </div>
  );
}

function TagListDemo() {
  const [tags, setTags] = useState<string[]>(["react", "typescript"]);
  const [draft, setDraft] = useState("");

  function addTag() {
    if (!draft.trim()) return;
    setTags((prev) => [...prev, draft.trim()]); // add: spread
    setDraft("");
  }
  function removeTag(target: string) {
    setTags((prev) => prev.filter((t) => t !== target)); // delete: filter
  }

  return (
    <div>
      <div style={{ marginBottom: "0.6rem" }}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="new tag"
          style={{ padding: "0.3rem 0.5rem", marginRight: "0.4rem" }}
        />
        <button onClick={addTag}>Add tag</button>
      </div>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            display: "inline-block",
            background: "#eaf1fc",
            padding: "0.2rem 0.6rem",
            borderRadius: 999,
            marginRight: "0.4rem",
          }}
        >
          {tag} <button onClick={() => removeTag(tag)} style={{ marginLeft: "0.3rem" }}>×</button>
        </span>
      ))}
    </div>
  );
}

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 7 Notes</title>
      <DayNav day="day7-state-interactivity" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 7 · Notes</p>
        <h1>State Fundamentals</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>
            Declare state with <code>useState</code>: destructure the{" "}
            <code>[value, setValue]</code> pair, always pass an initial value
          </li>
          <li>
            Update through the setter — use <code>{"setX((prev) => ...)"}</code> whenever the next
            value depends on the current one
          </li>
          <li>
            Rules of hooks: top level of a component only, never in an <code>if</code>, a loop, or
            after an early <code>return</code>
          </li>
          <li>A component re-renders when its own state changes, or when its parent re-renders</li>
          <li>
            Update state of any shape: primitives directly, arrays and objects{" "}
            <strong>immutably</strong> with spread, <code>.filter</code>, <code>.map</code>
          </li>
          <li>
            Give <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code> a function, never
            a call: <code>onClick={"{handleSave}"}</code>, not <code>onClick={"{handleSave()}"}</code>
          </li>
        </ul>
        <p>
          Want more? <a href="/week2/day7-state-interactivity/concepts">View all concepts.</a>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}>Section 2 — Full Walkthrough</h2>

      <h2>1. What state is, and <code>useState</code> basics</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            A component function re-runs top to bottom every time React renders it, so any ordinary
            variable inside it is rebuilt from scratch and forgotten.
          </li>
          <li>
            <strong>State is the value React remembers for that component between renders</strong> —
            and the thing React watches, so changing it schedules a new render.
          </li>
          <li>
            <code>useState</code> returns exactly two things: the value <em>for this render</em>, and
            a setter. The setter is the only legal way to change it.
          </li>
        </ul>
      </div>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function Counter() {
  // a plain variable: back to 0 every render, and changing it renders nothing
  let plain = 0;

  // state: kept between renders, and setting it asks React to render again
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <RenderCountDemo />
        </div>
      </div>
      <p className="callout">
        Click "Set to same value" above — the render count doesn't move. React compares the new state
        to the old one and skips the render when they're the same.
      </p>

      <h2>2. The initial value — always give one</h2>
      <CodeBlock
        code={`
function Bad() {
  const [query, setQuery] = useState(); // undefined on the first render
  const [todos, setTodos] = useState(); // .map() crashes on the first render
}

function Good() {
  const [query, setQuery] = useState(""); // "" — empty, but still a string
  const [todos, setTodos] = useState<Todo[]>([]); // [] — .map() never crashes
}
`}
        bad={[2, 3]}
        good={[7, 8]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            The initial value is used <strong>only on the very first render</strong>. On every render
            after that React hands back the stored value and ignores the argument entirely.
          </li>
          <li>
            Start from an empty value <em>of the right shape</em> — <code>""</code>,{" "}
            <code>0</code>, <code>false</code>, <code>[]</code>, <code>null</code> — so the first
            render has something real to work with.
          </li>
          <li>
            Skipping it makes the state <code>undefined</code>, which breaks two things at once: the
            first render (<code>undefined.map</code>, <code>undefined.length</code>) and TypeScript,
            which now infers the type as <code>undefined</code>.
          </li>
          <li>
            An input whose <code>value</code> starts as <code>undefined</code> starts{" "}
            <em>uncontrolled</em>, and React warns loudly the moment state turns it into a controlled
            one.
          </li>
          <li>
            If computing the initial value is expensive, pass a function —{" "}
            <code>{"useState(() => buildBoard())"}</code> — so it runs once instead of on every
            render.
          </li>
        </ul>
      </div>

      <h2>3. Typing state: when you need a generic</h2>
      <CodeBlock
        code={`
type Priority = "low" | "medium" | "high";
type Todo = { id: string; title: string; priority: Priority };

// Let TypeScript infer — the initial value fully describes the type
const [title, setTitle] = useState(""); // string
const [count, setCount] = useState(0); // number
const [isOpen, setIsOpen] = useState(false); // boolean

// Give the generic — the initial value infers something too wide or too empty
const [priority, setPriority] = useState<Priority>("medium"); // else: string
const [todos, setTodos] = useState<Todo[]>([]); // else: never[]
const [selected, setSelected] = useState<Todo | null>(null); // else: null
`}
      />
      <p className="callout">
        Rule of thumb: if the initial value can already hold every value the state will ever hold, let
        TS infer it. If the state will later hold something the initial value can't — another member
        of a union, items in an empty array, an object replacing <code>null</code> — write the
        generic.
      </p>

      <h2>4. Rules of hooks</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            Call hooks only from a <strong>React component</strong> or another custom hook — never
            from a plain function, a class, or an event handler.
          </li>
          <li>
            Call them at the <strong>top level</strong> of that component: never inside an{" "}
            <code>if</code>, a loop, a nested function, or after an early <code>return</code>.
          </li>
          <li>
            Why: React matches each <code>useState</code> to its stored value by <em>call order</em>,
            not by name. Skip one call on some render and every hook after it lines up with the wrong
            slot.
          </li>
          <li>
            So the number and order of hook calls must be identical on every single render — put the
            condition <em>inside</em> the hook's usage, not around the hook.
          </li>
        </ul>
      </div>
      <CodeBlock
        code={`
function Panel({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;
  const [tab, setTab] = useState("home"); // hook after an early return
  if (isOpen) {
    const [zoom, setZoom] = useState(1); // hook inside a condition
  }
  return <p>{tab}</p>;
}

function PanelFixed({ isOpen }: { isOpen: boolean }) {
  const [tab, setTab] = useState("home"); // every hook at the top level,
  const [zoom, setZoom] = useState(1); // in the same order on every render
  if (!isOpen) return null;
  return <p>{tab} at {zoom}x</p>;
}
`}
        bad={[3, 5]}
        good={[11, 12]}
      />

      <h2>5. What causes a re-render</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>Its own state changed.</strong> A setter was called with a new value.
          </li>
          <li>
            <strong>Its parent re-rendered.</strong> By default children re-render with the parent —
            whether or not the props they receive actually changed.
          </li>
          <li>
            On every render the <em>entire function body</em> runs again, top to bottom — not just
            the JSX, every line.
          </li>
          <li>
            React skips the re-render when a setter is called with the same value as the current one
            (compared with <code>Object.is</code>) — that's why "Set to same value" above did
            nothing.
          </li>
          <li>
            Calling a setter during render (rather than from an event handler or an effect) renders
            again, which calls the setter again — an infinite loop.
          </li>
          <li>
            <code>React.memo</code> opts a component out of the parent-re-rendered rule: it skips the
            render when its props haven't changed. An optimization, not a default.
          </li>
        </ul>
      </div>

      <h2>6. Queuing a series of state updates</h2>
      <p>
        A setter doesn't change the value on the spot — it schedules an update for the next render.
        The state variable in the handler you're already inside keeps the value it had for this
        render:
      </p>
      <CodeBlock
        code={`
function handleClickWrong() {
  setCount(count + 1); // both lines read the same count from this render
  setCount(count + 1); // net result: +1, not +2
}

function handleClickRight() {
  setCount((prev) => prev + 1); // prev is the latest queued value
  setCount((prev) => prev + 1); // net result: +2
}
`}
        bad={[2, 3]}
        good={[7, 8]}
      />
      <p className="callout">
        Pass a function to the setter whenever the next value depends on the current one.
      </p>

      <h2>7. Updating state, by data type</h2>
      <p>Primitives are the easy case — hand the setter the new value:</p>
      <CodeBlock
        code={`
setTitle("Ship the login form");
setCount(count + 1);
setIsOpen(!isOpen);
`}
      />
      <p>
        Arrays and objects are the case people get wrong. React compares state <strong>by
        reference</strong>, so changing an array/object in place and setting it again looks like "no
        change" — no re-render. Build a new one instead:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
tags.push(newTag); setTags(tags); // mutates: same reference
tags.sort(); setTags(tags); // same problem

setTags((prev) => [...prev, newTag]); // add
setTags((prev) => prev.filter((t) => t !== target)); // remove
setTodos((prev) =>
  prev.map((t) => (t.id === id ? { ...t, done: true } : t)), // update one
);
`}
          bad={[1, 2]}
          good={[4, 5]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <TagListDemo />
        </div>
      </div>
      <p>Objects follow the same rule — spread the old one, then override the fields you're changing:</p>
      <CodeBlock
        code={`
const [user, setUser] = useState({ name: "Ana", address: { city: "Lima" } });

user.name = "Bea"; setUser(user); // same object — React skips the re-render
setUser((prev) => ({ ...prev, name: "Bea" })); // new object

// nested: spread every level you touch
setUser((prev) => ({ ...prev, address: { ...prev.address, city: "Cusco" } }));
`}
        bad={[3]}
        good={[4, 7]}
      />
      <p className="callout">
        Spread copies one level. To change something nested, spread every level on the way down — or
        keep state flat enough that you never have to.
      </p>

      <h2>8. Derived &amp; unnecessary state</h2>
      <p className="callout">
        If a value can be computed from existing state/props on every render, don't put it in state
        too — compute it inline. Duplicate state drifts out of sync and is one more thing to keep
        updated.
      </p>
      <p>Conditional rendering shows up constantly with derived checks:</p>
      <CodeBlock
        code={`
function AddForm({ title, items }: { title: string; items: string[] }) {
  return (
    <>
      <button disabled={title.trim().length === 0}>Save</button>
      {items.length === 0 && <p>No items yet.</p>}
    </>
  );
}
`}
      />

      <h2>9. Event handlers</h2>
      <p>
        Same rule as passing a function as a prop on Day 6, because that's exactly what this is:{" "}
        <code>onClick</code> is a prop, and it wants a <strong>function</strong>, not the result of
        calling one. <strong>No parentheses.</strong>
      </p>
      <CodeBlock
        code={`
type TodoRowProps = { todo: Todo; onDelete: (id: string) => void };

function TodoRow({ todo, onDelete }: TodoRowProps) {
  function handleDelete() {
    onDelete(todo.id);
  }

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleDelete()}>Delete</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </>
  );
}
`}
        good={[10, 12]}
        bad={[11]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <code>{"onClick={handleDelete}"}</code> — a reference. React holds onto it and calls it
            when the click happens.
          </li>
          <li>
            <code>{"onClick={handleDelete()}"}</code> — a call. It runs <em>during render</em> and
            hands <code>onClick</code> the return value (usually <code>undefined</code>), so clicking
            does nothing. If the handler sets state, that's an infinite render loop.
          </li>
          <li>
            <code>{"onClick={() => onDelete(todo.id)}"}</code> — an inline arrow. Still a function
            value, just written at the call site. Use it to pass an argument, or for a one-line body.
          </li>
          <li>
            The same three shapes apply to every event prop — <code>onChange</code>,{" "}
            <code>onSubmit</code>, <code>onKeyDown</code> — and to handlers you pass down to your own
            components.
          </li>
        </ul>
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Fires when</th>
            <th>Handler parameter</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>onClick</code></td>
            <td>the element is clicked</td>
            <td><code>React.MouseEvent</code></td>
          </tr>
          <tr>
            <td><code>onChange</code></td>
            <td>an input/select/textarea value changes — every keystroke</td>
            <td><code>{"React.ChangeEvent<HTMLInputElement>"}</code> — read <code>e.target.value</code></td>
          </tr>
          <tr>
            <td><code>onSubmit</code></td>
            <td>a form is submitted, by button or by Enter</td>
            <td><code>React.FormEvent</code> — start with <code>e.preventDefault()</code></td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        code={`
function SignupForm() {
  const [email, setEmail] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("submitting", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={handleChange} />
      <button type="submit">Sign up</button>
    </form>
  );
}
`}
      />
    </div>
  );
}
