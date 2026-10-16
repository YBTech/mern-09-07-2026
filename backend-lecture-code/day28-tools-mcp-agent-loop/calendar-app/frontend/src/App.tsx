import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { deleteEvent, getEvents, saveEvent, type CalendarEvent, type EventInput } from "./api";
import EventForm from "./EventForm";
import Assistant from "./Assistant";

const today = new Date().toISOString().slice(0, 10);
const EMPTY: EventInput = { title: "", date: today, time: "", description: "" };

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [draft, setDraft] = useState<EventInput>(EMPTY);

  async function load() {
    setEvents(await getEvents());
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(event: CalendarEvent) {
    setEditing(event);
    setDraft(event);
  }

  function startNew(date: string) {
    setEditing(null);
    setDraft({ ...EMPTY, date });
  }

  async function submit() {
    await saveEvent(draft, editing?.id);
    startNew(draft.date);
    load();
  }

  async function remove(id: number) {
    await deleteEvent(id);
    startNew(today);
    load();
  }

  const sorted = [...events].sort((a, b) =>
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
  );

  return (
    <div className="layout">
      <main>
        <h1>📅 Calendar</h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={events.map((e) => ({
            id: String(e.id),
            title: e.title,
            start: e.time ? `${e.date}T${e.time}` : e.date,
          }))}
          dateClick={(info) => startNew(info.dateStr)}
          eventClick={(info) => startEdit(events.find((e) => e.id === Number(info.event.id))!)}
        />
      </main>

      <aside>
        <EventForm
          draft={draft}
          isEditing={editing !== null}
          onChange={setDraft}
          onSubmit={submit}
          onCancel={() => startNew(today)}
          onDelete={editing ? () => remove(editing.id) : undefined}
        />

        <h2>All events</h2>
        <ul className="event-list">
          {sorted.map((e) => (
            <li key={e.id} onClick={() => startEdit(e)}>
              <strong>{e.title}</strong>
              <span>
                {e.date} {e.time && `· ${e.time}`}
              </span>
              {e.description && <small>{e.description}</small>}
            </li>
          ))}
        </ul>
      </aside>

      <Assistant onChange={load} />
    </div>
  );
}
