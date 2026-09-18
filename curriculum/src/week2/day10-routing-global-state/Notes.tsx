import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ContextSyncDemo, OutOfSyncDemo } from "./NotesDemos";
import reduxDataFlow from "./ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif";
import reduxAsyncDataFlow from "./ReduxAsyncDataFlowDiagram-d97ff38a0f4da0f327163170ccc13e80.gif";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 10 Notes</title>
      <DayNav day="day10-routing-global-state" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 10 · Notes</p>
        <h1>Routing &amp; Global State</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>
            Read an existing route configuration and work inside it: say what{" "}
            <code>&lt;BrowserRouter&gt;</code>, <code>&lt;Routes&gt;</code> and each{" "}
            <code>&lt;Route path element&gt;</code> is doing, add or edit a route following the
            pattern already there, and navigate with <code>&lt;Link to&gt;</code> rather than{" "}
            <code>&lt;a href&gt;</code> — setting routing up from scratch is not the skill
          </li>
          <li>
            Read a URL parameter with <code>useParams</code> and navigate from code with{" "}
            <code>useNavigate</code>
          </li>
          <li>
            Name the two problems global state solves: <strong>prop drilling</strong>, and{" "}
            <strong>multiple components sharing the same states</strong>
          </li>
          <li>
            Create a context with <code>createContext</code> and read it with{" "}
            <code>useContext</code>
          </li>
          <li>
            Write a <strong>custom Provider component</strong> that owns the state and its updater
            functions, and passes both as the context value
          </li>
          <li>
            Write a <strong>custom hook</strong> wrapping <code>useContext</code> that throws when
            it's used outside its Provider
          </li>
        </ul>
        <p>
          Want more? <Link to="/week2/day10-routing-global-state/concepts">View all concepts.</Link>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}>Section 2 — Full Walkthrough</h2>

      <h2>1. Client-side routing: what actually changes</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>The old way (server-rendered, multi-page):</strong> every link is a request. The
            browser throws away the current page, asks the server for{" "}
            <code>/products/42</code>, and paints whatever HTML comes back. Full reload, white
            flash, all JavaScript state gone.
          </li>
          <li>
            <strong>The SPA way (client-side rendering):</strong> the server hands over one HTML
            shell and one JS bundle, once. After that the app owns the URL bar.
          </li>
          <li>
            A router is just <strong>a big conditional on the URL</strong>: it reads the current
            path, decides which component matches, and renders it. No network request, no reload —
            React swaps components the same way it swaps anything else.
          </li>
          <li>
            The URL is still a real URL: it's in the address bar, Back and Forward work, and the
            page is bookmarkable. That's the part <code>useState</code> alone can't give you.
          </li>
        </ul>
      </div>

      <h2>2. React Router in one screen</h2>
      <p>The router wraps the whole app exactly once, at the root:</p>
      <CodeBlock
        code={`
// main.tsx
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
`}
      />
      <p>
        Then one <code>&lt;Route&gt;</code> per URL you want to exist, and one{" "}
        <code>&lt;Link&gt;</code> per navigation:
      </p>
      <CodeBlock
        code={`
// App.tsx
import { Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
`}
      />
      <CodeBlock
        code={`
<a href="/products">Products</a>      // full reload: the whole app reboots, all state is lost
<Link to="/products">Products</Link>  // the router swaps the component, state survives
`}
        language="xml"
        bad={[1]}
        good={[2]}
      />
      <p className="callout">
        A stray <code>&lt;a href&gt;</code> inside a React app is a bug, not a style choice — it
        throws away every piece of state the app was holding.
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Piece</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>&lt;BrowserRouter&gt;</code>
            </td>
            <td>Wraps the app once and connects it to the browser's URL and history.</td>
          </tr>
          <tr>
            <td>
              <code>&lt;Routes&gt;</code>
            </td>
            <td>Looks at the current URL and renders the single best-matching child route.</td>
          </tr>
          <tr>
            <td>
              <code>&lt;Route path element&gt;</code>
            </td>
            <td>
              One URL pattern and the component to render for it. <code>:id</code> is a parameter;{" "}
              <code>*</code> is the catch-all for a 404 page — <code>&lt;Routes&gt;</code> ranks by
              specificity rather than by order, so it only wins when nothing else matches.
            </td>
          </tr>
          <tr>
            <td>
              <code>&lt;Link to&gt;</code>
            </td>
            <td>An in-app navigation, with no reload. This replaces every internal anchor tag.</td>
          </tr>
          <tr>
            <td>
              <code>useParams()</code>
            </td>
            <td>
              Reads the <code>:</code> parameters out of the current URL, always as strings.
            </td>
          </tr>
          <tr>
            <td>
              <code>useNavigate()</code>
            </td>
            <td>
              Navigates from code rather than from a click — after a login, after a form submit.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>3. Reading the URL and navigating from code</h2>
      <CodeBlock
        code={`
import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();      // "/products/42" -> id is the string "42"
  const navigate = useNavigate();

  return (
    <div>
      <h1>Product {id}</h1>
      <button onClick={() => navigate("/products")}>Back to the list</button>
      <button onClick={() => navigate(-1)}>Back one step in history</button>
    </div>
  );
}
`}
      />
      <p className="callout">
        <code>useParams</code> hands you strings, never numbers — <code>id === "42"</code>, so
        convert before you compare against a numeric id.
      </p>
      <p className="callout">
        That's the whole routing story for today: every project wires routing slightly differently
        and you do it once, so understand the shape rather than memorising the API.
      </p>

      <hr className="section-divider" />

      <h2>4. Pain point 1 — prop drilling</h2>
      <p>
        State lives in one component and is needed in a distant one, so every component in between
        has to accept it and pass it on:
      </p>
      <CodeBlock
        code={`
function App() {
  const [user, setUser] = useState<User | null>(null);
  return <Layout user={user} />;
}

function Layout({ user }: { user: User | null }) {
  return <Sidebar user={user} />;   // Layout never uses user
}

function Sidebar({ user }: { user: User | null }) {
  return <UserBadge user={user} />; // Sidebar never uses user either
}

function UserBadge({ user }: { user: User | null }) {
  return <span>{user ? user.name : "Sign in"}</span>;
}
`}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>The prop isn't the problem — the middle is.</strong> <code>Layout</code> and{" "}
            <code>Sidebar</code> are now coupled to a value they have no interest in.
          </li>
          <li>
            Every new field is a change to every file on the path. Adding <code>theme</code> next
            week means editing four components to deliver it to one.
          </li>
          <li>
            The components in the middle stop being reusable: you can't drop{" "}
            <code>Sidebar</code> anywhere else without also supplying a <code>user</code>.
          </li>
          <li>
            Two or three levels is fine and normal. It becomes a real problem when the path is long
            or the value is needed in several unrelated branches of the tree.
          </li>
        </ul>
      </div>

      <h2>5. Pain point 2 — the same state in two places</h2>
      <p>
        Two components that both need the same number, and no parent-child line between them. The
        instinct is to give each one its own <code>useState</code>:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function CartBadge() {
  const [count] = useState(0);            // one copy
  return <span>Cart: {count}</span>;
}

function AddToCartButton() {
  const [count, setCount] = useState(0);  // a different copy
  return <button onClick={() => setCount(count + 1)}>Add to cart</button>;
}
`}
          bad={[2, 7]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Two copies, two truths</p>
          <OutOfSyncDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>State is per component instance.</strong> Two <code>useState</code> calls are
            two independent boxes, even when they hold the same kind of value and start equal.
          </li>
          <li>
            So "update one and keep the others in sync" is a question with no good answer — the
            only real fix is to <strong>stop having two copies</strong>.
          </li>
          <li>
            The standard fix is <strong>lifting state up</strong>: move it to the nearest common
            parent and pass it down. That's correct, and it's what you should reach for first.
          </li>
          <li>
            But the nearest common parent of a header badge and a product page is usually{" "}
            <code>App</code> — so lifting state up turns straight back into pain point 1.{" "}
            <strong>Prop drilling and out-of-sync state are the same problem seen from two ends.</strong>
          </li>
        </ul>
      </div>

      <h2>6. Context: one owner, any number of readers</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            Context keeps the "one owner" half of lifting state up and deletes the "pass it down
            through everyone" half.
          </li>
          <li>
            A Provider high in the tree publishes a value; any component underneath it, at any
            depth, reads that value directly with <code>useContext</code>. The components in
            between never see it.
          </li>
          <li>
            <strong>Context is delivery, not storage.</strong> The state is still a plain{" "}
            <code>useState</code> inside the Provider — context is only how it reaches the readers.
          </li>
          <li>
            Publish <strong>the state and the functions that change it</strong> together, so a
            reader can also be a writer without any prop travelling back up.
          </li>
        </ul>
      </div>

      <h3>Step 1 — type the state and the actions</h3>
      <CodeBlock
        code={`
export interface ToDo {
  id: number;
  text: string;
  completed: boolean;
}

// everything the context hands out: the data AND the ways to change it
interface ToDoContextType {
  todos: ToDo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}
`}
        language="typescript"
      />

      <h3>
        Step 2 — <code>createContext</code>
      </h3>
      <CodeBlock
        code={`
// undefined is the "there is no Provider above me" case — it is what makes the guard in
// step 4 possible, and it is why the type is a union
const ToDoContext = createContext<ToDoContextType | undefined>(undefined);
`}
        language="typescript"
      />

      <h3>Step 3 — the custom Provider component</h3>
      <p>
        This is the piece that matters. It's an ordinary component that owns the state, defines the
        updaters, and renders <code>ToDoContext.Provider</code> around its <code>children</code>:
      </p>
      <CodeBlock
        code={`
export const ToDoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<ToDo[]>([]);   // the single owner of the state

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
  };

  // the context value — state + updaters bundled into one object
  return (
    <ToDoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </ToDoContext.Provider>
  );
};
`}
      />
      <p className="callout">
        <code>{"{ children }"}</code> is what makes this reusable: the Provider wraps whatever you
        put inside it, so it never has to know which components will read the value.
      </p>

      <h3>
        Step 4 — the custom hook
      </h3>
      <CodeBlock
        code={`
export const useToDo = (): ToDoContextType => {
  const context = useContext(ToDoContext);
  if (!context) {
    throw new Error("useToDo must be used within a ToDoProvider");
  }
  return context;   // past this line it is never undefined, so callers get a clean typed object
};
`}
        language="typescript"
      />
      <p className="callout">
        Without the guard, every consumer would have to write{" "}
        <code>todos?.map(...)</code> forever because the type is{" "}
        <code>ToDoContextType | undefined</code> — one <code>throw</code> here removes that
        everywhere else.
      </p>

      <h3>The whole file</h3>
      <div className="data-block">
        <CodeBlock
          code={`
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define Types
export interface ToDo {
  id: number;
  text: string;
  completed: boolean;
}

interface ToDoContextType {
  todos: ToDo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

// 2. Create Context
const ToDoContext = createContext<ToDoContextType | undefined>(undefined);

// 3. Create Custom Provider Component
export const ToDoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<ToDo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: ToDo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // the context value: everything a consumer is allowed to read or call
  return (
    <ToDoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </ToDoContext.Provider>
  );
};

// 4. Create Custom Hook
export const useToDo = (): ToDoContextType => {
  const context = useContext(ToDoContext);
  if (!context) {
    throw new Error('useToDo must be used within a ToDoProvider');
  }
  return context;
};
`}
        />
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Piece</th>
            <th>What it is</th>
            <th>Why it's there</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>ToDoContextType</code>
            </td>
            <td>An interface holding the array plus three functions.</td>
            <td>
              The contract. Consumers get autocomplete, and adding an action is one edit here.
            </td>
          </tr>
          <tr>
            <td>
              <code>createContext(undefined)</code>
            </td>
            <td>Creates the channel, with no value until a Provider supplies one.</td>
            <td>
              <code>undefined</code> is the honest default — it means "nobody is providing this."
            </td>
          </tr>
          <tr>
            <td>
              <code>ToDoProvider</code>
            </td>
            <td>
              A component holding <code>useState</code> and the three updaters.
            </td>
            <td>The single owner. This is the only place the todo list actually exists.</td>
          </tr>
          <tr>
            <td>
              <code>value={"{{ todos, addTodo, … }}"}</code>
            </td>
            <td>The object published to every descendant.</td>
            <td>
              State and updaters travel together, so a consumer can write as well as read.
            </td>
          </tr>
          <tr>
            <td>
              <code>{"{ children }"}</code>
            </td>
            <td>Whatever the Provider is wrapped around.</td>
            <td>Keeps the Provider generic — it never names its consumers.</td>
          </tr>
          <tr>
            <td>
              <code>useContext(ToDoContext)</code>
            </td>
            <td>Reads the nearest Provider's value.</td>
            <td>The read side. No props, at any depth.</td>
          </tr>
          <tr>
            <td>
              <code>useToDo()</code>
            </td>
            <td>
              A hook wrapping <code>useContext</code> plus a <code>throw</code>.
            </td>
            <td>
              Narrows the type and turns "used outside the Provider" into a loud error instead of a
              silent <code>undefined</code>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>7. Using it: wrap once, consume anywhere</h2>
      <CodeBlock
        code={`
// App.tsx
import { ToDoProvider } from './ToDoContext';
import TodoList from './TodoList';

export default function App() {
  return (
    <ToDoProvider>
      <TodoList />
    </ToDoProvider>
  );
}
`}
      />
      <p>
        Any component inside that wrapper — one level down or ten — reads the same state with one
        line:
      </p>
      <div className="data-block">
        <CodeBlock
          code={`
// TodoList.tsx
import React, { useState } from 'react';
import { useToDo } from './ToDoContext';

export default function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useToDo();  // no props, any depth
  const [text, setText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text);
    setText('');
  };

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`}
        />
      </div>
      <p className="callout">
        Note what stayed local: <code>text</code> is still a plain <code>useState</code> in this
        component. Only state that's genuinely shared belongs in a context.
      </p>
      <p>Section 5's two out-of-sync panes, with the count moved into a provider above them:</p>
      <div className="demo-result demo-live">
        <p className="demo-result-label">One owner, two readers</p>
        <ContextSyncDemo />
      </div>

      <h2>8. Context gotchas</h2>
      <p className="callout">
        <code>value={"{{ todos, addTodo }}"}</code> builds a brand-new object on every Provider
        render, so <strong>every consumer re-renders</strong> even if it only reads a field that
        didn't change.
      </p>
      <p className="callout">
        One giant <code>AppContext</code> holding user + theme + cart makes that worse — split by
        concern, so a theme toggle doesn't re-render the cart.
      </p>
      <p className="callout">
        A component only sees the <strong>nearest</strong> Provider above it; forget to wrap, and{" "}
        <code>useContext</code> quietly returns <code>undefined</code> — which is exactly what the
        custom hook's <code>throw</code> is for.
      </p>

      <hr className="section-divider" />

      <h2>9. Where Context runs out, and Redux begins</h2>
      <p>
        Context is a delivery mechanism with no opinion about how state changes. That's fine for a
        theme or a signed-in user, and it starts to hurt once a big app's shared state changes
        often and from many places.
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th>Context API</th>
            <th>Redux</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cost</td>
            <td>Built into React, nothing to install.</td>
            <td>A dependency, a store setup, and a vocabulary to learn.</td>
          </tr>
          <tr>
            <td>Re-renders</td>
            <td>Any change to the value re-renders every consumer.</td>
            <td>
              A component subscribes to the slice it selects, and re-renders only when that slice
              changes.
            </td>
          </tr>
          <tr>
            <td>Where logic lives</td>
            <td>Handlers written inline in the Provider, growing as the feature grows.</td>
            <td>Named reducers — pure functions, in their own files, testable on their own.</td>
          </tr>
          <tr>
            <td>Async work</td>
            <td>You hand-roll it in the Provider, per feature.</td>
            <td>Middleware handles it in one standard place (Thunk, Saga).</td>
          </tr>
          <tr>
            <td>Debugging</td>
            <td>
              <code>console.log</code>.
            </td>
            <td>
              DevTools: every action, the state before and after, and time-travel back through
              them.
            </td>
          </tr>
          <tr>
            <td>Best fit</td>
            <td>Theme, locale, auth user, one feature's state.</td>
            <td>A large app where lots of shared state changes from lots of places.</td>
          </tr>
        </tbody>
      </table>

      <h2>10. Redux, conceptually</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>Single source of truth.</strong> One store object holds the whole app's client
            state, so there is never a second copy to keep in sync.
          </li>
          <li>
            <strong>State is read-only.</strong> Nothing assigns to it. The only way to change
            anything is to <code>dispatch</code> an action — a plain object like{" "}
            <code>{'{ type: "cart/itemAdded", payload: 42 }'}</code> describing what happened.
          </li>
          <li>
            <strong>Changes are made by pure reducers.</strong> A reducer is{" "}
            <code>(state, action) =&gt; newState</code>: no fetching, no randomness, no mutation —
            same inputs, same output, every time.
          </li>
        </ul>
      </div>
      <p>
        Put those three together and you get <strong>one-way data flow</strong>, the flux pattern: a
        UI event dispatches an action, the reducer computes the next state from it, the store hands
        that state to whoever subscribed, and those components re-render.
      </p>
      <figure className="diagram">
        <img
          src={reduxDataFlow}
          alt="Redux data flow loop: a UI event dispatches an action into the store, the store's reducer computes the new state, the store notifies the view, and the view re-renders."
        />
        <figcaption>
          One loop, one direction. There is no arrow from the view back into the state — the only
          way in is <code>dispatch</code>.
        </figcaption>
      </figure>

      <h3>Why middleware exists</h3>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            A reducer has to stay pure, so it cannot <code>fetch</code>, read the clock, or write to{" "}
            <code>localStorage</code> — but a real app has to do all of those <em>as part of</em>{" "}
            changing state.
          </li>
          <li>
            The loop above has nowhere to put that work: <code>dispatch</code> hands the action
            straight to the reducer, and an action is a plain object with no room for an{" "}
            <code>await</code>.
          </li>
          <li>
            <strong>
              Middleware is a stop placed between <code>dispatch</code> and the reducer.
            </strong>{" "}
            It sees every action first and can delay it, log it, replace it, or dispatch other
            actions before letting it through.
          </li>
          <li>
            So an async flow becomes: the component dispatches once, the middleware does the
            request, and then it dispatches plain "pending" / "fulfilled" / "rejected" actions that
            the reducer can handle purely.
          </li>
        </ul>
      </div>
      <figure className="diagram">
        <img
          src={reduxAsyncDataFlow}
          alt="Redux async data flow: a click dispatches a thunk, middleware starts the API request and dispatches a pending action, then dispatches a fulfilled action with the response, and the reducer updates the store from those plain actions."
        />
        <figcaption>
          The same loop with a thunk in it — the request happens in the middleware, and the reducer
          still only ever sees plain actions.
        </figcaption>
      </figure>
      <p>The middleware worth recognising by name:</p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Middleware</th>
            <th>What it adds</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>redux-thunk</code>
            </td>
            <td>
              Lets you dispatch a <em>function</em> instead of an object, so an API call can{" "}
              <code>await</code> and then dispatch the result. The default answer for async.
            </td>
          </tr>
          <tr>
            <td>
              <code>redux-saga</code>
            </td>
            <td>
              Generator-based flows for the complicated cases — retries, cancellation, debouncing,
              long sequences.
            </td>
          </tr>
          <tr>
            <td>
              <code>redux-persist</code>
            </td>
            <td>
              Saves chosen slices to <code>localStorage</code> and restores them on reload, so a
              cart or a session survives a refresh.
            </td>
          </tr>
          <tr>
            <td>
              <code>redux-logger</code>
            </td>
            <td>Logs every action with the state before and after it. Development only.</td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        Redux's real complaint was always boilerplate — action types, action creators, reducers and
        types, in four files per feature.
      </p>
      <p className="callout">
        <strong>Redux Toolkit (RTK)</strong> is the answer to that, and is how Redux is written
        today: <code>createSlice</code> generates the actions, the reducer and the types from one
        object, and <code>configureStore</code> ships with thunk and DevTools already wired.
      </p>

      <hr className="section-divider" />

      <h2>Advanced — server state, and what real projects actually run</h2>
      <p className="callout">
        Nothing in this section is something you write today — recognise the names and be able to
        say why a project splits its state in two.
      </p>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>Client state</strong> is yours: a form's text, the open tab, a theme, whether a
            modal is showing. It's synchronous, and nobody else can change it behind your back.
            Context and Redux are built for this.
          </li>
          <li>
            <strong>Server state</strong> is a <em>copy</em> of data that lives somewhere else. It
            goes stale, someone else can change it, and it needs caching, refetching, loading and
            error flags, and de-duplication of identical requests.
          </li>
          <li>
            Putting server state in Redux means hand-writing all of that per feature — which is
            Day 8's <code>useEffect</code> + <code>fetch</code> + loading + error boilerplate,
            repeated forever. That's the gap query libraries fill.
          </li>
        </ul>
      </div>
      <CodeBlock
        code={`
// React Query: the fetch, the cache, the loading and error states — one hook
const { data, isLoading, error } = useQuery({
  queryKey: ["todos"],
  queryFn: () => fetch("/api/todos").then((res) => res.json()),
});
`}
        language="typescript"
      />
      <p>
        <strong>RTK Query</strong> is the same idea shipped inside Redux Toolkit, so a project
        already on Redux gets it without adding another library.
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Typical combination</th>
            <th>Client state</th>
            <th>Server state</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Redux Toolkit + RTK Query</td>
            <td>RTK slices</td>
            <td>RTK Query</td>
          </tr>
          <tr>
            <td>Zustand + React Query</td>
            <td>Zustand (a small store, far less ceremony than Redux)</td>
            <td>React Query</td>
          </tr>
          <tr>
            <td>Context + React Query</td>
            <td>Context, for a handful of values</td>
            <td>React Query</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
