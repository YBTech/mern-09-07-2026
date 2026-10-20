import { Embeddings } from "@langchain/core/embeddings";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { pipeline } from "@huggingface/transformers";
import { fileURLToPath } from "node:url";

// The shop's knowledge base for the "answer" node: menu.md, allergens.md, store-faq.md.
// It is built once when the server starts. Production would use a persistent vector database (Day 29).

// Embeddings: the same small local model as Day 29, so no second API key
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "fp32" });
class LocalEmbeddings extends Embeddings {
  constructor() {
    super({});
  }
  async embedDocuments(texts: string[]) {
    const output = await embedder(texts, { pooling: "mean", normalize: true });
    return output.tolist() as number[][];
  }
  async embedQuery(text: string) {
    const [vector] = await this.embedDocuments([text]);
    return vector;
  }
}

const MENU_FOLDER = fileURLToPath(new URL("../../menu", import.meta.url));

// RAG ingestion: load → split → embed → store (done once, before any question arrives)
const docs = await new DirectoryLoader(MENU_FOLDER, { ".md": (path) => new TextLoader(path) }).load();
const chunks = await new RecursiveCharacterTextSplitter({ chunkSize: 400, chunkOverlap: 40 }).splitDocuments(docs);
const store = await MemoryVectorStore.fromDocuments(chunks, new LocalEmbeddings());
console.log(`Knowledge base: ${docs.length} documents, ${chunks.length} chunks`);

// RAG retrieval: "give me the 3 chunks closest to this question"
export const retriever = store.asRetriever({ k: 3 });
