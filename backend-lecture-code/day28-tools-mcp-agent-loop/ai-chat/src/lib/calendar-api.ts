// The calendar app's REST API. These are the functions we will let the model ask for.
const API = "http://localhost:3001/api/events";

export async function listEvents() {
  const res = await fetch(API);
  return (await res.json()) as object[];
}

export async function createEvent(input: { title: string; date: string; time?: string; description?: string }) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function updateEvent({ id, ...changes }: { id: number; [key: string]: unknown }) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });
  return res.json();
}

export async function deleteEvent({ id }: { id: number }) {
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });
  return res.json();
}
