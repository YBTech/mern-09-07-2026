import Database from "better-sqlite3";
import { seed } from "./seed";
import { today } from "./utils/datetime";

let db: Database.Database | undefined;

/** Creates a brand-new in-memory SQLite database with the schema and seed data. */
export function initDb(baseDate: string = today()): Database.Database {
  db?.close();
  db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE rooms (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      floor INTEGER NOT NULL,
      capacity INTEGER NOT NULL
    );
    CREATE TABLE users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL REFERENCES rooms(id),
      user_id INTEGER NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL
    );
    CREATE INDEX idx_bookings_room_start ON bookings(room_id, start_time);
  `);
  seed(db, baseDate);
  return db;
}

export function getDb(): Database.Database {
  return db ?? initDb();
}
