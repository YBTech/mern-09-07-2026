import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";
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
        <h1><En>Side Effects &amp; Data Fetching</En><Zh>副作用与数据请求</Zh></h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心要点 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一部分——核心要点</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心内容——今天结束时你必须能做到的事：</Zh></p>
        <ul>
          <li>
            <En>Fetch data in a <code>useEffect</code> and render the response: state starting at{" "}
            <code>[]</code>, an <code>async</code> function defined inside the effect and called,{" "}
            <code>setTodos(data)</code> with the result, <code>.map</code> with a stable{" "}
            <code>key</code> in the JSX</En>
            <Zh>在 <code>useEffect</code> 中请求数据并渲染响应：初始 state 为 <code>[]</code>，在 effect 内定义并调用 <code>async</code> 函数，用结果调用 <code>setTodos(data)</code>，JSX 中用稳定的 <code>key</code> 渲染 <code>.map</code></Zh>
          </li>
          <li>
            <En>Call <code>useEffect(callback, dependencies)</code> with both arguments, at the top level
            of a component — never inside an <code>if</code>, a loop, or after an early{" "}
            <code>return</code></En>
            <Zh>在组件顶层调用 <code>useEffect(callback, dependencies)</code>，传入两个参数——不能在 <code>if</code>、循环或提前 <code>return</code> 之后调用</Zh>
          </li>
          <li>
            <En>Say what each dependency array means and which lifecycle moment it maps to:{" "}
            <code>[]</code> is mount only, <code>[id]</code> is mount plus every change to{" "}
            <code>id</code>, no array at all is after every single render</En>
            <Zh>说清每种依赖数组的含义及对应的生命周期时机：<code>[]</code> 仅在挂载时执行，<code>[id]</code> 在挂载及 <code>id</code> 每次变化时执行，不传数组则每次渲染后都执行</Zh>
          </li>
          <li>
            <En>Return a cleanup function from an effect to undo what it started, and know when React
            calls it — before the effect's next run, and on unmount</En>
            <Zh>从 effect 返回清理函数以撤销其启动的操作，并了解 React 何时调用它——在 effect 下次运行之前，以及组件卸载时</Zh>
          </li>
        </ul>
        <p>
          <En>Want more?{" "}
          <a href="/week2/day9-side-effects-data-fetching/concepts">View all concepts.</a></En>
          <Zh>想了解更多？<a href="/week2/day9-side-effects-data-fetching/concepts">查看所有概念。</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二部分——完整讲解</Zh></h2>

      <h2><En>1. Rendering is pure; side effects are everything else</En><Zh>1. 渲染是纯粹的；副作用是其余一切</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>A component is a function whose only job is <strong>to calculate JSX from its props and
            state</strong>. Same inputs in, same JSX out, every time.</En>
            <Zh>组件只有一个职责：<strong>根据 props 和 state 计算 JSX</strong>。输入相同，输出相同，每次都一样。</Zh>
          </li>
          <li>
            <En>So the render must touch nothing outside itself: no writing to variables declared outside
            the component, no mutating props or existing state, no{" "}
            <code>document.title = …</code>, no <code>localStorage</code>, no{" "}
            <code>fetch</code>.</En>
            <Zh>因此，渲染过程不能触碰外部任何东西：不写组件外部声明的变量，不修改 props 或已有 state，不写 <code>document.title = …</code>，不用 <code>localStorage</code>，不发 <code>fetch</code>。</Zh>
          </li>
          <li>
            <En><strong>A side effect is any of those</strong> — work that reaches outside the component
            and changes something, or depends on something React doesn't control.</En>
            <Zh><strong>副作用就是上述这些操作</strong>——触及组件外部并改变某些东西，或依赖 React 无法控制的东西。</Zh>
          </li>
          <li>
            <En>React leans on purity: it renders whenever it likes, twice in development, and may throw a
            render away unused. An impure render gives a different answer each time it's run, so the
            output depends on <em>how many times</em> React happened to render — which you don't
            control.</En>
            <Zh>React 依赖纯粹性：它随时可能渲染，开发模式下会渲染两次，还可能丢弃未使用的渲染结果。不纯的渲染每次运行结果不同，输出取决于 React 恰好渲染了<em>多少次</em>——而这不在你的控制之内。</Zh>
          </li>
          <li>
            <En>Side effects get two legal homes: an <strong>event handler</strong> (caused by a user
            action) or a <strong><code>useEffect</code></strong> (caused by a render being committed).</En>
            <Zh>副作用有两个合法的位置：<strong>事件处理函数</strong>（由用户操作触发）或 <strong><code>useEffect</code></strong>（由渲染提交触发）。</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <PurityDemo />
        </div>
      </div>

      <h2><En>2. <code>useEffect</code>: two arguments, and when each part runs</En><Zh>2. <code>useEffect</code>：两个参数及各部分的执行时机</Zh></h2>
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
        <En>The first argument is a function, not a call: <code>{"useEffect(() => { … }, [])"}</code>, the
        same "pass a function, don't call it" rule as <code>onClick</code>.</En>
        <Zh>第一个参数是函数本身，不是调用：<code>{"useEffect(() => { … }, [])"}</code>，和 <code>onClick</code> 一样——传入函数，不要调用它。</Zh>
      </p>
      <p>
        <En>Rules of hooks apply here exactly as they did to <code>useState</code> — top level of a
        component, same number of calls in the same order on every render. Put the condition{" "}
        <em>inside</em> the effect:</En>
        <Zh>Hook 规则同样适用于此，与 <code>useState</code> 完全一致——在组件顶层调用，每次渲染调用数量和顺序相同。将条件判断放在 effect <em>内部</em>：</Zh>
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

      <h2><En>3. The dependency array, and the three lifecycle moments</En><Zh>3. 依赖数组与三个生命周期时机</Zh></h2>
      <table className="ref-table">
        <thead>
          <tr>
            <th><En>What you write</En><Zh>写法</Zh></th>
            <th><En>When the effect runs</En><Zh>effect 执行时机</Zh></th>
            <th><En>Lifecycle moment</En><Zh>生命周期时机</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>{"useEffect(fn)"}</code> — <En>no array</En><Zh>不传数组</Zh></td>
            <td><En>after every single render</En><Zh>每次渲染后</Zh></td>
            <td><En>mount <em>and</em> every update — almost always a mistake</En><Zh>挂载<em>及</em>每次更新——几乎总是错误用法</Zh></td>
          </tr>
          <tr>
            <td><code>{"useEffect(fn, [])"}</code></td>
            <td><En>once, after the first render</En><Zh>首次渲染后执行一次</Zh></td>
            <td><En><strong>mount</strong> (and its cleanup on <strong>unmount</strong>)</En><Zh><strong>挂载</strong>（清理函数在<strong>卸载</strong>时执行）</Zh></td>
          </tr>
          <tr>
            <td><code>{"useEffect(fn, [id])"}</code></td>
            <td><En>after the first render, then after any render where <code>id</code> changed</En><Zh>首次渲染后，以及 <code>id</code> 变化的每次渲染后</Zh></td>
            <td><En>mount + the <strong>updates</strong> that actually changed <code>id</code></En><Zh>挂载 + 真正改变了 <code>id</code> 的<strong>更新</strong></Zh></td>
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
          <p className="demo-result-label"><En>Rendered — watch the log as you use each control</En><Zh>渲染结果——操作控件时观察日志</Zh></p>
          <LifecycleDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>Every effect runs at least once, after the first render — the array only controls whether
            it runs <em>again</em>.</En>
            <Zh>每个 effect 至少执行一次（首次渲染后）——依赖数组只控制它是否<em>再次</em>执行。</Zh>
          </li>
          <li>
            <En>Typing in the unrelated input above re-renders the child and runs <strong>no</strong>{" "}
            effect. A render is not an effect; only a changed dependency is.</En>
            <Zh>在无关输入框中输入会触发子组件重新渲染，但<strong>不会</strong>运行任何 effect。渲染不是 effect；只有依赖变化才是。</Zh>
          </li>
          <li>
            <En>"Changed" means compared with <code>Object.is</code>, item by item. A dependency that is a
            new object, array or function built during render counts as changed every time.</En>
            <Zh>"变化"是指用 <code>Object.is</code> 逐项比较。每次渲染时新建的对象、数组或函数作为依赖，每次都算"已变化"。</Zh>
          </li>
          <li>
            <En>In development <code>React.StrictMode</code> mounts, unmounts and remounts every
            component once, so a <code>[]</code> effect appears to run twice. That is deliberate — it
            proves your cleanup works — and does not happen in production.</En>
            <Zh>开发模式下，<code>React.StrictMode</code> 会将每个组件挂载、卸载再重新挂载一次，因此 <code>[]</code> effect 看起来执行了两次。这是故意的——用于验证清理函数是否正常工作——生产环境不会如此。</Zh>
          </li>
        </ul>
      </div>
      <p>
        <En>Leaving the array off while the effect sets state is the classic infinite loop: the effect
        renders, the render runs the effect, forever.</En>
        <Zh>不传依赖数组而 effect 又调用了 setState，是经典的无限循环：effect 触发渲染，渲染再触发 effect，无穷无尽。</Zh>
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
          <p className="demo-result-label"><En>Rendered — real loop, capped at 20 so the page survives</En><Zh>渲染结果——真实循环，上限 20 次以防页面崩溃</Zh></p>
          <NoDepsLoopDemo />
        </div>
      </div>

      <h2><En>4. Cleanup functions</En><Zh>4. 清理函数</Zh></h2>
      <p>
        <En>If the effect <em>started</em> something that outlives the render — a timer, a listener, a
        subscription, an open connection — the cleanup is what stops it:</En>
        <Zh>如果 effect <em>启动</em>了某个比渲染生命周期更长的东西——定时器、监听器、订阅、打开的连接——清理函数负责停止它：</Zh>
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
          <p className="demo-result-label"><En>Rendered — untick the box and start/pause a few times</En><Zh>渲染结果——取消勾选并多次点击开始/暂停</Zh></p>
          <CleanupTimerDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>React calls the cleanup at two moments: <strong>before re-running the effect</strong>{" "}
            (because a dependency changed) and <strong>when the component unmounts</strong>.</En>
            <Zh>React 在两个时机调用清理函数：<strong>effect 再次运行之前</strong>（因依赖变化）以及<strong>组件卸载时</strong>。</Zh>
          </li>
          <li>
            <En>So the pair reads as one sentence: the effect sets something up, the cleanup undoes{" "}
            <em>that same</em> setup — <code>addEventListener</code> /{" "}
            <code>removeEventListener</code>, <code>setInterval</code> / <code>clearInterval</code>,{" "}
            <code>subscribe</code> / <code>unsubscribe</code>.</En>
            <Zh>effect 和清理函数构成一对：effect 建立某个东西，清理函数撤销<em>同一个</em>操作——<code>addEventListener</code> / <code>removeEventListener</code>，<code>setInterval</code> / <code>clearInterval</code>，<code>subscribe</code> / <code>unsubscribe</code>。</Zh>
          </li>
          <li>
            <En>The cleanup closes over the variables of the render it belongs to, which is why{" "}
            <code>clearInterval(id)</code> clears the right timer and not a newer one.</En>
            <Zh>清理函数闭包捕获的是它所属渲染的变量，这就是为什么 <code>clearInterval(id)</code> 清除的是正确的定时器而非更新的那个。</Zh>
          </li>
          <li>
            <En>Skip it and nothing errors — the leak is silent. Each re-run stacks another timer or
            listener on top of the last.</En>
            <Zh>省略清理函数不会报错——泄漏是无声的。每次重新执行都会在上一个之上再堆一个定时器或监听器。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>5. The pattern you must know: fetch on mount, render the response</En><Zh>5. 必须掌握的模式：挂载时请求，渲染响应</Zh></h2>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <FetchTodosDemo />
        </div>
      </div>
      <p><En>Read it in the order it actually happens:</En><Zh>按实际发生顺序理解：</Zh></p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>#</th>
            <th><En>What happens</En><Zh>发生了什么</Zh></th>
            <th><En>What's on screen</En><Zh>屏幕显示</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><En>First render runs. <code>todos</code> is the initial <code>[]</code>.</En><Zh>首次渲染执行，<code>todos</code> 为初始值 <code>[]</code>。</Zh></td>
            <td><En>the heading, and an empty list</En><Zh>标题和空列表</Zh></td>
          </tr>
          <tr>
            <td>2</td>
            <td><En>React commits that render, then runs the effect, which calls <code>fetchTodos()</code>.</En><Zh>React 提交该渲染，然后运行 effect，调用 <code>fetchTodos()</code>。</Zh></td>
            <td><En>unchanged — the request is in flight</En><Zh>不变——请求正在进行中</Zh></td>
          </tr>
          <tr>
            <td>3</td>
            <td><En>The response arrives; <code>setTodos(data)</code> schedules a re-render.</En><Zh>响应到达，<code>setTodos(data)</code> 安排重新渲染。</Zh></td>
            <td><En>unchanged for one more moment</En><Zh>暂时不变</Zh></td>
          </tr>
          <tr>
            <td>4</td>
            <td><En>Second render runs with the real array.</En><Zh>第二次渲染使用真实数组执行。</Zh></td>
            <td><En>eight todos</En><Zh>八条 todo</Zh></td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        <En>Your component always renders <em>before</em> the data exists — so the initial state has to be
        something the JSX can already render.</En>
        <Zh>组件总是在数据存在<em>之前</em>就已渲染——所以初始 state 必须是 JSX 已经能渲染的东西。</Zh>
      </p>
      <p>
        <En>One shape question comes up every time: why define an <code>async</code> function inside and
        call it, rather than making the effect itself <code>async</code>?</En>
        <Zh>这里有个常见问题：为什么要在 effect 内定义 <code>async</code> 函数再调用，而不是直接把 effect 本身写成 <code>async</code>？</Zh>
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

      <h2><En>6. Four ways people break that fetch</En><Zh>6. 四种常见的请求错误</Zh></h2>
      <p>
        <En><strong>a. Fetching, then never calling the setter.</strong> The request succeeds, the console
        is clean, and the page stays empty:</En>
        <Zh><strong>a. 请求成功但忘记调用 setter。</strong>请求成功，控制台无报错，页面却一直空白：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <ForgotSetStateDemo />
        </div>
      </div>

      <p>
        <En><strong>b. No initial value, or the wrong shape.</strong>{" "}
        <code>useState()</code> leaves the state <code>undefined</code> on the first render — the one
        render that is guaranteed to happen before the data arrives:</En>
        <Zh><strong>b. 没有初始值，或初始值类型错误。</strong><code>useState()</code> 会使 state 在首次渲染时为 <code>undefined</code>——而这次渲染必然在数据到达之前发生：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <UndefinedMapDemo />
        </div>
      </div>

      <p>
        <En><strong>c. No <code>key</code>, or the index as the key.</strong> A missing key is a console
        warning; an index key is a real bug, because it tells React "the thing at position 0" instead
        of "this todo":</En>
        <Zh><strong>c. 没有 <code>key</code>，或用 index 作为 key。</strong>缺少 key 是控制台警告；用 index 作为 key 是真正的 bug，因为它告诉 React "位置 0 的元素"而不是"这条 todo"：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <KeyIdentityDemo />
        </div>
      </div>
      <p className="callout">
        <En>Use the id the API already gave you. Index keys are only safe for a list that never reorders,
        never filters and never deletes.</En>
        <Zh>使用 API 已提供的 id。只有永远不会重排、不会过滤、不会删除的列表，index 作为 key 才是安全的。</Zh>
      </p>

      <p>
        <En><strong>d. Calling <code>fetch</code> in the component body.</strong> This is the one beginners
        reach for first, and it's both impure and an infinite loop:</En>
        <Zh><strong>d. 在组件函数体中直接调用 <code>fetch</code>。</strong>这是初学者最容易犯的错，它既不纯粹又会造成无限循环：</Zh>
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
          <p className="demo-result-label"><En>Simulated — the real thing crashes the page</En><Zh>模拟效果——真实情况会导致页面崩溃</Zh></p>
          <FetchInBodyLoopDemo />
        </div>
      </div>
      <p className="callout">
        <En>The same goes for an event handler that doesn't exist yet: don't wrap the fetch in{" "}
        <code>{"if (todos.length === 0)"}</code> to stop the loop. The loop isn't the problem — doing
        the work during render is.</En>
        <Zh>同理，不要用 <code>{"if (todos.length === 0)"}</code> 来阻止循环。循环不是问题所在——在渲染阶段执行副作用才是。</Zh>
      </p>

      <h2><En>7. Loading and error states</En><Zh>7. 加载状态与错误状态</Zh></h2>
      <p>
        <En>A fetch has three outcomes, so the component needs three states and has to render whichever
        one it's in:</En>
        <Zh>一次请求有三种结果，因此组件需要三个 state，并根据当前所处状态进行渲染：</Zh>
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
          <p className="demo-result-label"><En>Rendered — switch the URL to a broken one</En><Zh>渲染结果——将 URL 切换为一个无效地址</Zh></p>
          <TodosWithStatusDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En><code>isLoading</code> starts at <code>true</code>, not <code>false</code> — the first
            render already has a request coming.</En>
            <Zh><code>isLoading</code> 初始值为 <code>true</code> 而非 <code>false</code>——首次渲染时请求已经在途中了。</Zh>
          </li>
          <li>
            <En><strong><code>fetch</code> only rejects when the request never happened</strong> — no
            network, bad host, DNS failure. A 404 or a 500 is a <em>successful</em> request with a sad
            status, so <code>catch</code> never sees it. Check <code>response.ok</code> and throw
            yourself.</En>
            <Zh><strong><code>fetch</code> 只在请求根本没有发出时才 reject</strong>——无网络、主机错误、DNS 失败。404 或 500 是<em>成功</em>的请求，只是状态码不好，<code>catch</code> 捕获不到。需要自己检查 <code>response.ok</code> 并手动抛出错误。</Zh>
          </li>
          <li>
            <En><code>setIsLoading(false)</code> goes in <code>finally</code>, so it runs on both paths —
            forget it in the error branch and the spinner never goes away.</En>
            <Zh><code>setIsLoading(false)</code> 放在 <code>finally</code> 中，两条路径都会执行——如果只写在成功分支里，错误时加载动画永远不会消失。</Zh>
          </li>
          <li>
            <En>Reset <code>error</code> to <code>null</code> at the top of each attempt, or a retry that
            succeeds still shows the old error.</En>
            <Zh>每次尝试开始时将 <code>error</code> 重置为 <code>null</code>，否则重试成功后仍会显示旧的错误信息。</Zh>
          </li>
          <li>
            <En>Render them in order: loading first, then error, then the data. Each one{" "}
            <code>return</code>s, so the JSX below never has to ask "but what if it failed?"</En>
            <Zh>按顺序渲染：先 loading，再 error，最后 data。每个分支都 <code>return</code>，后面的 JSX 就无需再判断"如果失败了怎么办"。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>8. Fetching one object instead of a list</En><Zh>8. 请求单个对象而非列表</Zh></h2>
      <p>
        <En>There's no empty object worth rendering, so the initial state is <code>null</code> — and{" "}
        <code>null</code> has to be ruled out before the JSX touches a field:</En>
        <Zh>没有值得渲染的空对象，因此初始 state 为 <code>null</code>——JSX 访问字段之前必须先排除 <code>null</code>：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
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
        <En>The union <code>{"Todo | null"}</code> is doing you a favour: the red squiggle is TypeScript
        pointing at the exact render where the data isn't there yet.</En>
        <Zh><code>{"Todo | null"}</code> 联合类型是在帮你：红色波浪线正是 TypeScript 在指出数据尚未到达的那次渲染。</Zh>
      </p>

      <h2><En>9. Re-fetching when the id changes</En><Zh>9. id 变化时重新请求</Zh></h2>
      <p>
        <En>Put the id in state, build the URL from it, and list it as a dependency. That's the whole
        mechanism — no refresh button, no second effect:</En>
        <Zh>将 id 放入 state，根据它构建 URL，并将其列为依赖。这就是全部机制——不需要刷新按钮，不需要第二个 effect：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <TodoByIdDemo />
        </div>
      </div>
      <p className="callout">
        <En>Forget <code>todoId</code> in the array and the page fetches todo 1 forever, however many
        times you click — the most common "my data won't update" bug there is.</En>
        <Zh>依赖数组中漏写 <code>todoId</code>，无论点击多少次，页面始终请求 todo 1——这是"数据不更新"最常见的 bug。</Zh>
      </p>

      <h2><En>10. When the response isn't the array you wanted</En><Zh>10. 当响应不是你想要的数组时</Zh></h2>
      <p>
        <En>Most real APIs wrap the list in an object with paging information around it.{" "}
        <code>https://dummyjson.com/products?limit=5</code> answers with:</En>
        <Zh>大多数真实 API 会将列表包裹在一个带分页信息的对象中。<code>https://dummyjson.com/products?limit=5</code> 的响应格式如下：</Zh>
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
        <En>So type the envelope, not just the item, and reach into it when you set state — the most
        common version of this bug is <code>setProducts(data)</code> followed by{" "}
        <code>data.map is not a function</code>:</En>
        <Zh>因此要为外层对象定义类型，而不仅仅是列表项，并在设置 state 时取出内层数据——这个 bug 最常见的表现是 <code>setProducts(data)</code> 之后报 <code>data.map is not a function</code>：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <ProductsDemo />
        </div>
      </div>
      <p className="callout">
        <En>Before you write any of it, open the URL in the browser (or{" "}
        <code>console.log(data)</code> once) and look at the actual shape. Guessing costs more time
        than checking.</En>
        <Zh>动手写代码之前，先在浏览器中打开 URL（或 <code>console.log(data)</code> 一次）查看实际数据结构。猜测比查看浪费更多时间。</Zh>
      </p>

      <h2><En>11. Pagination</En><Zh>11. 分页</Zh></h2>
      <p>
        <En>Paging is the same dependency-array idea as the id switch, with arithmetic:{" "}
        <code>limit</code> is the page size and <code>skip</code> is how many to jump over.</En>
        <Zh>分页与切换 id 的思路相同，只是加上了计算：<code>limit</code> 是每页条数，<code>skip</code> 是跳过的条数。</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <ProductsPaginationDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>Only <code>page</code> is state. <code>skip</code> and <code>lastPage</code> are
            calculated from it during render — put either in state and they go stale.</En>
            <Zh>只有 <code>page</code> 是 state。<code>skip</code> 和 <code>lastPage</code> 在渲染时由它计算得出——如果把它们放入 state，就会产生过期数据。</Zh>
          </li>
          <li>
            <En><code>total</code> comes from the response, and it's what makes disabling "Next" on the
            last page possible.</En>
            <Zh><code>total</code> 来自响应数据，正是它让"在最后一页禁用 Next 按钮"成为可能。</Zh>
          </li>
          <li>
            <En>The buttons never fetch anything. They set <code>page</code>; the effect notices and does
            the work.</En>
            <Zh>按钮本身不发起任何请求。它们设置 <code>page</code>；effect 检测到变化后执行实际工作。</Zh>
          </li>
          <li>
            <En>"Load more" is the same code with one change: append instead of replace —{" "}
            <code>{"setProducts((prev) => [...prev, ...data.products])"}</code>.</En>
            <Zh>"加载更多"是同样的代码，只改一处：追加而非替换——<code>{"setProducts((prev) => [...prev, ...data.products])"}</code>。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>12. The other home for a fetch: an event handler</En><Zh>12. 请求的另一个位置：事件处理函数</Zh></h2>
      <p>
        <En>An effect answers "the component rendered, go get the data". A handler answers "the user did
        something, go get the data" — a search, a save, a retry. Nothing fetches until the click:</En>
        <Zh>effect 回答的是"组件渲染了，去取数据"。处理函数回答的是"用户做了某个操作，去取数据"——搜索、保存、重试。点击之前不会发起任何请求：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <HealthCheckDemo />
        </div>
      </div>
      <p>
        <En>A search form is the same thing on <code>onSubmit</code>: a controlled input for the query,{" "}
        <code>e.preventDefault()</code>, then fetch with the query in the URL:</En>
        <Zh>搜索表单是同样的模式，触发在 <code>onSubmit</code> 上：一个受控输入框接收查询词，<code>e.preventDefault()</code>，然后将查询词拼入 URL 发起请求：</Zh>
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
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染结果</Zh></p>
          <ProductSearchDemo />
        </div>
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th><En>In a <code>useEffect</code></En><Zh>在 <code>useEffect</code> 中</Zh></th>
            <th><En>In an event handler</En><Zh>在事件处理函数中</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><En>Triggered by</En><Zh>触发时机</Zh></td>
            <td><En>a render being committed</En><Zh>一次渲染提交</Zh></td>
            <td><En>one specific user action</En><Zh>某个特定用户操作</Zh></td>
          </tr>
          <tr>
            <td><En>Runs</En><Zh>执行</Zh></td>
            <td><En>on mount, and whenever a dependency changes</En><Zh>挂载时，以及每次依赖变化时</Zh></td>
            <td><En>exactly once per click / submit</En><Zh>每次点击/提交恰好执行一次</Zh></td>
          </tr>
          <tr>
            <td><En><code>async</code> allowed on the function itself</En><Zh>函数本身可以是 <code>async</code></Zh></td>
            <td><En>no — define one inside and call it</En><Zh>不行——在内部定义再调用</Zh></td>
            <td><En>yes — <code>{"async function handleSubmit(e)"}</code></En><Zh>可以——<code>{"async function handleSubmit(e)"}</code></Zh></td>
          </tr>
          <tr>
            <td><En>Use it for</En><Zh>适用场景</Zh></td>
            <td><En>data the page needs just to exist; re-syncing when an id or page changes</En><Zh>页面初始数据；id 或页码变化时重新同步</Zh></td>
            <td><En>searching, saving, deleting, retrying</En><Zh>搜索、保存、删除、重试</Zh></td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        <En>Ask which one caused the fetch. "The page opened" is an effect; "the user pressed Search" is a
        handler — don't route a click through a state change just to wake an effect up.</En>
        <Zh>问问自己是什么触发了这次请求。"页面打开了"是 effect；"用户点击了搜索"是处理函数——不要为了触发 effect 而将点击操作绕道 state 变化。</Zh>
      </p>

      <hr className="section-divider" />

      <p className="section-label"><En>Advanced</En><Zh>进阶</Zh></p>
      <p className="section-note">
        <En>Past today's bare minimum — the habits that separate working effects from good ones.</En>
        <Zh>超出今天基础要求——让 effect 从能用到好用的习惯。</Zh>
      </p>

      <h2><En>13. You might not need an effect</En><Zh>13. 你可能不需要 effect</Zh></h2>
      <p>
        <En>The most common misuse of <code>useEffect</code> isn't a broken dependency array — it's using
        one at all for a value that could just be calculated while rendering. See{" "}
        <a href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noreferrer">
          You Might Not Need an Effect
        </a>{" "}
        in the React docs.</En>
        <Zh><code>useEffect</code> 最常见的误用不是依赖数组写错——而是根本不该用 effect，明明可以在渲染时直接计算的值却用了 effect。参见 React 文档中的{" "}
        <a href="https://react.dev/learn/you-might-not-need-an-effect" target="_blank" rel="noreferrer">
          You Might Not Need an Effect
        </a>。</Zh>
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
          <p className="demo-result-label"><En>Rendered — type one letter and compare the render counts</En><Zh>渲染结果——输入一个字母并对比渲染次数</Zh></p>
          <DerivedFullNameDemo />
        </div>
      </div>
      <p><En>Filtering and sorting a list is the same mistake at a larger size:</En><Zh>对列表进行过滤和排序是同样的错误，只是规模更大：</Zh></p>
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
          <p className="demo-result-label"><En>Rendered — both are correct; only one needed an effect</En><Zh>渲染结果——两者结果相同，但只有一种需要 effect</Zh></p>
          <DerivedListDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En><strong>The test:</strong> can this value be calculated from the state and props you
            already have? Then it isn't state, and it doesn't need an effect — calculate it during
            render.</En>
            <Zh><strong>判断标准：</strong>这个值能从已有的 state 和 props 计算出来吗？如果能，它就不是 state，也不需要 effect——在渲染时直接计算。</Zh>
          </li>
          <li>
            <En>What the effect version costs: a second state to keep in sync, a dependency array to get
            right, two renders per change, and one render where the derived value is still the old
            one.</En>
            <Zh>使用 effect 版本的代价：需要同步的第二个 state，需要写对的依赖数组，每次变化触发两次渲染，以及一次渲染中派生值仍是旧值。</Zh>
          </li>
          <li>
            <En>It also goes wrong quietly. Add a second way to change <code>todos</code> and forget the
            dependency, and the list on screen no longer matches the list in state.</En>
            <Zh>它还会悄无声息地出错。新增另一种修改 <code>todos</code> 的方式却忘记更新依赖数组，屏幕上的列表就会和 state 中的列表不一致。</Zh>
          </li>
          <li>
            <En><code>.sort()</code> mutates, so sort a copy: <code>{"[...filtered].sort(…)"}</code>.
            Sorting state in place is the same mutation bug from Day 7.</En>
            <Zh><code>.sort()</code> 会原地修改，所以要对副本排序：<code>{"[...filtered].sort(…)"}</code>。直接对 state 排序和第 7 天讲的 mutation bug 是同一个问题。</Zh>
          </li>
          <li>
            <En>Only reach for <code>useMemo</code> if that calculation is genuinely expensive and you've
            measured it. It's still computing during render — just cached.</En>
            <Zh>只有在计算确实开销较大且经过实际测量后，才考虑使用 <code>useMemo</code>。它仍然在渲染时计算——只是会缓存结果。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>14. Race conditions</En><Zh>14. 竞态条件</Zh></h2>
      <p>
        <En>An effect that re-runs can have two requests in flight at once, and the network doesn't
        promise to answer in order. The later click can be overwritten by the earlier response:</En>
        <Zh>可以重复执行的 effect 可能同时有两个请求在途中，而网络不保证按顺序响应。后一次点击的数据可能被先一次请求的响应覆盖：</Zh>
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
          <p className="demo-result-label"><En>Simulated delays — click user 1 then user 3 quickly</En><Zh>模拟延迟——快速先点用户 1 再点用户 3</Zh></p>
          <RaceConditionDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>Each run of the effect gets its own <code>ignore</code> variable, because the effect
            function is called afresh every time.</En>
            <Zh>每次 effect 执行都有自己独立的 <code>ignore</code> 变量，因为 effect 函数每次都是全新调用的。</Zh>
          </li>
          <li>
            <En>When <code>userId</code> changes, React runs the <em>previous</em> run's cleanup first —
            which sets that run's <code>ignore</code> to <code>true</code>.</En>
            <Zh><code>userId</code> 变化时，React 先运行<em>上一次</em>执行的清理函数——将那次执行的 <code>ignore</code> 设为 <code>true</code>。</Zh>
          </li>
          <li>
            <En>The old request still finishes; you can't un-send it. The flag just means nobody listens
            to the answer.</En>
            <Zh>旧请求仍会完成，你无法撤回它。这个标志只是意味着没有人再监听它的响应。</Zh>
          </li>
          <li>
            <En>This also covers unmount: a response arriving after the component is gone now sets no
            state.</En>
            <Zh>这同样适用于卸载的情况：组件消失后到达的响应不会再设置任何 state。</Zh>
          </li>
          <li>
            <En><code>AbortController</code> is the other way, and actually cancels the request:{" "}
            <code>{"const controller = new AbortController()"}</code>, pass{" "}
            <code>{"{ signal: controller.signal }"}</code> to <code>fetch</code>, and{" "}
            <code>controller.abort()</code> in the cleanup.</En>
            <Zh><code>AbortController</code> 是另一种方式，它会真正取消请求：<code>{"const controller = new AbortController()"}</code>，将 <code>{"{ signal: controller.signal }"}</code> 传给 <code>fetch</code>，在清理函数中调用 <code>controller.abort()</code>。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>15. Synchronizing with an external system</En><Zh>15. 与外部系统同步</Zh></h2>
      <p>
        <En>Data fetching is one case of the general job: keep something outside React lined up with a
        component that comes and goes. A DOM event listener is the smallest example:</En>
        <Zh>数据请求只是更通用任务的一种情况：让 React 之外的某个东西与一个会挂载和卸载的组件保持同步。DOM 事件监听器是最简单的例子：</Zh>
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
          <p className="demo-result-label"><En>Rendered — drag the browser edge</En><Zh>渲染结果——拖动浏览器边缘</Zh></p>
          <WindowSizeDemo />
        </div>
      </div>
      <p className="callout">
        <En>Pass the <em>same function reference</em> to <code>removeEventListener</code> that you gave{" "}
        <code>addEventListener</code> — a fresh inline arrow in the cleanup removes nothing.</En>
        <Zh>传给 <code>removeEventListener</code> 的必须是与 <code>addEventListener</code> 相同的函数引用——在清理函数中写一个新的内联箭头函数什么也移除不了。</Zh>
      </p>
      <p>
        <En>A subscription to anything else — a WebSocket feed, a store, a browser API — is the identical
        shape. Subscribe in the effect, keep the unsubscribe it hands back, call it in the cleanup:</En>
        <Zh>订阅其他任何东西——WebSocket 数据流、store、浏览器 API——都是同样的结构。在 effect 中订阅，保存它返回的取消订阅函数，在清理函数中调用：</Zh>
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
            <En>Rendered — a local stand-in feed with the same subscribe/unsubscribe API, so this page
            doesn't open a live exchange connection every time someone reads it</En>
            <Zh>渲染结果——使用同样订阅/取消订阅 API 的本地模拟数据流，避免每次有人阅读此页时都打开真实交易所连接</Zh>
          </p>
          <SubscriptionDemo />
        </div>
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th><En>External system</En><Zh>外部系统</Zh></th>
            <th><En>Set up in the effect</En><Zh>effect 中建立</Zh></th>
            <th><En>Undo in the cleanup</En><Zh>清理函数中撤销</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><En>a DOM event</En><Zh>DOM 事件</Zh></td>
            <td><code>addEventListener</code></td>
            <td><code>removeEventListener</code></td>
          </tr>
          <tr>
            <td><En>a repeating timer</En><Zh>重复定时器</Zh></td>
            <td><code>setInterval</code></td>
            <td><code>clearInterval</code></td>
          </tr>
          <tr>
            <td><En>a delayed action</En><Zh>延迟操作</Zh></td>
            <td><code>setTimeout</code></td>
            <td><code>clearTimeout</code></td>
          </tr>
          <tr>
            <td><En>a live feed</En><Zh>实时数据流</Zh></td>
            <td><code>new WebSocket(…)</code></td>
            <td><code>ws.close()</code></td>
          </tr>
          <tr>
            <td><En>a third-party store</En><Zh>第三方 store</Zh></td>
            <td><code>store.subscribe(listener)</code></td>
            <td><En>the returned <code>unsubscribe()</code></En><Zh>返回的 <code>unsubscribe()</code></Zh></td>
          </tr>
          <tr>
            <td><En>a network request</En><Zh>网络请求</Zh></td>
            <td><code>fetch(url)</code></td>
            <td><En>an <code>ignore</code> flag, or <code>controller.abort()</code></En><Zh><code>ignore</code> 标志，或 <code>controller.abort()</code></Zh></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
