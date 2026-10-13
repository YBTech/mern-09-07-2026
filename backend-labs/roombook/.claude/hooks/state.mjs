import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { projectDir } from "./project-dir.mjs";

const dir = `${projectDir}/.claude/state`;
const file = `${dir}/approval.json`;

/** Has the student approved edits for the current prompt? */
export function isApproved() {
  try {
    return existsSync(file) && JSON.parse(readFileSync(file, "utf8")).approved === true;
  } catch {
    return false;
  }
}

export function setApproved(approved) {
  try {
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, JSON.stringify({ approved, ts: new Date().toISOString() }));
  } catch {
    // If state cannot be written, edits stay blocked; the student sees the message.
  }
}
