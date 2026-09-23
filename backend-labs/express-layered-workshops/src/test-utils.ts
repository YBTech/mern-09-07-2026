// given — used by every *.test.ts file's beforeEach to wipe the database
// between tests, the same idea as express-crud-todo resetting its JSON
// file. Order matters: registrations reference workshops/attendees, so
// they're cleared first.

import { db } from "./db/client";
import { attendees, registrations, workshops } from "./db/schema";

export async function resetDb(): Promise<void> {
  await db.delete(registrations);
  await db.delete(attendees);
  await db.delete(workshops);
}
