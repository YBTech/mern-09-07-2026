import { Pinecone } from "@pinecone-database/pinecone";
import fs from "node:fs";

// The ingestion pipeline: docs/*.md → chunks → Pinecone
// Run it again every time a document changes

// 1. Chunk: one chunk per "## " section
const chunks: { id: string; source: string; heading: string; text: string }[] = [];

for (const file of fs.readdirSync("../docs").filter((f) => f.endsWith(".md"))) {
  const markdown = fs.readFileSync(`../docs/${file}`, "utf8");
  const sections = markdown.split("\n## ").slice(1);

  sections.forEach((section, i) => {
    const [heading, ...lines] = section.split("\n");
    chunks.push({ id: `${file}#${i}`, source: file, heading, text: lines.join("\n").trim() });
  });
}
console.log(`1. chunked ${chunks.length} sections`);

// 2. Two indexes. Both have an embedding model built in: Pinecone turns the "text" field into vectors for us
//    "lumen-policies" understands meaning (dense vectors). "lumen-policies-keywords" matches exact words (sparse vectors)
const pinecone = new Pinecone();
await pinecone.indexes.createForModel({
  name: "lumen-policies",
  cloud: "aws",
  region: "us-east-1",
  embed: { model: "llama-text-embed-v2", fieldMap: { text: "text" } },
  waitUntilReady: true,
  suppressConflicts: true, // already exists: fine
});
await pinecone.indexes.createForModel({
  name: "lumen-policies-keywords",
  cloud: "aws",
  region: "us-east-1",
  embed: { model: "pinecone-sparse-english-v0", fieldMap: { text: "text" } },
  waitUntilReady: true,
  suppressConflicts: true,
});

// 3. Store the same records in both. Simplest way to stay in sync: wipe the old chunks, upload the new ones
for (const name of ["lumen-policies", "lumen-policies-keywords"]) {
  const index = pinecone.index({ name });

  const stats = await index.describeIndexStats();
  if (stats.totalRecordCount) await index.deleteAll();

  // Pinecone accepts at most 96 text records per request
  for (let start = 0; start < chunks.length; start += 96) {
    await index.upsertRecords({
      records: chunks.slice(start, start + 96).map((chunk) => ({
        _id: chunk.id,
        text: `${chunk.heading}\n${chunk.text}`, // Pinecone embeds this field
        source: chunk.source,
        heading: chunk.heading,
      })),
    });
  }
  console.log(`2. stored ${chunks.length} chunks in "${name}"`);
}
