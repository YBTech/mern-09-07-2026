import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ExpenseTrackerDemo } from "./_solution";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 8 Lab</title>
      <DayNav day="day8-inputs-forms" current="lab" />
      <h1>Day 8 — Lab</h1>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Expense tracker.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
type Category = "food" | "transit" | "other";
type Expense = { id: string; label: string; cents: number; category: Category };

const initial: Expense[] = [
  { id: "e1", label: "Coffee", cents: 450, category: "food" },
  { id: "e2", label: "Metro card", cents: 2900, category: "transit" },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              A controlled text field, a controlled amount field, and a
              controlled category select.
            </li>
            <li>
              Add on submit with <code>preventDefault</code>, appending
              immutably to the list.
            </li>
            <li>
              Reject a blank label or an amount that isn't above zero, with an
              inline error.
            </li>
            <li>Delete any row without mutating the array.</li>
            <li>Clear all three fields after a successful add.</li>
            <li>Disable the Add button while the label is empty.</li>
            <li>
              A select that filters the rows by category, without throwing away
              the ones it hides.
            </li>
            <li>
              A running total under the list, computed from the expenses you
              already hold — no <code>total</code> state kept in sync by hand.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// submitting a blank label
error: "Give the expense a name."   (nothing added, fields keep their values)

// submitting "Bus fare" / 275 / transit
3 rows, fields empty again, Add disabled
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ExpenseTrackerDemo />
          </div>
        </div>
      </div>

      <p className="section-label">Advanced</p>
      <p className="section-note">
        Only if you finish early — extra features to add to the same tracker.
      </p>

      <div className="task advanced">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Edit a row in place.</p>
          <ul className="task-list">
            <li>
              An Edit button swaps that row for its own fields, with Save and
              Cancel.
            </li>
            <li>Cancel leaves the row exactly as it was.</li>
            <li>
              Only one row can be editing at a time — that constraint decides
              where the state lives.
            </li>
          </ul>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Undo the last delete.</p>
          <ul className="task-list">
            <li>
              An Undo button that appears only after a delete and restores that
              row.
            </li>
            <li>Undoing twice in a row shouldn't bring anything back twice.</li>
            <li>Decide whether the restored row returns to its old position.</li>
          </ul>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Sort by amount.</p>
          <ul className="task-list">
            <li>A button toggling highest-first and lowest-first.</li>
            <li>
              Sorting must not mutate the array in state — <code>.sort</code>{" "}
              alone does.
            </li>
            <li>
              Adding a row while sorted should land it in the right place
              without extra bookkeeping.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
