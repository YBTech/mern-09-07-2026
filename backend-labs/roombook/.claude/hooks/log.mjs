import { appendFileSync } from "node:fs";
import { projectDir } from "./project-dir.mjs";

/** Append one JSON line to .claude/session-log.jsonl. Never throws. */
export function appendLog(entry) {
  try {
    const row = { ts: new Date().toISOString(), ...entry };
    appendFileSync(`${projectDir}/.claude/session-log.jsonl`, JSON.stringify(row) + "\n");
  } catch {
    // Logging must never get in the way of the student's work.
  }
}
