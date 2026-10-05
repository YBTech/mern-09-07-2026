import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { En, Zh } from "../../components/Lang";
import { Link } from "react-router-dom";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 11 Notes</title>
      <DayNav day="day11-node-express" current="notes" />
      <h1>Day 11 — Node &amp; Express</h1>
      <p className="subtitle">
        <En>
          The first day of a five-day build: an Order Management &amp; Fulfillment
          API, starting from nothing but Express and an in-memory array.
        </En>
        <Zh>
          五天项目的第一天：从零开始，仅用 Express 和内存数组构建一个订单管理与履约 API。
        </Zh>
      </p>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心要点</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心要点——今天结束前你必须掌握的能力：</Zh></p>
        <ul>
          <li>
            <En>
              Drive a Node project from the terminal: <code>npm install</code>,{" "}
              <code>npm run dev</code>, stop a running server, and fix "port
              already in use"
            </En>
            <Zh>
              通过终端操作 Node 项目：<code>npm install</code>、<code>npm run dev</code>、停止运行中的服务器，以及解决"端口已被占用"的问题
            </Zh>
          </li>
          <li>
            <En>
              Explain what <code>package.json</code>, <code>node_modules</code>{" "}
              and the lockfile each are, and when something belongs in{" "}
              <code>dependencies</code> vs. <code>devDependencies</code>
            </En>
            <Zh>
              解释 <code>package.json</code>、<code>node_modules</code> 和 lockfile 各自的作用，以及何时应放入 <code>dependencies</code> 与 <code>devDependencies</code>
            </Zh>
          </li>
          <li>
            <En>
              Stand up an Express server with JSON body parsing and at least one
              route
            </En>
            <Zh>
              启动一个带有 JSON body 解析和至少一个路由的 Express 服务器
            </Zh>
          </li>
          <li>
            <En>
              Explain what Node's single-threaded event loop means for writing a
              server — why you don't block the thread
            </En>
            <Zh>
              解释 Node 单线程 event loop 对服务器编写的意义——为什么不能阻塞线程
            </Zh>
          </li>
          <li>
            <En>
              Describe the anatomy of an HTTP request and response — method, path,
              headers, body / status, headers, body — and inspect a real one in
              the browser's Network tab
            </En>
            <Zh>
              描述 HTTP 请求和响应的结构——method、path、headers、body / status、headers、body——并在浏览器 Network 面板中查看真实请求
            </Zh>
          </li>
          <li>
            <En>
              Send a request from a client with <code>fetch</code> and with{" "}
              <code>axios</code>: path params, query params, a JSON body, and a
              method other than <code>GET</code>
            </En>
            <Zh>
              用 <code>fetch</code> 和 <code>axios</code> 发送请求：path params、query params、JSON body，以及非 <code>GET</code> 方法
            </Zh>
          </li>
          <li>
            <En>
              Read that request in Express — destructure <code>req.params</code>,{" "}
              <code>req.query</code>, <code>req.body</code> and{" "}
              <code>req.headers</code>, and say which kind of information belongs
              in each
            </En>
            <Zh>
              在 Express 中读取请求——解构 <code>req.params</code>、<code>req.query</code>、<code>req.body</code> 和 <code>req.headers</code>，并说明各自承载什么类型的信息
            </Zh>
          </li>
          <li>
            <En>
              Design a REST resource by the actual principles: nouns not verbs,
              plural collections, the verb carries the action, sub-resources nest
            </En>
            <Zh>
              按照 REST 设计原则设计资源：用名词而非动词、集合用复数、用 HTTP verb 表达操作、子资源嵌套
            </Zh>
          </li>
          <li>
            <En>
              Pick the right status code (<code>200</code>/<code>201</code>/
              <code>204</code>/<code>400</code>/<code>401</code>/<code>403</code>/
              <code>404</code>/<code>409</code>/<code>500</code>)
            </En>
            <Zh>
              选择正确的状态码（<code>200</code>/<code>201</code>/<code>204</code>/<code>400</code>/<code>401</code>/<code>403</code>/<code>404</code>/<code>409</code>/<code>500</code>）
            </Zh>
          </li>
          <li>
            <En>
              Say which HTTP verbs are idempotent, give an example of each, and
              explain why a client retrying a request makes it matter
            </En>
            <Zh>
              说明哪些 HTTP verb 是幂等的，各举一个例子，并解释为什么客户端重试请求时幂等性很重要
            </Zh>
          </li>
          <li>
            <En>
              Return a consistent JSON error shape instead of letting a raw error
              leak out
            </En>
            <Zh>
              返回统一格式的 JSON 错误对象，而不是让原始错误直接泄露给客户端
            </Zh>
          </li>
        </ul>
        <p>
          <En>Want more?{" "}</En><Zh>想了解更多？{" "}</Zh>
          <Link to="/week3/day11-node-express/concepts">
            <En>View all concepts?</En><Zh>查看全部概念</Zh>
          </Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2 style={{ marginTop: "2.5rem" }}><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

        {/* ================================================================= */}
        {/* Part A — getting a project running                                 */}
        {/* ================================================================= */}
        <h3 className="part"><En>Part A — Getting a Node project running</En><Zh>Part A — 启动一个 Node 项目</Zh></h3>
        <p>
          <En>
            Before any of today's HTTP material, you need a project that starts.
            That's three things: a manifest, a terminal, and a server listening on
            a port.
          </En>
          <Zh>
            在学习今天的 HTTP 内容之前，你需要先让项目跑起来。这需要三样东西：配置文件、终端，以及一个监听端口的服务器。
          </Zh>
        </p>

        <h4 className="topic">
          A.1 <code>package.json</code>, npm, <En>and</En><Zh>与</Zh> <code>node_modules</code>
        </h4>
        <p>
          <En>
            Every Node project starts as one file describing it, and one command
            that reads it.
          </En>
          <Zh>
            每个 Node 项目都从一个描述文件和一条读取它的命令开始。
          </Zh>
        </p>
        <CodeBlock
          language="json"
          code={`{
  "name": "oms-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "tsx": "^4.16.0",
    "typescript": "^5.5.3"
  }
}`}
        />
        <div className="concept">
          <p className="concept-label"><En>Concept — the four moving parts</En><Zh>概念 — 四个核心组成部分</Zh></p>
          <ul>
            <li>
              <strong>
                <code>package.json</code>
              </strong>{" "}
              <En>
                — the project's manifest: its name, its scripts, and the packages
                it declares. This is the file you edit and commit.
              </En>
              <Zh>
                — 项目的配置文件：包含名称、脚本和依赖声明。这是你编辑并提交到版本库的文件。
              </Zh>
            </li>
            <li>
              <strong>
                <code>node_modules/</code>
              </strong>{" "}
              <En>
                — where <code>npm install</code> downloads those packages, plus
                everything they themselves depend on. It's generated, it's
                enormous, and it is never committed (it's in{" "}
                <code>.gitignore</code>).
              </En>
              <Zh>
                — <code>npm install</code> 下载依赖包及其所有传递依赖的目录。它是自动生成的，体积庞大，永远不提交到版本库（已加入 <code>.gitignore</code>）。
              </Zh>
            </li>
            <li>
              <strong>
                <code>package-lock.json</code>
              </strong>{" "}
              <En>
                — the exact version of every package that got installed,
                transitive ones included. This <em>is</em> committed: it's what
                makes your machine and the CI server install byte-identical trees.
              </En>
              <Zh>
                — 记录每个已安装包（含传递依赖）的精确版本。这个文件<em>需要</em>提交：它保证你的机器和 CI 服务器安装完全相同的依赖树。
              </Zh>
            </li>
            <li>
              <strong><En>Scripts</En><Zh>Scripts（脚本）</Zh></strong>{" "}
              <En>
                — named shell commands.{" "}
                <code>npm run dev</code> runs the <code>dev</code> entry, so
                nobody has to remember the real command.
              </En>
              <Zh>
                — 命名的 shell 命令。<code>npm run dev</code> 执行 <code>dev</code> 对应的命令，这样就不需要记住实际的完整命令了。
              </Zh>
            </li>
          </ul>
        </div>

        <CodeBlock
          language="bash"
          code={`npm init -y                  # create a package.json from nothing
npm install express          # add a runtime dependency, save it to package.json
npm install -D typescript    # add a DEV dependency (-D = --save-dev)
npm install                  # install everything package.json already declares
npm ci                       # install strictly from the lockfile — what CI/deploy uses
npm run dev                  # run the "dev" script
npm ls express               # which version is actually installed, and why`}
        />

        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>
                <code>dependencies</code>
              </th>
              <th>
                <code>devDependencies</code>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Needed</En><Zh>需要时机</Zh></td>
              <td><En>At runtime, in production</En><Zh>运行时，生产环境</Zh></td>
              <td><En>Only while developing or building</En><Zh>仅在开发或构建阶段</Zh></td>
            </tr>
            <tr>
              <td><En>Examples</En><Zh>示例</Zh></td>
              <td>
                <code>express</code>, <code>pg</code>, <code>zod</code>
              </td>
              <td>
                <code>typescript</code>, <code>tsx</code>, <code>@types/*</code>
                , <En>test runners</En><Zh>测试运行器</Zh>
              </td>
            </tr>
            <tr>
              <td><En>Shipped in the Docker image?</En><Zh>打入 Docker 镜像？</Zh></td>
              <td><En>Yes</En><Zh>是</Zh></td>
              <td>
                <En>No — <code>npm ci --omit=dev</code> skips them</En>
                <Zh>否 — <code>npm ci --omit=dev</code> 会跳过它们</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            Put a package your running server imports in <code>dependencies</code>
            . Getting this backwards works perfectly on your machine and crashes
            on deploy with "Cannot find module" — a classic day-one production
            bug.
          </En>
          <Zh>
            服务器运行时 import 的包要放在 <code>dependencies</code> 里。搞反了在本机跑得好好的，部署时会报 "Cannot find module"——这是经典的上线第一天 bug。
          </Zh>
        </p>

        <p>
          <En>
            The caret in <code>"express": "^4.19.2"</code> is a version{" "}
            <em>range</em>, not a version:
          </En>
          <Zh>
            <code>"express": "^4.19.2"</code> 中的 ^ 是版本<em>范围</em>，不是固定版本：
          </Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`4.19.2     MAJOR.MINOR.PATCH
^4.19.2    any 4.x.x at or above 4.19.2  — breaking changes excluded  (npm's default)
~4.19.2    any 4.19.x at or above 4.19.2 — patches only
4.19.2     exactly this version

MAJOR  breaking change      MINOR  new feature, backwards compatible      PATCH  bug fix`}
        />

        <h4 className="topic"><En>A.2 Living in the terminal</En><Zh>A.2 在终端中工作</Zh></h4>
        <CodeBlock
          language="bash"
          code={`cd oms-api            # move into the project folder — run npm commands from here
npm run dev           # start the server; it keeps running and holds the terminal
                      # Ctrl+C  stop it  (Mac and Windows alike — not Cmd+C)
node --version        # confirm which Node you're on
lsof -i :3000         # Mac/Linux: what is holding port 3000
netstat -ano | findstr :3000   # Windows: same question`}
        />
        <p className="callout">
          <En>
            <code>EADDRINUSE: address already in use :::3000</code> means a
            previous server is still running — you closed the tab without stopping
            it. Find it with the command above and kill it, or change the port;
            don't restart your machine.
          </En>
          <Zh>
            <code>EADDRINUSE: address already in use :::3000</code> 说明有一个旧服务器还在运行——你关了标签页但没有停止它。用上面的命令找到它并杀掉，或者换一个端口；不要重启电脑。
          </Zh>
        </p>
        <div className="concept">
          <p className="concept-label">
            <En>Concept — terminal habits worth having by tonight</En>
            <Zh>概念 — 今晚就该养成的终端习惯</Zh>
          </p>
          <ul>
            <li>
              <En>
                A long-running process (a dev server) <strong>owns</strong> that
                terminal until you stop it. Open a second tab for other commands
                rather than killing it.
              </En>
              <Zh>
                长时间运行的进程（如开发服务器）<strong>独占</strong>那个终端，直到你停止它。开第二个标签页执行其他命令，而不是杀掉它。
              </Zh>
            </li>
            <li>
              <En>
                Read the <em>first</em> error line, not the last. The stack
                trace's top frame is usually your file; everything below is
                library code.
              </En>
              <Zh>
                看报错的<em>第一行</em>，不是最后一行。stack trace 最上面的帧通常是你的文件；下面的都是库代码。
              </Zh>
            </li>
            <li>
              <En>
                The terminal prints the URL the server is listening on — open
                that, don't guess the port.
              </En>
              <Zh>
                终端会打印服务器监听的 URL——直接打开它，不要猜端口号。
              </Zh>
            </li>
            <li>
              <En>
                Up-arrow replays the last command; <code>Ctrl+C</code> stops,{" "}
                <code>Ctrl+L</code> clears the screen.
              </En>
              <Zh>
                上方向键重复上一条命令；<code>Ctrl+C</code> 停止进程，<code>Ctrl+L</code> 清屏。
              </Zh>
            </li>
          </ul>
        </div>

        <h4 className="topic"><En>A.3 Standing up the Express server</En><Zh>A.3 启动 Express 服务器</Zh></h4>
        <p>
          <En>
            <code>express.json()</code> is what turns a raw request body into{" "}
            <code>req.body</code> — skip it and every POST/PATCH body comes
            through as <code>undefined</code>.
          </En>
          <Zh>
            <code>express.json()</code> 负责将原始请求 body 解析成 <code>req.body</code>——不加它，所有 POST/PATCH 的 body 都会是 <code>undefined</code>。
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`import express from "express";

const app = express();
app.use(express.json());            // parse JSON request bodies into req.body

app.get("/health", (req, res) => {  // one route, so there's something to hit
  res.status(200).json({ status: "ok" });
});

app.listen(3000, () => {
  console.log("Order API listening on http://localhost:3000");
});`}
        />
        <p className="callout">
          <En>
            That's a complete, runnable server. <code>npm run dev</code>, then
            open <code>http://localhost:3000/health</code> — everything else today
            is adding routes to this.
          </En>
          <Zh>
            这就是一个完整可运行的服务器。执行 <code>npm run dev</code>，然后打开 <code>http://localhost:3000/health</code>——今天剩余的内容都是在此基础上添加路由。
          </Zh>
        </p>

        {/* ================================================================= */}
        {/* Part B — the event loop                                            */}
        {/* ================================================================= */}
        <h3 className="part">
          <En>Part B — How Node runs your code: the event loop</En>
          <Zh>Part B — Node 如何运行你的代码：event loop</Zh>
        </h3>
        <p>
          <En>
            You now have a server. Everything about how it behaves under load
            comes from one fact: your JavaScript runs on a{" "}
            <strong>single thread</strong>.
          </En>
          <Zh>
            你现在有了一个服务器。它在高负载下的所有行为都源于一个事实：你的 JavaScript 运行在<strong>单线程</strong>上。
          </Zh>
        </p>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>
                One blocking call — a huge synchronous loop, a synchronous file
                read — freezes <em>every</em> other request being handled at the
                same time, not just the one that made it.
              </En>
              <Zh>
                一次阻塞调用——一个庞大的同步循环、一次同步文件读取——会冻结<em>所有</em>正在处理的请求，而不仅仅是发起该调用的那一个。
              </Zh>
            </li>
            <li>
              <En>
                I/O (a database query, a file read, a network call) is handed off
                to the system, and Node moves on to the next thing on its queue
                while that I/O is in flight.
              </En>
              <Zh>
                I/O（数据库查询、文件读取、网络调用）会被交给操作系统处理，Node 在等待期间继续处理队列中的下一个任务。
              </Zh>
            </li>
            <li>
              <En>
                The event loop is what picks the finished I/O work back up and
                runs its callback — that's why <code>await</code> doesn't block
                the thread while "waiting," it just yields back to the loop until
                the result is ready.
              </En>
              <Zh>
                event loop 负责拾取已完成的 I/O 并执行其回调——这就是为什么 <code>await</code> 在"等待"时不会阻塞线程，它只是把控制权交还给 event loop，直到结果就绪。
              </Zh>
            </li>
            <li>
              <En>
                This is why a Node server can handle thousands of concurrent
                connections on one thread: it's rarely actually <em>computing</em>{" "}
                anything, it's mostly waiting on I/O, and waiting is free.
              </En>
              <Zh>
                这就是为什么 Node 服务器能用单线程处理数千个并发连接：它很少真正在<em>计算</em>，大部分时间都在等待 I/O，而等待本身不消耗 CPU。
              </Zh>
            </li>
          </ul>
        </div>
        <CodeBlock
          language="typescript"
          code={`app.get("/blocking", (req, res) => {
  const start = Date.now();
  while (Date.now() - start < 5000) { /* busy-wait: the thread is stuck here */ }
  res.status(200).json({ done: true });   // every OTHER request waits 5s too
});

app.get("/non-blocking", async (req, res) => {
  const rows = await db.query("SELECT * FROM orders");  // yields to the event loop
  res.status(200).json(rows);             // other requests are served while this waits
});`}
        />
        <p className="callout">
          <En>
            Try it: hit <code>/blocking</code> in one tab, then{" "}
            <code>/health</code> in another immediately after. The second request
            hangs until the first finishes — that's the whole lesson in one
            experiment.
          </En>
          <Zh>
            动手试试：在一个标签页访问 <code>/blocking</code>，立刻在另一个标签页访问 <code>/health</code>。第二个请求会挂起直到第一个完成——这一个实验就讲清楚了所有道理。
          </Zh>
        </p>

        {/* ================================================================= */}
        {/* Part C — requests and responses                                    */}
        {/* ================================================================= */}
        <h3 className="part"><En>Part C — Requests and responses</En><Zh>Part C — 请求与响应</Zh></h3>
        <p>
          <En>
            You've been <em>sending</em> HTTP since week 1's <code>fetch</code>.
            Today you're on the receiving end, so it's worth seeing both halves at
            once: the call a client writes, what that turns into on the wire, and
            how Express reads it back out.
          </En>
          <Zh>
            从第一周用 <code>fetch</code> 开始你就一直在<em>发送</em> HTTP 请求。今天你站在接收端，所以值得同时看清两个方向：客户端写的代码、它在网络上传输的格式，以及 Express 如何将其读取出来。
          </Zh>
        </p>

        <h4 className="topic"><En>C.1 One request, three views</En><Zh>C.1 同一个请求的三种视角</Zh></h4>
        <p>
          <En>
            This is the same single request, shown as the client writes it and as
            it travels:
          </En>
          <Zh>
            下面是同一个请求，分别以客户端代码和网络传输两种形式展示：
          </Zh>
        </p>

        <p className="compare-label"><En>1 — What the client writes</En><Zh>1 — 客户端写的代码</Zh></p>
        <CodeBlock
          language="typescript"
          code={`await fetch("http://localhost:3000/orders?notify=true", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ customerId: 4, items: [{ productId: 2, quantity: 3 }] }),
});`}
        />

        <p className="compare-label"><En>2 — What actually travels to the server</En><Zh>2 — 实际发送到服务器的内容</Zh></p>
        <CodeBlock
          language="plaintext"
          code={`POST /orders?notify=true HTTP/1.1          <- method, path + query string, version
Host: localhost:3000                       <- headers: metadata about the request
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{"customerId": 4, "items": [{"productId": 2, "quantity": 3}]}   <- body`}
        />

        <p className="compare-label"><En>3 — What comes back</En><Zh>3 — 服务器返回的内容</Zh></p>
        <CodeBlock
          language="plaintext"
          code={`HTTP/1.1 201 Created                       <- status code + reason
Content-Type: application/json             <- headers
Location: /orders/17

{"id": 17, "customerId": 4, "status": "placed"}                 <- body`}
        />
        <p className="callout">
          <En>
            You'll almost never write view 2 by hand — but it's what the Network
            tab shows you, so being able to read it is what makes debugging fast.
          </En>
          <Zh>
            你几乎不需要手写第二种格式——但 Network 面板展示的就是它，能读懂它才能快速调试。
          </Zh>
        </p>

        <h4 className="topic">
          <En>C.2 Sending a request: <code>fetch</code> and <code>axios</code></En>
          <Zh>C.2 发送请求：<code>fetch</code> 与 <code>axios</code></Zh>
        </h4>
        <p>
          <En>
            Same four things every time: the method, the URL, the headers, the
            body.
          </En>
          <Zh>
            每次都是这四样：method、URL、headers、body。
          </Zh>
        </p>

        <p className="compare-label"><En>GET — path param and query params</En><Zh>GET — path param 与 query params</Zh></p>
        <CodeBlock
          language="typescript"
          code={`const orderId = 17;

// fetch — you build the query string yourself
const params = new URLSearchParams({ status: "placed", limit: "20" });
const res = await fetch(\`http://localhost:3000/orders?\${params}\`);  // /orders?status=placed&limit=20
if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);      // fetch does NOT throw on 404/500
const orders = await res.json();                                     // body is a stream — parse it

// a path param is just string interpolation into the URL
const one = await fetch(\`http://localhost:3000/orders/\${orderId}\`);

// axios — params object becomes the query string, JSON is parsed for you
const { data } = await axios.get("http://localhost:3000/orders", {
  params: { status: "placed", limit: 20 },                           // ?status=placed&limit=20
});`}
        />

        <p className="compare-label"><En>POST — sending a JSON body</En><Zh>POST — 发送 JSON body</Zh></p>
        <CodeBlock
          language="typescript"
          code={`// fetch — method, Content-Type and JSON.stringify are all manual
const res = await fetch("http://localhost:3000/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },   // omit this and req.body is undefined
  body: JSON.stringify({ customerId: 4, items: [{ productId: 2, quantity: 3 }] }),
});
const created = await res.json();

// axios — the header and the stringify are automatic; the 2nd argument IS the body
const { data: created2 } = await axios.post("http://localhost:3000/orders", {
  customerId: 4,
  items: [{ productId: 2, quantity: 3 }],
});`}
        />

        <p className="compare-label"><En>PATCH, DELETE, and a custom header</En><Zh>PATCH、DELETE 与自定义 header</Zh></p>
        <CodeBlock
          language="typescript"
          code={`await fetch(\`http://localhost:3000/orders/\${orderId}/status\`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Idempotency-Key": "order-4-attempt-1",          // any custom header goes here
  },
  body: JSON.stringify({ status: "shipped" }),
});

await fetch(\`http://localhost:3000/orders/\${orderId}\`, { method: "DELETE" });

// axios: body is the 2nd argument, options the 3rd
await axios.patch(\`http://localhost:3000/orders/\${orderId}/status\`, { status: "shipped" });
await axios.delete(\`http://localhost:3000/orders/\${orderId}\`);`}
        />

        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>
                <code>fetch</code>
              </th>
              <th>
                <code>axios</code>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Install</En><Zh>安装</Zh></td>
              <td><En>Built in — nothing to add</En><Zh>内置——无需安装</Zh></td>
              <td>
                <code>npm install axios</code>
              </td>
            </tr>
            <tr>
              <td><En>Query string</En><Zh>Query string</Zh></td>
              <td>
                <En>You build it (<code>URLSearchParams</code>)</En>
                <Zh>手动构建（<code>URLSearchParams</code>）</Zh>
              </td>
              <td>
                <code>params:</code> <En>object</En><Zh>对象</Zh>
              </td>
            </tr>
            <tr>
              <td><En>JSON body</En><Zh>JSON body</Zh></td>
              <td>
                <En><code>JSON.stringify</code> + <code>Content-Type</code> by hand</En>
                <Zh>手动 <code>JSON.stringify</code> + 设置 <code>Content-Type</code></Zh>
              </td>
              <td><En>Pass the object; both are automatic</En><Zh>传入对象即可，两者都自动处理</Zh></td>
            </tr>
            <tr>
              <td><En>Parsing the response</En><Zh>解析响应</Zh></td>
              <td>
                <code>await res.json()</code>
              </td>
              <td>
                <code>res.data</code><En>, already parsed</En><Zh>，已自动解析</Zh>
              </td>
            </tr>
            <tr>
              <td><En>A 404 or 500</En><Zh>404 或 500</Zh></td>
              <td>
                <En>
                  <strong>Resolves normally</strong> — you must check{" "}
                  <code>res.ok</code>
                </En>
                <Zh>
                  <strong>正常 resolve</strong>——必须手动检查 <code>res.ok</code>
                </Zh>
              </td>
              <td>
                <En>Throws, so <code>try/catch</code> catches it</En>
                <Zh>会抛出异常，<code>try/catch</code> 可以捕获</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            The <code>res.ok</code> row is the one that bites. <code>fetch</code>{" "}
            only rejects when the request never happened (DNS failure, connection
            refused) — a <code>500</code> is a perfectly successful round trip as
            far as it's concerned.
          </En>
          <Zh>
            <code>res.ok</code> 那一行是最容易踩坑的地方。<code>fetch</code> 只有在请求根本没有发出时（DNS 失败、连接被拒绝）才会 reject——对它来说，收到 <code>500</code> 也算一次完全成功的往返。
          </Zh>
        </p>

        <h4 className="topic"><En>C.3 Reading the request in Express</En><Zh>C.3 在 Express 中读取请求</Zh></h4>
        <p>
          <En>
            Four places a request carries data, and four properties that read
            them. Destructure what you need out of each:
          </En>
          <Zh>
            请求携带数据的四个位置，对应四个读取属性。按需解构即可：
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// PATCH /orders/17/items/3?notify=true    body: { "quantity": 5 }
app.patch("/orders/:id/items/:itemId", (req, res) => {
  const { id, itemId } = req.params;            // from the URL path — ALWAYS strings
  const { notify } = req.query;                 // from ?notify=true — also always strings
  const { quantity } = req.body;                // from the JSON body — real types (number here)
  const key = req.headers["idempotency-key"];   // header names are lower-cased by Node

  const orderId = Number(id);                   // convert before comparing to a number
  res.status(200).json({ orderId, itemId, notify, quantity, key });
});`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Where</En><Zh>位置</Zh></th>
              <th><En>Answers</En><Zh>回答的问题</Zh></th>
              <th><En>Read with</En><Zh>读取方式</Zh></th>
              <th><En>Example</En><Zh>示例</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Path</En><Zh>路径</Zh></td>
              <td>
                <En><strong>Which</strong> resource</En>
                <Zh><strong>哪个</strong>资源</Zh>
              </td>
              <td>
                <code>req.params</code>
              </td>
              <td>
                <code>/orders/17</code> → <code>"17"</code>
              </td>
            </tr>
            <tr>
              <td><En>Query string</En><Zh>Query string</Zh></td>
              <td>
                <En><strong>How</strong> to filter or shape the response</En>
                <Zh><strong>如何</strong>过滤或格式化响应</Zh>
              </td>
              <td>
                <code>req.query</code>
              </td>
              <td>
                <code>?status=placed&amp;limit=20</code>
              </td>
            </tr>
            <tr>
              <td><En>Body</En><Zh>Body</Zh></td>
              <td>
                <En>The <strong>data</strong> being sent (POST/PUT/PATCH)</En>
                <Zh>发送的<strong>数据</strong>（POST/PUT/PATCH）</Zh>
              </td>
              <td>
                <code>req.body</code>
              </td>
              <td>
                <code>
                  {"{"} "customerId": 4 {"}"}
                </code>
              </td>
            </tr>
            <tr>
              <td><En>Headers</En><Zh>Headers</Zh></td>
              <td>
                <En>Metadata <em>about</em> the request — type, auth, retry key</En>
                <Zh>请求的<em>元信息</em>——类型、认证、重试 key</Zh>
              </td>
              <td>
                <code>req.headers</code>
              </td>
              <td>
                <code>Authorization</code>, <code>Idempotency-Key</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>
            Everything in <code>req.params</code> and <code>req.query</code> is a{" "}
            <strong>string</strong> — <code>/orders/17</code> gives you{" "}
            <code>"17"</code>, not <code>17</code>. Convert it before comparing,
            or <code>find</code> never matches.
          </En>
          <Zh>
            <code>req.params</code> 和 <code>req.query</code> 中的所有值都是<strong>字符串</strong>——<code>/orders/17</code> 给你的是 <code>"17"</code>，不是 <code>17</code>。比较之前先转换，否则 <code>find</code> 永远匹配不到。
          </Zh>
        </p>

        <p>
          <En>
            Now the same four properties across a real resource — four routes,
            four verbs:
          </En>
          <Zh>
            下面是同一个资源上四个属性的实际用法——四个路由，四个 verb：
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`interface Order {
  id: number;
  customerId: number;
  status: "placed" | "shipped" | "delivered";
  items: { productId: number; quantity: number }[];
}

const orders: Order[] = [];   // in memory for today; a real database starts tomorrow
let nextId = 1;

app.post("/orders", (req, res) => {
  const { customerId, items } = req.body;          // BODY — the data being created
  const order: Order = { id: nextId++, customerId, status: "placed", items };
  orders.push(order);
  res.status(201).json(order);                     // 201: something new exists now
});

app.get("/orders", (req, res) => {
  const { status } = req.query as { status?: string };   // QUERY — how to filter the list
  const result = status ? orders.filter((o) => o.status === status) : orders;
  res.status(200).json(result);
});

app.get("/orders/:id", (req, res) => {
  const { id } = req.params;                       // PATH — which order
  const order = orders.find((o) => o.id === Number(id));
  if (!order) {
    res.status(404).json({ error: { message: "Order not found" } });
    return;                                        // always return after responding
  }
  res.status(200).json(order);
});

app.patch("/orders/:id/status", (req, res) => {
  const { id } = req.params;                       // PATH — which order
  const { status } = req.body;                     // BODY — the new value for one field
  const order = orders.find((o) => o.id === Number(id));
  if (!order) {
    res.status(404).json({ error: { message: "Order not found" } });
    return;
  }
  order.status = status;
  res.status(200).json(order);                     // 200: it already existed, it changed
});`}
        />
        <p className="callout">
          <En>
            <code>POST</code> creates something new and returns <code>201</code>.{" "}
            <code>PATCH</code> changes part of something that already exists and
            returns <code>200</code>. Neither one is "the update route" — the verb{" "}
            <em>is</em> the meaning.
          </En>
          <Zh>
            <code>POST</code> 创建新资源，返回 <code>201</code>。<code>PATCH</code> 修改已有资源的部分字段，返回 <code>200</code>。没有所谓的"更新路由"——verb <em>本身</em>就是语义。
          </Zh>
        </p>

        <h4 className="topic"><En>C.4 Seeing all of it: the Network tab</En><Zh>C.4 全貌一览：Network 面板</Zh></h4>
        <p>
          <En>
            Open DevTools with <code>Cmd+Opt+I</code> (Mac) /{" "}
            <code>Ctrl+Shift+I</code> (Windows), then the Network tab, then filter
            to <strong>Fetch/XHR</strong>. Here's that same{" "}
            <code>POST /orders</code>, and where each part of it lives:
          </En>
          <Zh>
            用 <code>Cmd+Opt+I</code>（Mac）/ <code>Ctrl+Shift+I</code>（Windows）打开 DevTools，切到 Network 面板，筛选 <strong>Fetch/XHR</strong>。下面是同一个 <code>POST /orders</code>，以及各部分的位置：
          </Zh>
        </p>

        <div className="netmock">
          <div className="netmock-bar">
            <span>Elements</span>
            <span>Console</span>
            <span className="is-active">Network</span>
            <span>Sources</span>
            <span className="netmock-filter">Fetch/XHR</span>
          </div>

          <table className="netmock-list">
            <thead>
              <tr>
                <th>Name</th>
                <th>Method</th>
                <th>Status</th>
                <th>Type</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>orders?status=placed</td>
                <td>GET</td>
                <td className="netmock-ok">200</td>
                <td>fetch</td>
                <td>31 ms</td>
              </tr>
              <tr className="is-selected">
                <td>orders</td>
                <td>POST</td>
                <td className="netmock-ok">
                  <span className="netmark">1</span>201
                </td>
                <td>fetch</td>
                <td>48 ms</td>
              </tr>
              <tr>
                <td>orders/99</td>
                <td>GET</td>
                <td className="netmock-err">404</td>
                <td>fetch</td>
                <td>12 ms</td>
              </tr>
            </tbody>
          </table>

          <div className="netmock-detail">
            <div className="netmock-tabs">
              <span className="is-active">Headers</span>
              <span>Payload</span>
              <span>Response</span>
              <span>Timing</span>
            </div>

            <div className="netmock-pane">
              <p className="netmock-section">
                <span className="netmark">2</span>Headers — General
              </p>
              <div className="netmock-kv">
                <span>Request URL</span>
                <span>http://localhost:3000/orders</span>
              </div>
              <div className="netmock-kv">
                <span>Request Method</span>
                <span>POST</span>
              </div>
              <div className="netmock-kv">
                <span>Status Code</span>
                <span className="netmock-ok">201 Created</span>
              </div>
              <p className="netmock-section" style={{ marginTop: "0.7rem" }}>
                Request Headers
              </p>
              <div className="netmock-kv">
                <span>Content-Type</span>
                <span>application/json</span>
              </div>
              <div className="netmock-kv">
                <span>Idempotency-Key</span>
                <span>order-4-attempt-1</span>
              </div>
            </div>

            <div className="netmock-pane">
              <p className="netmock-section">
                <span className="netmark">3</span>Payload — what you sent
              </p>
              <pre className="netmock-body">{`{ "customerId": 4, "items": [{ "productId": 2, "quantity": 3 }] }`}</pre>
            </div>

            <div className="netmock-pane">
              <p className="netmock-section">
                <span className="netmark">4</span>Response — what came back
              </p>
              <pre className="netmock-body">{`{ "id": 17, "customerId": 4, "status": "placed" }`}</pre>
            </div>
          </div>
        </div>

        <ul className="netmock-legend">
          <li>
            <span className="netmark">1</span>
            <span>
              <En>
                <strong>Status</strong> — tells you which side to debug before you
                read anything else. Red <code>404</code> = wrong URL.{" "}
                <code>400</code> = your body was rejected. <code>500</code> = the
                server threw.
              </En>
              <Zh>
                <strong>Status</strong>——在看其他任何东西之前先告诉你该调试哪一侧。红色 <code>404</code> = URL 写错了。<code>400</code> = 你的 body 被拒绝了。<code>500</code> = 服务器抛了异常。
              </Zh>
            </span>
          </li>
          <li>
            <span className="netmark">2</span>
            <span>
              <En>
                <strong>Headers</strong> — the method, the full URL, and the
                metadata. If <code>Content-Type: application/json</code> is
                missing here, <code>express.json()</code> never parses your body.
              </En>
              <Zh>
                <strong>Headers</strong>——method、完整 URL 和元信息。如果这里没有 <code>Content-Type: application/json</code>，<code>express.json()</code> 就不会解析你的 body。
              </Zh>
            </span>
          </li>
          <li>
            <span className="netmark">3</span>
            <span>
              <En>
                <strong>Payload</strong> — what was <em>really</em> sent, not what
                you meant to send. Check this before blaming the server.
              </En>
              <Zh>
                <strong>Payload</strong>——实际发送的内容，而不是你以为发送的内容。在怪服务器之前先检查这里。
              </Zh>
            </span>
          </li>
          <li>
            <span className="netmark">4</span>
            <span>
              <En>
                <strong>Response</strong> — the raw body. An HTML stack trace here
                means the server crashed instead of returning JSON.
              </En>
              <Zh>
                <strong>Response</strong>——原始 body。如果这里出现 HTML stack trace，说明服务器崩了，而不是返回了 JSON。
              </Zh>
            </span>
          </li>
        </ul>
        <p className="callout">
          <En>
            Right-click any request → <em>Copy as cURL</em> to replay it in the
            terminal with no front end involved — the fastest way to prove a bug
            is the API's and not the UI's.
          </En>
          <Zh>
            右键任意请求 → <em>Copy as cURL</em>，在终端重放它，完全绕开前端——这是证明 bug 在 API 而非 UI 的最快方法。
          </Zh>
        </p>

        {/* ================================================================= */}
        {/* Part D — designing the API                                         */}
        {/* ================================================================= */}
        <h3 className="part"><En>Part D — Designing the API</En><Zh>Part D — API 设计</Zh></h3>
        <p>
          <En>
            Part C was mechanics. This is the part reviewers argue about: what the
            URLs are called, what each response means, and what happens when a
            client sends the same request twice.
          </En>
          <Zh>
            Part C 讲的是机制。这一部分是 code review 时大家会争论的地方：URL 怎么命名、每个响应代表什么意思，以及客户端发送相同请求两次时会发生什么。
          </Zh>
        </p>

        <h4 className="topic"><En>D.1 REST design principles</En><Zh>D.1 REST 设计原则</Zh></h4>
        <p>
          <En>
            A REST resource is a noun (<code>/orders</code>), and the HTTP verb
            says what you're doing to it — not the URL.
          </En>
          <Zh>
            REST 资源是名词（<code>/orders</code>），HTTP verb 表达你对它的操作——而不是 URL。
          </Zh>
        </p>
        <CodeBlock
          language="plaintext"
          bad={[2, 3, 4, 5]}
          good={[8, 9, 10, 11]}
          code={`# verbs in the URL — the method is then meaningless
POST /createOrder
POST /orders/17/updateStatus
GET  /getOrdersByCustomer?id=4
POST /deleteOrder/17

# the noun is the URL, the verb is the method
POST   /orders
PATCH  /orders/17/status
GET    /orders?customerId=4
DELETE /orders/17`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Principle</En><Zh>原则</Zh></th>
              <th><En>Means</En><Zh>含义</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Resources are nouns</En><Zh>资源用名词</Zh></td>
              <td>
                <code>/orders</code><En>, never <code>/getOrders</code></En><Zh>，永远不用 <code>/getOrders</code></Zh>
              </td>
            </tr>
            <tr>
              <td><En>Collections are plural</En><Zh>集合用复数</Zh></td>
              <td>
                <En>
                  <code>/orders</code> is the collection, <code>/orders/17</code>{" "}
                  is one member
                </En>
                <Zh>
                  <code>/orders</code> 是集合，<code>/orders/17</code> 是单个成员
                </Zh>
              </td>
            </tr>
            <tr>
              <td><En>The method is the action</En><Zh>method 即操作</Zh></td>
              <td>
                <En>
                  <code>GET</code> read, <code>POST</code> create,{" "}
                  <code>PUT</code> replace, <code>PATCH</code> modify,{" "}
                  <code>DELETE</code> remove
                </En>
                <Zh>
                  <code>GET</code> 读取，<code>POST</code> 创建，<code>PUT</code> 替换，<code>PATCH</code> 修改，<code>DELETE</code> 删除
                </Zh>
              </td>
            </tr>
            <tr>
              <td><En>Sub-resources nest</En><Zh>子资源嵌套</Zh></td>
              <td>
                <En>
                  <code>/orders/17/items</code> — but stop at two levels; deeper
                  reads worse than a query param
                </En>
                <Zh>
                  <code>/orders/17/items</code>——但只嵌套两层；更深的层级不如用 query param
                </Zh>
              </td>
            </tr>
            <tr>
              <td><En>Filtering is a query param</En><Zh>过滤用 query param</Zh></td>
              <td>
                <En>
                  <code>/orders?status=placed&amp;limit=20</code>, not{" "}
                  <code>/orders/placed</code>
                </En>
                <Zh>
                  <code>/orders?status=placed&amp;limit=20</code>，而非 <code>/orders/placed</code>
                </Zh>
              </td>
            </tr>
            <tr>
              <td><En>Statelessness</En><Zh>无状态</Zh></td>
              <td><En>Every request carries everything needed to serve it</En><Zh>每个请求都携带处理它所需的全部信息</Zh></td>
            </tr>
            <tr>
              <td><En>Consistent representations</En><Zh>一致的数据格式</Zh></td>
              <td>
                <En>
                  The same resource comes back with the same field names
                  everywhere
                </En>
                <Zh>
                  同一资源在任何地方返回时字段名都相同
                </Zh>
              </td>
            </tr>
            <tr>
              <td><En>Status codes carry the outcome</En><Zh>用状态码传达结果</Zh></td>
              <td>
                <En>
                  Never <code>200 OK</code> with{" "}
                  <code>
                    {"{"} "error": "not found" {"}"}
                  </code>{" "}
                  in the body
                </En>
                <Zh>
                  永远不要用 <code>200 OK</code> 配合 body 里的 <code>{"{"} "error": "not found" {"}"}</code>
                </Zh>
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic"><En>D.2 Choosing a status code</En><Zh>D.2 选择状态码</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Code</En><Zh>状态码</Zh></th>
              <th><En>Meaning</En><Zh>含义</Zh></th>
              <th><En>When</En><Zh>使用场景</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>200</td>
              <td>OK</td>
              <td><En>A GET or PATCH succeeded</En><Zh>GET 或 PATCH 成功</Zh></td>
            </tr>
            <tr>
              <td>201</td>
              <td>Created</td>
              <td><En>A POST created a new resource</En><Zh>POST 创建了新资源</Zh></td>
            </tr>
            <tr>
              <td>204</td>
              <td>No Content</td>
              <td>
                <En>It worked and there's nothing to return — usually a DELETE</En>
                <Zh>成功执行但没有内容返回——通常是 DELETE</Zh>
              </td>
            </tr>
            <tr>
              <td>400</td>
              <td>Bad Request</td>
              <td>
                <En>The client sent something invalid — missing field, wrong type</En>
                <Zh>客户端发送了无效内容——缺少字段、类型错误</Zh>
              </td>
            </tr>
            <tr>
              <td>401</td>
              <td>Unauthorized</td>
              <td>
                <En>Not authenticated — no token, or an invalid one ("who are you?")</En>
                <Zh>未认证——没有 token 或 token 无效（"你是谁？"）</Zh>
              </td>
            </tr>
            <tr>
              <td>403</td>
              <td>Forbidden</td>
              <td>
                <En>Authenticated, but not allowed to do this ("I know you, no")</En>
                <Zh>已认证，但无权执行此操作（"我认识你，但不行"）</Zh>
              </td>
            </tr>
            <tr>
              <td>404</td>
              <td>Not Found</td>
              <td><En>The resource id in the URL doesn't exist</En><Zh>URL 中的资源 id 不存在</Zh></td>
            </tr>
            <tr>
              <td>409</td>
              <td>Conflict</td>
              <td>
                <En>
                  Valid request, impossible in the current state — cancelling an
                  already-shipped order
                </En>
                <Zh>
                  请求合法，但当前状态下无法执行——取消一个已发货的订单
                </Zh>
              </td>
            </tr>
            <tr>
              <td>429</td>
              <td>Too Many Requests</td>
              <td>
                <En>The client is sending requests faster than the route allows</En>
                <Zh>客户端发请求的速度超过了该路由的限制</Zh>
              </td>
            </tr>
            <tr>
              <td>500</td>
              <td>Internal Server Error</td>
              <td>
                <En>Something broke on the server's own side, not the client's fault</En>
                <Zh>服务器内部出错，不是客户端的问题</Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">
            <En>Concept — the class tells the caller whose problem it is</En>
            <Zh>概念 — 状态码的分类告诉调用方是谁的问题</Zh>
          </p>
          <ul>
            <li>
              <strong>2xx</strong> <En>— it worked.</En><Zh>— 成功了。</Zh>
            </li>
            <li>
              <strong>3xx</strong> <En>— go look somewhere else (redirects, caching).</En><Zh>— 去别处看（重定向、缓存）。</Zh>
            </li>
            <li>
              <strong>4xx</strong> <En>— <em>the client</em> is wrong. Retrying the identical request won't help.</En>
              <Zh>— <em>客户端</em>出错了。重试同样的请求没有用。</Zh>
            </li>
            <li>
              <strong>5xx</strong> <En>— <em>the server</em> is wrong. Retrying later might work, which is exactly why 4xx/5xx must not be mixed up.</En>
              <Zh>— <em>服务器</em>出错了。稍后重试可能有用，这正是 4xx/5xx 不能混淆的原因。</Zh>
            </li>
          </ul>
        </div>

        <h4 className="topic"><En>D.3 Idempotency</En><Zh>D.3 幂等性</Zh></h4>
        <p>
          <En>
            An operation is <strong>idempotent</strong> if doing it five times
            leaves the system in the same state as doing it once. It's not about
            the response being identical — it's about the side effects.
          </En>
          <Zh>
            一个操作是<strong>幂等的</strong>，意味着执行五次和执行一次结果相同。这说的不是响应内容一致——而是副作用一致。
          </Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Verb</th>
              <th><En>Safe (no change)</En><Zh>安全（无副作用）</Zh></th>
              <th><En>Idempotent</En><Zh>幂等</Zh></th>
              <th><En>Example</En><Zh>示例</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>GET</code>
              </td>
              <td><En>Yes</En><Zh>是</Zh></td>
              <td><En>Yes</En><Zh>是</Zh></td>
              <td>
                <En>
                  <code>GET /orders/17</code> five times — still one order,
                  unchanged
                </En>
                <Zh>
                  <code>GET /orders/17</code> 五次——仍然是同一个订单，没有变化
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>PUT</code>
              </td>
              <td><En>No</En><Zh>否</Zh></td>
              <td><En>Yes</En><Zh>是</Zh></td>
              <td>
                <En>
                  <code>PUT /orders/17</code> with the same body five times — the
                  order ends up in that exact state once
                </En>
                <Zh>
                  用相同 body 执行 <code>PUT /orders/17</code> 五次——订单最终只处于那个状态一次
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>DELETE</code>
              </td>
              <td><En>No</En><Zh>否</Zh></td>
              <td><En>Yes</En><Zh>是</Zh></td>
              <td>
                <En>
                  <code>DELETE /orders/17</code> five times — deleted after the
                  first; the rest are 404 but change nothing
                </En>
                <Zh>
                  <code>DELETE /orders/17</code> 五次——第一次删除后其余返回 404，但不再有任何变化
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>PATCH</code>
              </td>
              <td><En>No</En><Zh>否</Zh></td>
              <td><En>It depends</En><Zh>视情况而定</Zh></td>
              <td>
                <En>
                  <code>
                    {"{"} status: "shipped" {"}"}
                  </code>{" "}
                  is idempotent;{" "}
                  <code>
                    {"{"} incrementQuantityBy: 1 {"}"}
                  </code>{" "}
                  is not
                </En>
                <Zh>
                  <code>{"{"} status: "shipped" {"}"}</code> 是幂等的；<code>{"{"} incrementQuantityBy: 1 {"}"}</code> 不是
                </Zh>
              </td>
            </tr>
            <tr>
              <td>
                <code>POST</code>
              </td>
              <td><En>No</En><Zh>否</Zh></td>
              <td><En>No</En><Zh>否</Zh></td>
              <td>
                <En>
                  <code>POST /orders</code> five times — five separate orders,
                  five charges
                </En>
                <Zh>
                  <code>POST /orders</code> 五次——五个独立订单，五笔扣款
                </Zh>
              </td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          good={[2, 7]}
          bad={[12]}
          code={`// idempotent: the end state doesn't depend on how many times this ran
app.put("/orders/:id/status", (req, res) => {
  const { status } = req.body;
  order.status = status;                 // "shipped" -> "shipped" -> "shipped"
  res.status(200).json(order);
});

// NOT idempotent: each call moves the value again
app.patch("/inventory/:id", (req, res) => {
  const { delta } = req.body;
  item.quantity += delta;                // +1, +1, +1 — three calls, three effects
  res.status(200).json(item);
});`}
        />
        <div className="concept">
          <p className="concept-label"><En>Concept — why anyone cares</En><Zh>概念 — 为什么幂等性重要</Zh></p>
          <ul>
            <li>
              <En>
                Networks lose responses. The client sent the request, the server
                handled it, and the reply never arrived — the client has no way to
                tell that from "never received".
              </En>
              <Zh>
                网络会丢失响应。客户端发了请求，服务器处理了，但回复从未到达——客户端无法区分这和"请求根本没被处理"。
              </Zh>
            </li>
            <li>
              <En>
                So clients, proxies and job queues <strong>retry</strong>.
                Retrying an idempotent request is free; retrying a{" "}
                <code>POST</code> creates a duplicate order.
              </En>
              <Zh>
                所以客户端、代理和任务队列都会<strong>重试</strong>。重试幂等请求没有副作用；重试 <code>POST</code> 则会创建重复订单。
              </Zh>
            </li>
            <li>
              <En>
                That's why the user double-clicking "Place order" is a real bug
                class, not a joke.
              </En>
              <Zh>
                这就是为什么用户双击"下单"是一类真实的 bug，而不是玩笑。
              </Zh>
            </li>
            <li>
              <En>
                The standard fix for a non-idempotent endpoint is an{" "}
                <strong>idempotency key</strong>: the client sends a unique key
                with the request, and the server returns the original result if it
                has already seen that key.
              </En>
              <Zh>
                针对非幂等接口的标准解决方案是<strong>幂等性 key</strong>：客户端随请求发送一个唯一 key，服务器如果已见过该 key，直接返回原始结果。
              </Zh>
            </li>
          </ul>
        </div>
        <CodeBlock
          language="typescript"
          code={`const seen = new Map<string, Order>();

app.post("/orders", (req, res) => {
  const { customerId, items } = req.body;
  const key = req.headers["idempotency-key"] as string | undefined;

  if (key && seen.has(key)) {
    res.status(200).json(seen.get(key));   // the retry gets the ORIGINAL order back
    return;
  }

  const order: Order = { id: nextId++, customerId, status: "placed", items };
  orders.push(order);
  if (key) seen.set(key, order);
  res.status(201).json(order);
});`}
        />

        {/* ================================================================= */}
        {/* Part E — validation                                                */}
        {/* ================================================================= */}
        <h3 className="part">
          <En>Part E — Validating the request, and a consistent error shape</En>
          <Zh>Part E — 请求校验与统一错误格式</Zh>
        </h3>
        <p>
          <En>
            Express's default error page is an HTML stack trace — nothing an API
            client can parse. Every error this app returns uses the same JSON
            shape instead.
          </En>
          <Zh>
            Express 默认的错误页面是 HTML stack trace——API 客户端根本无法解析。我们的应用返回的每个错误都使用统一的 JSON 格式。
          </Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`app.post("/orders", (req, res) => {
  const { customerId, items } = req.body;
  // validating the body's fields
  if (typeof customerId !== "number" || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: { message: "customerId and a non-empty items array are required" } });
    return;
  }

  const order: Order = { id: nextId++, customerId, status: "placed", items };
  orders.push(order); // only reached once validation has already passed
  res.status(201).json(order);
});`}
        />
        <p className="callout">
          <En>
            Always <code>return</code> right after sending a response inside a
            handler — without it, the function keeps running and can try to send a
            second response on the same request, which crashes with "Cannot set
            headers after they are sent."
          </En>
          <Zh>
            在 handler 中发送响应后始终要 <code>return</code>——否则函数继续执行，可能尝试对同一请求发送第二个响应，导致 "Cannot set headers after they are sent" 崩溃。
          </Zh>
        </p>
      </section>
    </div>
  );
}
