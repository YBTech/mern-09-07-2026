// PostToolUse (Edit|Write): format the file that was just changed.
import { spawnSync } from "node:child_process";
import { readHookInput } from "./read-input.mjs";

const file = readHookInput().tool_input?.file_path;
if (file && /\.(ts|json|md)$/.test(file)) {
  spawnSync("npx", ["prettier", "--write", file], { stdio: "ignore" });
}
