import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import {
  ContactCardDemo,
  EmployeeProfileDemo,
  LeaderboardDemo,
  OnlineStatusDemo,
  PostsFeedDemo,
  ProductsPageDemo,
  ProfileCardDemo,
  QuoteAndUserSearchDemo,
  RecipeFinderDemo,
  StockQuoteRaceDemo,
  StopwatchDemo,
} from "./_solution";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 9 Practice</title>
      <DayNav day="day9-side-effects-data-fetching" current="practice" />
      <h1>Day 9 — Practice</h1>
      <p className="intro">
        Some tasks ask you to build, one asks you to predict, one hands you broken code — do all
        three kinds.
      </p>
      <p className="callout">
        Work through these during the gap between lecture and lab. Use{" "}
        <a href="/week2/day9-side-effects-data-fetching/notes">Notes</a> as your reference if you get
        stuck on syntax.
      </p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Be able to fetch data in useEffect and render the response.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
const [posts, setPosts] = useState<Post[]>([]);
useEffect(() => { ... }, []); // 1. fetch jsonplaceholder's /posts on mount
// 2. render the titles in a <ul>, keyed by post.id
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <PostsFeedDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>Be able to say what each dependency array means.</p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
function Logger({ id }: { id: number }) {
  useEffect(() => {
    console.log("A — no array");
  });
  useEffect(() => {
    console.log("B — mount only");
  }, []);
  useEffect(() => {
    console.log("C — id", id);
    return () => console.log("C cleanup — leaving id", id);
  }, [id]);

  return null;
}
`}
          />
          <ul className="task-list">
            <li>List which of A/B/C log on the very first render — and which log twice.</li>
            <li>
              The parent changes an unrelated piece of its own state, re-rendering{" "}
              <code>Logger</code> with the same <code>id</code>. Which of A/B/C log this time?
            </li>
            <li>
              Now the parent changes <code>id</code>. Put the logs in order, including C's cleanup.
            </li>
            <li>Build the parent, wire up both changes, and check all three answers against it.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>Be able to spot and fix the ways a fetch goes wrong.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
function CommentList() {
  const [comments, setComments] = useState();

  fetch("https://jsonplaceholder.typicode.com/comments?_limit=5")
    .then((res) => res.json())
    .then((data) => { const list = data; });

  return <ul>{comments.map((c) => <li>{c.name}</li>)}</ul>;
}
`}
          />
          <ul className="task-list">
            <li>Four separate bugs are stacked here — find all four before you fix any.</li>
            <li>
              One of them is the most serious: the component would crash or loop before the others
              even matter. Say which, and why it goes first.
            </li>
            <li>Rewrite it clean — correct initial state, an effect, a real setter call, a key.</li>
          </ul>
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>Be able to show loading and error states around a fetch.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
// 1. fetch a single jsonplaceholder user; wrap it in try/catch/finally
// 2. throw your own error when !response.ok — fetch won't do it for you
// 3. render "Loading…", then the error, then the profile — never more than one
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ProfileCardDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Be able to fetch one object and refetch it when its id changes.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
const [userId, setUserId] = useState(1);
const [user, setUser] = useState<User | null>(null);
// 1. start user at null — the type should read User | null
// 2. fetch /users/:userId, re-running whenever userId changes
// 3. guard the render: null and "not found yet" are not the same as loaded
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ContactCardDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>Be able to fetch from a click, and from a form submit.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
async function handleNewQuote() { ... } // 1. a button — fetch one random quote per click
async function handleSearch(e: React.FormEvent) { ... }
// 2. e.preventDefault(), then fetch a user search by the query field
// 3. the search response is wrapped — pull the array out before you setState
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <QuoteAndUserSearchDemo />
          </div>
        </div>
      </div>

      <p className="section-label">Put it all together</p>
      <p className="section-note">
        Two scenarios combining several of today's tools into one realistic problem each.
      </p>

      <div className="task challenge">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Recipe finder.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>A search box and a Find button — nothing fetches until it's submitted.</li>
            <li>
              Hit <code>dummyjson.com/recipes/search?q=…</code> and pull the <code>recipes</code>{" "}
              array out of its wrapped response.
            </li>
            <li>Show loading while the request is in flight, and a message if it fails.</li>
            <li>
              Render how many matches came back (from the response's <code>total</code>, not{" "}
              <code>recipes.length</code>) above the list.
            </li>
            <li>An empty result set gets its own message, not a silently empty list.</li>
          </ul>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <RecipeFinderDemo />
          </div>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">8</span>
        <div className="task-body">
          <p>Employee directory card.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Prev / Next buttons step an <code>id</code> state up and down; nothing below 1.
            </li>
            <li>
              One effect fetches <code>dummyjson.com/users/:id</code>, keyed on that id.
            </li>
            <li>Loading, error, and loaded are each their own render branch.</li>
            <li>
              Clicking Next while a request is still loading shouldn't leave the old card on
              screen captioned as if it were the new one — disable the buttons while loading.
            </li>
          </ul>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <EmployeeProfileDemo />
          </div>
        </div>
      </div>

      <p className="section-label">Advanced</p>
      <p className="section-note">
        Cleanup beyond a fetch, pagination, derived state, race conditions, and syncing with an
        external system — a notch harder than the list above.
      </p>

      <div className="task advanced">
        <span className="task-num">9</span>
        <div className="task-body">
          <p>Be able to write a cleanup function for a repeating timer.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
const [running, setRunning] = useState(false);
useEffect(() => { ... }, [running]);
// 1. Start/Pause/Reset a stopwatch using setInterval, ticking every 100ms
// 2. clearInterval in the cleanup — confirm Pause actually stops the count
// 3. toggle Start/Pause/Start several times fast; the time should never jump
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <StopwatchDemo />
          </div>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">10</span>
        <div className="task-body">
          <p>Be able to paginate a fetch by keeping page in the dependency array.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
const [page, setPage] = useState(1);
useEffect(() => { ... }, [page]);
// 1. compute skip from page and a fixed page size, fetch dummyjson's /products
// 2. Prev/Next buttons only change page — they never call fetch themselves
// 3. disable Prev on page 1, and Next once page * pageSize >= total
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <ProductsPageDemo />
          </div>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">11</span>
        <div className="task-body">
          <p>Be able to replace an unnecessary effect with a computed value.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
const [players] = useState<Player[]>(INITIAL_PLAYERS);
const [query, setQuery] = useState("");

const [visiblePlayers, setVisiblePlayers] = useState<Player[]>([]);
useEffect(() => {
  const matches = players.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  setVisiblePlayers(matches);
}, [players, query]);

const [ranked, setRanked] = useState<Player[]>([]);
useEffect(() => {
  setRanked([...visiblePlayers].sort((a, b) => b.score - a.score));
}, [visiblePlayers]);
`}
          />
          <ul className="task-list">
            <li>
              Neither <code>visiblePlayers</code> nor <code>ranked</code> can ever disagree with{" "}
              <code>players</code> and <code>query</code> — they're fully determined by them. What
              does that tell you about whether they need to be state?
            </li>
            <li>Rewrite the leaderboard with zero extra state and zero effects.</li>
            <li>Add a "50+ only" checkbox as a second filter, computed the same way.</li>
          </ul>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <LeaderboardDemo />
          </div>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">12</span>
        <div className="task-body">
          <p>Be able to guard an effect against a stale response.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
useEffect(() => {
  async function load() {
    const price = await fetchQuote(symbol); // different symbols resolve at different speeds
    setPrice(price);
  }
  load();
}, [symbol]);
`}
          />
          <ul className="task-list">
            <li>
              The demo below simulates three stocks with different response times. Click a slow one,
              then immediately click a fast one, and watch what the price settles on.
            </li>
            <li>
              Explain in your own words why the label under the price can disagree with the number
              next to it.
            </li>
            <li>
              Add the <code>ignore</code> flag from Notes section 14 and confirm the mismatch is
              gone.
            </li>
          </ul>
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building — unguarded, on purpose</p>
            <StockQuoteRaceDemo />
          </div>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">13</span>
        <div className="task-body">
          <p>Be able to subscribe to an external system and tear it down correctly.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
useEffect(() => { ... }, []);
// 1. addEventListener for the browser's "online" and "offline" events
// 2. keep an isOnline state in sync with whichever one last fired
// 3. removeEventListener for both in the cleanup — toggle devtools' Offline
//    checkbox a few times after the component mounts and after it unmounts
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">Roughly what you're building</p>
            <OnlineStatusDemo />
          </div>
        </div>
      </div>
    </div>
  );
}
