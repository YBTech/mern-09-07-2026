import type { Chunk } from "./chunks";
import { keywordSearch } from "./keyword-search";
import { vectorSearch } from "./vector-search";

// Same hybrid search as 08-hybrid-search.ts
export async function hybridSearch(
  chunks: Chunk[],
  vectorStore: { chunk: Chunk; vector: number[] }[],
  question: string,
): Promise<Chunk[]> {
  const byKeyword = keywordSearch(chunks, question).slice(0, 10);
  const byMeaning = (await vectorSearch(vectorStore, question)).slice(0, 10);

  const scores = new Map<Chunk, number>();
  for (const list of [byKeyword, byMeaning]) {
    list.forEach((chunk, rank) => {
      scores.set(chunk, (scores.get(chunk) ?? 0) + 1 / (60 + rank + 1));
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([chunk]) => chunk);
}
