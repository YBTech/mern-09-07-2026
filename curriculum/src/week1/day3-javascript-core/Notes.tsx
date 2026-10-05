import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 3 Notes</title>
      <DayNav day="day3-javascript-core" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow"><En>Week 1 · Day 3 · Notes</En><Zh>第一周 · 第三天 · 笔记</Zh></p>
        <h1>JavaScript Core</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>执行摘要 → 完整讲解</Zh></p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 执行摘要</Zh></h2>
        <p>
          <En>The essentials — the bare minimum you need to know for today, not a
          highlights reel of the lecture:</En>
          <Zh>今天的核心要点——不是讲座的亮点集锦，而是你必须掌握的最低限度：</Zh>
        </p>
        <ul>
          <li><En>Explain primitive (pass-by-value) vs. reference (pass-by-reference) semantics, including what happens when an object/array is passed into a function.</En><Zh>解释原始类型（按值传递）与引用类型（按引用传递）的语义，包括将 object/array 传入函数时会发生什么。</Zh></li>
          <li><En>Build a mixed-type array and read a property from a nested object.</En><Zh>创建一个混合类型的 array，并读取嵌套 object 的属性。</Zh></li>
          <li><En>Shallow-copy an array and an object with spread, and confirm the original is untouched.</En><Zh>用 spread 对 array 和 object 做浅拷贝，并确认原始数据未被修改。</Zh></li>
          <li><En>Write an <code>if</code>/<code>else if</code>/<code>else</code> chain and a ternary expression.</En><Zh>写出 <code>if</code>/<code>else if</code>/<code>else</code> 链式判断和三元表达式。</Zh></li>
          <li><En>Write a <code>for</code> loop, including the <code>for...of</code> variant, over an array.</En><Zh>编写 <code>for</code> 循环，包括遍历 array 的 <code>for...of</code> 变体。</Zh></li>
          <li><En>Build a string with <code>+</code> concatenation and with a template literal.</En><Zh>用 <code>+</code> 拼接和模板字符串（template literal）两种方式构建字符串。</Zh></li>
          <li><En>Destructure properties out of an object.</En><Zh>从 object 中解构（destructure）属性。</Zh></li>
          <li><En>Know the difference between <code>==</code> and <code>===</code>, and use <code>===</code> by default.</En><Zh>了解 <code>==</code> 与 <code>===</code> 的区别，默认使用 <code>===</code>。</Zh></li>
          <li><En>Explain <code>let</code> vs. <code>const</code> — reassigning the binding vs. mutating what it points to.</En><Zh>解释 <code>let</code> 与 <code>const</code> 的区别——重新赋值绑定 vs. 修改它所指向的值。</Zh></li>
          <li><En>Use the core string methods: <code>toUpperCase</code>/<code>toLowerCase</code>, <code>charAt</code>, <code>split</code>, <code>substring</code>.</En><Zh>使用核心字符串方法：<code>toUpperCase</code>/<code>toLowerCase</code>、<code>charAt</code>、<code>split</code>、<code>substring</code>。</Zh></li>
        </ul>
        <p>
          <En>Want more? <a href="/src/day3-javascript-core/concepts.html">View all concepts?</a></En>
          <Zh>想了解更多？<a href="/src/day3-javascript-core/concepts.html">查看所有概念？</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — Full Walkthrough                                  */}
      {/* ============================================================ */}
      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

      <section id="primitives-references">
        <h2><En>1. Primitives vs. references (core!)</En><Zh>1. 原始类型与引用类型（核心！）</Zh></h2>
        <CodeBlock code={`let a = 10;
let b = a;        // copies the VALUE
b = 20;
console.log(a, b);   // 10 20 — fully independent

let arr1 = [1, 2, 3];
let arr2 = arr1;     // copies the REFERENCE — same array in memory
arr2.push(4);
console.log(arr1);       // [1, 2, 3, 4] — arr1 changed too!

function mutate(obj) {
  obj.name = "changed"; // mutates the SAME object the caller passed in
}
let person = { name: "Ada" };
mutate(person);
console.log(person.name); // "changed"`} language="typescript" />
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En>Primitives (<code>string</code>, <code>number</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>, <code>symbol</code>, <code>bigint</code>) are copied <strong>by value</strong> — each variable owns an independent copy.</En><Zh>原始类型（<code>string</code>、<code>number</code>、<code>boolean</code>、<code>null</code>、<code>undefined</code>、<code>symbol</code>、<code>bigint</code>）<strong>按值</strong>复制——每个变量都拥有一份独立的副本。</Zh></li>
            <li><En>Objects and arrays are copied <strong>by reference</strong> — the variable holds a pointer to the same data, so both variables see any mutation.</En><Zh>Object 和 array <strong>按引用</strong>复制——变量持有指向同一数据的指针，因此任一变量的修改对另一个都可见。</Zh></li>
            <li><En>This is exactly why passing an object/array into a function lets that function mutate the caller's data, while passing a primitive never does.</En><Zh>这正是为什么将 object/array 传入函数时，函数可以修改调用方的数据，而传入原始类型则不会。</Zh></li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      <section id="basics">
        <h2><En>2. Arrays, objects, and functions — the basics</En><Zh>2. Array、object 与函数——基础</Zh></h2>
        <CodeBlock code={`// array — create with [], access by index (0-based)
const fruits = ["apple", "banana", "cherry"];
console.log(fruits[0]); // "apple"

// object — create with {}, access with dot or bracket notation
const user = { name: "Ada", age: 36 };
console.log(user.name);    // "Ada" — dot notation
console.log(user["age"]); // 36 — bracket notation, key as a string

// nested object — chain the same access one level deeper
const company = { name: "Acme", address: { city: "Boston" } };
console.log(company.address.city); // "Boston"

// function — the \`function\` keyword, parameters, and a return value
function sum(a, b) {
  return a + b;
}
console.log(sum(2, 3)); // 5`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="equality">
        <h2><En>3. Equality comparison</En><Zh>3. 相等比较</Zh></h2>
        <CodeBlock code={`console.log(1 == "1");   // true  — coerces "1" to 1 first
console.log(1 === "1");  // false — different types, no coercion

console.log([] == []);   // false — two DIFFERENT array objects in memory
console.log({} == {});   // false — same reason

let refA = [1, 2];
let refB = refA;         // same reference, different variable name
console.log(refA === refB); // true — literally the same object`} language="typescript" />
        <p className="callout">
          <En>Objects and arrays only ever equal <em>themselves</em> — comparison checks reference
          identity, never structure. Two arrays with identical contents are still two different boxes
          in memory, so they're never <code>==</code> or <code>===</code> to each other.</En>
          <Zh>Object 和 array 只与<em>自身</em>相等——比较检查的是引用标识，而非内容结构。两个内容完全相同的 array 在内存中仍是两个不同的盒子，因此它们之间永远不会 <code>==</code> 或 <code>===</code>。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="copies">
        <h2><En>4. Shallow vs. deep copy</En><Zh>4. 浅拷贝与深拷贝</Zh></h2>
        <CodeBlock code={`const original = { title: "Draft", meta: { views: 10 } };

// shallow copy — only the TOP level is copied
const shallow = { ...original };
shallow.title = "Draft v2";        // fine — independent string
shallow.meta.views = 999;             // NOT fine — meta is still the SAME nested object
console.log(original.meta.views); // 999 — leaked through

// spread also OVERRIDES left-to-right — later keys win
const merged = { ...original, title: "Overridden" };
console.log(merged.title); // "Overridden"

// deep copy — walks the WHOLE structure, nothing is shared
const deep = structuredClone(original);
deep.meta.views = 1;
console.log(original.meta.views); // still 999, untouched`} language="typescript" />
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En>Spread (<code>{"{"}...obj{"}"}</code>/<code>[...arr]</code>) and <code>Object.assign</code> copy exactly <strong>one level</strong> deep — any nested object/array inside is still the same shared reference.</En><Zh>展开运算符（<code>{"{"}...obj{"}"}</code>/<code>[...arr]</code>）和 <code>Object.assign</code> 只复制<strong>第一层</strong>——内部嵌套的 object/array 仍然是与原始对象共享的同一引用。</Zh></li>
            <li><En><code>structuredClone(x)</code> is the modern, built-in deep clone — it walks the whole structure and handles <code>Date</code>, <code>Map</code>, <code>Set</code>, nested objects/arrays correctly. It still can't clone functions.</En><Zh><code>structuredClone(x)</code> 是现代内置的深克隆方法——它遍历整个结构，并正确处理 <code>Date</code>、<code>Map</code>、<code>Set</code> 及嵌套 object/array。但仍无法克隆函数。</Zh></li>
            <li><En>The older fallback, <code>JSON.parse(JSON.stringify(x))</code>, also deep-clones — but silently drops functions and <code>undefined</code> values, and turns <code>Date</code> objects into plain strings.</En><Zh>旧方法 <code>JSON.parse(JSON.stringify(x))</code> 也能深拷贝——但会静默丢弃函数和 <code>undefined</code> 值，并将 <code>Date</code> object 转为普通字符串。</Zh></li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      <section id="scope">
        <h2><En>5. Scope, <code>var</code>/<code>let</code>/<code>const</code>, hoisting</En><Zh>5. 作用域、<code>var</code>/<code>let</code>/<code>const</code> 与变量提升（hoisting）</Zh></h2>
        <CodeBlock code={`console.log(typeof hoistedVar); // "undefined" — var is hoisted AND initialized to undefined
var hoistedVar = 1;

console.log(typeof hoistedLet); // ReferenceError — hoisted but NOT initialized (temporal dead zone)
let hoistedLet = 1;`} language="typescript" />
        <CodeBlock code={`const person = { name: "Ada" };
person.name = "Grace"; // fine — mutating the object, not reassigning the binding
person = {};             // ✗ error — Assignment to constant variable`} language="typescript" good={[2]} bad={[3]} />
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En><code>var</code> is <strong>function-scoped</strong>, hoisted to the top of its function and initialized as <code>undefined</code> — reading it early just gives <code>undefined</code>, no error.</En><Zh><code>var</code> 是<strong>函数作用域</strong>，提升到所在函数顶部并初始化为 <code>undefined</code>——提前读取只会得到 <code>undefined</code>，不会报错。</Zh></li>
            <li><En><code>let</code>/<code>const</code> are <strong>block-scoped</strong>, hoisted but left uninitialized — reading either before its declaration line throws (the "temporal dead zone").</En><Zh><code>let</code>/<code>const</code> 是<strong>块级作用域</strong>，提升后处于未初始化状态——在声明行之前读取会抛出异常（即"暂时性死区"）。</Zh></li>
            <li><En><code>const</code> blocks reassigning the <em>binding</em>, not mutating the object/array it points to.</En><Zh><code>const</code> 阻止的是重新赋值<em>绑定</em>，而不是修改它所指向的 object/array 的内容。</Zh></li>
            <li><En>Global <code>var</code>s (and function declarations) attach to the <code>window</code> object; global <code>let</code>/<code>const</code> do not — that's part of why leaving things on <code>window</code> is a known memory-leak risk (nothing ever lets them get garbage-collected).</En><Zh>全局 <code>var</code>（及函数声明）会附加到 <code>window</code> 对象上；全局 <code>let</code>/<code>const</code> 则不会——这正是在 <code>window</code> 上留存数据是已知内存泄漏风险的原因之一（它们永远不会被垃圾回收）。</Zh></li>
          </ul>
        </div>
        <p className="callout">
          <En>Memory model, briefly: primitives live on the <strong>stack</strong> (fixed size, fast to
          copy). Objects/arrays live on the <strong>heap</strong> (variable size); the variable itself
          just holds a reference (pointer) to that heap location — which is the actual reason copying a
          reference doesn't copy the underlying data.</En>
          <Zh>内存模型简述：原始类型存储在<strong>栈（stack）</strong>上（固定大小，复制快）。Object/array 存储在<strong>堆（heap）</strong>上（可变大小）；变量本身只持有指向堆内存位置的引用（指针）——这正是复制引用不会复制底层数据的根本原因。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="conditionals">
        <h2><En>6. Control flow: conditionals</En><Zh>6. 控制流：条件判断</Zh></h2>
        <CodeBlock code={`if (age >= 18) {
  // ...
} else if (age >= 13) {
  // ...
} else {
  // ...
}

const label = isActive ? "Active" : "Inactive"; // ternary

const name = userName ?? "Guest"; // only falls back on null/undefined
const count = userCount || 10;  // falls back on ANY falsy value`} language="typescript" />
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En><code>??</code> (nullish coalescing) only replaces <code>null</code>/<code>undefined</code>.</En><Zh><code>??</code>（空值合并运算符）只替换 <code>null</code>/<code>undefined</code>。</Zh></li>
            <li><En><code>||</code> replaces <em>any</em> falsy value — including a real <code>0</code>, <code>""</code>, or <code>false</code> you actually wanted to keep. That's the classic bug <code>??</code> was added to fix.</En><Zh><code>||</code> 会替换<em>任何</em>假值——包括你实际想保留的 <code>0</code>、<code>""</code> 或 <code>false</code>。这正是引入 <code>??</code> 所要修复的经典 bug。</Zh></li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      <section id="loops">
        <h2><En>7. Control flow: loops</En><Zh>7. 控制流：循环</Zh></h2>
        <CodeBlock code={`for (let i = 0; i < 5; i++) {
  if (i === 3) continue; // skip just this iteration
  if (i === 4) break;    // stop the loop entirely
  console.log(i);
}

// for...of — a variation for iterating an array's VALUES directly, no index needed
const nums = [10, 20, 30];
for (const n of nums) {
  console.log(n); // 10, then 20, then 30
}

let tries = 0;
while (tries < 3) {
  tries++;
}`} language="typescript" />
        <CodeBlock code={`switch (day) {
  case "Sat":
  case "Sun":
    console.log("weekend");
    break;
  case "Mon":
    console.log("start of week");
    break;
  default:
    console.log("midweek");
}

// the classic switch bug — a missing break falls through into the next case
switch (grade) {
  case 1:
    result = "needs improvement"; // ✗ no break — also runs case 2 below
  case 2:
    result = "satisfactory";
    break; // ✓ stops here — only this case runs
}`} language="typescript" good={[18, 19]} bad={[16]} />
      </section>

      {/* ============================================================ */}
      <section id="error-handling">
        <h2><En>8. Error handling</En><Zh>8. 错误处理</Zh></h2>
        <CodeBlock code={`try {
  throw new Error("something broke");
} catch (err) {
  console.log(err.message); // "something broke"
} finally {
  console.log("always runs"); // runs whether try succeeded or threw
}`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="operators">
        <h2><En>9. Operators reference</En><Zh>9. 运算符参考</Zh></h2>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Category</En><Zh>类别</Zh></th>
              <th><En>Operators</En><Zh>运算符</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Arithmetic</En><Zh>算术</Zh></td>
              <td><code>+ - * / % += -= *= /=</code></td>
            </tr>
            <tr>
              <td><En>Comparison</En><Zh>比较</Zh></td>
              <td><code>== != === !== &gt; &lt; &gt;= &lt;=</code></td>
            </tr>
            <tr>
              <td><En>Logical</En><Zh>逻辑</Zh></td>
              <td><code>&amp;&amp; || !</code></td>
            </tr>
            <tr>
              <td><En>Unary</En><Zh>一元</Zh></td>
              <td><code>typeof + ++ --</code></td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label"><En>Concept</En><Zh>概念</Zh></p>
          <ul>
            <li><En><strong>Short-circuit evaluation:</strong> <code>&amp;&amp;</code> returns its first falsy operand (or the last one if none are falsy); <code>||</code> returns its first truthy operand. That's why <code>isLoggedIn &amp;&amp; showProfile()</code> only calls <code>showProfile()</code> when <code>isLoggedIn</code> is truthy — it's not just for booleans.</En><Zh><strong>短路求值（short-circuit evaluation）：</strong><code>&amp;&amp;</code> 返回第一个假值操作数（若均为真值则返回最后一个）；<code>||</code> 返回第一个真值操作数。这就是为什么 <code>isLoggedIn &amp;&amp; showProfile()</code> 只在 <code>isLoggedIn</code> 为真值时才调用 <code>showProfile()</code>——不只用于 boolean。</Zh></li>
            <li><En><strong>Type coercion:</strong> <code>1 + "1"</code> → <code>"11"</code> (a string is present, so <code>+</code> concatenates); <code>1 + 1</code> → <code>2</code> (both numbers, so <code>+</code> adds).</En><Zh><strong>类型强制转换（type coercion）：</strong><code>1 + "1"</code> → <code>"11"</code>（有字符串时 <code>+</code> 执行拼接）；<code>1 + 1</code> → <code>2</code>（两边均为数字时 <code>+</code> 执行加法）。</Zh></li>
          </ul>
        </div>
        <p className="callout">
          <En>Falsy values — everything else is truthy (including <code>"0"</code>, <code>"false"</code>,
          <code>[]</code>, and <code>{"{"}{"}"}</code>): <code>false</code>, <code>0</code>, <code>-0</code>,
          <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>.</En>
          <Zh>假值（falsy values）——其余所有值均为真值（truthy），包括 <code>"0"</code>、<code>"false"</code>、<code>[]</code> 和 <code>{"{"}{"}"}</code>：<code>false</code>、<code>0</code>、<code>-0</code>、<code>""</code>、<code>null</code>、<code>undefined</code>、<code>NaN</code>。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="strings">
        <h2><En>10. String operators &amp; methods</En><Zh>10. 字符串运算符与方法</Zh></h2>
        <CodeBlock code={`const first = "Ada";
const greetingA = "Hello, " + first + "!"; // concatenation
const greetingB = \`Hello, \${first}!\`;    // template literal — cleaner, multi-line safe

first.length;          // 3
first.charAt(0);       // "A"
first.substring(1, 3);  // "da"`} language="typescript" />
        <p className="callout">
          <En>Handy <code>console.log</code> tricks: <code>console.log("label:", value)</code> prints
          several values with commas between them; <code>console.table(arrayOfObjects)</code> renders
          a real table; <code>console.group()</code>/<code>console.groupEnd()</code> nests related logs.</En>
          <Zh><code>console.log</code> 实用技巧：<code>console.log("label:", value)</code> 可同时打印多个值；<code>console.table(arrayOfObjects)</code> 渲染成表格；<code>console.group()</code>/<code>console.groupEnd()</code> 可对相关日志分组嵌套。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="destructuring">
        <h2><En>11. Destructuring</En><Zh>11. 解构赋值（Destructuring）</Zh></h2>
        <CodeBlock code={`const [first, second] = [10, 20]; // array — by position

const person = { name: "Ada", age: 36 };
const { name, age } = person;         // object — by property name
const { name: fullName } = person;    // rename while destructuring`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="optional-chaining">
        <h2><En>12. Optional chaining</En><Zh>12. 可选链（Optional chaining）</Zh></h2>
        <CodeBlock code={`const city = user?.address?.city;              // undefined instead of throwing if address is missing
const cityOrDefault = user?.address?.city ?? "Unknown"; // combine with ?? for a default`} language="typescript" />
        <p className="callout">
          <En><code>?.</code> short-circuits to <code>undefined</code> the moment anything in the chain is
          <code>null</code>/<code>undefined</code>, instead of throwing — pairs naturally with
          <code>??</code> to supply a fallback in the same expression.</En>
          <Zh><code>?.</code> 在链式访问中遇到 <code>null</code>/<code>undefined</code> 时立即短路返回 <code>undefined</code>，而不是抛出异常——与 <code>??</code> 搭配使用，可在同一表达式中提供默认值。</Zh>
        </p>
      </section>



    </div>
  );
}
