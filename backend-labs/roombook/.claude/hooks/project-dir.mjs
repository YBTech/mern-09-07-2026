import { fileURLToPath } from "node:url";

/**
 * The lab folder, found from this file's own location (<lab>/.claude/hooks/).
 * Works for Claude Code and Codex alike, and from any working directory.
 */
export const projectDir = fileURLToPath(new URL("../..", import.meta.url)).replace(/\/$/, "");
