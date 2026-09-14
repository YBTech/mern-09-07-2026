import type { ReactNode } from "react";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

// --- tiny demo components rendered live in "Section 2", not exported ---

function Greeting({ name, age }: { name: string; age: number }) {
  return (
    <p>
      Hi, {name}! You are {age}.
    </p>
  );
}

function Box() {
  return (
    <div
      style={{
        backgroundColor: "tomato",
        color: "#fff",
        padding: 12,
        borderRadius: 6,
      }}
    >
      Styled!
    </div>
  );
}

function UserCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: "0.75rem 1rem",
      }}
    >
      {children}
    </div>
  );
}

function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>;
}

type Student = { id: string; name: string; grade: number };
const students: Student[] = [
  { id: "s1", name: "Ana", grade: 92 },
  { id: "s2", name: "Ben", grade: 78 },
  { id: "s3", name: "Cy", grade: 85 },
];

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 6 Notes</title>
      <DayNav day="day6-components-basics" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 6 · Notes</p>
        <h1>Components Basics: Describing the UI</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>
            Be able to create function components, import/export them with both default and named
          </li>
          <li>
            Start every component name with a capital letter
          </li>
          <li>
            Rules of JSX: one root element per <code>return</code>, every tag closed,{" "}
           <code>{"{ }"}</code> around any JS value.
          </li>
          <li>
            Props arrive as one object — destructure them, and type them inline or with an{" "}
            <code>interface</code>
          </li>
          <li>
            Pass props of every shape: string, number, boolean, array, object, function,{" "}
            <code>children</code>
          </li>
          <li>
            Pass a function prop without calling it: <code>onSelect={"{handleSelect}"}</code>, never{" "}
            <code>onSelect={"{handleSelect()}"}</code>
          </li>
          <li>
            Render conditionally with <code>&amp;&amp;</code>, <code>||</code>, a ternary, or an early{" "}
            <code>return</code>
          </li>
          <li>
            Render a list with <code>.map()</code>, keyed on a stable unique id — never an index or a
            value generated during render
          </li>
        </ul>
        <p>
          Want more?{" "}
          <a href="/day6-components-basics/homework/concepts">
            View all concepts.
          </a>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}>Section 2 — Full Walkthrough</h2>

      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            React is a UI library: instead of manually finding elements and
            mutating them (<code>document.querySelector</code>,{" "}
            <code>.innerHTML</code>), you describe what the UI should look like
            for a given state, and React figures out the DOM updates.
          </li>
          <li>
            It keeps a lightweight in-memory copy of the UI tree — the "virtual
            DOM" — compares the new one against the previous one on every
            update, and patches only what actually changed in the real DOM
            instead of re-rendering everything from scratch.
          </li>
          <li>
            This is what makes UI code declarative instead of a long list of
            manual DOM-mutation steps.
          </li>
        </ul>
      </div>

      <h2>1. Components, import &amp; export</h2>
      <p>
        A component is a function that returns JSX, with a capitalized name.
        That's the whole definition:
      </p>
      <CodeBlock
        code={`
// Greeting.tsx
export default function Greeting() {
  return (
    <div className="greeting">
      <h1>Hello, world!</h1>
      <p>Welcome to React.</p>
    </div>
  );
}
`}
      />
      <p>
        Another file imports it by whatever name it likes — a default import has
        no name to match:
      </p>
      <CodeBlock
        code={`
// App.tsx
import Greeting from "./Greeting";

export default function App() {
  return <Greeting />;
}
`}
      />
      <h3>The name must start with a capital letter</h3>
      <p>
        This one is a rule, not a style preference — JSX reads the case of that
        first letter to decide what it's even building:
      </p>
      <CodeBlock
        code={`
<greeting name="Ana" />
<Greeting name="Ana" />
`}
        language="xml"
        bad={[1]}
        good={[2]}
      />
      <p>Those two compile to different things entirely:</p>
      <CodeBlock
        code={`
// lowercase becomes a string — "build a literal <greeting> element"
React.createElement("greeting", { name: "Ana" });

// capitalized becomes a reference — "call this function"
React.createElement(Greeting, { name: "Ana" });
`}
        bad={[2]}
        good={[5]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            Neither version throws. The browser happily renders an unknown,
            empty <code>&lt;greeting&gt;</code> element, so the page just has a
            blank space where your component should be.
          </li>
          <li>
            Your props go along for the ride as unrecognized HTML attributes —
            no error, no warning, nothing in the console.
          </li>
          <li>
            The rule covers the definition too: name the function{" "}
            <code>Greeting</code>, and give the file the same name.
          </li>
        </ul>
      </div>

      <h3>The same component, with a named export</h3>
      <p>
        Drop the <code>default</code> keyword and a file can export as many
        components as it wants:
      </p>
      <CodeBlock
        code={`
// Greetings.tsx
export function Greeting() {
  return <h1>Hello, world!</h1>;
}

export function Farewell() {
  return <h1>Goodbye!</h1>;
}
`}
      />
      <p>
        Now the import needs curly braces, and the name has to match exactly:
      </p>
      <CodeBlock
        code={`
// App.tsx
import { Greeting, Farewell } from "./Greetings";

export default function App() {
  return (
    <>
      <Greeting />
      <Farewell />
    </>
  );
}
`}
      />
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th>Default export</th>
            <th>Named export</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Export</td>
            <td>
              <code>export default function Greeting()</code>
            </td>
            <td>
              <code>export function Greeting()</code>
            </td>
          </tr>
          <tr>
            <td>Import</td>
            <td>
              <code>import Greeting from "./f"</code>
            </td>
            <td>
              <code>import {"{ Greeting }"} from "./f"</code>
            </td>
          </tr>
          <tr>
            <td>How many per file</td>
            <td>One</td>
            <td>As many as you like</td>
          </tr>
          <tr>
            <td>Name at the import site</td>
            <td>Anything you want</td>
            <td>
              Must match (rename with <code>as</code>)
            </td>
          </tr>
        </tbody>
      </table>

      <h2>2. The rules of JSX</h2>
      <p>
        JSX looks like HTML but compiles to plain JS function calls — the
        browser never sees it, Vite's build step transforms it first. Because it
        becomes real code, it's stricter than HTML.
      </p>

      <h3>
        Rule 1 — one root element per <code>return</code>
      </h3>
      <p>
        A function can only return one value, so JSX can only return one
        element:
      </p>
      <CodeBlock
        code={`
// ❌ WRONG — two sibling elements returned at once
function Bio() {
  return (
    <h1>Ana</h1>
    <p>Frontend developer</p>
  );
}

// ✅ CORRECT — one root element wrapping both
function Bio() {
  return (
    <div>
        <h1>Ana</h1>
        <p>Frontend developer</p>
    </div>
  );
}
`}
        bad={[4, 5]}
        good={[12, 15]}
      />
      <p>
        Don't want the extra <code>&lt;div&gt;</code> in the real DOM? Use a
        Fragment — <code>&lt;&gt;...&lt;/&gt;</code> groups children and renders
        nothing itself:
      </p>
      <CodeBlock
        code={`
function Bio() {
  return (
    <>
      <h1>Ana</h1>
      <p>Frontend developer</p>
    </>
  );
}
`}
      />

      <h3>Rule 2 — close every tag</h3>
      <CodeBlock
        code={`
<img src="/ana.png">
<br>
<input type="text">

<img src="/ana.png" />
<br />
<input type="text" />
`}
        language="xml"
        bad={[1, 2, 3]}
        good={[5, 6, 7]}
      />

      <h3>
        Rule 3 — <code>className</code>, and camelCase everything
      </h3>
      <p>
        JSX attributes become JS object keys, and <code>class</code> is a
        reserved word in JavaScript — hence <code>className</code>. Every other
        multi-word attribute is camelCase too:
      </p>
      <CodeBlock
        code={`
// ❌ WRONG — HTML attribute names
const wrong = <div class="intro" onclick={open} tabindex="0" />;

// ✅ CORRECT — className, camelCase, JS values in braces
const right = <div className="intro" onClick={open} tabIndex={0} />;
`}
        bad={[2]}
        good={[5]}
      />

      <h3>
        Rule 4 — <code>{"{ }"}</code> drops real JS into the markup
      </h3>
      <p>
        Anything between curly braces is a JS expression, evaluated and
        inserted:
      </p>
      <CodeBlock
        code={`
function Score() {
  const name = "Ana";

  return <p>{name} scored {2 + 2} points in { new Date().getFullYear() }</p>;
}
`}
      />
      <p className="callout">
        An <em>expression</em>, not a statement —{" "}
        <code>{"{ if (x) ... }"}</code> is invalid. Use a ternary, or move the{" "}
        <code>if</code> above the <code>return</code>.
      </p>

      <h3>Your turn — fix the broken JSX</h3>
      <p>
        This HTML was pasted straight into a component. It's broken in four
        places — fix it:
      </p>
      <CodeBlock
        code={`
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
`}
        language="xml"
      />
      <p className="callout">
        The compiler tells you about the first one only:{" "}
        <code>
          Adjacent JSX elements must be wrapped in an enclosing tag. Did you
          want a JSX fragment &lt;&gt;...&lt;/&gt;? (6:4)
        </code>{" "}
        — fix that, re-run, and it reports the next.
      </p>
      <details>
        <summary>Show the fix</summary>
        <div className="answer">
          <CodeBlock
            code={`
export default function Bio() {
  return (
    <>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br />
        <br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </>
  );
}
`}
          />
          <ul>
            <li>
              Two roots (<code>&lt;div&gt;</code> and <code>&lt;p&gt;</code>) —
              wrapped in a Fragment.
            </li>
            <li>
              <code>class</code> → <code>className</code>, twice.
            </li>
            <li>
              <code>&lt;br&gt;</code> → <code>&lt;br /&gt;</code>, twice.
            </li>
            <li>
              <code>&lt;b&gt;And &lt;i&gt;pictures&lt;/b&gt;&lt;/i&gt;</code> is
              mis-nested — inner tags close first.
            </li>
          </ul>
        </div>
      </details>

      <h2>3. Props</h2>
      <p>
        Props are how a parent passes data into a child. Start with the plain-JS
        version, before types get in the way:
      </p>

      <h3>3a. Props are one object</h3>
      <CodeBlock
        code={`
// Greeting.jsx — plain JavaScript, no types yet
function Greeting(props) {
  console.log(props); // { name: "Ana", age: 16 }
  return <p>Hi, {props.name}! You are {props.age}.</p>;
}

function App() {
  return <Greeting name="Ana" age={16} />;
}
`}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            React calls your component with{" "}
            <strong>exactly one argument</strong>: an object whose keys are the
            attributes you wrote in the JSX tag.
          </li>
          <li>
            Writing three attributes does <em>not</em> give the function three
            parameters. Three attributes in, one object out —{" "}
            <code>{'{ name: "Ana", age: 16 }'}</code>.
          </li>
          <li>
            The name <code>props</code> is just a convention for that parameter;
            it's an ordinary function argument like any other.
          </li>
        </ul>
      </div>

      <h3>3b. The mistake everyone makes: not destructuring</h3>
      <CodeBlock
        code={`
// ❌ WRONG — React never passes a second argument
function Greeting(name, age) {
  return <p>Hi, {name}! You are {age}.</p>;
}
// name === { name: "Ana", age: 16 }  → "Objects are not valid as a React child"
// age  === undefined                 → renders nothing

// ✅ CORRECT — one parameter, read the keys off it
function Greeting(props) {
  return <p>Hi, {props.name}! You are {props.age}.</p>;
}

// ✅ BEST — destructure the object right in the parameter list
function Greeting({ name, age }) {
  return <p>Hi, {name}! You are {age}.</p>;
}
`}
        bad={[2]}
        good={[9, 14]}
      />
      <p className="callout">
        <code>{"{ name, age }"}</code> in the parameter list is not "two
        parameters" — it's ordinary JS destructuring, pulling two keys out of
        the single object React handed you.
      </p>

      <h3>3c. The same component, typed</h3>
      <p>
        For one or two props, type the object inline right where you destructure
        it:
      </p>
      <CodeBlock
        code={`
function Greeting({ name, age }: { name: string; age: number }) {
  return <p>Hi, {name}! You are {age}.</p>;
}
`}
      />
      <p>
        Once it grows past that — or you need to reuse the type — pull it out
        into an <code>interface</code> (or a <code>type</code>; they're
        interchangeable here):
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
interface GreetingProps {
  name: string;
  age: number;
  nickname?: string; // optional
}

export default function Greeting({
  name,
  age,
  nickname,
}: GreetingProps) {
  return (
    <p>Hi, {nickname ?? name}! You are {age}.</p>
  );
}

function App() {
  return (
    <>
      <Greeting name="Ana" age={16} />
      <Greeting name="Ben" age={17} />
    </>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <Greeting name="Ana" age={16} />
          <Greeting name="Ben" age={17} />
        </div>
      </div>

      <h3>3d. Passing each type of value</h3>
      <p>
        Only a string literal can use plain quotes.{" "}
        <strong>
          Every other value goes in <code>{"{ }"}</code>
        </strong>
        :
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Value</th>
            <th>How you pass it</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>string</td>
            <td>
              <code>name="Ana"</code>
            </td>
          </tr>
          <tr>
            <td>number</td>
            <td>
              <code>age={"{16}"}</code>
            </td>
          </tr>
          <tr>
            <td>boolean</td>
            <td>
              <code>isAdmin={"{true}"}</code> — or just <code>isAdmin</code>
            </td>
          </tr>
          <tr>
            <td>array</td>
            <td>
              <code>hobbies={'{["chess", "guitar"]}'}</code>
            </td>
          </tr>
          <tr>
            <td>object</td>
            <td>
              <code>address={'{{ city: "NYC" }}'}</code> — braces inside braces
            </td>
          </tr>
          <tr>
            <td>function</td>
            <td>
              <code>onSelect={"{handleSelect}"}</code> — no parentheses
            </td>
          </tr>
          <tr>
            <td>element</td>
            <td>
              <code>icon={"{<StarIcon />}"}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        code={`
type ProfileProps = {
  name: string;
  age: number;
  isAdmin: boolean;
  hobbies: string[];
  address: { city: string; zip: string };
  onSelect: (id: string) => void;
};

function App() {
  return (
    <Profile
      name="Ana"
      age={16}
      isAdmin
      hobbies={["chess", "guitar"]}
      address={{ city: "NYC", zip: "10001" }}
      onSelect={handleSelect}
    />
  );
}
`}
      />
      <p>
        The object case is the one that trips people up. The <em>outer</em>{" "}
        braces mean "a JS expression goes here"; the <em>inner</em> braces are
        the object literal itself:
      </p>
      <CodeBlock
        code={`
<Profile address={ city: "NYC" } />
<Profile address={{ city: "NYC" }} />
`}
        language="xml"
        bad={[1]}
        good={[2]}
      />
      <p>
        That's also why the built-in <code>style</code> prop is always
        double-braced — it takes a JS object, not a CSS string, with camelCase
        keys and unitless numbers defaulting to pixels:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function Box() {
  return (
    <div style={{
      backgroundColor: "tomato",
      color: "#fff",
      padding: 12,
      borderRadius: 6,
    }}>
      Styled!
    </div>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <Box />
        </div>
      </div>
      <p className="callout">
        For anything beyond a couple of inline overrides, a real CSS class is
        easier to read and maintain than a growing <code>style</code> object.
      </p>

      <h3>3e. Passing a function as a prop</h3>
      <p>
        A function is just another value — pass the function itself, never the
        result of calling it:
      </p>
      <CodeBlock
        code={`
function StudentRow({ onSelect }: { onSelect: (id: string) => void }) {
  return <button onClick={() => onSelect("s1")}>Pick Ana</button>;
}

function App() {
  function handleSelect(id: string) {
    console.log("picked", id);
  }

  return (
    <>
      {/* ❌ WRONG — the () calls handleSelect right now, during render, */}
      {/*    and passes its return value (undefined) as the prop */}
      <StudentRow onSelect={handleSelect()} />

      {/* ✅ CORRECT — pass the function itself, no parentheses */}
      <StudentRow onSelect={handleSelect} />

      {/* ✅ CORRECT — need to pass an argument? wrap it in an arrow function */}
      <StudentRow onSelect={(id) => handleSelect(id)} />

      {/* ✅ CORRECT — same idea, but the arrow is anonymous: */}
      {/*    its body is written right here, at the call site */}
      <StudentRow onSelect={(id) => console.log("picked", id)} />
    </>
  );
}
`}
        bad={[14]}
        good={[17, 20, 24]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <code>handleSelect</code> is a reference to the function.{" "}
            <code>handleSelect()</code> is an instruction to <em>run it now</em>{" "}
            and use whatever it returns.
          </li>
          <li>
            So <code>onSelect={"{handleSelect()}"}</code> does two wrong things
            at once: the handler fires on every render instead of on click, and
            the prop ends up <code>undefined</code> — clicking does nothing.
          </li>
          <li>
            If that handler sets state, you've also just written an infinite
            loop: render → call → set state → render.
          </li>
          <li>
            An <strong>inline arrow</strong> is not a different rule —{" "}
            <code>{"(id) => ..."}</code> <em>is</em> a function value, so
            passing it is still passing a reference. It's just written at the
            call site instead of being declared and named first.
          </li>
          <li>
            Reach for a named handler when the body is more than a line or is
            reused; reach for an inline arrow when it's a one-liner or you need
            to bake in an argument.
          </li>
          <li>
            Same rule for the built-in ones: <code>onClick={"{save}"}</code> or{" "}
            <code>onClick={"{() => save(id)}"}</code>, never{" "}
            <code>onClick={"{save(id)}"}</code> — the last one runs{" "}
            <code>save</code> during render and hands <code>onClick</code> its
            return value.
          </li>
        </ul>
      </div>

      <h3>
        3f. The <code>children</code> prop
      </h3>
      <p>
        Whatever you put between a component's opening and closing tags is
        passed in automatically as the <code>children</code> prop, typed as{" "}
        <code>React.ReactNode</code>:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function UserCard({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

function App() {
  return (
    <UserCard>
      <strong>Ana</strong> — 16 years old
    </UserCard>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <UserCard>
            <strong>Ana</strong> — 16 years old
          </UserCard>
        </div>
      </div>
      <p className="callout">
        <code>children</code> is an ordinary prop with a name React fills in for
        you — it can hold text, one element, a list of elements, or nothing at
        all, which is exactly what <code>ReactNode</code> describes.
      </p>
      <p>
        <strong>Props are read-only.</strong> A component must never reassign or
        mutate the props object it receives — treat it the same way you'd treat
        a function argument you don't own.
      </p>

      <h2>4. Conditional rendering</h2>
      <p>Four tools, same idea — decide what to return based on a condition:</p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
// ternary — pick between two things
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>;
}

function Badges({ isAdmin, nickname }: {
  isAdmin: boolean;
  nickname?: string;
}) {
  return (
    <>
      {/* && — render it, or render nothing at all */}
      {isAdmin && <span>Admin</span>}

      {/* || (or ??) — fall back to a default value */}
      <span>{nickname || "Anonymous"}</span>
    </>
  );
}

// early return — bail out before the main JSX
function Profile({ user }: { user: Student | null }) {
  if (!user) return <p>Loading…</p>;
  return <h1>{user.name}</h1>;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <LoginStatus isLoggedIn={true} />
          <LoginStatus isLoggedIn={false} />
        </div>
      </div>
      <p className="callout">
        Watch out for{" "}
        <code>
          {"{"}count &amp;&amp; &lt;p&gt;items&lt;/p&gt;{"}"}
        </code>{" "}
        when <code>count</code> is <code>0</code> — <code>&amp;&amp;</code>{" "}
        returns the left side when it's falsy, so React renders a literal{" "}
        <code>0</code> on the page. Use a real boolean (
        <code>count &gt; 0</code>) instead.
      </p>

      <h2>5. Rendering lists</h2>
      <p>
        Use <code>.map()</code> to turn an array into an array of elements.
        Every item needs a stable, unique <code>key</code> so React can track it
        across re-renders:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
type Student = { id: string; name: string; grade: number };

function StudentList({ students }: { students: Student[] }) {
  return (
    <ul>
      {students.map((s) => (
        // implicit return needs parens;
        // explicit return needs { } and a ; on the return line
        <li key={s.id}>{s.name} — {s.grade}</li>
      ))}
    </ul>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <ul>
            {students.map((s) => (
              <li key={s.id}>
                {s.name} — {s.grade}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p>Key do's and don'ts:</p>
      <CodeBlock
        code={`
<li key={student.id}> <!-- the item's own id — same row, same key -->
<li key={index}> <!-- a reorder shifts it onto a different item -->
<li key={Date.now()}> <!-- new key every render — the list re-mounts -->
<li key={Math.random()}> <!-- same, and two rows can collide -->
<li key={uuidv4()}> <!-- generate the id once, at creation -->
`}
        language="xml"
        good={[1]}
        bad={[2, 3, 4, 5]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            React uses the key to match each rendered element to the same
            element from the previous render — that's how it knows "this is the
            same todo, just moved" vs. "this is a new one."
          </li>
          <li>
            An array index looks stable but isn't: if an item is inserted,
            removed, or reordered, every index after it now points at a{" "}
            <em>different</em> item, so React re-renders those rows for nothing
            and mismatches state/DOM (a half-typed text input, a checked box) to
            the wrong record.
          </li>
          <li>
            <code>Date.now()</code>, <code>Math.random()</code> and{" "}
            <code>uuidv4()</code> are worse — called during render, they
            generate a brand-new key every single time, so React thinks every
            item is new, throws the whole list away and re-mounts it.
          </li>
          <li>
            The fix: a real, stable, unique id that already identifies the
            record — a database id, or one generated <em>once</em> when the item
            is created, not while rendering it.
          </li>
        </ul>
      </div>

      <h2>6. Keeping components pure</h2>
      <p>
        A <strong>pure function</strong> always returns the same output for the
        same input, and doesn't touch anything outside itself (no mutating outer
        variables, no network calls, no writing to the DOM directly).
      </p>
      <p>
        A component must be pure the same way: rendering should only compute and
        return JSX, with zero side effects.
      </p>
      <CodeBlock
        code={`
let guestCount = 0;
function Guest() { guestCount++; return <p>Guest #{guestCount}</p>; }

function Guest({ num }: { num: number }) { return <p>Guest #{num}</p>; }
`}
        bad={[1, 2]}
        good={[4]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            Mutating a variable outside the component, logging on every render,
            or firing a network request directly in the function body are all
            side effects — they happen as a byproduct of calling the function,
            not as its return value.
          </li>
          <li>
            The problem: React can call a component's function more than once
            per commit (Strict Mode, concurrent rendering) and can throw away an
            in-progress render. A side effect that ran during a discarded render
            still happened — <code>guestCount</code> above is now wrong.
          </li>
          <li>
            <code>React.StrictMode</code> (already wrapping this whole app in{" "}
            <code>main.tsx</code>) deliberately renders every component twice,
            in development only, specifically to surface impurities like this
            early instead of in production.
          </li>
        </ul>
      </div>
    </div>
  );
}
