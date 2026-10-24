import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  AgentDecides,
  ChunkingStrategies,
  DocToChunks,
  EmbeddingModelChoice,
  HybridMerge,
  KeywordMiss,
  NoContext,
  RagPipeline,
  RetrieveThenAnswer,
  SearchComparison,
  TokenWall,
  ToySpace,
  ToyVectors,
  VectorDbVocabulary,
  VectorSearchPicture,
  WhichVectorDb,
} from "./Diagrams";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 29 Notes</title>
      <DayNav day="day29-rag-vector-databases" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 29 · Notes</p>
        <h1>RAG &amp; Vector Databases</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. The model knows nothing about your documents; RAG finds the right pieces and hands them to it.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。模型对你的文档一无所知；RAG 负责找出对的片段，再交给它。</Zh>
        </p>
        <ul>
          <li>
            <En>Explain why pasting every document into the prompt stops working: cost and size limits</En>
            <Zh>解释为什么把所有文档都贴进 prompt 行不通：成本和长度上限</Zh>
          </li>
          <li>
            <En>Explain RAG: chunk the documents, retrieve the relevant chunks, and answer from only those</En>
            <Zh>解释 RAG：把文档切成 chunk，检索出相关的 chunk，只基于它们来回答</Zh>
          </li>
          <li>
            <En>Explain keyword search and where it fails: different words and typos</En>
            <Zh>解释关键词搜索，以及它在哪里会失败：用词不同和拼写错误</Zh>
          </li>
          <li>
            <En>Explain embeddings and vector search: meaning as numbers, similarity, the same model at both ends, and how to choose an embedding model</En>
            <Zh>解释 embedding 与向量搜索：把含义变成数字、相似度、两端使用同一个模型，以及如何选择 embedding 模型</Zh>
          </li>
          <li>
            <En>Explain hybrid search: why vector search misses exact codes, and how merging both fixes it</En>
            <Zh>解释混合搜索：为什么向量搜索会漏掉精确编号，以及合并两种搜索如何解决</Zh>
          </li>
          <li>
            <En>Explain RAG as an agent tool, the ingestion pipeline, and vector databases: pgvector or Pinecone</En>
            <Zh>解释把 RAG 做成 agent 的 tool、摄取流程，以及向量数据库：pgvector 还是 Pinecone</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/ai-training/day29-rag-vector-databases/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        <h3 className="part part-lg">
          <En>1. The problem: the model does not know your data</En>
          <Zh>1. 问题：模型不了解你的数据</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>1.1 No documents, no answer</En>
          <Zh>1.1 没有文档，就没有答案</Zh>
        </h4>
        <p>
          <En>Our example: a support bot for Lumen Audio, a headphone store. A customer asks about the return policy.</En>
          <Zh>我们的例子：Lumen Audio（一家耳机商店）的客服机器人。顾客来询问退货政策。</Zh>
        </p>
        <NoContext />
        <ul>
          <li>
            <En>The model never saw the store's policies, so it invents a policy or says it does not know.</En>
            <Zh>模型从没见过这家店的政策，所以它要么编造一个政策，要么说不知道。</Zh>
          </li>
          <li>
            <En>Both are failures for a support bot: the answer must come from the real documents.</En>
            <Zh>对客服机器人来说这两种都是失败：答案必须来自真实的文档。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.2 The naive fix: paste everything</En>
          <Zh>1.2 最直接的办法：全部贴进 prompt</Zh>
        </h4>
        <p>
          <En>Read every file and put all of it in the system prompt.</En>
          <Zh>把每个文件都读出来，全部放进 system prompt。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const allDocs = files.map((f) => fs.readFileSync(\`docs/\${f}\`, "utf8")).join("\\n\\n");

const response = await client.messages.create({
  model: "claude-haiku-5-5",
  max_tokens: 1000,
  system: \`Answer only from these policies.\\n\\n\${allDocs}\`,
  messages: [{ role: "user", content: question }],
});`}
        />
        <TokenWall />
        <ul>
          <li>
            <En>It works, and the answer is correct: 14 days, with a 12% restocking fee.</En>
            <Zh>它确实有效，答案也正确：14 天，并收取 12% 的重新入库费。</Zh>
          </li>
          <li>
            <En>But every question pays for every document, and a real company has thousands of pages.</En>
            <Zh>但每个问题都要为所有文档付费，而真实的公司有成千上万页文档。</Zh>
          </li>
          <li>
            <En>Past the model's size limit, the request is simply rejected.</En>
            <Zh>一旦超过模型的长度上限，请求会被直接拒绝。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>2. RAG: retrieve first, then answer</En>
          <Zh>2. RAG：先检索，再回答</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>2.1 The idea</En>
          <Zh>2.1 思路</Zh>
        </h4>
        <p>
          <En>Do not send everything. Find the few pieces that answer the question, and send only those.</En>
          <Zh>不要把所有东西都发过去。先找出能回答问题的几小段，只发送这几段。</Zh>
        </p>
        <RetrieveThenAnswer />
        <CodeBlock
          language="typescript"
          code={`const found = search(question);                  // 1. find the relevant chunks
const context = found.map((c) => c.text).join("\\n\\n");

const response = await client.messages.create({  // 2. answer from them
  model: "claude-haiku-5-5",
  max_tokens: 1000,
  system: \`Answer only from the context. If it is not there, say you don't know.\\n\\n\${context}\`,
  messages: [{ role: "user", content: question }],
});`}
        />
        <ul>
          <li>
            <En>RAG stands for Retrieval-Augmented Generation: retrieve first, then generate.</En>
            <Zh>RAG 是 Retrieval-Augmented Generation（检索增强生成）的缩写：先检索，再生成。</Zh>
          </li>
          <li>
            <En>The model never searches anything. Your code finds the text and puts it in the prompt.</En>
            <Zh>模型从不自己去搜索。是你的代码找出文字，再放进 prompt。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.2 Chunking: cut the documents into pieces</En>
          <Zh>2.2 Chunking：把文档切成小段</Zh>
        </h4>
        <p>
          <En>To search the documents, first cut each one into chunks. We cut at every section heading.</En>
          <Zh>要搜索文档，先把每份文档切成 chunk。我们在每个小节标题处切开。</Zh>
        </p>
        <DocToChunks />
        <CodeBlock
          language="typescript"
          code={`type Chunk = { source: string; heading: string; text: string };
const chunks: Chunk[] = [];

for (const file of fs.readdirSync("docs")) {
  const markdown = fs.readFileSync(\`docs/\${file}\`, "utf8");
  for (const section of markdown.split("\\n## ").slice(1)) {
    const [heading, ...lines] = section.split("\\n");
    chunks.push({ source: file, heading, text: lines.join("\\n").trim() });
  }
}`}
        />
        <p>
          <En>Cutting at headings is only one strategy. There are four common ones.</En>
          <Zh>在标题处切开只是其中一种策略。常见的有四种。</Zh>
        </p>
        <ChunkingStrategies />
        <ul>
          <li>
            <En>A chunk should be about one topic: too big and the match is diluted, too small and it loses its context.</En>
            <Zh>一个 chunk 应该只讲一件事：太大，匹配会被稀释；太小，又会丢掉上下文。</Zh>
          </li>
          <li>
            <En>Our documents are small and well organized, so any of these works. Structure-aware is the best default for real documents.</En>
            <Zh>我们的文档很小、结构清晰，所以这几种都行。对真实文档来说，按结构切分是最好的默认选择。</Zh>
          </li>
          <li>
            <En>Keep the source and heading with every chunk, so the answer can say where it came from.</En>
            <Zh>每个 chunk 都带上来源和标题，这样答案才能说明它出自哪里。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.3 Keyword search</En>
          <Zh>2.3 关键词搜索</Zh>
        </h4>
        <p>
          <En>The simplest search: count how many words the question shares with each chunk.</En>
          <Zh>最简单的搜索：数一数问题和每个 chunk 共有多少个词。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`// an ID like INC-2026-Q3-011 stays in one piece
const toWords = (text: string) => text.toLowerCase().match(/[a-z0-9]+(-[a-z0-9]+)*/g) ?? [];

function keywordSearch(question: string): Chunk[] {
  const questionWords = toWords(question);
  return chunks
    .map((chunk) => ({
      chunk,
      score: questionWords.filter((w) => toWords(chunk.text).includes(w)).length,
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.chunk);
}`}
        />
        <KeywordMiss />
        <ul>
          <li>
            <En>It works when the question uses the document's own words: "opened headphones" finds the opened-items chunk.</En>
            <Zh>当问题用了文档里的原词时它有效："opened headphones" 能找到 opened items 那一段。</Zh>
          </li>
          <li>
            <En>It fails when the words differ: "money back" never matches "refund", and a typo matches nothing.</En>
            <Zh>词不一样就会失败："money back" 永远匹配不到 "refund"，拼写错误则什么也匹配不到。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>3. Embeddings and vector search</En>
          <Zh>3. Embedding 与向量搜索</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>3.1 What an embedding is</En>
          <Zh>3.1 什么是 embedding</Zh>
        </h4>
        <p>
          <En>We need a search that understands meaning. The trick: describe every thing with a list of numbers. Here is a toy version, with five properties, each a number from 0 to 1.</En>
          <Zh>我们需要一种能理解含义的搜索。诀窍是：用一串数字来描述每一样东西。下面是一个玩具版本，有五个属性，每个都是 0 到 1 之间的数。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`//                 red   round small sweet edible
const apple     = [0.9,  0.9,  0.7,  0.8,  1.0];
const cherry    = [0.95, 0.9,  0.95, 0.9,  1.0];
const fireTruck = [1.0,  0.1,  0.0,  0.0,  0.0];`}
        />
        <ToyVectors />
        <ul>
          <li>
            <En>These are not strings: each position is a number on a scale, how red, how round, how sweet.</En>
            <Zh>它们不是字符串：每个位置都是一个刻度上的数字，表示有多红、有多圆、有多甜。</Zh>
          </li>
          <li>
            <En>Similar things get similar numbers. Apple and cherry have almost the same row; a fire truck is red, but its other numbers are nothing like an apple's.</En>
            <Zh>相似的东西，数字也相似。apple 和 cherry 的数字几乎一样；fire truck 虽然也是红色，但其他数字和 apple 完全不同。</Zh>
          </li>
        </ul>
        <ToySpace />
        <ul>
          <li>
            <En>Draw each row as a point and the picture appears: similar meaning means nearby points.</En>
            <Zh>把每一行画成一个点，图就出来了：含义相近，点就挨得近。</Zh>
          </li>
          <li>
            <En>A real embedding model does the same for text, with hundreds of numbers instead of five. Nobody labels them "red" or "round": the model learns them from huge amounts of text.</En>
            <Zh>真实的 embedding 模型对文字做的是同样的事，只不过用几百个数字，而不是五个。没人给它们贴 "red"、"round" 这样的标签：模型是从海量文本里学出来的。</Zh>
          </li>
        </ul>
        <CodeBlock
          language="typescript"
          code={`import { pipeline } from "@huggingface/transformers";

// a small embedding model that runs on your laptop
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

async function embed(texts: string[]): Promise<number[][]> {
  const output = await embedder(texts, { pooling: "mean", normalize: true });
  return output.tolist();
}

const [vector] = await embed(["I want my money back"]);
console.log(vector.length); // 384 numbers, for every text`}
        />

        <h4 className="topic topic-line">
          <En>3.2 Similarity: how close are two vectors?</En>
          <Zh>3.2 相似度：两个向量有多近？</Zh>
        </h4>
        <p>
          <En>Cosine similarity compares the direction of two vectors. 1 means the same, near 0 means unrelated.</En>
          <Zh>余弦相似度（cosine similarity）比较两个向量的方向。1 表示相同，接近 0 表示无关。</Zh>
        </p>
        <CodeBlock
          language="plaintext"
          code={`cosine(a, b) = (a1*b1 + a2*b2 + …) / (length of a × length of b)

cosine(apple, cherry)     = 0.99   almost the same
cosine(apple, banana)     = 0.82
cosine(apple, fire truck) = 0.51
cosine(apple, laptop)     = 0.49   nothing in common`}
        />
        <ul>
          <li>
            <En>You never do this by hand: the formula is one line of code, and the database does it for you.</En>
            <Zh>你不需要手算：这个公式只有一行代码，数据库会替你完成。</Zh>
          </li>
          <li>
            <En>"money back" scores high against "refund" and near zero against "pizza", just like the toy example.</En>
            <Zh>"money back" 和 "refund" 得分很高，和 "pizza" 几乎为零，就像上面的玩具例子一样。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.3 Vector search</En>
          <Zh>3.3 向量搜索</Zh>
        </h4>
        <p>
          <En>Embed every chunk once and keep each next to its vector. That list is a vector store. To search, embed the question and take the nearest chunks.</En>
          <Zh>把每个 chunk 做一次 embedding，并把它和向量放在一起保存。这个列表就是向量库（vector store）。搜索时，把问题也做 embedding，取出最近的几个 chunk。</Zh>
        </p>
        <VectorSearchPicture />
        <CodeBlock
          language="typescript"
          code={`// Ingestion: embed every chunk once, keep it next to its vector
const vectors = await embed(chunks.map((c) => c.text));
const vectorStore = chunks.map((chunk, i) => ({ chunk, vector: vectors[i] }));

// Search: embed the question, keep the 3 most similar chunks
async function vectorSearch(question: string): Promise<Chunk[]> {
  const [questionVector] = await embed([question]);
  return vectorStore
    .map((e) => ({ chunk: e.chunk, score: cosine(questionVector, e.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.chunk);
}`}
        />
        <ul>
          <li>
            <En>The question that failed before now works: "money back" lands next to the damaged-or-defective chunk.</En>
            <Zh>之前失败的问题现在可以了："money back" 落在 damaged-or-defective 那一段旁边。</Zh>
          </li>
          <li>
            <En>Questions and chunks must be embedded by the same model, or the scores mean nothing.</En>
            <Zh>问题和 chunk 必须用同一个模型做 embedding，否则得分没有意义。</Zh>
          </li>
          <li>
            <En>Changing the embedding model means re-embedding every chunk.</En>
            <Zh>更换 embedding 模型，意味着要把所有 chunk 重新做一遍 embedding。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.4 Choosing an embedding model</En>
          <Zh>3.4 选择 embedding 模型</Zh>
        </h4>
        <p>
          <En>A common interview question: what is an embedding, and which model would you pick, and why?</En>
          <Zh>常见的面试问题：什么是 embedding？你会选哪个模型，为什么？</Zh>
        </p>
        <EmbeddingModelChoice />
        <ul>
          <li>
            <En>Start with a well-ranked model that fits your language and budget, then test it on 20 real questions from your own documents.</En>
            <Zh>先选一个排名靠前、符合你的语言和预算的模型，再用你自己文档里的 20 个真实问题去测试。</Zh>
          </li>
          <li>
            <En>The dimension (384 here) is fixed by the model, and the vector database must be created with the same number.</En>
            <Zh>维度（这里是 384）由模型决定，向量数据库建库时必须填同样的数字。</Zh>
          </li>
          <li>
            <En>Names and versions change quickly. The reasons to choose do not.</En>
            <Zh>模型的名字和版本变化很快，但选择的理由不会变。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>4. Hybrid search</En>
          <Zh>4. 混合搜索</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>4.1 Each search has a blind spot</En>
          <Zh>4.1 每种搜索都有盲区</Zh>
        </h4>
        <p>
          <En>Vector search understands meaning, but it cannot look up an exact ID: an ID has no meaning to match.</En>
          <Zh>向量搜索能理解含义，却无法精确查找某个 ID：ID 本身没有可匹配的含义。</Zh>
        </p>
        <SearchComparison />
        <ul>
          <li>
            <En>"What is INC-2026-Q3-011?" has no meaning to match, only an ID buried inside long sections about other topics: keyword search finds every section that contains it, vector search finds one and returns unrelated sections.</En>
            <Zh>"What is INC-2026-Q3-011?" 没有可匹配的含义，只有一个埋在多个不同主题长段落里的 ID：关键词搜索能找出所有包含它的段落，向量搜索只找到一个，其余返回的是不相关的段落。</Zh>
          </li>
          <li>
            <En>Real questions are a mix of both kinds, so use both searches.</En>
            <Zh>真实的问题两种类型都有，所以两种搜索都要用。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>4.2 Run both, then merge</En>
          <Zh>4.2 两个都跑，再合并</Zh>
        </h4>
        <HybridMerge />
        <CodeBlock
          language="typescript"
          code={`const scores = new Map<Chunk, number>();

for (const list of [byKeyword, byMeaning]) {
  list.forEach((chunk, rank) => {
    // rank 1 earns the most; a chunk found by both lists adds up
    scores.set(chunk, (scores.get(chunk) ?? 0) + 1 / (60 + rank + 1));
  });
}

const best5 = [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);`}
        />
        <ul>
          <li>
            <En>This merge is called reciprocal rank fusion: it needs only the two rankings, not their scores.</En>
            <Zh>这种合并方式叫 reciprocal rank fusion（倒数排名融合）：只需要两个排名，不需要它们的分数。</Zh>
          </li>
          <li>
            <En>Keep a few extra results (5, not 3): each search can bring wrong chunks, so leave room for the right ones.</En>
            <Zh>多保留几条结果（5 条，而不是 3 条）：每种搜索都可能带来错误的 chunk，要给正确的结果留出位置。</Zh>
          </li>
          <li>
            <En>Hybrid search is standard in production systems, because the two searches cover each other.</En>
            <Zh>混合搜索是生产系统里的标准做法，因为两种搜索可以互相补位。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>5. RAG as a tool</En>
          <Zh>5. 把 RAG 做成 tool</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>5.1 Let the agent decide when to search</En>
          <Zh>5.1 让 agent 自己决定何时搜索</Zh>
        </h4>
        <p>
          <En>So far we searched on every question. Instead, wrap the search in a tool and let the model decide.</En>
          <Zh>到目前为止，我们对每个问题都搜索一次。换个做法：把搜索包装成 tool，让模型自己决定。</Zh>
        </p>
        <AgentDecides />
        <CodeBlock
          language="typescript"
          code={`const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_policies",
    description:
      "Search Lumen Audio's help documents: refunds, shipping, warranty, " +
      "promotions, and more. Returns the 3 most relevant sections.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string", description: "What to look up" } },
      required: ["query"],
    },
  },
];

// In the agent loop: when the model calls search_policies,
// run the hybrid search and send the chunks back as the tool result`}
        />
        <ul>
          <li>
            <En>It is the same agent loop as before; the tool just happens to be a document search.</En>
            <Zh>这就是之前的那个 agent 循环；只是这个 tool 恰好是文档搜索。</Zh>
          </li>
          <li>
            <En>The description tells the model what the documents cover, so it knows when searching is worth it.</En>
            <Zh>description 告诉模型这些文档涵盖哪些内容，让它知道什么时候值得去搜索。</Zh>
          </li>
          <li>
            <En>The model can search several times, with different queries, for a question that has several parts.</En>
            <Zh>遇到包含多个部分的问题时，模型可以用不同的查询搜索多次。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>6. Production: the ingestion pipeline and a vector database</En>
          <Zh>6. 生产环境：摄取流程与向量数据库</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>6.1 The ingestion pipeline</En>
          <Zh>6.1 摄取流程（ingestion pipeline）</Zh>
        </h4>
        <p>
          <En>In production, preparing the documents is a separate script, run whenever the documents change.</En>
          <Zh>在生产环境中，准备文档是一个单独的脚本，文档一有变化就运行一次。</Zh>
        </p>
        <RagPipeline />
        <CodeBlock
          language="typescript"
          code={`const chunks = chunkEveryFile("docs");                    // 1. chunk
const vectors = await embed(chunks.map((c) => c.text));    // 2. embed

const index = new Pinecone().index({ name: "lumen-policies" });
await index.upsert({                                       // 3. store
  records: chunks.map((chunk, i) => ({
    id: \`\${chunk.source}#\${i}\`,
    values: vectors[i],
    metadata: { source: chunk.source, heading: chunk.heading, text: chunk.text },
  })),
});`}
        />
        <ul>
          <li>
            <En>Edit a document, run the script again, and the bot answers with the new text: change "14 days" to "21 days" and the answer changes.</En>
            <Zh>修改一份文档，再运行一次脚本，机器人就会用新的内容回答：把 "14 days" 改成 "21 days"，答案随之改变。</Zh>
          </li>
          <li>
            <En>When does it run? On a schedule, such as a nightly cron job, or whenever a document changes, such as a webhook or a CI job after the docs are updated.</En>
            <Zh>什么时候运行？按计划运行，例如每晚一次的 cron 定时任务；或者在文档变化时运行，例如通过 webhook，或在文档更新后由 CI 任务触发。</Zh>
          </li>
          <li>
            <En>The simplest way to stay in sync is to delete the old chunks and upload the new ones.</En>
            <Zh>保持同步最简单的办法，是删掉旧的 chunk，再上传新的。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.2 A vector database in words you already know</En>
          <Zh>6.2 用你已经熟悉的词理解向量数据库</Zh>
        </h4>
        <p>
          <En>A vector database stores the same things as a SQL or NoSQL database. Only the names change.</En>
          <Zh>向量数据库存放的东西，和 SQL 或 NoSQL 数据库是一样的，只是名字不同。</Zh>
        </p>
        <VectorDbVocabulary />
        <CodeBlock
          language="typescript"
          code={`const [queryVector] = await embed([question]);

const result = await index.query({ vector: queryVector, topK: 3, includeMetadata: true });

const found = result.matches.map((m) => m.metadata); // source, heading, text`}
        />
        <ul>
          <li>
            <En>Vector: the list of numbers for one chunk. Its length is the dimension, and it must match the embedding model.</En>
            <Zh>向量（vector）：一个 chunk 的那串数字。它的长度叫维度，必须和 embedding 模型一致。</Zh>
          </li>
          <li>
            <En>Index: in Pinecone, the whole collection of vectors, like a table. You set its dimension and similarity measure when you create it.</En>
            <Zh>索引（index）：在 Pinecone 里，它就是整个向量集合，相当于一张表。创建时要设置维度和相似度度量。</Zh>
          </li>
          <li>
            <En>Metadata: the other data stored with each vector, such as the source and the original text, returned with every match.</En>
            <Zh>元数据（metadata）：和每个向量一起存的其他数据，例如来源和原文，会随每个匹配一起返回。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.3 pgvector or Pinecone</En>
          <Zh>6.3 pgvector 还是 Pinecone</Zh>
        </h4>
        <p>
          <En>These are the two most popular choices today.</En>
          <Zh>这是目前最流行的两种选择。</Zh>
        </p>
        <WhichVectorDb />
        <CodeBlock
          language="sql"
          code={`CREATE EXTENSION vector;

CREATE TABLE chunks (
  id        serial PRIMARY KEY,
  source    text,
  heading   text,
  text      text,
  embedding vector(384)   -- must match the model's dimension
);

CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);

SELECT source, heading, text
FROM chunks
ORDER BY embedding <=> $1   -- <=> is cosine distance
LIMIT 3;`}
        />
        <ul>
          <li>
            <En>If you already use Postgres, add pgvector. If you use MongoDB, turn on Atlas Vector Search. No new system to run.</En>
            <Zh>如果你已经在用 Postgres，就加上 pgvector；如果用 MongoDB，就启用 Atlas Vector Search。不需要新增系统。</Zh>
          </li>
          <li>
            <En>For a managed cloud service with nothing to run, use Pinecone. That is what today's lecture uses.</En>
            <Zh>想要一个无需自己运维的托管云服务，就用 Pinecone，今天的课程用的就是它。</Zh>
          </li>
          <li>
            <En>The index above (HNSW) makes the search approximate but fast, which matters at millions of vectors.</En>
            <Zh>上面的索引（HNSW）让搜索变成近似搜索，但速度很快，在百万级向量时这点很重要。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>Reference: vocabulary</En>
          <Zh>参考：术语表</Zh>
        </h3>

        <table className="ref-table">
          <thead>
            <tr>
              <th>Term</th>
              <th><En>Meaning</En><Zh>含义</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RAG</td>
              <td><En>Retrieve the relevant text first, then let the model answer from it</En><Zh>先检索相关文字，再让模型基于它回答</Zh></td>
            </tr>
            <tr>
              <td>Chunk</td>
              <td><En>A small piece of a document, about one topic</En><Zh>文档中的一小段，只讲一件事</Zh></td>
            </tr>
            <tr>
              <td>Embedding / vector</td>
              <td><En>A list of numbers that captures the meaning of a text</En><Zh>用来表示文字含义的一串数字</Zh></td>
            </tr>
            <tr>
              <td>Cosine similarity</td>
              <td><En>How close two vectors are: 1 is the same, 0 is unrelated</En><Zh>两个向量有多接近：1 表示相同，0 表示无关</Zh></td>
            </tr>
            <tr>
              <td>Vector store</td>
              <td><En>Chunks kept next to their vectors, searched by similarity</En><Zh>把 chunk 和它的向量放在一起，按相似度搜索</Zh></td>
            </tr>
            <tr>
              <td>Dimension</td>
              <td><En>How many numbers are in one vector; fixed by the embedding model</En><Zh>一个向量里有多少个数字；由 embedding 模型决定</Zh></td>
            </tr>
            <tr>
              <td>Hybrid search</td>
              <td><En>Keyword search plus vector search, merged</En><Zh>关键词搜索加向量搜索，再合并</Zh></td>
            </tr>
            <tr>
              <td>Ingestion</td>
              <td><En>Chunk, embed, and store the documents, again whenever they change</En><Zh>把文档切分、embedding 并存储，文档变化时再来一遍</Zh></td>
            </tr>
          </tbody>
        </table>

        <p className="callout">
          <En>One agent with tools and retrieval works. What happens when the job is bigger than one agent can hold?</En>
          <Zh>一个带 tools 和检索的 agent 能用。但当任务大到一个 agent 装不下的时候，该怎么办？</Zh>
        </p>
      </section>
    </div>
  );
}
