import { initDb } from "../src/db";

/** A Monday far in the future, so the seed bookings never depend on today's date. */
export const DAY = "2030-01-07";
export const NEXT_DAY = "2030-01-08";

export function resetDb() {
  initDb(DAY);
}
