import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

// In-memory SQLite: the database lives and dies with the server process.
// Every restart starts from a fresh table and re-seeds (see seed.ts).
const sqlite = new Database(':memory:');

sqlite.exec(`
  CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    prep_time_minutes INTEGER NOT NULL,
    cook_time_minutes INTEGER NOT NULL,
    servings INTEGER NOT NULL,
    is_vegetarian INTEGER NOT NULL DEFAULT 0,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    image_url TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )
`);

export const db = drizzle(sqlite, { schema });
