import { useState, useRef } from "react";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

function RenderCountDemo() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current += 1; // debug-only trick: a ref update during render doesn't affect output

  return (
    <div>
      <p>
        count: <strong>{count}</strong> — this component has rendered <strong>{renderCount.current}</strong> time(s)
      </p>
      <button onClick={() => setCount(count + 1)}>Increment</button>{" "}
      <button onClick={() => setCount(count)}>Set to same value</button>
    </div>
  );
}

function TagListDemo() {
  const [tags, setTags] = useState<string[]>(["react", "typescript"]);
  const [draft, setDraft] = useState("");

  function addTag() {
    if (!draft.trim()) return;
    setTags((prev) => [...prev, draft.trim()]); // add: spread
    setDraft("");
  }
  function removeTag(target: string) {
    setTags((prev) => prev.filter((t) => t !== target)); // delete: filter
  }

  return (
    <div>
      <div style={{ marginBottom: "0.6rem" }}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="new tag"
          style={{ padding: "0.3rem 0.5rem", marginRight: "0.4rem" }}
        />
        <button onClick={addTag}>Add tag</button>
      </div>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            display: "inline-block",
            background: "#eaf1fc",
            padding: "0.2rem 0.6rem",
            borderRadius: 999,
            marginRight: "0.4rem",
          }}
        >
          {tag} <button onClick={() => removeTag(tag)} style={{ marginLeft: "0.3rem" }}>×</button>
        </span>
      ))}
    </div>
  );
}

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 7 Notes</title>
      <DayNav day="day7-state-fundamentals" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 7 · Notes</p>
        <h1><En>State Fundamentals</En><Zh>State 基础</Zh></h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>执行摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一部分——执行摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心要点——今天结束时你必须能够做到的事情：</Zh></p>
        <ul>
          <li>
            <En>Declare state with <code>useState</code>: destructure the{" "}
            <code>[value, setValue]</code> pair, always pass an initial value</En>
            <Zh>用 <code>useState</code> 声明 state：解构 <code>[value, setValue]</code> 对，始终传入初始值</Zh>
          </li>
          <li>
            <En>Update through the setter — use <code>{"setX((prev) => ...)"}</code> whenever the next
            value depends on the current one</En>
            <Zh>通过 setter 更新——只要下一个值依赖当前值，就使用 <code>{"setX((prev) => ...)"}</code></Zh>
          </li>
          <li>
            <En>Rules of hooks: top level of a component only, never in an <code>if</code>, a loop, or
            after an early <code>return</code></En>
            <Zh>Hooks 规则：只能在组件的顶层调用，不能在 <code>if</code>、循环或提前 <code>return</code> 之后</Zh>
          </li>
          <li>
            <En>A component re-renders when its own state changes, or when its parent re-renders</En>
            <Zh>组件在自身 state 变化或父组件重新渲染时会重新渲染</Zh>
          </li>
          <li>
            <En>Update state of any shape: primitives directly, arrays and objects{" "}
            <strong>immutably</strong> with spread, <code>.filter</code>, <code>.map</code></En>
            <Zh>更新任意形态的 state：基本类型直接赋值，数组和对象需<strong>不可变地</strong>使用 spread、<code>.filter</code>、<code>.map</code> 更新</Zh>
          </li>
          <li>
            <En>Give <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code> a function, never
            a call: <code>onClick={"{handleSave}"}</code>, not <code>onClick={"{handleSave()}"}</code></En>
            <Zh>给 <code>onClick</code>、<code>onChange</code>、<code>onSubmit</code> 传函数引用，而不是调用结果：<code>onClick={"{handleSave}"}</code>，不是 <code>onClick={"{handleSave()}"}</code></Zh>
          </li>
        </ul>
        <p>
          <En>Want more? <a href="/week2/day7-state-fundamentals/concepts">View all concepts.</a></En>
          <Zh>想深入了解？<a href="/week2/day7-state-fundamentals/concepts">查看所有概念。</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二部分——完整讲解</Zh></h2>

      <h2><En>1. What state is, and <code>useState</code> basics</En><Zh>1. 什么是 state，以及 <code>useState</code> 基础</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>A component function re-runs top to bottom every time React renders it, so any ordinary
            variable inside it is rebuilt from scratch and forgotten.</En>
            <Zh>每次 React 渲染组件时，组件函数都会从头到尾重新执行，因此其中的普通变量每次都会重新创建并丢失。</Zh>
          </li>
          <li>
            <En><strong>State is the value React remembers for that component between renders</strong> —
            and the thing React watches, so changing it schedules a new render.</En>
            <Zh><strong>State 是 React 在两次渲染之间为该组件保留的值</strong>——也是 React 监听的对象，修改它会触发新一轮渲染。</Zh>
          </li>
          <li>
            <En><code>useState</code> returns exactly two things: the value <em>for this render</em>, and
            a setter. The setter is the only legal way to change it.</En>
            <Zh><code>useState</code> 恰好返回两个东西：<em>本次渲染</em>的值，以及 setter 函数。setter 是修改 state 的唯一合法方式。</Zh>
          </li>
        </ul>
      </div>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function Counter() {
  // a plain variable: back to 0 every render, and changing it renders nothing
  let plain = 0;

  // state: kept between renders, and setting it asks React to render again
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <RenderCountDemo />
        </div>
      </div>
      <p className="callout">
        <En>Click "Set to same value" above — the render count doesn't move. React compares the new state
        to the old one and skips the render when they're the same.</En>
        <Zh>点击上方的"Set to same value"——渲染次数不会增加。React 会将新 state 与旧 state 进行比较，相同时跳过渲染。</Zh>
      </p>

      <h2><En>2. The initial value — always give one</En><Zh>2. 初始值——始终提供</Zh></h2>
      <CodeBlock
        code={`
function Bad() {
  const [query, setQuery] = useState(); // undefined on the first render
  const [todos, setTodos] = useState(); // .map() crashes on the first render
}

function Good() {
  const [query, setQuery] = useState(""); // "" — empty, but still a string
  const [todos, setTodos] = useState<Todo[]>([]); // [] — .map() never crashes
}
`}
        bad={[2, 3]}
        good={[7, 8]}
      />
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>The initial value is used <strong>only on the very first render</strong>. On every render
            after that React hands back the stored value and ignores the argument entirely.</En>
            <Zh>初始值<strong>只在第一次渲染时使用</strong>。之后每次渲染，React 都会返回存储的值，完全忽略该参数。</Zh>
          </li>
          <li>
            <En>Start from an empty value <em>of the right shape</em> — <code>""</code>,{" "}
            <code>0</code>, <code>false</code>, <code>[]</code>, <code>null</code> — so the first
            render has something real to work with.</En>
            <Zh>从<em>正确形态</em>的空值开始——<code>""</code>、<code>0</code>、<code>false</code>、<code>[]</code>、<code>null</code>——让第一次渲染有真实可用的值。</Zh>
          </li>
          <li>
            <En>Skipping it makes the state <code>undefined</code>, which breaks two things at once: the
            first render (<code>undefined.map</code>, <code>undefined.length</code>) and TypeScript,
            which now infers the type as <code>undefined</code>.</En>
            <Zh>省略初始值会让 state 为 <code>undefined</code>，同时破坏两件事：第一次渲染（<code>undefined.map</code>、<code>undefined.length</code> 报错）以及 TypeScript 类型推断（推断为 <code>undefined</code>）。</Zh>
          </li>
          <li>
            <En>An input whose <code>value</code> starts as <code>undefined</code> starts{" "}
            <em>uncontrolled</em>, and React warns loudly the moment state turns it into a controlled
            one.</En>
            <Zh><code>value</code> 初始为 <code>undefined</code> 的 input 一开始处于<em>非受控</em>状态，一旦 state 将其变为受控，React 会发出明显警告。</Zh>
          </li>
          <li>
            <En>If computing the initial value is expensive, pass a function —{" "}
            <code>{"useState(() => buildBoard())"}</code> — so it runs once instead of on every
            render.</En>
            <Zh>如果计算初始值的开销较大，可以传入函数——<code>{"useState(() => buildBoard())"}</code>——这样它只会执行一次，而不是每次渲染都执行。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>3. Typing state: when you need a generic</En><Zh>3. 为 state 标注类型：何时需要泛型</Zh></h2>
      <CodeBlock
        code={`
type Priority = "low" | "medium" | "high";
type Todo = { id: string; title: string; priority: Priority };

// Let TypeScript infer — the initial value fully describes the type
const [title, setTitle] = useState(""); // string
const [count, setCount] = useState(0); // number
const [isOpen, setIsOpen] = useState(false); // boolean

// Give the generic — the initial value infers something too wide or too empty
const [priority, setPriority] = useState<Priority>("medium"); // else: string
const [todos, setTodos] = useState<Todo[]>([]); // else: never[]
const [selected, setSelected] = useState<Todo | null>(null); // else: null
`}
      />
      <p className="callout">
        <En>Rule of thumb: if the initial value can already hold every value the state will ever hold, let
        TS infer it. If the state will later hold something the initial value can't — another member
        of a union, items in an empty array, an object replacing <code>null</code> — write the
        generic.</En>
        <Zh>经验法则：如果初始值已经能涵盖 state 将来会持有的所有值，就让 TS 自动推断。如果 state 之后会持有初始值无法表达的类型——联合类型中的另一个成员、空数组中的元素、替换 <code>null</code> 的对象——就写明泛型。</Zh>
      </p>

      <h2><En>4. Rules of hooks</En><Zh>4. Hooks 规则</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>Call hooks only from a <strong>React component</strong> or another custom hook — never
            from a plain function, a class, or an event handler.</En>
            <Zh>只能在 <strong>React 组件</strong>或自定义 hook 中调用 hooks——不能在普通函数、类或事件处理函数中调用。</Zh>
          </li>
          <li>
            <En>Call them at the <strong>top level</strong> of that component: never inside an{" "}
            <code>if</code>, a loop, a nested function, or after an early <code>return</code>.</En>
            <Zh>必须在组件的<strong>顶层</strong>调用：不能在 <code>if</code>、循环、嵌套函数或提前 <code>return</code> 之后调用。</Zh>
          </li>
          <li>
            <En>Why: React matches each <code>useState</code> to its stored value by <em>call order</em>,
            not by name. Skip one call on some render and every hook after it lines up with the wrong
            slot.</En>
            <Zh>原因：React 按<em>调用顺序</em>而非名称将每个 <code>useState</code> 与其存储值对应。某次渲染跳过一个调用，其后的所有 hook 都会对应错误的槽位。</Zh>
          </li>
          <li>
            <En>So the number and order of hook calls must be identical on every single render — put the
            condition <em>inside</em> the hook's usage, not around the hook.</En>
            <Zh>因此每次渲染中 hook 的调用数量和顺序必须完全一致——把条件判断放在 hook 使用<em>内部</em>，而不是包裹在 hook 外面。</Zh>
          </li>
        </ul>
      </div>
      <CodeBlock
        code={`
function Panel({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) return null;
  const [tab, setTab] = useState("home"); // hook after an early return
  if (isOpen) {
    const [zoom, setZoom] = useState(1); // hook inside a condition
  }
  return <p>{tab}</p>;
}

function PanelFixed({ isOpen }: { isOpen: boolean }) {
  const [tab, setTab] = useState("home"); // every hook at the top level,
  const [zoom, setZoom] = useState(1); // in the same order on every render
  if (!isOpen) return null;
  return <p>{tab} at {zoom}x</p>;
}
`}
        bad={[3, 5]}
        good={[11, 12]}
      />

      <h2><En>5. What causes a re-render</En><Zh>5. 什么触发重新渲染</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En><strong>Its own state changed.</strong> A setter was called with a new value.</En>
            <Zh><strong>自身 state 变化。</strong>setter 被传入了新值并调用。</Zh>
          </li>
          <li>
            <En><strong>Its parent re-rendered.</strong> By default children re-render with the parent —
            whether or not the props they receive actually changed.</En>
            <Zh><strong>父组件重新渲染。</strong>默认情况下子组件会随父组件重新渲染——无论接收到的 props 是否真的发生变化。</Zh>
          </li>
          <li>
            <En>On every render the <em>entire function body</em> runs again, top to bottom — not just
            the JSX, every line.</En>
            <Zh>每次渲染时，<em>整个函数体</em>都会从头到尾重新执行——不只是 JSX，每一行都会执行。</Zh>
          </li>
          <li>
            <En>React skips the re-render when a setter is called with the same value as the current one
            (compared with <code>Object.is</code>) — that's why "Set to same value" above did
            nothing.</En>
            <Zh>当 setter 被传入与当前值相同的值时（用 <code>Object.is</code> 比较），React 会跳过重新渲染——这就是上面"Set to same value"不起作用的原因。</Zh>
          </li>
          <li>
            <En>Calling a setter during render (rather than from an event handler or an effect) renders
            again, which calls the setter again — an infinite loop.</En>
            <Zh>在渲染过程中（而非事件处理函数或 effect 中）调用 setter，会触发新的渲染，进而再次调用 setter——形成无限循环。</Zh>
          </li>
          <li>
            <En><code>React.memo</code> opts a component out of the parent-re-rendered rule: it skips the
            render when its props haven't changed. An optimization, not a default.</En>
            <Zh><code>React.memo</code> 让组件跳出父组件重新渲染的规则：props 未变化时跳过渲染。这是一种优化手段，不是默认行为。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>6. Queuing a series of state updates</En><Zh>6. 批量排队 state 更新</Zh></h2>
      <p>
        <En>A setter doesn't change the value on the spot — it schedules an update for the next render.
        The state variable in the handler you're already inside keeps the value it had for this
        render:</En>
        <Zh>setter 不会立即修改值——它为下一次渲染排队一个更新。你当前所在的处理函数中，state 变量保持的是本次渲染时的值：</Zh>
      </p>
      <CodeBlock
        code={`
function handleClickWrong() {
  setCount(count + 1); // both lines read the same count from this render
  setCount(count + 1); // net result: +1, not +2
}

function handleClickRight() {
  setCount((prev) => prev + 1); // prev is the latest queued value
  setCount((prev) => prev + 1); // net result: +2
}
`}
        bad={[2, 3]}
        good={[7, 8]}
      />
      <p className="callout">
        <En>Pass a function to the setter whenever the next value depends on the current one.</En>
        <Zh>只要下一个值依赖当前值，就向 setter 传入函数。</Zh>
      </p>

      <h2><En>7. Updating state, by data type</En><Zh>7. 按数据类型更新 state</Zh></h2>
      <p><En>Primitives are the easy case — hand the setter the new value:</En><Zh>基本类型是简单情况——直接把新值传给 setter：</Zh></p>
      <CodeBlock
        code={`
setTitle("Ship the login form");
setCount(count + 1);
setIsOpen(!isOpen);
`}
      />
      <p>
        <En>Arrays and objects are the case people get wrong. React compares state <strong>by
        reference</strong>, so changing an array/object in place and setting it again looks like "no
        change" — no re-render. Build a new one instead:</En>
        <Zh>数组和对象是常见的错误场景。React <strong>按引用</strong>比较 state，因此原地修改数组/对象后再 set，看起来"没有变化"——不会触发重新渲染。应该构建新的值：</Zh>
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
tags.push(newTag); setTags(tags); // mutates: same reference
tags.sort(); setTags(tags); // same problem

setTags((prev) => [...prev, newTag]); // add
setTags((prev) => prev.filter((t) => t !== target)); // remove
setTodos((prev) =>
  prev.map((t) => (t.id === id ? { ...t, done: true } : t)), // update one
);
`}
          bad={[1, 2]}
          good={[4, 5]}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <TagListDemo />
        </div>
      </div>
      <p><En>Objects follow the same rule — spread the old one, then override the fields you're changing:</En><Zh>对象遵循相同规则——spread 旧对象，再覆盖要修改的字段：</Zh></p>
      <CodeBlock
        code={`
const [user, setUser] = useState({ name: "Ana", address: { city: "Lima" } });

user.name = "Bea"; setUser(user); // same object — React skips the re-render
setUser((prev) => ({ ...prev, name: "Bea" })); // new object

// nested: spread every level you touch
setUser((prev) => ({ ...prev, address: { ...prev.address, city: "Cusco" } }));
`}
        bad={[3]}
        good={[4, 7]}
      />
      <p className="callout">
        <En>Spread copies one level. To change something nested, spread every level on the way down — or
        keep state flat enough that you never have to.</En>
        <Zh>Spread 只复制一层。要修改嵌套的内容，需要逐层 spread——或者保持 state 足够扁平，从根本上避免这个问题。</Zh>
      </p>

      <h2><En>8. Derived &amp; unnecessary state</En><Zh>8. 派生 state 与多余 state</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>If a value can be computed from state/props you already have, it doesn't need its own{" "}
            <code>useState</code> — compute it directly during render instead.</En>
            <Zh>如果一个值可以从已有的 state/props 计算得出，就不需要单独的 <code>useState</code>——直接在渲染时计算即可。</Zh>
          </li>
          <li>
            <En>A second state variable that mirrors the first is <strong>redundant state</strong>:
            nothing forces it to stay in sync, so every place that changes the original now also
            has to remember to update the copy — and eventually one of them won't.</En>
            <Zh>与第一个 state 镜像的第二个 state 变量是<strong>多余 state</strong>：没有任何机制强制它们保持同步，因此每处修改原始值的地方都必须记得同步更新副本——最终必然有遗漏。</Zh>
          </li>
          <li>
            <En>The fix is almost always <em>deletion</em>: remove the state variable, replace every
            read of it with the plain expression that computes it.</En>
            <Zh>解决方法几乎总是<em>删除</em>：移除那个 state 变量，将所有读取它的地方替换为直接计算的表达式。</Zh>
          </li>
        </ul>
      </div>
      <CodeBlock
        code={`
function Bad() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState(""); // duplicates the two above

  function handleFirstNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(e.target.value);
    setFullName(e.target.value + " " + lastName); // easy to forget, easy to get wrong
  }

  function handleLastNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLastName(e.target.value);
    setFullName(firstName + " " + e.target.value);
  }

  return <p>Ticket for: {fullName}</p>;
}

function Good() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fullName = firstName + " " + lastName; // computed every render, never out of sync

  return <p>Ticket for: {fullName}</p>;
}
`}
        bad={[4, 8, 13]}
        good={[22]}
      />
      <p className="callout">
        <En><code>Good</code> doesn't need <code>handleFirstNameChange</code>/
        <code>handleLastNameChange</code> at all — a plain{" "}
        <code>{"onChange={(e) => setFirstName(e.target.value)}"}</code> is enough once there's no
        second state variable to keep updated alongside it.</En>
        <Zh><code>Good</code> 根本不需要 <code>handleFirstNameChange</code>/<code>handleLastNameChange</code>——一旦没有需要同步更新的第二个 state 变量，直接写 <code>{"onChange={(e) => setFirstName(e.target.value)}"}</code> 就够了。</Zh>
      </p>

      <h2><En>9. Event handlers</En><Zh>9. 事件处理函数</Zh></h2>
      <p>
        <En>Same rule as passing a function as a prop on Day 6, because that's exactly what this is:{" "}
        <code>onClick</code> is a prop, and it wants a <strong>function</strong>, not the result of
        calling one. <strong>No parentheses.</strong></En>
        <Zh>与第 6 天将函数作为 prop 传递的规则相同，因为本质上就是如此：<code>onClick</code> 是一个 prop，它需要的是<strong>函数</strong>，而不是函数调用的返回值。<strong>不要加括号。</strong></Zh>
      </p>
      <CodeBlock
        code={`
type TodoRowProps = { todo: Todo; onDelete: (id: string) => void };

function TodoRow({ todo, onDelete }: TodoRowProps) {
  function handleDelete() {
    onDelete(todo.id);
  }

  return (
    <>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={handleDelete()}>Delete</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </>
  );
}
`}
        good={[10, 12]}
        bad={[11]}
      />
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En><code>{"onClick={handleDelete}"}</code> — a reference. React holds onto it and calls it
            when the click happens.</En>
            <Zh><code>{"onClick={handleDelete}"}</code>——函数引用。React 保存它，并在点击时调用。</Zh>
          </li>
          <li>
            <En><code>{"onClick={handleDelete()}"}</code> — a call. It runs <em>during render</em> and
            hands <code>onClick</code> the return value (usually <code>undefined</code>), so clicking
            does nothing. If the handler sets state, that's an infinite render loop.</En>
            <Zh><code>{"onClick={handleDelete()}"}</code>——函数调用。它在<em>渲染时</em>执行，并将返回值（通常是 <code>undefined</code>）传给 <code>onClick</code>，因此点击什么都不会发生。若该处理函数会设置 state，则会产生无限渲染循环。</Zh>
          </li>
          <li>
            <En><code>{"onClick={() => onDelete(todo.id)}"}</code> — an inline arrow. Still a function
            value, just written at the call site. Use it to pass an argument, or for a one-line body.</En>
            <Zh><code>{"onClick={() => onDelete(todo.id)}"}</code>——内联箭头函数。仍然是函数值，只是写在调用处。需要传参或函数体只有一行时使用。</Zh>
          </li>
          <li>
            <En>The same three shapes apply to every event prop — <code>onChange</code>,{" "}
            <code>onSubmit</code>, <code>onKeyDown</code> — and to handlers you pass down to your own
            components.</En>
            <Zh>这三种写法同样适用于所有事件 prop——<code>onChange</code>、<code>onSubmit</code>、<code>onKeyDown</code>——以及传递给自定义组件的处理函数。</Zh>
          </li>
        </ul>
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th><En>Event</En><Zh>事件</Zh></th>
            <th><En>Fires when</En><Zh>触发时机</Zh></th>
            <th><En>Handler parameter</En><Zh>处理函数参数</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>onClick</code></td>
            <td><En>the element is clicked</En><Zh>元素被点击时</Zh></td>
            <td><code>React.MouseEvent</code></td>
          </tr>
          <tr>
            <td><code>onChange</code></td>
            <td><En>an input/select/textarea value changes — every keystroke</En><Zh>input/select/textarea 的值变化时——每次按键</Zh></td>
            <td><En><code>{"React.ChangeEvent<HTMLInputElement>"}</code> — read <code>e.target.value</code></En><Zh><code>{"React.ChangeEvent<HTMLInputElement>"}</code>——读取 <code>e.target.value</code></Zh></td>
          </tr>
          <tr>
            <td><code>onSubmit</code></td>
            <td><En>a form is submitted, by button or by Enter</En><Zh>表单提交时——点击按钮或按 Enter</Zh></td>
            <td><En><code>React.FormEvent</code> — start with <code>e.preventDefault()</code></En><Zh><code>React.FormEvent</code>——先调用 <code>e.preventDefault()</code></Zh></td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        code={`
function SignupForm() {
  const [email, setEmail] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("submitting", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={handleChange} />
      <button type="submit">Sign up</button>
    </form>
  );
}
`}
      />
    </div>
  );
}
