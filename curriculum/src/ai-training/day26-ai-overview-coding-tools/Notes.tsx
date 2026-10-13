import { useState } from "react";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";
import { ArrowDefs } from "../../components/Diagram";
import { En, Zh } from "../../components/Lang";
import {
  AiLandscape,
  AutonomySpectrum,
  BudgetRanges,
  ClaudeSetup,
  CodeFirstTests,
  CodingAssistants,
  CompanyPatterns,
  ContextFill,
  ContextWindow,
  DailyDevLoop,
  DebugLoop,
  DefaultSkills,
  HookExamples,
  KindsOfAi,
  KnowledgeBase,
  ModelTiers,
  PayModels,
  PermissionModes,
  PlanFirst,
  PromptResponse,
  SecurityBasics,
  SkillExamples,
  TestLoop,
  Tokens,
  ToolCompare,
  TwoModes,
  UnattendedChecks,
  VerificationGates,
  WorkflowSummary,
} from "./Diagrams";
import ToolToggle, { type Tool } from "./ToolToggle";

export default function Notes() {
  const [tool, setTool] = useState<Tool>("claude");
  return (
    <div className="page notes-page">
      <title>Day 26 Notes</title>
      <DayNav day="day26-ai-overview-coding-tools" current="notes" />
      <ArrowDefs />
      <header className="lecture-header">
        <p className="eyebrow">AI Training · Day 26 · Notes</p>
        <h1>AI Overview &amp; AI Coding Tools</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>
          <En>The essentials — what you must be able to explain and do by the end of today.</En>
          <Zh>核心要点——今天结束时你必须能讲清楚并做到的内容。</Zh>
        </p>
        <ul>
          <li>
            <En>Explain how AI, machine learning, deep learning, and generative AI relate, and give an everyday example of each kind of AI</En>
            <Zh>讲清楚 AI、机器学习、深度学习和 generative AI 的关系，并为每类 AI 举一个日常例子</Zh>
          </li>
          <li>
            <En>Explain the basic LLM terms: prompt, model, token, and context window, and why an LLM can sound sure and still be wrong</En>
            <Zh>讲清楚 LLM 的基本术语：prompt、model、token 和 context window，以及为什么 LLM 会说得很笃定却依然出错</Zh>
          </li>
          <li>
            <En>Name the four common AI coding tools, explain how a company picks one, and how it pays: per seat or per token</En>
            <Zh>说出四个常见的 AI 编程工具，讲清楚公司如何选定其中一个，以及如何付费：按席位还是按 token</Zh>
          </li>
          <li>
            <En>Tell tab completion from agentic mode, and use Claude Code or Codex in agentic mode</En>
            <Zh>区分 tab 补全和 agentic 模式，并以 agentic 模式使用 Claude Code 或 Codex</Zh>
          </li>
          <li>
            <En>Set up a project for your agent: rules file, skills, permission modes, and hooks</En>
            <Zh>为你的 agent 配置项目：规则文件、skills、权限模式和 hooks</Zh>
          </li>
          <li>
            <En>Work with an AI agent using good habits: plan first, teach it your stack, prompt with a goal and a check, manage context, debug and test with it, and keep security basics</En>
            <Zh>用良好的习惯与 AI agent 协作：先计划、让它了解你的技术栈、带目标和验证方式写 prompt、管理上下文、一起调试和测试，并守住安全基础</Zh>
          </li>
          <li>
            <En>Describe your own AI workflow in an interview in under a minute</En>
            <Zh>能在一分钟内向面试官讲清你自己的 AI 工作流</Zh>
          </li>
        </ul>
        <p>
          Want more? <Link to="/ai-training/day26-ai-overview-coding-tools/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        <h3 className="part part-lg">
          <En>1. Kinds of AI</En>
          <Zh>1. AI 的种类</Zh>
        </h3>

        <p>
          <En>Pain point: &quot;AI&quot; is used for everything from a spam filter to ChatGPT, so it is hard to know what is what.</En>
          <Zh>痛点：从垃圾邮件过滤到 ChatGPT 都叫&quot;AI&quot;，很难分清谁是谁。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>1.1 Kinds of AI in everyday life</En>
          <Zh>1.1 日常生活中的各类 AI</Zh>
        </h4>

        <KindsOfAi />

        <ul>
          <li>
            <En>You already use all of these: fraud alerts, face unlock, voice assistants, translation, ChatGPT.</En>
            <Zh>这些你其实都在用：欺诈提醒、人脸解锁、语音助手、翻译、ChatGPT。</Zh>
          </li>
          <li>
            <En>Pick by the job: if the answer is exact, a plain rule or query beats any AI.</En>
            <Zh>按任务来选：如果答案是确定的，普通的规则或查询比任何 AI 都强。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.2 AI, layer by layer</En>
          <Zh>1.2 AI 的层层包含关系</Zh>
        </h4>

        <AiLandscape />

        <ul>
          <li>
            <En>Each layer sits inside the one before it: generative AI is a kind of deep learning, which is a kind of machine learning.</En>
            <Zh>每一层都包含在上一层里：generative AI 是 deep learning 的一种，deep learning 又是 machine learning 的一种。</Zh>
          </li>
          <li>
            <En>Generative AI is what people mean by &quot;AI&quot; today, and it is what we build with.</En>
            <Zh>今天人们说的&quot;AI&quot;通常就是 generative AI，也是我们用来构建应用的东西。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>1.3 From chatbot to agent</En>
          <Zh>1.3 从聊天机器人到 agent</Zh>
        </h4>

        <p>
          <En>Pain point: the same word, &quot;AI assistant&quot;, covers a chat window and a tool that rewrites ten files.</En>
          <Zh>痛点：同样叫&quot;AI 助手&quot;，可能是一个聊天窗口，也可能是一个能改十个文件的工具。</Zh>
        </p>

        <AutonomySpectrum />

        <ul>
          <li>
            <En>What changes along the spectrum is who does the work and how much you must check.</En>
            <Zh>沿着这个光谱变化的，是谁来干活，以及你需要检查多少。</Zh>
          </li>
          <li>
            <En>An agent is a model that calls tools in a loop until it decides the task is done.</En>
            <Zh>agent 就是在循环中不断调用 tools、直到自己认为任务完成的模型。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>2. LLM basics</En>
          <Zh>2. LLM 基础概念</Zh>
        </h3>

        <p>
          <En>Pain point: every AI tool you will use is built on the same few ideas, and the jargon hides how simple they are.</En>
          <Zh>痛点：你要用的每个 AI 工具都建立在同样几个概念上，只是术语让它们显得很复杂。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>2.1 Prompt in, response out</En>
          <Zh>2.1 输入 prompt，得到回答</Zh>
        </h4>

<PromptResponse />

        <ul>
          <li>
            <En>An LLM (large language model) is a model trained on huge amounts of text to predict what comes next.</En>
            <Zh>LLM（large language model，大语言模型）是在海量文本上训练出来、用来预测下一个词的模型。</Zh>
          </li>
          <li>
            <En>The prompt is everything you send; a system prompt sets the rules, the user prompt is the task.</En>
            <Zh>prompt 是你发送的全部内容；system prompt 设定规则，user prompt 是具体任务。</Zh>
          </li>
          <li>
            <En>The model has no memory: a chat feels continuous only because each call re-sends the history.</En>
            <Zh>模型没有记忆：聊天之所以显得连贯，只是因为每次调用都会把历史重新发送一遍。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.2 Tokens</En>
          <Zh>2.2 Token</Zh>
        </h4>

        <p>
          <En>Pain point: you are billed and limited in tokens, not words, so you need a feel for what one is.</En>
          <Zh>痛点：计费和限制都按 token 而不是按单词，所以你需要对 token 有个直观感觉。</Zh>
        </p>
<Tokens />

        <ul>
          <li>
            <En>A token is a small piece of text, about four characters or three quarters of a word.</En>
            <Zh>token 是一小段文本，大约四个字符，或者四分之三个单词。</Zh>
          </li>
          <li>
            <En>Input and output are counted separately, and output tokens cost more.</En>
            <Zh>输入和输出分开计数，而且输出 token 更贵。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.3 Context window</En>
          <Zh>2.3 Context window（上下文窗口）</Zh>
        </h4>

        <p>
          <En>Pain point: the model can only see so much at once, and a long chat quietly pushes the early parts out.</En>
          <Zh>痛点：模型一次能看到的内容有限，聊得越长，前面的部分就会被悄悄挤出去。</Zh>
        </p>
<ContextWindow />

        <ul>
          <li>
            <En>The context window is the maximum number of tokens the model can see in one call.</En>
            <Zh>context window 是模型一次调用中最多能看到的 token 数量。</Zh>
          </li>
          <li>
            <En>Your prompt, the history, any files, and the reply all share it.</En>
            <Zh>你的 prompt、历史记录、文件和回答都共用这个额度。</Zh>
          </li>
          <li>
            <En>Fuller windows cost more and tend to give worse answers, so keep only what the task needs.</En>
            <Zh>窗口越满越贵，回答也往往越差，所以只放任务需要的内容。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.4 Models</En>
          <Zh>2.4 模型（Model）</Zh>
        </h4>

<ModelTiers />

        <ul>
          <li>
            <En>Every provider sells the same three tiers under different names: small, mid-size, and frontier.</En>
            <Zh>每个服务商都卖同样三个档次，只是名字不同：小型、中型和 frontier。</Zh>
          </li>
          <li>
            <En>Names and versions change every few months, so learn the tiers, not the names.</En>
            <Zh>名称和版本每隔几个月就会变，所以要学档次，而不是记名字。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>2.5 Two things to remember</En>
          <Zh>2.5 要记住的两点</Zh>
        </h4>

        <div className="concept">
          <p className="concept-label">
            <En>Hallucination</En>
            <Zh>Hallucination（幻觉）</Zh>
          </p>
          <ul>
          <li>
            <En>An LLM can sound completely sure and still be wrong.</En>
            <Zh>LLM 可能说得非常笃定，却依然是错的。</Zh>
          </li>
          <li>
            <En>It invents APIs, facts, and file names that look real.</En>
            <Zh>它会编造看起来很真实的 API、事实和文件名。</Zh>
          </li>
          <li>
            <En>Treat its output as a draft: give it real sources, then verify.</En>
            <Zh>把它的输出当作草稿：给它真实的资料，然后核实。</Zh>
          </li>
          </ul>
        </div>
        <div className="concept">
          <p className="concept-label">
            <En>Temperature</En>
            <Zh>Temperature（温度）</Zh>
          </p>
          <ul>
          <li>
            <En>A dial for how random the output is.</En>
            <Zh>控制输出随机程度的旋钮。</Zh>
          </li>
          <li>
            <En>Low: nearly the same answer every time, good for code and data work.</En>
            <Zh>低：每次答案几乎一样，适合写代码和处理数据。</Zh>
          </li>
          <li>
            <En>High: more varied and creative, good for brainstorming.</En>
            <Zh>高：更多样、更有创意，适合头脑风暴。</Zh>
          </li>
          </ul>
        </div>

        <h3 className="part part-lg">
          <En>3. AI coding tools and how companies pay</En>
          <Zh>3. AI 编程工具与公司如何付费</Zh>
        </h3>

        <p>
          <En>Pain point: four tools dominate the market and they look alike, so it helps to know what separates them, and which one your company will actually pay for.</En>
          <Zh>痛点：市场上主要有四个工具，看起来都差不多，所以要知道它们的区别，以及你的公司实际会为哪一个付费。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>3.1 The four you will meet most, and which one a company picks</En>
          <Zh>3.1 最常见的四个工具，以及公司会选哪一个</Zh>
        </h4>

<ToolCompare />

        <ul>
          <li>
            <En>They all do the same core job: read your code, suggest or make changes, and run commands.</En>
            <Zh>它们的核心工作都一样：读你的代码、给出或做出修改、运行命令。</Zh>
          </li>
          <li>
            <En>This course uses Claude Code, but the ideas carry over to every tool here.</En>
            <Zh>本课程使用 Claude Code，但这里的思路适用于所有这些工具。</Zh>
          </li>
        </ul>

        <p>
          <En>In practice a company rarely pays for all four: every seat costs money and every tool needs a security review.</En>
          <Zh>实际上公司很少四个都买：每个席位都要花钱，每个工具也都要做安全评审。</Zh>
        </p>
<CompanyPatterns />

        <ul>
          <li>
            <En>Most companies pay for one main tool; two at once usually means a migration in progress.</En>
            <Zh>大多数公司只为一个主力工具付费；同时有两个通常意味着正在迁移。</Zh>
          </li>
          <li>
            <En>Whichever your company picks, learn its rules file, permissions, and limits first.</En>
            <Zh>不管你的公司选哪个，先学会它的规则文件、权限和用量限制。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>3.2 How companies pay</En>
          <Zh>3.2 公司如何付费</Zh>
        </h4>

<PayModels />

<BudgetRanges />

        <ul>
          <li>
            <En>Many companies mix both: a seat for everyone, plus a monthly token budget per developer for heavy agent use.</En>
            <Zh>很多公司两者混用：人人一个席位，再给每位开发者一个每月 token 预算用于重度 agent 使用。</Zh>
          </li>
          <li>
            <En>Entry seats (Copilot Business, a standard team seat) cost about $19 to $40; premium seats (Claude Team Premium or Max, ChatGPT Pro) about $100 to $200.</En>
            <Zh>入门席位（Copilot Business、标准团队席位）约 $19 到 $40；高级席位（Claude Team Premium 或 Max、ChatGPT Pro）约 $100 到 $200。</Zh>
          </li>
          <li>
            <En>Anthropic reports an enterprise average of roughly $150 to $250 of Claude Code tokens per developer per month; heavy users run far higher, some past $1,000.</En>
            <Zh>Anthropic 公布的企业平均水平是每位开发者每月约 $150 到 $250 的 Claude Code token；重度用户则高得多，有的超过 $1,000。</Zh>
          </li>
          <li>
            <En>Hitting the cap usually means slowing down or asking for more, so keep sessions focused.</En>
            <Zh>用到上限通常意味着被限速或需要申请更多，所以要让会话保持专注。</Zh>
          </li>
          <li>
            <En>Prices change often and sources disagree; check the vendor's pricing page and your company's policy.</En>
            <Zh>价格经常变动，各来源说法也不一；请查看服务商的定价页面和公司的政策。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>4. Two ways to work with AI</En>
          <Zh>4. 与 AI 协作的两种方式</Zh>
        </h3>

        <p>
          <En>Pain point: the same tool can mean a smart autocomplete or a teammate that edits ten files, and they need different habits.</En>
          <Zh>痛点：同一个工具可能只是个聪明的自动补全，也可能是能改十个文件的搭档，两者需要不同的使用习惯。</Zh>
        </p>

<TwoModes />

        <h4 className="topic topic-line">
          <En>4.1 Tab completion</En>
          <Zh>4.1 Tab 补全</Zh>
        </h4>

        <CodeBlock
          language="typescript"
          code={`// You type the signature; the AI shows the body in grey.
// Press Tab to accept, keep typing to ignore.
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}`}
        />

        <ul>
          <li>
            <En>Tab completion is fast and low risk: you see every suggestion before it lands.</En>
            <Zh>Tab 补全速度快、风险低：每条建议在生效前你都能看到。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>4.2 Agentic mode</En>
          <Zh>4.2 Agentic 模式</Zh>
        </h4>

        <CodeBlock
          language="plaintext"
          code={`$ cd my-app
$ claude
> Add a GET /health endpoint and a test for it. Run the tests.`}
        />

        <ul>
          <li>
            <En>You give a goal in a side chat or the terminal; the agent reads files, edits, and runs commands.</En>
            <Zh>你在侧边聊天或终端里给出目标；agent 会读文件、改代码、运行命令。</Zh>
          </li>
          <li>
            <En>You review the result, so the rest of today is about steering the agent well.</En>
            <Zh>你来审查结果，所以今天剩下的内容都是关于如何把 agent 引导好。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>5. Setting up your coding agent</En>
          <Zh>5. 配置你的编程 agent</Zh>
        </h3>

        <p>
          <En>Pain point: without setup, the agent starts every session knowing nothing about your project. Claude Code and Codex use different names for the same ideas.</En>
          <Zh>痛点：没有配置的话，agent 每次会话开始时对你的项目一无所知。Claude Code 和 Codex 对同样的概念用了不同的名字。</Zh>
        </p>
        <ToolToggle tool={tool} onChange={setTool} />

        <h4 className="topic topic-line">
          <En>5.1 What goes in a project</En>
          <Zh>5.1 项目里放什么</Zh>
        </h4>

<ClaudeSetup tool={tool} />

        {tool === "claude" ? (
          <>
        <h4 className="topic topic-line">
          <En>5.2 CLAUDE.md: your project's memory</En>
          <Zh>5.2 CLAUDE.md：项目的记忆</Zh>
        </h4>
          </>
        ) : (
          <>
        <h4 className="topic topic-line">
          <En>5.2 AGENTS.md: your project's memory</En>
          <Zh>5.2 AGENTS.md：项目的记忆</Zh>
        </h4>
          </>
        )}
        <CodeBlock
          language="markdown"
          code={`# Project rules

## Stack
- React + Vite + TypeScript, Express, MongoDB

## Commands
- Run: \`npm run dev\`
- Test: \`npm test\`

## Rules
- Controllers call services; never touch the database directly
- Never log tokens or user emails`}
        />

        {tool === "claude" ? (
          <>
        <ul>
          <li>
            <En>Run /init and Claude Code drafts CLAUDE.md from your code; then edit it by hand.</En>
            <Zh>运行 /init，Claude Code 会根据你的代码起草 CLAUDE.md；然后再手动修改。</Zh>
          </li>
          <li>
            <En>Keep it short: it is read at the start of every session and takes up context.</En>
            <Zh>保持简短：每次会话开头都会读取它，而且会占用上下文。</Zh>
          </li>
        </ul>
          </>
        ) : (
          <>
        <ul>
          <li>
            <En>Run /init and Codex drafts AGENTS.md from your code; then edit it by hand.</En>
            <Zh>运行 /init，Codex 会根据你的代码起草 AGENTS.md；然后再手动修改。</Zh>
          </li>
          <li>
            <En>Keep it short: it is read at the start of every session and takes up context.</En>
            <Zh>保持简短：每次会话开头都会读取它，而且会占用上下文。</Zh>
          </li>
        </ul>
          </>
        )}

        <h4 className="topic topic-line">
          <En>5.3 Skills: reusable prompts</En>
          <Zh>5.3 Skills：可复用的 prompt</Zh>
        </h4>

        <h5 className="topic-sub">
          <En>5.3.a Built-in skills</En>
          <Zh>5.3.a 内置 skills</Zh>
        </h5>
        <DefaultSkills tool={tool} />

        <ul>
          <li>
            <En>Type / in a session to see the full list.</En>
            <Zh>在会话里输入 / 即可看到完整列表。</Zh>
          </li>
        </ul>

        <h5 className="topic-sub">
          <En>5.3.b Custom skills</En>
          <Zh>5.3.b 自定义 skills</Zh>
        </h5>
        <SkillExamples />

        <CodeBlock
          language="markdown"
          code={`---
name: review-pr
description: Review a pull request against our checklist
---

# Review a pull request
1. Read the diff.
2. Check **auth**, **input validation**, and **tests**.
3. Reply with a short list of problems, worst first.`}
        />

        {tool === "claude" ? (
          <>
        <ul>
          <li>
            <En>Save it as .claude/skills/review-pr/SKILL.md; it loads only when relevant.</En>
            <Zh>保存为 .claude/skills/review-pr/SKILL.md；只在相关时才加载。</Zh>
          </li>
        </ul>
          </>
        ) : (
          <>
        <ul>
          <li>
            <En>Save it as a SKILL.md in Codex's skills folder; it loads only when relevant.</En>
            <Zh>保存为 Codex skills 文件夹里的 SKILL.md；只在相关时才加载。</Zh>
          </li>
        </ul>
          </>
        )}

        <h4 className="topic topic-line">
          <En>5.4 Permission modes</En>
          <Zh>5.4 权限模式</Zh>
        </h4>

<PermissionModes tool={tool} />

        {tool === "claude" ? (
          <>
        <CodeBlock
          language="json"
          code={`{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(npm run lint)"],
    "deny": ["Read(./.env)"]
  }
}`}
        />
          </>
        ) : (
          <>
        <CodeBlock
          language="bash"
          code={`# ~/.codex/config.toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"`}
        />
          </>
        )}
        {tool === "claude" ? (
          <>
        <ul>
          <li>
            <En>Auto mode lets the AI judge each action's risk and only asks when something looks risky.</En>
            <Zh>Auto 模式让 AI 自行判断每个操作的风险，只有看起来有风险时才会询问。</Zh>
          </li>
          <li>
            <En>Start in default or plan mode and loosen only for things you trust.</En>
            <Zh>从 default 或 plan 模式开始，只对你信任的操作放宽。</Zh>
          </li>
          <li>
            <En>Allow and deny rules in settings decide what never needs asking and what is always blocked.</En>
            <Zh>settings 里的 allow 和 deny 规则决定哪些操作无需询问、哪些永远被拦截。</Zh>
          </li>
        </ul>
          </>
        ) : (
          <>
        <ul>
          <li>
            <En>The approval policy decides when Codex asks; the sandbox decides what it can touch.</En>
            <Zh>approval policy 决定 Codex 何时询问；sandbox 决定它能碰什么。</Zh>
          </li>
          <li>
            <En>Start read-only or in the workspace sandbox and loosen only for things you trust.</En>
            <Zh>从只读或工作区沙箱开始，只对你信任的操作放宽。</Zh>
          </li>
          <li>
            <En>Full access removes both protections, so keep it for throwaway environments.</En>
            <Zh>Full access 会同时去掉这两层保护，所以只用在一次性环境里。</Zh>
          </li>
        </ul>
          </>
        )}

        <h4 className="topic topic-line">
          <En>5.5 Hooks</En>
          <Zh>5.5 Hooks</Zh>
        </h4>

        <p>
          <En>Pain point: a rule in the rules file is a request, and the model can forget it; a hook is enforced.</En>
          <Zh>痛点：规则文件里的规则只是请求，模型可能会忘；hook 则是强制执行的。</Zh>
        </p>
<HookExamples />

        {tool === "claude" ? (
          <>
        <CodeBlock
          language="json"
          code={`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npm run lint" }]
      }
    ]
  }
}`}
        />
        <ul>
          <li>
            <En>A hook runs your own command at a set moment, such as lint after every edit.</En>
            <Zh>hook 会在特定时刻运行你自己的命令，比如每次编辑后跑 lint。</Zh>
          </li>
          <li>
            <En>It is enforced by the tool, so it works even when the model forgets a rule in CLAUDE.md.</En>
            <Zh>它由工具强制执行，所以即使模型忘了 CLAUDE.md 里的规则也依然有效。</Zh>
          </li>
        </ul>
          </>
        ) : (
          <>
        <ul>
          <li>
            <En>A hook runs your own command at a set moment; Codex also has a notify setting that runs a command when a turn finishes.</En>
            <Zh>hook 会在特定时刻运行你自己的命令；Codex 还有 notify 设置，会在一轮结束时运行一个命令。</Zh>
          </li>
          <li>
            <En>Hook support differs by version, so check the Codex docs for the events you can use.</En>
            <Zh>不同版本对 hook 的支持不同，请查看 Codex 文档了解可用的事件。</Zh>
          </li>
        </ul>
          </>
        )}

        <h3 className="part part-lg">
          <En>6. Good habits for vibe coding</En>
          <Zh>6. Vibe coding 的好习惯</Zh>
        </h3>

        <p>
          <En>Pain point: a vague request produces confident code that fits nothing in your project.</En>
          <Zh>痛点：模糊的需求会产生看起来很自信、但和你项目完全不匹配的代码。</Zh>
        </p>
        <ToolToggle tool={tool} onChange={setTool} />

        <h4 className="topic topic-line">
          <En>6.1 Plan before you code</En>
          <Zh>6.1 先计划，再写代码</Zh>
        </h4>

<PlanFirst />

        {tool === "claude" ? (
          <>
        <ul>
          <li>
            <En>In Claude Code, press Shift+Tab to enter plan mode: it reads and proposes, and edits nothing.</En>
            <Zh>在 Claude Code 里按 Shift+Tab 进入 plan 模式：它只读和提出方案，不会修改任何文件。</Zh>
          </li>
          <li>
            <En>Fix the plan in words, which is cheaper than fixing it in code.</En>
            <Zh>用文字修正计划，比事后改代码便宜得多。</Zh>
          </li>
          <li>
            <En>Small steps keep every diff reviewable.</En>
            <Zh>步子小，每个 diff 才容易审查。</Zh>
          </li>
        </ul>
          </>
        ) : (
          <>
        <ul>
          <li>
            <En>In Codex, start read-only or ask for a plan first: it proposes and edits nothing until you approve.</En>
            <Zh>在 Codex 里先用只读模式，或先要一份计划：在你批准之前它只提方案、不改文件。</Zh>
          </li>
          <li>
            <En>Fix the plan in words, which is cheaper than fixing it in code.</En>
            <Zh>用文字修正计划，比事后改代码便宜得多。</Zh>
          </li>
          <li>
            <En>Small steps keep every diff reviewable.</En>
            <Zh>步子小，每个 diff 才容易审查。</Zh>
          </li>
        </ul>
          </>
        )}

        <h4 className="topic topic-line">
          <En>6.2 Teach it your stack and patterns</En>
          <Zh>6.2 让它了解你的技术栈和约定</Zh>
        </h4>

<KnowledgeBase tool={tool} />

        {tool === "claude" ? (
          <>
        <ul>
          <li>
            <En>Put stack, folder layout, and conventions in small markdown files, a knowledge base the agent can read.</En>
            <Zh>把技术栈、目录结构和约定写进几个小的 markdown 文件，形成 agent 可以读取的知识库。</Zh>
          </li>
          <li>
            <En>Let CLAUDE.md point to them, so the agent reads only what the task needs.</En>
            <Zh>让 CLAUDE.md 指向这些文件，这样 agent 只会读取任务需要的部分。</Zh>
          </li>
        </ul>
          </>
        ) : (
          <>
        <ul>
          <li>
            <En>Put stack, folder layout, and conventions in small markdown files, a knowledge base the agent can read.</En>
            <Zh>把技术栈、目录结构和约定写进几个小的 markdown 文件，形成 agent 可以读取的知识库。</Zh>
          </li>
          <li>
            <En>Let AGENTS.md point to them, so the agent reads only what the task needs.</En>
            <Zh>让 AGENTS.md 指向这些文件，这样 agent 只会读取任务需要的部分。</Zh>
          </li>
        </ul>
          </>
        )}

        <h4 className="topic topic-line">
          <En>6.3 Prompt with a goal and a check</En>
          <Zh>6.3 带上目标和验证方式的 prompt</Zh>
        </h4>

        <CodeBlock
          language="plaintext" good={[3,4,5]} bad={[1]}
          code={`Fix the login bug.

In src/auth/login.ts, a valid email returns 401.
Reproduce it with npm test auth, find the cause, and fix it.
Show me the passing test. Do not change the API.`}
        />

        <ul>
          <li>
            <En>A good prompt names the goal, the place, the limits, and how to check the result.</En>
            <Zh>好的 prompt 会写明目标、位置、限制，以及如何检查结果。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.4 Manage the agent's context</En>
          <Zh>6.4 管理 agent 的上下文</Zh>
        </h4>

        <p>
          <En>This is the coding tool's own context: the agent fills it by reading files and running commands, not just from what you type.</En>
          <Zh>这里指的是编程工具自己的上下文：agent 通过读文件、跑命令来填满它，而不只是你输入的内容。</Zh>
        </p>
<ContextFill tool={tool} />

        {tool === "claude" ? (
          <>
        <ul>
          <li>
            <En>One task per session: use /clear when the goal changes.</En>
            <Zh>一个会话一件事：目标变了就用 /clear。</Zh>
          </li>
          <li>
            <En>Point to files by name instead of pasting them, and use /compact when a long session gets heavy.</En>
            <Zh>用文件名指向文件，而不是整个粘贴；会话变重时用 /compact。</Zh>
          </li>
        </ul>
          </>
        ) : (
          <>
        <ul>
          <li>
            <En>One task per session: use /new when the goal changes.</En>
            <Zh>一个会话一件事：目标变了就用 /new。</Zh>
          </li>
          <li>
            <En>Point to files by name instead of pasting them, and use /compact when a long session gets heavy.</En>
            <Zh>用文件名指向文件，而不是整个粘贴；会话变重时用 /compact。</Zh>
          </li>
        </ul>
          </>
        )}

        <h4 className="topic topic-line">
          <En>6.5 Security basics</En>
          <Zh>6.5 安全基础</Zh>
        </h4>

<SecurityBasics tool={tool} />

        <p className="callout">
          <En>Models sometimes invent package names, and attackers can register those names: check every new dependency.</En>
          <Zh>模型有时会编造包名，而攻击者可能抢注这些名字：每个新增依赖都要核实。</Zh>
        </p>

        <h4 className="topic topic-line">
          <En>6.6 Debugging with the agent</En>
          <Zh>6.6 让 agent 帮你调试</Zh>
        </h4>

<DebugLoop />

        <CodeBlock
          language="plaintext"
          code={`npm test fails with the error below.
Find the root cause; do not just silence the error.

<paste the exact error here>`}
        />

        <ul>
          <li>
            <En>Paste the real error and the steps to reproduce it; guesses make the agent guess too.</En>
            <Zh>贴出真实的报错和复现步骤；你一猜，agent 也跟着猜。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.7 Testing with the agent</En>
          <Zh>6.7 让 agent 帮你测试</Zh>
        </h4>

        <p>
          <En>Pain point: AI writes code fast, so without tests you cannot tell whether it still works. Two orders are common on the job.</En>
          <Zh>痛点：AI 写代码很快，没有测试你就无法知道它是否还能正常工作。实际工作中有两种常见顺序。</Zh>
        </p>
        <h5 className="topic-sub">
          <En>6.7.a TDD with an AI agent</En>
          <Zh>6.7.a 与 AI agent 一起做 TDD</Zh>
        </h5>
<TestLoop />

        <ul>
          <li>
            <En>On the job: used for bug fixes and well-defined logic, where you can state the expected behavior up front.</En>
            <Zh>实际工作中：用于修 bug 和需求明确的逻辑，因为你可以事先说清预期行为。</Zh>
          </li>
          <li>
            <En>Review the failing test first; it is your spec for the agent.</En>
            <Zh>先审查那个失败的测试；它就是你给 agent 的规格说明。</Zh>
          </li>
        </ul>

        <h5 className="topic-sub">
          <En>6.7.b Code first, then the agent writes the tests</En>
          <Zh>6.7.b 先写代码，再让 agent 写测试</Zh>
        </h5>
<CodeFirstTests />

        <ul>
          <li>
            <En>On the job: common for UI and exploratory work, where you only know the shape once it runs.</En>
            <Zh>实际工作中：常见于 UI 和探索性工作，因为只有跑起来之后你才知道它的形态。</Zh>
          </li>
          <li>
            <En>Ask for edge cases, run coverage, and delete tests that assert nothing.</En>
            <Zh>要求补充边界情况，跑一遍覆盖率，并删掉没有实际断言的测试。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.8 Trusting the output</En>
          <Zh>6.8 如何信任产出</Zh>
        </h4>
        <p>
          <En>Pain point: AI code looks confident and tidy, which makes its mistakes easy to miss.</En>
          <Zh>痛点：AI 写的代码看起来自信又整洁，因此它的错误很容易被忽略。</Zh>
        </p>
        <figure className="video-embed">
          <iframe
            src="https://www.youtube.com/embed/lalGZSNhm8E"
            title="How to Trust a Claude Code Run You Did Not Watch"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </figure>
        <VerificationGates />
        <ul>
          <li>
            <En>Review AI code for what it gets wrong: invented APIs, missing edge cases, skipped authorization, passing-looking tests.</En>
            <Zh>审查 AI 代码时关注它常犯的错：编造的 API、漏掉的边界情况、跳过的授权、看似能通过的测试。</Zh>
          </li>
          <li>
            <En>Keep pull requests small; a huge AI diff is one nobody really reads.</En>
            <Zh>保持 pull request 小而精；AI 生成的巨大 diff 实际上没有人会认真看。</Zh>
          </li>
        </ul>

        <p>
          <En>When a run was unattended, such as a long task or a CI job, nobody saw what happened, so check it in proportion.</En>
          <Zh>如果某次运行无人看管，比如长任务或 CI 作业，就没人看到过程，所以要按相应的强度来检查。</Zh>
        </p>
        <UnattendedChecks />

        <CodeBlock
          language="json"
          code={`{
  "hooks": {
    "Stop": [
      { "hooks": [{ "type": "command", "command": "npm test 1>&2 || exit 2" }] }
    ]
  }
}`}
        />

        <ul>
          <li>
            <En>Keep unattended runs in auto mode, not bypass: it blocks dangerous actions, but it never judges whether the code is correct.</En>
            <Zh>无人看管的运行请用 auto 模式而不是 bypass：它会拦截危险操作，但从不判断代码是否正确。</Zh>
          </li>
          <li>
            <En>Read the diff before the summary: a tidy write-up can hide a file you did not expect it to touch.</En>
            <Zh>先看 diff，再看总结：整洁的总结可能掩盖一个你没想到它会改的文件。</Zh>
          </li>
          <li>
            <En>Make tests a hook, not a promise: exit 2 sends the failure back to Claude to fix, on every run.</En>
            <Zh>让测试成为 hook，而不是口头保证：exit 2 会把失败交还给 Claude 去修，每次运行都会触发。</Zh>
          </li>
          <li>
            <En>Check a headless run by its JSON result and exit code, then have a fresh session review the diff with no memory of how it was built.</En>
            <Zh>用 JSON 结果和退出码检查 headless 运行，再让一个全新的会话在不了解构建过程的情况下审查 diff。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>6.9 AI in your daily dev loop</En>
          <Zh>6.9 日常开发流程中的 AI</Zh>
        </h4>

        <p>
          <En>Pain point: using AI only while typing leaves out the place teams get the most from it, the pull request.</En>
          <Zh>痛点：只在写代码时用 AI，就错过了团队收益最大的地方，也就是 pull request。</Zh>
        </p>
        <figure className="video-embed">
          <iframe
            src="https://www.youtube.com/embed/gIVt_iqmACw"
            title="Claude Code on Every Pull Request: Code Review and the GitHub Action"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </figure>
        <DailyDevLoop />

        <CodeBlock
          language="yaml"
          code={`# .github/workflows/claude-review.yml
on:
  pull_request:
    types: [opened, synchronize]
steps:
  - uses: actions/checkout@v4
  - uses: anthropics/claude-code-action@v1
    with:
      anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
      prompt: Review this PR against CLAUDE.md. Report problems only.`}
        />

        <ul>
          <li>
            <En>A GitHub workflow runs Claude on every pull request and comments on the diff, so you get a first review in minutes.</En>
            <Zh>GitHub workflow 会在每个 pull request 上运行 Claude 并在 diff 上留评论，几分钟内就能得到初步审查。</Zh>
          </li>
          <li>
            <En>It reads the same CLAUDE.md as your local agent, so the team rules are checked the same way everywhere.</En>
            <Zh>它读取与本地 agent 相同的 CLAUDE.md，所以团队规则在各处的检查标准一致。</Zh>
          </li>
          <li>
            <En>It costs API tokens on each run, and it is a first pass: a human still approves the merge.</En>
            <Zh>每次运行都会消耗 API token，而且它只是初审：合并仍由人来批准。</Zh>
          </li>
        </ul>

        <h3 className="part part-lg">
          <En>7. Summary: recap and interview answer</En>
          <Zh>7. 总结：回顾与面试回答</Zh>
        </h3>

        <h4 className="topic topic-line">
          <En>7.1 Three shapes, one loop</En>
          <Zh>7.1 三种形态，一个循环</Zh>
        </h4>
        <CodingAssistants />
        <ul>
          <li>
            <En>More autonomy means more review: an agent that edits ten files needs a harder look than autocomplete.</En>
            <Zh>自主性越高，越需要审查：改十个文件的 agent 比自动补全需要更仔细地检查。</Zh>
          </li>
          <li>
            <En>You own every line you merge, however it was written.</En>
            <Zh>无论代码是怎么写出来的，你合并的每一行都由你负责。</Zh>
          </li>
        </ul>

        <h4 className="topic topic-line">
          <En>7.2 Describe your AI workflow</En>
          <Zh>7.2 描述你的 AI 工作流</Zh>
        </h4>

        <p>
          <En>Pain point: interviewers ask, “What is your AI workflow?”, and a list of tool names is not an answer.</En>
          <Zh>痛点：面试官会问“你的 AI 工作流是什么？”，而只列一串工具名字并不算回答。</Zh>
        </p>
<WorkflowSummary />

        <div className="concept">
          <p className="concept-label">
            <En>Say it like this</En>
            <Zh>可以这样回答</Zh>
          </p>
          <ul>
          <li>
            <En>I start by asking the agent for a plan, and I fix the plan before any code is written.</En>
            <Zh>我先让 agent 给出计划，并在写任何代码之前把计划改对。</Zh>
          </li>
          <li>
            <En>I keep a rules file with our stack and patterns, and I keep each task small so the context stays clean.</En>
            <Zh>我维护一个写明技术栈和约定的规则文件，并让每个任务保持小而聚焦，这样上下文才干净。</Zh>
          </li>
          <li>
            <En>The agent builds in small steps while hooks and tests run automatically.</En>
            <Zh>agent 分小步构建，同时 hooks 和测试会自动运行。</Zh>
          </li>
          <li>
            <En>I verify with tests and lint, and I debug by giving the agent the exact error.</En>
            <Zh>我用测试和 lint 来验证，调试时把确切的报错交给 agent。</Zh>
          </li>
          <li>
            <En>I review every line, watch for security problems, and I own what I merge.</En>
            <Zh>我审查每一行代码、留意安全问题，并对我合并的内容负责。</Zh>
          </li>
          </ul>
        </div>
        <p>
          <En>Make it stronger by adding:</En>
          <Zh>想让回答更有分量，可以再补充：</Zh>
        </p>
        <ul>
          <li>
            <En>A real example: one bug or feature you shipped with an agent, and what you had to correct.</En>
            <Zh>一个真实例子：你用 agent 交付的一个 bug 修复或功能，以及你不得不纠正的地方。</Zh>
          </li>
          <li>
            <En>Where you do not trust AI: authentication, database migrations, and anything involving secrets.</En>
            <Zh>你不信任 AI 的地方：身份认证、数据库迁移，以及任何涉及密钥的内容。</Zh>
          </li>
          <li>
            <En>How it works at your company: the approved tool, the data rules, and the budget.</En>
            <Zh>在你公司里是怎么运作的：批准的工具、数据规则，以及预算。</Zh>
          </li>
        </ul>
      </section>
    </div>
  );
}
