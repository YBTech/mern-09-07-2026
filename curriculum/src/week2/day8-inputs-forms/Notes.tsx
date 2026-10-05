import { useState } from "react";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";
import TodoListDemo from "./lecture/TodoListDemo";

function ControlledInputDemo() {
  const [name, setName] = useState("");
  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="type your name" />
      <p>You typed: {name || "(nothing yet)"}</p>
    </div>
  );
}

function SignupFormDemo() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("That doesn't look like an email address.");
      return;
    }
    setError("");
    setSubmitted(email.trim());
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{ padding: "0.3rem 0.5rem", marginRight: "0.4rem" }}
      />
      <button type="submit" disabled={email.trim().length === 0}>
        Sign up
      </button>
      <button type="button" onClick={() => setEmail("")} style={{ marginLeft: "0.3rem" }}>
        Clear
      </button>
      {error && <p style={{ color: "#c62828", margin: "0.5rem 0 0" }}>{error}</p>}
      {submitted && <p style={{ margin: "0.5rem 0 0" }}>Signed up: {submitted}</p>}
    </form>
  );
}

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 8 Notes</title>
      <DayNav day="day8-inputs-forms" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 2 · Day 8 · Notes</p>
        <h1>Inputs &amp; Forms</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心总结 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心总结</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>今天结束后你必须掌握的核心内容：</Zh></p>
        <ul>
          <li>
            <En>
              Build a controlled input: state behind every field, feeding <code>value</code>, written
              back by <code>onChange</code>
            </En>
            <Zh>
              实现受控输入（controlled input）：每个字段背后有 state，通过 <code>value</code> 渲染，通过 <code>onChange</code> 写回
            </Zh>
          </li>
          <li>
            <En>
              Handle a form with <code>onSubmit</code> + <code>e.preventDefault()</code>, validating
              before you accept the input
            </En>
            <Zh>
              用 <code>onSubmit</code> + <code>e.preventDefault()</code> 处理表单提交，在接受输入前完成验证
            </Zh>
          </li>
          <li>
            <En>
              Build a Todo List combining all of it: add, edit (cancel/save), delete, title validation,
              priority dropdown
            </En>
            <Zh>
              综合以上内容构建 Todo List：新增、编辑（取消/保存）、删除、标题验证、优先级下拉菜单
            </Zh>
          </li>
        </ul>
        <p>
          <En>Want more? <a href="/week2/day8-inputs-forms/concepts">View all concepts.</a></En>
          <Zh>想了解更多？<a href="/week2/day8-inputs-forms/concepts">查看所有概念。</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

      <h2><En>1. Controlled components</En><Zh>1. 受控组件</Zh></h2>
      <p>
        <En>
          An input is <strong>controlled</strong> when its displayed value comes from state and every
          keystroke writes back to that state. This is the pattern for every form field you write —
          there is always a <code>useState</code> behind the input:
        </En>
        <Zh>
          当一个输入框的显示值来自 state、且每次按键都将新值写回 state 时，它就是<strong>受控</strong>的。这是所有表单字段的标准写法——输入框背后始终有一个 <code>useState</code>：
        </Zh>
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function NameField() {
  const [name, setName] = useState("");

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label">Rendered</p>
          <ControlledInputDemo />
        </div>
      </div>
      <div className="concept">
        <p className="concept-label">Concept</p>
        <ul>
          <li>
            <En>
              The loop: state → <code>value</code> renders it → user types →{" "}
              <code>onChange</code> reads <code>e.target.value</code> → setter → re-render → the input
              shows the new state.
            </En>
            <Zh>
              数据流循环：state → <code>value</code> 渲染 → 用户输入 → <code>onChange</code> 读取 <code>e.target.value</code> → setter → 重新渲染 → 输入框显示新 state。
            </Zh>
          </li>
          <li>
            <En>
              The DOM node never holds the truth. State does — which is why you can validate, trim,
              uppercase, disable the button, or clear the field just by touching state.
            </En>
            <Zh>
              真实数据永远在 state 里，DOM 节点只是显示。因此验证、去除空白、转大写、禁用按钮、清空输入框，全部只需操作 state。
            </Zh>
          </li>
          <li>
            <En>
              <code>value</code> without <code>onChange</code> freezes the input: React re-renders it
              back to the state value on every keystroke, so nothing you type sticks.
            </En>
            <Zh>
              只有 <code>value</code> 没有 <code>onChange</code> 会冻结输入框：React 在每次按键后都将其重置为 state 的值，导致输入内容无法留存。
            </Zh>
          </li>
          <li>
            <En>
              Neither one — an <em>uncontrolled</em> input — means React has no idea what the user
              typed, and you'd have to reach into the DOM to find out.
            </En>
            <Zh>
              两者都没有——即<em>非受控输入</em>——意味着 React 完全不知道用户输入了什么，只能直接操作 DOM 才能获取值。
            </Zh>
          </li>
        </ul>
      </div>
      <CodeBlock
        code={`
function Fields() {
  const [name, setName] = useState("");

  return (
    <>
      <input placeholder="uncontrolled — React never sees what you type" />
      <input value={name} />
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </>
  );
}
`}
        bad={[6, 7]}
        good={[8]}
      />
      <p><En>Checkboxes and selects are the same pattern with a different value prop:</En><Zh>Checkbox 和 select 遵循相同的模式，只是 value 属性不同：</Zh></p>
      <CodeBlock
        code={`
function Options() {
  const [isDone, setIsDone] = useState(false);
  const [priority, setPriority] = useState<Priority>("medium");

  return (
    <>
      <input
        type="checkbox"
        checked={isDone}
        onChange={(e) => setIsDone(e.target.checked)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </>
  );
}
`}
      />
      <p>
        <En>
          Several fields can share one state object — compute the key to update from the input's own{" "}
          <code>name</code>:
        </En>
        <Zh>
          多个字段可以共用一个 state 对象——通过输入框自身的 <code>name</code> 属性动态计算要更新的 key：
        </Zh>
      </p>
      <CodeBlock
        code={`
function ProfileForm() {
  const [form, setForm] = useState({ name: "", email: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </>
  );
}
`}
      />

      <h2><En>2. Forms, submitting, and validation</En><Zh>2. 表单、提交与验证</Zh></h2>
      <p>
        <En>
          Put <code>onSubmit</code> on the <code>&lt;form&gt;</code>, not <code>onClick</code> on the
          button — that's what makes pressing Enter in a field work too. The handler's first line is
          almost always <code>e.preventDefault()</code>, which stops the browser's default behaviour of
          reloading the whole page:
        </En>
        <Zh>
          将 <code>onSubmit</code> 放在 <code>&lt;form&gt;</code> 上，而不是 <code>onClick</code> 放在按钮上——这样在输入框中按 Enter 也能触发提交。处理函数的第一行几乎总是 <code>e.preventDefault()</code>，用于阻止浏览器默认的整页刷新行为：
        </Zh>
      </p>
      <div className="code-demo-pair">
        <CodeBlock
          code={`
function SignupForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("That doesn't look like an email address.");
      return;
    }
    setError("");
    setEmail("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" disabled={email.trim().length === 0}>
        Sign up
      </button>
      <button type="button" onClick={() => setEmail("")}>Clear</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
`}
        />
        <div className="demo-result">
          <p className="demo-result-label"><En>Rendered — try submitting without an @</En><Zh>渲染效果 — 试试不输入 @ 直接提交</Zh></p>
          <SignupFormDemo />
        </div>
      </div>
      <p className="callout">
        <En>
          Inside a <code>&lt;form&gt;</code>, a button is <code>type="submit"</code> by default — give
          any button that shouldn't submit (Cancel, Clear, Edit) an explicit{" "}
          <code>type="button"</code>.
        </En>
        <Zh>
          在 <code>&lt;form&gt;</code> 内，按钮默认是 <code>type="submit"</code>——对于不应触发提交的按钮（取消、清空、编辑），必须显式设置 <code>type="button"</code>。
        </Zh>
      </p>

      <h2><En>3. Putting it together: Todo List</En><Zh>3. 综合实践：Todo List</Zh></h2>
      <p><En>The capstone for today combines nearly every concept above into one component:</En><Zh>今天的综合练习将上述几乎所有概念融合到一个组件中：</Zh></p>
      <div className="demo-result">
        <p className="demo-result-label"><En>Live demo — try adding, editing, and deleting a todo</En><Zh>实时演示 — 试着新增、编辑和删除一条 todo</Zh></p>
        <TodoListDemo />
      </div>
      <table className="ref-table">
        <thead>
          <tr>
            <th><En>Piece</En><Zh>模块</Zh></th>
            <th><En>Concept used</En><Zh>用到的概念</Zh></th>
          </tr>
        </thead>
        <tbody>
          {[
            [
              "Add form",
              <><En>Controlled inputs + onSubmit/preventDefault + title-length validation</En><Zh>受控输入 + onSubmit/preventDefault + 标题长度验证</Zh></>,
            ],
            [
              "New todo id",
              <><En>crypto.randomUUID() generated once at creation — a stable list key</En><Zh>crypto.randomUUID() 在创建时生成一次——作为稳定的列表 key</Zh></>,
            ],
            [
              "Adding a todo",
              <><En>Immutable array update via spread</En><Zh>通过 spread 不可变地更新数组</Zh></>,
            ],
            [
              "Deleting a todo",
              <><En>Immutable array update via .filter</En><Zh>通过 .filter 不可变地更新数组</Zh></>,
            ],
            [
              "Editing a todo",
              <><En>Conditional rendering (row vs. edit form) + .map to update one item</En><Zh>条件渲染（普通行 vs 编辑表单）+ .map 更新单条数据</Zh></>,
            ],
            [
              "Cancel button",
              <><En>type="button" so it does not trigger form submission</En><Zh>type="button" 防止触发表单提交</Zh></>,
            ],
            [
              "Priority dropdown",
              <><En>Controlled &lt;select&gt;, typed with the Priority union</En><Zh>受控 &lt;select&gt;，用 Priority union 类型约束</Zh></>,
            ],
          ].map(([piece, concept]) => (
            <tr key={piece as string}>
              <td>
                <code>{piece}</code>
              </td>
              <td>{concept}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
