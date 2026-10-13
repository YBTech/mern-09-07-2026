// PreToolUse (file edits and Bash): no file changes until the student replies "GO:".
// Works for Claude Code (Edit, Write, MultiEdit) and Codex (apply_patch).
import { appendLog } from "./log.mjs";
import { readHookInput } from "./read-input.mjs";
import { isApproved } from "./state.mjs";
import { describeTool } from "./tool-info.mjs";

const { tool, isEdit, isBash, files, command } = describeTool(readHookInput());

// The agent may never touch the hook, config or state files themselves.
const protectedPath = /(^|[\/\s"'])\.(claude|codex)([\/\s"']|$)/;
// Shell commands that write files: sed -i, tee, perl -i, git apply/checkout/restore, redirects.
const writesFiles = (cmd) => {
  const c = cmd.replace(/\d?>&\d|\d?>\s*\/dev\/null/g, "");
  return /\bsed\s+(-\w*i|--in-place)|\btee\b|\bperl\s+-\w*i|\bgit\s+(apply|checkout|restore|stash|reset)\b|\bpatch\b|(^|[^<>=-])>{1,2}\s*[^\s&]/.test(
    c,
  );
};

const target = isEdit ? files.join(" ") : command;

let reason = null;
if (
  (isEdit || isBash) &&
  protectedPath.test(target) &&
  (isEdit || writesFiles(target) || /state/.test(target))
) {
  reason = "protected";
} else if (!isApproved() && (isEdit || (isBash && writesFiles(target)))) {
  reason = "no-approval";
}

if (reason) {
  appendLog({ event: "blocked", reason, tool, target: target.slice(0, 200) });
  console.error(
    reason === "protected"
      ? "Blocked: the .claude and .codex folders belong to the instructor setup. Do not edit them."
      : "Blocked: the student has not approved edits yet. Restate the problem, propose a plan of at most 3 steps, " +
          "then STOP. The student approves by replying with a message that starts with GO:",
  );
  process.exit(2);
}
