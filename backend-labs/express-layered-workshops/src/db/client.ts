import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

// given — you won't need to touch this. one file-based SQLite database,
// no separate install/config step: better-sqlite3 is a normal npm package,
// there's no server to run or connection string to get right.
const DB_PATH =
  process.env.DB_PATH ?? path.join(__dirname, "../../data/app.db");

const sqlite = new Database(DB_PATH);
sqlite.pragma("foreign_keys = ON"); // SQLite doesn't enforce FKs unless asked

export const db = drizzle(sqlite, { schema });

// creates the tables if they don't exist yet — runs once, on import, so
// `npm run dev` and `npm test` both just work with no separate migration
// step to remember.
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS workshops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    starts_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attendees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workshop_id INTEGER NOT NULL REFERENCES workshops(id),
    attendee_id INTEGER NOT NULL REFERENCES attendees(id),
    status TEXT NOT NULL DEFAULT 'confirmed',
    registered_at TEXT NOT NULL DEFAULT (current_timestamp)
  );
`);
