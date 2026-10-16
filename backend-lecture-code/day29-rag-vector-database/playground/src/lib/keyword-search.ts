import type { Chunk } from "./chunks";

// Same keyword search as 05-keyword-search.ts, but returns every match ranked
const STOP_WORDS = ["the", "and", "can", "for", "with", "what", "does", "how", "are", "you", "your", "get", "this", "that", "have", "will"];

function toWords(text: string) {
  const words = text.toLowerCase().match(/[a-z0-9]+(-[a-z0-9]+)*/g) ?? [];
  return words.filter((word) => word.length > 2 && !STOP_WORDS.includes(word));
}

export function keywordSearch(chunks: Chunk[], question: string): Chunk[] {
  const questionWords = toWords(question);
  const scored = chunks.map((chunk) => {
    const chunkWords = toWords(`${chunk.heading} ${chunk.text}`);
    const score = questionWords.filter((word) => chunkWords.includes(word)).length;
    return { chunk, score };
  });
  return scored
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.chunk);
}
