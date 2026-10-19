import { pipeline } from "@huggingface/transformers";
import { bold, dim, green, red, title } from "./lib/log";

// A small embedding model that runs on your laptop (downloaded once, about 25 MB)
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

async function embed(texts: string[]): Promise<number[][]> {
  const output = await embedder(texts, { pooling: "mean", normalize: true });
  return output.tolist();
}

// How similar are two vectors? 1 = same direction, 0 = unrelated
function cosine(a: number[], b: number[]) {
  let dot = 0, lengthA = 0, lengthB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    lengthA += a[i] * a[i];
    lengthB += b[i] * b[i];
  }
  return dot / (Math.sqrt(lengthA) * Math.sqrt(lengthB));
}

const sentences = [
  "How do I get a refund?",
  "I want my money back",
  "Best pizza in town",
];
const vectors = await embed(sentences);

title("A sentence becomes a vector");
console.log(`  "${sentences[0]}"`);
console.log(`  → ${vectors[0].length} numbers: [${vectors[0].slice(0, 5).map((n) => n.toFixed(3)).join(", ")}, …]`);

title(`Compared with "${sentences[0]}"`);
for (let i = 1; i < sentences.length; i++) {
  const score = cosine(vectors[0], vectors[i]);
  const color = score > 0.3 ? green : red;
  console.log(`  ${color(score.toFixed(2))}  ${sentences[i]}`);
}
console.log(dim(`\n  ${bold("No shared words")} with "money back", yet it scores high: the meaning is close.`));
