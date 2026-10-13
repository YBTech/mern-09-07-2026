// PreToolUse (Bash): stop commands that are hard to undo. Exit code 2 blocks the call
// and sends stderr back to Claude as the reason.
import { readHookInput } from "./read-input.mjs";

const command = readHookInput().tool_input?.command ?? "";
const blocked = [
  [/\brm\s+(-\w*r\w*f|-\w*f\w*r)\b/, "rm -rf is not allowed in this project"],
  [/\bgit\s+push\b.*(--force|\s-f\b)/, "force-push is not allowed"],
  [/\bgit\s+reset\s+--hard\b/, "git reset --hard would throw away work"],
];

for (const [pattern, reason] of blocked) {
  if (pattern.test(command)) {
    console.error(`Blocked: ${reason}. Ask the user first.`);
    process.exit(2);
  }
}
