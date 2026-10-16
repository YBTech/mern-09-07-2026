import { pipeline } from "@huggingface/transformers";

// Same embedding model and cosine as 06-embeddings.ts
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

export async function embed(texts: string[]): Promise<number[][]> {
  const output = await embedder(texts, { pooling: "mean", normalize: true });
  return output.tolist();
}

export function cosine(a: number[], b: number[]) {
  let dot = 0, lengthA = 0, lengthB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    lengthA += a[i] * a[i];
    lengthB += b[i] * b[i];
  }
  return dot / (Math.sqrt(lengthA) * Math.sqrt(lengthB));
}
