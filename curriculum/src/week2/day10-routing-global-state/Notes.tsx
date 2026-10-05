import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";
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
        <h1><En>Routing &amp; Global State</En><Zh>路由与全局状态</Zh></h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节——核心要点</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心要点——今天结束前你必须能做到的事：</Zh></p>
        <ul>
          <li>
            <En>
              Read an existing route configuration and work inside it: say what{" "}
              <code>&lt;BrowserRouter&gt;</code>, <code>&lt;Routes&gt;</code> and each{" "}
              <code>&lt;Route path element&gt;</code> is doing, add or edit a route following the
              pattern already there, and navigate with <code>&lt;Link to&gt;</code> rather than{" "}
              <code>&lt;a href&gt;</code> — setting routing up from scratch is not the skill
            </En>
            <Zh>
              能读懂已有的路由配置并在其中工作：说出 <code>&lt;BrowserRouter&gt;</code>、
              <code>&lt;Routes&gt;</code> 和每个 <code>&lt;Route path element&gt;</code> 的作用，
              按照已有模式添加或修改路由，并使用 <code>&lt;Link to&gt;</code> 而非{" "}
              <code>&lt;a href&gt;</code> 进行导航——从头配置路由不是今天的重点
            </Zh>
          </li>
          <li>
            <En>
              Read a URL parameter with <code>useParams</code> and navigate from code with{" "}
              <code>useNavigate</code>
            </En>
            <Zh>
              用 <code>useParams</code> 读取 URL 参数，用 <code>useNavigate</code> 在代码中触发导航
            </Zh>
          </li>
          <li>
            <En>
              Name the two problems global state solves: <strong>prop drilling</strong>, and{" "}
              <strong>multiple components sharing the same states</strong>
            </En>
            <Zh>
              说出全局状态解决的两个问题：<strong>prop drilling（属性透传）</strong>，以及{" "}
              <strong>多个组件共享同一状态</strong>
            </Zh>
          </li>
          <li>
            <En>
              Create a context with <code>createContext</code> and read it with{" "}
              <code>useContext</code>
            </En>
            <Zh>
              用 <code>createContext</code> 创建 context，用 <code>useContext</code> 读取它
            </Zh>
          </li>
          <li>
            <En>
              Write a <strong>custom Provider component</strong> that owns the state and its updater
              functions, and passes both as the context value
            </En>
            <Zh>
              编写<strong>自定义 Provider 组件</strong>，由它持有状态和更新函数，并将两者作为 context 值传递出去
            </Zh>
          </li>
          <li>
            <En>
              Write a <strong>custom hook</strong> wrapping <code>useContext</code> that throws when
              it's used outside its Provider
            </En>
            <Zh>
              编写包装 <code>useContext</code> 的<strong>自定义 hook</strong>，在 Provider 外部使用时抛出错误
            </Zh>
          </li>
        </ul>
        <p>
          <En>Want more? <Link to="/week2/day10-routing-global-state/concepts">View all concepts.</Link></En>
          <Zh>想了解更多？<Link to="/week2/day10-routing-global-state/concepts">查看所有概念。</Link></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二节——完整讲解</Zh></h2>

      <h2><En>1. Client-side routing: what actually changes</En><Zh>1. 客户端路由：底层发生了什么</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>
              <strong>The old way (server-rendered, multi-page):</strong> every link is a request. The
              browser throws away the current page, asks the server for{" "}
              <code>/products/42</code>, and paints whatever HTML comes back. Full reload, white
              flash, all JavaScript state gone.
            </En>
            <Zh>
              <strong>旧方式（服务器渲染，多页应用）：</strong>每次点击链接都是一次网络请求。浏览器丢弃当前页面，
              向服务器请求 <code>/products/42</code>，然后渲染返回的 HTML。完全刷新、白屏、所有 JavaScript 状态全部丢失。
            </Zh>
          </li>
          <li>
            <En>
              <strong>The SPA way (client-side rendering):</strong> the server hands over one HTML
              shell and one JS bundle, once. After that the app owns the URL bar.
            </En>
            <Zh>
              <strong>SPA 方式（客户端渲染）：</strong>服务器只下发一次 HTML shell 和 JS bundle，之后 URL 栏由应用自己管理。
            </Zh>
          </li>
          <li>
            <En>
              A router is just <strong>a big conditional on the URL</strong>: it reads the current
              path, decides which component matches, and renders it. No network request, no reload —
              React swaps components the same way it swaps anything else.
            </En>
            <Zh>
              路由器本质上是一个<strong>基于 URL 的大条件判断</strong>：它读取当前路径，决定哪个组件匹配，然后渲染它。
              没有网络请求，不会刷新——React 替换组件的方式和替换其他内容一样。
            </Zh>
          </li>
          <li>
            <En>
              The URL is still a real URL: it's in the address bar, Back and Forward work, and the
              page is bookmarkable. That's the part <code>useState</code> alone can't give you.
            </En>
            <Zh>
              URL 仍然是真实的 URL：显示在地址栏中、浏览器前进/后退可以正常使用、页面可以收藏。
              这些都是单纯用 <code>useState</code> 做不到的。
            </Zh>
          </li>
        </ul>
      </div>

      <h2><En>2. React Router in one screen</En><Zh>2. React Router 一屏速览</Zh></h2>
      <p><En>The router wraps the whole app exactly once, at the root:</En><Zh>路由器在根节点包裹整个应用，且只包裹一次：</Zh></p>
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
        <En>
          Then one <code>&lt;Route&gt;</code> per URL you want to exist, and one{" "}
          <code>&lt;Link&gt;</code> per navigation:
        </En>
        <Zh>
          然后为每个需要存在的 URL 定义一个 <code>&lt;Route&gt;</code>，每处导航使用一个 <code>&lt;Link&gt;</code>：
        </Zh>
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
        <En>
          A stray <code>&lt;a href&gt;</code> inside a React app is a bug, not a style choice — it
          throws away every piece of state the app was holding.
        </En>
        <Zh>
          在 React 应用中误用 <code>&lt;a href&gt;</code> 是一个 bug，不是写法问题——它会丢弃应用持有的所有状态。
        </Zh>
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th><En>Piece</En><Zh>组件</Zh></th>
            <th><En>What it does</En><Zh>作用</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>&lt;BrowserRouter&gt;</code>
            </td>
            <td><En>Wraps the app once and connects it to the browser's URL and history.</En><Zh>在根节点包裹应用一次，将其连接到浏览器的 URL 和历史记录。</Zh></td>
          </tr>
          <tr>
            <td>
              <code>&lt;Routes&gt;</code>
            </td>
            <td><En>Looks at the current URL and renders the single best-matching child route.</En><Zh>读取当前 URL，渲染最匹配的子路由。</Zh></td>
          </tr>
          <tr>
            <td>
              <code>&lt;Route path element&gt;</code>
            </td>
            <td>
              <En>
                One URL pattern and the component to render for it. <code>:id</code> is a parameter;{" "}
                <code>*</code> is the catch-all for a 404 page — <code>&lt;Routes&gt;</code> ranks by
                specificity rather than by order, so it only wins when nothing else matches.
              </En>
              <Zh>
                一个 URL 模式及对应渲染的组件。<code>:id</code> 是参数；<code>*</code> 是捕获所有未匹配路径的 404 页面——
                <code>&lt;Routes&gt;</code> 按匹配精度排序而非顺序，因此 <code>*</code> 只在其他路由都不匹配时才生效。
              </Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>&lt;Link to&gt;</code>
            </td>
            <td><En>An in-app navigation, with no reload. This replaces every internal anchor tag.</En><Zh>应用内导航，不会刷新页面。用它替换所有内部锚标签。</Zh></td>
          </tr>
          <tr>
            <td>
              <code>useParams()</code>
            </td>
            <td>
              <En>
                Reads the <code>:</code> parameters out of the current URL, always as strings.
              </En>
              <Zh>
                从当前 URL 中读取 <code>:</code> 参数，始终以字符串形式返回。
              </Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>useNavigate()</code>
            </td>
            <td>
              <En>
                Navigates from code rather than from a click — after a login, after a form submit.
              </En>
              <Zh>
                在代码中触发导航，而非通过点击——常用于登录后、表单提交后跳转。
              </Zh>
            </td>
          </tr>
        </tbody>
      </table>

      <h2><En>3. Reading the URL and navigating from code</En><Zh>3. 读取 URL 参数与代码导航</Zh></h2>
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
        <En>
          <code>useParams</code> hands you strings, never numbers — <code>id === "42"</code>, so
          convert before you compare against a numeric id.
        </En>
        <Zh>
          <code>useParams</code> 返回的始终是字符串，不是数字——<code>id === "42"</code>，与数字 id 比较前需要先转换类型。
        </Zh>
      </p>
      <p className="callout">
        <En>
          That's the whole routing story for today: every project wires routing slightly differently
          and you do it once, so understand the shape rather than memorising the API.
        </En>
        <Zh>
          这就是今天路由部分的全部内容：每个项目的路由配置方式略有不同，而且只需配置一次，所以理解整体结构比死记 API 更重要。
        </Zh>
      </p>

      <hr className="section-divider" />

      <h2><En>4. Pain point 1 — prop drilling</En><Zh>4. 痛点一——prop drilling（属性透传）</Zh></h2>
      <p>
        <En>
          State lives in one component and is needed in a distant one, so every component in between
          has to accept it and pass it on:
        </En>
        <Zh>
          状态存在于某个组件中，却需要在层级很深的子组件中使用，于是中间所有组件都不得不接收并向下传递它：
        </Zh>
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
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>
              <strong>The prop isn't the problem — the middle is.</strong> <code>Layout</code> and{" "}
              <code>Sidebar</code> are now coupled to a value they have no interest in.
            </En>
            <Zh>
              <strong>问题不在 prop 本身，而在中间层。</strong><code>Layout</code> 和 <code>Sidebar</code> 被迫依赖一个它们根本不关心的值。
            </Zh>
          </li>
          <li>
            <En>
              Every new field is a change to every file on the path. Adding <code>theme</code> next
              week means editing four components to deliver it to one.
            </En>
            <Zh>
              每新增一个字段，路径上的每个文件都要改动。下周添加 <code>theme</code> 意味着需要修改四个组件，只为把它传到一个地方。
            </Zh>
          </li>
          <li>
            <En>
              The components in the middle stop being reusable: you can't drop{" "}
              <code>Sidebar</code> anywhere else without also supplying a <code>user</code>.
            </En>
            <Zh>
              中间的组件失去了复用性：把 <code>Sidebar</code> 用到其他地方时，还必须同时提供 <code>user</code>。
            </Zh>
          </li>
          <li>
            <En>
              Two or three levels is fine and normal. It becomes a real problem when the path is long
              or the value is needed in several unrelated branches of the tree.
            </En>
            <Zh>
              两三层完全正常。当传递路径很长，或者多个无关联的组件分支都需要这个值时，才会变成真正的问题。
            </Zh>
          </li>
        </ul>
      </div>

      <h2><En>5. Pain point 2 — the same state in two places</En><Zh>5. 痛点二——同一状态存在于两处</Zh></h2>
      <p>
        <En>
          Two components that both need the same number, and no parent-child line between them. The
          instinct is to give each one its own <code>useState</code>:
        </En>
        <Zh>
          两个组件都需要同一个数值，但它们之间没有父子关系。直觉上会给每个组件各自一个 <code>useState</code>：
        </Zh>
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
          <p className="demo-result-label"><En>Two copies, two truths</En><Zh>两份副本，两套数据</Zh></p>
          <OutOfSyncDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>
              <strong>State is per component instance.</strong> Two <code>useState</code> calls are
              two independent boxes, even when they hold the same kind of value and start equal.
            </En>
            <Zh>
              <strong>状态属于各自的组件实例。</strong>两次 <code>useState</code> 调用是两个独立的"盒子"，即便它们存储同类值且初始值相同。
            </Zh>
          </li>
          <li>
            <En>
              So "update one and keep the others in sync" is a question with no good answer — the
              only real fix is to <strong>stop having two copies</strong>.
            </En>
            <Zh>
              所以"更新一个，保持其他同步"这个问题没有好的答案——唯一真正的解决办法是<strong>消除多余的副本</strong>。
            </Zh>
          </li>
          <li>
            <En>
              The standard fix is <strong>lifting state up</strong>: move it to the nearest common
              parent and pass it down. That's correct, and it's what you should reach for first.
            </En>
            <Zh>
              标准解法是<strong>状态提升（lifting state up）</strong>：将状态移到最近的共同父组件并向下传递。这是正确的，也是首选方案。
            </Zh>
          </li>
          <li>
            <En>
              But the nearest common parent of a header badge and a product page is usually{" "}
              <code>App</code> — so lifting state up turns straight back into pain point 1.{" "}
              <strong>Prop drilling and out-of-sync state are the same problem seen from two ends.</strong>
            </En>
            <Zh>
              但购物车角标和商品页的最近共同父组件通常是 <code>App</code>——这样一来，状态提升又回到了痛点一。
              <strong>prop drilling 和状态不同步，本质上是同一个问题的两面。</strong>
            </Zh>
          </li>
        </ul>
      </div>

      <h2><En>6. Context: one owner, any number of readers</En><Zh>6. Context：一个持有者，任意数量的读取者</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>
              Context keeps the "one owner" half of lifting state up and deletes the "pass it down
              through everyone" half.
            </En>
            <Zh>
              Context 保留了状态提升的"单一持有者"部分，去掉了"逐层传递"的部分。
            </Zh>
          </li>
          <li>
            <En>
              A Provider high in the tree publishes a value; any component underneath it, at any
              depth, reads that value directly with <code>useContext</code>. The components in
              between never see it.
            </En>
            <Zh>
              树中较高位置的 Provider 发布一个值；它下方任意深度的组件都能用 <code>useContext</code> 直接读取该值，中间的组件完全不涉及。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Context is delivery, not storage.</strong> The state is still a plain{" "}
              <code>useState</code> inside the Provider — context is only how it reaches the readers.
            </En>
            <Zh>
              <strong>Context 是传递机制，不是存储机制。</strong>状态仍然是 Provider 内部的普通 <code>useState</code>——context 只负责把它送到读取者那里。
            </Zh>
          </li>
          <li>
            <En>
              Publish <strong>the state and the functions that change it</strong> together, so a
              reader can also be a writer without any prop travelling back up.
            </En>
            <Zh>
              将<strong>状态和修改它的函数</strong>一起发布，这样读取者也可以成为写入者，无需通过 prop 向上传递任何东西。
            </Zh>
          </li>
        </ul>
      </div>

      <h3><En>Step 1 — type the state and the actions</En><Zh>第一步——为状态和操作定义类型</Zh></h3>
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
        <En>Step 2 — <code>createContext</code></En>
        <Zh>第二步——<code>createContext</code></Zh>
      </h3>
      <CodeBlock
        code={`
// undefined is the "there is no Provider above me" case — it is what makes the guard in
// step 4 possible, and it is why the type is a union
const ToDoContext = createContext<ToDoContextType | undefined>(undefined);
`}
        language="typescript"
      />

      <h3><En>Step 3 — the custom Provider component</En><Zh>第三步——自定义 Provider 组件</Zh></h3>
      <p>
        <En>
          This is the piece that matters. It's an ordinary component that owns the state, defines the
          updaters, and renders <code>ToDoContext.Provider</code> around its <code>children</code>:
        </En>
        <Zh>
          这是最关键的部分。它是一个普通组件，持有状态，定义更新函数，并将 <code>ToDoContext.Provider</code> 包裹在它的 <code>children</code> 外面：
        </Zh>
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
        <En>
          <code>{"{ children }"}</code> is what makes this reusable: the Provider wraps whatever you
          put inside it, so it never has to know which components will read the value.
        </En>
        <Zh>
          <code>{"{ children }"}</code> 使这个组件具备复用性：Provider 包裹放入其中的任何内容，因此它不需要知道哪些组件会读取该值。
        </Zh>
      </p>

      <h3>
        <En>Step 4 — the custom hook</En>
        <Zh>第四步——自定义 hook</Zh>
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
        <En>
          Without the guard, every consumer would have to write{" "}
          <code>todos?.map(...)</code> forever because the type is{" "}
          <code>ToDoContextType | undefined</code> — one <code>throw</code> here removes that
          everywhere else.
        </En>
        <Zh>
          没有这个守卫，每个消费者都永远要写 <code>todos?.map(...)</code>，因为类型是{" "}
          <code>ToDoContextType | undefined</code>——在这里 <code>throw</code> 一次，就消除了其他所有地方的这个烦恼。
        </Zh>
      </p>

      <h3><En>The whole file</En><Zh>完整文件</Zh></h3>
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
            <th><En>Piece</En><Zh>部分</Zh></th>
            <th><En>What it is</En><Zh>是什么</Zh></th>
            <th><En>Why it's there</En><Zh>为什么需要它</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>ToDoContextType</code>
            </td>
            <td><En>An interface holding the array plus three functions.</En><Zh>一个包含数组和三个函数的接口。</Zh></td>
            <td>
              <En>The contract. Consumers get autocomplete, and adding an action is one edit here.</En>
              <Zh>约定的契约。消费者获得自动补全，添加新操作只需在这里改一处。</Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>createContext(undefined)</code>
            </td>
            <td><En>Creates the channel, with no value until a Provider supplies one.</En><Zh>创建通道，在 Provider 提供值之前没有内容。</Zh></td>
            <td>
              <En>
                <code>undefined</code> is the honest default — it means "nobody is providing this."
              </En>
              <Zh>
                <code>undefined</code> 是诚实的默认值——意味着"当前没有 Provider 在提供此值"。
              </Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>ToDoProvider</code>
            </td>
            <td>
              <En>A component holding <code>useState</code> and the three updaters.</En>
              <Zh>一个持有 <code>useState</code> 和三个更新函数的组件。</Zh>
            </td>
            <td><En>The single owner. This is the only place the todo list actually exists.</En><Zh>唯一的持有者。这是 todo 列表真正存在的唯一地方。</Zh></td>
          </tr>
          <tr>
            <td>
              <code>value={"{{ todos, addTodo, … }}"}</code>
            </td>
            <td><En>The object published to every descendant.</En><Zh>发布给所有后代组件的对象。</Zh></td>
            <td>
              <En>State and updaters travel together, so a consumer can write as well as read.</En>
              <Zh>状态和更新函数打包在一起传递，因此消费者既能读取也能写入。</Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>{"{ children }"}</code>
            </td>
            <td><En>Whatever the Provider is wrapped around.</En><Zh>Provider 所包裹的任意内容。</Zh></td>
            <td><En>Keeps the Provider generic — it never names its consumers.</En><Zh>保持 Provider 的通用性——它不需要知道谁是消费者。</Zh></td>
          </tr>
          <tr>
            <td>
              <code>useContext(ToDoContext)</code>
            </td>
            <td><En>Reads the nearest Provider's value.</En><Zh>读取最近的 Provider 的值。</Zh></td>
            <td><En>The read side. No props, at any depth.</En><Zh>读取端。不需要 props，支持任意深度。</Zh></td>
          </tr>
          <tr>
            <td>
              <code>useToDo()</code>
            </td>
            <td>
              <En>A hook wrapping <code>useContext</code> plus a <code>throw</code>.</En>
              <Zh>一个包装了 <code>useContext</code> 和 <code>throw</code> 的 hook。</Zh>
            </td>
            <td>
              <En>
                Narrows the type and turns "used outside the Provider" into a loud error instead of a
                silent <code>undefined</code>.
              </En>
              <Zh>
                收窄类型，将"在 Provider 外部使用"变成一个明显的错误，而不是静默的 <code>undefined</code>。
              </Zh>
            </td>
          </tr>
        </tbody>
      </table>

      <h2><En>7. Using it: wrap once, consume anywhere</En><Zh>7. 使用方式：包裹一次，任意处消费</Zh></h2>
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
        <En>
          Any component inside that wrapper — one level down or ten — reads the same state with one
          line:
        </En>
        <Zh>
          该包裹内的任何组件——无论层级深浅——都能用一行代码读取同一份状态：
        </Zh>
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
        <En>
          Note what stayed local: <code>text</code> is still a plain <code>useState</code> in this
          component. Only state that's genuinely shared belongs in a context.
        </En>
        <Zh>
          注意哪些状态保持在本地：<code>text</code> 仍然是这个组件内普通的 <code>useState</code>。只有真正需要共享的状态才应该放进 context。
        </Zh>
      </p>
      <p><En>Section 5's two out-of-sync panes, with the count moved into a provider above them:</En><Zh>将第 5 节中两个不同步的面板，把计数移入它们上层的 provider 后的效果：</Zh></p>
      <div className="demo-result demo-live">
        <p className="demo-result-label"><En>One owner, two readers</En><Zh>一个持有者，两个读取者</Zh></p>
        <ContextSyncDemo />
      </div>

      <h2><En>8. Context gotchas</En><Zh>8. Context 的注意事项</Zh></h2>
      <p className="callout">
        <En>
          <code>value={"{{ todos, addTodo }}"}</code> builds a brand-new object on every Provider
          render, so <strong>every consumer re-renders</strong> even if it only reads a field that
          didn't change.
        </En>
        <Zh>
          <code>value={"{{ todos, addTodo }}"}</code> 在每次 Provider 渲染时都会创建一个新对象，
          因此<strong>所有消费者都会重新渲染</strong>，即使它们只读取了未发生变化的字段。
        </Zh>
      </p>
      <p className="callout">
        <En>
          One giant <code>AppContext</code> holding user + theme + cart makes that worse — split by
          concern, so a theme toggle doesn't re-render the cart.
        </En>
        <Zh>
          把 user + theme + cart 塞进一个巨大的 <code>AppContext</code> 会让问题更严重——应按关注点拆分，这样切换主题不会触发购物车的重新渲染。
        </Zh>
      </p>
      <p className="callout">
        <En>
          A component only sees the <strong>nearest</strong> Provider above it; forget to wrap, and{" "}
          <code>useContext</code> quietly returns <code>undefined</code> — which is exactly what the
          custom hook's <code>throw</code> is for.
        </En>
        <Zh>
          组件只能看到它上方<strong>最近的</strong> Provider；忘记包裹时，<code>useContext</code> 会悄无声息地返回 <code>undefined</code>——这正是自定义 hook 中 <code>throw</code> 的用武之地。
        </Zh>
      </p>

      <hr className="section-divider" />

      <h2><En>9. Where Context runs out, and Redux begins</En><Zh>9. Context 的局限，以及 Redux 的起点</Zh></h2>
      <p>
        <En>
          Context is a delivery mechanism with no opinion about how state changes. That's fine for a
          theme or a signed-in user, and it starts to hurt once a big app's shared state changes
          often and from many places.
        </En>
        <Zh>
          Context 是一种传递机制，对状态如何变更没有任何约束。用于主题或登录用户时没有问题，但当大型应用的共享状态频繁变更且来源众多时，问题就开始出现了。
        </Zh>
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
            <td><En>Cost</En><Zh>成本</Zh></td>
            <td><En>Built into React, nothing to install.</En><Zh>内置于 React，无需安装。</Zh></td>
            <td><En>A dependency, a store setup, and a vocabulary to learn.</En><Zh>需要引入依赖、配置 store，并学习一套新词汇。</Zh></td>
          </tr>
          <tr>
            <td><En>Re-renders</En><Zh>重新渲染</Zh></td>
            <td><En>Any change to the value re-renders every consumer.</En><Zh>值的任何变化都会让所有消费者重新渲染。</Zh></td>
            <td>
              <En>
                A component subscribes to the slice it selects, and re-renders only when that slice
                changes.
              </En>
              <Zh>
                组件订阅它所选择的切片，只有该切片变化时才重新渲染。
              </Zh>
            </td>
          </tr>
          <tr>
            <td><En>Where logic lives</En><Zh>逻辑位置</Zh></td>
            <td><En>Handlers written inline in the Provider, growing as the feature grows.</En><Zh>处理函数直接写在 Provider 内部，随功能增加而膨胀。</Zh></td>
            <td><En>Named reducers — pure functions, in their own files, testable on their own.</En><Zh>具名 reducer——纯函数，放在独立文件中，可单独测试。</Zh></td>
          </tr>
          <tr>
            <td><En>Async work</En><Zh>异步处理</Zh></td>
            <td><En>You hand-roll it in the Provider, per feature.</En><Zh>需要在每个 Provider 中手动编写异步逻辑。</Zh></td>
            <td><En>Middleware handles it in one standard place (Thunk, Saga).</En><Zh>由 middleware 在统一的地方处理（Thunk、Saga）。</Zh></td>
          </tr>
          <tr>
            <td><En>Debugging</En><Zh>调试</Zh></td>
            <td>
              <code>console.log</code>.
            </td>
            <td>
              <En>
                DevTools: every action, the state before and after, and time-travel back through
                them.
              </En>
              <Zh>
                DevTools：记录每次 action、前后状态，支持时间旅行回放。
              </Zh>
            </td>
          </tr>
          <tr>
            <td><En>Best fit</En><Zh>适用场景</Zh></td>
            <td><En>Theme, locale, auth user, one feature's state.</En><Zh>主题、语言、登录用户、单个功能的状态。</Zh></td>
            <td><En>A large app where lots of shared state changes from lots of places.</En><Zh>共享状态多、变更来源广的大型应用。</Zh></td>
          </tr>
        </tbody>
      </table>

      <h2><En>10. Redux, conceptually</En><Zh>10. Redux 的核心概念</Zh></h2>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>
              <strong>Single source of truth.</strong> One store object holds the whole app's client
              state, so there is never a second copy to keep in sync.
            </En>
            <Zh>
              <strong>单一数据源。</strong>一个 store 对象持有整个应用的客户端状态，永远不存在需要同步的第二份副本。
            </Zh>
          </li>
          <li>
            <En>
              <strong>State is read-only.</strong> Nothing assigns to it. The only way to change
              anything is to <code>dispatch</code> an action — a plain object like{" "}
              <code>{'{ type: "cart/itemAdded", payload: 42 }'}</code> describing what happened.
            </En>
            <Zh>
              <strong>状态只读。</strong>没有任何地方直接赋值。改变状态的唯一方式是 <code>dispatch</code> 一个 action——
              一个描述发生了什么的普通对象，例如 <code>{'{ type: "cart/itemAdded", payload: 42 }'}</code>。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Changes are made by pure reducers.</strong> A reducer is{" "}
              <code>(state, action) =&gt; newState</code>: no fetching, no randomness, no mutation —
              same inputs, same output, every time.
            </En>
            <Zh>
              <strong>变更由纯函数 reducer 执行。</strong>reducer 的形式是 <code>(state, action) =&gt; newState</code>：
              不能请求数据、不能依赖随机数、不能直接修改——相同的输入永远产生相同的输出。
            </Zh>
          </li>
        </ul>
      </div>
      <p>
        <En>
          Put those three together and you get <strong>one-way data flow</strong>, the flux pattern: a
          UI event dispatches an action, the reducer computes the next state from it, the store hands
          that state to whoever subscribed, and those components re-render.
        </En>
        <Zh>
          将这三点结合起来，就得到了<strong>单向数据流</strong>，即 flux 模式：UI 事件 dispatch 一个 action，
          reducer 根据它计算出下一个状态，store 将该状态传递给所有订阅者，这些组件随之重新渲染。
        </Zh>
      </p>
      <figure className="diagram">
        <img
          src={reduxDataFlow}
          alt="Redux data flow loop: a UI event dispatches an action into the store, the store's reducer computes the new state, the store notifies the view, and the view re-renders."
        />
        <figcaption>
          <En>
            One loop, one direction. There is no arrow from the view back into the state — the only
            way in is <code>dispatch</code>.
          </En>
          <Zh>
            一个循环，一个方向。从视图到状态没有直接的箭头——唯一的入口是 <code>dispatch</code>。
          </Zh>
        </figcaption>
      </figure>

      <h3><En>Why middleware exists</En><Zh>middleware 存在的原因</Zh></h3>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>
              A reducer has to stay pure, so it cannot <code>fetch</code>, read the clock, or write to{" "}
              <code>localStorage</code> — but a real app has to do all of those <em>as part of</em>{" "}
              changing state.
            </En>
            <Zh>
              reducer 必须保持纯净，因此不能调用 <code>fetch</code>、读取时钟或写入 <code>localStorage</code>——
              但真实应用在改变状态时往往需要做这些事情。
            </Zh>
          </li>
          <li>
            <En>
              The loop above has nowhere to put that work: <code>dispatch</code> hands the action
              straight to the reducer, and an action is a plain object with no room for an{" "}
              <code>await</code>.
            </En>
            <Zh>
              上面的循环中没有位置放这些工作：<code>dispatch</code> 直接将 action 传给 reducer，
              而 action 是一个不能包含 <code>await</code> 的普通对象。
            </Zh>
          </li>
          <li>
            <En>
              <strong>
                Middleware is a stop placed between <code>dispatch</code> and the reducer.
              </strong>{" "}
              It sees every action first and can delay it, log it, replace it, or dispatch other
              actions before letting it through.
            </En>
            <Zh>
              <strong>middleware 是放置在 <code>dispatch</code> 和 reducer 之间的拦截点。</strong>
              它先于 reducer 看到每个 action，可以延迟、记录、替换它，或在放行前 dispatch 其他 action。
            </Zh>
          </li>
          <li>
            <En>
              So an async flow becomes: the component dispatches once, the middleware does the
              request, and then it dispatches plain "pending" / "fulfilled" / "rejected" actions that
              the reducer can handle purely.
            </En>
            <Zh>
              这样异步流程就变成：组件 dispatch 一次，middleware 执行请求，然后再 dispatch 普通的
              "pending" / "fulfilled" / "rejected" action，reducer 可以纯粹地处理这些 action。
            </Zh>
          </li>
        </ul>
      </div>
      <figure className="diagram">
        <img
          src={reduxAsyncDataFlow}
          alt="Redux async data flow: a click dispatches a thunk, middleware starts the API request and dispatches a pending action, then dispatches a fulfilled action with the response, and the reducer updates the store from those plain actions."
        />
        <figcaption>
          <En>
            The same loop with a thunk in it — the request happens in the middleware, and the reducer
            still only ever sees plain actions.
          </En>
          <Zh>
            同样的循环中加入了 thunk——请求发生在 middleware 中，reducer 看到的始终只有普通 action。
          </Zh>
        </figcaption>
      </figure>
      <p><En>The middleware worth recognising by name:</En><Zh>值得认识的 middleware：</Zh></p>
      <table className="ref-table">
        <thead>
          <tr>
            <th>Middleware</th>
            <th><En>What it adds</En><Zh>作用</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>redux-thunk</code>
            </td>
            <td>
              <En>
                Lets you dispatch a <em>function</em> instead of an object, so an API call can{" "}
                <code>await</code> and then dispatch the result. The default answer for async.
              </En>
              <Zh>
                允许你 dispatch 一个<em>函数</em>而非对象，这样 API 调用可以 <code>await</code> 后再 dispatch 结果。处理异步的默认选择。
              </Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>redux-saga</code>
            </td>
            <td>
              <En>
                Generator-based flows for the complicated cases — retries, cancellation, debouncing,
                long sequences.
              </En>
              <Zh>
                基于 generator 的流程，用于复杂场景——重试、取消、防抖、长流程。
              </Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>redux-persist</code>
            </td>
            <td>
              <En>
                Saves chosen slices to <code>localStorage</code> and restores them on reload, so a
                cart or a session survives a refresh.
              </En>
              <Zh>
                将选定的切片保存到 <code>localStorage</code> 并在刷新时恢复，使购物车或会话在页面刷新后仍然存在。
              </Zh>
            </td>
          </tr>
          <tr>
            <td>
              <code>redux-logger</code>
            </td>
            <td><En>Logs every action with the state before and after it. Development only.</En><Zh>记录每个 action 及其前后的状态。仅用于开发环境。</Zh></td>
          </tr>
        </tbody>
      </table>
      <p className="callout">
        <En>
          Redux's real complaint was always boilerplate — action types, action creators, reducers and
          types, in four files per feature.
        </En>
        <Zh>
          Redux 一直被诟病的是样板代码多——每个功能都需要在四个文件中分别定义 action 类型、action creator、reducer 和类型。
        </Zh>
      </p>
      <p className="callout">
        <En>
          <strong>Redux Toolkit (RTK)</strong> is the answer to that, and is how Redux is written
          today: <code>createSlice</code> generates the actions, the reducer and the types from one
          object, and <code>configureStore</code> ships with thunk and DevTools already wired.
        </En>
        <Zh>
          <strong>Redux Toolkit（RTK）</strong>正是对此的解答，也是现在编写 Redux 的方式：
          <code>createSlice</code> 从一个对象中生成 action、reducer 和类型，
          <code>configureStore</code> 则已内置 thunk 和 DevTools 配置。
        </Zh>
      </p>

      <hr className="section-divider" />

      <h2><En>Advanced — server state, and what real projects actually run</En><Zh>进阶——服务端状态，以及真实项目的实际选择</Zh></h2>
      <p className="callout">
        <En>
          Nothing in this section is something you write today — recognise the names and be able to
          say why a project splits its state in two.
        </En>
        <Zh>
          本节内容今天不需要动手实现——只需认识这些名称，并能说出为什么项目会将状态拆分为两部分。
        </Zh>
      </p>
      <div className="concept">
        <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
        <ul>
          <li>
            <En>
              <strong>Client state</strong> is yours: a form's text, the open tab, a theme, whether a
              modal is showing. It's synchronous, and nobody else can change it behind your back.
              Context and Redux are built for this.
            </En>
            <Zh>
              <strong>客户端状态</strong>由你掌控：表单文本、当前标签页、主题、弹窗是否展示。
              它是同步的，没有人能在背后更改它。Context 和 Redux 都是为此而生的。
            </Zh>
          </li>
          <li>
            <En>
              <strong>Server state</strong> is a <em>copy</em> of data that lives somewhere else. It
              goes stale, someone else can change it, and it needs caching, refetching, loading and
              error flags, and de-duplication of identical requests.
            </En>
            <Zh>
              <strong>服务端状态</strong>是存储在别处的数据的<em>副本</em>。它会过期、可能被他人更改，
              并且需要缓存、重新获取、加载和错误标记，以及对相同请求的去重。
            </Zh>
          </li>
          <li>
            <En>
              Putting server state in Redux means hand-writing all of that per feature — which is
              Day 8's <code>useEffect</code> + <code>fetch</code> + loading + error boilerplate,
              repeated forever. That's the gap query libraries fill.
            </En>
            <Zh>
              把服务端状态放进 Redux，意味着要为每个功能手动编写上述所有逻辑——也就是第 8 天的{" "}
              <code>useEffect</code> + <code>fetch</code> + loading + error 样板代码，无限重复。这正是查询库填补的空白。
            </Zh>
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
        <En>
          <strong>RTK Query</strong> is the same idea shipped inside Redux Toolkit, so a project
          already on Redux gets it without adding another library.
        </En>
        <Zh>
          <strong>RTK Query</strong> 是内置在 Redux Toolkit 中的同类方案，已经使用 Redux 的项目无需额外引入库即可使用。
        </Zh>
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th><En>Typical combination</En><Zh>典型组合</Zh></th>
            <th><En>Client state</En><Zh>客户端状态</Zh></th>
            <th><En>Server state</En><Zh>服务端状态</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Redux Toolkit + RTK Query</td>
            <td><En>RTK slices</En><Zh>RTK slices</Zh></td>
            <td>RTK Query</td>
          </tr>
          <tr>
            <td>Zustand + React Query</td>
            <td><En>Zustand (a small store, far less ceremony than Redux)</En><Zh>Zustand（轻量级 store，比 Redux 精简得多）</Zh></td>
            <td>React Query</td>
          </tr>
          <tr>
            <td>Context + React Query</td>
            <td><En>Context, for a handful of values</En><Zh>Context，适合少量全局值</Zh></td>
            <td>React Query</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
