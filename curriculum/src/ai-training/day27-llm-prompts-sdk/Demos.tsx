// Live, mocked demos for Notes.tsx. Nothing here calls a real model: every "backend" reply is a
// hard-coded string delivered through setTimeout, so the demos run offline and always behave the same.
import { useEffect, useRef, useState } from "react";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ───────────────────────── 1.5 streaming vs no streaming ─────────────────────────

const QUESTION = "Explain what an API is, in simple words.";

const REPLY =
  "An API is a way for two programs to talk to each other. Think of a restaurant: you do not " +
  "walk into the kitchen, you give your order to the waiter, and the waiter brings back your " +
  "food. The API is the waiter. Your app sends a request, for example \"give me today's " +
  "weather\", and the other program sends back a response with the data. You never need to " +
  "know how the kitchen works inside. You only need to know what you can order, and what " +
  "comes back. That list of possible orders is the API's documentation.";

const FIRST_WORD_MS = 500; // time to first token
const WORD_MS = 45; // one word every 45 ms after that
const TOTAL_MS = FIRST_WORD_MS + REPLY.split(" ").length * WORD_MS;

/** Mock backend, no streaming: the whole reply arrives at once, after the whole wait. */
async function fakeRequest(): Promise<string> {
  await sleep(TOTAL_MS);
  return REPLY;
}

/** Mock backend, streaming: the same reply, delivered one word at a time. */
async function* fakeStream(): AsyncGenerator<string> {
  await sleep(FIRST_WORD_MS);
  for (const word of REPLY.split(" ")) {
    await sleep(WORD_MS);
    yield word + " ";
  }
}

type ChatState = { status: "idle" | "waiting" | "streaming" | "done"; reply: string; firstWordMs?: number };

function ChatPane({ streaming, trigger }: { streaming: boolean; trigger: number }) {
  const [chat, setChat] = useState<ChatState>({ status: "idle", reply: "" });
  const runId = useRef(0);

  async function send() {
    const id = ++runId.current; // a newer click cancels an older run
    const started = Date.now();
    setChat({ status: "waiting", reply: "" });

    if (!streaming) {
      const reply = await fakeRequest();
      if (id !== runId.current) return;
      setChat({ status: "done", reply, firstWordMs: Date.now() - started });
      return;
    }

    let reply = "";
    for await (const piece of fakeStream()) {
      if (id !== runId.current) return;
      reply += piece;
      setChat((c) => ({
        status: "streaming",
        reply,
        firstWordMs: c.firstWordMs ?? Date.now() - started,
      }));
    }
    setChat((c) => ({ ...c, status: "done" }));
  }

  // The "Send both" button above the two panes bumps `trigger`.
  useEffect(() => {
    if (trigger > 0) send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // Stop any run in progress when the component unmounts.
  useEffect(() => () => void runId.current++, []);

  const busy = chat.status === "waiting" || chat.status === "streaming";
  return (
    <div className="chat-pane">
      <p className="chat-pane-title">{streaming ? "With streaming" : "Without streaming"}</p>
      <div className="chat-log">
        {chat.status !== "idle" && <div className="chat-bubble chat-user">{QUESTION}</div>}
        {chat.status === "waiting" && (
          <div className="chat-bubble chat-bot chat-loading">
            <span className="spinner" /> waiting for the reply…
          </div>
        )}
        {chat.reply && <div className="chat-bubble chat-bot">{chat.reply}</div>}
      </div>
      <div className="chat-input-row">
        <input value={QUESTION} readOnly aria-label="Message" />
        <button onClick={send} disabled={busy}>
          Send
        </button>
      </div>
      <p className="chat-meta">
        {chat.firstWordMs !== undefined
          ? `first words after ${(chat.firstWordMs / 1000).toFixed(1)} s`
          : " "}
      </p>
    </div>
  );
}

export function StreamingDemo() {
  const [trigger, setTrigger] = useState(0);
  return (
    <div className="demo-card chat-demo">
      <div className="demo-actions">
        <button onClick={() => setTrigger((t) => t + 1)}>Send both at the same time</button>
      </div>
      <div className="chat-demo-pair">
        <ChatPane streaming={false} trigger={trigger} />
        <ChatPane streaming trigger={trigger} />
      </div>
      <p className="demo-hint">
        Mocked in the browser with setTimeout: both replies take the same total time.
      </p>
    </div>
  );
}

// ───────────────────────── 3. JSON with and without structured output ─────────────────────────

const EVENT_TEXT = "Lunch with Sam next Friday at 1pm at Joe's Diner";

const EVENT_JSON = `{"title": "Lunch with Sam", "date": "2026-10-23", "time": "13:00", "location": "Joe's Diner"}`;

/** What a model often says when you only ASK for JSON in the prompt. */
const CHATTY_REPLY = `Sure! Here is your JSON:

\`\`\`json
${EVENT_JSON}
\`\`\`

Let me know if you need anything else!`;

type JsonState = { status: "idle" | "waiting" | "done"; raw: string };

function JsonPane({ structured }: { structured: boolean }) {
  const [state, setState] = useState<JsonState>({ status: "idle", raw: "" });

  async function generate() {
    setState({ status: "waiting", raw: "" });
    await sleep(1200); // pretend the model is working
    setState({ status: "done", raw: structured ? EVENT_JSON : CHATTY_REPLY });
  }

  // Run the reply through JSON.parse for real, exactly like app code would.
  let parsed: Record<string, string> | null = null;
  let error = "";
  if (state.status === "done") {
    try {
      parsed = JSON.parse(state.raw);
    } catch (err) {
      error = String(err);
    }
  }

  return (
    <div className="chat-pane">
      <p className="chat-pane-title">
        {structured ? "With structured output" : "Only asking for JSON in the prompt"}
      </p>
      <div className="chat-input-row">
        <textarea value={EVENT_TEXT} readOnly rows={2} aria-label="Event text" />
        <button onClick={generate} disabled={state.status === "waiting"}>
          Create event
        </button>
      </div>
      {state.status === "waiting" && (
        <p className="chat-loading">
          <span className="spinner" /> generating…
        </p>
      )}
      {state.status === "done" && (
        <>
          <p className="json-label">The model replied:</p>
          <pre className="json-raw">{state.raw}</pre>
          <p className="json-label">JSON.parse(reply):</p>
          {parsed ? (
            <div className="event-card">
              <strong>📅 {parsed.title}</strong>
              <span>
                {parsed.date} · {parsed.time}
              </span>
              <span>{parsed.location}</span>
            </div>
          ) : (
            <pre className="json-error">✗ {error}</pre>
          )}
        </>
      )}
    </div>
  );
}

export function JsonDemo() {
  return (
    <div className="demo-card chat-demo">
      <div className="chat-demo-pair">
        <JsonPane structured={false} />
        <JsonPane structured />
      </div>
      <p className="demo-hint">Mocked replies; the JSON.parse call is real.</p>
    </div>
  );
}
