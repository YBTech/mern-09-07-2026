import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import {
  ChildrenDemo,
  ConditionalDemo,
  DepartureBoardDemo,
  EventCardDemo,
  ExportImportDemo,
  FunctionPropDemo,
  KeyedListDemo,
  RecipeCollectionDemo,
  TypedPropsDemo,
} from "./_solution";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 6 Practice</title>
      <DayNav day="day6-components-basics" current="practice" />
      <h1>Day 6 — Practice</h1>
      <p className="intro">
        Some tasks ask you to build, some hand you broken code, some ask you to predict before you run
        it — do all three kinds.
      </p>
      <p className="callout">
        Work through these during the gap between lecture and lab. Use{" "}
        <a href="/day6-components-basics/notes">Notes</a> as your reference if you get stuck on syntax.
      </p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Be able to export a component and import it somewhere else.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
// 1. Greeting.tsx — write the whole component, default-export it, render it from App
// 2. Greetings.tsx — put two components in one file, switch both to named exports
// 3. App.tsx — import both with { } and render them side by side
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ExportImportDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Be able to fix a block of JSX that won't compile.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
export default function ProductCard() {
  return (
    <h2 class="title">Wireless Mouse</h2>
    <img src="/mouse.png">
    <p>In stock: <b>12</p></b>
    <button onclick={buy}>Buy</button>
  );
}
`}
            language="xml"
          />
          <p className="bonus">
            Five separate things are wrong — fix them one at a time and re-read the error after each.
          </p>
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Be able to say why a component renders nothing at all.</p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
<greeting name="Ana" />
<Greeting name="Ana" />
`}
            language="xml"
          />
          <ul className="task-list">
            <li>Which one does React treat as a plain HTML tag instead of your component?</li>
            <li>What lands in the DOM for it, and why is the console silent about it?</li>
            <li>Render both, open the Elements panel, and confirm what you predicted.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Be able to type props and destructure them in the parameter list.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
function Badge({ ... }: { ... }) // 1. one prop, label (string) — type it inline as you destructure
interface BookProps { ... } // 2. declare it: title, pages (number), inStock (boolean), optional subtitle
function Book({ ... }: BookProps) // 3. destructure all four; render the subtitle only when it exists
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <TypedPropsDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Be able to read props off the single object React hands you.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
function BookRow(title, pages) {
  return <li>{title} — {pages}p</li>;
}

function App() {
  return <BookRow title="Dune" pages={412} />;
}
`}
          />
          <ul className="task-list">
            <li>Open the console before you fix it — the error names what <code>title</code> really was.</li>
            <li>Say what <code>pages</code> holds, and why nothing renders for it.</li>
            <li>Fix it twice: once reading <code>props.title</code>, once destructuring in the parameter list.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>Be able to pass every kind of value as a prop.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
<Ticket
  title={"Printer jam"}
  priority="3"
  isOpen="false"
  tags="urgent, hardware"
  meta={ id: "t-91" }
  onClose={closeTicket()}
/>
`}
            language="xml"
          />
          <p className="bonus">
            One line is only clumsy; the other five are actually broken — fix each and say what it was
            passing instead.
          </p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. EventCard — receives title (string), seats (number), isSoldOut (boolean),
//    speakers (string[]), venue (an object with city + room), and onRsvp (a function)
// 2. render two EventCards from App with a different value for every prop
// 3. add an optional note prop, pass it to one card only, and render "—" when it's missing
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <EventCardDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Be able to tell a function prop from a function call.</p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
<TicketRow onClose={closeTicket} />
<TicketRow onClose={closeTicket()} />
<TicketRow onClose={() => closeTicket("t-91")} />
`}
            language="xml"
          />
          <ul className="task-list">
            <li>Which one runs <code>closeTicket</code> during render, before anyone clicks?</li>
            <li>Which one leaves <code>onClose</code> as <code>undefined</code>?</li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. TicketRow — takes an onClose prop and a Close button that calls it with the ticket id
// 2. render three rows from App sharing one handler that logs which id closed
// 3. add an onEscalate prop that takes no arguments — pass it without wrapping it in an arrow
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <FunctionPropDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">8</span>
        <div className="task-body">
          <p>Be able to build a component that wraps whatever you put inside it.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
// 1. Panel — takes only children, typed as React.ReactNode, and renders them in a bordered box
// 2. reuse it three times: around a paragraph, around a list, and around another component
// 3. add a heading prop alongside children, and render the heading above them
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ChildrenDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">9</span>
        <div className="task-body">
          <p>Be able to render conditionally four different ways.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
// 1. ternary — show "In stock" or "Sold out" from one boolean prop
// 2. && — render a "Last one!" badge only when seats is exactly 1
// 3. ?? — fall back to "Anonymous" when a nickname prop wasn't passed
// 4. early return — return <p>Loading…</p> above the main JSX when the prop is null
`}
          />
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
<p>{seats && <span>{seats} seats left</span>}</p>
`}
            language="xml"
          />
          <p className="bonus">
            Set <code>seats</code> to <code>0</code> — what appears on the page, and why? Fix it
            without changing the message.
          </p>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ConditionalDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">10</span>
        <div className="task-body">
          <p>Be able to render an array as a list with a stable key.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
// 1. render 5+ items with .map(), keyed on each item's own id — never the index
// 2. pull the row's JSX out into its own component that takes one item as a prop
// 3. keep the key on the element .map() returns, not on anything inside the row component
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <KeyedListDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">11</span>
        <div className="task-body">
          <p>Be able to pick a key that survives a reorder.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
<li key={i}>
<li key={Math.random()}>
<li key={uuidv4()}>
<li key={book.title}>
`}
            language="xml"
          />
          <ul className="task-list">
            <li>Say what breaks for each — three are wrong outright, one is only safe under a promise you have to make.</li>
            <li>
              Prove the index one: render a list with <code>key={"{index}"}</code>, put a text input in
              every row, type in the last one, then delete a row above it.
            </li>
            <li>Switch to a real id and run the same steps again.</li>
          </ul>
        </div>
      </div>

      <p className="section-label">Put it all together</p>
      <p className="section-note">
        Two scenarios, each combining several of today's tools into one realistic problem — this is the
        real test of whether it clicked.
      </p>

      <div className="task challenge">
        <span className="task-num">12</span>
        <div className="task-body">
          <p>Recipe collection.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
const recipes = [
  { id: "r1", title: "Miso Ramen", minutes: 35, tags: ["soup", "japanese"],
    vegetarian: false, notes: "Ask for extra chashu" },
  { id: "r2", title: "Caprese Salad", minutes: 10, tags: ["salad"], vegetarian: true },
  { id: "r3", title: "Chana Masala", minutes: 45, tags: ["curry", "indian"], vegetarian: true },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>Split it into <code>RecipeList</code> and <code>RecipeCard</code>, each its own file with a default export.</li>
            <li>Type <code>RecipeCard</code>'s props with an interface — <code>notes</code> is optional.</li>
            <li>Map over the array keyed on each recipe's own id, and pass the tags array down.</li>
            <li>Show a "Vegetarian" badge only when the flag is true, and "No notes yet" when notes is missing.</li>
            <li>Pass an <code>onCook</code> callback down; each card's button calls it with that recipe's id.</li>
            <li>Wrap the whole list in a <code>Panel</code> that takes <code>children</code>.</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// after clicking Cook on Caprese Salad, then on Miso Ramen
cook r2
cook r1
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <RecipeCollectionDemo />
          </div>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">13</span>
        <div className="task-body">
          <p>Departure board.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
const flights = [
  { code: "UA218", to: "Denver", status: "On time", gate: "B12", minutesLate: 0 },
  { code: "DL904", to: "Atlanta", status: "Delayed", gate: "A3", minutesLate: 40 },
  { code: "AS61", to: "Seattle", status: "Boarding", gate: "C7", minutesLate: 0 },
  { code: "WN1140", to: "Phoenix", status: "On time", minutesLate: 0 },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li><code>FlightRow</code> takes the whole flight as one object prop, plus an <code>onSelect</code> callback.</li>
            <li><code>Board</code> maps over the array with a stable key and renders each row.</li>
            <li>One flight has no gate — fall back to "TBD" without touching the data.</li>
            <li>Show the delay line only for flights running late.</li>
            <li>Render "No flights today" for an empty array, without painting a bare <code>0</code>.</li>
            <li>Clicking a row calls <code>onSelect</code> with that flight's code.</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// after clicking the Atlanta row, then the Phoenix row
selected DL904
selected WN1140
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <DepartureBoardDemo />
          </div>
        </div>
      </div>

      <p className="section-label">Advanced</p>
      <p className="section-note">
        The style prop, read-only props, and component purity — taught in the walkthrough but not in
        today's essentials, and pitched a notch harder than the list above.
      </p>

      <div className="task advanced">
        <span className="task-num">14</span>
        <div className="task-body">
          <p>Be able to pass a style object without breaking the braces.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
// 1. StatusDot — takes a color prop and sets backgroundColor from it via the style prop
// 2. give it a width and height of 12 with no unit, then confirm in DevTools they became px
// 3. move those same declarations into a CSS class, and say which version you'd ship
`}
          />
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">15</span>
        <div className="task-body">
          <p>Be able to spot a component that writes to its own props.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
function Cart({ items, total }: { items: string[]; total: number }) {
  items.push("gift wrap");
  total = total + 5;
  return <p>{items.length} items — {total} USD</p>;
}
`}
          />
          <ul className="task-list">
            <li>Two lines here reach into what the parent gave them — find both, and name which one the parent can actually see.</li>
            <li>Render two <code>Cart</code>s from the same array and explain what the second one shows.</li>
            <li>Rewrite it so the component computes what it needs and leaves its props alone.</li>
          </ul>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">16</span>
        <div className="task-body">
          <p>Be able to spot a component that isn't pure.</p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
let renderCount = 0;

export default function Ticker() {
  renderCount++;
  return <p>Rendered {renderCount} times</p>;
}
`}
          />
          <ul className="task-list">
            <li>Write down the number you expect on first paint, then render it once.</li>
            <li>Explain the number you actually got, and what removing <code>StrictMode</code> changes.</li>
            <li>Fix it so the count arrives as a prop and the same input always renders the same output.</li>
          </ul>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">17</span>
        <div className="task-body">
          <p>Put it all together — sensor dashboard.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
const readings = [
  { id: "s1", room: "Server closet", celsius: 31 },
  { id: "s2", room: "Lobby", celsius: 21 },
  { id: "s3", room: "Cold storage", celsius: 4 },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li><code>SensorTile</code> colors its own background from the reading via the <code>style</code> prop.</li>
            <li>Show the tiles hottest-first without mutating the array the parent passed in.</li>
            <li>Show the average temperature, computed from props only — no module-level variables.</li>
            <li>Render the same dashboard twice on one page under <code>StrictMode</code> and confirm both are identical.</li>
            <li>Then deliberately break purity, watch what diverges, and put it back.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
