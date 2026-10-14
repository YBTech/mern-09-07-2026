import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [system, setSystem] = useState("You are a friendly assistant. Keep answers short.");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const history: Message[] = [...messages, { role: "user", content: input }];
    setMessages(history);
    setInput("");
    setLoading(true);

    // Send the WHOLE history, then wait for the whole answer
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages: history }),
    });
    const { text } = await res.json();

    setMessages([...history, { role: "assistant", content: text }]);
    setLoading(false);
  }

  return (
    <div>
      <h1>Chat (no streaming)</h1>
      <label>System prompt</label>
      <textarea value={system} onChange={(e) => setSystem(e.target.value)} rows={2} />

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bubble assistant">Waiting for the full answer…</div>}
      </div>

      <div className="row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && input && send()}
          placeholder="Type a message"
        />
        <button onClick={send} disabled={loading || !input}>
          Send
        </button>
      </div>
    </div>
  );
}
