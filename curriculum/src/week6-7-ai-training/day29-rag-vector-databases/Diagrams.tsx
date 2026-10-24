// Diagrams for Notes.tsx (RAG & Vector Databases). One component per picture; arrowheads come from the
// <ArrowDefs /> in Notes.tsx.
import type { ReactElement, ReactNode } from "react";
import { Arrow, Box, T } from "../../components/Diagram";

function Card({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#fff" stroke="#d6dbe6" />
      {children}
    </g>
  );
}

export function RagPipeline() {
  const ingest = ["Documents", "Chunk", "Embed", "Vector DB"];
  const answer = ["Question", "Embed", "Search", "Prompt + chunks", "LLM"];
  return (
    <svg viewBox="0 0 680 310" role="img" aria-label="RAG has two lanes: an offline ingestion lane that chunks, embeds and stores documents, and a per-question lane that embeds the question, searches, builds a prompt with the chunks, and asks the model for a cited answer. Chunking and the embedding model decide what gets found.">
      <T x={14} y={18} anchor="start" size={10} color="#8e5fd6" bold>INGEST · offline, once per document change</T>
      {ingest.map((l, i) => (
        <g key={l}>
          <Box x={14 + i * 172} y={28} w={130} h={46} label={l} kind={i === 3 ? "broker" : "service"} size={11} />
          {i < 3 && <Arrow d={`M${146 + i * 172},51 L${184 + i * 172},51`} />}
        </g>
      ))}
      <T x={14} y={162} anchor="start" size={10} color="#8e5fd6" bold>ANSWER · every question</T>
      {answer.map((l, i) => (
        <g key={l}>
          <Box x={14 + i * 134} y={172} w={112} h={46} label={l} kind={l === "LLM" ? "primary" : "service"} size={10.5} />
          {i < 4 && <Arrow d={`M${128 + i * 134},195 L${146 + i * 134},195`} />}
        </g>
      ))}
      <Arrow d="M591,76 L591,124 L338,124 L338,170" ink="purple" dashed />
      <T x={465} y={118} color="#6a3fb5">nearest chunks by vector similarity</T>
      <Arrow d="M606,220 L606,240" ink="green" />
      <T x={606} y={256} size={10} color="#2e7d32">answer + citations</T>
      <Box x={14} y={250} w={170} h={40} label="Chunking" sub="size · overlap · structure" kind="warn" size={10.5} />
      <Box x={198} y={250} w={170} h={40} label="Embedding model" sub="must match at both ends" kind="warn" size={10.5} />
    </svg>
  );
}

export function EmbeddingSpace() {
  const dot = (x: number, y: number, fill: string) => <circle cx={x} cy={y} r={5} fill={fill} />;
  return (
    <svg viewBox="0 0 680 296" role="img" aria-label="An embedding model turns text into a vector of hundreds or thousands of numbers; texts with similar meaning land close together, so a question lands near the chunks that answer it. Documents and queries must use the same embedding model.">
      <rect x={10} y={10} width={330} height={276} rx={10} fill="#fafbfd" stroke="#d6dbe6" />
      <T x={24} y={32} anchor="start" size={11} color="#1c1c1c" bold>Meaning becomes position</T>
      <ellipse cx={100} cy={112} rx={86} ry={56} fill="#7ea6e0" fillOpacity={0.1} stroke="#7ea6e0" strokeDasharray="4,3" />
      {dot(70, 80, "#7ea6e0")}
      <T x={78} y={84} anchor="start" size={9}>refund policy</T>
      {dot(135, 100, "#7ea6e0")}
      <T x={143} y={104} anchor="start" size={9}>return an item</T>
      {dot(55, 112, "#7ea6e0")}
      <T x={63} y={116} anchor="start" size={9}>money back</T>
      {dot(230, 62, "#7dbb7d")}
      <T x={238} y={66} anchor="start" size={9}>delivery time</T>
      {dot(250, 100, "#7dbb7d")}
      <T x={258} y={104} anchor="start" size={9}>track a parcel</T>
      {dot(220, 215, "#bbbbbb")}
      <T x={228} y={219} anchor="start" size={9}>pasta recipe</T>
      {dot(260, 244, "#bbbbbb")}
      <T x={252} y={262} anchor="end" size={9}>banana bread</T>
      <polygon points="105,140 113,150 105,160 97,150" fill="#e8a060" />
      <T x={105} y={178} size={9.5} color="#c0702a" bold>the question</T>
      <Arrow d="M109,143 L131,108" ink="orange" dashed />

      <Box x={360} y={20} w={310} h={46} label="Text" sub="a chunk, or the user's question" kind="muted" size={12} />
      <Arrow d="M515,68 L515,92" />
      <Box x={360} y={94} w={310} h={46} label="Embedding model" sub="turns any text into a vector" kind="primary" size={12} />
      <Arrow d="M515,142 L515,166" />
      <Box x={360} y={168} w={310} h={46} label="Vector" sub="[0.12, -0.80, 0.33, ...]  a list of numbers" kind="broker" size={12} />
      <T x={515} y={248} size={10.5} color="#1c1c1c" bold>Close in meaning = close in space</T>
    </svg>
  );
}

export function ChunkingStrategies() {
  const cards = [
    { x: 10, y: 10, title: "Fixed size + overlap", l1: "split every N tokens, repeat a little", l2: "simple baseline; can cut a sentence in half" },
    { x: 345, y: 10, title: "Structure-aware", l1: "split on headings, paragraphs, code blocks", l2: "keeps meaning together; the best default for docs" },
    { x: 10, y: 140, title: "Semantic", l1: "split where the topic changes", l2: "better chunks, extra cost at ingestion" },
    { x: 345, y: 140, title: "Parent–child (small-to-big)", l1: "search small chunks, send the bigger parent", l2: "precise match, full context for the model" },
  ];
  const fixed = [0, 1, 2, 3, 4].map((i) => (
    <rect key={i} x={14 + i * 52} y={46} width={62} height={22} rx={3} fill={i % 2 ? "#dbe6fb" : "#fde9b8"} fillOpacity={0.85} stroke="#8aa0c0" />
  ));
  const structure: [number, number, string][] = [[14, 44, "# H1"], [61, 90, "## Section"], [154, 56, "code"], [213, 80, "## Section"]];
  const semantic: [number, number, string][] = [[14, 70, "topic A"], [87, 40, "B"], [130, 100, "topic C"], [233, 60, "D"]];
  const semFill = ["#dbe6fb", "#d3ecd3", "#fde9b8", "#e6dcf6"];
  return (
    <svg viewBox="0 0 680 330" role="img" aria-label="Four ways to chunk a document: fixed size with overlap, structure-aware, semantic, and parent-child where small chunks are searched but the larger parent is sent to the model. Chunks that are too small lose context; chunks that are too big dilute the match.">
      {cards.map((c) => (
        <Card key={c.title} x={c.x} y={c.y} w={325} h={120}>
          <T x={c.x + 14} y={c.y + 24} anchor="start" size={12} color="#1c1c1c" bold>{c.title}</T>
          <T x={c.x + 14} y={c.y + 92} anchor="start" size={9.5} color="#1c1c1c">{c.l1}</T>
          <T x={c.x + 14} y={c.y + 108} anchor="start" size={9.5} color="#2e7d32">{c.l2}</T>
        </Card>
      ))}
      <g transform="translate(10,10)">{fixed}</g>
      <g transform="translate(345,10)">
        {structure.map(([x, w, l]) => (
          <g key={x}>
            <rect x={x} y={44} width={w} height={24} rx={3} fill="#eef8ee" stroke="#7dbb7d" />
            <T x={x + w / 2} y={60} size={9} color="#1c1c1c">{l}</T>
          </g>
        ))}
      </g>
      <g transform="translate(10,140)">
        {semantic.map(([x, w, l], i) => (
          <g key={x}>
            <rect x={x} y={44} width={w} height={24} rx={3} fill={semFill[i]} stroke="#8aa0c0" />
            <T x={x + w / 2} y={60} size={9} color="#1c1c1c">{l}</T>
          </g>
        ))}
      </g>
      <g transform="translate(345,140)">
        <rect x={14} y={44} width={190} height={34} rx={4} fill="#f3eefc" stroke="#8e5fd6" />
        <T x={14} y={40} anchor="start" size={8.5} color="#6a3fb5">parent</T>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={20 + i * 44} y={50} width={38} height={22} rx={3} fill={i === 1 ? "#fff7e0" : "#fff"} stroke={i === 1 ? "#e8b400" : "#bbb"} strokeWidth={i === 1 ? 2 : 1} />
        ))}
        <T x={79} y={65} size={8.5} color="#1c1c1c">match</T>
        <Arrow d="M210,61 L250,61" ink="purple" />
        <T x={282} y={65} size={9} color="#6a3fb5" bold>send parent</T>
      </g>
      <Box x={10} y={274} w={660} h={46} label="Too small: the chunk loses its context.  Too big: the match is diluted and tokens are wasted." sub="Start near 300 to 800 tokens with 10 to 20 percent overlap, then tune against your evals." kind="warn" size={11} />
    </svg>
  );
}

export function VectorIndexes() {
  const flat: ReactElement[] = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) flat.push(<circle key={`${i}-${j}`} cx={30 + i * 30} cy={52 + j * 20} r={3.5} fill="#e8a060" />);
  const bottom = [30, 65, 100, 135, 170];
  return (
    <svg viewBox="0 0 680 320" role="img" aria-label="Three ways to search vectors: a flat index compares against every vector, exact but slow; HNSW hops through a layered graph toward the nearest neighbour, fast and accurate but memory-hungry; IVF clusters the vectors and searches only the nearest clusters. Approximate search trades a little recall for big speed, and quantization shrinks the vectors.">
      <Card x={10} y={10} w={210} h={200}>
        <T x={24} y={32} anchor="start" size={12} color="#1c1c1c" bold>Flat (exact)</T>
        <g transform="translate(10,10)">{flat}</g>
        <T x={24} y={168} anchor="start" size={9.5} color="#1c1c1c">compare against every vector</T>
        <T x={24} y={184} anchor="start" size={9.5} color="#2e7d32">perfect recall · slow at millions</T>
      </Card>
      <Card x={235} y={10} w={210} h={200}>
        <T x={249} y={32} anchor="start" size={12} color="#1c1c1c" bold>HNSW (graph)</T>
        <g transform="translate(235,10)">
          <T x={6} y={64} anchor="start" size={8} color="#8e5fd6">top</T>
          <T x={6} y={114} anchor="start" size={8} color="#8e5fd6">base</T>
          {[30, 100, 170].map((x) => <circle key={x} cx={x + 14} cy={60} r={4} fill="#bbb" />)}
          {bottom.map((x) => <circle key={x} cx={x + 14} cy={110} r={4} fill="#bbb" />)}
          <circle cx={44} cy={60} r={5} fill="#e8b400" />
          <circle cx={149} cy={110} r={6} fill="#3d8b40" />
          <Arrow d="M50,60 L108,60" ink="orange" />
          <Arrow d="M114,64 L114,106" ink="orange" />
          <Arrow d="M120,110 L142,110" ink="orange" />
          <T x={44} y={50} size={8}>entry</T>
          <T x={149} y={132} size={8} color="#2e7d32">nearest</T>
        </g>
        <T x={249} y={168} anchor="start" size={9.5} color="#1c1c1c">hop through layers toward the target</T>
        <T x={249} y={184} anchor="start" size={9.5} color="#2e7d32">fast + accurate · uses a lot of RAM</T>
      </Card>
      <Card x={460} y={10} w={210} h={200}>
        <T x={474} y={32} anchor="start" size={12} color="#1c1c1c" bold>IVF (clusters)</T>
        <g transform="translate(460,10)">
          <circle cx={55} cy={66} r={24} fill="#f5f5f5" stroke="#bbb" />
          <circle cx={145} cy={76} r={24} fill="#fff7e0" stroke="#e8b400" strokeWidth={2} />
          <circle cx={98} cy={116} r={20} fill="#f5f5f5" stroke="#bbb" />
          {[[47, 60], [62, 72], [54, 66], [137, 70], [153, 84], [146, 62], [92, 112], [104, 122]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill="#7ea6e0" />
          ))}
          <polygon points="146,74 152,80 146,86 140,80" fill="#e8a060" />
        </g>
        <T x={474} y={168} anchor="start" size={9.5} color="#1c1c1c">search only the nearest few clusters</T>
        <T x={474} y={184} anchor="start" size={9.5} color="#2e7d32">less memory · needs tuning (nprobe)</T>
      </Card>
      <Box x={10} y={222} w={325} h={46} label="ANN = approximate nearest neighbour" sub="give up a little recall for a huge speedup; measure recall@k" kind="service" size={11} />
      <Box x={345} y={222} w={325} h={46} label="Quantization (int8 · binary · product)" sub="store vectors 4 to 32 times smaller for a small recall loss" kind="service" size={11} />
      <T x={340} y={298} size={11} color="#1c1c1c" bold>Most apps are well served by an HNSW index: start there.</T>
    </svg>
  );
}

export function VectorRecord() {
  const steps: [string, string, "service" | "fail" | "ok"][] = [
    ["1  Embed the question", "same model that embedded the chunks", "service"],
    ["2  Filter by metadata", "tenant = acme AND acl matches the user", "fail"],
    ["3  Nearest top-k in what is left", "ANN search over the allowed rows", "service"],
    ["4  Return text + score + source", "so the answer can cite its chunk", "ok"],
  ];
  const fields: [string, string, string][] = [
    ["id", "chunk_8f2", "#bbbbbb"],
    ["embedding", "[0.12, -0.80, 0.33, ...]", "#8e5fd6"],
    ["text", "Refunds are accepted within 30 days...", "#7ea6e0"],
    ["metadata", "tenant: acme · acl: support", "#e8a060"],
    ["metadata", "source: policy.pdf · page 4 · 2026-03", "#e8a060"],
  ];
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="One row in a vector store holds an id, the embedding, the original text, and metadata such as tenant and access control. A query embeds the question, filters by metadata, runs nearest-neighbour search on the allowed rows, and returns text, score and source. Filter before you rank so one tenant's chunk can never leak into another's prompt.">
      <Card x={10} y={10} w={310} h={190}>
        <T x={24} y={32} anchor="start" size={11} color="#1c1c1c" bold>One row in a vector store</T>
        {fields.map(([k, v, c], i) => (
          <g key={`${k}${i}`}>
            <rect x={24} y={44 + i * 29} width={282} height={24} rx={4} fill="#fff" stroke={c} strokeWidth="1.3" />
            <T x={32} y={60 + i * 29} anchor="start" size={9.5} color="#1c1c1c" bold>{k}</T>
            <T x={96} y={60 + i * 29} anchor="start" size={9.5}>{v}</T>
          </g>
        ))}
      </Card>
      {steps.map(([l, s, k], i) => (
        <g key={l}>
          <Box x={350} y={10 + i * 50} w={320} h={40} label={l} sub={s} kind={k} size={11} />
          {i < 3 && <Arrow d={`M510,${50 + i * 50} L510,${60 + i * 50}`} />}
        </g>
      ))}
      <T x={165} y={222} size={10} color="#1c1c1c">keep the original text and source in the row,</T>
      <T x={165} y={236} size={10} color="#1c1c1c">so you can show it and cite it</T>
      <T x={510} y={226} size={10.5} color="#c0392b" bold>Filter before you rank, or another tenant's</T>
      <T x={510} y={241} size={10.5} color="#c0392b" bold>chunk can land in this user's prompt.</T>
    </svg>
  );
}

export function VectorDbChoices() {
  const cols = [
    { x: 10, title: "Extend the database you have", items: ["pgvector (Postgres)", "MongoDB Atlas Vector Search", "Elasticsearch / OpenSearch", "Redis"], foot: "no new system to run: start here" },
    { x: 235, title: "Purpose-built vector engines", items: ["Pinecone (managed)", "Qdrant", "Weaviate", "Milvus"], foot: "scale, filtering, hybrid search built in" },
    { x: 460, title: "Local / in-process", items: ["Chroma", "LanceDB", "FAISS (a library)", "sqlite-vec"], foot: "prototypes, notebooks, tests" },
  ];
  const ask: [string, string][] = [
    ["How many vectors?", "millions vs billions"],
    ["Filters + hybrid?", "metadata, keywords"],
    ["Who runs it?", "managed vs self-hosted"],
    ["Already in your stack?", "reuse Postgres or Mongo"],
  ];
  return (
    <svg viewBox="0 0 680 290" role="img" aria-label="Three families of vector storage: extend a database you already run, such as pgvector or MongoDB Atlas; purpose-built engines such as Pinecone, Qdrant, Weaviate and Milvus; and local in-process options such as Chroma and FAISS. Choose by scale, filtering and hybrid needs, who runs it, and what is already in your stack.">
      {cols.map((c) => (
        <Card key={c.title} x={c.x} y={10} w={210} h={190}>
          <T x={c.x + 14} y={30} anchor="start" size={11} color="#1c1c1c" bold>{c.title}</T>
          {c.items.map((it, i) => (
            <g key={it}>
              <rect x={c.x + 14} y={42 + i * 29} width={182} height={23} rx={4} fill="#eef3ff" stroke="#7ea6e0" />
              <T x={c.x + 105} y={57 + i * 29} size={10} color="#1c1c1c">{it}</T>
            </g>
          ))}
          <T x={c.x + 14} y={174} anchor="start" size={9.5} color="#2e7d32">{c.foot}</T>
        </Card>
      ))}
      <T x={14} y={224} anchor="start" size={11} color="#1c1c1c" bold>Choose by</T>
      {ask.map(([l, s], i) => (
        <Box key={l} x={10 + i * 167} y={234} w={157} h={44} label={l} sub={s} kind="primary" size={10.5} />
      ))}
    </svg>
  );
}

export function HybridRetrieval() {
  return (
    <svg viewBox="0 0 680 304" role="img" aria-label="Better retrieval: rewrite the query, run a vector search and a keyword search in parallel, merge the two ranked lists with reciprocal rank fusion, then rerank the top fifty with a cross-encoder down to five. Vectors alone miss exact terms; keywords alone miss paraphrases.">
      <Box x={10} y={108} w={84} h={46} label="Query" sub="user question" kind="muted" size={11} />
      <Box x={122} y={108} w={96} h={46} label="Rewrite" sub="multi-query · HyDE" size={11} />
      <Box x={262} y={40} w={142} h={46} label="Vector search" sub="finds meaning" kind="broker" size={11} />
      <Box x={262} y={176} w={142} h={46} label="Keyword search" sub="BM25: exact terms, IDs" kind="broker" size={10.5} />
      <Box x={440} y={108} w={100} h={46} label="Fuse" sub="RRF merge" size={11} />
      <Box x={568} y={108} w={100} h={46} label="Rerank" sub="50 → 5" kind="primary" size={11} />
      <Box x={540} y={196} w={128} h={40} label="Top 5 chunks" sub="into the prompt" kind="ok" size={11} />
      <Arrow d="M96,131 L120,131" />
      <Arrow d="M220,122 L260,74" />
      <Arrow d="M220,140 L260,190" />
      <Arrow d="M406,74 L438,118" />
      <Arrow d="M406,190 L438,144" />
      <Arrow d="M542,131 L566,131" />
      <Arrow d="M618,156 L618,194" />
      <T x={338} y={30} size={9.5} color="#1c1c1c">top 50 by meaning</T>
      <T x={338} y={242} size={9.5} color="#1c1c1c">top 50 by words</T>
      <Box x={10} y={256} w={212} h={40} label="Vectors alone miss exact terms" sub="error codes, SKUs, names" kind="warn" size={10} />
      <Box x={234} y={256} w={212} h={40} label="Keywords alone miss paraphrases" sub="'refund' vs 'money back'" kind="warn" size={10} />
      <Box x={458} y={256} w={212} h={40} label="Reranker reads query + chunk together" sub="slower, so run it on 50, not 5000" kind="ok" size={10} />
    </svg>
  );
}

export function RagDiagnosis() {
  const qs: [string, string, string, string, string, string][] = [
    ["In the corpus?", "is the answer in your docs?", "Data gap", "add or fix the document", "coverage audit", "134"],
    ["Retrieved?", "was the right chunk found?", "Retrieval bug", "chunking · hybrid · rerank", "recall@k · MRR", "312"],
    ["Used faithfully?", "did it stick to the chunks?", "Generation bug", "prompt · citations · model", "faithfulness", "490"],
  ];
  const variants: [string, string, string][] = [
    ["Contextual retrieval", "prepend a one-line document context", "to each chunk before embedding"],
    ["Agentic RAG", "the model decides what to search,", "and searches again if it came up short"],
    ["GraphRAG", "extract entities and their links;", "good for multi-hop questions"],
  ];
  return (
    <svg viewBox="0 0 680 310" role="img" aria-label="Diagnosing a bad RAG answer: first ask whether the answer is in the corpus, then whether the right chunk was retrieved, then whether the model stuck to the chunks; each failure points to a different fix and a different metric. Advanced variants are contextual retrieval, agentic RAG and GraphRAG.">
      <Box x={10} y={20} w={96} h={42} label="Bad answer" kind="fail" size={11} />
      <Arrow d="M108,41 L132,41" />
      {qs.map(([q, qsub, bug, fix, metric, x], i) => {
        const bx = Number(x);
        return (
          <g key={q}>
            <Box x={bx} y={20} w={150} h={42} label={q} sub={qsub} kind="primary" size={11} />
            {i < 2 && <Arrow d={`M${bx + 152},41 L${bx + 176},41`} />}
            {i < 2 && <T x={bx + 164} y={34} size={8.5} color="#2e7d32">yes</T>}
            <Arrow d={`M${bx + 75},64 L${bx + 75},100`} />
            <T x={bx + 83} y={86} anchor="start" size={8.5} color="#c0392b">no</T>
            <Box x={bx} y={102} w={150} h={46} label={bug} sub={fix} kind="warn" size={11} />
            <T x={bx + 75} y={166} size={9} color="#6a3fb5">metric: {metric}</T>
          </g>
        );
      })}
      <T x={14} y={206} anchor="start" size={11} color="#1c1c1c" bold>When basic RAG is not enough</T>
      {variants.map(([t, a, b], i) => (
        <Card key={t} x={10 + i * 225} y={216} w={210} h={80}>
          <T x={24 + i * 225} y={240} anchor="start" size={11.5} color="#1c1c1c" bold>{t}</T>
          <T x={24 + i * 225} y={260} anchor="start" size={9.5}>{a}</T>
          <T x={24 + i * 225} y={276} anchor="start" size={9.5}>{b}</T>
        </Card>
      ))}
    </svg>
  );
}

export function IngestionPipeline() {
  const branches: [string, string][] = [
    ["Digital file", "text layer + layout: extract directly"],
    ["Scanned page", "no text layer: OCR or a vision model"],
    ["Tables + charts", "table parser to markdown, or caption"],
  ];
  return (
    <svg viewBox="0 0 680 304" role="img" aria-label="A document ingestion pipeline: detect the file type, then extract text directly from digital files, run OCR or a vision model on scans, and parse tables separately; then clean headers and footers, add structure and metadata, chunk, embed and index.">
      <Box x={10} y={96} w={76} h={46} label="Files" sub="PDF · docx · html" kind="muted" size={11} />
      <Box x={112} y={96} w={84} h={46} label="Detect" sub="type + quality" size={11} />
      {branches.map(([t, s], i) => (
        <g key={t}>
          <Box x={236} y={20 + i * 76} w={200} h={46} label={t} sub={s} kind={i === 1 ? "warn" : "service"} size={10.5} />
          <Arrow d={`M198,119 L234,${43 + i * 76}`} />
          <Arrow d={`M438,${43 + i * 76} L474,119`} />
        </g>
      ))}
      <Box x={476} y={96} w={90} h={46} label="Clean" sub="headers · dupes" size={11} />
      <Box x={592} y={96} w={78} h={46} label="Index" sub="chunk · embed" kind="broker" size={11} />
      <Arrow d="M568,119 L590,119" />
      <Box x={10} y={236} w={325} h={56} label="Keep: source, page, section, date, access groups" sub="every chunk should be citable and permission-checked" kind="ok" size={10.5} />
      <Box x={345} y={236} w={325} h={56} label="Tables stay tables" sub="markdown or JSON rows, never flattened into word soup" kind="ok" size={10.5} />
    </svg>
  );
}

export function IngestionFailures() {
  const rows: [string, string][] = [
    ["A two-column PDF is read straight across", "layout-aware parser; check reading order"],
    ["A table becomes a word soup", "extract tables separately as markdown"],
    ["A scanned page yields empty text", "detect an empty text layer, then OCR"],
    ["Header and footer repeat in every chunk", "strip repeated lines before chunking"],
    ["An edited document leaves stale chunks", "hash per document; delete old, add new"],
  ];
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="Five common ingestion failures with fixes: columns read in the wrong order, tables flattened, scanned pages with no text, repeated headers and footers, and stale chunks after a document changes.">
      <T x={10} y={16} anchor="start" size={11} color="#c0702a" bold>What breaks</T>
      <T x={350} y={16} anchor="start" size={11} color="#2e7d32" bold>The fix</T>
      {rows.map(([bad, fix], i) => {
        const y = 26 + i * 44;
        return (
          <g key={bad}>
            <Box x={10} y={y} w={300} h={34} label={bad} kind="warn" size={10} />
            <Arrow d={`M312,${y + 17} L346,${y + 17}`} />
            <Box x={348} y={y} w={322} h={34} label={fix} kind="ok" size={10} />
          </g>
        );
      })}
    </svg>
  );
}

export function IncrementalIndex() {
  const outs: [string, string, "ok" | "warn" | "fail"][] = [
    ["New document", "embed + insert chunks", "ok"],
    ["Changed (hash differs)", "delete old chunks, insert new", "warn"],
    ["Gone from the source", "delete its chunks", "fail"],
  ];
  return (
    <svg viewBox="0 0 680 196" role="img" aria-label="Incremental indexing: a nightly scan or a change event compares each document's content hash to the stored one, then inserts new documents, replaces changed ones, and deletes chunks for documents removed from the source; permission changes are synced too.">
      <Box x={10} y={64} w={150} h={52} label="Change event or scan" sub="webhook · nightly job" kind="muted" size={11} />
      <Box x={200} y={64} w={150} h={52} label="Compare hashes" sub="stored vs current" kind="primary" size={11} />
      <Arrow d="M162,90 L198,90" />
      {outs.map(([t, s, k], i) => (
        <g key={t}>
          <Box x={410} y={10 + i * 58} w={260} h={46} label={t} sub={s} kind={k} size={10.5} />
          <Arrow d={`M352,90 L408,${33 + i * 58}`} />
        </g>
      ))}
      <Box x={10} y={146} w={340} h={36} label="Permissions change too: re-sync access groups, not only text" kind="service" size={10} />
    </svg>
  );
}

// ───────────────────────── notes redesign: follows the lecture steps ─────────────────────────

export function NoContext() {
  return (
    <svg viewBox="0 0 680 206" role="img" aria-label="Without your documents in the prompt, a model asked about a store's return policy can only invent a confident answer or say it does not know.">
      <Box x={10} y={40} w={160} h={50} label="Question" sub="return opened headphones?" kind="service" size={12} />
      <Arrow d="M172,65 L218,65" />
      <Box x={220} y={40} w={170} h={50} label="LLM" sub="has never seen your policies" kind="primary" size={12} />
      <Arrow d="M392,56 L450,36" ink="red" />
      <Arrow d="M392,74 L450,94" ink="orange" />
      <Box x={452} y={14} w={216} h={44} label="A confident guess" sub="invents a return policy" kind="fail" size={11.5} />
      <Box x={452} y={72} w={216} h={44} label={'"I don\'t know"'} sub="honest, but no help" kind="warn" size={11.5} />
      <Box x={220} y={116} w={170} h={40} label="Your policy files" sub="not in the prompt" kind="muted" dashed size={11} />
      <T x={340} y={188} size={11} color="#1c1c1c" bold>Without your documents, the model can only guess or give up.</T>
    </svg>
  );
}

export function TokenWall() {
  return (
    <svg viewBox="0 0 680 218" role="img" aria-label="Pasting 16 documents into the prompt is about 15,000 tokens and works, though every question pays for all of it. Pasting 200 times as many documents is about 3,000,000 tokens, which is over the 1,000,000 token limit, so the API rejects the request.">
      <Box x={10} y={14} w={130} h={46} label="16 files" sub="the whole help center" kind="service" size={12} />
      <Arrow d="M142,37 L168,37" />
      <Box x={170} y={14} w={200} h={46} label="One prompt" sub="about 15,000 tokens" kind="ok" size={12} />
      <Arrow d="M372,37 L398,37" />
      <Box x={400} y={14} w={270} h={46} label="Works" sub="but every question pays for all of it" kind="warn" size={12} />

      <Box x={10} y={84} w={130} h={46} label="3,200 files" sub="200 times more" kind="service" size={12} />
      <Arrow d="M142,107 L168,107" />
      <Box x={170} y={84} w={200} h={46} label="One prompt" sub="about 3,000,000 tokens" kind="fail" size={12} />
      <Arrow d="M372,107 L398,107" ink="red" />
      <Box x={400} y={84} w={270} h={46} label="API error" sub="prompt is too long (limit 1,000,000)" kind="fail" size={12} />

      <T x={340} y={170} size={11} color="#1c1c1c" bold>Pasting everything does not scale.</T>
      <T x={340} y={188} size={10.5}>Send only the parts that answer the question.</T>
    </svg>
  );
}

export function RetrieveThenAnswer() {
  const steps: [string, string, "service" | "primary" | "broker" | "ok"][] = [
    ["Question", "from the user", "service"],
    ["Search", "find relevant chunks", "primary"],
    ["Top 3 chunks", "only what matters", "broker"],
    ["Prompt", "chunks + question", "service"],
    ["LLM", "answers from them", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 190" role="img" aria-label="Retrieval-augmented generation: search all the chunks for the few that match the question, put only those chunks in the prompt with the question, and let the model answer from them.">
      {steps.map(([l, s, k], i) => (
        <g key={l}>
          <Box x={10 + i * 134} y={30} w={112} h={50} label={l} sub={s} kind={k} size={11.5} />
          {i < 4 && <Arrow d={`M${124 + i * 134},55 L${142 + i * 134},55`} />}
        </g>
      ))}
      <Box x={144} y={112} w={112} h={40} label="All chunks" sub="the whole library" kind="muted" dashed size={11} />
      <Arrow d="M200,110 L200,82" />
      <T x={500} y={132} size={11} color="#1c1c1c" bold>RAG = Retrieval-Augmented Generation</T>
      <T x={500} y={150} size={10.5}>retrieve first, then generate</T>
    </svg>
  );
}

export function DocToChunks() {
  const chunks: [string, string][] = [
    ["Return window", "Unopened items… within 30 days…"],
    ["Opened items", "Opened items… within 14 days…"],
    ["Damaged or defective", "If an item arrives broken…"],
  ];
  return (
    <svg viewBox="0 0 680 218" role="img" aria-label="A markdown file is cut at each second-level heading into chunks. Each chunk is an object holding the source file, the heading, and the text.">
      <Card x={10} y={10} w={210} h={170}>
        <T x={24} y={34} anchor="start" size={10.5} color="#1c1c1c" bold>refund-policy.md</T>
        <T x={24} y={58} anchor="start" size={10} color="#6b7a90"># Refund Policy</T>
        <T x={24} y={84} anchor="start" size={10} color="#c0702a" bold>## Return window</T>
        <T x={24} y={100} anchor="start" size={9.5}>Unopened items …</T>
        <T x={24} y={124} anchor="start" size={10} color="#c0702a" bold>## Opened items</T>
        <T x={24} y={140} anchor="start" size={9.5}>Opened headphones …</T>
        <T x={24} y={160} anchor="start" size={10} color="#c0702a" bold>## Damaged or defective</T>
      </Card>
      <T x={262} y={150} size={10} color="#c0702a" bold>split on ##</T>
      {chunks.map(([h, t], i) => (
        <g key={h}>
          <Arrow d={`M222,${95} L318,${40 + i * 56}`} ink="orange" />
          <Card x={320} y={14 + i * 56} w={350} h={50}>
            <T x={334} y={32 + i * 56} anchor="start" size={10.5} color="#1c1c1c" bold>{`heading: ${h}`}</T>
            <T x={334} y={50 + i * 56} anchor="start" size={9.5}>{`source: refund-policy.md · text: "${t}"`}</T>
          </Card>
        </g>
      ))}
      <T x={340} y={206} size={11} color="#1c1c1c" bold>One chunk = one small piece about one topic.</T>
    </svg>
  );
}

export function KeywordMiss() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="Keyword search compares words. A customer who writes 'money back' shares no words with a policy that says 'refund', so keyword search finds nothing even though the policy answers the question.">
      <Box x={10} y={34} w={290} h={56} label="What the customer wrote" sub={'"my earbuds came brokn, can i get my money back?"'} kind="service" size={12} />
      <Box x={380} y={34} w={290} h={56} label="What the policy says" sub={'"…arrives broken… we give you a full refund…"'} kind="ok" size={12} />
      <Arrow d="M302,62 L378,62" ink="red" dashed />
      <T x={340} y={26} size={22} color="#c0392b" bold>✗</T>
      <T x={340} y={108} size={10} color="#c0392b" bold>no shared words</T>
      <Box x={150} y={128} w={380} h={40} label="Keyword search finds nothing" sub="different words, a typo, and the same meaning" kind="fail" size={12} />
    </svg>
  );
}

export function SearchComparison() {
  const rows: [string, string, boolean, boolean, boolean][] = [
    ["Same words as the document", "Can I return headphones I opened?", true, true, true],
    ["Different words, or a typo", "…can i get my money back?", false, true, true],
    ["An exact ID or code", "What is INC-2026-Q3-011?", true, false, true],
  ];
  const cols = [
    { x: 316, label: "Keyword" },
    { x: 430, label: "Vector" },
    { x: 544, label: "Hybrid" },
  ];
  const mark = (ok: boolean, x: number, y: number, hybrid: boolean) => (
    <g>
      <rect x={x} y={y} width={106} height={56} rx={6} fill={ok ? "#eef8ee" : "#fdf3f3"} stroke={ok ? "#7dbb7d" : "#d98b8b"} strokeWidth={hybrid ? 2.2 : 1.2} />
      <T x={x + 53} y={y + 36} size={24} color={ok ? "#2e7d32" : "#c0392b"} bold>{ok ? "✓" : "✗"}</T>
    </g>
  );
  return (
    <svg viewBox="0 0 680 252" role="img" aria-label="Which search finds the answer: keyword search works when the question uses the document's words and for exact codes but fails on different wording; vector search works on meaning but fails on exact codes; hybrid search, which uses both, works for all three kinds of question.">
      {cols.map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={8} width={106} height={30} rx={6} fill={c.label === "Hybrid" ? "#fff7e0" : "#eef3ff"} stroke={c.label === "Hybrid" ? "#e8b400" : "#7ea6e0"} strokeWidth="1.5" />
          <T x={c.x + 53} y={28} size={12} color="#1c1c1c" bold>{c.label}</T>
        </g>
      ))}
      {rows.map(([title, example, k, v, h], i) => {
        const y = 46 + i * 66;
        return (
          <g key={title}>
            <rect x={10} y={y} width={296} height={56} rx={6} fill="#fff" stroke="#d6dbe6" />
            <T x={22} y={y + 24} anchor="start" size={11.5} color="#1c1c1c" bold>{title}</T>
            <T x={22} y={y + 42} anchor="start" size={9.5}>{example}</T>
            {mark(k, 316, y, false)}
            {mark(v, 430, y, false)}
            {mark(h, 544, y, true)}
          </g>
        );
      })}
    </svg>
  );
}

export function HybridMerge() {
  const row = (x: number, y: number, text: string, good?: boolean) => (
    <T x={x} y={y} anchor="start" size={10} color={good === undefined ? "#1c1c1c" : good ? "#2e7d32" : "#c0392b"} bold={good === true}>{text}</T>
  );
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="For the question 'What is INC-2026-Q3-011?', keyword search returns the three sections that contain the ID. Vector search finds only one of them and fills the rest with unrelated sections, because an ID has no meaning to match. Merging the two ranked lists and keeping the best five brings back all three real sections, with two wrong ones behind them.">
      <T x={340} y={16} size={11} color="#1c1c1c" bold>{'Question: "What is INC-2026-Q3-011?"'}</T>
      <Card x={10} y={30} w={190} h={134}>
        <T x={24} y={52} anchor="start" size={12} color="#1c1c1c" bold>Keyword search</T>
        {row(24, 78, "1. Software engineering", true)}
        {row(24, 96, "2. Customer support", true)}
        {row(24, 114, "3. Finance review", true)}
      </Card>
      <T x={208} y={102} size={20} color="#1c1c1c" bold>+</T>
      <Card x={216} y={30} w={226} h={134}>
        <T x={230} y={52} anchor="start" size={12} color="#1c1c1c" bold>Vector search</T>
        {row(230, 78, "1. Finance review", true)}
        {row(230, 96, "2. Finding your serial number", false)}
        {row(230, 114, "3. Firmware 2.4.0", false)}
      </Card>
      <Arrow d="M444,97 L456,97" />
      <Card x={458} y={30} w={212} h={134}>
        <T x={472} y={52} anchor="start" size={12} color="#1c1c1c" bold>Merged, best 5</T>
        {row(472, 78, "1. Finance review", true)}
        {row(472, 96, "2. Customer support", true)}
        {row(472, 114, "3. Software engineering", true)}
        {row(472, 132, "4. Finding your serial number", false)}
        {row(472, 150, "5. Firmware 2.4.0", false)}
      </Card>
      <T x={340} y={196} size={11} color="#1c1c1c" bold>Rank 1 earns the most points, and a chunk found by both lists adds up.</T>
      <T x={340} y={214} size={10.5}>Green = really contains the ID. Vector search found one; the merge brings back all three.</T>
      <T x={340} y={232} size={10.5}>Keep a few extra results: each search can bring wrong chunks, so leave room for the right ones.</T>
    </svg>
  );
}

export function AgentDecides() {
  return (
    <svg viewBox="0 0 680 232" role="img" aria-label="When retrieval is a tool, the model first decides whether the question needs the documents, then calls the search tool zero or more times, and finally answers from the results. A greeting needs no search; a question with two parts triggers two searches.">
      <Box x={10} y={20} w={190} h={52} label="1. Decide" sub="does this need the documents?" kind="primary" size={12} />
      <Arrow d="M202,46 L243,46" />
      <Box x={245} y={20} w={190} h={52} label="2. Search" sub="search_policies(query), 0 to many times" kind="service" size={12} />
      <Arrow d="M437,46 L478,46" />
      <Box x={480} y={20} w={190} h={52} label="3. Answer" sub="from the results, with sources" kind="ok" size={12} />
      <Arrow d="M340,74 L340,96 L105,96 L105,74" ink="purple" dashed />
      <T x={222} y={90} size={9.5} color="#6a3fb5">results go back, the model decides again</T>
      <Box x={10} y={124} w={325} h={56} label={'"hi there"'} sub="no documents needed: it answers directly, no search" kind="service" size={12} />
      <Box x={345} y={124} w={325} h={56} label="A question with two parts" sub="two separate searches, then one combined answer" kind="service" size={12} />
      <T x={340} y={210} size={11} color="#1c1c1c" bold>The model, not your code, decides when to retrieve.</T>
    </svg>
  );
}

export function StoredRecord() {
  const fields: [string, string, string][] = [
    ["id", "refund-policy.md#2", "#bbbbbb"],
    ["values", "[0.12, -0.80, 0.33, …]  384 numbers", "#8e5fd6"],
    ["metadata", "source: refund-policy.md", "#e8a060"],
    ["metadata", "heading: Opened items", "#e8a060"],
    ["metadata", "text: Opened headphones can be returned…", "#e8a060"],
  ];
  return (
    <svg viewBox="0 0 680 232" role="img" aria-label="A vector database stores records: an id, the vector, and metadata holding the source, heading and original text. A query sends the question's vector and gets back the closest records with their metadata, so the answer can show where it came from.">
      <Card x={10} y={10} w={330} h={176}>
        <T x={24} y={32} anchor="start" size={11} color="#1c1c1c" bold>One record in the vector database</T>
        {fields.map(([k, v, c], i) => (
          <g key={`${k}${i}`}>
            <rect x={24} y={42 + i * 28} width={302} height={23} rx={4} fill="#fff" stroke={c} strokeWidth="1.3" />
            <T x={32} y={57 + i * 28} anchor="start" size={9.5} color="#1c1c1c" bold>{k}</T>
            <T x={90} y={57 + i * 28} anchor="start" size={9.5}>{v}</T>
          </g>
        ))}
      </Card>
      <Box x={370} y={14} w={300} h={44} label="Query" sub="the question's vector, and how many results (topK)" kind="service" size={11.5} />
      <Arrow d="M520,60 L520,76" />
      <Box x={370} y={78} w={300} h={44} label="The database finds the closest vectors" sub="fast, even with millions of records" kind="primary" size={11.5} />
      <Arrow d="M520,124 L520,140" />
      <Box x={370} y={142} w={300} h={44} label="Matches come back with their metadata" sub="so the answer can show its sources" kind="ok" size={11.5} />
      <T x={340} y={216} size={11} color="#1c1c1c" bold>Store the original text and source next to the vector.</T>
    </svg>
  );
}

// ───────────────────────── toy embeddings, search picture, models, vector DB words ─────────────────────────

const shade = (v: number) =>
  `rgb(${Math.round(255 - (255 - 79) * v)},${Math.round(255 - (255 - 134) * v)},${Math.round(255 - (255 - 214) * v)})`;

export function ToyVectors() {
  const dims = ["red", "round", "small", "sweet", "edible"];
  const rows: [string, number[], string, string][] = [
    ["apple", [0.9, 0.9, 0.7, 0.8, 1.0], "reference", "#1c1c1c"],
    ["cherry", [0.95, 0.9, 0.95, 0.9, 1.0], "0.99  almost the same", "#2e7d32"],
    ["banana", [0.1, 0.2, 0.4, 0.9, 1.0], "0.82  sweet, not red", "#2e7d32"],
    ["fire truck", [1.0, 0.1, 0.0, 0.0, 0.0], "0.51  red, but not food", "#c0702a"],
    ["laptop", [0.1, 0.0, 0.3, 0.0, 0.0], "0.49  nothing alike", "#c0392b"],
  ];
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="A toy example of embeddings: each thing is described by five numbers between 0 and 1 for how red, round, small, sweet, and edible it is. Apple and cherry have almost identical rows and a similarity of 0.99; banana shares sweet and edible and scores 0.82; a fire truck is only red and scores 0.51; a laptop shares nothing and scores 0.49.">
      {dims.map((d, i) => (
        <T key={d} x={152 + i * 60} y={20} size={10.5} color="#1c1c1c" bold>{d}</T>
      ))}
      <T x={520} y={20} anchor="start" size={10.5} color="#1c1c1c" bold>similarity to apple</T>
      {rows.map(([name, v, note, ink], r) => {
        const y = 32 + r * 44;
        return (
          <g key={name}>
            <T x={14} y={y + 24} anchor="start" size={12} color="#1c1c1c" bold>{name}</T>
            {v.map((n, i) => (
              <g key={i}>
                <rect x={124 + i * 60} y={y + 4} width={56} height={34} rx={4} fill={shade(n)} stroke="#c9d3e6" />
                <T x={152 + i * 60} y={y + 26} size={11} color={n > 0.55 ? "#ffffff" : "#1c1c1c"} bold>{n.toFixed(2)}</T>
              </g>
            ))}
            <T x={520} y={y + 26} anchor="start" size={10.5} color={ink} bold>{note}</T>
          </g>
        );
      })}
    </svg>
  );
}

export function ToySpace() {
  const pts: [string, number, number, string][] = [
    ["apple", 140, 140, "#d9534f"],
    ["cherry", 170, 120, "#a8325a"],
    ["banana", 232, 178, "#e8b400"],
    ["fire truck", 44, 226, "#8e5fd6"],
    ["laptop", 296, 58, "#8a8a8a"],
  ];
  const links: [number, number, string, number, number][] = [
    [170, 120, "0.99", 188, 132],
    [232, 178, "0.82", 190, 170],
    [44, 226, "0.51", 78, 188],
    [296, 58, "0.49", 226, 94],
  ];
  return (
    <svg viewBox="0 0 680 262" role="img" aria-label="The same five things drawn as points: apple and cherry sit almost on top of each other, banana is a little farther away, and the fire truck and laptop are far away. Things with similar numbers are close; things with different numbers are far apart. The five numbers are squashed down to two so they can be drawn.">
      <Card x={10} y={10} w={410} h={242}>
        {links.map(([x, y, s, lx, ly]) => (
          <g key={s}>
            <line x1={140} y1={140} x2={x} y2={y} stroke="#aab7cf" strokeDasharray="4,3" />
            <T x={lx} y={ly} anchor="start" size={9.5} color="#5b6b82" bold>{s}</T>
          </g>
        ))}
        {pts.map(([n, x, y, c]) => (
          <g key={n}>
            <circle cx={x} cy={y} r={7} fill={c} />
            <T x={n === "cherry" ? x + 14 : x} y={n === "cherry" ? y - 8 : y + 22} anchor={n === "cherry" ? "start" : "middle"} size={10.5} color="#1c1c1c" bold>{n}</T>
          </g>
        ))}
        <T x={215} y={244} size={9.5}>5 numbers squashed to 2, just so we can draw them</T>
      </Card>
      <Box x={440} y={14} w={230} h={50} label="apple and cherry" sub="almost the same numbers: very close" kind="ok" size={11.5} />
      <Box x={440} y={76} w={230} h={50} label="banana" sub="shares sweet and edible: a bit farther" kind="primary" size={11.5} />
      <Box x={440} y={138} w={230} h={50} label="fire truck" sub="red, but not food: far away" kind="warn" size={11.5} />
      <Box x={440} y={200} w={230} h={50} label="laptop" sub="nothing in common: far away" kind="fail" size={11.5} />
    </svg>
  );
}

export function VectorSearchPicture() {
  const dots: [string, number, number, string][] = [
    ["Return window", 70, 68, "#7ea6e0"],
    ["Opened items", 142, 82, "#7ea6e0"],
    ["Damaged or defective", 62, 134, "#7ea6e0"],
    ["Delivery times", 262, 54, "#7dbb7d"],
    ["Shipping costs", 306, 92, "#7dbb7d"],
    ["Coverage period", 90, 196, "#b08be0"],
    ["Battery wear", 170, 214, "#b08be0"],
    ["FLASH40", 300, 200, "#e8a060"],
    ["WELCOME10", 340, 160, "#e8a060"],
  ];
  const steps: [string, string, "service" | "primary" | "ok"][] = [
    ["1. Embed the question", "with the same model as the chunks", "service"],
    ["2. Compare with the stored vectors", "closest = most similar meaning", "primary"],
    ["3. Keep the 3 nearest", "and put them in the prompt", "ok"],
  ];
  return (
    <svg viewBox="0 0 680 270" role="img" aria-label="Vector search as a picture: every chunk is a dot, and chunks about the same topic sit together. The question is embedded into the same space and lands among the refund chunks; the 3 nearest dots are kept and sent to the model.">
      <Card x={10} y={10} w={400} h={250}>
        <ellipse cx={100} cy={104} rx={86} ry={66} fill="#fff7e0" stroke="#e8b400" strokeDasharray="5,4" />
        <T x={100} y={182} size={9.5} color="#c0702a" bold>the 3 nearest</T>
        {dots.map(([n, x, y, c]) => (
          <g key={n}>
            <circle cx={x} cy={y} r={5.5} fill={c} />
            <T x={x} y={y + 16} size={8.5}>{n}</T>
          </g>
        ))}
        <polygon points="104,100 113,110 104,120 95,110" fill="#e8a060" stroke="#c0702a" />
        <T x={120} y={114} anchor="start" size={9.5} color="#c0702a" bold>the question</T>
        <T x={210} y={254} size={9.5}>each dot is one chunk; same topic = nearby</T>
      </Card>
      {steps.map(([l, s, k], i) => (
        <g key={l}>
          <Box x={430} y={14 + i * 84} w={240} h={56} label={l} sub={s} kind={k} size={11.5} />
          {i < 2 && <Arrow d={`M550,${72 + i * 84} L550,${96 + i * 84}`} />}
        </g>
      ))}
    </svg>
  );
}

export function EmbeddingModelChoice() {
  const hosted = ["OpenAI text-embedding-3", "Voyage AI", "Cohere Embed", "Google Gemini Embedding"];
  const open = ["all-MiniLM-L6-v2 (today, 384)", "BGE", "E5", "Nomic Embed"];
  const criteria: [string, string][] = [
    ["Quality on your content", "check a leaderboard (MTEB), then test on your own questions"],
    ["Language", "multilingual documents need a multilingual model"],
    ["Dimensions", "more numbers: a bit better, but more storage and slower"],
    ["Cost and speed", "pay per token for an API, or run it yourself"],
    ["Privacy", "a hosted API sends your text out; a local model does not"],
  ];
  return (
    <svg viewBox="0 0 680 290" role="img" aria-label="Common embedding models and how to choose one. Hosted APIs: OpenAI text-embedding-3, Voyage AI, Cohere Embed, Google Gemini Embedding. Open-source models you run yourself: all-MiniLM-L6-v2, BGE, E5, Nomic Embed. Choose by quality on your own content, language, dimensions, cost and speed, and privacy.">
      <Card x={10} y={10} w={250} h={270}>
        <T x={24} y={32} anchor="start" size={12} color="#1c1c1c" bold>Common models</T>
        <T x={24} y={54} anchor="start" size={10} color="#2f6fed" bold>HOSTED (API)</T>
        {hosted.map((m, i) => (
          <g key={m}>
            <rect x={24} y={62 + i * 28} width={222} height={22} rx={4} fill="#eef3ff" stroke="#7ea6e0" />
            <T x={34} y={77 + i * 28} anchor="start" size={10}>{m}</T>
          </g>
        ))}
        <T x={24} y={188} anchor="start" size={10} color="#2e7d32" bold>OPEN SOURCE (RUN IT YOURSELF)</T>
        {open.map((m, i) => (
          <g key={m}>
            <rect x={24} y={196 + i * 20} width={222} height={17} rx={4} fill="#eef8ee" stroke="#7dbb7d" />
            <T x={34} y={208 + i * 20} anchor="start" size={9.5}>{m}</T>
          </g>
        ))}
      </Card>
      <T x={280} y={32} anchor="start" size={12} color="#1c1c1c" bold>How to choose</T>
      {criteria.map(([t, s], i) => (
        <Card key={t} x={280} y={44 + i * 48} w={390} h={42}>
          <T x={294} y={62 + i * 48} anchor="start" size={11} color="#1c1c1c" bold>{t}</T>
          <T x={294} y={78 + i * 48} anchor="start" size={9.5}>{s}</T>
        </Card>
      ))}
    </svg>
  );
}

export function VectorDbVocabulary() {
  const head: [string, number, string][] = [
    ["Postgres + pgvector", 156, "#eef3ff"],
    ["MongoDB Atlas", 326, "#eef8ee"],
    ["Pinecone", 496, "#fff7e0"],
  ];
  const rows: [string, string, string, string][] = [
    ["Where records live", "table", "collection", "index (+ namespaces)"],
    ["One item", "row", "document", "record"],
    ["The vector", "a vector(384) column", "an array field", "values"],
    ["The other data", "other columns", "other fields", "metadata"],
    ["Speeds up search", "an HNSW index", "a vector search index", "built in"],
  ];
  return (
    <svg viewBox="0 0 680 292" role="img" aria-label="Vector database words mapped to what you already know. A table in Postgres with pgvector is a collection in MongoDB Atlas and an index in Pinecone. A row is a document is a record. The vector is a vector column, an array field, or the values. The other data is columns, fields, or metadata. In Postgres and MongoDB a separate index speeds up search, while Pinecone has it built in. Careful: a Pinecone index is the whole collection, not the speed-up structure.">
      {head.map(([l, x, f]) => (
        <g key={l}>
          <rect x={x} y={8} width={164} height={30} rx={6} fill={f} stroke="#9aa9c4" strokeWidth="1.3" />
          <T x={x + 82} y={28} size={11.5} color="#1c1c1c" bold>{l}</T>
        </g>
      ))}
      {rows.map(([label, a, b, c], r) => {
        const y = 46 + r * 38;
        return (
          <g key={label}>
            <rect x={10} y={y} width={140} height={32} rx={6} fill="#f5f6f9" stroke="#d6dbe6" />
            <T x={20} y={y + 20} anchor="start" size={10.5} color="#1c1c1c" bold>{label}</T>
            {[a, b, c].map((cell, i) => (
              <g key={i}>
                <rect x={156 + i * 170} y={y} width={164} height={32} rx={6} fill="#fff" stroke="#d6dbe6" />
                <T x={238 + i * 170} y={y + 20} size={11} color="#1c1c1c">{cell}</T>
              </g>
            ))}
          </g>
        );
      })}
      <T x={340} y={256} size={10.5} color="#c0392b" bold>Careful with the word "index"</T>
      <T x={340} y={273} size={10}>in Pinecone it is the whole collection; in Postgres and MongoDB it is the speed-up structure.</T>
    </svg>
  );
}

export function WhichVectorDb() {
  return (
    <svg viewBox="0 0 680 200" role="img" aria-label="Two popular ways to get a vector database. Extend a database you already run: pgvector for Postgres, or Atlas Vector Search for MongoDB. Or use a managed vector database such as Pinecone, which is what the lecture uses.">
      <Card x={10} y={10} w={325} h={150}>
        <T x={24} y={34} anchor="start" size={12.5} color="#1c1c1c" bold>Use the database you already run</T>
        <rect x={24} y={46} width={296} height={26} rx={4} fill="#eef3ff" stroke="#7ea6e0" />
        <T x={34} y={63} anchor="start" size={10.5} color="#1c1c1c" bold>pgvector</T>
        <T x={104} y={63} anchor="start" size={10}>an extension for Postgres</T>
        <rect x={24} y={78} width={296} height={26} rx={4} fill="#eef8ee" stroke="#7dbb7d" />
        <T x={34} y={95} anchor="start" size={10.5} color="#1c1c1c" bold>Atlas Vector Search</T>
        <T x={160} y={95} anchor="start" size={10}>built into MongoDB</T>
        <T x={24} y={126} anchor="start" size={10} color="#2e7d32">no new system; vectors sit next to your other data</T>
        <T x={24} y={144} anchor="start" size={10}>you run it and scale it yourself</T>
      </Card>
      <Card x={345} y={10} w={325} h={150}>
        <T x={359} y={34} anchor="start" size={12.5} color="#1c1c1c" bold>Use a managed vector database</T>
        <rect x={359} y={46} width={296} height={34} rx={4} fill="#fff7e0" stroke="#e8b400" strokeWidth="1.6" />
        <T x={369} y={68} anchor="start" size={11.5} color="#1c1c1c" bold>Pinecone</T>
        <T x={440} y={68} anchor="start" size={10}>what we use in the lecture</T>
        <T x={359} y={106} anchor="start" size={10} color="#2e7d32">nothing to install, it scales for you</T>
        <T x={359} y={124} anchor="start" size={10}>a separate service, billed by usage</T>
      </Card>
      <T x={340} y={188} size={11} color="#1c1c1c" bold>Already on Postgres or MongoDB? Start there. Want zero setup? Pinecone.</T>
    </svg>
  );
}
