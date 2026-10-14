import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  ApiCallAnatomy,
  ContextBudget,
  CostMath,
  ErrorMap,
  EvalLoop,
  GraderEval,
  HistoryGrowth,
  ModelChoice,
  PromptMistakes,
  PromptParts,
  PromptRagFinetune,
  RagFlow,
  ReliabilityLadder,
  RepairLoop,
  SamplingDials,
  ShapeVsTruth,
  ShotsCompare,
  StreamToBrowser,
  StreamingTimeline,
  ThinkingOptions,
  TokenOdds,
} from "./Diagrams";
import { JsonDemo, StreamingDemo } from "./Demos";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 27 Notes</title>
      <DayNav day="day27-llm-prompts-sdk" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 27 · Notes</p>
        <h1>LLM Fundamentals, Prompting &amp; SDK</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. Every AI feature you will ever build starts with one model call.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。你以后做的每一个 AI 功能，都从一次模型调用开始。</Zh>
        </p>
        <ul>
          <li>
            <En>Read one API call end to end: the request fields, the response fields (stop_reason and usage), and estimate what a request costs</En>
            <Zh>完整读懂一次 API 调用：请求字段、响应字段（stop_reason 和 usage），并估算一次请求的成本</Zh>
          </li>
          <li>
            <En>Set temperature and max_tokens for the job, and explain time to first token and streaming</En>
            <Zh>按任务设置 temperature 和 max_tokens，并讲清楚 time to first token 和流式输出</Zh>
          </li>
          <li>
            <En>Write a good prompt from its layers, and choose between zero-shot, few-shot, chain-of-thought, and a reasoning model</En>
            <Zh>按层次写出好的 prompt，并在 zero-shot、few-shot、chain-of-thought 和 reasoning 模型之间做选择</Zh>
          </li>
          <li>
            <En>Get validated JSON from a model with a schema, parsing, and a repair loop, and explain why a valid shape is not a correct answer</En>
            <Zh>用 schema、解析和修复循环让模型输出经过校验的 JSON，并讲清楚为什么形状有效不等于答案正确</Zh>
          </li>
          <li>
            <En>Make SDK calls with multi-turn history, streaming, image input, and error handling</En>
            <Zh>用 SDK 完成带多轮历史、流式输出、图片输入和错误处理的调用</Zh>
          </li>
          <li>
            <En>Choose a model tier by measuring it on a small test set, a mini eval</En>
            <Zh>用一个小测试集（迷你 eval）来测量并选择模型档位</Zh>
          </li>
          <li>
            <En>Decide between a better prompt, RAG, and fine-tuning for a given problem</En>
            <Zh>针对具体问题，在更好的 prompt、RAG 和 fine-tuning 之间做出选择</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/ai-training/day27-llm-prompts-sdk/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        <h3 className="part part-lg">
          <En>1. Anatomy of one LLM call</En>
          <Zh>1. 一次 LLM 调用的结构</Zh>
        </h3>

        <p>
          <En>Pain point: the model is only an API, and every field you send or read back affects cost, speed, or correctness.</En>
          <Zh>痛点：模型本质上只是一个 API，你发送或读取的每个字段，都会影响成本、速度或正确性。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>1.1 The request and the response</En>
          <Zh>1.1 请求与响应</Zh>
        </h4>
        <ApiCallAnatomy />

        <CodeBlock
          language="typescript"
          code={`const res = await client.messages.create({
  model: "claude-sonnet-5-5",
  max_tokens: 1024,
  system: "Answer only from the provided context.",
  messages: [{ role: "user", content: question }],
});
console.log(res.content);      // the answer
console.log(res.stop_reason);  // "end_turn" or "max_tokens"
console.log(res.usage);        // { input_tokens, output_tokens }`}
        />

        <ul>
          <li>
            <En>The model is stateless: every request carries the whole conversation, so your app stores and resends the history.</En>
            <Zh>模型是无状态的：每个请求都要带上完整的对话，所以由你的应用保存并重新发送历史。</Zh>
          </li>
          <li>
            <En>Always read stop_reason: max_tokens means the answer was cut off, and a cut-off JSON reply will not parse.</En>
            <Zh>一定要看 stop_reason：max_tokens 表示答案被截断了，而被截断的 JSON 无法解析。</Zh>
          </li>
          <li>
            <En>usage reports exactly what the call cost, so log it on every request.</En>
            <Zh>usage 会精确告诉你这次调用花了多少，所以每次请求都要记录它。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.2 One shared token budget</En>
          <Zh>1.2 共用的 token 预算</Zh>
        </h4>
        <ContextBudget />

        <ul>
          <li>
            <En>The system prompt, history, documents, your question, and the reply all share one context window.</En>
            <Zh>system prompt、历史、文档、你的问题和回答，共用同一个 context window。</Zh>
          </li>
          <li>
            <En>When it fills, summarize old turns, slide a window, or retrieve facts on demand.</En>
            <Zh>窗口装满时，可以总结旧对话、滑动窗口，或按需检索事实。</Zh>
          </li>
          <li>
            <En>An unchanged prefix can be cached, which makes repeat calls cheaper and faster.</En>
            <Zh>没有变化的前缀可以被缓存，让重复调用更便宜、更快。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.3 Sampling settings</En>
          <Zh>1.3 采样参数</Zh>
        </h4>
        <p>
          <En>Four settings change how the reply is generated, without changing what you asked.</En>
          <Zh>有四个参数会改变回答的生成方式，但不会改变你问的内容。</Zh>
        </p>
        <SamplingDials />

        <h5 className="topic-sub">
          <En>How temperature and top_p work</En>
          <Zh>temperature 和 top_p 是怎么工作的</Zh>
        </h5>
        <p>
          <En>The model writes one token at a time, each time picking from a list of possible next words with odds.</En>
          <Zh>模型一次写一个 token，每次都从一份带概率的候选词列表里挑一个。</Zh>
        </p>
        <TokenOdds />

        <ul>
          <li>
            <En>temperature reshapes the odds: low makes the top word win almost every time, high gives unlikely words a real chance.</En>
            <Zh>temperature 改变概率的形状：调低时最可能的词几乎每次都赢，调高时不太可能的词也有真正的机会。</Zh>
          </li>
          <li>
            <En>top_p deletes the long tail: 0.9 keeps only the top words that add up to 90%, so a strange word like “moon” can never appear.</En>
            <Zh>top_p 删掉长尾：0.9 只保留累计概率达到 90% 的前几个词，所以像 “moon” 这种奇怪的词永远不会出现。</Zh>
          </li>
          <li>
            <En>Both control randomness, so change one of them, not both, or you cannot tell which one made the difference.</En>
            <Zh>两者都控制随机性，所以只调其中一个，不要两个都调，否则你分不清是哪个起了作用。</Zh>
          </li>
        </ul>

        <h5 className="topic-sub">
          <En>Stop sequences</En>
          <Zh>Stop sequences（停止序列）</Zh>
        </h5>
        <p>
          <En>A stop sequence is text that ends the reply the moment the model writes it.</En>
          <Zh>stop sequence 是一段文本：模型一写出它，回答就立刻结束。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const res = await client.messages.create({
  model,
  max_tokens: 500,
  stop_sequences: ["4."],
  messages: [{ role: "user", content: "List movie ideas as 1. 2. 3. 4. ..." }],
});
console.log(res.stop_reason);    // "stop_sequence": it stopped before "4."
console.log(res.stop_sequence);  // "4."  → you get exactly 3 ideas`}
        />
        <ul>
          <li>
            <En>Stop at "&lt;/answer&gt;" so the model cannot keep chatting after the part you need.</En>
            <Zh>在 "&lt;/answer&gt;" 处停止，这样模型就不会在你需要的部分之后继续闲聊。</Zh>
          </li>
          <li>
            <En>The stop text itself is not included in the reply, and you pay only for what was written before it.</En>
            <Zh>停止文本本身不会出现在回答里，你也只为它之前写出的内容付费。</Zh>
          </li>
        </ul>

        <h5 className="topic-sub">
          <En>Reference: which settings for which task</En>
          <Zh>参考：什么任务用什么参数</Zh>
        </h5>
        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Task</En><Zh>任务</Zh></th>
              <th>temperature</th>
              <th>top_p</th>
              <th>max_tokens</th>
              <th><En>Why</En><Zh>原因</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr><td><En>Extract data, classify</En><Zh>提取数据、分类</Zh></td><td>0</td><td><En>default</En><Zh>默认</Zh></td><td><En>small (~300)</En><Zh>小（~300）</Zh></td><td><En>one right answer</En><Zh>只有一个正确答案</Zh></td></tr>
            <tr><td><En>Write or fix code</En><Zh>写代码、改代码</Zh></td><td>0–0.2</td><td><En>default</En><Zh>默认</Zh></td><td><En>large (~4,000)</En><Zh>大（~4,000）</Zh></td><td><En>correct beats creative</En><Zh>正确比创意重要</Zh></td></tr>
            <tr><td><En>Summarize a document</En><Zh>总结文档</Zh></td><td>0.2–0.4</td><td><En>default</En><Zh>默认</Zh></td><td><En>medium (~800)</En><Zh>中（~800）</Zh></td><td><En>faithful, still natural</En><Zh>忠实原文，读起来自然</Zh></td></tr>
            <tr><td><En>Support chatbot</En><Zh>客服聊天机器人</Zh></td><td>0.3–0.5</td><td><En>default</En><Zh>默认</Zh></td><td><En>medium (~500)</En><Zh>中（~500）</Zh></td><td><En>consistent, not robotic</En><Zh>稳定但不死板</Zh></td></tr>
            <tr><td><En>Brainstorm, marketing copy</En><Zh>头脑风暴、营销文案</Zh></td><td>0.8–1.0</td><td>0.9–0.95</td><td><En>medium</En><Zh>中</Zh></td><td><En>many different ideas</En><Zh>想要多种不同点子</Zh></td></tr>
            <tr><td><En>Stories, poems</En><Zh>故事、诗歌</Zh></td><td>1.0</td><td>0.95</td><td><En>large</En><Zh>大</Zh></td><td><En>surprise is the point</En><Zh>要的就是意外感</Zh></td></tr>
          </tbody>
        </table>
        <p className="callout">
          <En>The newest Claude models (Opus 5.5, Sonnet 5.5, Haiku 5.5) reject temperature, top_p and top_k with a 400 error, so you steer them with the prompt; the table still applies to older models and most other providers.</En>
          <Zh>最新的 Claude 模型（Opus 5.5、Sonnet 5.5、Haiku 5.5）会对 temperature、top_p 和 top_k 返回 400 错误，所以要靠 prompt 来引导它们；这张表仍适用于旧模型和大多数其他厂商。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>1.4 What a request costs</En>
          <Zh>1.4 一次请求的成本</Zh>
        </h4>
        <CostMath />

        <ul>
          <li>
            <En>Output tokens cost several times more than input tokens, so cap max_tokens and ask for short answers.</En>
            <Zh>输出 token 比输入 token 贵好几倍，所以要限制 max_tokens，并要求简短回答。</Zh>
          </li>
          <li>
            <En>A tier that is five times pricier makes the same traffic five times pricier: multiply by your real traffic before choosing.</En>
            <Zh>贵五倍的档位会让同样的流量贵五倍：选型前先乘上你的真实流量。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.5 Latency and streaming</En>
          <Zh>1.5 延迟与流式输出</Zh>
        </h4>
        <StreamingTimeline />

        <ul>
          <li>
            <En>Time to first token is what users feel; streaming makes the wait feel short.</En>
            <Zh>用户感受到的是 time to first token；流式输出让等待显得很短。</Zh>
          </li>
          <li>
            <En>Total time grows with the length of the reply, so shorter answers are also faster.</En>
            <Zh>总耗时随回答长度增长，所以更短的回答也更快。</Zh>
          </li>
        </ul>

        <p>
          <En>Try it: press “Send both” and watch when the first words appear on each side.</En>
          <Zh>试一试：点击 “Send both”，看看两边的第一个词分别什么时候出现。</Zh>
        </p>
        <StreamingDemo />

        <h3 className="part part-lg">
          <En>2. Prompting techniques</En>
          <Zh>2. Prompt 技巧</Zh>
        </h3>

        <p>
          <En>Pain point: the same model gives a great answer or a useless one depending on how you ask.</En>
          <Zh>痛点：同一个模型，因为提问方式不同，可能给出很棒或毫无用处的答案。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>2.1 What a prompt actually is</En>
          <Zh>2.1 Prompt 到底是什么</Zh>
        </h4>
        <p>
          <En>A prompt is everything you send in one request, not just the question the user typed.</En>
          <Zh>prompt 是你在一次请求里发送的全部内容，而不只是用户输入的那个问题。</Zh>
        </p>
        <PromptParts />

        <CodeBlock
          language="typescript"
          code={`await client.messages.create({
  model,
  max_tokens: 500,
  system: "You are Pageturner's support agent. Answer in 3 sentences.",
  messages: [
    {
      role: "user",
      content: "<order>PT-123456, shipped Oct 3</order>\\nWhere is my book?",
    },
  ],
});`}
        />

        <ul>
          <li>
            <En>system is written by you once: who the model is, its rules, and the output format.</En>
            <Zh>system 由你写一次：模型是谁、它的规则，以及输出格式。</Zh>
          </li>
          <li>
            <En>Context is data your app looks up and pastes in, such as the order from your database: the model cannot see your database on its own.</En>
            <Zh>context 是你的应用查出来再贴进去的数据，比如数据库里的订单：模型自己看不到你的数据库。</Zh>
          </li>
          <li>
            <En>Keep prompts in version control: a prompt is code.</En>
            <Zh>把 prompt 放进版本控制：prompt 就是代码。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.2 Zero-shot, one-shot, few-shot</En>
          <Zh>2.2 Zero-shot、one-shot、few-shot</Zh>
        </h4>
        <p>
          <En>A “shot” is one worked example you show the model before the real question.</En>
          <Zh>一个 “shot” 就是在真正提问之前，给模型看的一个示例。</Zh>
        </p>
        <ShotsCompare />

        <CodeBlock
          language="typescript"
          code={`await client.messages.create({
  model,
  max_tokens: 100,
  system: "Reply with emojis for the movie.",
  messages: [
    { role: "user", content: "Titanic" },          // example 1
    { role: "assistant", content: "🚢🧊💔" },
    { role: "user", content: "Finding Nemo" },     // example 2
    { role: "assistant", content: "🐠🔍👨‍👦" },
    { role: "user", content: "The Lion King" },    // the real question
  ],
});`}
        />

        <ul>
          <li>
            <En>An example is just a fake earlier turn: a user message, plus the answer you wish the model had given.</En>
            <Zh>示例其实就是伪造的前几轮对话：一条用户消息，加上你希望模型给出的回答。</Zh>
          </li>
          <li>
            <En>Zero-shot is fine when the format does not matter; one example fixes the format; two to five also teach the pattern and the tricky cases.</En>
            <Zh>格式无所谓时用 zero-shot 就够了；一个示例能固定格式；两到五个示例还能教会规律和棘手情况。</Zh>
          </li>
          <li>
            <En>Examples are sent on every call, so they cost input tokens every time.</En>
            <Zh>示例每次调用都会发送，所以每次都要消耗输入 token。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.3 Chain of thought and reasoning models</En>
          <Zh>2.3 Chain of thought 与 reasoning 模型</Zh>
        </h4>
        <p>
          <En>For a problem with steps, how you ask decides whether the model works it out or just guesses.</En>
          <Zh>对于需要多步的题目，提问方式决定了模型是认真推算，还是直接猜。</Zh>
        </p>
        <ThinkingOptions />

        <CodeBlock
          language="plaintext"
          bad={[1]}
          good={[2]}
          code={`Ball price? Reply with the number only.
Ball price? Think it through step by step, then give the answer on the last line.`}
        />
        <CodeBlock
          language="typescript"
          code={`await client.messages.create({
  model: "claude-opus-5-5",          // a reasoning model: thinks before it answers
  max_tokens: 2000,
  output_config: { effort: "low" },  // low | medium | high: how hard it thinks
  messages: [{ role: "user", content: question }],
});`}
        />

        <ul>
          <li>
            <En>Ask directly: the model answers in one go, so on a trick question it can blurt the intuitive answer ($0.10).</En>
            <Zh>直接问：模型一口气给出答案，所以遇到陷阱题时可能脱口说出直觉答案（$0.10）。</Zh>
          </li>
          <li>
            <En>Chain of thought: asking it to write the steps first gives each step something to build on, at the cost of more output tokens.</En>
            <Zh>chain of thought：让它先写出步骤，每一步都有前一步可依靠，代价是更多的输出 token。</Zh>
          </li>
          <li>
            <En>A reasoning model does that thinking on its own before replying, so you ask plainly and turn effort down for easy tasks.</En>
            <Zh>reasoning 模型会在回答前自己完成这种思考，所以你直接提问即可，简单任务就把 effort 调低。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.4 Improve a prompt in steps</En>
          <Zh>2.4 一步步改进 prompt</Zh>
        </h4>
        <p>
          <En>Say an online shop needs a product description for a coffee mug.</En>
          <Zh>假设一个网店需要为一款咖啡杯写商品描述。</Zh>
        </p>

        <CodeBlock language="plaintext" bad={[1]} code={`v1  Write a description for this mug.`} />
        <ul>
          <li>
            <En>Bad: the model must guess the audience, the length and the facts, so it invents some (“keeps coffee hot for 12 hours”).</En>
            <Zh>不好：模型只能猜受众、长度和事实，于是会编造一些内容（“保温 12 小时”）。</Zh>
          </li>
        </ul>

        <CodeBlock
          language="plaintext"
          good={[1, 2, 3, 4]}
          code={`v2  Write a product description for our online shop.
    Audience: coffee lovers buying a gift.
    Length: 2 sentences, friendly tone.
    Facts: 350 ml, ceramic, dishwasher safe, $18.`}
        />
        <ul>
          <li>
            <En>Better: it says who it is for and how long, and hands over the facts, so nothing is left to guess.</En>
            <Zh>更好：说明了写给谁、写多长，并给出了事实，所以没有需要猜的地方。</Zh>
          </li>
        </ul>

        <CodeBlock
          language="plaintext"
          good={[1, 2, 3, 4]}
          code={`v3  v2, plus:
    Use only the facts above. Do not invent features.
    Return only the description: no title, no quotes.
    Our style: "Mornings, upgraded. A mug that makes every cup feel like a treat."`}
        />
        <ul>
          <li>
            <En>Best: it forbids made-up features, says exactly what to return so your app can use it as is, and an example shows the shop's voice.</En>
            <Zh>最好：禁止编造功能，明确规定返回内容，让你的应用可以直接使用，还用一个示例展示了店铺的语气。</Zh>
          </li>
          <li>
            <En>Fix the biggest failure first, then re-run your test cases to confirm it helped.</En>
            <Zh>先修最大的失败点，再重新运行你的测试用例，确认它确实有帮助。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.5 Common mistakes and their fixes</En>
          <Zh>2.5 常见错误与对应的改法</Zh>
        </h4>
        <p>
          <En>Most bad answers trace back to one of these mistakes, and each one has a matching fix.</En>
          <Zh>大多数糟糕的回答，都能追溯到下面某个错误，而每个错误都有对应的改法。</Zh>
        </p>
        <PromptMistakes />

        <h3 className="part part-lg">
          <En>3. Structured output you can trust</En>
          <Zh>3. 可靠的结构化输出</Zh>
        </h3>

        <p>
          <En>Pain point: your code needs JSON, but a model is trained to write text for people.</En>
          <Zh>痛点：你的代码需要 JSON，但模型被训练成给人写文字。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>3.1 The problem: “Sure! Here is your JSON”</En>
          <Zh>3.1 问题：“Sure! Here is your JSON”</Zh>
        </h4>
        <p>
          <En>Say a calendar app turns a sentence into an event object it can save.</En>
          <Zh>假设一个日历应用要把一句话变成可以保存的事件对象。</Zh>
        </p>

        <CodeBlock
          language="typescript"
          bad={[8]}
          code={`// getText(res): the text blocks of res.content, joined into one string
const res = await client.messages.create({
  model,
  max_tokens: 500,
  system: "Turn the text into JSON with title, date, time, location.",
  messages: [{ role: "user", content: "Lunch with Sam next Friday at 1pm" }],
});
const event = JSON.parse(getText(res));  // SyntaxError: Unexpected token 'S'`}
        />

        <p>
          <En>Try both sides: the JSON.parse on the left really runs and really fails.</En>
          <Zh>两边都试一下：左边的 JSON.parse 是真的在运行，也是真的失败了。</Zh>
        </p>
        <JsonDemo />

        <ul>
          <li>
            <En>The model adds what a person would like: a friendly intro, a ```json fence, a closing line.</En>
            <Zh>模型会加上人类喜欢的东西：友好的开场白、```json 代码块、结尾的客套话。</Zh>
          </li>
          <li>
            <En>It can also rename keys or change formats from call to call: "time": "1 PM" one time, "13:00" the next.</En>
            <Zh>它还可能每次改键名或格式：这次是 "time": "1 PM"，下次是 "13:00"。</Zh>
          </li>
          <li>
            <En>“Usually fine” is not enough: one bad reply crashes the code that uses it.</En>
            <Zh>“通常没问题” 是不够的：一次坏回答就会让使用它的代码崩溃。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.2 Fix 1: a precise prompt with an example</En>
          <Zh>3.2 改法一：精确的 prompt 加一个示例</Zh>
        </h4>
        <p>
          <En>First, say exactly what to return and show one example of it.</En>
          <Zh>首先，明确说出要返回什么，并给出一个示例。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const system = \`Turn the text into a calendar event.
Reply with ONLY a JSON object: no other text, no code fence.
Example:
{"title": "Dentist", "date": "2026-11-02", "time": "09:30", "location": "Clinic"}\`;`}
        />
        <ul>
          <li>
            <En>The example fixes the keys and the formats, such as 24-hour time, so good JSON becomes far more likely.</En>
            <Zh>示例固定了键名和格式（比如 24 小时制），所以得到正确 JSON 的可能性大大提高。</Zh>
          </li>
          <li>
            <En>But “more likely” is still not “always”: the reply is still free text that happens to look like JSON.</En>
            <Zh>但 “更可能” 仍然不是 “一定”：回答依然是自由文本，只是碰巧长得像 JSON。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.3 Fix 2: structured output</En>
          <Zh>3.3 改法二：结构化输出</Zh>
        </h4>
        <p>
          <En>Give the API a JSON Schema, and the reply is guaranteed to be valid JSON in exactly that shape.</En>
          <Zh>给 API 一个 JSON Schema，回答就保证是完全符合这个结构的有效 JSON。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const eventSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    date: { type: "string", description: "YYYY-MM-DD" },
    time: { type: "string", description: "24-hour HH:MM" },
    location: { type: "string" },
  },
  required: ["title", "date", "time", "location"],
  additionalProperties: false,
};`}
        />
        <CodeBlock
          language="typescript"
          good={[7]}
          code={`const res = await client.messages.create({
  model,
  max_tokens: 500,
  messages: [{ role: "user", content: text }],
  output_config: { format: { type: "json_schema", schema: eventSchema } },
});
const event = JSON.parse(getText(res));  // safe: always valid JSON`}
        />
        <ul>
          <li>
            <En>The schema guarantees the keys and the types, so JSON.parse can no longer fail.</En>
            <Zh>schema 保证了键名和类型，所以 JSON.parse 不会再失败。</Zh>
          </li>
          <li>
            <En>It does not guarantee the values make sense: "date": "2026-02-30" is still a valid string.</En>
            <Zh>它不保证值是合理的："date": "2026-02-30" 依然是一个有效的字符串。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.4 Fix 3: validate with Zod, then retry</En>
          <Zh>3.4 改法三：用 Zod 校验，再重试</Zh>
        </h4>
        <p>
          <En>Treat the reply like any user input: check the values before the rest of your code sees them.</En>
          <Zh>像对待任何用户输入一样对待回答：在其余代码使用它之前，先检查它的值。</Zh>
        </p>
        <CodeBlock
          language="typescript"
          code={`const Event = z.object({
  title: z.string().min(1),
  date: z.iso.date(),                       // a real date: no Feb 30
  time: z.string().regex(/^\\d{2}:\\d{2}$/),  // "13:00", not "1 PM"
  location: z.string(),
});
const result = Event.safeParse(JSON.parse(text));`}
        />
        <RepairLoop />
        <CodeBlock
          language="typescript"
          code={`for (let attempt = 1; attempt <= 3; attempt++) {
  const text = getText(await client.messages.create({ ...params, messages }));
  const result = Event.safeParse(JSON.parse(text));
  if (result.success) return result.data;
  messages.push({ role: "assistant", content: text });
  messages.push({ role: "user", content: "Invalid: " + result.error.message });
}
throw new Error("Could not get a valid event: ask a human");`}
        />
        <ul>
          <li>
            <En>Feeding the error back usually fixes it in one retry, because the model now sees exactly what was wrong.</En>
            <Zh>把错误反馈回去，通常重试一次就能修好，因为模型现在能看到具体哪里错了。</Zh>
          </li>
          <li>
            <En>Never loop forever: after two or three tries, hand it to a human or a fallback.</En>
            <Zh>绝不要无限循环：试两三次之后，就交给人工或备用方案。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.5 A correct shape is not a correct answer</En>
          <Zh>3.5 形状正确不等于答案正确</Zh>
        </h4>
        <ShapeVsTruth />

        <ul>
          <li>
            <En>Valid JSON can still hold the wrong answer: a schema catches shape, only evals catch truth.</En>
            <Zh>有效的 JSON 里仍可能是错误答案：schema 只能发现形状问题，只有 evals 才能发现答案是否正确。</Zh>
          </li>
          <li>
            <En>Check stop_reason too: a reply cut off by max_tokens is invalid JSON.</En>
            <Zh>也要检查 stop_reason：被 max_tokens 截断的回复不是有效 JSON。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.6 Putting the fixes together</En>
          <Zh>3.6 把这些改法组合起来</Zh>
        </h4>
        <ReliabilityLadder />

        <h3 className="part part-lg">
          <En>4. The SDK in practice</En>
          <Zh>4. SDK 实战</Zh>
        </h3>

        <p>
          <En>Pain point: the docs show one call, but a real feature needs history, streaming, images, and error handling.</En>
          <Zh>痛点：文档里只展示一次调用，但真实功能还需要历史、流式输出、图片和错误处理。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>4.1 Setting up the client</En>
          <Zh>4.1 创建 client</Zh>
        </h4>
        <CodeBlock
          language="typescript"
          code={`import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();  // reads ANTHROPIC_API_KEY from the environment`}
        />

        <ul>
          <li>
            <En>Keep the key in an environment variable: never in source code and never in the browser.</En>
            <Zh>把密钥放在环境变量里：绝不要写进源码，也绝不要放到浏览器里。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>4.2 Multi-turn history</En>
          <Zh>4.2 多轮对话历史</Zh>
        </h4>
        <p>
          <En>The model remembers nothing between calls, so every call resends the whole conversation so far.</En>
          <Zh>模型在两次调用之间什么都不记得，所以每次调用都要重新发送到目前为止的完整对话。</Zh>
        </p>
        <HistoryGrowth />

        <CodeBlock
          language="typescript"
          code={`const history: Anthropic.MessageParam[] = [];

async function chat(userText: string) {
  history.push({ role: "user", content: userText });         // 1. add the question
  const res = await client.messages.create({
    model,
    max_tokens: 500,
    messages: history,                                       // the WHOLE history
  });
  const reply = getText(res);
  history.push({ role: "assistant", content: reply });       // 2. add the answer
  return reply;
}

await chat("Hi, I'm Felix.");
await chat("What's my name?");  // works only because call 2 resent call 1`}
        />

        <ul>
          <li>
            <En>Forget to push the reply and the model loses its own last answer; send only the newest message and it forgets everything.</En>
            <Zh>忘了把回答 push 进去，模型就丢掉了自己上一句；只发最新一条消息，它就全忘了。</Zh>
          </li>
          <li>
            <En>Input tokens grow with every turn, so long chats get slower and pricier: trim or summarize old turns.</En>
            <Zh>输入 token 每轮都在增长，所以长对话会变慢、变贵：要裁剪或总结旧的对话。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>4.3 Streaming to the browser</En>
          <Zh>4.3 流式输出到浏览器</Zh>
        </h4>
        <StreamToBrowser />

        <CodeBlock
          language="typescript"
          code={`client.messages
  .stream({ model, max_tokens: 500, messages })
  .on("text", (t) => process.stdout.write(t));   // tokens as they arrive`}
        />

        <ul>
          <li>
            <En>Stream the reply so users see the first words quickly, and let them cancel.</En>
            <Zh>使用流式输出，让用户尽快看到最初的几个词，并允许取消。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>4.4 Image input</En>
          <Zh>4.4 图片输入</Zh>
        </h4>

        <CodeBlock
          language="typescript"
          code={`messages: [{
  role: "user",
  content: [
    { type: "image", source: { type: "base64", media_type: "image/png", data } },
    { type: "text", text: "What error is shown in this screenshot?" },
  ],
}]`}
        />

        <ul>
          <li>
            <En>Resize images before sending: they cost tokens by size.</En>
            <Zh>图片发送前先缩小：它们按尺寸消耗 token。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>4.5 Errors and retries</En>
          <Zh>4.5 错误与重试</Zh>
        </h4>
        <ErrorMap />

        <CodeBlock
          language="typescript"
          code={`try {
  return await client.messages.create(params);
} catch (err) {
  if (err instanceof Anthropic.APIError && err.status === 429) {
    // wait, then retry with a growing delay
  }
  throw err;
}`}
        />

        <ul>
          <li>
            <En>Retry rate limits and server errors later; fix a 400 request rather than retrying it.</En>
            <Zh>遇到限流和服务器错误稍后重试；400 请求要修正而不是重试。</Zh>
          </li>
          <li>
            <En>Set a timeout, and log usage and errors on every call.</En>
            <Zh>设置超时，并在每次调用时记录 usage 和错误。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>5. Choosing a model</En>
          <Zh>5. 选择模型</Zh>
        </h3>

        <p>
          <En>Pain point: the biggest model is slow and expensive, and the smallest is not always good enough.</En>
          <Zh>痛点：最大的模型又慢又贵，而最小的模型又不一定够用。</Zh>
        </p>

        <ModelChoice />

        <ul>
          <li>
            <En>Treat model choice as a measurement: run your test cases on a smaller tier before you settle on a bigger one.</En>
            <Zh>把选模型当作一次测量：在确定用更大的档位之前，先用更小的档位跑一遍你的测试用例。</Zh>
          </li>
          <li>
            <En>A reasoning model helps with hard logic, but it costs more and takes longer.</En>
            <Zh>reasoning 模型擅长困难的逻辑，但更贵、更慢。</Zh>
          </li>
          <li>
            <En>Keep the model name in one config value, so switching tiers is a one-line change.</En>
            <Zh>把模型名称放在一个配置值里，这样切换档位只需改一行。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>6. Evals: measuring instead of guessing</En>
          <Zh>6. Evals：用测量代替猜测</Zh>
        </h3>

        <p>
          <En>Pain point: you changed the prompt and it feels better, but you cannot say whether it is better.</En>
          <Zh>痛点：你改了 prompt，感觉变好了，但说不出到底有没有变好。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>6.1 A classifier eval: code checks the answer</En>
          <Zh>6.1 分类器 eval：用代码检查答案</Zh>
        </h4>
        <p>
          <En>When every input has one right answer, a plain loop can score the prompt.</En>
          <Zh>当每个输入都只有一个正确答案时，一个简单的循环就能给 prompt 打分。</Zh>
        </p>
        <EvalLoop />

        <CodeBlock
          language="typescript"
          code={`const cases = [
  { text: "I was charged twice", expected: "billing" },
  { text: "App crashes on login", expected: "bug" },
  // ... about 10 in total
];
let correct = 0;
for (const c of cases) {
  const out = await classify(c.text);
  if (out.category === c.expected) correct++;
}
console.log(correct + "/" + cases.length + " correct");`}
        />

        <ul>
          <li>
            <En>Change one thing between runs, so you know what moved the score.</En>
            <Zh>每两次运行之间只改一处，这样才知道是什么改变了分数。</Zh>
          </li>
          <li>
            <En>Replies vary a little between runs, so a one-point change on ten cases may be noise: run twice before you trust it.</En>
            <Zh>每次运行的回答都会有些许不同，所以十个用例上相差一分可能只是噪声：先跑两遍再相信它。</Zh>
          </li>
          <li>
            <En>Ten cases is a start; real teams grow the set every time they find a failure.</En>
            <Zh>十个用例只是起步；真实团队每发现一个失败就会往集合里补充用例。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.2 A prompt eval: a grader model checks the answer</En>
          <Zh>6.2 Prompt eval：用评分模型检查答案</Zh>
        </h4>
        <p>
          <En>A support bot's reply has no single right answer, so a second model grades each reply against criteria you write.</En>
          <Zh>客服机器人的回答没有唯一正确答案，所以由第二个模型按照你写的标准给每个回答打分。</Zh>
        </p>
        <GraderEval />

        <CodeBlock
          language="typescript"
          code={`const tests = [
  { input: "My book never arrived!", criteria: "apologises, asks for the order number" },
  { input: "Refund me right now", criteria: "does not promise a refund" },
];
for (const t of tests) {
  const reply = await askBot(SYSTEM_PROMPT, t.input);  // the prompt under test
  const grade = await askGrader(t.input, reply, t.criteria);  // { score, reason }
  console.log(grade.score, grade.reason);
}`}
        />

        <ul>
          <li>
            <En>Code cannot compare free text to an answer key: one good reply can be worded a hundred ways.</En>
            <Zh>代码无法把自由文本和标准答案对比：一个好的回答可以有一百种说法。</Zh>
          </li>
          <li>
            <En>Give the grader a rubric (1 to 5, what each score means) and ask for a score plus a reason, using structured output.</En>
            <Zh>给评分模型一份评分标准（1 到 5 分，每个分数代表什么），并用结构化输出让它给出分数和理由。</Zh>
          </li>
          <li>
            <En>The grader can be wrong too: read some of its reasons yourself before you trust the scores.</En>
            <Zh>评分模型也可能出错：在相信分数之前，自己读一读它给出的部分理由。</Zh>
          </li>
        </ul>
        <p className="callout">
          <En>A model can also write the test cases for you, but a person should review them: a wrong label teaches you the wrong lesson.</En>
          <Zh>测试用例也可以让模型来生成，但必须有人审核：错误的标签会让你得出错误的结论。</Zh>
        </p>

        <h3 className="part part-lg">
          <En>7. Prompt, RAG, or fine-tune?</En>
          <Zh>7. 用 prompt、RAG 还是 fine-tune？</Zh>
        </h3>

        <p>
          <En>Pain point: when the answer is wrong, it is tempting to reach for the heaviest fix first.</En>
          <Zh>痛点：答案不对时，人们总想先用最重的办法。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>7.1 What RAG is</En>
          <Zh>7.1 RAG 是什么</Zh>
        </h4>
        <p>
          <En>RAG (retrieval-augmented generation) means: search your own documents first, then paste the best matches into the prompt.</En>
          <Zh>RAG（retrieval-augmented generation，检索增强生成）就是：先搜索你自己的文档，再把最相关的内容贴进 prompt。</Zh>
        </p>
        <RagFlow />

        <ul>
          <li>
            <En>The model only knows its training data, which is old and never included your company's documents.</En>
            <Zh>模型只知道它的训练数据，而这些数据是旧的，也从来不包含你公司的文档。</Zh>
          </li>
          <li>
            <En>RAG is the “context” part of a prompt, done automatically: your app finds the right facts for each question.</En>
            <Zh>RAG 就是自动完成 prompt 里的 “context” 部分：你的应用为每个问题找到合适的事实。</Zh>
          </li>
          <li>
            <En>Fine-tuning is different: you train the model further on hundreds of examples so its default behavior changes.</En>
            <Zh>fine-tuning 则不同：用几百个示例继续训练模型，改变它的默认行为。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>7.2 Which one to reach for</En>
          <Zh>7.2 该用哪一个</Zh>
        </h4>
        <PromptRagFinetune />

        <ul>
          <li>
            <En>Move down the list only when the symptom is what you actually see.</En>
            <Zh>只有当症状真的出现时，才往下一级走。</Zh>
          </li>
          <li>
            <En>A wrong fact is a retrieval problem; a wrong style is a prompt or tuning problem.</En>
            <Zh>事实不对是检索问题；风格不对是 prompt 或微调问题。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>8. Reference: vocabulary</En>
          <Zh>8. 参考：术语表</Zh>
        </h3>

        <table className="ref-table">
          <thead>
            <tr>
              <th><En>Term</En><Zh>术语</Zh></th>
              <th><En>One line</En><Zh>一句话</Zh></th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Token</td><td><En>A chunk of text the model reads and writes; the unit of billing</En><Zh>模型读写的文本片段；计费单位</Zh></td></tr>
            <tr><td>Context window</td><td><En>The most tokens a model can handle in one call</En><Zh>模型一次调用能处理的最大 token 数</Zh></td></tr>
            <tr><td>Inference</td><td><En>Running a trained model to get an answer</En><Zh>用训练好的模型生成答案</Zh></td></tr>
            <tr><td>Hallucination</td><td><En>A fluent answer that is not true</En><Zh>流畅但不真实的回答</Zh></td></tr>
            <tr><td>Temperature</td><td><En>How random the next-token choice is</En><Zh>选择下一个 token 时的随机程度</Zh></td></tr>
            <tr><td>top_p</td><td><En>Pick only from the likeliest tokens that add up to p</En><Zh>只从累计概率达到 p 的最可能 token 中选择</Zh></td></tr>
            <tr><td>Stop sequence</td><td><En>Text that ends the reply as soon as it is written</En><Zh>一旦写出就结束回答的文本</Zh></td></tr>
            <tr><td>Time to first token</td><td><En>How long until the answer starts streaming</En><Zh>答案开始流式输出前的等待时间</Zh></td></tr>
            <tr><td>Few-shot</td><td><En>Example input and output pairs placed in the prompt</En><Zh>放在 prompt 里的输入输出示例对</Zh></td></tr>
            <tr><td>Chain of thought</td><td><En>Asking the model to write its steps before the answer</En><Zh>让模型在给出答案前先写出步骤</Zh></td></tr>
            <tr><td>Structured output</td><td><En>A model answer constrained to a schema, such as JSON</En><Zh>被约束在某个 schema（如 JSON）内的模型输出</Zh></td></tr>
            <tr><td>Stop reason</td><td><En>Why generation ended: it finished, hit max_tokens, or hit a stop sequence</En><Zh>生成为什么结束：正常完成、达到 max_tokens，或遇到 stop sequence</Zh></td></tr>
            <tr><td>Eval</td><td><En>A set of test cases and a score for your prompt</En><Zh>一组测试用例，以及针对 prompt 的评分</Zh></td></tr>
            <tr><td>Grader model</td><td><En>A model that scores another model's replies against a rubric</En><Zh>按评分标准给另一个模型的回答打分的模型</Zh></td></tr>
            <tr><td>RAG</td><td><En>Search your documents, then put the matches in the prompt</En><Zh>先搜索你的文档，再把匹配内容放进 prompt</Zh></td></tr>
          </tbody>
        </table>

        <p className="callout">
          <En>The model only knows what it was trained on. How do you give it your own documents?</En>
          <Zh>模型只知道它训练时见过的内容。怎样才能让它读到你自己的文档？</Zh>
        </p>
      </section>
    </div>
  );
}
