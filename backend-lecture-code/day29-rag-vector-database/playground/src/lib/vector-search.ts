import type { Chunk } from "./chunks";
import { cosine, embed } from "./embed";

// Same in-memory vector store as 07-vector-search.ts, but returns every chunk ranked
export async function buildVectorStore(chunks: Chunk[]) {
  const vectors = await embed(chunks.map((c) => `${c.heading}\n${c.text}`));
  return chunks.map((chunk, i) => ({ chunk, vector: vectors[i] }));
}

export async function vectorSearch(
  vectorStore: { chunk: Chunk; vector: number[] }[],
  question: string,
): Promise<Chunk[]> {
  const [questionVector] = await embed([question]);
  return vectorStore
    .map((entry) => ({ chunk: entry.chunk, score: cosine(questionVector, entry.vector) }))
    .sort((a, b) => b.score - a.score)
    .map((result) => result.chunk);
}
