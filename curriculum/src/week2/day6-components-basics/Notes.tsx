import type { ReactNode } from "react";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

// --- tiny demo components rendered live in "Section 2", not exported ---

function Greeting({ name, age }: { name: string; age: number }) {
  return (
    <p>
      Hi, {name}! You are {age}.
    </p>
  );
}

function Box() {
  return (
    <div
      style={{
        backgroundColor: "tomato",
        color: "#fff",
        padding: 12,
        borderRadius: 6,
      }}
    >
      Styled!
    </div>
  );
}

function UserCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: "0.75rem 1rem",
      }}
    >
      {children}
    </div>
  );
}

function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>;
}

type Student = { id: string; name: string; grade: number };
const students: Student[] = [
  { id: "s1", name: "Ana", grade: 92 },
  { id: "s2", name: "Ben", grade: 78 },
  { id: "s3", name: "Cy", grade: 85 },
];

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 6 Notes</title>
      <DayNav day="day6-components-basics" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 6 · Notes</p>
        <h1><En>Components Basics: Describing the UI</En><Zh>组件基础：描述用户界面</Zh></h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心要点——今天结束时你应该能够：</Zh></p>
        <ul>
          <li>
            <En>Be able to create function components, import/export them with both default and named</En>
            <Zh>能够创建函数组件，并使用默认导出和命名导出两种方式进行导入/导出</Zh>
          </li>
          <li>
            <En>Start every component name with a capital letter</En>
            <Zh>组件名称必须以大写字母开头</Zh>
          </li>
          <li>
            <En>Rules of JSX: one root element per <code>return</code>, every tag closed,{" "}
            <code>{"{ }"}</code> around any JS value.</En>
            <Zh>JSX 规则：每个 <code>return</code> 只能有一个根元素，所有标签必须闭合，JS 值用 <code>{"{ }"}</code> 括起来</Zh>
          </li>
          <li>
            <En>Props arrive as one object — destructure them, and type them inline or with an{" "}
            <code>interface</code></En>
            <Zh>props 以一个对象的形式传入——解构它，并通过内联方式或 <code>interface</code> 定义类型</Zh>
          </li>
          <li>
            <En>Pass props of every shape: string, number, boolean, array, object, function,{" "}
            <code>children</code></En>
            <Zh>可以传递各种类型的 prop：string、number、boolean、array、object、函数、<code>children</code></Zh>
          </li>
          <li>
            <En>Pass a function prop without calling it: <code>onSelect={"{handleSelect}"}</code>, never{" "}
            <code>onSelect={"{handleSelect()}"}</code></En>
            <Zh>传递函数类型的 prop 时不要加括号：<code>onSelect={"{handleSelect}"}</code>，而非 <code>onSelect={"{handleSelect()}"}</code></Zh>
          </li>
          <li>
            <En>Render conditionally with <code>&amp;&amp;</code>, <code>||</code>, a ternary, or an early{" "}
            <code>return</code></En>
            <Zh>使用 <code>&amp;&amp;</code>、<code>||</code>、三元运算符或提前 <code>return</code> 实现条件渲染</Zh>
          </li>
          <li>
            <En>Render a list with <code>.map()</code>, keyed on a stable unique id — never an index or a
            value generated during render</En>
            <Zh>用 <code>.map()</code> 渲染列表，<code>key</code> 必须是稳定的唯一 id——不能用索引，也不能在渲染时生成</Zh>
          </li>
        </ul>
        <p>
          <En>Want more?{" "}
          <a href="/day6-components-basics/homework/concepts">
            View all concepts.
          </a></En>
          <Zh>想了解更多？<a href="/day6-components-basics/homework/concepts">查看所有概念。</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <En>React is a UI library: instead of manually finding elements and
            mutating them (<code>document.querySelector</code>,{" "}
            <code>.innerHTML</code>), you describe what the UI should look like
            for a given state, and React figures out the DOM updates.</En>
            <Zh>React 是一个 UI 库：你无需手动查找元素并修改它们（<code>document.querySelector</code>、<code>.innerHTML</code>），只需描述某个状态下 UI 应该是什么样子，React 会自动计算 DOM 的更新。</Zh>
          </li>
          <li>
            <En>It keeps a lightweight in-memory copy of the UI tree — the "virtual
            DOM" — compares the new one against the previous one on every
            update, and patches only what actually changed in the real DOM
            instead of re-rendering everything from scratch.</En>
            <Zh>React 在内存中维护一份轻量的 UI 树副本——即「虚拟 DOM」——每次更新时将新树与旧树进行比较，只将实际变化的部分更新到真实 DOM 中，而不是从头重新渲染。</Zh>
          </li>
          <li>
            <En>This is what makes UI code declarative instead of a long list of
            manual DOM-mutation steps.</En>
            <Zh>这就是 UI 代码能够以声明式编写的原因，避免了冗长的手动 DOM 操作步骤。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>1. Components, import &amp; export</En><Zh>1. 组件、import 与 export</Zh></h2>
      <p>
        <En>A component is a function that returns JSX, with a capitalized name.
        That's the whole definition:</En>
        <Zh>组件就是一个返回 JSX 的函数，且函数名以大写字母开头。定义就这么简单：</Zh>
      </p>
      <CodeBlock
        code={`
// Greeting.tsx
export default function Greeting() {
  return (
    <div className="greeting">
      <h1>Hello, world!</h1>
      <p>Welcome to React.</p>
    </div>
  );
}
`}
      />
      <p>
        <En>Another file imports it by whatever name it likes — a default import has
        no name to match:</En>
        <Zh>其他文件可以用任意名称导入它——默认导入不需要名称对应：</Zh>
      </p>
      <CodeBlock
        code={`
// App.tsx
import Greeting from "./Greeting";

export default function App() {
  return <Greeting />;
}
`}
      />
      <h3><En>The name must start with a capital letter</En><Zh>名称必须以大写字母开头</Zh></h3>
      <p>
        <En>This one is a rule, not a style preference — JSX reads the case of that
        first letter to decide what it's even building:</En>
        <Zh>这是语法规则，不是编码风格——JSX 通过首字母的大小写来判断要创建什么：</Zh>
      </p>
      <CodeBlock
        code={`
<greeting name="Ana" />
<Greeting name="Ana" />
`}
        language="xml"
        bad={[1]}
        good={[2]}
      />
      <p><En>Those two compile to different things entirely:</En><Zh>这两种写法编译后完全不同：</Zh></p>
      <CodeBlock
        code={`
// lowercase becomes a string — "build a literal <greeting> element"
React.createElement("greeting", { name: "Ana" });

// capitalized becomes a reference — "call this function"
React.createElement(Greeting, { name: "Ana" });
`}
        bad={[2]}
        good={[5]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <En>Neither version throws. The browser happily renders an unknown,
            empty <code>&lt;greeting&gt;</code> element, so the page just has a
            blank space where your component should be.</En>
            <Zh>两种写法都不会报错。浏览器会愉快地渲染一个未知的空 <code>&lt;greeting&gt;</code> 元素，所以页面上只会出现一片空白，而不是你的组件。</Zh>
          </li>
          <li>
            <En>Your props go along for the ride as unrecognized HTML attributes —
            no error, no warning, nothing in the console.</En>
            <Zh>你传入的 props 会以未知 HTML 属性的形式附在上面——没有报错，没有警告，控制台什么也看不到。</Zh>
          </li>
          <li>
            <En>The rule covers the definition too: name the function{" "}
            <code>Greeting</code>, and give the file the same name.</En>
            <Zh>这条规则同样适用于定义：函数命名为 <code>Greeting</code>，文件名也应保持一致。</Zh>
          </li>
        </ul>
      </div>

      <h3><En>The same component, with a named export</En><Zh>同一个组件，使用命名导出</Zh></h3>
      <p>
        <En>Drop the <code>default</code> keyword and a file can export as many
        components as it wants:</En>
        <Zh>去掉 <code>default</code> 关键字，一个文件就可以导出任意多个组件：</Zh>
      </p>
      <CodeBlock
        code={`
// Greetings.tsx
export function Greeting() {
  return <h1>Hello, world!</h1>;
}

export function Farewell() {
  return <h1>Goodbye!</h1>;
}
`}
      />
      <p>
        <En>Now the import needs curly braces, and the name has to match exactly:</En>
        <Zh>此时导入需要加花括号，且名称必须完全一致：</Zh>
      </p>
      <CodeBlock
        code={`
// App.tsx
import { Greeting, Farewell } from "./Greetings";

export default function App() {
  return (
    <>
      <Greeting />
      <Farewell />
    </>
  );
}
`}
      />
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th><En>Default export</En><Zh>默认导出</Zh></th>
            <th><En>Named export</En><Zh>命名导出</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><En>Export</En><Zh>导出</Zh></td>
            <td>
              <code>export default function Greeting()</code>
            </td>
            <td>
              <code>export function Greeting()</code>
            </td>
          </tr>
          <tr>
            <td><En>Import</En><Zh>导入</Zh></td>
            <td>
              <code>import Greeting from "./f"</code>
            </td>
            <td>
              <code>import {"{ Greeting }"} from "./f"</code>
            </td>
          </tr>
          <tr>
            <td><En>How many per file</En><Zh>每个文件数量</Zh></td>
            <td><En>One</En><Zh>只能有一个</Zh></td>
            <td><En>As many as you like</En><Zh>任意多个</Zh></td>
          </tr>
          <tr>
            <td><En>Name at the import site</En><Zh>导入时的名称</Zh></td>
            <td><En>Anything you want</En><Zh>随意命名</Zh></td>
            <td>
              <En>Must match (rename with <code>as</code>)</En>
              <Zh>必须与导出名一致（可用 <code>as</code> 重命名）</Zh>
            </td>
          </tr>
        </tbody>
      </table>

      <h2><En>2. The rules of JSX</En><Zh>2. JSX 的规则</Zh></h2>
      <p>
        <En>JSX looks like HTML but compiles to plain JS function calls — the
        browser never sees it, Vite's build step transforms it first. Because it
        becomes real code, it's stricter than HTML.</En>
        <Zh>JSX 看起来像 HTML，但会被编译成普通的 JS 函数调用——浏览器永远看不到 JSX，Vite 构建步骤会先完成转换。因为它最终是真正的代码，所以比 HTML 更严格。</Zh>
      </p>

      <h3>
        <En>Rule 1 — one root element per <code>return</code></En>
        <Zh>规则一——每个 <code>return</code> 只能有一个根元素</Zh>
      </h3>
      <p>
        <En>A function can only return one value, so JSX can only return one
        element:</En>
        <Zh>函数只能返回一个值，因此 JSX 也只能返回一个元素：</Zh>
      </p>
      <CodeBlock
        code={`
// ❌ WRONG — two sibling elements returned at once
function Bio() {
  return (
    <h1>Ana</h1>
    <p>Frontend developer</p>
  );
}

// ✅ CORRECT — one root element wrapping both
function Bio() {
  return (
    <div>
        <h1>Ana</h1>
        <p>Frontend developer</p>
    </div>
  );
}
`}
        bad={[4, 5]}
        good={[12, 15]}
      />
      <p>
        <En>Don't want the extra <code>&lt;div&gt;</code> in the real DOM? Use a
        Fragment — <code>&lt;&gt;...&lt;/&gt;</code> groups children and renders
        nothing itself:</En>
        <Zh>不想在真实 DOM 中引入多余的 <code>&lt;div&gt;</code>？可以用 Fragment——<code>&lt;&gt;...&lt;/&gt;</code> 用来组合子元素，自身不渲染任何内容：</Zh>
      </p>
      <CodeBlock
        code={`
function Bio() {
  return (
    <>
      <h1>Ana</h1>
      <p>Frontend developer</p>
    </>
  );
}
`}
      />

      <h3><En>Rule 2 — close every tag</En><Zh>规则二——所有标签必须闭合</Zh></h3>
      <CodeBlock
        code={`
<img src="/ana.png">
<br>
<input type="text">

<img src="/ana.png" />
<br />
<input type="text" />
`}
        language="xml"
        bad={[1, 2, 3]}
        good={[5, 6, 7]}
      />

      <h3>
        <En>Rule 3 — <code>className</code>, and camelCase everything</En>
        <Zh>规则三——<code>className</code>，以及所有属性使用驼峰命名</Zh>
      </h3>
      <p>
        <En>JSX attributes become JS object keys, and <code>class</code> is a
        reserved word in JavaScript — hence <code>className</code>. Every other
        multi-word attribute is camelCase too:</En>
        <Zh>JSX 属性会成为 JS 对象的键，而 <code>class</code> 是 JavaScript 的保留字——因此使用 <code>className</code>。所有多词属性同样采用驼峰命名：</Zh>
      </p>
      <CodeBlock
        code={`
// ❌ WRONG — HTML attribute names
const wrong = <div class="intro" onclick={open} tabindex="0" />;

// ✅ CORRECT — className, camelCase, JS values in braces
const right = <div className="intro" onClick={open} tabIndex={0} />;
`}
        bad={[2]}
        good={[5]}
      />

      <h3>
        <En>Rule 4 — <code>{"{ }"}</code> drops real JS into the markup</En>
        <Zh>规则四——<code>{"{ }"}</code> 将 JS 表达式嵌入标记中</Zh>
      </h3>
      <p>
        <En>Anything between curly braces is a JS expression, evaluated and
        inserted:</En>
        <Zh>花括号之间的内容是 JS 表达式，会被求值后插入页面：</Zh>
      </p>
      <CodeBlock
        code={`
function Score() {
  const name = "Ana";

  return <p>{name} scored {2 + 2} points in { new Date().getFullYear() }</p>;
}
`}
      />
      <p className="callout">
        <En>An <em>expression</em>, not a statement —{" "}
        <code>{"{ if (x) ... }"}</code> is invalid. Use a ternary, or move the{" "}
        <code>if</code> above the <code>return</code>.</En>
        <Zh>这里需要表达式，而不是语句——<code>{"{ if (x) ... }"}</code> 是无效的。请使用三元运算符，或将 <code>if</code> 移到 <code>return</code> 语句之前。</Zh>
      </p>

      <h3><En>Your turn — fix the broken JSX</En><Zh>动手练习——修复有问题的 JSX</Zh></h3>
      <p>
        <En>This HTML was pasted straight into a component. It's broken in four
        places — fix it:</En>
        <Zh>这段 HTML 直接粘贴到了一个组件中，有四处错误——请修复：</Zh>
      </p>
      <CodeBlock
        code={`
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
`}
        language="xml"
      />
      <p className="callout">
        <En>The compiler tells you about the first one only:{" "}
        <code>
          Adjacent JSX elements must be wrapped in an enclosing tag. Did you
          want a JSX fragment &lt;&gt;...&lt;/&gt;? (6:4)
        </code>{" "}
        — fix that, re-run, and it reports the next.</En>
        <Zh>编译器只会提示第一个错误：<code>Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment &lt;&gt;...&lt;/&gt;? (6:4)</code>——修复后重新运行，它会继续报下一个。</Zh>
      </p>
      <details>
        <summary><En>Show the fix</En><Zh>显示答案</Zh></summary>
        <div className="answer">
          <CodeBlock
            code={`
export default function Bio() {
  return (
    <>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br />
        <br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </>
  );
}
`}
          />
          <ul>
            <li>
              <En>Two roots (<code>&lt;div&gt;</code> and <code>&lt;p&gt;</code>) —
              wrapped in a Fragment.</En>
              <Zh>两个根元素（<code>&lt;div&gt;</code> 和 <code>&lt;p&gt;</code>）——用 Fragment 包裹。</Zh>
            </li>
            <li>
              <En><code>class</code> → <code>className</code>, twice.</En>
              <Zh><code>class</code> → <code>className</code>，共两处。</Zh>
            </li>
            <li>
              <En><code>&lt;br&gt;</code> → <code>&lt;br /&gt;</code>, twice.</En>
              <Zh><code>&lt;br&gt;</code> → <code>&lt;br /&gt;</code>，共两处。</Zh>
            </li>
            <li>
              <En><code>&lt;b&gt;And &lt;i&gt;pictures&lt;/b&gt;&lt;/i&gt;</code> is
              mis-nested — inner tags close first.</En>
              <Zh><code>&lt;b&gt;And &lt;i&gt;pictures&lt;/b&gt;&lt;/i&gt;</code> 标签嵌套错误——内层标签应先关闭。</Zh>
            </li>
          </ul>
        </div>
      </details>

      <h2><En>3. Props</En><Zh>3. Props（属性）</Zh></h2>
      <p>
        <En>Props are how a parent passes data into a child. Start with the plain-JS
        version, before types get in the way:</En>
        <Zh>props 是父组件向子组件传递数据的方式。先从不带类型的纯 JS 版本开始：</Zh>
      </p>

      <h3><En>3a. Props are one object</En><Zh>3a. props 是一个对象</Zh></h3>
      <CodeBlock
        code={`
// Greeting.jsx — plain JavaScript, no types yet
function Greeting(props) {
  console.log(props); // { name: "Ana", age: 16 }
  return <p>Hi, {props.name}! You are {props.age}.</p>;
}

function App() {
  return <Greeting name="Ana" age={16} />;
}
`}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <En>React calls your component with{" "}
            <strong>exactly one argument</strong>: an object whose keys are the
            attributes you wrote in the JSX tag.</En>
            <Zh>React 调用你的组件时只传入<strong>一个参数</strong>：一个对象，其键就是你在 JSX 标签中写的属性名。</Zh>
          </li>
          <li>
            <En>Writing three attributes does <em>not</em> give the function three
            parameters. Three attributes in, one object out —{" "}
            <code>{'{ name: "Ana", age: 16 }'}</code>.</En>
            <Zh>写了三个属性，并不意味着函数有三个参数。三个属性进来，出来的是一个对象——<code>{'{ name: "Ana", age: 16 }'}</code>。</Zh>
          </li>
          <li>
            <En>The name <code>props</code> is just a convention for that parameter;
            it's an ordinary function argument like any other.</En>
            <Zh><code>props</code> 只是这个参数的惯用名称，它和其他函数参数没有区别。</Zh>
          </li>
        </ul>
      </div>

      <h3><En>3b. The mistake everyone makes: not destructuring</En><Zh>3b. 最常见的错误：没有解构</Zh></h3>
      <CodeBlock
        code={`
// ❌ WRONG — React never passes a second argument
function Greeting(name, age) {
  return <p>Hi, {name}! You are {age}.</p>;
}
// name === { name: "Ana", age: 16 }  → "Objects are not valid as a React child"
// age  === undefined                 → renders nothing

// ✅ CORRECT — one parameter, read the keys off it
function Greeting(props) {
  return <p>Hi, {props.name}! You are {props.age}.</p>;
}

// ✅ BEST — destructure the object right in the parameter list
function Greeting({ name, age }) {
  return <p>Hi, {name}! You are {age}.</p>;
}
`}
        bad={[2]}
        good={[9, 14]}
      />
      <p className="callout">
        <En><code>{"{ name, age }"}</code> in the parameter list is not "two
        parameters" — it's ordinary JS destructuring, pulling two keys out of
        the single object React handed you.</En>
        <Zh>参数列表中的 <code>{"{ name, age }"}</code> 并不是「两个参数」——这是普通的 JS 解构，从 React 传入的那一个对象中取出两个键。</Zh>
      </p>

      <h3><En>3c. The same component, typed</En><Zh>3c. 同一个组件，添加类型</Zh></h3>
      <p>
        <En>For one or two props, type the object inline right where you destructure
        it:</En>
        <Zh>当只有一两个 prop 时，可以直接在解构的地方内联定义类型：</Zh>
      </p>
      <CodeBlock
        code={`
function Greeting({ name, age }: { name: string; age: number }) {
  return <p>Hi, {name}! You are {age}.</p>;
}
`}
      />
      <p>
        <En>Once it grows past that — or you need to reuse the type — pull it out
        into an <code>interface</code> (or a <code>type</code>; they're
        interchangeable here):</En>
        <Zh>当 prop 增多，或者需要复用类型时，将其提取成一个 <code>interface</code>（或 <code>type</code>，两者在这里可互换）：</Zh>
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
interface GreetingProps {
  name: string;
  age: number;
  nickname?: string; // optional
}

export default function Greeting({
  name,
  age,
  nickname,
}: GreetingProps) {
  return (
    <p>Hi, {nickname ?? name}! You are {age}.</p>
  );
}

function App() {
  return (
    <>
      <Greeting name="Ana" age={16} />
      <Greeting name="Ben" age={17} />
    </>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染效果</Zh></p>
          <Greeting name="Ana" age={16} />
          <Greeting name="Ben" age={17} />
        </div>
      </div>

      <h3><En>3d. Passing each type of value</En><Zh>3d. 传递各种类型的值</Zh></h3>
      <p>
        <En>Only a string literal can use plain quotes.{" "}
        <strong>
          Every other value goes in <code>{"{ }"}</code>
        </strong>
        :</En>
        <Zh>只有字符串字面量可以直接用引号传递，<strong>其他所有类型的值都需要放在 <code>{"{ }"}</code> 中</strong>：</Zh>
      </p>
      <table className="ref-table">
        <thead>
          <tr>
            <th><En>Value</En><Zh>类型</Zh></th>
            <th><En>How you pass it</En><Zh>传递方式</Zh></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><En>string</En><Zh>字符串</Zh></td>
            <td>
              <code>name="Ana"</code>
            </td>
          </tr>
          <tr>
            <td><En>number</En><Zh>数字</Zh></td>
            <td>
              <code>age={"{16}"}</code>
            </td>
          </tr>
          <tr>
            <td><En>boolean</En><Zh>布尔值</Zh></td>
            <td>
              <code>isAdmin={"{true}"}</code> — <En>or just</En><Zh>或简写为</Zh> <code>isAdmin</code>
            </td>
          </tr>
          <tr>
            <td><En>array</En><Zh>数组</Zh></td>
            <td>
              <code>hobbies={'{["chess", "guitar"]}'}</code>
            </td>
          </tr>
          <tr>
            <td><En>object</En><Zh>对象</Zh></td>
            <td>
              <code>address={'{{ city: "NYC" }}'}</code> — <En>braces inside braces</En><Zh>花括号套花括号</Zh>
            </td>
          </tr>
          <tr>
            <td><En>function</En><Zh>函数</Zh></td>
            <td>
              <code>onSelect={"{handleSelect}"}</code> — <En>no parentheses</En><Zh>不加括号</Zh>
            </td>
          </tr>
          <tr>
            <td><En>element</En><Zh>元素</Zh></td>
            <td>
              <code>icon={"{<StarIcon />}"}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <CodeBlock
        code={`
type ProfileProps = {
  name: string;
  age: number;
  isAdmin: boolean;
  hobbies: string[];
  address: { city: string; zip: string };
  onSelect: (id: string) => void;
};

function App() {
  return (
    <Profile
      name="Ana"
      age={16}
      isAdmin
      hobbies={["chess", "guitar"]}
      address={{ city: "NYC", zip: "10001" }}
      onSelect={handleSelect}
    />
  );
}
`}
      />
      <p>
        <En>The object case is the one that trips people up. The <em>outer</em>{" "}
        braces mean "a JS expression goes here"; the <em>inner</em> braces are
        the object literal itself:</En>
        <Zh>对象的情况最容易让人困惑。<em>外层</em>花括号表示「这里是 JS 表达式」，<em>内层</em>花括号才是对象字面量本身：</Zh>
      </p>
      <CodeBlock
        code={`
<Profile address={ city: "NYC" } />
<Profile address={{ city: "NYC" }} />
`}
        language="xml"
        bad={[1]}
        good={[2]}
      />
      <p>
        <En>That's also why the built-in <code>style</code> prop is always
        double-braced — it takes a JS object, not a CSS string, with camelCase
        keys and unitless numbers defaulting to pixels:</En>
        <Zh>这也是内置 <code>style</code> prop 总是双花括号的原因——它接受一个 JS 对象，而不是 CSS 字符串，属性名为驼峰命名，纯数字默认单位为像素：</Zh>
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function Box() {
  return (
    <div style={{
      backgroundColor: "tomato",
      color: "#fff",
      padding: 12,
      borderRadius: 6,
    }}>
      Styled!
    </div>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染效果</Zh></p>
          <Box />
        </div>
      </div>
      <p className="callout">
        <En>For anything beyond a couple of inline overrides, a real CSS class is
        easier to read and maintain than a growing <code>style</code> object.</En>
        <Zh>超出几个内联样式的情况，使用真正的 CSS class 比不断增长的 <code>style</code> 对象更易读、更好维护。</Zh>
      </p>

      <h3><En>3e. Passing a function as a prop</En><Zh>3e. 传递函数类型的 prop</Zh></h3>
      <p>
        <En>A function is just another value — pass the function itself, never the
        result of calling it:</En>
        <Zh>函数也是一种值——传递函数本身，而不是调用它的结果：</Zh>
      </p>
      <CodeBlock
        code={`
function StudentRow({ onSelect }: { onSelect: (id: string) => void }) {
  return <button onClick={() => onSelect("s1")}>Pick Ana</button>;
}

function App() {
  function handleSelect(id: string) {
    console.log("picked", id);
  }

  return (
    <>
      {/* ❌ WRONG — the () calls handleSelect right now, during render, */}
      {/*    and passes its return value (undefined) as the prop */}
      <StudentRow onSelect={handleSelect()} />

      {/* ✅ CORRECT — pass the function itself, no parentheses */}
      <StudentRow onSelect={handleSelect} />

      {/* ✅ CORRECT — need to pass an argument? wrap it in an arrow function */}
      <StudentRow onSelect={(id) => handleSelect(id)} />

      {/* ✅ CORRECT — same idea, but the arrow is anonymous: */}
      {/*    its body is written right here, at the call site */}
      <StudentRow onSelect={(id) => console.log("picked", id)} />
    </>
  );
}
`}
        bad={[14]}
        good={[17, 20, 24]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <En><code>handleSelect</code> is a reference to the function.{" "}
            <code>handleSelect()</code> is an instruction to <em>run it now</em>{" "}
            and use whatever it returns.</En>
            <Zh><code>handleSelect</code> 是对函数的引用，<code>handleSelect()</code> 是立即执行它并使用其返回值的指令。</Zh>
          </li>
          <li>
            <En>So <code>onSelect={"{handleSelect()}"}</code> does two wrong things
            at once: the handler fires on every render instead of on click, and
            the prop ends up <code>undefined</code> — clicking does nothing.</En>
            <Zh>因此 <code>onSelect={"{handleSelect()}"}</code> 同时犯了两个错误：事件处理器在每次渲染时触发而不是点击时触发，且 prop 的值为 <code>undefined</code>——点击什么都不会发生。</Zh>
          </li>
          <li>
            <En>If that handler sets state, you've also just written an infinite
            loop: render → call → set state → render.</En>
            <Zh>如果那个处理器会设置 state，你还顺手写了一个死循环：渲染 → 调用 → 设置 state → 再次渲染。</Zh>
          </li>
          <li>
            <En>An <strong>inline arrow</strong> is not a different rule —{" "}
            <code>{"(id) => ..."}</code> <em>is</em> a function value, so
            passing it is still passing a reference. It's just written at the
            call site instead of being declared and named first.</En>
            <Zh>内联箭头函数并不是另一套规则——<code>{"(id) => ..."}</code> 也是一个函数值，传递它仍然是传递引用，只是在调用处直接编写，而不是先声明命名。</Zh>
          </li>
          <li>
            <En>Reach for a named handler when the body is more than a line or is
            reused; reach for an inline arrow when it's a one-liner or you need
            to bake in an argument.</En>
            <Zh>当函数体超过一行或需要复用时，使用命名处理器；当它只有一行或需要内嵌参数时，使用内联箭头函数。</Zh>
          </li>
          <li>
            <En>Same rule for the built-in ones: <code>onClick={"{save}"}</code> or{" "}
            <code>onClick={"{() => save(id)}"}</code>, never{" "}
            <code>onClick={"{save(id)}"}</code> — the last one runs{" "}
            <code>save</code> during render and hands <code>onClick</code> its
            return value.</En>
            <Zh>内置事件同样适用此规则：<code>onClick={"{save}"}</code> 或 <code>onClick={"{() => save(id)}"}</code>，绝不写 <code>onClick={"{save(id)}"}</code>——最后一种会在渲染时执行 <code>save</code>，并将其返回值赋给 <code>onClick</code>。</Zh>
          </li>
        </ul>
      </div>

      <h3>
        <En>3f. The <code>children</code> prop</En>
        <Zh>3f. <code>children</code> prop</Zh>
      </h3>
      <p>
        <En>Whatever you put between a component's opening and closing tags is
        passed in automatically as the <code>children</code> prop, typed as{" "}
        <code>React.ReactNode</code>:</En>
        <Zh>放在组件开闭标签之间的所有内容都会自动作为 <code>children</code> prop 传入，类型为 <code>React.ReactNode</code>：</Zh>
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function UserCard({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

function App() {
  return (
    <UserCard>
      <strong>Ana</strong> — 16 years old
    </UserCard>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染效果</Zh></p>
          <UserCard>
            <strong>Ana</strong> — 16 years old
          </UserCard>
        </div>
      </div>
      <p className="callout">
        <En><code>children</code> is an ordinary prop with a name React fills in for
        you — it can hold text, one element, a list of elements, or nothing at
        all, which is exactly what <code>ReactNode</code> describes.</En>
        <Zh><code>children</code> 是一个普通的 prop，名称由 React 自动填入——它可以是文本、单个元素、一组元素，或什么都没有，这正是 <code>ReactNode</code> 所描述的。</Zh>
      </p>
      <p>
        <En><strong>Props are read-only.</strong> A component must never reassign or
        mutate the props object it receives — treat it the same way you'd treat
        a function argument you don't own.</En>
        <Zh><strong>props 是只读的。</strong>组件绝不能重新赋值或修改接收到的 props 对象——就像对待一个你不拥有的函数参数一样。</Zh>
      </p>

      <h2><En>4. Conditional rendering</En><Zh>4. 条件渲染</Zh></h2>
      <p><En>Four tools, same idea — decide what to return based on a condition:</En><Zh>四种工具，同一个思路——根据条件决定返回什么：</Zh></p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
// ternary — pick between two things
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>;
}

function Badges({ isAdmin, nickname }: {
  isAdmin: boolean;
  nickname?: string;
}) {
  return (
    <>
      {/* && — render it, or render nothing at all */}
      {isAdmin && <span>Admin</span>}

      {/* || (or ??) — fall back to a default value */}
      <span>{nickname || "Anonymous"}</span>
    </>
  );
}

// early return — bail out before the main JSX
function Profile({ user }: { user: Student | null }) {
  if (!user) return <p>Loading…</p>;
  return <h1>{user.name}</h1>;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染效果</Zh></p>
          <LoginStatus isLoggedIn={true} />
          <LoginStatus isLoggedIn={false} />
        </div>
      </div>
      <p className="callout">
        <En>Watch out for{" "}
        <code>
          {"{"}count &amp;&amp; &lt;p&gt;items&lt;/p&gt;{"}"}
        </code>{" "}
        when <code>count</code> is <code>0</code> — <code>&amp;&amp;</code>{" "}
        returns the left side when it's falsy, so React renders a literal{" "}
        <code>0</code> on the page. Use a real boolean (
        <code>count &gt; 0</code>) instead.</En>
        <Zh>当 <code>count</code> 为 <code>0</code> 时要注意 <code>{"{"}count &amp;&amp; &lt;p&gt;items&lt;/p&gt;{"}"}</code>——<code>&amp;&amp;</code> 在左侧为假值时会返回左侧的值，因此 React 会在页面上渲染出字面量 <code>0</code>。改用真正的布尔值（<code>count &gt; 0</code>）即可。</Zh>
      </p>

      <h2><En>5. Rendering lists</En><Zh>5. 渲染列表</Zh></h2>
      <p>
        <En>Use <code>.map()</code> to turn an array into an array of elements.
        Every item needs a stable, unique <code>key</code> so React can track it
        across re-renders:</En>
        <Zh>用 <code>.map()</code> 将数组转换为元素数组。每个元素都需要一个稳定且唯一的 <code>key</code>，以便 React 在重新渲染时追踪它：</Zh>
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
type Student = { id: string; name: string; grade: number };

function StudentList({ students }: { students: Student[] }) {
  return (
    <ul>
      {students.map((s) => (
        // implicit return needs parens;
        // explicit return needs { } and a ; on the return line
        <li key={s.id}>{s.name} — {s.grade}</li>
      ))}
    </ul>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered</En><Zh>渲染效果</Zh></p>
          <ul>
            {students.map((s) => (
              <li key={s.id}>
                {s.name} — {s.grade}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p><En>Key do's and don'ts:</En><Zh>key 的注意事项：</Zh></p>
      <CodeBlock
        code={`
<li key={student.id}> <!-- the item's own id — same row, same key -->
<li key={index}> <!-- a reorder shifts it onto a different item -->
<li key={Date.now()}> <!-- new key every render — the list re-mounts -->
<li key={Math.random()}> <!-- same, and two rows can collide -->
<li key={uuidv4()}> <!-- generate the id once, at creation -->
`}
        language="xml"
        good={[1]}
        bad={[2, 3, 4, 5]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <En>React uses the key to match each rendered element to the same
            element from the previous render — that's how it knows "this is the
            same todo, just moved" vs. "this is a new one."</En>
            <Zh>React 用 <code>key</code> 将每个渲染出的元素与上一次渲染中的同一元素进行匹配——这就是它判断「这是同一项，只是移动了位置」还是「这是一项新内容」的方式。</Zh>
          </li>
          <li>
            <En>An array index looks stable but isn't: if an item is inserted,
            removed, or reordered, every index after it now points at a{" "}
            <em>different</em> item, so React re-renders those rows for nothing
            and mismatches state/DOM (a half-typed text input, a checked box) to
            the wrong record.</En>
            <Zh>数组索引看起来稳定，实则不然：如果插入、删除或重新排序某项，其后所有索引都会指向不同的元素，导致 React 无谓地重新渲染这些行，并将 state/DOM（如未填完的文本框、已勾选的复选框）与错误的记录关联起来。</Zh>
          </li>
          <li>
            <En><code>Date.now()</code>, <code>Math.random()</code> and{" "}
            <code>uuidv4()</code> are worse — called during render, they
            generate a brand-new key every single time, so React thinks every
            item is new, throws the whole list away and re-mounts it.</En>
            <Zh><code>Date.now()</code>、<code>Math.random()</code> 和 <code>uuidv4()</code> 更糟——在渲染期间调用会每次生成全新的 key，React 会认为每一项都是新的，将整个列表丢弃并重新挂载。</Zh>
          </li>
          <li>
            <En>The fix: a real, stable, unique id that already identifies the
            record — a database id, or one generated <em>once</em> when the item
            is created, not while rendering it.</En>
            <Zh>解决方法：使用真正稳定且唯一的 id 来标识记录——数据库 id，或在创建时生成<em>一次</em>的 id，而不是在渲染时生成。</Zh>
          </li>
        </ul>
      </div>

      <h2><En>6. Keeping components pure</En><Zh>6. 保持组件纯粹</Zh></h2>
      <p>
        <En>A <strong>pure function</strong> always returns the same output for the
        same input, and doesn't touch anything outside itself (no mutating outer
        variables, no network calls, no writing to the DOM directly).</En>
        <Zh><strong>纯函数（pure function）</strong>对相同的输入始终返回相同的输出，并且不会影响自身以外的任何东西（不修改外部变量、不发起网络请求、不直接操作 DOM）。</Zh>
      </p>
      <p>
        <En>A component must be pure the same way: rendering should only compute and
        return JSX, with zero side effects.</En>
        <Zh>组件也必须是纯粹的：渲染只应计算并返回 JSX，不产生任何副作用（side effect）。</Zh>
      </p>
      <CodeBlock
        code={`
let guestCount = 0;
function Guest() { guestCount++; return <p>Guest #{guestCount}</p>; }

function Guest({ num }: { num: number }) { return <p>Guest #{num}</p>; }
`}
        bad={[1, 2]}
        good={[4]}
      />
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <En>Mutating a variable outside the component, logging on every render,
            or firing a network request directly in the function body are all
            side effects — they happen as a byproduct of calling the function,
            not as its return value.</En>
            <Zh>修改组件外部的变量、在每次渲染时打印日志，或直接在函数体中发起网络请求，都是副作用——它们作为函数调用的附带产物发生，而不是作为其返回值。</Zh>
          </li>
          <li>
            <En>The problem: React can call a component's function more than once
            per commit (Strict Mode, concurrent rendering) and can throw away an
            in-progress render. A side effect that ran during a discarded render
            still happened — <code>guestCount</code> above is now wrong.</En>
            <Zh>问题在于：React 在一次提交中可能多次调用组件函数（StrictMode、并发渲染），也可能丢弃正在进行的渲染。发生在被丢弃渲染中的副作用仍然执行了——上面的 <code>guestCount</code> 因此出错。</Zh>
          </li>
          <li>
            <En><code>React.StrictMode</code> (already wrapping this whole app in{" "}
            <code>main.tsx</code>) deliberately renders every component twice,
            in development only, specifically to surface impurities like this
            early instead of in production.</En>
            <Zh><code>React.StrictMode</code>（在 <code>main.tsx</code> 中已包裹整个应用）会在开发模式下故意将每个组件渲染两次，专门用来提前暴露这类不纯问题，而不是让它们在生产环境中出现。</Zh>
          </li>
        </ul>
      </div>
    </div>
  );
}
