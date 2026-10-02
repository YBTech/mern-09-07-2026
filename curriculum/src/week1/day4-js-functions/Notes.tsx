import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 4 Notes</title>
      <DayNav day="day4-js-functions" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow">Week 1 · Day 4 · Notes</p>
        <h1>JS Functions</h1>
        <p className="subtitle">
          <En>Executive summary → full walkthrough</En>
          <Zh>核心摘要 → 完整讲解</Zh>
        </p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2>
          <En>Section 1 — Executive Summary</En>
          <Zh>第一节 — 核心摘要</Zh>
        </h2>
        <p>
          <En>
            The essentials — the bare minimum you need to know for today, not a
            highlights reel of the lecture:
          </En>
          <Zh>核心内容——今天需要掌握的最低限度，不是课堂的精彩回放：</Zh>
        </p>
        <ul>
          <li>
            <En>Write a function as a declaration and as an arrow function with an explicit <code>return</code>, both typed, and explain the difference between <code>foo</code> (the function itself) and <code>foo()</code> (calling it).</En>
            <Zh>写出带类型的 function 声明和带显式 <code>return</code> 的 arrow function，并解释 <code>foo</code>（函数本身）和 <code>foo()</code>（调用它）的区别。</Zh>
          </li>
          <li>
            <En>Use a default parameter in a function signature.</En>
            <Zh>在函数签名中使用默认参数。</Zh>
          </li>
          <li>
            <En>Write a function that takes a callback and calls it — explain what a higher-order function and a callback are.</En>
            <Zh>写一个接收 callback（回调函数）并调用它的函数——解释什么是 higher-order function（高阶函数）和 callback。</Zh>
          </li>
          <li>
            <En>Use <code>forEach</code>, <code>map</code>, <code>filter</code>, <code>find</code>, and <code>includes</code> confidently.</En>
            <Zh>熟练使用 <code>forEach</code>、<code>map</code>、<code>filter</code>、<code>find</code> 和 <code>includes</code>。</Zh>
          </li>
          <li>
            <En>Use <code>push</code>, <code>pop</code>, <code>sort</code>, and <code>join</code> on an array.</En>
            <Zh>在数组上使用 <code>push</code>、<code>pop</code>、<code>sort</code> 和 <code>join</code>。</Zh>
          </li>
          <li>
            <En>Use the core string methods: <code>trim</code>, <code>toLowerCase</code>/<code>toUpperCase</code>, <code>split</code>, <code>includes</code>, <code>charAt</code>, <code>substring</code>.</En>
            <Zh>使用核心 string 方法：<code>trim</code>、<code>toLowerCase</code>/<code>toUpperCase</code>、<code>split</code>、<code>includes</code>、<code>charAt</code>、<code>substring</code>。</Zh>
          </li>
        </ul>
        <p>
          <En>Want more? <a href="/src/day4-js-functions/concepts.html">View all concepts?</a></En>
          <Zh>想了解更多？<a href="/src/day4-js-functions/concepts.html">查看所有概念</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — Full Walkthrough                                  */}
      {/* ============================================================ */}
      <h2 style={{ marginTop: "2.5rem" }}>
        <En>Section 2 — Full Walkthrough</En>
        <Zh>第二节 — 完整讲解</Zh>
      </h2>

      <section id="function-syntax">
        <h2>1. Function syntax: <code>foo</code> vs <code>foo()</code></h2>
        <p>
          <En>Three ways to write the same function:</En>
          <Zh>三种写同一个函数的方式：</Zh>
        </p>
        <CodeBlock code={`// 1. function declaration — hoisted, can be called before it's defined
function add(a, b) {
  return a + b;
}

// 2. function expression — a function stored in a variable
const subtract = function (a, b) {
  return a - b;
};

// 3. arrow function — shorter syntax, see section 3 for the return styles
const multiply = (a, b) => a * b;`} language="typescript" />
        <p className="callout">
          <En>
            <code>add</code> is the function itself — a value you can log, pass
            around, or store. <code>add()</code> <em>calls</em> it and gives you
            its return value instead.
          </En>
          <Zh>
            <code>add</code> 是函数本身——一个可以打印、传递或存储的值。<code>add()</code> <em>调用</em>它并返回其结果。
          </Zh>
        </p>
        <CodeBlock code={`console.log(add); // [Function: add] — the function's own definition
console.log(add(2, 3)); // 5 — the result of calling it`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="parameters">
        <h2>2. Parameters: default &amp; rest</h2>
        <CodeBlock code={`// default parameter — used only if the argument is omitted (or undefined)
function greet(name = "friend") {
  return \`Hello, \${name}!\`;
}
greet(); // "Hello, friend!"
greet("Sam"); // "Hello, Sam!"

// rest parameter — collects every remaining argument into a real array
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10`} language="typescript" />
        <div className="concept">
          <p className="concept-label">
            <En>Concept</En><Zh>概念</Zh>
          </p>
          <ul>
            <li>
              <En><code>...</code> is <strong>rest</strong> when it's collecting: in a parameter list, it gathers loose arguments into one array.</En>
              <Zh><code>...</code> 作为 <strong>rest</strong>（收集）时：在参数列表中，它将散列的参数收集进一个数组。</Zh>
            </li>
            <li>
              <En><code>...</code> is <strong>spread</strong> when it's expanding: <code>Math.max(...[1, 2, 3])</code> unpacks an array back into separate arguments.</En>
              <Zh><code>...</code> 作为 <strong>spread</strong>（展开）时：<code>Math.max(...[1, 2, 3])</code> 将数组展开为独立参数。</Zh>
            </li>
            <li>
              <En>Same syntax, opposite direction — rest packs values in, spread lays them back out.</En>
              <Zh>语法相同，方向相反——rest 把值装进来，spread 把值再展开出去。</Zh>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      <section id="arrow-functions">
        <h2>3. Arrow function return styles</h2>
        <CodeBlock code={`// implicit return — one expression, no braces, no \`return\` keyword
const square = n => n * n;

// explicit return — braces mean you must write \`return\` yourself
const squareVerbose = n => {
  return n * n;
};

// implicit return of an object — wrap it in parens so \`{ }\` isn't read as a function body
const makePoint = (x, y) => ({ x, y });

// explicit return of an object — no parens needed once you use \`return\`
const makePointVerbose = (x, y) => {
  return { x, y };
};`} language="typescript" />
        <p className="callout">
          <En>
            Forgetting the parens around an implicitly-returned object is the
            classic mistake: <code>n =&gt; {"{"} n {"}"}</code> is read as a function
            <em>body</em> containing the statement <code>n;</code>, not an object —
            it returns <code>undefined</code>.
          </En>
          <Zh>
            忘记给隐式返回的对象加括号是最常见的错误：<code>n =&gt; {"{"} n {"}"}</code> 被解读为包含语句 <code>n;</code> 的函数<em>体</em>，而不是对象——它返回 <code>undefined</code>。
          </Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="hof-callbacks">
        <h2>4. Higher-order functions &amp; callbacks</h2>
        <div className="concept">
          <p className="concept-label">
            <En>Concept</En><Zh>概念</Zh>
          </p>
          <ul>
            <li>
              <En>A <strong>higher-order function</strong> is any function that takes another function as an argument, returns one, or both.</En>
              <Zh>higher-order function（高阶函数）是指接收另一个函数作为参数、或返回一个函数、或两者兼有的函数。</Zh>
            </li>
            <li>
              <En>A <strong>callback</strong> is the function you hand over — it gets called <em>later</em>, by the higher-order function, not by you directly.</En>
              <Zh>callback（回调函数）是你传入的函数——它由高阶函数在之后调用，而不是由你直接调用。</Zh>
            </li>
            <li>
              <En><code>map</code>, <code>filter</code>, <code>reduce</code>, and <code>forEach</code> are all built-in HOFs — the function you pass them is the callback.</En>
              <Zh><code>map</code>、<code>filter</code>、<code>reduce</code> 和 <code>forEach</code> 都是内置的 HOF（高阶函数）——你传给它们的函数就是 callback。</Zh>
            </li>
          </ul>
        </div>
        <CodeBlock code={`// a HOF you write yourself
function repeat(n, callback) {
  for (let i = 0; i < n; i++) {
    callback(i); // repeat calls the callback — you don't call it yourself
  }
}
repeat(3, i => console.log("tick", i));`} language="typescript" />
        <p className="callout">
          <En>
            <code>repeat(callback)</code> passes the function itself — it runs
            later, when <code>repeat</code> decides to. <code>repeat(callback())</code>
            would call it <em>immediately</em> and pass its return value instead —
            almost never what you want for a callback.
          </En>
          <Zh>
            <code>repeat(callback)</code> 传入的是函数本身——它在 <code>repeat</code> 决定时才执行。<code>repeat(callback())</code> 会立即调用它并传入其返回值——几乎从不是你想要的 callback 写法。
          </Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="closures-scope">
        <h2>5. Closure &amp; the scope chain</h2>
        <div className="concept">
          <p className="concept-label">
            <En>Concept</En><Zh>概念</Zh>
          </p>
          <ul>
            <li>
              <En>A <strong>closure</strong> is a function that "remembers" the variables from the scope it was created in, even after that outer function has already finished running.</En>
              <Zh>closure（闭包）是一种函数，它能"记住"创建时所在 scope（作用域）中的变量，即使外层函数已经执行完毕。</Zh>
            </li>
            <li>
              <En>The <strong>scope chain</strong> is how a function looks up a variable it doesn't have locally: it checks its own scope first, then walks outward through each enclosing function's scope, and finally the global scope.</En>
              <Zh>scope chain（作用域链）是函数查找本地不存在的变量的方式：先检查自己的 scope，再逐层向外遍历每个外层函数的 scope，最后到全局 scope。</Zh>
            </li>
            <li>
              <En>Closures are what make the scope chain useful for more than lookup — they let an inner function keep a private reference to outer variables long-term.</En>
              <Zh>closure 让 scope chain 不只用于查找——它允许内层函数长期持有对外层变量的私有引用。</Zh>
            </li>
          </ul>
        </div>
        <CodeBlock code={`function outer() {
  let secret = "I persist";

  function inner() {
    console.log(secret); // found via the scope chain, not inner's own scope
  }
  return inner;
}

const fn = outer(); // outer() has already returned...
fn(); // ...but fn still remembers \`secret\` — that's the closure`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="private-variables">
        <h2>
          <En>6. Private variables: Counter I &amp; II</En>
          <Zh>6. 私有变量：计数器 I &amp; II</Zh>
        </h2>
        <p>
          <En>Closures are the classic way JS fakes a "private" variable — nothing outside the closure can reach it directly:</En>
          <Zh>closure 是 JS 模拟「private」变量的经典方式——closure 外部的代码无法直接访问它：</Zh>
        </p>
        <CodeBlock code={`// Counter I — one shared private variable, two functions that can touch it
function makeCounter() {
  let count = 0; // private — no outside code can read or set this directly

  return {
    increment: () => ++count,
    getValue: () => count,
  };
}

const counterA = makeCounter();
counterA.increment();
counterA.increment();
counterA.getValue(); // 2 — count itself is never exposed`} language="typescript" />
        <CodeBlock code={`// Counter II — reuse the same factory to reset, decrement, and stay independent per instance
function makeCounter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => (count = start),
    getValue: () => count,
  };
}

const counterB = makeCounter(10);
const counterC = makeCounter(); // a totally separate closure — its own private \`count\`
counterB.decrement();
counterC.increment();
counterB.getValue(); // 9
counterC.getValue(); // 1 — counterB and counterC never share state`} language="typescript" />
        <p className="callout">
          <En>
            <strong>Reuse functionality:</strong> <code>makeCounter</code> is a
            factory — call it as many times as you want and each call builds a
            brand-new, independent closure. That's the whole payoff over writing
            one counter by hand: the same function reuses the pattern for every
            instance.
          </En>
          <Zh>
            <strong>复用功能：</strong><code>makeCounter</code> 是一个工厂函数——随意调用多次，每次调用都会创建一个全新的独立 closure。这正是相比手写一个计数器的优势：同一个函数可以为每个实例复用这个模式。
          </Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="prototypes">
        <h2>7. Prototypes &amp; built-in methods</h2>
        <div className="concept">
          <p className="concept-label">
            <En>Concept</En><Zh>概念</Zh>
          </p>
          <ul>
            <li>
              <En>Every array/string/object in JS has a <strong>prototype</strong> — a shared object holding the built-in methods for that type.</En>
              <Zh>JS 中的每个 array/string/object 都有一个 <strong>prototype</strong>（原型）——一个包含该类型内置方法的共享对象。</Zh>
            </li>
            <li>
              <En>That's why <code>[1, 2, 3].map(...)</code> works on any array: <code>map</code> lives once on <code>Array.prototype</code>, not copied onto every array.</En>
              <Zh>这就是为什么 <code>[1, 2, 3].map(...)</code> 对任何 array 都有效：<code>map</code> 只存在于 <code>Array.prototype</code> 上，而不是复制到每个 array 上。</Zh>
            </li>
            <li>
              <En>You don't need to write your own prototypes today — just know this is <em>why</em> every array and string already comes with a full toolbox of methods, which is what the rest of this page is about.</En>
              <Zh>今天不需要自己写 prototype——只需了解这就是每个 array 和 string 都自带完整方法工具箱的<em>原因</em>，这也是本页后续内容的主题。</Zh>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      <section id="array-iteration">
        <h2>8. Array iteration: forEach, map, filter, find, includes, join</h2>
        <CodeBlock code={`const scores = [72, 88, 95, 60];

scores.forEach(s => console.log(s)); // just runs a callback per item, returns undefined

const curved = scores.map(s => s + 5); // [77, 93, 100, 65] — new array, same length

const passing = scores.filter(s => s >= 70); // [72, 88, 95] — new array, only matches

const firstFailing = scores.find(s => s < 70); // 60 — first match, or undefined

scores.includes(95); // true — does the array contain this value?

scores.join(", "); // "72, 88, 95, 60" — array to string, with a separator`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="reduce">
        <h2>9. <code>reduce</code>: sums, objects, frequency maps</h2>
        <p className="callout">
          <En>
            <code>reduce</code> walks the array once, carrying an
            <strong>accumulator</strong> forward from each call to the next —
            it's the one array method general enough to rebuild
            <code>map</code> or <code>filter</code> yourself if you had to.
          </En>
          <Zh>
            <code>reduce</code> 遍历数组一次，将 <strong>accumulator</strong>（累加器）从每次调用传递到下一次——它是唯一通用到足以让你手动重新实现 <code>map</code> 或 <code>filter</code> 的 array 方法。
          </Zh>
        </p>
        <CodeBlock code={`// sum of numbers
const total = [10, 20, 30].reduce((acc, n) => acc + n, 0);
// total = 60

// sum of a field across an array of objects
const cart = [{ price: 10 }, { price: 25 }, { price: 5 }];
const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
// cartTotal = 40

// frequency map — count how often each value shows up
const words = ["a", "b", "a", "c", "b", "a"];
const freq = words.reduce((acc, word) => {
  acc[word] = (acc[word] || 0) + 1;
  return acc;
}, {});
// freq = { a: 3, b: 2, c: 1 }`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="array-mutation">
        <h2>
          <En>10. Mutating vs. non-mutating array methods</En>
          <Zh>10. 修改原数组 vs. 不修改原数组的方法</Zh>
        </h2>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Mutates the original?</En><Zh>会修改原数组？</Zh></th>
              <th><En>Methods</En><Zh>方法</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong><En>Yes — mutates</En><Zh>是——会修改</Zh></strong></td>
              <td><code>push</code>, <code>pop</code>, <code>shift</code>, <code>unshift</code>, <code>reverse</code>, <code>sort</code>, <code>splice</code></td>
            </tr>
            <tr>
              <td><strong><En>No — returns a new array</En><Zh>否——返回新数组</Zh></strong></td>
              <td><code>slice</code>, <code>map</code>, <code>filter</code>, <code>flat</code>, <code>concat</code></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock code={`const nums = [3, 1, 2];

nums.push(4); // [3, 1, 2, 4] — nums itself changed
nums.pop(); // removes & returns 4, nums back to [3, 1, 2]
nums.unshift(0); // [0, 3, 1, 2] — adds to the front
nums.shift(); // removes & returns 0, nums back to [3, 1, 2]
nums.reverse(); // [2, 1, 3] — reversed in place

const nested = [1, [2, 3], [4, [5]]];
nested.flat(); // [1, 2, 3, 4, [5]] — one level deep by default
nested.flat(Infinity); // [1, 2, 3, 4, 5] — fully flattened`} language="typescript" />

        <h3>
          <En>Sort: numbers vs. objects</En>
          <Zh>Sort：数字 vs. 对象</Zh>
        </h3>
        <p className="callout">
          <En>
            <code>sort()</code> with no callback converts everything to a
            <strong>string</strong> first — <code>[10, 2, 1].sort()</code> gives
            <code>[1, 10, 2]</code>, not numeric order. Always pass a compare
            function for numbers.
          </En>
          <Zh>
            不带 callback 的 <code>sort()</code> 会先将所有元素转为 <strong>字符串</strong>——<code>[10, 2, 1].sort()</code> 返回 <code>[1, 10, 2]</code>，而不是数字顺序。对数字排序时，始终传入比较函数。
          </Zh>
        </p>
        <CodeBlock code={`const nums2 = [10, 2, 33, 1];
nums2.sort((a, b) => a - b); // [1, 2, 10, 33] — ascending
nums2.sort((a, b) => b - a); // [33, 10, 2, 1] — descending

const students = [
  { name: "Sam", score: 72 },
  { name: "Ana", score: 95 },
];
students.sort((a, b) => b.score - a.score); // Ana first — highest score first`} language="typescript" />

        <h3>
          <En>Slice: pagination</En>
          <Zh>Slice：分页</Zh>
        </h3>
        <CodeBlock code={`function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize); // doesn't touch the original array
}

const allUsers = ["A", "B", "C", "D", "E"];
paginate(allUsers, 1, 2); // ["A", "B"] — page 1
paginate(allUsers, 2, 2); // ["C", "D"] — page 2`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="strings">
        <h2>11. String methods</h2>
        <CodeBlock code={`const msg = "  Hello, World!  ";

msg.trim(); // "Hello, World!" — strips leading/trailing whitespace
msg.toLowerCase(); // "  hello, world!  "
msg.toUpperCase(); // "  HELLO, WORLD!  "
msg.includes("World"); // true

const clean = "Hello, World!";
clean.charAt(0); // "H" — the character at that index
clean.slice(7, 12); // "World" — supports negative indices, e.g. slice(-6)
clean.substring(7, 12); // "World" — like slice, but clamps negatives to 0
clean.split(", "); // ["Hello", "World!"] — string to array`} language="typescript" />
        <p className="callout">
          <En>
            <code>slice</code> works the same way on strings <em>and</em> arrays —
            same signature, same negative-index behavior. Learn it once.
          </En>
          <Zh>
            <code>slice</code> 在 string 和 array 上的用法完全相同——相同的签名，相同的负索引行为。学一次即可。
          </Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="capstone">
        <h2>
          <En>12. Putting it together: reusable grade tracker</En>
          <Zh>12. 综合应用：可复用的成绩追踪器</Zh>
        </h2>
        <p>
          <En>Closures for private state + a factory for reuse + array HOFs to work across many instances:</En>
          <Zh>closure 用于私有状态 + 工厂函数用于复用 + array HOF 操作多个实例：</Zh>
        </p>
        <div className="capstone">
          <CodeBlock code={`// factory + closure — every call makes its own private \`grades\` array
function makeGradeTracker(studentName) {
  let grades = []; // private — nothing outside this closure can reach it directly

  return {
    name: studentName,
    addGrade: grade => grades.push(grade),
    getAverage: () =>
      grades.length === 0
        ? 0
        : grades.reduce((sum, g) => sum + g, 0) / grades.length,
  };
}

// reuse: the same factory builds a whole roster, each with its own private state
const roster = ["Ana", "Sam", "Lee"].map(makeGradeTracker);

roster[0].addGrade(95);
roster[0].addGrade(88);
roster[1].addGrade(60);

// HOFs across the roster — filter, map, sort all built on the same tracker objects
const passing = roster.filter(student => student.getAverage() >= 70);
const summary = roster
  .map(student => (\`\${student.name}: \${student.getAverage()}\`))
  .join(" | ");
// "Ana: 91.5 | Sam: 60 | Lee: 0"`} language="typescript" />
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Piece</En><Zh>组成部分</Zh></th>
              <th><En>What it's using</En><Zh>用到的特性</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>makeGradeTracker</code></td>
              <td><En>closure + private variable (<code>grades</code>), factory function for reuse</En><Zh>closure + 私有变量（<code>grades</code>），工厂函数用于复用</Zh></td>
            </tr>
            <tr>
              <td><code>getAverage</code></td>
              <td><En>arrow function with a ternary, <code>reduce</code> for the sum</En><Zh>带三元运算符的 arrow function，用 <code>reduce</code> 求和</Zh></td>
            </tr>
            <tr>
              <td><code>roster</code></td>
              <td><En><code>map</code> to build many independent closures at once</En><Zh>用 <code>map</code> 一次性构建多个独立的 closure</Zh></td>
            </tr>
            <tr>
              <td><code>passing</code> / <code>summary</code></td>
              <td><En>higher-order functions: <code>filter</code>, <code>map</code>, <code>join</code> chained together</En><Zh>高阶函数：<code>filter</code>、<code>map</code>、<code>join</code> 链式调用</Zh></td>
            </tr>
          </tbody>
        </table>
      </section>



    </div>
  );
}
