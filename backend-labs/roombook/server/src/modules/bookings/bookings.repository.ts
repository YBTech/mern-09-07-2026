import { getDb } from "../../db";
import type { Booking } from "./bookings.types";

const SELECT = `
  SELECT b.id, b.room_id AS roomId, r.name AS roomName, b.user_id AS userId, u.name AS userName,
         b.title, b.start_time AS start, b.end_time AS "end"
  FROM bookings b
  JOIN rooms r ON r.id = b.room_id
  JOIN users u ON u.id = b.user_id`;

export const bookingsRepository = {
  /** Every booking that starts on the given day, earliest first. */
  listForDate(date: string): Booking[] {
    return getDb()
      .prepare(`${SELECT} WHERE substr(b.start_time, 1, 10) = ? ORDER BY b.start_time`)
      .all(date) as Booking[];
  },

  listForRoomOnDate(roomId: number, date: string): Booking[] {
    return getDb()
      .prepare(
        `${SELECT} WHERE b.room_id = ? AND substr(b.start_time, 1, 10) = ? ORDER BY b.start_time`,
      )
      .all(roomId, date) as Booking[];
  },

  findById(id: number): Booking | undefined {
    return getDb().prepare(`${SELECT} WHERE b.id = ?`).get(id) as Booking | undefined;
  },

  insert(data: {
    roomId: number;
    userId: number;
    title: string;
    start: string;
    end: string;
  }): number {
    const result = getDb()
      .prepare(
        "INSERT INTO bookings (room_id, user_id, title, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
      )
      .run(data.roomId, data.userId, data.title, data.start, data.end);
    return Number(result.lastInsertRowid);
  },

  remove(id: number): void {
    getDb().prepare("DELETE FROM bookings WHERE id = ?").run(id);
  },
};
