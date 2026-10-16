# Day 29: RAG and vector databases

A support bot for Lumen Audio, a made-up headphone store, that learns to read the store's policies.

```
playground/   terminal demos, one file per step (01 → 09), in-memory search
  docs/       16 help documents (about 8,400 words): refunds, terms, shipping, warranty, repair programs, error codes, firmware, SKUs, a quarterly operations review, …
shop-app/     the full-stack shop: a product grid and a help chat
  docs/       the same policy files, the ones the app reads
  ingest/     the pipeline: docs/*.md → chunks → Pinecone (which embeds them)
  backend/    Express: /api/chat runs an agent whose only tool is a hybrid search over two Pinecone indexes
  frontend/   React: products, plus a help chat that shows its sources
```

```bash
npm run install:all
# .env in this folder holds ANTHROPIC_API_KEY and PINECONE_API_KEY
```

In the playground, embeddings come from a small model that runs locally (`Xenova/all-MiniLM-L6-v2`, 384 numbers per text).
It is downloaded once, about 25 MB, and needs no API key. Claude has no embeddings API.
In the shop app, the Pinecone indexes have an embedding model built in, so Pinecone embeds the chunks and the questions
for us, and you can search by text in the Pinecone console:

- `lumen-policies`: `llama-text-embed-v2`, finds chunks by meaning
- `lumen-policies-keywords`: `pinecone-sparse-english-v0`, finds chunks by their words (a learned keyword search)

## Steps

Use the same three questions in steps 5, 7 and 8. Steps 5, 7 and 8 run their test question for you as soon as they start (the constants at the top of the file):

- A: `Can I return headphones I already opened?`
- B (breaks keyword search): `my earbuds came brokn, can i get my money back?`
- C (breaks vector search): `What is INC-2026-Q3-011?`. The ID appears in only 3 of the long sections of `quarterly-operations-review.md` (engineering, support, finance), and the other incidents have unrelated codes (`OPS-5530`, `SUP-8814`, `SEC-4097`). An ID has no meaning, so vector search finds one of the three sections and fills the rest with unrelated chunks, while keyword search finds exactly those 3 sections.

| Step | Run | What happens |
|---|---|---|
| 1 | `npm run rag:01` | No RAG. Ask A: the bot does not know the policy (or makes one up). |
| 2 | `npm run rag:02` | Paste every file into the system prompt. A is answered correctly: 14 days, 12% fee. About 15,000 input tokens per question. |
| 3 | `npm run rag:03` | 200× the docs (3,200 files): about 3M tokens, and the API refuses ("prompt is too long"). |
| 4 | `npm run rag:04` | Ingestion, step 1: cut the files into 176 chunks, one per `##` section. |
| 5 | `npm run rag:05` | Keyword search, top 3 chunks into the prompt. Runs B first: finds nothing, no shared words. A works, with some noise (an unrelated loyalty chunk ranks first). C works: the code is an exact word. |
| 6 | `npm run rag:06` | Embeddings: a sentence becomes 384 numbers; "refund" vs "money back" scores high. |
| 7 | `npm run rag:07` | In-memory vector store. Runs C first: it finds the finance section but misses the engineering and support ones (the rest is unrelated chunks), so the bot only knows the cost. B works now. |
| 8 | `npm run rag:08` | Hybrid: keyword + vector, merged, best 5 kept. Runs B, then C: both work, and C now gets all 3 sections (the full story of the incident). |
| 9 | `npm run rag:09` | RAG as a tool: the agent decides when to search. "hi" searches nothing. |

## The full-stack app

| Step | Run | What happens |
|---|---|---|
| 1 | `npm run ingest` | Chunks the docs and stores them in both Pinecone indexes (it creates them if they are missing). |
| 2 | `npm run app` | Shop on http://localhost:5173, API on :3002. Open 💬 Help and ask A, B or C. Each source shows which search found it and its rank, such as `meaning #1 + keyword #4`. |
| 3 | edit `shop-app/docs/refund-policy.md`, then `npm run ingest` | Change "14 days" to "21 days": the bot now answers 21. |

The app does hybrid search: it asks both indexes for their top 10, merges the two lists as in step 8, and keeps the best 5.
Each source shows which search found it and at what rank. Ask `What is INC-2026-Q3-011?`: the keyword index ranks the 3 real sections #1 to #3.
Pinecone's meaning model is strong and also finds them (ranks 1, 2 and 4, with unrelated chunks in between), so the failure is much clearer
in the playground (steps 5 and 7), where the small local model finds none.
