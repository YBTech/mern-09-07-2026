import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };
type Step = { tool: string; input: unknown };

export default function Assistant({ onChange }: { onChange: () => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const history: Message[] = [...messages, { role: "user", content: input }];
    setMessages(history);
    setInput("");
    setSteps([]);
    setLoading(true);

    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();

    setMessages([...history, { role: "assistant", content: data.reply ?? data.error }]);
    setSteps(data.steps ?? []);
    setLoading(false);
    onChange(); // the agent may have changed the calendar
  }

  if (!open) {
    return (
      <button className="assistant-toggle" onClick={() => setOpen(true)}>
        ✨ Assistant
      </button>
    );
  }

  return (
    <div className="assistant-panel">
      <div className="assistant-head">
        <strong>✨ Assistant</strong>
        <button className="secondary" onClick={() => setOpen(false)}>
          ✕
        </button>
      </div>
      <div className="assistant-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bubble assistant">Thinking…</div>}
        {steps.length > 0 && (
          <div className="steps">
            {steps.map((s, i) => (
              <div key={i}>
                🔧 {s.tool} <code>{JSON.stringify(s.input)}</code>
              </div>
            ))}
          </div>
        )}
      </div>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          if (input && !loading) send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add lunch with Sam on Friday at 1pm"
        />
        <button disabled={loading || !input}>Send</button>
      </form>
    </div>
  );
}
