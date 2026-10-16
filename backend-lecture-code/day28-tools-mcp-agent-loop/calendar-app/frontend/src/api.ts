export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
}

export type EventInput = Omit<CalendarEvent, "id">;

export async function getEvents(): Promise<CalendarEvent[]> {
  const res = await fetch("/api/events");
  return res.json();
}

export async function saveEvent(event: EventInput, id?: number) {
  await fetch(id ? `/api/events/${id}` : "/api/events", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(id: number) {
  await fetch(`/api/events/${id}`, { method: "DELETE" });
}
