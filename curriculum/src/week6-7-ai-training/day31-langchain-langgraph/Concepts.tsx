import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 31 — Concepts Reference</title>
      <DayNav day="day31-langchain-langgraph" current="concepts" />
      <h1>Day 31 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>Concepts</h2>

        <details>
          <summary>What are LangChain, LangGraph and LangSmith, and how do they fit together?</summary>
          <div className="answer">
            <p>
              LangChain is the parts: one model interface, tools, structured output, RAG components and a ready-made agent (<code>createAgent</code>). LangGraph is the engine that runs a graph of steps with shared state, saved progress and pauses for a person. LangSmith is a separate tool for tracing and evaluating any LLM app. LangChain and LangGraph are two layers of one stack, not two products to choose between, because <code>createAgent</code> is itself a LangGraph graph.
            </p>
          </div>
        </details>

        <details>
          <summary>What problem do these frameworks solve?</summary>
          <div className="answer">
            <p>
              Every AI app needs the same plumbing: a model call, tool definitions, the agent loop, RAG, state, saved progress and an approval pause. The frameworks package that plumbing so you stop rewriting it. Nothing in them is magic; each feature is the code you could write by hand.
            </p>
          </div>
        </details>

        <details>
          <summary>What does LangChain give you?</summary>
          <div className="answer">
            <p>
              One interface for every model vendor (<code>initChatModel</code>, so switching vendors changes one string), structured output and tools from a single zod schema, RAG building blocks (loaders, splitters, retrievers), and <code>createAgent</code>, which runs the agent loop for you. Middleware adds hooks such as a call limit or human approval around the model and tool calls.
            </p>
          </div>
        </details>

        <details>
          <summary>What does <code>createAgent</code> do, and how does it relate to LangGraph?</summary>
          <div className="answer">
            <p>
              You give it a model, tools and a system prompt, and it runs the agent loop: the model asks for tools, they run, the model reads the results, and it repeats until the model has nothing left to ask for. The returned agent is a compiled LangGraph graph, so it can stream, save progress and pause like any graph.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the three parts of a LangGraph graph?</summary>
          <div className="answer">
            <p>
              State is one shared object that every node reads and updates. A node is a plain function that reads the state and returns only the keys it changed. An edge says which node runs next; a conditional edge is a function that reads the state and names the next node, which is how branches and loops are drawn.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between a chain and a graph?</summary>
          <div className="answer">
            <p>
              A chain (LCEL, joined with <code>.pipe()</code>) passes data one way, from a prompt to a model to a parser, and ends. A graph has shared state, branches and loops back, and saves its place after every step. That is why the classic answer is LangChain for linear pipelines and LangGraph for stateful, multi-step agents, though since version 1 a LangChain agent runs on LangGraph anyway.
            </p>
          </div>
        </details>

        <details>
          <summary>What does LangGraph give you that a plain <code>while</code> loop does not?</summary>
          <div className="answer">
            <p>
              Saved state after every step, resuming after a crash or restart, a pause for a person, streaming of each step, and a flow you can draw and test node by node. A hand-written loop can do all of it, but you maintain that code yourself.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a checkpointer, and what is <code>thread_id</code> for?</summary>
          <div className="answer">
            <p>
              A checkpointer saves the graph's whole state after every node, in memory for tests or in SQLite or Postgres in production. <code>thread_id</code> is the key that names one conversation: invoking again with the same <code>thread_id</code> continues from the saved state (even after a restart), and a new one starts fresh. In a chat app that is one id per chat window.
            </p>
          </div>
        </details>

        <details>
          <summary>How does <code>interrupt</code> work, and why must you not charge a card before it?</summary>
          <div className="answer">
            <p>
              <code>interrupt()</code> saves a checkpoint and stops the run, so the run is just saved state waiting for its <code>thread_id</code>. It is resumed later with <code>Command({"{"} resume {"}"})</code>, possibly after a restart. On resume the node runs again from its first line, so any side effect above the <code>interrupt()</code> happens twice; put the charge in the next node, after the answer.
            </p>
          </div>
        </details>

        <details>
          <summary>In the pizza bot, is each node a workflow step or an agent?</summary>
          <div className="answer">
            <p>
              The whole graph is a workflow, because our code fixed the paths (classify, then route). Most boxes have a known path: one model call, one retrieval, or plain code. Only <code>orderAgent</code> is an agent, because cart edits are open-ended and the number of steps is not known in advance. Workflow or agent is a choice per box, and an agent is just a function that can sit inside a node.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you choose plain code, <code>createAgent</code> or a custom LangGraph graph?</summary>
          <div className="answer">
            <p>
              One call or a short fixed chain: plain code with the model interface. One open-ended agent with tools: <code>createAgent</code>. Fixed steps, branches, saved progress or approval: a graph, with <code>createAgent</code> inside the node that needs judgment. Start with the simplest that works and move up only when you can name what is missing.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you not use a framework, and is it vendor-locked?</summary>
          <div className="answer">
            <p>
              Skip it for a single call or a short fixed chain, or when the abstraction costs more than the plumbing it saves: the APIs change quickly and the abstraction hides the raw model calls. It is not locked to a model vendor, because the model interface is swappable, but it does lock you to the framework's own concepts.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
