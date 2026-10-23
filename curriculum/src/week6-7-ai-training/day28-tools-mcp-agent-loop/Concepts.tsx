import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 28 — Concepts Reference</title>
      <DayNav day="day28-tools-mcp-agent-loop" current="concepts" />
      <h1>Day 28 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you&apos;re shaky on any of these, that&apos;s the priority to fix.
        </p>

        <details>
          <summary>Why can't an LLM take actions on its own?</summary>
          <div className="answer">
            <p>
              It only turns text into text: it has no hands. It can say &quot;Done, the event is added!&quot;, but nothing happens unless your code does the work.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a tool?</summary>
          <div className="answer">
            <p>
              A function you let the model ask for. You describe the function (its name, what it does, and its arguments), the model replies with which one to call and with what, and your code runs it. The model never runs anything itself.
            </p>
          </div>
        </details>

        <details>
          <summary>What is an agent?</summary>
          <div className="answer">
            <p>
              A model that decides its own steps: it picks a tool, sees the result, then decides what to do next, until the job is done. You give it a goal and tools, not a fixed script.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the agentic loop?</summary>
          <div className="answer">
            <p>
              The model asks for a tool, your code runs it and sends back the result, and the model asks again, repeating until it answers without asking for a tool. It is a <code>while (true)</code> loop that ends on a final answer, a turn cap, or an error.
            </p>
          </div>
        </details>

        <details>
          <summary>What is MCP?</summary>
          <div className="answer">
            <p>
              Model Context Protocol, a standard way to package tools so any AI app can use them. Instead of every app rewriting its own calendar or GitHub tools, you write them once as an MCP server, and every MCP-compatible app can plug them in.
            </p>
          </div>
        </details>

        <details>
          <summary>What are an MCP server and an MCP client?</summary>
          <div className="answer">
            <p>
              The server is a program that holds the tools and offers them over MCP. The client lives inside an AI app (the host), connects to a server, asks which tools it has, and forwards the model's tool calls to it.
            </p>
          </div>
        </details>

        <details>
          <summary>Who actually runs a tool?</summary>
          <div className="answer">
            <p>
              Your code, never the model. The model only asks, so every check (permissions, validation, limits) happens in the code that runs the tool.
            </p>
          </div>
        </details>

        <details>
          <summary>Why use MCP when tools already work without it?</summary>
          <div className="answer">
            <p>
              Without MCP, every app has its own copy of every integration: 3 apps and 3 services means 9 integrations. With MCP it is 3 + 3, and a tool fixed in the server is fixed for every app that uses it.
            </p>
          </div>
        </details>

        <details>
          <summary>How does the model decide which tool to use?</summary>
          <div className="answer">
            <p>
              By reading the tool descriptions. If it keeps choosing the wrong tool, improve the description first, and keep the tool set small and distinct.
            </p>
          </div>
        </details>

        <details>
          <summary>Why must the agentic loop be capped?</summary>
          <div className="answer">
            <p>
              A model can keep trying a task it cannot finish, burning tokens and money. Cap the turns, set a budget, and decide what to tell the user when the cap is hit.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
