// Normalizes tool calls from Claude Code and Codex so the hooks treat them the same.
//   Claude Code: Edit / Write / MultiEdit (tool_input.file_path), Bash (tool_input.command)
//   Codex:       apply_patch (tool_input.command holds the patch text), Bash (tool_input.command)

const EDIT_TOOLS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit", "apply_patch"]);

/** File paths named in a Codex patch: "*** Update File: path", "*** Move to: path", ... */
function patchFiles(patch) {
  return [
    ...String(patch).matchAll(/^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$/gm),
  ].map((m) => m[1].trim());
}

/** { isEdit, isBash, files, command } for a PreToolUse / PostToolUse payload. */
export function describeTool(input) {
  const tool = input.tool_name;
  const args = input.tool_input ?? {};
  const isEdit = EDIT_TOOLS.has(tool);
  const isBash = tool === "Bash";
  const files =
    tool === "apply_patch"
      ? patchFiles(args.command)
      : args.file_path
        ? [String(args.file_path)]
        : [];
  return { tool, isEdit, isBash, files, command: isBash ? String(args.command ?? "") : "" };
}
