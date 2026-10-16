import { Pinecone } from "@pinecone-database/pinecone";

// Two Pinecone indexes hold the same chunks (see ingest/ingest.ts)
const pinecone = new Pinecone();
const meaningIndex = pinecone.index({ name: "lumen-policies" }); // understands meaning
const keywordIndex = pinecone.index({ name: "lumen-policies-keywords" }); // matches exact words

type Chunk = { id: string; source: string; heading: string; text: string };

async function search(index: typeof meaningIndex, query: string): Promise<Chunk[]> {
  const result = await index.searchRecords({
    query: { topK: 10, inputs: { text: query } },
    fields: ["source", "heading", "text"],
  });
  return result.result.hits.map((hit) => {
    const fields = hit.fields as { source: string; heading: string; text: string };
    return { id: hit._id, source: fields.source, heading: fields.heading, text: fields.text };
  });
}

// Hybrid search: run both searches, then merge the two ranked lists
// Reciprocal rank fusion: rank 1 is worth 1/61, rank 2 is 1/62, … and a chunk found by both adds up
export async function searchPolicies(query: string) {
  const [byMeaning, byKeyword] = await Promise.all([search(meaningIndex, query), search(keywordIndex, query)]);

  const scores = new Map<string, { chunk: Chunk; score: number; foundBy: string[] }>();
  for (const [name, list] of [["meaning", byMeaning], ["keyword", byKeyword]] as const) {
    list.forEach((chunk, rank) => {
      const entry = scores.get(chunk.id) ?? { chunk, score: 0, foundBy: [] };
      entry.score += 1 / (60 + rank + 1);
      entry.foundBy.push(`${name} #${rank + 1}`);
      scores.set(chunk.id, entry);
    });
  }

  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => ({ ...entry.chunk, foundBy: entry.foundBy }));
}
