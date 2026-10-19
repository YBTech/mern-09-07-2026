// Notification: ping the desktop when Claude Code needs the user.
import { spawnSync } from "node:child_process";
import { readHookInput } from "./read-input.mjs";

const message = readHookInput().message ?? "Claude Code needs your attention";
if (process.platform === "darwin") {
  spawnSync("osascript", [
    "-e",
    `display notification ${JSON.stringify(message)} with title "Claude Code"`,
  ]);
} else {
  console.log(message);
}
