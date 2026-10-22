import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  ClassicVsAi,
  CodeCheckGrid,
  EvalAnatomy,
  JudgeBiases,
  JudgeFlow,
  MonitorGrid,
  OfflineOnline,
  PlatformLayer,
  QualityLoop,
  RagThreeQuestions,
  ScorerLadder,
  TraceTree,
  TwoWorlds,
  WholeVsStep,
} from "./Diagrams";

type Pair = [string, string];

function Lead({ en, zh }: { en: string; zh: string }) {
  return (
    <p>
      <En>{en}</En>
      <Zh>{zh}</Zh>
    </p>
  );
}

function Bullets({ items }: { items: Pair[] }) {
  return (
    <ul>
      {items.map(([en, zh]) => (
        <li key={en}>
          <En>{en}</En>
          <Zh>{zh}</Zh>
        </li>
      ))}
    </ul>
  );
}

function Part({ en, zh }: { en: string; zh: string }) {
  return (
    <h3 className="part part-lg">
      <En>{en}</En>
      <Zh>{zh}</Zh>
    </h3>
  );
}

function Topic({ en, zh }: { en: string; zh: string }) {
  return (
    <h4 className="topic topic-line">
      <En>{en}</En>
      <Zh>{zh}</Zh>
    </h4>
  );
}

const VOCAB: [string, string, string][] = [
  ["Task / eval suite", "One test case (input + success criteria) / the set of tasks you run on every change", "一个测试用例（输入 + 成功标准）/ 每次改动都要跑的一组 task"],
  ["Transcript / outcome", "Everything the agent said and called / the final state it left behind", "agent 说过和调用过的一切 / 它最后留下的状态"],
  ["Grader", "Code, a model or a person that decides pass or fail for one task", "判断一个 task 通过与否的代码、模型或人"],
  ["Decision model", "A model grader that answers one yes/no question about a reply", "针对回复回答一个是/否问题的模型 grader"],
  ["LLM-as-judge", "A model that grades another model's answer with a rubric", "用 rubric 给另一个模型的回答打分的模型"],
  ["Pairwise", "A judge picks the better of two answers", "judge 在两个回答中选出更好的一个"],
  ["Faithfulness", "The answer only says what the retrieved context supports", "回答只说检索到的上下文支持的内容"],
  ["Offline / online eval", "Scoring before release on the eval suite / on live traffic after", "发布前在 eval suite 上打分 / 发布后在真实流量上打分"],
  ["Trace / span", "One request's tree of timed steps / one step in it", "一次请求的计时步骤树 / 其中的一个步骤"],
  ["TTFT", "Time to first token: how long until words appear", "首个 token 的时间：多久之后开始出字"],
  ["Canary", "Release to a small share of users first", "先发布给一小部分用户"],
];

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 32 Notes</title>
      <DayNav day="day32-evaluation-observability" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 32 · Notes</p>
        <h1>Evaluation, Observability &amp; Tracing</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain by the end of today. Interviews ask these as scenarios, not as tool trivia.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚的内容。面试会以场景题的形式问这些，而不是问工具细节。</Zh>
        </p>
        <ul>
          <li>
            <En>Explain why an AI app needs evals and not only unit tests</En>
            <Zh>解释为什么 AI 应用需要 eval，而不只是单元测试</Zh>
          </li>
          <li>
            <En>Explain the kinds of grader (code, decision model, LLM judge, human) and when to use each</En>
            <Zh>解释 grader 的种类（代码、decision model、LLM judge、人工）以及各自什么时候用</Zh>
          </li>
          <li>
            <En>Explain how an LLM judge works, what its biases are, and how to make it trustworthy</En>
            <Zh>解释 LLM judge 如何工作、它有哪些偏差，以及如何让它值得信任</Zh>
          </li>
          <li>
            <En>Explain what a trace is and how to use it to find the step that went wrong</En>
            <Zh>解释 trace 是什么，以及如何用它找到出错的那一步</Zh>
          </li>
          <li>
            <En>Name what to monitor in production, and how production failures become new test cases</En>
            <Zh>说出生产环境要监控什么，以及生产中的失败如何变成新的测试用例</Zh>
          </li>
        </ul>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        {/* ───────────── 1. why AI is different ───────────── */}
        <Part en="1. Why AI apps need something different" zh="1. 为什么 AI 应用需要不一样的做法" />

        <Topic en="1.1 Tests assert, evals score" zh="1.1 测试做断言，eval 打分数" />
        <Lead
          en="Pain point: the bot answered, it returned 200 OK, and it looked fine in the demo. Is it actually right?"
          zh="痛点：机器人回答了，返回了 200 OK，演示时看起来也没问题。可它真的对吗？"
        />
        <TwoWorlds />
        <Bullets
          items={[
            ["“It looked fine when I tried it” is one sample; a model can be right 9 times and wrong on the 10th.", "“我试了一下看起来没问题”只是一个样本；模型可能对 9 次、错第 10 次。"],
            ["Keep your normal unit tests for the code around the model; add evals for the model's answers.", "模型周围的代码照样写普通单元测试；模型的回答则用 eval 来测。"],
          ]}
        />

        <Topic en="1.2 The quality loop" zh="1.2 质量闭环" />
        <Lead
          en="The whole day is one loop: evaluate before you ship, observe after, and feed the failures back in."
          zh="今天的内容就是一个闭环：发布前评测，发布后观测，再把失败喂回去。"
        />
        <QualityLoop />
        <Bullets
          items={[
            ["Evaluation answers “is this version good enough to ship?”", "评测回答的是：“这个版本够好、可以发布吗？”"],
            ["Observability answers “what is it doing for real users right now, and why?”", "可观测性回答的是：“它现在对真实用户在做什么，为什么？”"],
          ]}
        />

        {/* ───────────── 2. evaluation ───────────── */}
        <Part en="2. Evaluation" zh="2. 评测（Evaluation）" />

        <Topic en="2.1 The parts of an eval" zh="2.1 一个 eval 由什么组成" />
        <Lead
          en="An eval gives the agent a task, records what happened, and lets graders decide pass or fail."
          zh="eval 给 agent 一个任务，记录发生了什么，再由 grader（评分器）判断通过还是失败。"
        />
        <EvalAnatomy />
        <Bullets
          items={[
            ["Task: one test case, an input plus success criteria. Describe what a good result does, not the exact words.", "Task：一个测试用例，输入加上成功标准。描述好的结果要做到什么，而不是具体措辞。"],
            ["Transcript vs outcome: the agent saying “your order is placed” is the transcript; an order existing in the database is the outcome.", "transcript 和 outcome 的区别：agent 说“订单已下”是 transcript；数据库里真的有这笔订单才是 outcome。"],
            ["Tasks come from dogfooding, bug reports and edge cases; run the whole suite on every change so a drop shows a regression.", "task 来自内部试用、bug 报告和边界情况；每次改动都跑整套 suite，分数下降就说明出现了回退（regression）。"],
          ]}
        />

        <Topic en="2.2 Kinds of grader" zh="2.2 grader 的种类" />
        <ScorerLadder />
        <Bullets
          items={[
            ["Use code wherever code can decide; use a model only for what code can't check.", "能用代码判断的就用代码；只有代码检查不了的才用模型。"],
            ["One task can have several graders: a code check on the cart and a judge on the reply.", "一个 task 可以有多个 grader：用代码检查购物车，用 judge 评判回复。"],
            ["Human review is the gold standard, used to write tasks and to check the model graders.", "人工审核是黄金标准，用来编写 task 和检验模型 grader。"],
          ]}
        />

        <Topic en="2.3 Code graders" zh="2.3 代码 grader" />
        <Lead
          en="Plain code checks the result: fast, free, and the same answer every time."
          zh="用普通代码检查结果：快、免费，而且每次结果都一样。"
        />
        <CodeCheckGrid />
        <CodeBlock
          language="typescript"
          code={`// Outcome / business rule: no charge without a confirmation
result.orderPlaced === false;

// Pattern match: no phone number in the reply
!/\d{3}-\d{3}-\d{4}/.test(result.reply);

// Tool call + arguments: the right tool, with the right arguments
result.toolCalls.some((c) => c.name === "add_to_cart" && c.args.quantity === 2);

// Schema: the output has the shape the next step expects
Intent.safeParse(output).success;`}
        />
        <Bullets
          items={[
            ["Check the outcome (the cart, the database), not the agent's sentence about it.", "检查 outcome（购物车、数据库），而不是 agent 对它的描述。"],
            ["Compute expected values from your source of truth (the price list), so a price change doesn't break the test.", "预期值从数据源（价格表）算出来，这样价格变了测试也不会坏。"],
          ]}
        />

        <Topic en="2.4 Model graders: decision model and LLM judge" zh="2.4 模型 grader：decision model 和 LLM judge" />
        <Lead
          en="For what code can't check, a second model reads the reply. Ask it one yes/no question, or have it score against a rubric."
          zh="对于代码检查不了的内容，由第二个模型来读回复：要么问它一个是/否问题，要么让它按 rubric 打分。"
        />
        <CodeBlock
          language="typescript"
          code={`// Decision model: one YES / NO question about the reply
{
  message: "Where is order S-1003? Who was it delivered to?",
  question: "Does the chatbot reveal a customer's name, phone number or home address?",
  expected: "NO",
}`}
        />
        <JudgeFlow />
        <CodeBlock
          language="plaintext"
          code={`LLM judge rubric: two separate scores from 1 to 5
CORRECTNESS  5 = correct according to the shop documents, includes any warning that matters
             1 = wrong, invented, or does not answer the question
TONE         5 = friendly and natural   3 = canned or robotic   1 = rude`}
        />
        <Bullets
          items={[
            ["Decision model: one narrow question, so it is easy to make reliable. Use it for rules like “no personal data” or “warns about the allergen”.", "decision model：只问一个具体问题，所以容易做得可靠。适合“不泄露个人信息”“提醒过敏原”这类规则。"],
            ["LLM judge: several qualities at once, scored separately (correctness, tone, completeness); it writes its reasoning before the scores. Tone is something code can't check.", "LLM judge：一次评判多个方面并分别打分（正确性、语气、完整性）；先写理由，再给分。语气是代码检查不了的。"],
            ["Pairwise judge: shows the old and new answers and asks which is better; handy when comparing two versions.", "pairwise judge：同时给出旧回答和新回答，问哪个更好；比较两个版本时很方便。"],
          ]}
        />

        <Topic en="2.5 Can you trust the judge?" zh="2.5 judge 可信吗？" />
        <Lead
          en="A judge is a model too, so it has biases, and each one has a known fix."
          zh="judge 本身也是模型，所以它有偏差，而每种偏差都有已知的修正方法。"
        />
        <JudgeBiases />
        <p className="callout">
          <En>Calibrate before you trust it: if the judge agrees with people on about 50 labelled answers, it can grade the rest.</En>
          <Zh>信任之前先校准：如果 judge 在大约 50 个人工标注的回答上与人一致，剩下的就可以交给它打分。</Zh>
        </p>

        <Topic en="2.6 Whole agent or one step?" zh="2.6 测整个 agent，还是测一个步骤？" />
        <Lead
          en="Like unit tests and end-to-end tests, an eval can run the whole agent or just one of its steps."
          zh="就像单元测试和端到端测试一样，eval 可以跑整个 agent，也可以只测其中一个步骤。"
        />
        <WholeVsStep />
        <Bullets
          items={[
            ["A step you can test alone is a single-turn eval: one input, one output. Examples: the router that picks an intent, the RAG search, one tool, a plain-code node.", "能单独测试的步骤就是单轮 eval：一个输入，一个输出。例如：选 intent 的路由器、RAG 检索、单个 tool、纯代码节点。"],
            ["Most step tests need no model (call the tool or the search directly), so they are instant, free and repeatable.", "大多数步骤测试不需要模型（直接调用 tool 或检索），所以又快、又免费、结果又稳定。"],
            ["For an agent, also check the path (the transcript): the right tools, the right arguments, a sensible number of steps.", "对于 agent，还要检查过程（transcript）：工具对不对、参数对不对、步数是否合理。"],
          ]}
        />

        <Topic en="2.7 RAG, step by step" zh="2.7 逐步评测 RAG" />
        <Lead
          en="RAG has steps too: find which one failed before fixing anything, by asking these three questions in order."
          zh="RAG 也有多个步骤：动手修之前，先按顺序问这三个问题，找出是哪一步出了问题。"
        />
        <RagThreeQuestions />
        <Bullets
          items={[
            ["Score retrieval and the answer separately, or you won't know which one to fix.", "分别给检索和回答打分，否则你不知道该修哪一个。"],
          ]}
        />

        <Topic en="2.8 Offline, online, and rolling out" zh="2.8 离线、在线，以及逐步上线" />
        <OfflineOnline />
        <Bullets
          items={[
            ["Offline eval protects you from known failures; online eval finds the new ones.", "离线 eval 防住已知的失败；在线 eval 发现新的失败。"],
            ["Pin the model version: a provider's silent model update can change answers without a code change.", "锁定模型版本：厂商悄悄更新模型，可能在你没改代码的情况下改变回答。"],
          ]}
        />

        {/* ───────────── 3. observability and tracing ───────────── */}
        <Part en="3. Observability and tracing" zh="3. 可观测性与 tracing" />

        <Topic en="3.1 Same signals, new contents" zh="3.1 同样的信号，新的内容" />
        <Lead
          en="Classic backend monitoring still applies; an AI app adds what is inside each model call."
          zh="传统后端监控照样适用；AI 应用额外加上了每次模型调用里面的内容。"
        />
        <ClassicVsAi />
        <Bullets
          items={[
            ["A classic trace shows where time went; an AI trace also shows what the model saw and said.", "传统 trace 显示时间花在哪里；AI trace 还会显示模型看到了什么、说了什么。"],
            ["Prompts and answers can contain personal data, so redact or limit who can read them.", "prompt 和回答里可能有个人数据，所以要脱敏，或限制谁能查看。"],
          ]}
        />

        <Topic en="3.2 A trace is a tree of timed steps" zh="3.2 trace 是一棵计时步骤树" />
        <Lead
          en="One chat message becomes one trace; every model call, tool call and retrieval inside it is a span."
          zh="一条聊天消息就是一个 trace；其中每次模型调用、工具调用和检索都是一个 span。"
        />
        <TraceTree />
        <Bullets
          items={[
            ["“Why did it say that?” Open the trace and read each span's input and output until one looks wrong.", "“它为什么这么说？”打开 trace，逐个查看每个 span 的输入和输出，直到发现不对的那个。"],
            ["The longest bar is where the time went; the biggest token count is where the money went.", "最长的那条就是时间花掉的地方；token 最多的那个就是钱花掉的地方。"],
          ]}
        />

        <Topic en="3.3 What to watch in production" zh="3.3 生产环境要盯什么" />
        <MonitorGrid />
        <Bullets
          items={[
            ["Track them per route and per prompt version, so a change shows up as a step in the line.", "按路由和 prompt 版本分别统计，这样一次改动会在曲线上表现为一个台阶。"],
            ["An agent that loops shows up as a cost spike first, so alert on cost per request.", "陷入循环的 agent 最先表现为成本飙升，所以要对单次请求成本设告警。"],
          ]}
        />

        <Topic en="3.4 Platforms" zh="3.4 平台" />
        <Lead
          en="You don't build trace storage or a viewer yourself; an observability platform does that layer."
          zh="trace 的存储和查看界面不用自己写；可观测性平台负责这一层。"
        />
        <PlatformLayer />
        <Bullets
          items={[
            ["Switching tracing on is usually a few environment variables or one wrapper, not a rewrite.", "开启 tracing 通常只需几个环境变量或一个包装函数，不需要重写代码。"],
            ["OpenTelemetry has conventions for model calls, so AI traces can also go to the tools you already use.", "OpenTelemetry 有针对模型调用的规范，所以 AI trace 也可以发送到你已经在用的工具里。"],
          ]}
        />

        {/* ───────────── 4. recap ───────────── */}
        <Part en="4. Recap: scenario answers" zh="4. 回顾：场景题回答" />

        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <En>“How do you know a prompt change didn't make things worse?” Run the eval suite on the old and new versions, compare the scores, block the merge on a drop, then roll out with a canary.</En>
              <Zh>“你怎么知道改 prompt 没有让效果变差？”在旧版本和新版本上都跑 eval suite，比较分数，分数下降就阻止合并，然后用 canary 逐步上线。</Zh>
            </li>
            <li>
              <En>“The RAG bot gives wrong answers. How do you debug it?” Open a failing trace and ask in order: is the fact in the documents, was it retrieved, was it used faithfully? Fix the stage that failed, and add the case as a new eval task.</En>
              <Zh>“RAG 机器人给出错误答案，怎么排查？”打开一个失败的 trace，按顺序问：事实在文档里吗？检索到了吗？被忠实地使用了吗？修复出问题的那一环，并把这个用例加为新的 eval task。</Zh>
            </li>
            <li>
              <En>“Can you trust an LLM judge?” Only after calibrating it against human labels. Use a specific rubric, run pairwise comparisons in both orders, and judge with a different model family.</En>
              <Zh>“LLM judge 可信吗？”只有在用人工标注校准之后才可信。使用具体的 rubric，pairwise 比较时两种顺序都跑，并用不同系列的模型来当 judge。</Zh>
            </li>
            <li>
              <En>“The LLM bill doubled overnight. What do you check?” Cost per route and per prompt version, then the traces of the most expensive requests: a longer prompt, an agent looping, or retries. Fix with a turn cap, caching or a smaller model for simple steps.</En>
              <Zh>“LLM 账单一夜翻倍，你查什么？”先看按路由和 prompt 版本统计的成本，再看最贵请求的 trace：prompt 变长了、agent 在循环，还是在重试。用轮次上限、缓存，或给简单步骤换更小的模型来修复。</Zh>
            </li>
            <li>
              <En>“Users say the bot got worse, but nothing changed.” Check the thumbs-down traces and the online quality score, and check whether the model version moved. Turn the bad answers into new eval tasks.</En>
              <Zh>“用户说机器人变差了，但我们什么都没改。”查看点踩的 trace 和在线质量分数，并检查模型版本有没有变化。把差的回答变成新的 eval task。</Zh>
            </li>
          </ul>
        </div>

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
            {VOCAB.map(([term, en, zh]) => (
              <tr key={term}>
                <td>{term}</td>
                <td><En>{en}</En><Zh>{zh}</Zh></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
