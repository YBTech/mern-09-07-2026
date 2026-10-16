import fs from "node:fs";
import { dim, json, title } from "./lib/log";

// Ingestion, step 1: cut every file into chunks. There are many ways to cut, see the options below
type Chunk = { source: string; heading: string; text: string };

const chunks: Chunk[] = [];

for (const file of fs.readdirSync("docs")) {
  const markdown = fs.readFileSync(`docs/${file}`, "utf8");

  // Option 1 (used): one chunk per "## " section
  const sections = markdown.split("\n## ").slice(1);
  if (file === "privacy-policy.md") {
    console.log(sections);
  }

  for (const section of sections) {
    const [heading, ...lines] = section.split("\n");
    chunks.push({ source: file, heading, text: lines.join("\n").trim() });
  }

  // Option 2: one chunk per paragraph. Smaller, but a paragraph loses its heading
  // for (const paragraph of markdown.split("\n\n")) {
  //   chunks.push({ source: file, heading: "", text: paragraph.trim() });
  // }

  // Option 3: fixed size with overlap: 500 characters, the next one starts 100 early
  // Simple, but can cut a sentence in half
  // for (let start = 0; start < markdown.length; start += 400) {
  //   chunks.push({ source: file, heading: "", text: markdown.slice(start, start + 500) });
  // }

  // Option 4: semantic. Embed each sentence, start a new chunk when the topic changes
  // Better chunks, but one embedding per sentence at ingestion

  // Option 5: parent-child. Search small paragraphs, send the whole "## " section
  // Precise match, full context for the model
}

title(`${chunks.length} chunks`);
json(chunks.slice(0, 3));
console.log(dim(`  … and ${chunks.length - 3} more`));
