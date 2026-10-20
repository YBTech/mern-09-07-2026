import { useEffect, useRef, useState } from "react";

// A deliberately plain chat window. Every agent concern (routing, RAG, tools, approval, memory) lives in the backend graph.
// The only graph-aware things here: the node path under each reply, the cart strip, and the Confirm / Cancel card.

type CartLine = { item: string; size?: string; quantity: number };
type Pending = { question: string; cart: CartLine[]; total: number };
type Message = { role: "user" | "assistant"; content: string; path?: string[] };

// Events the backend streams (Server-Sent Events): which node ran, a piece of the reply, and how the run ended
type ServerEvent =
  | { event: "node"; data: { node: string } }
  | { event: "token"; data: { text: string } }
  | { event: "done"; data: { cart: CartLine[]; total: number; reply: string | null } }
  | { event: "interrupt"; data: { cart: CartLine[]; total: number; pending: Pending } }
  | { event: "error"; data: { message: string } };

const SUGGESTIONS = ["What's gluten-free?", "Two large pepperonis and a coke", "Is the Veggie Garden safe for a nut allergy?", "Where is order S-1002?"];

// One thread = one conversation. The backend keeps all of its state under this id.
function loadThreadId() {
  let id = localStorage.getItem("pizza-thread");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("pizza-thread", id);
  }
  return id;
}

// POST and read the response body as a stream of "event: …\ndata: …\n\n" blocks
async function postAndStream(url: string, body: unknown, onEvent: (e: ServerEvent) => void) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok || !res.body) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop()!;
    for (const block of blocks) {
      const event = block.match(/^event: (.*)$/m)?.[1];
      const data = block.match(/^data: (.*)$/m)?.[1];
      if (event && data) onEvent({ event, data: JSON.parse(data) } as ServerEvent);
    }
  }
}

const describe = (l: CartLine) => `${l.quantity}× ${l.size ? l.size + " " : ""}${l.item}`;

export default function App() {
  const [threadId, setThreadId] = useState(loadThreadId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [cart, setCart] = useState<{ lines: CartLine[]; total: number }>({ lines: [], total: 0 });
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const logEnd = useRef<HTMLDivElement>(null);

  // Reload (or a server restart): the graph's saved checkpoint gives back the chat, the cart and any open approval
  useEffect(() => {
    fetch(`/api/chat/${threadId}`)
      .then((r) => r.json())
      .then((saved) => {
        setMessages(saved.messages);
        setCart({ lines: saved.cart, total: saved.total });
        setPending(saved.pending);
      });
  }, [threadId]);

  useEffect(() => {
    logEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  // Add an empty assistant bubble, then fill it from the events
  async function run(url: string, body: unknown) {
    setBusy(true);
    setPending(null);
    setMessages((m) => [...m, { role: "assistant", content: "", path: [] }]);
    const patch = (fn: (last: Message) => Message) => setMessages((m) => [...m.slice(0, -1), fn(m[m.length - 1])]);

    try {
      await postAndStream(url, body, ({ event, data }) => {
        if (event === "node") {
          // text written before a tool call ("Let me add that…") is replaced by the final answer
          patch((last) => ({ ...last, path: [...(last.path ?? []), data.node], content: data.node === "tools" ? "" : last.content }));
        }
        if (event === "token") patch((last) => ({ ...last, content: last.content + data.text }));
        if (event === "done") {
          patch((last) => ({ ...last, content: data.reply ?? last.content }));
          setCart({ lines: data.cart, total: data.total });
        }
        if (event === "interrupt") {
          // The graph paused: drop the empty bubble and show the Confirm card instead
          setMessages((m) => m.slice(0, -1));
          setCart({ lines: data.cart, total: data.total });
          setPending(data.pending);
        }
        if (event === "error") patch((last) => ({ ...last, content: `Something went wrong: ${data.message}` }));
      });
    } catch (error) {
      patch((last) => ({ ...last, content: `Something went wrong: ${(error as Error).message}` }));
    }
    setBusy(false);
  }

  function send(text: string) {
    if (!text.trim() || busy || pending) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    run("/api/chat", { threadId, message: text });
  }

  const answerCheckout = (approved: boolean) => run("/api/chat/resume", { threadId, approved });

  function newChat() {
    const id = crypto.randomUUID();
    localStorage.setItem("pizza-thread", id);
    setThreadId(id);
    setMessages([]);
    setCart({ lines: [], total: 0 });
    setPending(null);
  }

  return (
    <div className="app">
      <header>
        <h1>🍕 Slice Pizza</h1>
        <button className="ghost" onClick={newChat} disabled={busy}>
          New chat
        </button>
      </header>

      <div className="cart">
        🛒 {cart.lines.length === 0 ? "Your cart is empty" : <>{cart.lines.map(describe).join(", ")} — <b>${cart.total.toFixed(2)}</b></>}
      </div>

      <div className="log">
        {messages.length === 0 && (
          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="bubble">{m.content || (busy && i === messages.length - 1 ? "…" : "")}</div>
            {m.path && m.path.length > 0 && <div className="path">{m.path.join(" → ")}</div>}
          </div>
        ))}

        {pending && (
          <div className="confirm">
            <strong>{pending.question}</strong>
            <ul>
              {pending.cart.map((l, i) => (
                <li key={i}>{describe(l)}</li>
              ))}
            </ul>
            <div>
              Total <b>${pending.total.toFixed(2)}</b>
            </div>
            <div className="row">
              <button onClick={() => answerCheckout(true)}>Confirm</button>
              <button className="ghost" onClick={() => answerCheckout(false)}>
                Cancel
              </button>
            </div>
            <div className="path">
              classify → confirm <span className="pause">⏸ paused, waiting for you</span>
            </div>
          </div>
        )}
        <div ref={logEnd} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={pending ? "Confirm or cancel the order above" : "Ask a question or order a pizza…"} disabled={busy || !!pending} />
        <button disabled={busy || !!pending || !input.trim()}>Send</button>
      </form>
    </div>
  );
}
