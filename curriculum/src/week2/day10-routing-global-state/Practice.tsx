import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ContextSyncDemo, OutOfSyncDemo } from "./NotesDemos";

export default function Practice() {
  return (
    <div className="page practice-page">
      <title>Day 10 Practice</title>
      <DayNav day="day10-routing-global-state" current="practice" />
      <h1>Day 10 — Practice</h1>
      <p className="intro">
        Everything here is required, including the Advanced section at the end — build it from
        scratch and bring it to the 6pm lab.
      </p>
      <p className="callout">
        Work through these during the gap between lecture and lab. Use{" "}
        <Link to="/week2/day10-routing-global-state/notes">Notes</Link> as your reference if you get
        stuck on syntax.
      </p>

      <div className="task">
        <span className="task-num">1</span>
        <div className="task-body">
          <p>Be able to read a route configuration and add to it.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            code={`
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// inside App
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/books" element={<BookList />} />
</Routes>
`}
          />
          <ul className="task-list">
            <li>
              Say out loud what each of the three — <code>BrowserRouter</code>,{" "}
              <code>Routes</code>, <code>Route</code> — is responsible for.
            </li>
            <li>
              Say why <code>BrowserRouter</code> is at the root and not inside a component that
              re-renders.
            </li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. copy the config above into your own app and get both URLs rendering
// 2. add an "/about" route on the same pattern, plus a component for it
// 3. type each URL into the address bar by hand and confirm the right component renders
`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">2</span>
        <div className="task-body">
          <p>
            Be able to navigate with <code>&lt;Link&gt;</code> and say what an anchor tag costs you.
          </p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
// Home keeps a counter in useState. Click it up to 5, then navigate away and back.
<a href="/books">Books</a>
<Link to="/books">Books</Link>
`}
            language="xml"
          />
          <ul className="task-list">
            <li>Write down what the counter reads after each of the two, before you try them.</li>
            <li>Watch the browser's reload indicator on each click — only one of them fires.</li>
          </ul>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. a nav bar with a Link to each of your three routes
// 2. leave one anchor tag in place on purpose, click it, then explain what got destroyed
`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">3</span>
        <div className="task-body">
          <p>
            Be able to read a URL parameter with <code>useParams</code>.
          </p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
const books = [
  { id: 1, title: "Dune", author: "Herbert" },
  { id: 2, title: "Kindred", author: "Butler" },
  { id: 3, title: "Piranesi", author: "Clarke" },
];
`}
          />
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. add a "/books/:id" route rendering a BookDetail component
// 2. in BookDetail, read the id with useParams and show that book's title and author
// 3. make each row in BookList a Link to its own detail URL
// 4. visit "/books/99" and decide what should happen — then make that happen
`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">4</span>
        <div className="task-body">
          <p>
            Be able to navigate from code with <code>useNavigate</code>.
          </p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. a "Back to all books" button on the detail page that navigates to "/books"
// 2. a search box on Home that navigates to "/books/<the id typed>" on submit
// 3. compare navigate(-1) with navigate("/books") — say when each is the right one
`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">5</span>
        <div className="task-body">
          <p>Be able to name which of the two problems you actually have.</p>
          <span className="tag-broken">Broken</span>
          <CodeBlock
            code={`
// A
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} />;
}
function Layout({ user }) { return <Sidebar user={user} />; }
function Sidebar({ user }) { return <UserBadge user={user} />; }

// B
function CartBadge() { const [count] = useState(0); return <span>Cart: {count}</span>; }
function AddButton() { const [count, setCount] = useState(0); return <button onClick={() => setCount(count + 1)}>Add</button>; }
`}
          />
          <ul className="task-list">
            <li>Name each one, and say which component is doing unnecessary work in A.</li>
            <li>
              For B, explain why clicking Add can never move the badge — in terms of where state
              lives.
            </li>
            <li>
              Reproduce B in your own app with two sibling components, and confirm they drift apart.
            </li>
          </ul>
          <div className="demo-result demo-live">
            <p className="demo-result-label">B, running</p>
            <OutOfSyncDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">6</span>
        <div className="task-body">
          <p>
            Be able to create a context and read it with <code>useContext</code>.
          </p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. define the type of the value first: what the readers get, and what they can call
// 2. createContext(...) — give it a default that means "no Provider above me"
// 3. render the raw <SomeContext.Provider value={...}> around two sibling components
// 4. read it in both with useContext, with no props passed to either
`}
          />
        </div>
      </div>

      <div className="task">
        <span className="task-num">7</span>
        <div className="task-body">
          <p>Be able to write a custom Provider component that owns the state.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. a ThemeProvider holding a "light" | "dark" state and a toggle function
// 2. it takes { children } and renders the Provider around them
// 3. pass state and updaters together as the value, so a reader can also write
// 4. wrap your whole routed app in it, and toggle the theme from two different pages
`}
          />
          <div className="demo-result demo-live">
            <p className="demo-result-label">The shape you're after — one owner, two readers</p>
            <ContextSyncDemo />
          </div>
        </div>
      </div>

      <div className="task">
        <span className="task-num">8</span>
        <div className="task-body">
          <p>Be able to write a custom hook that fails loudly outside its Provider.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. useTheme() — wrap useContext, throw a named error when the value is undefined
// 2. swap every consumer over to it, and delete the now-unneeded undefined checks
// 3. render one consumer OUTSIDE the Provider on purpose and read the error you get
`}
          />
          <ul className="task-list">
            <li>
              Say what a consumer would have had to write everywhere if the <code>throw</code>{" "}
              weren't there.
            </li>
          </ul>
        </div>
      </div>

      <p className="section-label">Put it all together</p>
      <p className="section-note">
        Two scenarios, each combining routing and context into one realistic app — this is the real
        test of whether it clicked.
      </p>

      <div className="task challenge">
        <span className="task-num">9</span>
        <div className="task-body">
          <p>Recipe box.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
const recipes = [
  { id: 1, name: "Congee", minutes: 45 },
  { id: 2, name: "Shakshuka", minutes: 25 },
  { id: 3, name: "Dan dan noodles", minutes: 30 },
  { id: 4, name: "Tomato soup", minutes: 40 },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Routes for <code>/</code>, <code>/recipes</code>, <code>/recipes/:id</code> and a
              catch-all.
            </li>
            <li>
              A <code>FavoritesProvider</code> owning the set of favourited ids plus{" "}
              <code>toggleFavorite</code> and <code>isFavorite</code>.
            </li>
            <li>A header rendered on every page showing the favourites count.</li>
            <li>A favourite button on the detail page — the header must move on the same click.</li>
            <li>
              A <code>useFavorites</code> hook that throws outside the Provider; no component reads
              the context directly.
            </li>
            <li>
              Navigate list → detail → back and confirm the favourites survive; then reload the page
              and say why they don't.
            </li>
          </ul>
        </div>
      </div>

      <div className="task challenge">
        <span className="task-num">10</span>
        <div className="task-body">
          <p>Conference schedule.</p>
          <span className="tag-starter">Starter</span>
          <CodeBlock
            language="typescript"
            code={`
const talks = [
  { id: "t1", title: "Rendering, honestly", room: "A", hour: 10 },
  { id: "t2", title: "Types at the edges", room: "B", hour: 10 },
  { id: "t3", title: "Caching for humans", room: "A", hour: 11 },
];
`}
          />
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Three routes: <code>/talks</code>, <code>/talks/:id</code>, <code>/agenda</code>.
            </li>
            <li>
              An <code>AgendaProvider</code> owning the chosen talks, with <code>addTalk</code>,{" "}
              <code>removeTalk</code> and <code>isChosen</code>.
            </li>
            <li>Adding from the detail page then landing on /agenda, via useNavigate.</li>
            <li>
              <code>/agenda</code> reads the same context and can remove a talk — the list page's
              buttons must update to match.
            </li>
            <li>Refuse a talk that clashes with one already chosen at the same hour.</li>
            <li>Say which state here is genuinely shared and which should have stayed local.</li>
          </ul>
        </div>
      </div>

      <p className="section-label">Advanced</p>
      <p className="section-note">
        Route ordering, the context re-render cost, and splitting a context — covered in lecture but
        not drilled above, and pitched a notch harder than the core list.
      </p>

      <div className="task advanced">
        <span className="task-num">11</span>
        <div className="task-body">
          <p>Be able to make an unknown URL land somewhere sensible.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. add <Route path="*" element={<NotFound />} /> and visit a URL you never defined
// 2. move it to the very TOP of your <Routes>, predict what breaks, then reload and see
// 3. give NotFound a button that navigates home, and one that goes back a step
`}
          />
          <ul className="task-list">
            <li>
              Step 2 should surprise you — say what <code>&lt;Routes&gt;</code> is doing instead of
              reading top to bottom.
            </li>
          </ul>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">12</span>
        <div className="task-body">
          <p>Be able to prove that every consumer re-renders when a context value changes.</p>
          <span className="tag-predict">Predict</span>
          <CodeBlock
            code={`
// one context, two unrelated fields
const value = { user, setUser, theme, setTheme };

// ThemeToggle reads only theme. UserName reads only user.
`}
          />
          <ul className="task-list">
            <li>
              Predict which components re-render when only <code>theme</code> changes, then add a{" "}
              <code>console.log</code> to each and check.
            </li>
            <li>
              Explain the result in terms of the <em>object</em> passed to <code>value</code>, not
              the fields inside it.
            </li>
          </ul>
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">13</span>
        <div className="task-body">
          <p>Harder: be able to split one context so an unrelated update stops re-rendering.</p>
          <span className="tag-examples">Build it</span>
          <CodeBlock
            code={`
// 1. split the context above into ThemeContext and UserContext, each with its own Provider
// 2. nest both Providers at the root, and keep the two custom hooks' names unchanged
// 3. re-run the console.log test and show which logs disappeared
`}
          />
        </div>
      </div>

      <div className="task advanced">
        <span className="task-num">14</span>
        <div className="task-body">
          <p>Put it all together — advanced version: a settings-driven dashboard.</p>
          <span className="tag-challenge">Challenge</span>
          <ul className="task-list">
            <li>
              Routes for <code>/dashboard</code>, <code>/settings</code>,{" "}
              <code>/reports/:reportId</code>, and a catch-all.
            </li>
            <li>
              Two separate contexts: one for the signed-in user, one for display settings (theme
              plus a compact/comfortable density).
            </li>
            <li>
              A header on every route reading the user context only, and a report view reading the
              settings context only.
            </li>
            <li>
              Instrument both with <code>console.log</code> and demonstrate that changing density
              does not re-render the header.
            </li>
            <li>
              Settings changes must survive navigating between all three routes — and you should be
              able to say exactly why they don't survive a reload.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
