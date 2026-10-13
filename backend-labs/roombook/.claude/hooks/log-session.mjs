// Audit log: appends one JSON line per event to .claude/session-log.jsonl.
// Wired to UserPromptSubmit and PostToolUse (Claude Code and Codex). Never blocks anything.
import { appendLog } from "./log.mjs";
import { readHookInput } from "./read-input.mjs";
import { describeTool } from "./tool-info.mjs";

const clip = (value, max) => String(value ?? "").slice(0, max);

try {
  const input = readHookInput();
  const args = input.tool_input ?? {};
  const entry = {
    ts: new Date().toISOString(),
    event: input.hook_event_name,
    session: input.session_id,
  };

  if (input.hook_event_name === "UserPromptSubmit") {
    entry.prompt = clip(input.prompt, 4000);
  } else if (input.hook_event_name === "PostToolUse") {
    entry.tool = input.tool_name;
    // Log what was touched, never file contents. A Codex patch is logged as its file names.
    const { isEdit, files } = describeTool(input);
    entry.target = clip(
      isEdit
        ? files.join(", ")
        : (args.command ?? args.pattern ?? args.path ?? args.file_path ?? ""),
      300,
    );
  }

  appendLog(entry);
} catch {
  // Logging must never get in the way of the student's work.
}
