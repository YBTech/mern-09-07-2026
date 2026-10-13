// PreToolUse (Bash): run the tests before any git commit and stop the commit if they fail.
import { spawnSync } from "node:child_process";
import { readHookInput } from "./read-input.mjs";

const command = readHookInput().tool_input?.command ?? "";
if (/\bgit\s+commit\b/.test(command)) {
  const run = spawnSync("npm", ["test", "--silent"], {
    cwd: process.env.CLAUDE_PROJECT_DIR,
    encoding: "utf8",
  });
  if (run.status !== 0) {
    console.error("Blocked: tests are failing, so the commit was stopped. Fix the tests first.");
    console.error((run.stdout + run.stderr).split("\n").slice(-25).join("\n"));
    process.exit(2);
  }
}
