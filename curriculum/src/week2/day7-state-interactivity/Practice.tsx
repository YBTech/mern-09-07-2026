import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import {
  EventHandlerDemo,
  FunctionFormDemo,
  ImmutableUpdateDemo,
  StateBasicsDemo,
} from "./_solution";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 7 Practice</title>
      <DayNav day="day7-state-interactivity" current="practice" />
      <h1>Day 7 — Practice</h1>
      <p className="intro">
        Some tasks ask you to build, some hand you broken code, some ask you to
        predict before you run it — do all three kinds.
      </p>
      <p className="callout">
        Work through these during the gap between lecture and lab. Use{" "}
        <a href="/week2/day7-state-interactivity/notes">Notes</a> as your reference if
        you get stuck on syntax.
      </p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>
            Be able to declare state with a setter and a real starting value.
          </p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
const count = useState(0);
const [tags] = useState<string[]>([]);
const [items, setItems] = useState();
`}
          />
          <ul className="task-list">
            <li>
              Say what <code>count</code> actually holds, and what{" "}
              <code>count + 1</code> gives you.
            </li>
            <li>Line 2 compiles fine — explain what you can't do with it.</li>
            <li>
              Render <code>items.length</code> from line 3 and read the error
              you get.
            </li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. a Counter: one number state, a button that bumps it, the value on screen
// 2. pick the right empty start for a search box, a like count, and a tag list
// 3. a state that starts as null and later holds a selected object
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <StateBasicsDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>
            Be able to use the function form when the next value depends on the
            current one.
          </p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
// count is 0 before either handler runs
function bumpTwice() {
  setCount(count + 1);
  setCount(count + 1);
}

function bumpTwiceFn() {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
}
`}
          />
          <ul className="task-list">
            <li>
              Write down what <code>count</code> is after each handler runs,
              before you test it.
            </li>
            <li>
              Explain the difference in terms of <em>when</em> the state
              variable gets its value.
            </li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. a "+3" button that adds three in one click — try both forms, keep what works
// 2. a toggle that flips a boolean, written with the function form
// 3. a Reset button that puts the count back to its initial value
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <FunctionFormDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Be able to obey the rules of hooks.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
function Sidebar({ user, sections }: SidebarProps) {
  if (!user) return <p>Please log in.</p>;

  const [active, setActive] = useState("inbox");

  for (const section of sections) {
    const [open, setOpen] = useState(false);
  }

  function handleClick() {
    const [hovered, setHovered] = useState(false);
  }

  return <nav>{active}</nav>;
}
`}
          />
          <ul className="task-list">
            <li>
              Three hook calls here are illegal — name the rule each one breaks.
            </li>
            <li>
              Explain why React can't match state to the right hook when a call
              is skipped.
            </li>
            <li>
              Rewrite it so every hook runs at the top level, keeping the same
              behaviour.
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Be able to say what makes a component render again.</p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
function Parent() {
  const [count, setCount] = useState(0);
  let clicks = 0;

  return (
    <>
      <button onClick={() => setCount(count + 1)}>state {count}</button>
      <button onClick={() => { clicks++; }}>plain {clicks}</button>
      <button onClick={() => setCount(count)}>same value</button>
      <Child />
    </>
  );
}
`}
          />
          <ul className="task-list">
            <li>
              Which of the three buttons re-renders <code>Parent</code>, and
              which does nothing?
            </li>
            <li>
              Does <code>Child</code> re-render on a click, even though it takes
              no props?
            </li>
            <li>
              Put a <code>console.log</code> at the top of both components and
              check all three answers.
            </li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Be able to update arrays and objects without mutating them.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
books.push(newBook); setBooks(books);
books.sort(); setBooks(books);
books[0].read = true; setBooks(books);
user.address.city = "Lima"; setUser(user);
`}
          />
          <ul className="task-list">
            <li>
              All four leave the screen unchanged — say what React compares, and
              what it sees.
            </li>
            <li>Rewrite each one so the setter gets something new.</li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. add an item to a list without .push
// 2. remove one by id without .splice
// 3. flip one item's done flag and leave every other item untouched
// 4. change user.address.city without mutating user or user.address
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ImmutableUpdateDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>Be able to hand an event prop a function instead of a call.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
<button onClick={handleDelete()}>Delete</button>
<button onClick={handleDelete(book.id)}>Delete</button>
<input onChange={setQuery(e.target.value)} />
<form onSubmit={handleSubmit()}>
`}
            language="xml"
          />
          <ul className="task-list">
            <li>
              Say when each of these runs, and what the event prop ends up
              holding.
            </li>
            <li>
              Line 3 has a second problem on top of that — where is{" "}
              <code>e</code> supposed to come from?
            </li>
            <li>
              One of them causes an infinite render loop the moment its handler
              sets state — which, and why?
            </li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. a Delete button per row, each passing its own id to one shared handler
// 2. an onChange that reads e.target.value and writes it to state
// 3. an onSubmit on the form, typed with React.FormEvent
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <EventHandlerDemo />
          </div>
        </div>
      </div>

      <p className="section-label">Advanced</p>
      <p className="section-note">
        Typing state, derived state, and re-render behaviour — taught in the
        walkthrough but not in today's essentials, and pitched a notch harder
        than the list above.
      </p>

      <div className="task advanced">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Be able to tell when state needs an explicit type.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
// 1. hover each of these and write down what TS infers, before changing them:
//    useState(""), useState(0), useState([]), useState(null)
// 2. a status that is only "idle" | "loading" | "done" — reject other strings
// 3. a list of objects that starts empty — make pushing the wrong shape fail
// 4. a selection that starts null and later holds an object — write that union
`}
          />
          <p className="bonus">
            State the rule in one sentence: when is inference enough, and when
            do you need the generic?
          </p>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">8</span>
        <div className="task-body">
          <p>Be able to delete state that shouldn't exist.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
const [items, setItems] = useState<Item[]>([]);
const [count, setCount] = useState(0);
const [isEmpty, setIsEmpty] = useState(true);

function addItem(item: Item) {
  setItems([...items, item]);
  setCount(count + 1);
  setIsEmpty(false);
}
`}
          />
          <ul className="task-list">
            <li>
              Two of these three states are duplicates — say which, and what
              they duplicate.
            </li>
            <li>
              Write a <code>removeItem</code> that makes the screen contradict
              itself.
            </li>
            <li>
              Delete the duplicates and compute both values while rendering
              instead.
            </li>
          </ul>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">9</span>
        <div className="task-body">
          <p>
            Be able to explain when a child re-renders, and when it doesn't.
          </p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
const Child = React.memo(function Child({ label }: { label: string }) {
  console.log("Child rendered");
  return <p>{label}</p>;
});

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child label="static" />
    </>
  );
}
`}
          />
          <ul className="task-list">
            <li>
              How many times does "Child rendered" log across three clicks —
              with the memo, and without it?
            </li>
            <li>
              Now also pass <code>onPick={"{() => setCount(0)}"}</code> to{" "}
              <code>Child</code>. The memo stops helping — explain what changed
              about the props.
            </li>
            <li>
              Say why <code>React.memo</code> is an optimization and not the
              default.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
