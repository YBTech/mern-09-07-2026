import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import {
  PostSearchDemo,
  PostSearchGuardedDemo,
  TodoDashboardDemo,
  TodoDashboardPaginatedDemo,
} from "./_solution";

export default function Lab() {
  return (
    <div className="page lab-page">
      <title>Day 9 Lab</title>
      <DayNav day="day9-side-effects-data-fetching" current="lab" />
      <h1>Day 9 — Lab</h1>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Todo dashboard.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
type Todo = { id: number; todo: string; completed: boolean };
// GET https://dummyjson.com/todos?limit=5 → { todos: Todo[], total, skip, limit }
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>Fetch the 5 todos above once, on mount.</li>
            <li>
              Render each one keyed by <code>id</code>, struck through when it's completed.
            </li>
            <li>Show "Loading…" while the request is in flight.</li>
            <li>
              Check <code>response.ok</code> yourself and show an error message if the request
              fails — don't rely on <code>fetch</code> to reject.
            </li>
            <li>A Re-fetch button that runs the whole thing again.</li>
            <li>Apply the <code style={{textDecoration: "line-through"}}>strikethrough</code> style to all completed todos  (google the css)</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
Do something nice for someone you care about
Memorize a poem (struck through — completed)
Watch a classic movie (struck through — completed)
Watch a documentary
Invest in cryptocurrency
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <TodoDashboardDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Post search.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
type Post = { id: number; title: string };
// GET https://dummyjson.com/posts/search?q=love&limit=5
//   → { posts: Post[], total, skip, limit }
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>A text input and a Search button in a <code>&lt;form&gt;</code> — nothing fetches until it's submitted.</li>
            <li>
              <code>e.preventDefault()</code>, then fetch the query above, swapping{" "}
              <code>love</code> for whatever's in the field.
            </li>
            <li>
              Pull the <code>posts</code> array out of the response and render the titles, keyed by{" "}
              <code>id</code>.
            </li>
            <li>
              Show the match count from the response's <code>total</code>, and "Searching…" while
              it's in flight.
            </li>
            <li>An empty result set gets its own message, not a silently empty list.</li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// searching "love"
17 matches for "love"
This is important to remember.
It was so great to hear from you today
She tried to explain that love wasn't like pie.
...

// searching "zzzqqqnomatch"
No posts matched.
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <PostSearchDemo />
          </div>
        </div>
      </div>

      <p className="section-label">Advanced</p>
      <p className="section-note">Only if you finish early — extensions to the two tasks above.</p>

      <div className="task advanced">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Paginate the todo dashboard.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              A <code>page</code> state, Prev/Next buttons that change only <code>page</code>.
            </li>
            <li>
              The fetch's <code>skip</code> is computed from <code>page</code>, and{" "}
              <code>page</code> is the effect's only dependency.
            </li>
            <li>
              Disable Prev on page 1, and Next once <code>page * pageSize &gt;= total</code>.
            </li>
          </ul>
          <span className="tag-expected">Expected</span>
          <CodeBlock
            code={`
// page 2 of the same 5-at-a-time dashboard
Contribute code or a monetary donation to an open-source software project
Solve a Rubik's cube
Bake pastries for yourself and neighbor
Go see a Broadway production
Write a thank you letter to an influential person in your life
// none of these five are completed, so nothing here is struck through
`}
            language="plaintext"
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <TodoDashboardPaginatedDemo />
          </div>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Guard the post search against a stale response.</p>
          <ul className="task-list">
            <li>
              Search something, then immediately search something else before the first answer
              comes back.
            </li>
            <li>
              Without a guard, whichever request happens to resolve last wins the screen — even if
              it was the older search.
            </li>
            <li>
              Add the <code>ignore</code> flag from Notes section 14 so only the response matching
              the most recent search is ever applied.
            </li>
          </ul>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building — already guarded</p>
            <PostSearchGuardedDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
