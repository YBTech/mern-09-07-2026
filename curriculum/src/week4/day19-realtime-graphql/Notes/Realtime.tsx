import { Link } from "react-router-dom";
import CodeBlock from "../../../components/CodeBlock";
import DayNav from "../../../components/DayNav";
import { Arrow, ArrowDefs, T } from "../../../components/Diagram";
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
        <h1>Real-Time Communication</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>Explain short polling, long polling, WebSocket, and SSE, and pick one for a given scenario</li>
        </ul>
        <p>
          Want more? <Link to="/week4/day19-realtime-graphql/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ============================================================ */}
        <h3 className="part">Part A — The problem: the server can&apos;t speak first</h3>

        <h4 className="topic">A.1 Pages go stale</h4>
        <p>
          HTTP is request → response: the browser asks, the server answers. <strong>The server can&apos;t speak first.</strong>
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
        <p>Four ways around it, each the right tool for a different kind of feature:</p>
        <ul>
          <li><strong>Short polling</strong> and <strong>long polling</strong>: the browser keeps asking.</li>
          <li><strong>WebSocket</strong>: one open connection, both sides talk.</li>
          <li><strong>Server-Sent Events (SSE)</strong>: one open response, the server streams.</li>
        </ul>

        {/* ============================================================ */}
        <h3 className="part">Part B — Polling: the browser keeps asking</h3>

        <h4 className="topic">B.1 Short polling: ask on a timer</h4>
        <CodeBlock
          language="typescript"
          code={`setInterval(async () => {
  const metrics = await fetch(\`\${API}/metrics\`).then((r) => r.json());
  renderCharts(metrics);
}, 5000);`}
        />
        <ul>
          <li><strong>Good:</strong> trivial to write, plain HTTP, works everywhere, stateless on the server.</li>
          <li><strong>Bad:</strong> updates arrive up to one interval late (here, up to 5 s).</li>
          <li><strong>Bad:</strong> cost grows with users × frequency: 10,000 open pages every 2 s = 5,000 requests a second.</li>
        </ul>

        <h4 className="topic">B.2 Where short polling fits</h4>
        <p>
          Short polling is at its best when <strong>the data changes all the time</strong>: almost every answer is news, so
          almost nothing is wasted, and a few seconds of delay doesn&apos;t matter.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Why short polling fits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Server monitoring dashboard (CPU, memory, requests per second)</td>
              <td>The numbers move every few seconds, so every poll brings fresh data; a chart 5 s behind is fine</td>
            </tr>
            <tr>
              <td>&quot;23 people are viewing this&quot; counter</td>
              <td>Always changing, and nobody minds if it&apos;s a little behind</td>
            </tr>
            <tr>
              <td>Leaderboard during a live coding contest</td>
              <td>Rankings shift constantly while it runs; refreshing every 10 s feels live enough</td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">B.3 When short polling wastes requests</h4>
        <p>
          Now flip it: <strong>updates are rare, and you can&apos;t predict when they come</strong>, but the user still
          wants them promptly.
        </p>
        <ul>
          <li><strong>A notification bell:</strong> the next comment on your post might arrive in 3 minutes, or in 3 hours.</li>
          <li>
            <strong>A background job:</strong> a video being processed, a large report being exported, a build being
            deployed. It runs for 10 minutes, and its status changes maybe twice: <code>processing</code> →{" "}
            <code>done</code>.
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
          <li>Poll a 10-minute job every 2 s: <strong>300 requests to learn about 2 changes.</strong></li>
          <li>Poll every 60 s instead: far fewer requests, but the user sees &quot;done&quot; up to a minute late.</li>
          <li>Short polling forces a choice between waste and delay. Long polling avoids it.</li>
        </ul>

        <h4 className="topic">B.4 Long polling: ask, and let the server wait</h4>
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
          <li><strong>Good:</strong> updates arrive almost instantly, over plain HTTP that every proxy and firewall allows.</li>
          <li><strong>Good:</strong> no wasted &quot;nothing changed&quot; answers, however rare the updates are.</li>
          <li><strong>Bad:</strong> the server holds one open request per waiting client.</li>
          <li><strong>Bad:</strong> a new request after every single message, plus a timeout to handle.</li>
          <li><strong>Bad:</strong> missed messages and ordering are yours to handle (hence the <code>since</code> id).</li>
        </ul>

        <h4 className="topic">B.5 Where long polling fits</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Why long polling fits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Notification bell</td>
              <td>Rare, unpredictable updates that should still show up promptly</td>
            </tr>
            <tr>
              <td>Background job and task monitoring (video processing, report exports, builds and deploys)</td>
              <td>Runs for minutes, changes status only a few times; each change arrives the moment it happens</td>
            </tr>
            <tr>
              <td>&quot;New mail&quot; check in a webmail inbox</td>
              <td>Hours can pass between emails, and a new one should appear without a refresh</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Today SSE (Part D) often does these same jobs more cleanly; long polling stays as the plain-HTTP option that works
          through any network.
        </p>

        {/* ============================================================ */}
        <h3 className="part">Part C — WebSocket: both sides talk</h3>

        <h4 className="topic">C.1 What polling can&apos;t do: talk back</h4>
        <div className="concept">
          <p className="concept-label">Concept — polling is one-way</p>
          <ul>
            <li>
              In both kinds of polling the browser asks and the server answers. The server still never starts a
              conversation; long polling only lets it <strong>delay its answer</strong>.
            </li>
            <li>
              Sending something the other way (a chat message, a game move, a bid) is a separate request, with full HTTP
              headers, for every single message.
            </li>
            <li>
              That&apos;s fine when the browser mostly <strong>watches</strong>. It falls apart when people{" "}
              <strong>interact live</strong>: a chat with &quot;typing…&quot; indicators, or a game sending moves many times
              a second, would be a stream of requests going out plus a poll to hear everyone else.
            </li>
          </ul>
        </div>

        <h4 className="topic">C.2 WebSocket: one connection, both directions</h4>
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
        <p className="compare-label">Server (the ws library): a chat room</p>
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
          <li><strong>Good:</strong> truly two-way, with the lowest latency and tiny overhead per message.</li>
          <li><strong>Good:</strong> the server can push to many clients at once (a room, a game, an auction).</li>
          <li><strong>Bad:</strong> the costs are real enough to get their own section: see C.4.</li>
        </ul>
        <div className="concept">
          <p className="concept-label">Concept — Socket.IO</p>
          <ul>
            <li>
              Socket.IO is a library <strong>on top of</strong> WebSocket, not a different name for it.
            </li>
            <li>
              It adds what you&apos;d otherwise build yourself: automatic reconnects, <strong>rooms</strong> (send to a group
              of clients), broadcasting, acknowledgements, and a fallback to long polling when WebSocket is blocked.
            </li>
            <li>
              The catch: it has its own protocol on top. A Socket.IO client can&apos;t talk to a plain WebSocket server, and a
              plain WebSocket client can&apos;t talk to a Socket.IO server.
            </li>
          </ul>
        </div>

        <h4 className="topic">C.3 Classic WebSocket features</h4>
        <p>The common thread: <strong>both sides send, often, and the delay has to be tiny.</strong></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Why it needs WebSocket</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chat and messaging (Slack, Discord, WhatsApp Web)</td>
              <td>Messages, typing indicators, and read receipts flow both ways, constantly</td>
            </tr>
            <tr>
              <td>Multiplayer games</td>
              <td>Every player sends moves many times a second and needs everyone else&apos;s instantly</td>
            </tr>
            <tr>
              <td>Collaborative editing (several people in one document or design file)</td>
              <td>Every edit and every cursor movement goes out, and everyone else&apos;s comes in, live</td>
            </tr>
            <tr>
              <td>Live auction</td>
              <td>
                Your bids go up and everyone else&apos;s come down; bidding on a price that&apos;s 2 s stale in the final
                seconds loses the auction
              </td>
            </tr>
            <tr>
              <td>AI agents you can interrupt or steer</td>
              <td>
                A voice assistant you can talk over mid-sentence, or an agent you redirect while it works: you send while
                the AI is still sending. OpenAI&apos;s Realtime API, for voice, is one built on WebSocket
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">C.4 When WebSocket is the wrong tool</h4>
        <ul>
          <li>
            <strong>Stateful connections.</strong> Each client is tied to one server process. Scaling out needs sticky
            sessions, or a pub/sub layer (such as Redis) so every server hears every message. A REST server is stateless:
            you just add copies.
          </li>
          <li>
            <strong>Not plain HTTP after the handshake.</strong> Some corporate proxies and firewalls block or cut long-lived
            WebSocket connections.
          </li>
          <li>
            <strong>No custom headers from the browser.</strong> The browser&apos;s <code>WebSocket</code> can&apos;t send{" "}
            <code>Authorization: Bearer …</code>, so auth goes through a cookie, a token in the URL, or a first message.
          </li>
          <li>
            <strong>Everything else is yours to write:</strong> reconnecting, heartbeats to detect dead connections, and
            resending messages missed while disconnected (or you adopt Socket.IO).
          </li>
          <li>
            <strong>Overkill for one-way data.</strong> If the browser only listens, you&apos;re paying for all of the above
            and using half the pipe.
          </li>
        </ul>
        <p className="callout">When only the server needs to talk, there&apos;s a simpler tool built for exactly that: SSE.</p>

        {/* ============================================================ */}
        <h3 className="part">Part D — Server-Sent Events (SSE): the server streams</h3>

        <h4 className="topic">D.1 SSE: one response that never ends</h4>
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
          <T x={320} y={204}>server → browser only</T>
        </svg>
        <p className="compare-label">On the wire: plain text, one event per block, a blank line between events</p>
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
          <li><strong>Good:</strong> plain HTTP, very little code, and the browser reconnects automatically.</li>
          <li><strong>Good:</strong> on reconnect the browser sends the last event id it got, so the server can catch it up.</li>
          <li><strong>Good:</strong> one response carries every update, so it does long polling&apos;s job without a new request per message.</li>
          <li><strong>Bad:</strong> one direction only. To send something, the browser makes a normal request.</li>
          <li><strong>Bad:</strong> text only, and on HTTP/1.1 browsers allow just 6 connections per domain (fine on HTTP/2).</li>
        </ul>

        <h4 className="topic">D.2 Where SSE fits</h4>
        <p>The common thread: <strong>the server has a stream of updates, and the browser only listens.</strong></p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Why SSE fits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AI chat answers (ChatGPT, Claude)</td>
              <td>
                You send the prompt once, as a normal request; the answer streams back a few words at a time, so you can start
                reading before it&apos;s finished
              </td>
            </tr>
            <tr>
              <td>Live scores and match commentary</td>
              <td>Thousands of viewers on one stream, nobody sends anything back, and a dropped connection catches up by itself</td>
            </tr>
            <tr>
              <td>Live price tickers (stocks, crypto)</td>
              <td>Prices flow one way; placing a trade is a separate, normal request</td>
            </tr>
            <tr>
              <td>Build and deploy logs in a hosting dashboard</td>
              <td>Log lines arrive one by one as the build runs, and you just watch</td>
            </tr>
            <tr>
              <td>Notification feeds and job progress</td>
              <td>The same features as long polling, with one open response instead of a request per update</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          See it yourself: open ChatGPT or Claude, open DevTools (<code>Cmd+Opt+I</code> (Mac) / <code>Ctrl+Shift+I</code>{" "}
          (Windows)) → Network, send a message, and click the request that keeps loading: its response type is{" "}
          <code>text/event-stream</code>.
        </p>
        <div className="concept">
          <p className="concept-label">Concept — why AI chat is SSE, but an interruptible agent is WebSocket</p>
          <ul>
            <li>
              A normal chat turn is <strong>one request in, one stream out</strong>. While the answer streams, you have
              nothing to send; the Stop button just closes the response.
            </li>
            <li>
              The prompt goes out as a <code>POST</code> with a body, and <code>EventSource</code> can only send a{" "}
              <code>GET</code>, so these apps read the same SSE format with <code>fetch</code> and a stream reader instead.
            </li>
            <li>
              An agent you can talk over or redirect mid-task has to <strong>receive while it sends</strong>. That&apos;s
              two-way, so it&apos;s WebSocket.
            </li>
          </ul>
        </div>

        {/* ============================================================ */}
        <h3 className="part">Part E — Choosing one</h3>

        <h4 className="topic">E.1 Side by side</h4>
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
              <td>Direction</td>
              <td>Browser asks</td>
              <td>Browser asks; server answers when ready</td>
              <td>Both ways</td>
              <td>Server → browser</td>
            </tr>
            <tr>
              <td>Delay</td>
              <td>Up to the interval</td>
              <td>Near-instant</td>
              <td>Instant</td>
              <td>Instant</td>
            </tr>
            <tr>
              <td>Connection</td>
              <td>A new request every time</td>
              <td>Held, then reopened</td>
              <td>One, kept open</td>
              <td>One, kept open</td>
            </tr>
            <tr>
              <td>Runs over</td>
              <td>Plain HTTP</td>
              <td>Plain HTTP</td>
              <td>Its own protocol, after an HTTP upgrade</td>
              <td>Plain HTTP</td>
            </tr>
            <tr>
              <td>Reconnecting</td>
              <td>Not needed</td>
              <td>Your loop</td>
              <td>Yours to write (Socket.IO does it)</td>
              <td>Built into the browser</td>
            </tr>
            <tr>
              <td>Main cost</td>
              <td>Wasted requests</td>
              <td>Held requests</td>
              <td>Stateful connections; harder to scale</td>
              <td>Held connections</td>
            </tr>
          </tbody>
        </table>

        <h4 className="topic">E.2 Which one, when</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Use</th>
              <th>When</th>
              <th>Classic features</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Short polling</td>
              <td>The data changes constantly, and a few seconds late is fine</td>
              <td>Monitoring dashboards, viewer counters, live leaderboards</td>
            </tr>
            <tr>
              <td>Long polling</td>
              <td>Updates are rare and unpredictable, and it has to work over plain HTTP anywhere</td>
              <td>Notification bells, background job status, &quot;new mail&quot; checks</td>
            </tr>
            <tr>
              <td>WebSocket</td>
              <td>Both sides send, often, with tiny delay</td>
              <td>Chat, multiplayer games, collaborative editing, live auctions, interruptible AI agents</td>
            </tr>
            <tr>
              <td>SSE</td>
              <td>The server streams and the browser only listens</td>
              <td>AI chat answers, live scores, price tickers, build logs</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Pick the simplest one that fits. If the browser only listens, SSE is usually enough; reach for WebSocket when it
          has to talk back.
        </p>
      </section>
    </div>
  );
}
