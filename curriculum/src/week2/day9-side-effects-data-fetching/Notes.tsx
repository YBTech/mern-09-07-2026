import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import {
  CleanupTimerDemo,
  DerivedFullNameDemo,
  DerivedListDemo,
  FetchInBodyLoopDemo,
  FetchTodosDemo,
  ForgotSetStateDemo,
  HealthCheckDemo,
  KeyIdentityDemo,
  LifecycleDemo,
  NoDepsLoopDemo,
  ProductSearchDemo,
  ProductsDemo,
  ProductsPaginationDemo,
  PurityDemo,
  RaceConditionDemo,
  SingleTodoDemo,
  SubscriptionDemo,
  TodoByIdDemo,
  TodosWithStatusDemo,
  UndefinedMapDemo,
  WindowSizeDemo,
} from "./NotesDemos";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 9 Notes</title>
      <DayNav day="day9-side-effects-data-fetching" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 9 · Notes</p>
        <h1>Side Effects &amp; Data Fetching</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>
            Fetch data in a <code>useEffect</code> and render the response: state starting at{" "}
            <code>[]</code>, an <code>async</code> function defined inside the effect and called,{" "}
            <code>setTodos(data)</code> with the result, <code>.map</code> with a stable{" "}
            <code>key</code> in the JSX
          </li>
          <li>
            Call <code>useEffect(callback, dependencies)</code> with both arguments, at the top level
            of a component — never inside an <code>if</code>, a loop, or after an early{" "}
            <code>return</code>
          </li>
          <li>
            Say what each dependency array means and which lifecycle moment it maps to:{" "}
            <code>[]</code> is mount only, <code>[id]</code> is mount plus every change to{" "}
            <code>id</code>, no array at all is after every single render
          </li>
          <li>
            Return a cleanup function from an effect to undo what it started, and know when React
            calls it — before the effect's next run, and on unmount
          </li>
        </ul>
        <p>
          Want more?{" "}
          <a href="/week2/day9-side-effects-data-fetching/concepts">View all concepts.</a>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}>Section 2 — Full Walkthrough</h2>

      <h2>1. Rendering is pure; side effects are everything else</h2>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            A component is a function whose only job is <strong>to calculate JSX from its props and
            state</strong>. Same inputs in, same JSX out, every time.
          </li>
          <li>
            So the render must touch nothing outside itself: no writing to variables declared outside
            the component, no mutating props or existing state, no{" "}
            <code>document.title = …</code>, no <code>localStorage</code>, no{" "}
            <code>fetch</code>.
          </li>
          <li>
            <strong>A side effect is any of those</strong> — work that reaches outside the component
            and changes something, or depends on something React doesn't control.
          </li>
          <li>
            React leans on purity: it renders whenever it likes, twice in development, and may throw a
            render away unused. An impure render gives a different answer each time it's run, so the
            output depends on <em>how many times</em> React happened to render — which you don't
            control.
          </li>
          <li>
            Side effects get two legal homes: an <strong>event handler</strong> (caused by a user
            action) or a <strong><code>useEffect</code></strong> (caused by a render being committed).
          </li>
        </ul>
      </div>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
let visits = 0;

function ImpureRow({ name }: { name: string }) {
  visits += 1; // writes to something outside, while rendering
  return <li>{name} — visitor #{visits}</li>;
}

function PureRow({ name, index }: { name: string; index: number }) {
  return <li>{name} — visitor #{index + 1}</li>;
}
`}
          bad={[4]}
          good={[9]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <PurityDemo />
        </div>
      </div>

      <h2>2. <code>useEffect</code>: two arguments, and when each part runs</h2>
      <CodeBlock
        code={`
useEffect(
  () => {
    // 1. the effect — runs AFTER React has committed this render to the DOM
    const id = setInterval(() => setSeconds((s) => s + 1), delay);

    // 2. the cleanup (optional) — runs before this effect's next run, and on unmount
    return () => clearInterval(id);
  },
  [delay], // 3. the dependency array — the values from this render the effect uses
);
`}
      />
      <p className="callout">
        The first argument is a function, not a call: <code>{"useEffect(() => { … }, [])"}</code>, the
        same "pass a function, don't call it" rule as <code>onClick</code>.
      </p>
      <p>
        Rules of hooks apply here exactly as they did to <code>useState</code> — top level of a
        component, same number of calls in the same order on every render. Put the condition{" "}
        <em>inside</em> the effect:
      </p>
      <CodeBlock
        code={`
function Bad({ isOpen }: { isOpen: boolean }) {
  if (isOpen) {
    useEffect(() => {
      document.title = "Panel open";
    }, []);
  }
  return null;
}

function Good({ isOpen }: { isOpen: boolean }) {
  useEffect(() => {
    if (!isOpen) return;
    document.title = "Panel open";
  }, [isOpen]);
  return null;
}
`}
        bad={[3]}
        good={[12]}
      />

      <h2>3. The dependency array, and the three lifecycle moments</h2>
      <table className="ref-table">
        <thead>
          <tr>
            <th>What you write</th>
            <th>When the effect runs</th>
            <th>Lifecycle moment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>{"useEffect(fn)"}</code> — no array</td>
            <td>after every single render</td>
            <td>mount <em>and</em> every update — almost always a mistake</td>
          </tr>
          <tr>
            <td><code>{"useEffect(fn, [])"}</code></td>
            <td>once, after the first render</td>
            <td><strong>mount</strong> (and its cleanup on <strong>unmount</strong>)</td>
          </tr>
          <tr>
            <td><code>{"useEffect(fn, [id])"}</code></td>
            <td>after the first render, then after any render where <code>id</code> changed</td>
            <td>mount + the <strong>updates</strong> that actually changed <code>id</code></td>
          </tr>
        </tbody>
      </table>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function LifecycleChild({ count }: { count: number }) {
  useEffect(() => {
    console.log("[] effect — mounted");
    return () => console.log("[] cleanup — unmounted");
  }, []);

  useEffect(() => {
    console.log("[count] effect — count is now", count);
    return () => console.log("[count] cleanup — leaving count", count);
  }, [count]);

  return <p>Child mounted · count = {count}</p>;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — watch the log as you use each control</p>
          <LifecycleDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            Every effect runs at least once, after the first render — the array only controls whether
            it runs <em>again</em>.
          </li>
          <li>
            Typing in the unrelated input above re-renders the child and runs <strong>no</strong>{" "}
            effect. A render is not an effect; only a changed dependency is.
          </li>
          <li>
            "Changed" means compared with <code>Object.is</code>, item by item. A dependency that is a
            new object, array or function built during render counts as changed every time.
          </li>
          <li>
            In development <code>React.StrictMode</code> mounts, unmounts and remounts every
            component once, so a <code>[]</code> effect appears to run twice. That is deliberate — it
            proves your cleanup works — and does not happen in production.
          </li>
        </ul>
      </div>
      <p>
        Leaving the array off while the effect sets state is the classic infinite loop: the effect
        renders, the render runs the effect, forever.
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
useEffect(() => {
  setRuns((r) => r + 1);
}); // no dependency array: this render's effect causes the next render
`}
          bad={[3]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — real loop, capped at 20 so the page survives</p>
          <NoDepsLoopDemo />
        </div>
      </div>

      <h2>4. Cleanup functions</h2>
      <p>
        If the effect <em>started</em> something that outlives the render — a timer, a listener, a
        subscription, an open connection — the cleanup is what stops it:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
useEffect(() => {
  if (!running) return;
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);

  return () => clearInterval(id);
}, [running]);
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — untick the box and start/pause a few times</p>
          <CleanupTimerDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            React calls the cleanup at two moments: <strong>before re-running the effect</strong>{" "}
            (because a dependency changed) and <strong>when the component unmounts</strong>.
          </li>
          <li>
            So the pair reads as one sentence: the effect sets something up, the cleanup undoes{" "}
            <em>that same</em> setup — <code>addEventListener</code> /{" "}
            <code>removeEventListener</code>, <code>setInterval</code> / <code>clearInterval</code>,{" "}
            <code>subscribe</code> / <code>unsubscribe</code>.
          </li>
          <li>
            The cleanup closes over the variables of the render it belongs to, which is why{" "}
            <code>clearInterval(id)</code> clears the right timer and not a newer one.
          </li>
          <li>
            Skip it and nothing errors — the leak is silent. Each re-run stacks another timer or
            listener on top of the last.
          </li>
        </ul>
      </div>

      <h2>5. The pattern you must know: fetch on mount, render the response</h2>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
type Todo = { id: number; userId: number; title: string; completed: boolean };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=8");
      const data: Todo[] = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <FetchTodosDemo />
        </div>
      </div>
      <p>Read it in the order it actually happens:</p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>#</th>
            <th>What happens</th>
            <th>What's on screen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>First render runs. <code>todos</code> is the initial <code>[]</code>.</td>
            <td>the heading, and an empty list</td>
          </tr>
          <tr>
            <td>2</td>
            <td>React commits that render, then runs the effect, which calls <code>fetchTodos()</code>.</td>
            <td>unchanged — the request is in flight</td>
          </tr>
          <tr>
            <td>3</td>
            <td>The response arrives; <code>setTodos(data)</code> schedules a re-render.</td>
            <td>unchanged for one more moment</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Second render runs with the real array.</td>
            <td>eight todos</td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        Your component always renders <em>before</em> the data exists — so the initial state has to be
        something the JSX can already render.
      </p>
      <p>
        One shape question comes up every time: why define an <code>async</code> function inside and
        call it, rather than making the effect itself <code>async</code>?
      </p>
      <CodeBlock
        code={`
useEffect(async () => {
  const data = await fetchTodos(); // an async function always returns a Promise,
  setTodos(data); // and React reads the return value as your cleanup function
}, []);

useEffect(() => {
  const fetchTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };
  fetchTodos(); // call it, don't await it — the effect itself stays sync
}, []);
`}
        bad={[1]}
        good={[6]}
      />

      <h2>6. Four ways people break that fetch</h2>
      <p>
        <strong>a. Fetching, then never calling the setter.</strong> The request succeeds, the console
        is clean, and the page stays empty:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
useEffect(() => {
  const fetchTodos = async () => {
    const response = await fetch(url);
    const data = await response.json(); // the data lives and dies in this function
  };
  fetchTodos();
}, []);
`}
          bad={[4]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <ForgotSetStateDemo />
        </div>
      </div>

      <p>
        <strong>b. No initial value, or the wrong shape.</strong>{" "}
        <code>useState()</code> leaves the state <code>undefined</code> on the first render — the one
        render that is guaranteed to happen before the data arrives:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function TodoListBroken() {
  const [todos, setTodos] = useState(); // undefined on the first render
  return <ul>{todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>;
}

function TodoListFixed() {
  const [todos, setTodos] = useState<Todo[]>([]); // an empty list renders fine
  return <ul>{todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>;
}
`}
          bad={[2]}
          good={[7]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <UndefinedMapDemo />
        </div>
      </div>

      <p>
        <strong>c. No <code>key</code>, or the index as the key.</strong> A missing key is a console
        warning; an index key is a real bug, because it tells React "the thing at position 0" instead
        of "this todo":
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
{todos.map((todo) => <li>{todo.title}</li>)}
{todos.map((todo, index) => <li key={index}>{todo.title}</li>)}
{todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}
`}
          language="xml"
          bad={[1, 2]}
          good={[3]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <KeyIdentityDemo />
        </div>
      </div>
      <p className="callout">
        Use the id the API already gave you. Index keys are only safe for a list that never reorders,
        never filters and never deletes.
      </p>

      <p>
        <strong>d. Calling <code>fetch</code> in the component body.</strong> This is the one beginners
        reach for first, and it's both impure and an infinite loop:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  fetch(url) // fires on EVERY render, during the render
    .then((res) => res.json())
    .then((data) => setTodos(data)); // ...and each setTodos causes another render

  return <ul>{todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>;
}
`}
          bad={[4, 6]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Simulated — the real thing crashes the page</p>
          <FetchInBodyLoopDemo />
        </div>
      </div>
      <p className="callout">
        The same goes for an event handler that doesn't exist yet: don't wrap the fetch in{" "}
        <code>{"if (todos.length === 0)"}</code> to stop the loop. The loop isn't the problem — doing
        the work during render is.
      </p>

      <h2>7. Loading and error states</h2>
      <p>
        A fetch has three outcomes, so the component needs three states and has to render whichever
        one it's in:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
const [todos, setTodos] = useState<Todo[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`Request failed with \${response.status}\`);
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  fetchTodos();
}, [url]);

if (isLoading) return <p>Loading…</p>;
if (error) return <p className="error">Couldn't load todos: {error}</p>;
return <ul>{todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>;
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — switch the URL to a broken one</p>
          <TodosWithStatusDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <code>isLoading</code> starts at <code>true</code>, not <code>false</code> — the first
            render already has a request coming.
          </li>
          <li>
            <strong><code>fetch</code> only rejects when the request never happened</strong> — no
            network, bad host, DNS failure. A 404 or a 500 is a <em>successful</em> request with a sad
            status, so <code>catch</code> never sees it. Check <code>response.ok</code> and throw
            yourself.
          </li>
          <li>
            <code>setIsLoading(false)</code> goes in <code>finally</code>, so it runs on both paths —
            forget it in the error branch and the spinner never goes away.
          </li>
          <li>
            Reset <code>error</code> to <code>null</code> at the top of each attempt, or a retry that
            succeeds still shows the old error.
          </li>
          <li>
            Render them in order: loading first, then error, then the data. Each one{" "}
            <code>return</code>s, so the JSX below never has to ask "but what if it failed?"
          </li>
        </ul>
      </div>

      <h2>8. Fetching one object instead of a list</h2>
      <p>
        There's no empty object worth rendering, so the initial state is <code>null</code> — and{" "}
        <code>null</code> has to be ruled out before the JSX touches a field:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
const [todo, setTodo] = useState<Todo | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchTodo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      if (!response.ok) throw new Error(\`Request failed with \${response.status}\`);
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

if (isLoading) return <p>Loading…</p>;
if (error) return <p className="error">{error}</p>;
if (!todo) return <p>No todo found.</p>;

return <h2>{todo.title}</h2>;
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <SingleTodoDemo />
        </div>
      </div>
      <CodeBlock
        code={`
return <h2>{todo.title}</h2>; // TypeScript: 'todo' is possibly 'null'
return <h2>{todo?.title}</h2>; // compiles, renders an empty heading, hides the bug
return todo ? <h2>{todo.title}</h2> : <p>No todo found.</p>; // say what to show instead
`}
        bad={[1, 2]}
        good={[3]}
      />
      <p className="callout">
        The union <code>{"Todo | null"}</code> is doing you a favour: the red squiggle is TypeScript
        pointing at the exact render where the data isn't there yet.
      </p>

      <h2>9. Re-fetching when the id changes</h2>
      <p>
        Put the id in state, build the URL from it, and list it as a dependency. That's the whole
        mechanism — no refresh button, no second effect:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
const [todoId, setTodoId] = useState(1);
const [todo, setTodo] = useState<Todo | null>(null);

useEffect(() => {
  const fetchTodo = async () => {
    setIsLoading(true);
    const response = await fetch(\`https://jsonplaceholder.typicode.com/todos/\${todoId}\`);
    const data: Todo = await response.json();
    setTodo(data);
    setIsLoading(false);
  };

  fetchTodo();
}, [todoId]); // changes to todoId re-run the effect; nothing else does

return <button onClick={() => setTodoId(2)}>Show todo 2</button>;
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <TodoByIdDemo />
        </div>
      </div>
      <p className="callout">
        Forget <code>todoId</code> in the array and the page fetches todo 1 forever, however many
        times you click — the most common "my data won't update" bug there is.
      </p>

      <h2>10. When the response isn't the array you wanted</h2>
      <p>
        Most real APIs wrap the list in an object with paging information around it.{" "}
        <code>https://dummyjson.com/products?limit=5</code> answers with:
      </p>
      <CodeBlock
        language="json"
        code={`
{
  "products": [{ "id": 1, "title": "Essence Mascara Lash Princess", "price": 9.99 }],
  "total": 194,
  "skip": 0,
  "limit": 5
}
`}
      />
      <p>
        So type the envelope, not just the item, and reach into it when you set state — the most
        common version of this bug is <code>setProducts(data)</code> followed by{" "}
        <code>data.map is not a function</code>:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
type Product = { id: number; title: string; price: number; category: string };
type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const [products, setProducts] = useState<Product[]>([]);
const [total, setTotal] = useState(0);

useEffect(() => {
  const fetchProducts = async () => {
    const response = await fetch("https://dummyjson.com/products?limit=5");
    const data: ProductsResponse = await response.json();
    setProducts(data);
    setProducts(data.products);
    setTotal(data.total);
  };

  fetchProducts();
}, []);
`}
          bad={[16]}
          good={[17, 18]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <ProductsDemo />
        </div>
      </div>
      <p className="callout">
        Before you write any of it, open the URL in the browser (or{" "}
        <code>console.log(data)</code> once) and look at the actual shape. Guessing costs more time
        than checking.
      </p>

      <h2>11. Pagination</h2>
      <p>
        Paging is the same dependency-array idea as the id switch, with arithmetic:{" "}
        <code>limit</code> is the page size and <code>skip</code> is how many to jump over.
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
const PAGE_SIZE = 5;
const [page, setPage] = useState(1);
const [products, setProducts] = useState<Product[]>([]);
const [total, setTotal] = useState(0);

useEffect(() => {
  const fetchPage = async () => {
    const skip = (page - 1) * PAGE_SIZE;
    const response = await fetch(
      \`https://dummyjson.com/products?limit=\${PAGE_SIZE}&skip=\${skip}\`,
    );
    const data: ProductsResponse = await response.json();
    setProducts(data.products);
    setTotal(data.total);
  };

  fetchPage();
}, [page]);

const lastPage = Math.ceil(total / PAGE_SIZE);

return (
  <>
    <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
      Prev
    </button>
    <span>
      Page {page} of {lastPage}
    </span>
    <button onClick={() => setPage((p) => p + 1)} disabled={page >= lastPage}>
      Next
    </button>
  </>
);
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <ProductsPaginationDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            Only <code>page</code> is state. <code>skip</code> and <code>lastPage</code> are
            calculated from it during render — put either in state and they go stale.
          </li>
          <li>
            <code>total</code> comes from the response, and it's what makes disabling "Next" on the
            last page possible.
          </li>
          <li>
            The buttons never fetch anything. They set <code>page</code>; the effect notices and does
            the work.
          </li>
          <li>
            "Load more" is the same code with one change: append instead of replace —{" "}
            <code>{"setProducts((prev) => [...prev, ...data.products])"}</code>.
          </li>
        </ul>
      </div>

      <h2>12. The other home for a fetch: an event handler</h2>
      <p>
        An effect answers "the component rendered, go get the data". A handler answers "the user did
        something, go get the data" — a search, a save, a retry. Nothing fetches until the click:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function HealthCheck() {
  const [status, setStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  async function handleCheck() {
    setIsChecking(true);
    const response = await fetch("https://dummyjson.com/test");
    const data: { status: string } = await response.json();
    setStatus(data.status);
    setIsChecking(false);
  }

  return (
    <div>
      <button onClick={handleCheck} disabled={isChecking}>
        {isChecking ? "Checking…" : "Check the API"}
      </button>
      {status && <p>API says: {status}</p>}
    </div>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <HealthCheckDemo />
        </div>
      </div>
      <p>
        A search form is the same thing on <code>onSubmit</code>: a controlled input for the query,{" "}
        <code>e.preventDefault()</code>, then fetch with the query in the URL:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const response = await fetch(
      \`https://dummyjson.com/products/search?q=\${encodeURIComponent(query)}&limit=5\`,
    );
    const data: ProductsResponse = await response.json();
    setResults(data.products);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit">Search</button>
      <ul>
        {results.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </form>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <ProductSearchDemo />
        </div>
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th>In a <code>useEffect</code></th>
            <th>In an event handler</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Triggered by</td>
            <td>a render being committed</td>
            <td>one specific user action</td>
          </tr>
          <tr>
            <td>Runs</td>
            <td>on mount, and whenever a dependency changes</td>
            <td>exactly once per click / submit</td>
          </tr>
          <tr>
            <td><code>async</code> allowed on the function itself</td>
            <td>no — define one inside and call it</td>
            <td>yes — <code>{"async function handleSubmit(e)"}</code></td>
          </tr>
          <tr>
            <td>Use it for</td>
            <td>data the page needs just to exist; re-syncing when an id or page changes</td>
            <td>searching, saving, deleting, retrying</td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        Ask which one caused the fetch. "The page opened" is an effect; "the user pressed Search" is a
        handler — don't route a click through a state change just to wake an effect up.
      </p>

      <hr className="section-divider" />

      <p className="section-label">Advanced</p>
      <p className="section-note">
        Past today's bare minimum — the habits that separate working effects from good ones.
      </p>

      <h2>13. You might not need an effect</h2>
      <p>
        The most common misuse of <code>useEffect</code> isn't a broken dependency array — it's using
        one at all for a value that could just be calculated while rendering. See{" "}
        <a href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noreferrer">
          You Might Not Need an Effect
        </a>{" "}
        in the React docs.
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function NameFormWithEffect() {
  const [first, setFirst] = useState("Ada");
  const [last, setLast] = useState("Lovelace");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(first + " " + last);
  }, [first, last]);

  return <p>{fullName}</p>;
}

function NameFormComputed() {
  const [first, setFirst] = useState("Ada");
  const [last, setLast] = useState("Lovelace");
  const fullName = first + " " + last;

  return <p>{fullName}</p>;
}
`}
          bad={[4, 6, 7, 8]}
          good={[16]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — type one letter and compare the render counts</p>
          <DerivedFullNameDemo />
        </div>
      </div>
      <p>Filtering and sorting a list is the same mistake at a larger size:</p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
const [todos, setTodos] = useState<Todo[]>([]);
const [query, setQuery] = useState("");

const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
useEffect(() => {
  setFilteredTodos(todos.filter((todo) => todo.title.includes(query)));
}, [todos, query]);

const [sortedTodos, setSortedTodos] = useState<Todo[]>([]);
useEffect(() => {
  setSortedTodos([...filteredTodos].sort((a, b) => a.title.localeCompare(b.title)));
}, [filteredTodos]);

const visible = todos
  .filter((todo) => todo.title.includes(query)) // .filter returns a new array,
  .sort((a, b) => a.title.localeCompare(b.title)); // so .sort mutates nothing shared
`}
          bad={[4, 5, 6, 7, 9, 10, 11, 12]}
          good={[14, 15, 16]}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — both are correct; only one needed an effect</p>
          <DerivedListDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <strong>The test:</strong> can this value be calculated from the state and props you
            already have? Then it isn't state, and it doesn't need an effect — calculate it during
            render.
          </li>
          <li>
            What the effect version costs: a second state to keep in sync, a dependency array to get
            right, two renders per change, and one render where the derived value is still the old
            one.
          </li>
          <li>
            It also goes wrong quietly. Add a second way to change <code>todos</code> and forget the
            dependency, and the list on screen no longer matches the list in state.
          </li>
          <li>
            <code>.sort()</code> mutates, so sort a copy: <code>{"[...filtered].sort(…)"}</code>.
            Sorting state in place is the same mutation bug from Day 7.
          </li>
          <li>
            Only reach for <code>useMemo</code> if that calculation is genuinely expensive and you've
            measured it. It's still computing during render — just cached.
          </li>
        </ul>
      </div>

      <h2>14. Race conditions</h2>
      <p>
        An effect that re-runs can have two requests in flight at once, and the network doesn't
        promise to answer in order. The later click can be overwritten by the earlier response:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Simulated delays — click user 1 then user 3 quickly</p>
          <RaceConditionDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            Each run of the effect gets its own <code>ignore</code> variable, because the effect
            function is called afresh every time.
          </li>
          <li>
            When <code>userId</code> changes, React runs the <em>previous</em> run's cleanup first —
            which sets that run's <code>ignore</code> to <code>true</code>.
          </li>
          <li>
            The old request still finishes; you can't un-send it. The flag just means nobody listens
            to the answer.
          </li>
          <li>
            This also covers unmount: a response arriving after the component is gone now sets no
            state.
          </li>
          <li>
            <code>AbortController</code> is the other way, and actually cancels the request:{" "}
            <code>{"const controller = new AbortController()"}</code>, pass{" "}
            <code>{"{ signal: controller.signal }"}</code> to <code>fetch</code>, and{" "}
            <code>controller.abort()</code> in the cleanup.
          </li>
        </ul>
      </div>

      <h2>15. Synchronizing with an external system</h2>
      <p>
        Data fetching is one case of the general job: keep something outside React lined up with a
        component that comes and goes. A DOM event listener is the smallest example:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <p>Window width: {width}px</p>;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered — drag the browser edge</p>
          <WindowSizeDemo />
        </div>
      </div>
      <p className="callout">
        Pass the <em>same function reference</em> to <code>removeEventListener</code> that you gave{" "}
        <code>addEventListener</code> — a fresh inline arrow in the cleanup removes nothing.
      </p>
      <p>
        A subscription to anything else — a WebSocket feed, a store, a browser API — is the identical
        shape. Subscribe in the effect, keep the unsubscribe it hands back, call it in the cleanup:
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function PriceTicker() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["BTC-USD"],
          channels: ["ticker"],
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.price) setPrice(Number(data.price));
    };

    // Without this the socket stays open after the component is gone
    return () => ws.close();
  }, []);

  return <h1>BTC: {price ?? "…"}</h1>;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">
            Rendered — a local stand-in feed with the same subscribe/unsubscribe API, so this page
            doesn't open a live exchange connection every time someone reads it
          </p>
          <SubscriptionDemo />
        </div>
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th>External system</th>
            <th>Set up in the effect</th>
            <th>Undo in the cleanup</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>a DOM event</td>
            <td><code>addEventListener</code></td>
            <td><code>removeEventListener</code></td>
          </tr>
          <tr>
            <td>a repeating timer</td>
            <td><code>setInterval</code></td>
            <td><code>clearInterval</code></td>
          </tr>
          <tr>
            <td>a delayed action</td>
            <td><code>setTimeout</code></td>
            <td><code>clearTimeout</code></td>
          </tr>
          <tr>
            <td>a live feed</td>
            <td><code>new WebSocket(…)</code></td>
            <td><code>ws.close()</code></td>
          </tr>
          <tr>
            <td>a third-party store</td>
            <td><code>store.subscribe(listener)</code></td>
            <td>the returned <code>unsubscribe()</code></td>
          </tr>
          <tr>
            <td>a network request</td>
            <td><code>fetch(url)</code></td>
            <td>an <code>ignore</code> flag, or <code>controller.abort()</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
