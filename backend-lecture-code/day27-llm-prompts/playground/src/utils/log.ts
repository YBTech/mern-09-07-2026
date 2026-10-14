import type Anthropic from "@anthropic-ai/sdk";

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

export function field(label: string, value: unknown) {
  const shown = typeof value === "string" ? value : JSON.stringify(value);
  console.log(`  ${dim(label.padEnd(14))} ${shown}`);
}

// Pretty JSON: keys cyan, strings green, numbers yellow, true/false/null magenta, braces dim
export function json(value: unknown) {
  const pretty = JSON.stringify(value, null, 2) ?? "undefined";
  const colored = pretty.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}[\],]/g,
    (match, str, colon, keyword) => {
      if (str) return colon ? cyan(str) + dim(colon) : green(str);
      if (keyword) return magenta(match);
      if (/^[{}[\],]$/.test(match)) return dim(match);
      return yellow(match);
    },
  );
  console.log(colored);
}

export function printResponse(res: Anthropic.Message) {
  title("Response");
  field("id", res.id);
  field("type", res.type);
  field("role", res.role);
  field("model", res.model);
  field("stop_reason", stopColor(res.stop_reason));
  field("usage", `${res.usage.input_tokens} in → ${res.usage.output_tokens} out (tokens)`);
  console.log(`  ${dim("content")}        ${res.content.length} block(s):`);
  for (const block of res.content) {
    if (block.type === "text") {
      console.log(`    ${green("[text]")} ${block.text}`);
    } else if (block.type === "thinking") {
      console.log(`    ${magenta("[thinking]")} ${dim(block.thinking || "(hidden)")}`);
    } else {
      console.log(`    ${yellow(`[${block.type}]`)}`);
    }
  }
}

function stopColor(reason: string | null) {
  if (reason === "end_turn") return green(reason);
  if (reason === "max_tokens") return red(`${reason}  ← the answer was cut off!`);
  return yellow(String(reason));
}
