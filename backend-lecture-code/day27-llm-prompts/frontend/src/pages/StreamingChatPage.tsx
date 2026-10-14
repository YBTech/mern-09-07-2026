import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function StreamingChatPage() {
  const [system, setSystem] = useState("You are a friendly assistant. Keep answers short.");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const history: Message[] = [...messages, { role: "user", content: input }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages: history }),
    });

    // Read the response piece by piece and grow the last message
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let answer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      answer += decoder.decode(value, { stream: true });
      setMessages([...history, { role: "assistant", content: answer }]);
    }

    setLoading(false);
  }

  return (
    <div>
      <h1>Chat (streaming)</h1>
      {/* <label>System prompt</label>
      <textarea value={system} onChange={(e) => setSystem(e.target.value)} rows={2} /> */}

      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
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
