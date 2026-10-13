import type Database from "better-sqlite3";
import { addDays } from "./utils/datetime";

const ROOMS: [number, string, number, number][] = [
  [1, "Aspen", 1, 4],
  [2, "Birch", 1, 6],
  [3, "Cedar", 2, 8],
  [4, "Dogwood", 2, 12],
  [5, "Elm", 3, 2],
  [6, "Fir", 3, 20],
];

const USERS: [number, string][] = [
  [1, "Ana"],
  [2, "Ben"],
  [3, "Chloe"],
  [4, "Dev"],
  [5, "Eli"],
];

// [roomId, userId, title, day offset, start, end]
const BOOKINGS: [number, number, string, number, string, string][] = [
  [1, 1, "Team standup", 0, "09:00", "10:00"],
  [1, 2, "Design sync", 0, "10:00", "11:00"], // starts exactly when the standup ends
  [2, 3, "Client call", 0, "13:00", "14:30"],
  [3, 4, "Sprint planning", 0, "09:30", "11:00"],
  [4, 5, "All-hands prep", 0, "15:00", "16:00"],
  [1, 3, "1:1", 1, "09:00", "09:30"],
  [6, 1, "Quarterly review", 1, "14:00", "16:00"],
];

/** Fills a fresh database. Booking dates are relative to `baseDate` so the demo is never empty. */
export function seed(db: Database.Database, baseDate: string): void {
  const room = db.prepare("INSERT INTO rooms (id, name, floor, capacity) VALUES (?, ?, ?, ?)");
  const user = db.prepare("INSERT INTO users (id, name) VALUES (?, ?)");
  const booking = db.prepare(
    "INSERT INTO bookings (room_id, user_id, title, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
  );

  for (const r of ROOMS) room.run(...r);
  for (const u of USERS) user.run(...u);
  for (const [roomId, userId, title, offset, start, end] of BOOKINGS) {
    const day = addDays(baseDate, offset);
    booking.run(roomId, userId, title, `${day}T${start}`, `${day}T${end}`);
  }
}
