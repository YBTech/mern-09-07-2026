import { readFileSync } from "node:fs";

/** Claude Code passes the hook event as JSON on stdin. */
export function readHookInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
}
