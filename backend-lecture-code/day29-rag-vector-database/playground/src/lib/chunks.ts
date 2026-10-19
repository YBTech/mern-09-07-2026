import fs from "node:fs";

// Same chunking as 04-chunk.ts: one chunk per "## " section
export type Chunk = { source: string; heading: string; text: string };

export function loadChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  for (const file of fs.readdirSync("docs")) {
    const markdown = fs.readFileSync(`docs/${file}`, "utf8");
    for (const section of markdown.split("\n## ").slice(1)) {
      const [heading, ...lines] = section.split("\n");
      chunks.push({ source: file, heading, text: lines.join("\n").trim() });
    }
  }
  return chunks;
}
