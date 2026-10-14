import { useState } from "react";

type CalendarEvent = { title: string; date: string; time: string; location: string };

export default function ExtractEventPage() {
  const [text, setText] = useState("Lunch with Sam next Friday at 1pm at Joe's Diner");
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(false);

  async function extract() {
    setLoading(true);
    const res = await fetch("/api/extract-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setEvent(data.event);
    setLoading(false);
  }

  return (
    <div>
      <h1>Extract an event</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} />
      <button onClick={extract} disabled={loading}>
        {loading ? "Extracting…" : "Create event"}
      </button>

      {event && (
        <>
          <div className="event-card">
            <strong>📅 {event.title}</strong>
            <span>
              {event.date} · {event.time}
            </span>
            <span>{event.location}</span>
          </div>
          <pre>{JSON.stringify(event, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
