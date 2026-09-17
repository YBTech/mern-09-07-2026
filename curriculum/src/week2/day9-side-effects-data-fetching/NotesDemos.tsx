import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------------ *
 * Day 9 — the live demos Notes.tsx renders next to its snippets.
 *
 * Every one of these is the code from the snippet above it, actually running. Three
 * of them can't be: an infinite render loop, a crash, and an out-of-order response
 * are all things that would either take the page down or refuse to reproduce on a
 * fast network. Those three are labelled on the page as simulated, and say so in a
 * comment here too.
 *
 * The network demos hit the same two public APIs the snippets do —
 * jsonplaceholder.typicode.com and dummyjson.com — with small `limit`s so opening
 * this page isn't a dozen big downloads.
 * ------------------------------------------------------------------------ */

type Todo = { id: number; userId: number; title: string; completed: boolean };
type Product = { id: number; title: string; price: number; category: string };
type ProductsResponse = { products: Product[]; total: number; skip: number; limit: number };

const TODOS_URL = "https://jsonplaceholder.typicode.com/todos?_limit=8";

const logBox: CSSProperties = {
  maxHeight: 150,
  overflowY: "auto",
  margin: "0.6rem 0 0",
  padding: "0.5rem 0.6rem",
  background: "#fff",
  color: "#666",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontSize: "0.78rem",
  lineHeight: 1.5,
};
const inputStyle: CSSProperties = { padding: "0.3rem 0.5rem", marginRight: "0.4rem" };
const controls: CSSProperties = { display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" };
const twoCol: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: "1rem",
  marginTop: "0.6rem",
};
const subLabel: CSSProperties = {
  margin: "0 0 0.3rem",
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
  color: "#666",
};
const note: CSSProperties = { margin: "0.7rem 0 0", fontSize: "0.82rem", color: "#555" };
const listStyle: CSSProperties = { margin: "0.5rem 0 0", paddingLeft: "1.2rem", fontSize: "0.85rem" };
const statusStyle: CSSProperties = { margin: "0.5rem 0 0", fontSize: "0.85rem" };
const errorStyle: CSSProperties = { margin: "0.5rem 0 0", color: "#c62828", fontSize: "0.85rem" };

function TodoItems({ todos }: { todos: Todo[] }) {
  return (
    <ul style={listStyle}>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

/* ===================== 1. Purity & side effects ===================== */

// Deliberately outside the component: this is the thing the impure render mutates.
let impureVisits = 0;

function ImpureRow({ name }: { name: string }) {
  impureVisits += 1; // a side effect, in the middle of rendering
  return (
    <li>
      {name} — visitor #{impureVisits}
    </li>
  );
}

function PureRow({ name, index }: { name: string; index: number }) {
  return (
    <li>
      {name} — visitor #{index + 1}
    </li>
  );
}

export function PurityDemo() {
  const [, forceRender] = useState(0);
  const names = ["Ada", "Grace", "Alan"];

  return (
    <div>
      <button onClick={() => forceRender((n) => n + 1)}>Re-render (nothing else changed)</button>
      <div style={twoCol}>
        <div>
          <p style={subLabel}>Impure — writes to an outside variable while rendering</p>
          <ul style={listStyle}>
            {names.map((name) => (
              <ImpureRow key={name} name={name} />
            ))}
          </ul>
        </div>
        <div>
          <p style={subLabel}>Pure — same props in, same JSX out</p>
          <ul style={listStyle}>
            {names.map((name, index) => (
              <PureRow key={name} name={name} index={index} />
            ))}
          </ul>
        </div>
      </div>
      <p style={note}>
        The data never changed, but the impure numbers climb on every render — and they didn't even
        start at 1, because React rendered this page twice in development.
      </p>
    </div>
  );
}

/* ===================== 2. Lifecycle & the dependency array ===================== */

function LifecycleChild({ count, log }: { count: number; log: (line: string) => void }) {
  useEffect(() => {
    log("[] effect — mounted");
    return () => log("[] cleanup — unmounted");
  }, [log]);

  useEffect(() => {
    log(`[count] effect — count is now ${count}`);
    return () => log(`[count] cleanup — leaving count ${count}`);
  }, [count, log]);

  return <p style={{ margin: 0, fontSize: "0.85rem" }}>Child mounted · count = {count}</p>;
}

export function LifecycleDemo() {
  const [lines, setLines] = useState<string[]>([]);
  const log = useCallback((line: string) => setLines((prev) => [...prev, line]), []);
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [mounted, setMounted] = useState(true);

  return (
    <div>
      <div style={controls}>
        <button onClick={() => setMounted((m) => !m)}>{mounted ? "Unmount child" : "Mount child"}</button>
        <button onClick={() => setCount((c) => c + 1)} disabled={!mounted}>
          count + 1
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="type — re-renders, changes no dep"
          style={{ ...inputStyle, marginRight: 0, flex: "1 1 14rem" }}
        />
        <button onClick={() => setLines([])}>Clear log</button>
      </div>
      <div style={{ marginTop: "0.6rem" }}>
        {mounted ? <LifecycleChild count={count} log={log} /> : <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>(child is unmounted)</p>}
      </div>
      <pre style={logBox}>{lines.join("\n") || "(log empty)"}</pre>
    </div>
  );
}

export function NoDepsLoopDemo() {
  const CAP = 20;
  const [runs, setRuns] = useState(0);
  const [live, setLive] = useState(false);

  // No dependency array, on purpose: this effect runs after every render, and it causes
  // the next render itself. Capped at CAP so the page survives being opened.
  useEffect(() => {
    if (!live || runs >= CAP) return;
    setRuns((r) => r + 1);
  });

  return (
    <div>
      <div style={controls}>
        <button onClick={() => setLive(true)} disabled={live}>
          Start the loop
        </button>
        <button
          onClick={() => {
            setLive(false);
            setRuns(0);
          }}
        >
          Reset
        </button>
      </div>
      <p style={statusStyle}>
        The effect has run <strong>{runs}</strong> times
        {runs >= CAP ? " — stopped only because this demo caps it at 20." : live ? " and counting…" : "."}
      </p>
      <p style={note}>
        Nothing here is fake: the effect sets state, the state change renders, the render runs the
        effect. Without the cap it would never stop.
      </p>
    </div>
  );
}

/* ===================== 3. Cleanup ===================== */

function LeakyTicker({ withCleanup }: { withCleanup: boolean }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const leaked = useRef<number[]>([]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    if (withCleanup) return () => window.clearInterval(id);
    leaked.current.push(id);
  }, [running, withCleanup]);

  // Not part of the lesson: intervals leaked above would outlive this page, so the demo
  // clears whatever escaped when it unmounts.
  useEffect(() => {
    const ids = leaked.current;
    return () => ids.forEach((id) => window.clearInterval(id));
  }, []);

  return (
    <div>
      <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700 }}>{seconds}s</p>
      <div style={controls}>
        <button onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Start"}</button>
        <button
          onClick={() => {
            setRunning(false);
            setSeconds(0);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export function CleanupTimerDemo() {
  const [withCleanup, setWithCleanup] = useState(true);
  const [instance, setInstance] = useState(0);

  return (
    <div>
      <div style={controls}>
        <label style={{ fontSize: "0.85rem" }}>
          <input
            type="checkbox"
            checked={withCleanup}
            onChange={(e) => setWithCleanup(e.target.checked)}
          />{" "}
          return a cleanup function
        </label>
        <button onClick={() => setInstance((i) => i + 1)}>Remount the timer</button>
      </div>
      <div style={{ marginTop: "0.6rem" }}>
        <LeakyTicker key={instance} withCleanup={withCleanup} />
      </div>
      <p style={note}>
        Uncheck the box, then hit Start / Pause / Start a few times. The clock speeds up — every
        Start left another <code>setInterval</code> running — and "Pause" no longer pauses anything,
        because nothing ever cleared the old ones.
      </p>
    </div>
  );
}

/* ===================== 4. The core fetch ===================== */

export function FetchTodosDemo() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(TODOS_URL);
      const data: Todo[] = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h3 style={{ margin: 0, fontSize: "1rem" }}>Todo List</h3>
      <TodoItems todos={todos} />
    </div>
  );
}

export function ForgotSetStateDemo() {
  // The setter is left out on purpose — there is no line in this component that ever
  // hands the response to React.
  const [todos] = useState<Todo[]>([]);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(TODOS_URL);
      const data: Todo[] = await response.json();
      setLog((prev) => [...prev, `fetch resolved with ${data.length} todos — and then nothing`]);
      // setTodos(data) is missing, so React never hears about the data
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h3 style={{ margin: 0, fontSize: "1rem" }}>Todo List</h3>
      <TodoItems todos={todos} />
      <pre style={logBox}>{log.join("\n") || "(fetching…)"}</pre>
      <p style={note}>
        Empty page, no error, no red in the console. The Network tab shows a successful request —
        that's the only clue. <code>setTodos</code> is what turns a response into a render; without
        it, <code>todos</code> is still the <code>[]</code> it started as. Try it with{" "}
        <code>setTodos</code> deleted and the ghost bug makes sense.
      </p>
    </div>
  );
}

export function UndefinedMapDemo() {
  let message = "";
  try {
    // What useState() with no argument leaves you holding on the first render.
    const todos = undefined as unknown as Todo[];
    todos.map((todo) => todo.title);
  } catch (err) {
    message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  }

  return (
    <div>
      <p style={subLabel}>What the browser throws, before anything renders</p>
      <pre style={{ ...logBox, margin: 0, color: "#c62828" }}>{message}</pre>
      <p style={note}>
        The first render happens long before the response arrives, so the first render is the one
        that has to survive. Start the state at <code>[]</code> and it renders an empty list instead.
      </p>
    </div>
  );
}

const KEYED_TODOS: Todo[] = [
  { id: 11, userId: 1, title: "Renew passport", completed: false },
  { id: 12, userId: 1, title: "Book flights", completed: false },
  { id: 13, userId: 1, title: "Pack bags", completed: false },
];

export function KeyIdentityDemo() {
  const [byIndex, setByIndex] = useState(KEYED_TODOS);
  const [byId, setById] = useState(KEYED_TODOS);

  return (
    <div>
      <div style={twoCol}>
        <div>
          <p style={subLabel}>key={"{index}"}</p>
          {byIndex.map((todo, index) => (
            <label key={index} style={{ display: "block", fontSize: "0.85rem" }}>
              <input type="checkbox" /> {todo.title}
            </label>
          ))}
          <button style={{ marginTop: "0.5rem" }} onClick={() => setByIndex((prev) => prev.slice(1))}>
            Remove the first row
          </button>
        </div>
        <div>
          <p style={subLabel}>key={"{todo.id}"}</p>
          {byId.map((todo) => (
            <label key={todo.id} style={{ display: "block", fontSize: "0.85rem" }}>
              <input type="checkbox" /> {todo.title}
            </label>
          ))}
          <button style={{ marginTop: "0.5rem" }} onClick={() => setById((prev) => prev.slice(1))}>
            Remove the first row
          </button>
        </div>
      </div>
      <p style={note}>
        Tick the <em>first</em> checkbox in each column, then remove the first row in each. On the
        left the tick jumps to a different todo — position 0 still exists, so React reuses that
        checkbox for whatever moved into it. On the right the tick leaves with the row it belonged
        to.
      </p>
    </div>
  );
}

// Simulated: a real fetch + setState in the component body throws "Too many re-renders" and
// takes the page with it. This replays the same sequence on a timer so it's readable.
export function FetchInBodyLoopDemo() {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      if (n > 8) {
        setLines((prev) => [...prev, "Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop."]);
        setRunning(false);
        window.clearInterval(id);
        return;
      }
      setLines((prev) => [...prev, `render #${n} → fetch("/todos") fired → setTodos(data) → render again…`]);
    }, 450);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div>
      <div style={controls}>
        <button onClick={() => setRunning(true)} disabled={running}>
          Replay what happens
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setLines([]);
          }}
        >
          Reset
        </button>
      </div>
      <pre style={logBox}>{lines.join("\n") || "(press replay)"}</pre>
    </div>
  );
}

/* ===================== 5. Loading & error states ===================== */

const STATUS_URLS = {
  ok: "https://jsonplaceholder.typicode.com/todos?_limit=5",
  notFound: "https://jsonplaceholder.typicode.com/todosss?_limit=5",
  unreachable: "https://not-a-real-host.invalid/todos",
};

export function TodosWithStatusDemo() {
  const [which, setWhich] = useState<keyof typeof STATUS_URLS>("ok");
  const [attempt, setAttempt] = useState(0);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(STATUS_URLS[which]);
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const data: Todo[] = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [which, attempt]);

  return (
    <div>
      <div style={controls}>
        <select value={which} onChange={(e) => setWhich(e.target.value as keyof typeof STATUS_URLS)} style={inputStyle}>
          <option value="ok">a URL that works</option>
          <option value="notFound">a URL that 404s</option>
          <option value="unreachable">a host that doesn't resolve</option>
        </select>
        <button onClick={() => setAttempt((a) => a + 1)}>Re-fetch</button>
      </div>
      <div style={{ marginTop: "0.6rem", minHeight: "3rem" }}>
        {isLoading && <p style={statusStyle}>Loading…</p>}
        {error && <p style={errorStyle}>Couldn't load todos: {error}</p>}
        {!isLoading && !error && <TodoItems todos={todos} />}
      </div>
      <p style={note}>
        Three states, one at a time. The 404 case is the interesting one — <code>fetch</code> does{" "}
        <em>not</em> reject on a 404, so without the <code>response.ok</code> check this would
        happily try to render an error page as a todo list.
      </p>
    </div>
  );
}

/* ===================== 6. Fetching one object ===================== */

export function SingleTodoDemo() {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const data: Todo = await response.json();
        setTodo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, []);

  if (isLoading) return <p style={statusStyle}>Loading…</p>;
  if (error) return <p style={errorStyle}>Couldn't load the todo: {error}</p>;
  if (!todo) return <p style={statusStyle}>No todo found.</p>;

  return (
    <div>
      <h3 style={{ margin: 0, fontSize: "1rem" }}>{todo.title}</h3>
      <p style={statusStyle}>
        id {todo.id} · user {todo.userId} · {todo.completed ? "completed" : "not completed"}
      </p>
    </div>
  );
}

export function TodoByIdDemo() {
  const [todoId, setTodoId] = useState(1);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const data: Todo = await response.json();
        setTodo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, [todoId]);

  return (
    <div>
      <div style={controls}>
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <button key={id} onClick={() => setTodoId(id)} disabled={id === todoId}>
            todo {id}
          </button>
        ))}
      </div>
      <div style={{ marginTop: "0.6rem", minHeight: "3rem" }}>
        {isLoading && <p style={statusStyle}>Loading todo {todoId}…</p>}
        {error && <p style={errorStyle}>Couldn't load todo {todoId}: {error}</p>}
        {!isLoading && !error && todo && (
          <>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>{todo.title}</h3>
            <p style={statusStyle}>
              id {todo.id} · user {todo.userId} · {todo.completed ? "completed" : "not completed"}
            </p>
          </>
        )}
      </div>
      <p style={note}>
        One click changes <code>todoId</code>, which changes the dependency array, which re-runs the
        effect. No second "refresh" mechanism, no manual call — the URL is derived from state and the
        effect follows it.
      </p>
    </div>
  );
}

/* ===================== 7. A wrapped response shape ===================== */

export function ProductsDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://dummyjson.com/products?limit=5");
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <p style={statusStyle}>Loading…</p>;
  if (error) return <p style={errorStyle}>Couldn't load products: {error}</p>;

  return (
    <div>
      <p style={{ margin: 0, fontSize: "0.85rem" }}>
        Showing {products.length} of {total} products
      </p>
      <ul style={listStyle}>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} — ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductsPaginationDemo() {
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const skip = (page - 1) * PAGE_SIZE;
        const response = await fetch(`https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`);
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div style={{ minHeight: "8.5rem" }}>
        {isLoading && <p style={statusStyle}>Loading page {page}…</p>}
        {error && <p style={errorStyle}>Couldn't load page {page}: {error}</p>}
        {!isLoading && !error && (
          <ul style={listStyle}>
            {products.map((product) => (
              <li key={product.id}>
                {product.title} — ${product.price.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{ ...controls, marginTop: "0.6rem" }}>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1 || isLoading}>
          ← Prev
        </button>
        <span style={{ fontSize: "0.85rem" }}>
          Page {page} of {lastPage}
        </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page >= lastPage || isLoading}>
          Next →
        </button>
      </div>
    </div>
  );
}

/* ===================== 8. Fetching from an event handler ===================== */

export function HealthCheckDemo() {
  const [status, setStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    setIsChecking(true);
    setError(null);
    try {
      const response = await fetch("https://dummyjson.com/test");
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const data: { status: string } = await response.json();
      setStatus(data.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div>
      <button onClick={handleCheck} disabled={isChecking}>
        {isChecking ? "Checking…" : "Check the API"}
      </button>
      {error && <p style={errorStyle}>{error}</p>}
      {status && !error && <p style={statusStyle}>API says: {status}</p>}
      {!status && !error && !isChecking && <p style={note}>Nothing has been fetched yet — and that's the point.</p>}
    </div>
  );
}

export function ProductSearchDemo() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      const data: ProductsResponse = await response.json();
      setResults(data.products);
      setSearched(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={controls}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="phone, laptop, mascara…"
          style={inputStyle}
        />
        <button type="submit" disabled={isSearching || !query.trim()}>
          {isSearching ? "Searching…" : "Search"}
        </button>
      </form>
      <div style={{ marginTop: "0.5rem", minHeight: "3rem" }}>
        {error && <p style={errorStyle}>{error}</p>}
        {!error && searched && results.length === 0 && <p style={statusStyle}>Nothing matched "{searched}".</p>}
        {!error && results.length > 0 && (
          <>
            <p style={{ margin: 0, fontSize: "0.85rem" }}>Results for "{searched}"</p>
            <ul style={listStyle}>
              {results.map((product) => (
                <li key={product.id}>
                  {product.title} — ${product.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

/* ===================== 9. You might not need an effect ===================== */

function EffectFullName({ first, last }: { first: string; last: string }) {
  const [fullName, setFullName] = useState("");
  const renders = useRef(0);
  renders.current += 1;

  useEffect(() => {
    setFullName(`${first} ${last}`);
  }, [first, last]);

  return (
    <div>
      <p style={subLabel}>state + effect</p>
      <p style={{ margin: 0, fontSize: "0.9rem" }}>{fullName || " "}</p>
      <p style={note}>renders: {renders.current}</p>
    </div>
  );
}

function ComputedFullName({ first, last }: { first: string; last: string }) {
  const renders = useRef(0);
  renders.current += 1;
  const fullName = `${first} ${last}`;

  return (
    <div>
      <p style={subLabel}>computed during render</p>
      <p style={{ margin: 0, fontSize: "0.9rem" }}>{fullName}</p>
      <p style={note}>renders: {renders.current}</p>
    </div>
  );
}

export function DerivedFullNameDemo() {
  const [first, setFirst] = useState("Ada");
  const [last, setLast] = useState("Lovelace");

  return (
    <div>
      <div style={controls}>
        <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="first" style={inputStyle} />
        <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="last" style={inputStyle} />
      </div>
      <div style={twoCol}>
        <EffectFullName first={first} last={last} />
        <ComputedFullName first={first} last={last} />
      </div>
      <p style={note}>
        Type one letter. The left column renders twice for it — once with the old name, then again
        once the effect catches up — and the right column renders once, correct immediately. Same
        output, twice the work and one stale frame.
      </p>
    </div>
  );
}

const SEARCHABLE: Todo[] = [
  { id: 1, userId: 1, title: "Write the deployment runbook", completed: false },
  { id: 2, userId: 1, title: "Review the pull request", completed: true },
  { id: 3, userId: 2, title: "Fix the login redirect", completed: false },
  { id: 4, userId: 2, title: "Write release notes", completed: true },
  { id: 5, userId: 3, title: "Upgrade the build pipeline", completed: false },
];

function EffectFilteredList({ query, sortAsc }: { query: string; sortAsc: boolean }) {
  const [visible, setVisible] = useState<Todo[]>(SEARCHABLE);
  const renders = useRef(0);
  renders.current += 1;

  useEffect(() => {
    const filtered = SEARCHABLE.filter((todo) => todo.title.toLowerCase().includes(query.toLowerCase()));
    const sorted = [...filtered].sort((a, b) => (sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));
    setVisible(sorted);
  }, [query, sortAsc]);

  return (
    <div>
      <p style={subLabel}>state + effect</p>
      <ul style={listStyle}>
        {visible.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <p style={note}>renders: {renders.current}</p>
    </div>
  );
}

function ComputedFilteredList({ query, sortAsc }: { query: string; sortAsc: boolean }) {
  const renders = useRef(0);
  renders.current += 1;

  const filtered = SEARCHABLE.filter((todo) => todo.title.toLowerCase().includes(query.toLowerCase()));
  const visible = [...filtered].sort((a, b) => (sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)));

  return (
    <div>
      <p style={subLabel}>computed during render</p>
      <ul style={listStyle}>
        {visible.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <p style={note}>renders: {renders.current}</p>
    </div>
  );
}

export function DerivedListDemo() {
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  return (
    <div>
      <div style={controls}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="filter todos…" style={inputStyle} />
        <button onClick={() => setSortAsc((s) => !s)}>Sort {sortAsc ? "Z→A" : "A→Z"}</button>
      </div>
      <div style={twoCol}>
        <EffectFilteredList query={query} sortAsc={sortAsc} />
        <ComputedFilteredList query={query} sortAsc={sortAsc} />
      </div>
      <p style={note}>
        Both lists are right, and only one of them needed a second state, an effect, a dependency
        array, and two renders per keystroke to get there.
      </p>
    </div>
  );
}

/* ===================== 10. Race conditions ===================== */

// Simulated: a real network would have to be slow in exactly the wrong order to show this.
// The delay per user is fixed here so the race reproduces every time.
const USER_DELAYS: Record<number, number> = { 1: 2200, 2: 1200, 3: 250 };

function fakeFetchTodosFor(userId: number): Promise<string> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(`todos for user ${userId}`), USER_DELAYS[userId]);
  });
}

function RacingPanel({ useIgnoreFlag }: { useIgnoreFlag: boolean }) {
  const [userId, setUserId] = useState(1);
  const [shown, setShown] = useState("—");
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      const json = await fakeFetchTodosFor(userId);
      if (useIgnoreFlag && ignore) {
        setLines((prev) => [...prev, `ignored a stale response: ${json}`]);
        return;
      }
      setShown(json);
      setLines((prev) => [...prev, `setTodos(${json})`]);
    }

    startFetching();

    return () => {
      ignore = true;
    };
  }, [userId, useIgnoreFlag]);

  return (
    <div>
      <div style={controls}>
        {[1, 2, 3].map((id) => (
          <button key={id} onClick={() => setUserId(id)} disabled={id === userId}>
            user {id}
          </button>
        ))}
        <button onClick={() => setLines([])}>Clear log</button>
      </div>
      <p style={{ margin: "0.6rem 0 0", fontSize: "0.9rem" }}>
        Selected: user <strong>{userId}</strong> · on screen: <strong>{shown}</strong>
      </p>
      <pre style={logBox}>{lines.join("\n") || "(log empty)"}</pre>
    </div>
  );
}

export function RaceConditionDemo() {
  const [useIgnoreFlag, setUseIgnoreFlag] = useState(false);
  const [instance, setInstance] = useState(0);

  return (
    <div>
      <div style={controls}>
        <label style={{ fontSize: "0.85rem" }}>
          <input type="checkbox" checked={useIgnoreFlag} onChange={(e) => setUseIgnoreFlag(e.target.checked)} />{" "}
          honour the <code>ignore</code> flag
        </label>
        <button onClick={() => setInstance((i) => i + 1)}>Reset</button>
      </div>
      <div style={{ marginTop: "0.6rem" }}>
        <RacingPanel key={instance} useIgnoreFlag={useIgnoreFlag} />
      </div>
      <p style={note}>
        User 1 takes 2.2s here, user 3 takes 0.25s. Click <strong>user 1</strong> then immediately{" "}
        <strong>user 3</strong>: with the flag off, user 3's todos appear and then get overwritten by
        user 1's late response, while the buttons still say user 3. With the flag on, the stale
        response is thrown away.
      </p>
    </div>
  );
}

/* ===================== 11. Synchronizing with external systems ===================== */

export function WindowSizeDemo() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <p style={{ margin: 0, fontSize: "0.9rem" }}>
      Window width: <strong>{width}px</strong> — drag the browser edge.
    </p>
  );
}

/* A stand-in for an external system with a subscribe/unsubscribe API: one module-level
   object, outside React, that pushes values at whoever has subscribed. */
type Listener = (price: number) => void;

const priceFeed = {
  listeners: new Set<Listener>(),
  timer: 0,
  price: 50000,
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    if (this.listeners.size === 1) {
      this.timer = window.setInterval(() => {
        this.price = Math.max(1000, this.price + (Math.random() - 0.5) * 400);
        this.listeners.forEach((fn) => fn(this.price));
      }, 1000);
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) window.clearInterval(this.timer);
    };
  },
};

function PriceTicker({ log }: { log: (line: string) => void }) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    log("subscribed to the feed");
    const unsubscribe = priceFeed.subscribe(setPrice);

    return () => {
      unsubscribe();
      log("unsubscribed — feed has no listeners left");
    };
  }, [log]);

  return (
    <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
      BTC {price === null ? "…" : `$${price.toFixed(2)}`}
    </p>
  );
}

export function SubscriptionDemo() {
  const [mounted, setMounted] = useState(true);
  const [lines, setLines] = useState<string[]>([]);
  const log = useCallback((line: string) => setLines((prev) => [...prev, line]), []);

  return (
    <div>
      <div style={controls}>
        <button onClick={() => setMounted((m) => !m)}>{mounted ? "Unmount the ticker" : "Mount the ticker"}</button>
        <button onClick={() => setLines([])}>Clear log</button>
      </div>
      <div style={{ marginTop: "0.6rem", minHeight: "2.4rem" }}>
        {mounted ? <PriceTicker log={log} /> : <p style={{ margin: 0, fontSize: "0.85rem", color: "#888" }}>(ticker unmounted)</p>}
      </div>
      <pre style={logBox}>{lines.join("\n") || "(log empty)"}</pre>
      <p style={note}>
        Unmount the ticker and the feed's interval stops too — the cleanup is what lets the external
        system know nobody is listening any more.
      </p>
    </div>
  );
}
