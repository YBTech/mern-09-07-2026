// PreToolUse (Read|Edit|Write|Bash): never touch .env files (but .env.example is fine).
import { readHookInput } from "./read-input.mjs";

const input = readHookInput().tool_input ?? {};
const target = `${input.file_path ?? ""} ${input.command ?? ""}`;

if (/(^|[\/\s"'])\.env(?!\.example)(\.\w+)?(?=$|[\s"'])/.test(target)) {
  console.error("Blocked: .env files hold secrets. Use .env.example to see which variables exist.");
  process.exit(2);
}
