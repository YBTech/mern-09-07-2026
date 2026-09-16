import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import {
  ControlledFieldsDemo,
  TodoAdvancedDemo,
  TodoBasicDemo,
} from "./_solution";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 8 Practice</title>
      <DayNav day="day8-inputs-forms" current="practice" />
      <h1>Day 8 — Practice</h1>
      <p className="intro">
        Some tasks ask you to build, some hand you broken code, some ask you to
        predict before you run it — do all three kinds.
      </p>
      <p className="callout">
        Work through these during the gap between lecture and lab. Use{" "}
        <a href="/week2/day8-inputs-forms/notes">Notes</a> as your reference if
        you get stuck on syntax.
      </p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Be able to build a controlled input.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
<input placeholder="search" />
<input value={query} />
<input value={query} onChange={setQuery} />
`}
            language="xml"
          />
          <ul className="task-list">
            <li>
              One is uncontrolled, one is frozen, one stores the wrong thing —
              say which is which.
            </li>
            <li>
              For the third, log the state after typing one character and
              explain what landed there.
            </li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. a text field plus a live "You typed: ___" line under it
// 2. a checkbox — it uses checked, not value, and reads e.target.checked
// 3. a <select> with three options, its value driven by state
// 4. an "Uppercase" button that rewrites what's already in the field
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ControlledFieldsDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Be able to submit and validate a form.</p>
          <span className="tag-examples">Examples</span>
          <CodeBlock
            code={`
// 1. put onSubmit on the <form>, not onClick on the button, so Enter works too
// 2. start the handler with e.preventDefault(), then log the value
// 3. reject a blank or too-short value with an inline error, don't accept it
// 4. clear the field after a successful submit, and clear the error too
// 5. give the Cancel button type="button" so it stops submitting the form
`}
          />
          <p className="bonus">
            Then delete <code>e.preventDefault()</code> and press Enter — say
            what happens to the page and to everything in state.
          </p>
        </div>
      </div>

      <p className="section-label">Put it all together</p>
      <p className="section-note">
        One scenario in two sizes — build the basic version first, then take it
        further. This is the real test of whether it clicked.
      </p>

      <div className="task challenge">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Todo list — basic.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Add a todo, rejecting a title under three characters with a
              visible message.
            </li>
            <li>
              Pick a priority from a dropdown when adding, and show it on the
              row.
            </li>
            <li>
              Mark a todo complete and back again with one button — the button's
              own label is conditional on that todo's status.
            </li>
            <li>Delete a todo.</li>
            <li>
              Show how many are done as <code>5/7 completed</code>, counted from
              the list itself.
            </li>
            <li>
              A select that filters the rows by priority, without throwing away
              the ones it hides.
            </li>
            <li>
              Every update goes through the setter immutably; no{" "}
              <code>.push</code>, no <code>.splice</code>.
            </li>
          </ul>
          <p className="bonus">
            The count and the filtered rows are both computed from one array —
            if you added state for either, you have two sources of truth.
          </p>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <TodoBasicDemo />
          </div>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Todo list — advanced.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>Everything the basic version does, then these on top.</li>
            <li>
              An Edit button puts that row into an editing mode where both its
              title and its priority can change, with Save and Cancel — Cancel
              leaves the row untouched.
            </li>
            <li>
              Stamp each todo with the time it was created, set for you when
              it's added rather than typed in.
            </li>
            <li>
              A control that sorts by that timestamp, newest or oldest first,
              without mutating the array in state.
            </li>
          </ul>
          <p className="bonus">
            Only one row can be in edit mode at a time — think about what that
            means for where the "which row is being edited" state lives.
          </p>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <TodoAdvancedDemo />
          </div>
        </div>
      </div>

      <p className="section-label">Advanced</p>
      <p className="section-note">
        Combining several controlled fields into one state object — pitched a
        notch harder than the list above.
      </p>

      <div className="task advanced">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Put it all together — account settings form.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
const initialForm = { name: "", email: "", newsletter: false, plan: "free" };
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Hold all four fields in <em>one</em> state object, typed so{" "}
              <code>plan</code> is only "free" | "pro" | "team".
            </li>
            <li>
              Drive every field with a single <code>handleChange</code>, keyed
              off the input's own <code>name</code>.
            </li>
            <li>
              The checkbox reads <code>e.target.checked</code>; the text fields
              and select read <code>e.target.value</code>.
            </li>
            <li>
              Derive "can save" from the form — don't keep a separate{" "}
              <code>isValid</code> state.
            </li>
            <li>
              Cancel restores the starting values without repeating that object
              in two places.
            </li>
            <li>
              Nothing in the object is ever mutated — every update spreads and
              replaces.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
