import { readdirSync, readFileSync } from "node:fs";

// The three long incident files (see scripts/generate-incident-files.ts), read from disk
const DIR = new URL("../../incident/", import.meta.url);

export type Section = { file: string; heading: string; text: string };

export function listFiles() {
  return readdirSync(DIR).filter((name) => name.endsWith(".md"));
}

// The whole file: what a naive read_file tool returns
export function readFile(name: string) {
  return readFileSync(new URL(name, DIR), "utf8");
}

// Cut a file at its "## " headings
export function loadSections(): Section[] {
  return listFiles().flatMap((file) =>
    readFile(file)
      .split(/^## /m)
      .slice(1)
      .map((part) => {
        const [heading, ...rest] = part.split("\n");
        return { file, heading: heading.trim(), text: rest.join("\n").trim() };
      }),
  );
}

export function readSection(file: string, heading: string) {
  return loadSections().find((s) => s.file === file && s.heading === heading)?.text ?? "section not found";
}

// Keyword search: score every section by how often the query words appear, return short snippets
export function search(query: string, limit = 5) {
  const words = query.toLowerCase().match(/[a-z0-9.$-]+/g)?.filter((w) => w.length > 2) ?? [];
  return loadSections()
    .map((s) => {
      const text = s.text.toLowerCase();
      const score = words.reduce((sum, w) => sum + text.split(w).length - 1, 0);
      const at = Math.max(0, text.indexOf(words.find((w) => text.includes(w)) ?? ""));
      return { file: s.file, heading: s.heading, score, snippet: s.text.slice(Math.max(0, at - 60), at + 200).replace(/\s+/g, " ") };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ file, heading, snippet }) => ({ file, heading, snippet }));
}
