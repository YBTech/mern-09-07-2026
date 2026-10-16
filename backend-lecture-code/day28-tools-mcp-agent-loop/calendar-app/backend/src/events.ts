// In-memory "database": resets when the server restarts
export interface CalendarEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM, or "" for all day
  description: string;
}

function inDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

let nextId = 3;
export const events: CalendarEvent[] = [
  { id: 1, title: "Team stand-up", date: inDays(1), time: "09:30", description: "" },
  { id: 2, title: "Dentist", date: inDays(3), time: "15:00", description: "Bring insurance card" },
];

export function newId() {
  return nextId++;
}
