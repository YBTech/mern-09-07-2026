import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 29 — Concepts Reference</title>
      <DayNav day="day29-rag-vector-databases" current="concepts" />
      <h1>Day 29 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>Concepts</h2>

        <details>
          <summary>What is RAG, and what problem does it solve?</summary>
          <div className="answer">
            <p>
              RAG (Retrieval-Augmented Generation) means looking up the relevant passages from your own documents and putting them in the prompt before the model answers. It solves the problem that the model knows nothing about your private or recent data and will confidently guess instead.
            </p>
          </div>
        </details>

        <details>
          <summary>Walk through the full RAG ingestion pipeline.</summary>
          <div className="answer">
            <p>
              Done once, offline: load and parse the documents, split them into chunks, turn each chunk into an embedding, and store the vector together with its text and metadata (source, page) in a vector database. At question time, the question is embedded the same way and the nearest chunks are fetched.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a vector embedding?</summary>
          <div className="answer">
            <p>
              A list of numbers produced by an embedding model that captures the meaning of a piece of text. Texts with similar meaning get vectors that sit close together, even when they share no words (&quot;money back&quot; and &quot;refund&quot;).
            </p>
          </div>
        </details>

        <details>
          <summary>What is a vector?</summary>
          <div className="answer">
            <p>
              Just an ordered list of numbers, like <code>[0.12, -0.8, 0.33, ...]</code>, which you can think of as a point in space. &quot;Close&quot; is measured with a similarity such as cosine similarity, and the same embedding model must be used for documents and questions.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a vector database?</summary>
          <div className="answer">
            <p>
              A database built to store vectors and quickly find the ones nearest to a query vector, usually with metadata filters on top. A normal database matches exact values; a vector database matches by meaning.
            </p>
          </div>
        </details>

        <details>
          <summary>What is chunking, and why does it matter?</summary>
          <div className="answer">
            <p>
              Splitting documents into small passages before embedding them, each of which becomes one searchable unit. Too big and the match gets vague and wastes tokens; too small and the chunk loses its context.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a citation in RAG, and why include it?</summary>
          <div className="answer">
            <p>
              The answer points back to the source chunk it used (file, section, page). It lets users verify the answer, and lets you debug a wrong one by seeing exactly which chunk the model relied on.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between keyword search and vector search, and what is hybrid search?</summary>
          <div className="answer">
            <p>
              Keyword search matches exact words, so it is great for error codes and names but misses synonyms and typos. Vector search matches meaning but can miss exact terms. Hybrid search runs both and merges the results to get the best of each.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the two most popular vector database choices, and how do they differ?</summary>
          <div className="answer">
            <p>
              pgvector adds vector search to the Postgres you already run, so there is no new system, but you operate it yourself. Pinecone is a fully managed cloud service with nothing to run, but it is another vendor and another bill.
            </p>
          </div>
        </details>

        <details>
          <summary>How does an agent use RAG to retrieve data?</summary>
          <div className="answer">
            <p>
              The search is wrapped as a tool (for example <code>search_docs</code>) that the agent can call. The agent decides when a question needs it, picks the query, reads the returned chunks, and can search again if the first result was not enough.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between normal RAG and agentic RAG?</summary>
          <div className="answer">
            <p>
              In normal RAG, the code always retrieves first and feeds the chunks to the model before it responds. In agentic RAG, retrieval is put inside a tool and the agent decides by itself whether and when to call it.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
