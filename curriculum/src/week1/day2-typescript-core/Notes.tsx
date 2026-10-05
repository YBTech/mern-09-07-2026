import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 2 Notes</title>
      <DayNav day="day2-typescript-core" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow"><En>Week 1 · Day 2 · Notes</En><Zh>第一周 · 第二天 · 笔记</Zh></p>
        <h1>TypeScript Core</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心摘要 → 完整讲解</Zh></p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一部分 — 核心摘要</Zh></h2>
        <p>
          <En>The essentials — the bare minimum you need to know for today, not a highlights reel of the lecture:</En>
          <Zh>核心要点——今天必须掌握的最低限度，不是课堂精华回放：</Zh>
        </p>
        <ul>
          <li><En>Explain what TypeScript actually is — a compiled superset of JS — and how it compares to plain JavaScript.</En><Zh>解释 TypeScript 是什么——一种编译型 JS 超集——以及它与普通 JavaScript 的区别。</Zh></li>
          <li><En>Type variables (primitives, arrays) explicitly, and know when TS can infer the type on its own.</En><Zh>显式声明变量类型（基本类型和数组），并知道什么时候 TS 能自动推断。</Zh></li>
          <li><En>Type a function's parameters and return value.</En><Zh>为函数的参数和返回值添加类型注解。</Zh></li>
          <li><En>Define an object shape with <code>interface</code>, including an optional (<code>?</code>) property.</En><Zh>用 <code>interface</code> 定义对象结构，包括可选属性（<code>?</code>）。</Zh></li>
          <li><En>Define an interface with an array property.</En><Zh>定义带数组属性的 interface。</Zh></li>
          <li><En>Define a union type (<code>|</code>) for a fixed set of allowed values.</En><Zh>用 union（<code>|</code>）定义固定的合法值集合。</Zh></li>
        </ul>
        <p>
          <En>Want more? <a href="/src/day2-typescript-core/concepts.html">View all concepts?</a></En>
          <Zh>想了解更多？<a href="/src/day2-typescript-core/concepts.html">查看所有概念？</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — Full Walkthrough                                  */}
      {/* ============================================================ */}
      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二部分 — 完整讲解</Zh></h2>

      <section id="orientation">
        <h2><En>1. Orientation</En><Zh>1. 基础认知</Zh></h2>
        <ul>
          <li><En>JavaScript runs in the <strong>browser</strong> (needs an HTML host page) or standalone in <strong>Node.js</strong> — no browser required.</En><Zh>JavaScript 运行在<strong>浏览器</strong>（需要 HTML 宿主页面）或独立的 <strong>Node.js</strong> 环境中——无需浏览器。</Zh></li>
          <li><En>TypeScript is a <strong>superset</strong> of JavaScript: every valid JS file is already valid TS.</En><Zh>TypeScript 是 JavaScript 的<strong>超集</strong>：每个合法的 JS 文件都已经是合法的 TS。</Zh></li>
          <li><En>TS types are checked at <strong>compile time</strong>, then stripped away — the browser/Node never sees them, only the plain JS underneath.</En><Zh>TS 的类型在<strong>编译时</strong>检查，然后被剥除——浏览器/Node 永远看不到类型，只能看到底层的普通 JS。</Zh></li>
          <li><En>Benefit: catches whole categories of bugs before the code ever runs, plus much better autocomplete/tooling.</En><Zh>好处：在代码运行之前捕获整类 bug，还能大幅提升自动补全和工具支持。</Zh></li>
        </ul>
      </section>

      {/* ============================================================ */}
      <section id="primitives">
        <h2><En>2. Primitive types &amp; inference</En><Zh>2. 基本类型与类型推断</Zh></h2>
        <CodeBlock code={`let studentName: string = "Alice";
let studentAge: number = 24;
let isEnrolled: boolean = true;
let graduationDate: Date | null = null;`} language="typescript" />
        <p className="callout">
          <En>Type inference: <code>let something = "something";</code> — no
          annotation needed, TS already knows it's a <code>string</code> just
          from the value. Only annotate when TS can't infer it for you (e.g. an
          empty array, a function parameter).</En>
          <Zh>类型推断：<code>let something = "something";</code>——不需要类型注解，TS 直接从值推断出它是 <code>string</code>。只有当 TS 无法自行推断时才需要注解（例如空数组、函数参数）。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="arrays-objects-functions">
        <h2><En>3. Arrays, objects, functions</En><Zh>3. 数组、对象、函数</Zh></h2>
        <CodeBlock code={`let scores: number[] = [90, 85, 100];
let hobbies: string[] = ["Coding", "Gaming"];

// inline object type — fine for a one-off, interface below is better once reused
let simpleStudent: { name: string; age: number } = { name: "Bob", age: 25 };

function calculateAverage(a: number, b: number): number {
  return (a + b) / 2;
}`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="four-kings">
        <h2><En>4. The four special types</En><Zh>4. 四种特殊类型</Zh></h2>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Type</th>
              <th><En>Meaning</En><Zh>含义</Zh></th>
              <th><En>Use it when</En><Zh>适用场景</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>any</code></td>
              <td><En>turns type-checking off completely</En><Zh>完全关闭类型检查</Zh></td>
              <td><En>~never — it's the escape hatch, avoid it</En><Zh>几乎不用——这是逃生出口，尽量避免</Zh></td>
            </tr>
            <tr>
              <td><code>unknown</code></td>
              <td><En>could be anything, but must be narrowed before use</En><Zh>可以是任何值，但使用前必须收窄类型</Zh></td>
              <td><En>data from outside your program you haven't validated yet</En><Zh>来自程序外部、尚未验证的数据</Zh></td>
            </tr>
            <tr>
              <td><code>void</code></td>
              <td><En>function returns nothing meaningful</En><Zh>函数没有有意义的返回值</Zh></td>
              <td><En>side-effect-only functions (logging, mutating, etc.)</En><Zh>只产生副作用的函数（日志、修改状态等）</Zh></td>
            </tr>
            <tr>
              <td><code>never</code></td>
              <td><En>function never returns normally</En><Zh>函数永远不会正常返回</Zh></td>
              <td><En>it always throws, or loops forever</En><Zh>它总是抛出异常，或死循环</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock code={`let randomData: any = "hello";
randomData.push(1); // compiles fine, crashes at runtime — any turned checking off

let safeData: unknown = "hello";
if (typeof safeData === "string") {
  safeData.toUpperCase(); // only allowed once TS knows it's a string
}`} language="typescript" good={[6]} bad={[2]} />
        <CodeBlock code={`function logMessage(msg: string): void {
  console.log("LOG: " + msg);
}

function throwError(msg: string): never {
  throw new Error(msg);
}`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="interfaces">
        <h2><En>5. Interfaces</En><Zh>5. Interface（接口）</Zh></h2>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En>Prefer <code>interface</code> for object shapes — it's the default.</En><Zh>定义对象结构优先用 <code>interface</code>——这是默认选择。</Zh></li>
            <li><En>Reach for <code>type</code> only once you need a union or intersection — syntax an <code>interface</code> can't express.</En><Zh>只有在需要 union 或 intersection 时才使用 <code>type</code>——这是 <code>interface</code> 无法表达的语法。</Zh></li>
          </ul>
        </div>
        <CodeBlock code={`interface StudentProfile {
  id: number;
  name: string;
  hobbies?: string[]; // optional — safe to omit entirely
}

let student1: StudentProfile = { id: 1, name: "Charlie" }; // fine, hobbies omitted`} language="typescript" />
        <p className="callout">
          <En>Non-null assertion (<code>!</code>):
          <code>db.find(s =&gt; s.id === id)!</code> — <code>find</code> returns
          <code>StudentProfile | undefined</code>, and <code>!</code> tells TS
          "trust me, it's there." A wrong <code>!</code> compiles clean and
          crashes at runtime with zero warning — only use it when you're
          certain.</En>
          <Zh>非空断言（<code>!</code>）：<code>db.find(s =&gt; s.id === id)!</code>——<code>find</code> 返回 <code>StudentProfile | undefined</code>，而 <code>!</code> 告诉 TS "相信我，它一定在"。错误的 <code>!</code> 能通过编译，却在运行时崩溃且毫无警告——只有在完全确定时才使用。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="union">
        <h2><En>6. Type aliases &amp; union (<code>|</code>)</En><Zh>6. 类型别名与 union（<code>|</code>）</Zh></h2>
        <p><En>A fixed, closed set of allowed values — nothing else is accepted:</En><Zh>固定的、封闭的合法值集合——不接受其他任何值：</Zh></p>
        <CodeBlock code={`type Gender = "Male" | "Female" | "Other";
type HomeworkStatus = "Pending" | "Completed" | "Failed";
type EvaluationResult = "pass" | "fail" | null;

let myGender: Gender = "Male"; // only these three strings are allowed`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="intersection">
        <h2><En>7. Intersection (<code>&amp;</code>)</En><Zh>7. Intersection（<code>&amp;</code>，交叉类型）</Zh></h2>
        <p><En>Combine two shapes — the result must satisfy both:</En><Zh>合并两个类型——结果必须同时满足两者：</Zh></p>
        <CodeBlock code={`interface Person {
  name: string;
  age: number;
}
interface Employee {
  employeeId: string;
  department: string;
}

type StaffMember = Person & Employee; // must have every field from both

let myManager: StaffMember = {
  name: "Alex",
  age: 35,
  employeeId: "EMP-001",
  department: "Marketing",
};`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="enums">
        <h2><En>8. Enums</En><Zh>8. Enum（枚举）</Zh></h2>
        <p><En>A name for a fixed set of related constants:</En><Zh>为一组相关常量命名：</Zh></p>
        <CodeBlock code={`enum Role {
  Admin = "ADMIN",
  User = "USER",
  Employee = "EMPLOYEE",
}

let myRole: Role = Role.Admin;`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="generics">
        <h2><En>9. Generics</En><Zh>9. Generic（泛型）</Zh></h2>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En><code>&lt;T&gt;</code> is a placeholder type — filled in at the call site.</En><Zh><code>&lt;T&gt;</code> 是占位类型——在调用时填入具体类型。</Zh></li>
            <li><En>One function/interface works for many types, without losing type safety the way <code>any</code> would.</En><Zh>一个函数/interface 可以适用于多种类型，同时不像 <code>any</code> 那样丢失类型安全。</Zh></li>
          </ul>
        </div>
        <CodeBlock code={`interface Box<T> {
  content: T;
}

let stringBox: Box<string> = { content: "Apple" };
let numberBox: Box<number> = { content: 100 };

// without generics you'd need getFirstString, getFirstNumber, ... one per type
function getFirstItem<T>(items: T[]): T {
  return items[0];
}

let firstNumber = getFirstItem<number>([10, 20, 30]); // T = number
let firstString = getFirstItem<string>(["Apple", "Banana"]); // T = string`} language="typescript" />
        <p className="callout">
          <En>Real-world use: an API always returns the same envelope shape
          (<code>{"{"} status, data {"}"}</code>) but <code>data</code> is different
          per endpoint — that's exactly what
          <code>ApiResponse&lt;T&gt;</code> in the capstone below is for.</En>
          <Zh>实际应用：API 总是返回同样的外层结构（<code>{"{"} status, data {"}"}</code>），但 <code>data</code> 因接口而异——这正是下面综合练习中 <code>ApiResponse&lt;T&gt;</code> 的用途。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="type-assertion">
        <h2><En>10. Type assertion (<code>as</code>)</En><Zh>10. 类型断言（<code>as</code>）</Zh></h2>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En><code>as Type</code> tells the <em>compiler</em> "trust me, treat this as X" — it changes nothing at runtime.</En><Zh><code>as Type</code> 告诉<em>编译器</em>"相信我，把这个当作 X 来处理"——运行时什么都不会改变。</Zh></li>
            <li><En>That's different from an actual runtime conversion like <code>Number(x)</code>, which really does produce a new value.</En><Zh>这与实际运行时转换（如 <code>Number(x)</code>）不同——后者会真正生成一个新值。</Zh></li>
            <li><En>Only assert a type you're actually sure of — same risk as non-null assertion, wrong ones crash silently past compile time.</En><Zh>只对你真正确定的类型做断言——风险与非空断言相同，错误的断言通过编译后会在运行时悄悄崩溃。</Zh></li>
          </ul>
        </div>
        <CodeBlock code={`const input = document.querySelector("#age") as HTMLInputElement; // assertion — compiler only
const age = Number(input.value); // real runtime conversion — string to number`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="capstone">
        <h2><En>11. Putting it together: Bootcamp grading system</En><Zh>11. 综合练习：训练营成绩系统</Zh></h2>
        <p><En>One realistic example using everything above at once:</En><Zh>一个综合运用上述所有知识点的实际示例：</Zh></p>
        <div className="capstone">
          <CodeBlock code={`// enum + union + interface
interface BootcampStudent {
  id: string;
  name: string;
  role: Role;
  status: HomeworkStatus;
}

// array of objects — the "database"
let db: BootcampStudent[] = [
  { id: "S1", name: "David", role: Role.User, status: "Pending" },
];

// generics + intersection — one reusable API envelope shape
interface ErrorHandling {
  success: boolean;
}
type ApiResponse<T> = { data: T } & ErrorHandling;

// function + non-null assertion
function completeHomework(studentId: string): ApiResponse<BootcampStudent> {
  // find() returns BootcampStudent | undefined — ! says "it's definitely there"
  let target = db.find((s) => s.id === studentId)!;
  target.status = "Completed";

  return { success: true, data: target };
}

let result = completeHomework("S1");
console.log(result.data.name + " is now " + result.data.status);
// David is now Completed`} language="typescript" />
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Piece</En><Zh>模块</Zh></th>
              <th><En>What it's using</En><Zh>使用的特性</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>BootcampStudent</code></td>
              <td><En>interface, enum (<code>Role</code>), union (<code>HomeworkStatus</code>)</En><Zh>interface、enum（<code>Role</code>）、union（<code>HomeworkStatus</code>）</Zh></td>
            </tr>
            <tr>
              <td><code>ApiResponse&lt;T&gt;</code></td>
              <td><En>generics + intersection</En><Zh>泛型 + 交叉类型</Zh></td>
            </tr>
            <tr>
              <td><code>completeHomework</code></td>
              <td><En>typed function, non-null assertion (<code>!</code>)</En><Zh>类型化函数、非空断言（<code>!</code>）</Zh></td>
            </tr>
          </tbody>
        </table>
      </section>



    </div>
  );
}
