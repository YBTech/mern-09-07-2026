import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 5 Notes</title>
      <DayNav day="day5-promises-apis" current="notes" />

      <header className="lecture-header">
        <p className="eyebrow">Week 1 · Day 5 · Notes</p>
        <h1>Promises &amp; APIs</h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心要点 → 完整讲解</Zh></p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心要点</Zh></h2>
        <p>
          <En>The essentials — the bare minimum you need to know for today</En>
          <Zh>今日必掌握的核心内容</Zh>
        </p>
        <ul>
          <li><En>Have a general idea of how the event loop works</En><Zh>大致了解事件循环（event loop）的工作原理</Zh></li>
          <li><En>Use <code>setTimeout</code> and <code>setInterval</code>.</En><Zh>会使用 <code>setTimeout</code> 和 <code>setInterval</code>。</Zh></li>
          <li><En>Explain what a <code>Promise</code> is</En><Zh>能解释 <code>Promise</code> 是什么</Zh></li>
          <li><En>Know <code>.then</code>/<code>.catch</code> exists, but proficiently use <code>async</code>/<code>await</code> to consume a promise.</En><Zh>了解 <code>.then</code>/<code>.catch</code> 的存在，但要熟练用 <code>async</code>/<code>await</code> 消费 promise。</Zh></li>
          <li><En>Know that Promises exist to solve "callback hell."</En><Zh>明白 Promise 是为了解决"回调地狱（callback hell）"而存在的。</Zh></li>
          <li><En>Know how <code>fetch</code> works — defaults to <code>GET</code>, a <code>POST</code> needs a second argument.</En><Zh>了解 <code>fetch</code> 的用法——默认发 <code>GET</code>，<code>POST</code> 需要传第二个参数。</Zh></li>
          <li><En>Know the difference between <code>fetch</code>'s promise and an ordinary promise.</En><Zh>能区分 <code>fetch</code> 返回的 promise 与普通 promise 的区别。</Zh></li>
          <li><En>Write an <code>async</code> function using <code>await</code>, with <code>try</code>/<code>catch</code>/<code>finally</code> for errors.</En><Zh>能写出使用 <code>await</code> 的 <code>async</code> 函数，并用 <code>try</code>/<code>catch</code>/<code>finally</code> 处理错误。</Zh></li>
          <li><En>Name the 5 HTTP methods and the common status codes (<code>200</code>, <code>201</code>, <code>3xx</code>, <code>400</code>, <code>401</code>, <code>404</code>, <code>5xx</code>).</En><Zh>能说出 5 种 HTTP 方法，以及常见状态码（<code>200</code>、<code>201</code>、<code>3xx</code>、<code>400</code>、<code>401</code>、<code>404</code>、<code>5xx</code>）的含义。</Zh></li>
          <li><En>Know the difference between <code>fetch</code> and <code>axios</code>.</En><Zh>了解 <code>fetch</code> 和 <code>axios</code> 的区别。</Zh></li>
        </ul>
        <p>
          <En>Want more? <a href="/src/day5-promises-apis/concepts.html">View all concepts?</a></En>
          <Zh>想深入了解？<a href="/src/day5-promises-apis/concepts.html">查看全部概念</a></Zh>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — Full Walkthrough                                  */}
      {/* ============================================================ */}
      <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

      <section id="event-loop">
        <h2><En>1. The event loop, very briefly</En><Zh>1. 事件循环，简要介绍</Zh></h2>
        <svg viewBox="0 0 640 300" role="img" aria-label="Diagram of the event loop: the call stack hands async work to the Web APIs, which queue a callback once done, and the event loop moves that callback back onto the call stack once it's empty.">
          <defs>
            <marker id="evloop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#444" />
            </marker>
          </defs>

          {/* Call Stack */}
          <rect x="20" y="40" width="140" height="220" rx="8" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="90" y="60" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1c1c1c">Call Stack</text>
          <rect x="35" y="195" width="110" height="30" rx="4" fill="#fff" stroke="#7ea6e0" />
          <text x="90" y="214" textAnchor="middle" fontSize="10" fill="#444">main()</text>
          <rect x="35" y="155" width="110" height="30" rx="4" fill="#fff" stroke="#7ea6e0" />
          <text x="90" y="174" textAnchor="middle" fontSize="10" fill="#444">doSomething()</text>
          <text x="90" y="245" textAnchor="middle" fontSize="9" fill="#5b6b82">sync code runs here</text>

          {/* Web APIs */}
          <rect x="460" y="20" width="160" height="70" rx="8" fill="#fff7e0" stroke="#e8b400" strokeWidth="1.5" />
          <text x="540" y="50" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1c1c1c">Web APIs</text>
          <text x="540" y="68" textAnchor="middle" fontSize="9" fill="#5b6b82">timers, fetch, DOM events</text>

          {/* Callback Queue */}
          <rect x="460" y="210" width="160" height="60" rx="8" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="1.5" />
          <text x="540" y="232" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Callback Queue</text>
          <rect x="478" y="244" width="16" height="16" rx="3" fill="#8e5fd6" />
          <rect x="502" y="244" width="16" height="16" rx="3" fill="#8e5fd6" />
          <rect x="526" y="244" width="16" height="16" rx="3" fill="#8e5fd6" />

          {/* 1. Call Stack -> Web APIs */}
          <path d="M160,70 Q320,10 460,55" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#evloop-arrow)" />
          <text x="300" y="28" textAnchor="middle" fontSize="10" fill="#444">1. hands off async call</text>

          {/* 2. Web APIs -> Callback Queue */}
          <path d="M540,90 L540,210" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#evloop-arrow)" />
          <text x="618" y="155" textAnchor="end" fontSize="10" fill="#444">2. done → queued</text>

          {/* 3. Callback Queue -> Call Stack, via the event loop */}
          <path d="M460,245 Q300,300 160,235" fill="none" stroke="#2255cc" strokeWidth="1.5" markerEnd="url(#evloop-arrow)" />
          <circle cx="300" cy="262" r="13" fill="none" stroke="#2255cc" strokeWidth="1.5" />
          <path d="M300,249 A13,13 0 1 1 288,262" fill="none" stroke="#2255cc" strokeWidth="1.5" markerEnd="url(#evloop-arrow)" />
          <text x="300" y="291" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2255cc">3. Event Loop</text>
          <text x="300" y="223" textAnchor="middle" fontSize="9" fill="#2255cc">pushes onto the stack once it's empty</text>
        </svg>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En>The <strong>call stack</strong> is where JS tracks which function is currently running — one thread, one stack, one thing at a time.</En><Zh><strong>调用栈（call stack）</strong>记录当前正在执行哪个函数——单线程、单栈、每次只做一件事。</Zh></li>
            <li><En>The <strong>callback queue</strong> holds callbacks (from <code>setTimeout</code>, a resolved fetch, a click) that are ready to run but are waiting their turn.</En><Zh><strong>回调队列（callback queue）</strong>存放已就绪但在等待执行机会的回调（来自 <code>setTimeout</code>、fetch 完成、点击事件等）。</Zh></li>
            <li><En>The <strong>event loop</strong> is the process that constantly checks: "is the call stack empty? If so, take the next thing off a queue and push it onto the stack." That's the whole mechanism that lets a single-threaded language handle async work without blocking.</En><Zh><strong>事件循环（event loop）</strong>不断检查："调用栈是否为空？是的话，把队列里的下一个回调推入栈中执行。"这就是单线程语言处理异步操作而不阻塞的全部机制。</Zh></li>
          </ul>
        </div>
        <p className="callout">
          <En>Two videos are worth watching once outside of class if this doesn't click immediately: "What
          the heck is the event loop anyway?" by Philip Roberts (JSConf EU), and "JavaScript Visualized
          — Event Loop, Web APIs, (Micro)task Queue."</En>
          <Zh>如果这部分还没完全理解，课后推荐看两个视频：Philip Roberts 在 JSConf EU 上讲的 "What the heck is the event loop anyway?"，以及 "JavaScript Visualized — Event Loop, Web APIs, (Micro)task Queue"。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="macro-micro">
        <h2><En>2. Macrotask vs. microtask (memorize this)</En><Zh>2. 宏任务 vs. 微任务（背下来）</Zh></h2>
        <div className="concept">
          <p className="concept-label"><En>Concept — this is 八股文, know it cold</En><Zh>概念——这是八股文，要背熟</Zh></p>
          <ul>
            <li><En><strong>Macrotasks</strong>: <code>setTimeout</code>, <code>setInterval</code>, UI events, full script execution. One macrotask runs per event-loop turn.</En><Zh><strong>宏任务（Macrotasks）</strong>：<code>setTimeout</code>、<code>setInterval</code>、UI 事件、脚本整体执行。每轮事件循环执行一个宏任务。</Zh></li>
            <li><En><strong>Microtasks</strong>: Promise callbacks (<code>.then</code>/<code>.catch</code>/<code>.finally</code>), <code>async</code>/<code>await</code> continuations. <strong>The entire microtask queue drains completely before the next macrotask runs</strong> — that's the one fact interviewers actually want to hear.</En><Zh><strong>微任务（Microtasks）</strong>：Promise 回调（<code>.then</code>/<code>.catch</code>/<code>.finally</code>）以及 <code>async</code>/<code>await</code> 的后续执行。<strong>所有微任务队列必须全部清空，才会执行下一个宏任务</strong>——这是面试官最想听到的那句话。</Zh></li>
          </ul>
        </div>
        <CodeBlock code={`console.log("1 — sync");

setTimeout(() => console.log("2 — macrotask"), 0);

Promise.resolve().then(() => console.log("3 — microtask"));

console.log("4 — sync");

// output: 1, 4, 3, 2 — sync code first, then ALL microtasks, then the next macrotask`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="timers">
        <h2><En>3. Timers: setTimeout, setInterval, and clearing them</En><Zh>3. 定时器：setTimeout、setInterval 及其清除</Zh></h2>
        <CodeBlock code={`const timeoutId = setTimeout(() => console.log("once, after 1s"), 1000);
clearTimeout(timeoutId); // cancels it before it ever fires

const intervalId = setInterval(() => console.log("every 1s"), 1000);
clearInterval(intervalId); // stops it from repeating`} language="typescript" />
        <p className="callout">
          <En><strong>Memory leak alert:</strong> an <code>setInterval</code> you never
          <code>clearInterval</code> keeps running (and keeping its closure alive) forever, even after
          the component or page state that started it is gone — always store the id and clear it.</En>
          <Zh><strong>内存泄漏警告：</strong>如果你启动了 <code>setInterval</code> 但从不调用 <code>clearInterval</code>，它会永远运行下去（并让闭包一直驻留内存），即使启动它的组件或页面状态已经销毁——务必保存 id 并在不需要时清除。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="promise-basics">
        <h2><En>4. Promise fundamentals</En><Zh>4. Promise 基础</Zh></h2>
        <p><En>A <code>Promise</code> wraps a value that isn't ready yet — it will eventually <strong>resolve</strong> (success) or <strong>reject</strong> (failure), and never both:</En><Zh><code>Promise</code> 封装了一个尚未就绪的值——它最终会 <strong>resolve</strong>（成功）或 <strong>reject</strong>（失败），且只会发生其中一种：</Zh></p>
        <CodeBlock code={`const coinFlip = new Promise((resolve, reject) => {
  const success = Math.random() > 0.5;
  if (success) {
    resolve("heads!");
  } else {
    reject("tails — try again");
  }
});

coinFlip
  .then(result => console.log("resolved:", result))
  .catch(err => console.log("rejected:", err))
  .finally(() => console.log("runs either way"));`} language="typescript" />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En><code>.then</code> runs only on success (<code>resolve</code>); its callback receives the resolved value.</En><Zh><code>.then</code> 只在成功（<code>resolve</code>）时执行，回调接收 resolve 的值。</Zh></li>
            <li><En><code>.catch</code> runs only on failure (<code>reject</code>); its callback receives the rejection reason.</En><Zh><code>.catch</code> 只在失败（<code>reject</code>）时执行，回调接收 reject 的原因。</Zh></li>
            <li><En><code>.finally</code> always runs, whether the promise resolved or rejected — no argument, used for cleanup (hiding a spinner, closing a connection).</En><Zh><code>.finally</code> 无论 resolve 还是 reject 都会执行——没有参数，用于清理操作（隐藏加载动画、关闭连接等）。</Zh></li>
          </ul>
        </div>
        <p className="callout">
          <En><strong>Don't confuse a plain promise with <code>fetch</code>'s promise.</strong>
          <code>coinFlip</code> above resolves with <code>"heads!"</code> directly — that string
          <em>is</em> the value. <code>fetch</code> is different: it resolves with a
          <code>Response</code> <em>object</em>, and reading the actual data is a second, separate
          async step — <code>res.json()</code>. Calling <code>.json()</code> on a plain promise like
          <code>coinFlip</code> is a real mistake beginners make, and it throws — there's no
          <code>Response</code> there to parse. More on this in section 11.</En>
          <Zh><strong>不要把普通 promise 和 <code>fetch</code> 返回的 promise 混淆。</strong>
          上面的 <code>coinFlip</code> resolve 时直接给出 <code>"heads!"</code> 字符串——那个字符串<em>就是</em>值本身。<code>fetch</code> 不同：它 resolve 的是一个 <code>Response</code> <em>对象</em>，读取实际数据需要额外的异步步骤——<code>res.json()</code>。在 <code>coinFlip</code> 这样的普通 promise 上调用 <code>.json()</code> 是初学者的常见错误，会直接抛出异常——那里没有 <code>Response</code> 可以解析。详见第 11 节。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="callback-hell">
        <h2><En>5. The old way: nested callbacks (conceptual only)</En><Zh>5. 旧方式：嵌套回调（仅作概念了解）</Zh></h2>
        <p><En>Before Promises, an async request tool looked like this — a callback you pass in, called whenever the response arrives:</En><Zh>在 Promise 出现之前，异步请求工具大概长这样——你传入一个回调，响应到达时被调用：</Zh></p>
        <CodeBlock code={`function request(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => callback(JSON.parse(xhr.responseText));
  xhr.send();
}`} language="typescript" />
        <p><En>Chaining three dependent requests with this style — each step needs data from the previous one — nests one callback inside the next:</En><Zh>用这种方式串联三个依赖请求——每一步都需要上一步的数据——会把回调一层层嵌套下去：</Zh></p>
        <CodeBlock code={`// step 1: get the user, to read their followers_url
// step 2: get their followers, to read the first follower's name
// step 3: get that follower's repos
request("https://api.github.com/users/octocat", user => {
  request(user.followers_url, followers => {
    const firstFollower = followers[0];
    request(firstFollower.repos_url, repos => {
      console.log("first follower's repos:", repos[0].name);
      // one more dependent step would nest even deeper...
    });
  });
});`} language="typescript" />
        <div className="concept">
          <p className="concept-label"><En>Concept — brief mention only</En><Zh>概念——简要了解即可</Zh></p>
          <ul>
            <li><En>This rightward-drifting pyramid is <strong>callback hell</strong>: every new dependent step nests one level deeper, making the code harder to read and to error-handle.</En><Zh>这种向右倾斜的金字塔结构就是<strong>回调地狱（callback hell）</strong>：每增加一个依赖步骤就多嵌套一层，代码越来越难以阅读和处理错误。</Zh></li>
            <li><En>You are not expected to build this pattern yourself today — just recognize it and know it's the reason Promises were added to the language.</En><Zh>今天不需要你自己写这种模式——只需认识它，知道这就是 Promise 被加入语言的原因。</Zh></li>
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      <section id="promise-with-fetch">
        <h2><En>6. The same pipeline, refactored to Promises + fetch</En><Zh>6. 同样的流程，用 Promise + fetch 重构</Zh></h2>
        <p><En><code>fetch</code> already returns a Promise, so the same three-step chain becomes flat <code>.then</code> calls instead of nested callbacks:</En><Zh><code>fetch</code> 本身就返回 Promise，所以同样的三步流程可以改写成平级的 <code>.then</code> 链，而不再需要嵌套回调：</Zh></p>
        <CodeBlock code={`fetch("https://api.github.com/users/octocat")
  .then(res => res.json())
  .then(user => {
    console.log("1. got user:", user.login);
    return fetch(user.followers_url);
  })
  .then(res => res.json())
  .then(followers => {
    console.log("2. got followers list");
    return fetch(followers[0].repos_url);
  })
  .then(res => res.json())
  .then(repos => console.log("3. first follower's repos:", repos[0].name))
  .catch(err => console.log("something failed:", err));`} language="typescript" />
        <p className="callout">
          <En><strong>Returning</strong> a promise inside a <code>.then</code> (like <code>return fetch(...)</code>)
          is what lets the chain keep flattening instead of nesting — the next <code>.then</code> waits
          for that returned promise, at the same indentation level.</En>
          <Zh>在 <code>.then</code> 里<strong>return</strong> 一个 promise（如 <code>return fetch(...)</code>）是让链式调用保持平级而非嵌套的关键——下一个 <code>.then</code> 会等待这个返回的 promise，且缩进级别不变。</Zh>
        </p>
        <p className="callout">
          <En>This is the last <code>.then</code> chain in these notes on purpose —
          <code>async</code>/<code>await</code>, covered next, is the pattern you should actually reach
          for. It's the same mechanism underneath, just far easier to read and to error-handle.</En>
          <Zh>这是本笔记中最后一个 <code>.then</code> 链——下一节介绍的 <code>async</code>/<code>await</code> 才是你应该优先使用的模式。底层机制完全相同，只是读起来更直观，错误处理也更简洁。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="async-await">
        <h2><En>7. async/await syntax (the preferred pattern)</En><Zh>7. async/await 语法（推荐写法）</Zh></h2>
        <p><En><code>async</code>/<code>await</code> is syntax sugar over Promises — same underlying mechanism, code that reads top-to-bottom like synchronous code:</En><Zh><code>async</code>/<code>await</code> 是 Promise 的语法糖——底层机制相同，但代码可以像同步代码一样从上到下阅读：</Zh></p>
        <CodeBlock code={`// .then version
function getUser(username) {
  return fetch(\`https://api.github.com/users/\${username}\`)
    .then(res => res.json())
    .then(user => user.login);
}

// async/await version — same behavior, reads like sync code
async function getUser(username) {
  const res = await fetch(\`https://api.github.com/users/\${username}\`);
  const user = await res.json();
  return user.login;
}`} language="typescript" />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En><code>await</code> can only be used inside a function marked <code>async</code> — it pauses that function (not the whole program) until the awaited promise settles.</En><Zh><code>await</code> 只能在标记为 <code>async</code> 的函数内使用——它会暂停该函数（而非整个程序），直到等待的 promise 完成。</Zh></li>
            <li><En>An <code>async</code> function always returns a promise itself, even if you <code>return</code> a plain value inside it.</En><Zh><code>async</code> 函数始终返回一个 promise，即使函数内部 <code>return</code> 的是普通值。</Zh></li>
            <li><En><code>await</code> doesn't turn JS multi-threaded — it's still one call stack; the function just steps aside so other queued work can run while it waits.</En><Zh><code>await</code> 不会让 JS 变成多线程——仍然是单调用栈；函数只是暂时"让位"，让队列中的其他任务得以运行。</Zh></li>
          </ul>
        </div>
        <p><En>Refactoring the earlier three-step <code>.then</code> chain (section 6) into <code>async</code>/<code>await</code>:</En><Zh>把前面第 6 节的三步 <code>.then</code> 链改写为 <code>async</code>/<code>await</code>：</Zh></p>
        <CodeBlock code={`async function getFirstFollowerRepos(username) {
  const userRes = await fetch(\`https://api.github.com/users/\${username}\`);
  const user = await userRes.json();
  console.log("1. got user:", user.login);

  const followersRes = await fetch(user.followers_url);
  const followers = await followersRes.json();
  console.log("2. got followers list");

  const reposRes = await fetch(followers[0].repos_url);
  const repos = await reposRes.json();
  console.log("3. first follower's repos:", repos[0].name);
}`} language="typescript" />
        <p className="callout">
          <En>No <code>.catch</code> here yet on purpose — <code>async</code>/<code>await</code> handles
          errors with <code>try</code>/<code>catch</code>/<code>finally</code> instead, covered next.</En>
          <Zh>这里暂时没有 <code>.catch</code> 是故意的——<code>async</code>/<code>await</code> 改用 <code>try</code>/<code>catch</code>/<code>finally</code> 来处理错误，下一节介绍。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="try-catch-finally">
        <h2><En>8. Error handling: try/catch/finally</En><Zh>8. 错误处理：try/catch/finally</Zh></h2>
        <CodeBlock code={`async function getUser(username) {
  try {
    const res = await fetch(\`https://api.github.com/users/\${username}\`);
    if (!res.ok) {
      throw new Error(\`Request failed: \${res.status}\`);
    }
    const user = await res.json();
    return user;
  } catch (err) {
    console.log("something went wrong:", err.message);
    return null;
  } finally {
    console.log("request attempt finished"); // always runs
  }
}`} language="typescript" />
        <p className="callout">
          <En><code>fetch</code> only rejects on a <strong>network</strong> failure — a 404 or 500 response
          still resolves successfully. Always check <code>res.ok</code> (or <code>res.status</code>)
          yourself and <code>throw</code> if it's not what you expected.</En>
          <Zh><code>fetch</code> 只在<strong>网络</strong>故障时 reject——404 或 500 响应仍然会 resolve 成功。你必须自己检查 <code>res.ok</code>（或 <code>res.status</code>），不符合预期时手动 <code>throw</code>。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="promise-statics">
        <h2><En>9. Built-in Promise methods</En><Zh>9. Promise 内置方法</Zh></h2>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Method</th>
              <th><En>Behavior</En><Zh>行为</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Promise.resolve(v)</code></td>
              <td><En>Wraps an already-known value in an already-resolved promise.</En><Zh>将一个已知值包装成一个立即 resolve 的 promise。</Zh></td>
            </tr>
            <tr>
              <td><code>Promise.all([...])</code></td>
              <td><En>Waits for every promise to resolve — <strong>rejects immediately</strong> if any one of them rejects.</En><Zh>等待所有 promise resolve——若任意一个 reject，则<strong>立即 reject</strong>。</Zh></td>
            </tr>
            <tr>
              <td><code>Promise.allSettled([...])</code></td>
              <td><En>Waits for every promise to <em>settle</em> (resolve or reject) and always resolves, with a status per item — nothing short-circuits.</En><Zh>等待所有 promise <em>完成</em>（resolve 或 reject），始终 resolve，每项附带状态——不会短路。</Zh></td>
            </tr>
            <tr>
              <td><code>Promise.race([...])</code></td>
              <td><En>Settles as soon as the <strong>first</strong> promise settles — win or lose, whichever finishes first.</En><Zh>以<strong>最先</strong>完成的 promise 的结果为准——无论成功还是失败，谁先完成听谁的。</Zh></td>
            </tr>
          </tbody>
        </table>
        <CodeBlock code={`// Promise.all — needs everything to succeed, fails fast on the first rejection
async function loadBoth() {
  try {
    const [usersRes, postsRes] = await Promise.all([fetch("/api/users"), fetch("/api/posts")]);
    console.log("both succeeded");
  } catch {
    console.log("at least one failed");
  }
}

// Promise.allSettled — always resolves, tells you which ones failed
async function loadBothSettled() {
  const results = await Promise.allSettled([fetch("/api/users"), fetch("/api/bad-url")]);
  results.forEach(r => console.log(r.status)); // "fulfilled" or "rejected"
}

// Promise.race — scenario: treat the request as failed if it hasn't replied in 3s
async function loadWithTimeout() {
  const res = await Promise.race([
    fetch("/api/data"),
    new Promise((_, reject) => setTimeout(() => reject("Timeout!"), 3000)),
  ]);
  return res;
}`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="http-crud">
        <h2><En>10. HTTP CRUD: methods &amp; status codes</En><Zh>10. HTTP CRUD：方法与状态码</Zh></h2>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Method</th>
              <th><En>Use it for</En><Zh>用途</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET</code></td>
              <td><En>Read data — no body, safe to repeat, safe to cache.</En><Zh>读取数据——无请求体，可重复，可缓存。</Zh></td>
            </tr>
            <tr>
              <td><code>POST</code></td>
              <td><En>Create a new resource — sends a body, not safe to repeat blindly (can create duplicates).</En><Zh>创建新资源——需要请求体，不能随意重复（可能产生重复数据）。</Zh></td>
            </tr>
            <tr>
              <td><code>PUT</code></td>
              <td><En>Replace a resource entirely — send the full object, safe to repeat.</En><Zh>完整替换一个资源——发送完整对象，可重复。</Zh></td>
            </tr>
            <tr>
              <td><code>PATCH</code></td>
              <td><En>Update part of a resource — send only the changed fields.</En><Zh>部分更新资源——只发送变更的字段。</Zh></td>
            </tr>
            <tr>
              <td><code>DELETE</code></td>
              <td><En>Remove a resource.</En><Zh>删除资源。</Zh></td>
            </tr>
          </tbody>
        </table>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Status code</En><Zh>状态码</Zh></th>
              <th><En>Meaning</En><Zh>含义</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>200</code></td>
              <td><En>OK — request succeeded.</En><Zh>OK——请求成功。</Zh></td>
            </tr>
            <tr>
              <td><code>201</code></td>
              <td><En>Created — a new resource was made (typical <code>POST</code> success).</En><Zh>Created——创建了新资源（<code>POST</code> 成功的典型响应）。</Zh></td>
            </tr>
            <tr>
              <td><code>3xx</code></td>
              <td><En>Redirect — the resource moved, follow the new location.</En><Zh>重定向——资源已移动，跟随新地址。</Zh></td>
            </tr>
            <tr>
              <td><code>400</code></td>
              <td><En>Bad Request — the request itself is malformed (bad body, missing field).</En><Zh>Bad Request——请求格式错误（请求体有误、缺少字段等）。</Zh></td>
            </tr>
            <tr>
              <td><code>401</code></td>
              <td><En>Unauthorized — you're not authenticated (not logged in / no valid token).</En><Zh>Unauthorized——未认证（未登录或没有有效 token）。</Zh></td>
            </tr>
            <tr>
              <td><code>404</code></td>
              <td><En>Not Found — that resource/URL doesn't exist.</En><Zh>Not Found——该资源或 URL 不存在。</Zh></td>
            </tr>
            <tr>
              <td><code>5xx</code></td>
              <td><En>Server Error — the server itself broke; not something wrong with your request.</En><Zh>Server Error——服务器自身出错，与你的请求无关。</Zh></td>
            </tr>
          </tbody>
        </table>
        <p><En>Sending a <code>POST</code> with <code>fetch</code>, using <code>async</code>/<code>await</code>:</En><Zh>用 <code>fetch</code> 和 <code>async</code>/<code>await</code> 发送 <code>POST</code> 请求：</Zh></p>
        <CodeBlock code={`async function createPost(title, body) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  console.log(res.status); // 201 on success
  return res.json();
}`} language="typescript" />
      </section>

      {/* ============================================================ */}
      <section id="fetch-vs-axios">
        <h2><En>11. fetch vs. axios, and <code>res.json()</code></En><Zh>11. fetch vs. axios，以及 <code>res.json()</code></Zh></h2>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><En><code>fetch</code> resolves with a <code>Response</code> object, not the data itself — you must call <code>.json()</code> (which is <em>itself</em> async) to read the body as parsed JSON.</En><Zh><code>fetch</code> resolve 的是 <code>Response</code> 对象，而非数据本身——你必须调用 <code>.json()</code>（它<em>本身</em>也是异步的）来将响应体解析为 JSON。</Zh></li>
            <li><En><code>axios</code> parses JSON automatically — the data you want is already on <code>response.data</code>, no second <code>await</code> needed.</En><Zh><code>axios</code> 自动解析 JSON——你要的数据已经在 <code>response.data</code> 上了，不需要第二次 <code>await</code>。</Zh></li>
            <li><En>You don't need <code>res.json()</code> at all for a response with no body (e.g. some <code>DELETE</code> responses) — calling it on an empty body throws.</En><Zh>对于没有响应体的请求（如部分 <code>DELETE</code> 响应），根本不需要 <code>res.json()</code>——在空响应体上调用它会抛异常。</Zh></li>
          </ul>
        </div>
        <CodeBlock code={`// fetch — two awaits
const res = await fetch("/api/users");
const data = await res.json();

// axios — one await, data is parsed for you already
const response = await axios.get("/api/users");
const data2 = response.data;`} language="typescript" />
        <p><En>For now, load <code>axios</code> the simple way — a <code>&lt;script&gt;</code> tag, giving you a global <code>axios</code> object (real ESM imports come later):</En><Zh>现在先用最简单的方式加载 <code>axios</code>——通过 <code>&lt;script&gt;</code> 标签，获得全局 <code>axios</code> 对象（ESM 导入方式后续再学）：</Zh></p>
        <CodeBlock code={`<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>`} language="xml" />
      </section>

      {/* ============================================================ */}
      <section id="json-methods">
        <h2><En>12. JSON.parse &amp; JSON.stringify</En><Zh>12. JSON.parse 与 JSON.stringify</Zh></h2>
        <CodeBlock code={`const obj = { name: "Ana", age: 25 };

const str = JSON.stringify(obj); // '{"name":"Ana","age":25}' — object to string
const back = JSON.parse(str); // { name: "Ana", age: 25 } — string back to object`} language="typescript" />
        <p className="callout">
          <En>A <code>fetch</code> body must be a <strong>string</strong>, never a raw object — that's why
          every JSON request body gets wrapped in <code>JSON.stringify(...)</code> before it's sent.</En>
          <Zh><code>fetch</code> 的请求体必须是<strong>字符串</strong>，不能是原始对象——这就是为什么每个 JSON 请求体在发送前都要用 <code>JSON.stringify(...)</code> 包装。</Zh>
        </p>
      </section>

      {/* ============================================================ */}
      <section id="capstone">
        <h2><En>13. Putting it together: async/await GitHub pipeline</En><Zh>13. 综合示例：async/await GitHub 数据流</Zh></h2>
        <p><En>The full three-step GitHub pipeline (sections 5–6), as one clean <code>async</code> function with real error handling:</En><Zh>将前面第 5–6 节的三步 GitHub 流程，整合为一个带完整错误处理的 <code>async</code> 函数：</Zh></p>
        <div className="capstone">
          <CodeBlock code={`async function getFirstFollowerRepos(username) {
  try {
    const userRes = await fetch(\`https://api.github.com/users/\${username}\`);
    if (!userRes.ok) throw new Error(\`user lookup failed: \${userRes.status}\`);
    const user = await userRes.json();
    console.log("1. got user:", user.login);

    const followersRes = await fetch(user.followers_url);
    const followers = await followersRes.json();
    if (followers.length === 0) throw new Error("no followers to look up");
    console.log("2. got followers list");

    const reposRes = await fetch(followers[0].repos_url);
    const repos = await reposRes.json();
    console.log("3. first follower's repos:", repos[0]?.name ?? "(none)");
    return repos;
  } catch (err) {
    console.log("pipeline failed:", err.message);
    return [];
  } finally {
    console.log("pipeline attempt finished");
  }
}`} language="typescript" />
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Piece</En><Zh>代码片段</Zh></th>
              <th><En>What it's using</En><Zh>用到了什么</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>the whole function</En><Zh>整个函数</Zh></td>
              <td><En><code>async</code>/<code>await</code> instead of nested callbacks or a <code>.then</code> chain</En><Zh>用 <code>async</code>/<code>await</code> 替代嵌套回调或 <code>.then</code> 链</Zh></td>
            </tr>
            <tr>
              <td><code>fetch(...)</code> + <code>.json()</code></td>
              <td><En>fetch returns a Response; <code>.json()</code> is a second async step to read the body</En><Zh>fetch 返回 Response 对象；<code>.json()</code> 是读取响应体的第二个异步步骤</Zh></td>
            </tr>
            <tr>
              <td><code>if (!res.ok) throw ...</code></td>
              <td><En>fetch doesn't reject on 4xx/5xx — you must check <code>res.ok</code> and throw yourself</En><Zh>fetch 不会在 4xx/5xx 时 reject——需要自己检查 <code>res.ok</code> 并手动 throw</Zh></td>
            </tr>
            <tr>
              <td><code>try</code>/<code>catch</code>/<code>finally</code></td>
              <td><En>catches any failure from any step in one place; <code>finally</code> always logs, success or not</En><Zh>在同一处捕获任意步骤的失败；<code>finally</code> 无论成功与否都会打印日志</Zh></td>
            </tr>
          </tbody>
        </table>
      </section>



    </div>
  );
}
