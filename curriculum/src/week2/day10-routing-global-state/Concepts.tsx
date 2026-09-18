import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 10 Concepts Reference</title>
      <DayNav day="day10-routing-global-state" current="concepts" />
      <h1>Day 10 — Concepts Reference</h1>
      <p className="intro">
        Try answering each question yourself before clicking to reveal the answer underneath it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you're shaky on any of these, that's the priority to fix.
        </p>

        <details>
          <summary>What is client-side routing, and how does it differ from a normal website?</summary>
          <div className="answer">
            <p>
              On a traditional site every link is a request: the browser discards the page and paints
              new HTML from the server. With client-side routing the server sends one shell and one
              bundle once, and after that the app reads the URL itself and decides which component to
              render — no request, no reload, no lost state.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why use <code>&lt;Link&gt;</code> instead of <code>&lt;a href&gt;</code> inside a React
            app?
          </summary>
          <div className="answer">
            <p>
              An anchor tag makes the browser reload the whole document, which reboots the app and
              throws away every piece of React state. <code>&lt;Link&gt;</code> updates the URL
              through the History API and lets the router swap components, so state survives.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What do <code>&lt;BrowserRouter&gt;</code>, <code>&lt;Routes&gt;</code> and{" "}
            <code>&lt;Route&gt;</code> each do?
          </summary>
          <div className="answer">
            <p>
              <code>&lt;BrowserRouter&gt;</code> wraps the app once and connects it to the browser's
              URL and history. <code>&lt;Routes&gt;</code> looks at the current URL and renders the
              single best-matching child. <code>&lt;Route&gt;</code> is one URL pattern paired with
              the component to render for it.
            </p>
          </div>
        </details>

        <details>
          <summary>
            How do you read a URL parameter, and what type do you get back?
          </summary>
          <div className="answer">
            <p>
              Declare the parameter in the path (<code>/products/:id</code>) and read it with{" "}
              <code>useParams()</code>. Values always come back as <strong>strings</strong>, so{" "}
              <code>id</code> is <code>"42"</code>, not <code>42</code> — convert before comparing
              against a numeric id.
            </p>
          </div>
        </details>

        <details>
          <summary>
            When would you use <code>useNavigate</code> rather than a <code>&lt;Link&gt;</code>?
          </summary>
          <div className="answer">
            <p>
              When the navigation isn't a click on a link — after a successful login, after a form
              submits, after a delete. <code>&lt;Link&gt;</code> is for something the user clicks;{" "}
              <code>useNavigate</code> is for navigating from code.
            </p>
          </div>
        </details>

        <details>
          <summary>What is prop drilling, and what's actually wrong with it?</summary>
          <div className="answer">
            <p>
              Passing a prop down through components that don't use it, purely to reach a distant
              one. The cost isn't the typing — it's that the middle components become coupled to a
              value they don't care about, stop being reusable on their own, and have to be edited
              every time the delivered data changes.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Two sibling components need the same number. Why doesn't giving each its own{" "}
            <code>useState</code> work?
          </summary>
          <div className="answer">
            <p>
              State is per component instance, so two <code>useState</code> calls are two
              independent boxes even when they start equal — updating one can never move the other.
              The fix isn't to sync the copies, it's to have only one copy, owned above both of them.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the Context API and what problem does it solve?</summary>
          <div className="answer">
            <p>
              A way for a component high in the tree to publish a value that any descendant can read
              directly, at any depth, without props. It keeps the "one owner" half of lifting state
              up and removes the "pass it through everyone" half — solving prop drilling and
              out-of-sync copies at the same time.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the four pieces of a context setup?</summary>
          <div className="answer">
            <p>
              <code>createContext</code> creates the channel; a <strong>Provider</strong> component
              renders <code>Context.Provider</code> and owns the state; the{" "}
              <strong>value</strong> is the object it publishes (state plus the functions that
              change it); <code>useContext</code> is how a descendant reads it.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why write a custom Provider component instead of rendering{" "}
            <code>&lt;MyContext.Provider&gt;</code> directly in <code>App</code>?
          </summary>
          <div className="answer">
            <p>
              Because the state and its updaters have to live somewhere, and the custom Provider
              gives them one home — <code>App</code> stays a one-line wrapper and the feature's logic
              is a self-contained file you can move or test. Taking <code>{"{ children }"}</code>{" "}
              keeps it generic: it never names the components that will read it.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why wrap <code>useContext</code> in a custom hook that throws?
          </summary>
          <div className="answer">
            <p>
              Because the context type is <code>T | undefined</code>, so without a guard every
              consumer has to null-check forever. One <code>throw</code> narrows the type for all of
              them and turns "forgot to wrap in the Provider" from a silent{" "}
              <code>undefined</code> into a named error.
            </p>
            <CodeBlock
              language="typescript"
              code={`export const useToDo = (): ToDoContextType => {
  const context = useContext(ToDoContext);
  if (!context) {
    throw new Error('useToDo must be used within a ToDoProvider');
  }
  return context;
};`}
            />
          </div>
        </details>

        <details>
          <summary>
            Does Context replace <code>useState</code>?
          </summary>
          <div className="answer">
            <p>
              No — Context is delivery, not storage. The state is still a plain{" "}
              <code>useState</code> inside the Provider; context only decides who can reach it.
              State that isn't genuinely shared should stay local.
            </p>
          </div>
        </details>

        <details>
          <summary>What is Redux, and what are its core principles?</summary>
          <div className="answer">
            <p>
              A predictable state container for client state. Three principles: a{" "}
              <strong>single store</strong> as the source of truth; <strong>state is read-only</strong>
              , changed only by dispatching an action describing what happened; and{" "}
              <strong>changes are made by pure reducers</strong>,{" "}
              <code>(state, action) =&gt; newState</code>. Together they give you one-way data flow.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Explain action, <code>dispatch</code>, reducer and store.
          </summary>
          <div className="answer">
            <p>
              An <strong>action</strong> is a plain object describing an event —{" "}
              <code>{'{ type: "cart/itemAdded", payload: 42 }'}</code>. <strong>Dispatch</strong> is
              the only way to send one in. A <strong>reducer</strong> is a pure function taking the
              current state and an action and returning the next state. The <strong>store</strong>{" "}
              holds that state and notifies subscribed components.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you pick Redux over the Context API?</summary>
          <div className="answer">
            <p>
              When a lot of shared state changes often, from many places: Redux gives you subscribed
              slices instead of re-rendering every consumer, reducers as named testable functions
              instead of inline handlers, one standard place for async, and DevTools that replay
              every action. For a theme, a locale or the signed-in user, Context is the right size.
            </p>
          </div>
        </details>

        <details>
          <summary>What is middleware in Redux, and what does Thunk do?</summary>
          <div className="answer">
            <p>
              Middleware sits between <code>dispatch</code> and the reducer, which is where anything
              impure belongs — reducers must stay pure. <code>redux-thunk</code> lets you dispatch a
              function instead of an object, so it can <code>await</code> an API call and dispatch
              the result; <code>redux-saga</code> handles complex flows like retries and
              cancellation, and <code>redux-persist</code> saves slices to{" "}
              <code>localStorage</code> and restores them on reload.
            </p>
          </div>
        </details>

        <details>
          <summary>What is Redux Toolkit, and what problem does it solve?</summary>
          <div className="answer">
            <p>
              Boilerplate — plain Redux needed action types, action creators, reducers and types
              across several files per feature. <code>createSlice</code> generates all of that from
              one object, and <code>configureStore</code> arrives with thunk and DevTools already
              wired. RTK is how Redux is written today.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today's lecture covered — mostly "gotcha"
          interview trivia and things that sharpen how you code without being asked often.
        </p>

        <details>
          <summary>
            Why does every consumer re-render when a context value changes, and how do you limit it?
          </summary>
          <div className="answer">
            <p>
              Consumers compare the value by identity, and{" "}
              <code>value={"{{ user, theme }}"}</code> builds a new object on every Provider render —
              so everyone re-renders even if the field they read didn't change. Split the context by
              concern, and memoize the value object, so an unrelated update stops waking the whole
              tree.
            </p>
          </div>
        </details>

        <details>
          <summary>Should all your global state live in one context?</summary>
          <div className="answer">
            <p>
              No. One <code>AppContext</code> holding user, theme and cart means a theme toggle
              re-renders the cart. Split by concern and nest the Providers — each piece of state gets
              its own audience.
            </p>
          </div>
        </details>

        <details>
          <summary>What's the difference between client state and server state?</summary>
          <div className="answer">
            <p>
              Client state is yours and synchronous — form text, the open tab, a theme. Server state
              is a <em>copy</em> of data owned elsewhere: it goes stale, someone else can change it,
              and it needs caching, refetching, loading and error flags, and request de-duplication.
              Context and Redux are built for the first kind.
            </p>
          </div>
        </details>

        <details>
          <summary>What do React Query and RTK Query do?</summary>
          <div className="answer">
            <p>
              They own server state: one hook does the fetch and hands back cached data plus loading
              and error status, with refetching, retries and de-duplication built in — replacing the
              hand-written <code>useEffect</code> + <code>fetch</code> + flags in every component.
              RTK Query is the same idea shipped inside Redux Toolkit.
            </p>
          </div>
        </details>

        <details>
          <summary>What does a typical modern React stack combine, and why two libraries?</summary>
          <div className="answer">
            <p>
              Because client state and server state are different problems. Common pairings are
              Redux Toolkit + RTK Query, or Zustand + React Query — one library for the state the app
              owns, one for the cached copy of the server's.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What happens if <code>useContext</code> is called with no matching Provider above it?
          </summary>
          <div className="answer">
            <p>
              It returns the default value passed to <code>createContext</code> — no error, no
              warning. That's why the default is <code>undefined</code> and why the custom hook
              throws: otherwise the bug shows up much later as an unreadable property access.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Does the order of <code>&lt;Route&gt;</code> elements inside <code>&lt;Routes&gt;</code>{" "}
            matter?
          </summary>
          <div className="answer">
            <p>
              Not in React Router v6 and later — <code>&lt;Routes&gt;</code> ranks every route by
              specificity and renders the best match, so a <code>path="*"</code> written first still
              loses to a real match. It did matter in v5's <code>&lt;Switch&gt;</code>, which took
              the first match top to bottom.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why does <code>&lt;BrowserRouter&gt;</code> need server configuration to deploy?
          </summary>
          <div className="answer">
            <p>
              Because the URL is real: a hard refresh on <code>/products/42</code> asks the server
              for that path, and the server has no such file. Static hosts need a rewrite rule
              sending every unknown path back to <code>index.html</code> so the app can route it.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
