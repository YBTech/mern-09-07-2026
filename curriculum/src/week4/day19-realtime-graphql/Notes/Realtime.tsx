import { Link } from "react-router-dom";
import CodeBlock from "../../../components/CodeBlock";
import DayNav from "../../../components/DayNav";
import { Arrow, ArrowDefs, T } from "../../../components/Diagram";
import { En, Zh } from "../../../components/Lang";
import NotesNav from "./NotesNav";

export default function RealtimeNotes() {
  return (
    <div className="page notes-page">
      <title>Day 19 Notes — Real-Time Communication</title>
      <DayNav day="day19-realtime-graphql" current="notes" />
      <NotesNav current="realtime" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 19 · Notes</p>
        <h1><En>Real-Time Communication</En><Zh>实时通信</Zh></h1>
        <p className="subtitle"><En>Executive summary → full walkthrough</En><Zh>核心摘要 → 完整讲解</Zh></p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2><En>Section 1 — Executive Summary</En><Zh>第一节 — 核心摘要</Zh></h2>
        <p><En>The essentials — what you must be able to do by the end of today:</En><Zh>核心要点——今天结束时你必须掌握的内容：</Zh></p>
        <ul>
          <li><En>Explain short polling, long polling, WebSocket, and SSE, and pick one for a given scenario</En><Zh>理解 short polling、long polling、WebSocket 和 SSE，并能针对具体场景选择合适的方案</Zh></li>
        </ul>
        <p>
          <En>Want more? <Link to="/week4/day19-realtime-graphql/concepts">View all concepts?</Link></En>
          <Zh>想了解更多？<Link to="/week4/day19-realtime-graphql/concepts">查看所有概念</Link></Zh>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2><En>Section 2 — Full Walkthrough</En><Zh>第二节 — 完整讲解</Zh></h2>

        {/* ============================================================ */}
        <h3 className="part"><En>Part A — The problem: the server can&apos;t speak first</En><Zh>A 部分——问题：服务器无法主动发送消息</Zh></h3>

        <h4 className="topic"><En>A.1 Pages go stale</En><Zh>A.1 页面会变得过时</Zh></h4>
        <p>
          <En>HTTP is request → response: the browser asks, the server answers. <strong>The server can&apos;t speak first.</strong></En>
          <Zh>HTTP 是请求 → 响应模式：浏览器发起请求，服务器返回响应。<strong>服务器无法主动发起通信。</strong></Zh>
        </p>
        <svg viewBox="0 0 640 170" role="img" aria-label="A timeline of a football match. On the server, the score changes from 0–0 at kickoff to 1–0 in the 23rd minute, 1–1 in the 41st, and 2–1 in the 67th. The browser page, loaded at kickoff, keeps showing 0–0 the whole time.">
          <T x={70} y={40} anchor="end" color="#1c1c1c" bold>Server</T>
          <T x={70} y={110} anchor="end" color="#1c1c1c" bold>Page</T>
          <Arrow d="M80,36 L624,36" />
          <Arrow d="M80,106 L624,106" />
          {[
            ["0–0", 90],
            ["1–0", 230],
            ["1–1", 370],
            ["2–1", 510],
          ].map(([label, x]) => (
            <g key={label as string}>
              <circle cx={x as number} cy="36" r="5" fill="#2255cc" />
              <T x={(x as number) + 6} y={58} anchor="start" color="#1c1c1c">{label as string}</T>
            </g>
          ))}
          <rect x="90" y="96" width="520" height="20" rx="4" fill="#fdf3f3" stroke="#d98b8b" />
          <T x={350} y={110} color="#c0392b">still says &quot;0–0&quot; — until the viewer presses refresh</T>
          <T x={90} y={140} anchor="start">page loaded</T>
          <T x={350} y={162}>kickoff · · · · · · · · · 23&apos; · · · · · · · · · 41&apos; · · · · · · · · · 67&apos;</T>
        </svg>
        <p><En>Four ways around it, each the right tool for a different kind of feature:</En><Zh>有四种解决方案，每种都适合不同类型的功能：</Zh></p>
        <ul>
          <li><En><strong>Short polling</strong> and <strong>long polling</strong>: the browser keeps asking.</En><Zh><strong>Short polling</strong> 和 <strong>long polling</strong>：浏览器持续轮询。</Zh></li>
          <li><En><strong>WebSocket</strong>: one open connection, both sides talk.</En><Zh><strong>WebSocket</strong>：一条持久连接，双方都可以发送消息。</Zh></li>
          <li><En><strong>Server-Sent Events (SSE)</strong>: one open response, the server streams.</En><Zh><strong>Server-Sent Events（SSE）</strong>：一个持久响应，服务器持续推送数据。</Zh></li>
        </ul>

        {/* ============================================================ */}
        <h3 className="part"><En>Part B — Polling: the browser keeps asking</En><Zh>B 部分——轮询：浏览器持续发起请求</Zh></h3>

        <h4 className="topic"><En>B.1 Short polling: ask on a timer</En><Zh>B.1 Short polling：定时轮询</Zh></h4>
        <CodeBlock
          language="typescript"
          code={`setInterval(async () => {
  const metrics = await fetch(\`\${API}/metrics\`).then((r) => r.json());
  renderCharts(metrics);
}, 5000);`}
        />
        <ul>
          <li><En><strong>Good:</strong> trivial to write, plain HTTP, works everywhere, stateless on the server.</En><Zh><strong>优点：</strong>代码极简，使用普通 HTTP，兼容性好，服务器无状态。</Zh></li>
          <li><En><strong>Bad:</strong> updates arrive up to one interval late (here, up to 5 s).</En><Zh><strong>缺点：</strong>更新最多延迟一个轮询间隔（此处最多延迟 5 秒）。</Zh></li>
          <li><En><strong>Bad:</strong> cost grows with users × frequency: 10,000 open pages every 2 s = 5,000 requests a second.</En><Zh><strong>缺点：</strong>请求量随用户数×频率线性增长：10,000 个在线用户每 2 秒一次 = 每秒 5,000 次请求。</Zh></li>
        </ul>

        <h4 className="topic"><En>B.2 Where short polling fits</En><Zh>B.2 Short polling 的适用场景</Zh></h4>
        <p>
          <En>Short polling is at its best when <strong>the data changes all the time</strong>: almost every answer is news, so
          almost nothing is wasted, and a few seconds of delay doesn&apos;t matter.</En>
          <Zh>Short polling 最适合<strong>数据持续变化</strong>的场景：几乎每次响应都有新数据，几乎不会浪费请求，几秒钟的延迟也无关紧要。</Zh>
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Feature</En><Zh>功能</Zh></th>
              <th><En>Why short polling fits</En><Zh>为什么适合 short polling</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Server monitoring dashboard (CPU, memory, requests per second)</En><Zh>服务器监控仪表盘（CPU、内存、每秒请求数）</Zh></td>
              <td><En>The numbers move every few seconds, so every poll brings fresh data; a chart 5 s behind is fine</En><Zh>数据每隔几秒就会变化，每次轮询都能带来新数据；图表延迟 5 秒完全可以接受</Zh></td>
            </tr>
            <tr>
              <td><En>&quot;23 people are viewing this&quot; counter</En><Zh>"当前 23 人正在浏览"计数器</Zh></td>
              <td><En>Always changing, and nobody minds if it&apos;s a little behind</En><Zh>数值持续变化，轻微延迟完全可以接受</Zh></td>
            </tr>
            <tr>
              <td><En>Leaderboard during a live coding contest</En><Zh>编程竞赛实时排行榜</Zh></td>
              <td><En>Rankings shift constantly while it runs; refreshing every 10 s feels live enough</En><Zh>比赛期间排名频繁变动，每 10 秒刷新一次已经足够实时</Zh></td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic"><En>B.3 When short polling wastes requests</En><Zh>B.3 Short polling 造成浪费的场景</Zh></h4>
        <p>
          <En>Now flip it: <strong>updates are rare, and you can&apos;t predict when they come</strong>, but the user still
          wants them promptly.</En>
          <Zh>反过来看：<strong>更新很少发生，且无法预测何时到来</strong>，但用户仍然希望能立即收到通知。</Zh>
        </p>
        <ul>
          <li><En><strong>A notification bell:</strong> the next comment on your post might arrive in 3 minutes, or in 3 hours.</En><Zh><strong>通知铃铛：</strong>你帖子的下一条评论可能 3 分钟后来，也可能 3 小时后来。</Zh></li>
          <li>
            <En><strong>A background job:</strong> a video being processed, a large report being exported, a build being
            deployed. It runs for 10 minutes, and its status changes maybe twice: <code>processing</code> →{" "}
            <code>done</code>.</En>
            <Zh><strong>后台任务：</strong>视频处理、大型报告导出、项目构建部署。任务运行 10 分钟，状态可能只变化两次：<code>processing</code> → <code>done</code>。</Zh>
          </li>
        </ul>
        <svg viewBox="0 0 640 160" role="img" aria-label="A 60-second window in which the job's status changes twice. Short polling every 2 seconds sends 31 requests; only 2 of them carry news. Long polling sends 3 requests, each held open by the server and answered the moment a change happens.">
          <T x={110} y={24} anchor="end" color="#1c1c1c" bold>Changes</T>
          <T x={110} y={64} anchor="end" color="#1c1c1c" bold>Short polling</T>
          <T x={110} y={114} anchor="end" color="#1c1c1c" bold>Long polling</T>
          {[264, 520].map((x) => (
            <g key={x}>
              <circle cx={x + 3} cy="20" r="5" fill="#2255cc" />
              <path d={`M${x + 3},28 L${x + 3},124`} stroke="#2255cc" strokeDasharray="3,3" />
            </g>
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const news = i === 9 || i === 25;
            return <rect key={i} x={120 + i * 16} y="50" width="7" height="20" rx="2" fill={news ? "#7dbb7d" : "#e1e4e8"} />;
          })}
          <T x={365} y={88}>31 requests, 2 with news</T>
          <rect x="120" y="102" width="144" height="20" rx="4" fill="#fff7e0" stroke="#e8b400" />
          <rect x="268" y="102" width="252" height="20" rx="4" fill="#fff7e0" stroke="#e8b400" />
          <rect x="524" y="102" width="92" height="20" rx="4" fill="#fff7e0" stroke="#e8b400" />
          <T x={365} y={142}>3 requests, each held open and answered the moment something changes</T>
        </svg>
        <ul>
          <li><En>Poll a 10-minute job every 2 s: <strong>300 requests to learn about 2 changes.</strong></En><Zh>每 2 秒轮询一个运行 10 分钟的任务：<strong>发出 300 次请求，仅得到 2 次有效更新。</strong></Zh></li>
          <li><En>Poll every 60 s instead: far fewer requests, but the user sees &quot;done&quot; up to a minute late.</En><Zh>改为每 60 秒轮询：请求数大幅减少，但用户看到"完成"最多延迟一分钟。</Zh></li>
          <li><En>Short polling forces a choice between waste and delay. Long polling avoids it.</En><Zh>Short polling 迫使你在"浪费请求"和"延迟更新"之间做出取舍。Long polling 则两者兼顾。</Zh></li>
        </ul>

        <h4 className="topic"><En>B.4 Long polling: ask, and let the server wait</En><Zh>B.4 Long polling：发起请求，让服务器等待</Zh></h4>
        <svg viewBox="0 0 640 230" role="img" aria-label="Long polling. The browser asks for new notifications; the server holds the request open until a new comment arrives, then responds. The browser immediately sends the next request, which the server holds until the export finishes.">
          <T x={110} y={24} color="#1c1c1c" bold>Browser</T>
          <T x={530} y={24} color="#1c1c1c" bold>Server</T>
          <path d="M110,32 L110,222" stroke="#bbb" />
          <path d="M530,32 L530,222" stroke="#bbb" />
          <Arrow d="M110,50 L528,50" />
          <T x={320} y={44}>GET /notifications/poll?since=7</T>
          <rect x="522" y="52" width="16" height="62" rx="3" fill="#fff7e0" stroke="#e8b400" />
          <T x={520} y={88} anchor="end" color="#8a5a00">holds the request…</T>
          <Arrow d="M528,116 L112,116" ink="green" />
          <T x={320} y={110} color="#3d8b40">200: &quot;Ana commented on your post&quot; (the moment it happens)</T>
          <Arrow d="M110,136 L528,136" />
          <T x={320} y={130}>GET /notifications/poll?since=8 (straight away)</T>
          <rect x="522" y="138" width="16" height="56" rx="3" fill="#fff7e0" stroke="#e8b400" />
          <Arrow d="M528,196 L112,196" ink="green" />
          <T x={320} y={190} color="#3d8b40">200: &quot;Your export is ready&quot;</T>
          <T x={320} y={218}>no news for 25 s → the server answers 204, and the browser asks again</T>
        </svg>
        <p className="compare-label">Server</p>
        <CodeBlock
          language="typescript"
          code={`app.get("/notifications/poll", (req, res) => {
  const fresh = notificationsAfter(Number(req.query.since));
  if (fresh.length > 0) {
    return res.json(fresh); // already news
  }

  // Nothing yet: park the request until something arrives.
  const onNew = (notification) => {
    clearTimeout(timer);
    res.json([notification]);
  };
  const timer = setTimeout(() => {
    notifications.off("new", onNew);
    res.status(204).end(); // no news: the browser will ask again
  }, 25_000);
  notifications.once("new", onNew);
});`}
        />
        <p className="compare-label">Browser</p>
        <CodeBlock
          language="typescript"
          code={`let since = 0;
while (true) {
  const res = await fetch(
    \`\${API}/notifications/poll?since=\${since}\`
  );
  if (res.status === 200) {
    const fresh = await res.json();
    since = fresh[fresh.length - 1].id;
    showBadge(fresh);
  }
  // 204 = nothing new: ask again
}`}
        />
        <ul>
          <li><En><strong>Good:</strong> updates arrive almost instantly, over plain HTTP that every proxy and firewall allows.</En><Zh><strong>优点：</strong>更新几乎即时到达，使用普通 HTTP，穿透任何代理和防火墙。</Zh></li>
          <li><En><strong>Good:</strong> no wasted &quot;nothing changed&quot; answers, however rare the updates are.</En><Zh><strong>优点：</strong>无论更新多么稀少，都不会有"无变化"的无效响应。</Zh></li>
          <li><En><strong>Bad:</strong> the server holds one open request per waiting client.</En><Zh><strong>缺点：</strong>服务器需要为每个等待的客户端保持一个挂起的请求。</Zh></li>
          <li><En><strong>Bad:</strong> a new request after every single message, plus a timeout to handle.</En><Zh><strong>缺点：</strong>每条消息后都需要重新发起请求，还需处理超时逻辑。</Zh></li>
          <li><En><strong>Bad:</strong> missed messages and ordering are yours to handle (hence the <code>since</code> id).</En><Zh><strong>缺点：</strong>消息丢失和顺序问题需要自行处理（因此需要 <code>since</code> id）。</Zh></li>
        </ul>

        <h4 className="topic"><En>B.5 Where long polling fits</En><Zh>B.5 Long polling 的适用场景</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Feature</En><Zh>功能</Zh></th>
              <th><En>Why long polling fits</En><Zh>为什么适合 long polling</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Notification bell</En><Zh>通知铃铛</Zh></td>
              <td><En>Rare, unpredictable updates that should still show up promptly</En><Zh>更新稀少且不可预测，但仍需及时推送</Zh></td>
            </tr>
            <tr>
              <td><En>Background job and task monitoring (video processing, report exports, builds and deploys)</En><Zh>后台任务监控（视频处理、报告导出、构建与部署）</Zh></td>
              <td><En>Runs for minutes, changes status only a few times; each change arrives the moment it happens</En><Zh>任务运行数分钟，状态只变化几次；每次变化即时到达</Zh></td>
            </tr>
            <tr>
              <td><En>&quot;New mail&quot; check in a webmail inbox</En><Zh>网页邮件收件箱的新邮件检查</Zh></td>
              <td><En>Hours can pass between emails, and a new one should appear without a refresh</En><Zh>邮件间隔可能长达数小时，新邮件应无需刷新即可显示</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Today SSE (Part D) often does these same jobs more cleanly; long polling stays as the plain-HTTP option that works
          through any network.</En>
          <Zh>现在 SSE（D 部分）通常能更简洁地完成相同的工作；long polling 保留为能穿透任何网络的纯 HTTP 方案。</Zh>
        </p>

        {/* ============================================================ */}
        <h3 className="part"><En>Part C — WebSocket: both sides talk</En><Zh>C 部分——WebSocket：双向通信</Zh></h3>

        <h4 className="topic"><En>C.1 What polling can&apos;t do: talk back</En><Zh>C.1 轮询做不到的事：双向通信</Zh></h4>
        <div className="concept">
          <p className="concept-label"><En>Concept — polling is one-way</En><Zh>概念——轮询是单向的</Zh></p>
          <ul>
            <li>
              <En>In both kinds of polling the browser asks and the server answers. The server still never starts a
              conversation; long polling only lets it <strong>delay its answer</strong>.</En>
              <Zh>两种轮询方式都是浏览器发起请求，服务器返回响应。服务器始终无法主动开启通信；long polling 只是允许它<strong>延迟响应</strong>。</Zh>
            </li>
            <li>
              <En>Sending something the other way (a chat message, a game move, a bid) is a separate request, with full HTTP
              headers, for every single message.</En>
              <Zh>向服务器发送内容（聊天消息、游戏操作、出价）需要单独发起 HTTP 请求，每条消息都要携带完整的 HTTP 头。</Zh>
            </li>
            <li>
              <En>That&apos;s fine when the browser mostly <strong>watches</strong>. It falls apart when people{" "}
              <strong>interact live</strong>: a chat with &quot;typing…&quot; indicators, or a game sending moves many times
              a second, would be a stream of requests going out plus a poll to hear everyone else.</En>
              <Zh>当浏览器主要是<strong>接收</strong>数据时这没问题。但当用户需要<strong>实时互动</strong>时就不够用了：带有"正在输入…"提示的聊天，或每秒发送多次操作的游戏，都需要不断发出请求，同时还要轮询接收其他人的消息。</Zh>
            </li>
          </ul>
        </div>

        <h4 className="topic"><En>C.2 WebSocket: one connection, both directions</En><Zh>C.2 WebSocket：一条连接，双向通信</Zh></h4>
        <svg viewBox="0 0 640 240" role="img" aria-label="WebSocket. The browser sends an HTTP GET with an Upgrade: websocket header; the server answers 101 Switching Protocols. From then on one connection stays open: the server pushes Ben's message, the browser sends a typing indicator and then a reply, all on the same connection.">
          <T x={110} y={24} color="#1c1c1c" bold>Browser</T>
          <T x={530} y={24} color="#1c1c1c" bold>Server</T>
          <path d="M110,32 L110,232" stroke="#bbb" />
          <path d="M530,32 L530,232" stroke="#bbb" />
          <Arrow d="M110,50 L528,50" />
          <T x={320} y={44}>GET /chat · Upgrade: websocket</T>
          <Arrow d="M528,80 L112,80" />
          <T x={320} y={74}>101 Switching Protocols</T>
          <rect x="106" y="94" width="428" height="128" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeDasharray="5,4" />
          <T x={320} y={110} color="#8e5fd6">one open connection</T>
          <Arrow d="M528,134 L112,134" ink="green" />
          <T x={320} y={128} color="#3d8b40">Ben: &quot;who&apos;s joining?&quot; (the server speaks first)</T>
          <Arrow d="M110,170 L528,170" ink="orange" />
          <T x={320} y={164} color="#e08a3c">typing: Ana</T>
          <Arrow d="M110,206 L528,206" ink="orange" />
          <T x={320} y={200} color="#e08a3c">Ana: &quot;me!&quot;</T>
        </svg>
        <p className="compare-label"><En>Server (the ws library): a chat room</En><Zh>服务器端（使用 ws 库）：聊天室</Zh></p>
        <CodeBlock
          language="typescript"
          code={`import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ server, path: "/chat" });

wss.on("connection", (socket) => {
  socket.on("message", (raw) => {
    // { type: "message", user, text } or { type: "typing", user }
    const msg = JSON.parse(raw.toString());

    // Pass it on to everyone else in the room.
    for (const client of wss.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    }
  });
});`}
        />
        <p className="compare-label">Browser</p>
        <CodeBlock
          language="typescript"
          code={`const socket = new WebSocket("ws://localhost:4600/chat");

// in: whatever anyone else sends
socket.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.type === "message") addToChat(msg);
  if (msg.type === "typing") showTyping(msg.user);
};

// out: the other direction, same connection
input.oninput = () =>
  socket.send(JSON.stringify({ type: "typing", user: "Ana" }));
sendButton.onclick = () =>
  socket.send(JSON.stringify({ type: "message", user: "Ana", text: input.value }));`}
        />
        <ul>
          <li><En><strong>Good:</strong> truly two-way, with the lowest latency and tiny overhead per message.</En><Zh><strong>优点：</strong>真正的双向通信，延迟最低，每条消息的开销极小。</Zh></li>
          <li><En><strong>Good:</strong> the server can push to many clients at once (a room, a game, an auction).</En><Zh><strong>优点：</strong>服务器可以同时向多个客户端推送消息（聊天室、游戏、拍卖）。</Zh></li>
          <li><En><strong>Bad:</strong> the costs are real enough to get their own section: see C.4.</En><Zh><strong>缺点：</strong>代价不容忽视，详见 C.4。</Zh></li>
        </ul>
        <div className="concept">
          <p className="concept-label">Concept — Socket.IO</p>
          <ul>
            <li>
              <En>Socket.IO is a library <strong>on top of</strong> WebSocket, not a different name for it.</En>
              <Zh>Socket.IO 是<strong>基于</strong> WebSocket 的库，而不是 WebSocket 的别名。</Zh>
            </li>
            <li>
              <En>It adds what you&apos;d otherwise build yourself: automatic reconnects, <strong>rooms</strong> (send to a group
              of clients), broadcasting, acknowledgements, and a fallback to long polling when WebSocket is blocked.</En>
              <Zh>它提供了你原本需要自行实现的功能：自动重连、<strong>房间</strong>（向一组客户端发送消息）、广播、消息确认，以及 WebSocket 被阻断时自动降级到 long polling。</Zh>
            </li>
            <li>
              <En>The catch: it has its own protocol on top. A Socket.IO client can&apos;t talk to a plain WebSocket server, and a
              plain WebSocket client can&apos;t talk to a Socket.IO server.</En>
              <Zh>注意：它在 WebSocket 之上定义了自己的协议。Socket.IO 客户端无法与普通 WebSocket 服务器通信，普通 WebSocket 客户端也无法与 Socket.IO 服务器通信。</Zh>
            </li>
          </ul>
        </div>

        <h4 className="topic"><En>C.3 Classic WebSocket features</En><Zh>C.3 WebSocket 的经典应用场景</Zh></h4>
        <p><En>The common thread: <strong>both sides send, often, and the delay has to be tiny.</strong></En><Zh>共同特点：<strong>双方都需要频繁发送消息，且延迟必须极低。</strong></Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Feature</En><Zh>功能</Zh></th>
              <th><En>Why it needs WebSocket</En><Zh>为什么需要 WebSocket</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Chat and messaging (Slack, Discord, WhatsApp Web)</En><Zh>即时聊天（Slack、Discord、WhatsApp Web）</Zh></td>
              <td><En>Messages, typing indicators, and read receipts flow both ways, constantly</En><Zh>消息、正在输入提示和已读回执持续双向流动</Zh></td>
            </tr>
            <tr>
              <td><En>Multiplayer games</En><Zh>多人游戏</Zh></td>
              <td><En>Every player sends moves many times a second and needs everyone else&apos;s instantly</En><Zh>每位玩家每秒发送多次操作，并需要即时获取其他人的状态</Zh></td>
            </tr>
            <tr>
              <td><En>Collaborative editing (several people in one document or design file)</En><Zh>协同编辑（多人同时编辑文档或设计文件）</Zh></td>
              <td><En>Every edit and every cursor movement goes out, and everyone else&apos;s comes in, live</En><Zh>每次编辑和光标移动都实时发出，同时实时接收其他人的操作</Zh></td>
            </tr>
            <tr>
              <td><En>Live auction</En><Zh>实时拍卖</Zh></td>
              <td>
                <En>Your bids go up and everyone else&apos;s come down; bidding on a price that&apos;s 2 s stale in the final
                seconds loses the auction</En>
                <Zh>你的出价上传，其他人的出价下发；在最后几秒基于 2 秒前的价格出价会导致拍卖失败</Zh>
              </td>
            </tr>
            <tr>
              <td><En>AI agents you can interrupt or steer</En><Zh>可中断或可引导的 AI agent</Zh></td>
              <td>
                <En>A voice assistant you can talk over mid-sentence, or an agent you redirect while it works: you send while
                the AI is still sending. OpenAI&apos;s Realtime API, for voice, is one built on WebSocket</En>
                <Zh>可以在对话中途打断的语音助手，或正在执行任务时可重新引导的 agent：你在 AI 还在发送时就开始发送。OpenAI 的 Realtime API（语音版）就是基于 WebSocket 构建的</Zh>
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic"><En>C.4 When WebSocket is the wrong tool</En><Zh>C.4 WebSocket 不适合的场景</Zh></h4>
        <ul>
          <li>
            <En><strong>Stateful connections.</strong> Each client is tied to one server process. Scaling out needs sticky
            sessions, or a pub/sub layer (such as Redis) so every server hears every message. A REST server is stateless:
            you just add copies.</En>
            <Zh><strong>有状态连接。</strong>每个客户端绑定到一个服务器进程。横向扩展需要粘性会话，或通过 pub/sub 层（如 Redis）让每台服务器都能收到所有消息。REST 服务器是无状态的，可以直接水平扩展。</Zh>
          </li>
          <li>
            <En><strong>Not plain HTTP after the handshake.</strong> Some corporate proxies and firewalls block or cut long-lived
            WebSocket connections.</En>
            <Zh><strong>握手后不再是普通 HTTP。</strong>部分企业代理和防火墙会阻断或中断长时间的 WebSocket 连接。</Zh>
          </li>
          <li>
            <En><strong>No custom headers from the browser.</strong> The browser&apos;s <code>WebSocket</code> can&apos;t send{" "}
            <code>Authorization: Bearer …</code>, so auth goes through a cookie, a token in the URL, or a first message.</En>
            <Zh><strong>浏览器无法发送自定义请求头。</strong>浏览器的 <code>WebSocket</code> 无法发送 <code>Authorization: Bearer …</code>，因此认证需通过 cookie、URL 中的 token 或首条消息来实现。</Zh>
          </li>
          <li>
            <En><strong>Everything else is yours to write:</strong> reconnecting, heartbeats to detect dead connections, and
            resending messages missed while disconnected (or you adopt Socket.IO).</En>
            <Zh><strong>其余功能需自行实现：</strong>重连逻辑、检测断线的心跳包、断线期间丢失消息的重发（或者使用 Socket.IO）。</Zh>
          </li>
          <li>
            <En><strong>Overkill for one-way data.</strong> If the browser only listens, you&apos;re paying for all of the above
            and using half the pipe.</En>
            <Zh><strong>单向数据传输时过于重量级。</strong>如果浏览器只需要接收数据，你承担了上述所有代价，却只用了一半的通道。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>When only the server needs to talk, there&apos;s a simpler tool built for exactly that: SSE.</En>
          <Zh>当只需要服务器单向推送时，有一个更简单的专用工具：SSE。</Zh>
        </p>

        {/* ============================================================ */}
        <h3 className="part"><En>Part D — Server-Sent Events (SSE): the server streams</En><Zh>D 部分——Server-Sent Events（SSE）：服务器流式推送</Zh></h3>

        <h4 className="topic"><En>D.1 SSE: one response that never ends</En><Zh>D.1 SSE：永不结束的响应</Zh></h4>
        <svg viewBox="0 0 640 210" role="img" aria-label="Server-Sent Events. The browser sends one GET request. The server answers 200 with content type text/event-stream and keeps the response open, writing a new event for each moment in the match: a goal in the 23rd minute, an equaliser in the 41st, and a goal in the 67th. Server to browser only.">
          <T x={110} y={24} color="#1c1c1c" bold>Browser</T>
          <T x={530} y={24} color="#1c1c1c" bold>Server</T>
          <path d="M110,32 L110,202" stroke="#bbb" />
          <path d="M530,32 L530,202" stroke="#bbb" />
          <Arrow d="M110,50 L528,50" />
          <T x={320} y={44}>GET /matches/m-42/events</T>
          <Arrow d="M528,80 L112,80" />
          <T x={320} y={74}>200 · Content-Type: text/event-stream (and the response stays open)</T>
          {[
            ["data: 23' GOAL — 1–0", 118],
            ["data: 41' GOAL — 1–1", 150],
            ["data: 67' GOAL — 2–1", 182],
          ].map(([label, y]) => (
            <g key={label as string}>
              <Arrow d={`M528,${y} L112,${y}`} ink="green" />
              <T x={320} y={(y as number) - 6} color="#3d8b40">{label as string}</T>
            </g>
          ))}
          <T x={320} y={204}><En>server → browser only</En><Zh>服务器 → 浏览器单向传输</Zh></T>
        </svg>
        <p className="compare-label"><En>On the wire: plain text, one event per block, a blank line between events</En><Zh>传输格式：纯文本，每个事件一个块，块之间以空行分隔</Zh></p>
        <CodeBlock
          language="plaintext"
          code={`id: 12
data: {"minute":23,"text":"GOAL","score":"1–0"}

id: 13
data: {"minute":41,"text":"GOAL","score":"1–1"}`}
        />
        <p className="compare-label">Server</p>
        <CodeBlock
          language="typescript"
          code={`app.get("/matches/:id/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });
  const send = (event) =>
    res.write(\`id: \${event.id}\\ndata: \${JSON.stringify(event)}\\n\\n\`);

  // A reconnecting browser says which event it saw last: replay the rest.
  const lastId = Number(req.headers["last-event-id"] ?? 0);
  eventsAfter(req.params.id, lastId).forEach(send);

  match.on("event", send);
  req.on("close", () => match.off("event", send));
});`}
        />
        <p className="compare-label">Browser</p>
        <CodeBlock
          language="typescript"
          code={`const events = new EventSource(\`\${API}/matches/m-42/events\`);

events.onmessage = (e) => render(JSON.parse(e.data));

// If the connection drops, the browser reconnects by itself
// and sends a Last-Event-ID header, so nothing is missed.`}
        />
        <ul>
          <li><En><strong>Good:</strong> plain HTTP, very little code, and the browser reconnects automatically.</En><Zh><strong>优点：</strong>普通 HTTP，代码极少，浏览器自动重连。</Zh></li>
          <li><En><strong>Good:</strong> on reconnect the browser sends the last event id it got, so the server can catch it up.</En><Zh><strong>优点：</strong>重连时浏览器会发送最后收到的事件 id，服务器可据此补发缺失的事件。</Zh></li>
          <li><En><strong>Good:</strong> one response carries every update, so it does long polling&apos;s job without a new request per message.</En><Zh><strong>优点：</strong>一个响应承载所有更新，实现了 long polling 的效果，且无需每条消息都重新发起请求。</Zh></li>
          <li><En><strong>Bad:</strong> one direction only. To send something, the browser makes a normal request.</En><Zh><strong>缺点：</strong>仅支持单向传输。浏览器需要发送内容时，必须另外发起普通 HTTP 请求。</Zh></li>
          <li><En><strong>Bad:</strong> text only, and on HTTP/1.1 browsers allow just 6 connections per domain (fine on HTTP/2).</En><Zh><strong>缺点：</strong>仅支持文本格式，且在 HTTP/1.1 下浏览器每个域名只允许 6 条连接（HTTP/2 下无此限制）。</Zh></li>
        </ul>

        <h4 className="topic"><En>D.2 Where SSE fits</En><Zh>D.2 SSE 的适用场景</Zh></h4>
        <p><En>The common thread: <strong>the server has a stream of updates, and the browser only listens.</strong></En><Zh>共同特点：<strong>服务器持续产生更新，浏览器只需监听。</strong></Zh></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Feature</En><Zh>功能</Zh></th>
              <th><En>Why SSE fits</En><Zh>为什么适合 SSE</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>AI chat answers (ChatGPT, Claude)</En><Zh>AI 对话回复（ChatGPT、Claude）</Zh></td>
              <td>
                <En>You send the prompt once, as a normal request; the answer streams back a few words at a time, so you can start
                reading before it&apos;s finished</En>
                <Zh>你只发送一次 prompt（作为普通请求），回答逐词流式返回，让你在生成完成前就能开始阅读</Zh>
              </td>
            </tr>
            <tr>
              <td><En>Live scores and match commentary</En><Zh>实时比分和赛事评论</Zh></td>
              <td><En>Thousands of viewers on one stream, nobody sends anything back, and a dropped connection catches up by itself</En><Zh>数千名观众共享一个数据流，没有人需要回传数据，断线后自动补发</Zh></td>
            </tr>
            <tr>
              <td><En>Live price tickers (stocks, crypto)</En><Zh>实时价格行情（股票、加密货币）</Zh></td>
              <td><En>Prices flow one way; placing a trade is a separate, normal request</En><Zh>价格单向流动；下单是独立的普通请求</Zh></td>
            </tr>
            <tr>
              <td><En>Build and deploy logs in a hosting dashboard</En><Zh>托管平台的构建和部署日志</Zh></td>
              <td><En>Log lines arrive one by one as the build runs, and you just watch</En><Zh>构建过程中日志逐行到达，你只需观看</Zh></td>
            </tr>
            <tr>
              <td><En>Notification feeds and job progress</En><Zh>通知推送和任务进度</Zh></td>
              <td><En>The same features as long polling, with one open response instead of a request per update</En><Zh>与 long polling 相同的功能，但用一个持久响应替代了每次更新都要重新请求</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>See it yourself: open ChatGPT or Claude, open DevTools (<code>Cmd+Opt+I</code> (Mac) / <code>Ctrl+Shift+I</code>{" "}
          (Windows)) → Network, send a message, and click the request that keeps loading: its response type is{" "}
          <code>text/event-stream</code>.</En>
          <Zh>亲眼验证：打开 ChatGPT 或 Claude，打开 DevTools（Mac: <code>Cmd+Opt+I</code> / Windows: <code>Ctrl+Shift+I</code>）→ Network，发送一条消息，点击持续加载的那个请求：它的响应类型就是 <code>text/event-stream</code>。</Zh>
        </p>
        <div className="concept">
          <p className="concept-label"><En>Concept — why AI chat is SSE, but an interruptible agent is WebSocket</En><Zh>概念——为什么 AI 对话用 SSE，而可中断的 agent 用 WebSocket</Zh></p>
          <ul>
            <li>
              <En>A normal chat turn is <strong>one request in, one stream out</strong>. While the answer streams, you have
              nothing to send; the Stop button just closes the response.</En>
              <Zh>普通对话是<strong>一次请求，一个流式响应</strong>。回答流式输出期间你无需发送任何内容；停止按钮只是关闭响应。</Zh>
            </li>
            <li>
              <En>The prompt goes out as a <code>POST</code> with a body, and <code>EventSource</code> can only send a{" "}
              <code>GET</code>, so these apps read the same SSE format with <code>fetch</code> and a stream reader instead.</En>
              <Zh>prompt 通过带有请求体的 <code>POST</code> 发出，而 <code>EventSource</code> 只能发送 <code>GET</code>，因此这些应用改用 <code>fetch</code> 加流式 reader 来读取相同的 SSE 格式。</Zh>
            </li>
            <li>
              <En>An agent you can talk over or redirect mid-task has to <strong>receive while it sends</strong>. That&apos;s
              two-way, so it&apos;s WebSocket.</En>
              <Zh>可以在任务执行中途打断或重新引导的 agent 需要<strong>在发送的同时接收</strong>。这是双向通信，因此需要 WebSocket。</Zh>
            </li>
          </ul>
        </div>

        {/* ============================================================ */}
        <h3 className="part"><En>Part E — Choosing one</En><Zh>E 部分——如何选择</Zh></h3>

        <h4 className="topic"><En>E.1 Side by side</En><Zh>E.1 横向对比</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Short polling</th>
              <th>Long polling</th>
              <th>WebSocket</th>
              <th>SSE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><En>Direction</En><Zh>方向</Zh></td>
              <td><En>Browser asks</En><Zh>浏览器发起</Zh></td>
              <td><En>Browser asks; server answers when ready</En><Zh>浏览器发起；服务器就绪时响应</Zh></td>
              <td><En>Both ways</En><Zh>双向</Zh></td>
              <td><En>Server → browser</En><Zh>服务器 → 浏览器</Zh></td>
            </tr>
            <tr>
              <td><En>Delay</En><Zh>延迟</Zh></td>
              <td><En>Up to the interval</En><Zh>最多一个轮询间隔</Zh></td>
              <td><En>Near-instant</En><Zh>近乎即时</Zh></td>
              <td><En>Instant</En><Zh>即时</Zh></td>
              <td><En>Instant</En><Zh>即时</Zh></td>
            </tr>
            <tr>
              <td><En>Connection</En><Zh>连接方式</Zh></td>
              <td><En>A new request every time</En><Zh>每次都是新请求</Zh></td>
              <td><En>Held, then reopened</En><Zh>挂起后重新发起</Zh></td>
              <td><En>One, kept open</En><Zh>单条持久连接</Zh></td>
              <td><En>One, kept open</En><Zh>单条持久连接</Zh></td>
            </tr>
            <tr>
              <td><En>Runs over</En><Zh>传输协议</Zh></td>
              <td><En>Plain HTTP</En><Zh>普通 HTTP</Zh></td>
              <td><En>Plain HTTP</En><Zh>普通 HTTP</Zh></td>
              <td><En>Its own protocol, after an HTTP upgrade</En><Zh>HTTP 升级后的专有协议</Zh></td>
              <td><En>Plain HTTP</En><Zh>普通 HTTP</Zh></td>
            </tr>
            <tr>
              <td><En>Reconnecting</En><Zh>重连机制</Zh></td>
              <td><En>Not needed</En><Zh>无需重连</Zh></td>
              <td><En>Your loop</En><Zh>自行实现循环</Zh></td>
              <td><En>Yours to write (Socket.IO does it)</En><Zh>自行实现（Socket.IO 已内置）</Zh></td>
              <td><En>Built into the browser</En><Zh>浏览器内置</Zh></td>
            </tr>
            <tr>
              <td><En>Main cost</En><Zh>主要代价</Zh></td>
              <td><En>Wasted requests</En><Zh>无效请求</Zh></td>
              <td><En>Held requests</En><Zh>挂起的请求</Zh></td>
              <td><En>Stateful connections; harder to scale</En><Zh>有状态连接，扩展难度更高</Zh></td>
              <td><En>Held connections</En><Zh>持久连接占用</Zh></td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic"><En>E.2 Which one, when</En><Zh>E.2 场景选型速查</Zh></h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Use</En><Zh>方案</Zh></th>
              <th><En>When</En><Zh>适用条件</Zh></th>
              <th><En>Classic features</En><Zh>经典功能</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Short polling</td>
              <td><En>The data changes constantly, and a few seconds late is fine</En><Zh>数据持续变化，延迟几秒可以接受</Zh></td>
              <td><En>Monitoring dashboards, viewer counters, live leaderboards</En><Zh>监控仪表盘、在线人数计数器、实时排行榜</Zh></td>
            </tr>
            <tr>
              <td>Long polling</td>
              <td><En>Updates are rare and unpredictable, and it has to work over plain HTTP anywhere</En><Zh>更新稀少且不可预测，且需要在任何网络环境下通过普通 HTTP 工作</Zh></td>
              <td><En>Notification bells, background job status, &quot;new mail&quot; checks</En><Zh>通知铃铛、后台任务状态、新邮件检查</Zh></td>
            </tr>
            <tr>
              <td>WebSocket</td>
              <td><En>Both sides send, often, with tiny delay</En><Zh>双方都需要频繁发送消息，且延迟要求极低</Zh></td>
              <td><En>Chat, multiplayer games, collaborative editing, live auctions, interruptible AI agents</En><Zh>聊天、多人游戏、协同编辑、实时拍卖、可中断 AI agent</Zh></td>
            </tr>
            <tr>
              <td>SSE</td>
              <td><En>The server streams and the browser only listens</En><Zh>服务器流式推送，浏览器只需监听</Zh></td>
              <td><En>AI chat answers, live scores, price tickers, build logs</En><Zh>AI 对话回复、实时比分、价格行情、构建日志</Zh></td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <En>Pick the simplest one that fits. If the browser only listens, SSE is usually enough; reach for WebSocket when it
          has to talk back.</En>
          <Zh>选择最简单的适用方案。如果浏览器只需要监听，SSE 通常已经足够；只有当浏览器也需要发送消息时，才使用 WebSocket。</Zh>
        </p>
      </section>
    </div>
  );
}
