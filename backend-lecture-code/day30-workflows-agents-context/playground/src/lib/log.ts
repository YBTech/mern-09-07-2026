import { fileURLToPath } from "node:url";

// Console formatting only, nothing here talks to the API
export const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
export const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
export const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
export const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
export const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
export const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
export const magenta = (s: string) => `\x1b[35m${s}\x1b[0m`;

export function title(text: string) {
  console.log("\n" + bold(cyan(`━━━ ${text} ${"━".repeat(Math.max(0, 70 - text.length))}`)));
}

// One bar per model call: how many tokens the model had to read on that turn
export function tokenBar(label: string, tokens: number, scale = 1000) {
  const width = Math.max(1, Math.round(tokens / scale));
  console.log(`  ${dim(label.padEnd(9))} ${yellow("█".repeat(Math.min(width, 60)))} ${tokens.toLocaleString()}`);
}

// True when this file was started directly (npm run 01), false when another file imports it
export function isMain(metaUrl: string) {
  return process.argv[1] === fileURLToPath(metaUrl);
}

// Print what a reply should have covered, with a tick or a cross for each item
export function printChecklist(checks: { label: string; ok: boolean }[]) {
  for (const check of checks) console.log(`  ${check.ok ? green("✓") : red("✗")} ${check.label}`);
}
