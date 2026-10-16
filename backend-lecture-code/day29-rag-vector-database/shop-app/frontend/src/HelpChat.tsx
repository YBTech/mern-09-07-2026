import { useState } from "react";

type Source = { source: string; heading: string; foundBy: string[] };
type Message = { role: "user" | "assistant"; content: string; sources?: Source[] };

// Citation numbers restart on every request, so old [n] markers would point at the wrong source
const stripCitations = (text: string) => text.replace(/\s*\[\d+\]/g, "");

// Turn "…30 days [1]." into text + a clickable chip that names the source
function CitedText({ text, sources }: { text: string; sources: Source[] }) {
  return (
    <>
      {text.split(/(\[\d+\])/).map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/);
        const cited = match && sources[Number(match[1]) - 1];
        if (!cited) return part;
        return (
          <sup key={i} className="cite" title={`${cited.source} › ${cited.heading}`}>
            {match[1]}
          </sup>
        );
      })}
    </>
  );
}

export default function HelpChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const history: Message[] = [...messages, { role: "user", content: input }];
    setMessages(history);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history.map((m) => ({ role: m.role, content: stripCitations(m.content) })),
      }),
    });
    const data = await res.json();

    setMessages([
      ...history,
      { role: "assistant", content: data.reply ?? data.error, sources: data.sources ?? [] },
    ]);
    setLoading(false);
  }

  if (!open) {
    return (
      <button className="chat-toggle" onClick={() => setOpen(true)}>
        💬 Help
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-head">
        <strong>💬 Help</strong>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <CitedText text={m.content} sources={m.sources ?? []} />
            {m.sources && m.sources.length > 0 && (
              <div className="sources">
                {m.sources.map((s, j) => (
                  <div key={j}>
                    <sup className="cite">{j + 1}</sup> {s.source} › {s.heading} <em>({s.foundBy.join(" + ")})</em>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="bubble assistant">Searching our policies…</div>}
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
          placeholder="Can I return headphones I opened?"
        />
        <button disabled={loading || !input}>Send</button>
      </form>
    </div>
  );
}
