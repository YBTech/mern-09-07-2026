import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 30 — Concepts Reference</title>
      <DayNav day="day30-workflows-agents-context" current="concepts" />
      <h1>Day 30 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>Concepts</h2>

        <details>
          <summary>What is a workflow, what is an agent, and what is the difference?</summary>
          <div className="answer">
            <p>
              Both are built from LLM calls; the difference is who controls the flow. In a workflow, your code decides the steps and their order, and the model only fills in each step. In an agent (agentic AI), the model decides the next step itself, in a loop, by choosing which tool to call until it decides it is done.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the three common workflow patterns?</summary>
          <div className="answer">
            <p>
              Prompt chain (a fixed sequence of small steps), router (classify the input, then send it down one specialised path), and parallelization (independent calls at the same time, then merge). A fourth, evaluator-optimizer, is a loop in your code: one call writes, another checks against a rubric, with a round cap.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a prompt chain, and when does it break?</summary>
          <div className="answer">
            <p>
              One job split into a fixed sequence of small prompts, each taking the previous step's answer as input, for example look up the order → check the policy → decide → draft → check the tone. A step can branch on the model's answer and still be a chain, because the steps never change. It breaks on a case the sequence has no step for.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a router, and when does it break?</summary>
          <div className="answer">
            <p>
              A first, cheap call classifies the input, and your code sends it down the one path built for that category, each with its own prompt and tools. It keeps each path simple, but it breaks when an input fits two boxes: the router must pick one, so the other half of the request is lost. Always add a fallback for &quot;no match&quot;.
            </p>
          </div>
        </details>

        <details>
          <summary>What is parallelization, and what are its two forms?</summary>
          <div className="answer">
            <p>
              Running calls that do not need each other's answers at the same time (<code>Promise.all</code>). Sectioning splits a job into independent parts and merges them; voting asks the same question several times and takes the majority for more confidence. It costs more tokens in total and breaks when one part needs another part's result.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the agent loop, and what happens inside one turn?</summary>
          <div className="answer">
            <p>
              A loop where, each turn, your code sends the whole conversation and the tool list to the model and reads its <code>stop_reason</code>. If it is <code>tool_use</code>, your code runs the tools the model picked, appends the results to the messages, and loops; if it is <code>end_turn</code>, the model has decided it is done. A turn cap stops it from looping forever.
            </p>
          </div>
        </details>

        <details>
          <summary>When should you choose a workflow, and when an agent?</summary>
          <div className="answer">
            <p>
              Choose a workflow when the steps are well-defined and each step's output is predictable, so you can write the path down. Choose an agent when you only have a goal and what to do next depends on what was just found. Start with the simplest one that works, and add an agent only where the path really cannot be known in advance.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the trade-off between a workflow and an agent?</summary>
          <div className="answer">
            <p>
              A workflow is predictable, cheaper, faster and easy to debug, but it only handles the cases you coded. An agent handles the unexpected, but its path, number of turns and token cost change from run to run, so it is harder to test. Errors also compound: ten steps that are each 95% right are all right only about 60% of the time.
            </p>
          </div>
        </details>

        <details>
          <summary>What kinds of applications suit a workflow, and which need an agent?</summary>
          <div className="answer">
            <p>
              Workflow: support ticket triage and routing, extracting fields from invoices or forms, moderating posts against a written policy, translating or summarising documents, drafting copy then checking it against a rubric, a nightly report. Agent: coding agents (read, run tests, fix, repeat), research and data analysis, web browser automation, investigating an outage across logs and code, support cases with several problems at once.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the context window, and why does a long-running agent get worse?</summary>
          <div className="answer">
            <p>
              The context window is everything the model reads on one call: system prompt, tools, history and tool results. An agent re-sends the whole window every turn and every tool result is added to it, so a long run gets more expensive, slower, and less accurate as the important facts get buried in noise.
            </p>
          </div>
        </details>

        <details>
          <summary>What is context engineering, and what are its four moves?</summary>
          <div className="answer">
            <p>
              Deciding what goes into the window on each call, so the model sees only what it needs. The four moves: write (save notes and facts outside the window), select (pull in only what is needed now), compress (summarise old turns), and isolate (do noisy work in another window, with a subagent).
            </p>
          </div>
        </details>

        <details>
          <summary>What are cheap ways to keep an agent's context small?</summary>
          <div className="answer">
            <p>
              Make tools return snippets and ids instead of whole files, and let the model fetch one section just in time (select). Save exact figures to a notes file before anything is summarised (write), then summarise old turns once the window passes a limit (compress). Put stable parts first so the provider can cache them.
            </p>
          </div>
        </details>

        <details>
          <summary>What is agent orchestration (orchestrator-workers)?</summary>
          <div className="answer">
            <p>
              One agent (the orchestrator, lead agent or supervisor) plans and combines, and several workers each do one focused job in their own window. It can be driven by your code (a model plans, then your code starts the workers, often in parallel) or by the lead agent (it calls a tool whenever it decides to start a worker). Choose code-driven when the subtasks are known after one plan, agent-driven when each answer decides the next question.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a subagent, and why use one?</summary>
          <div className="answer">
            <p>
              A subagent (worker) is another agent loop started with its own fresh messages, usually from inside a tool, so to the caller it looks like any other tool. It does the noisy reading in its own window and returns only a short report, so the caller's window stays small. The brief must contain everything it needs, and the report should name its sources and what it could not find.
            </p>
          </div>
        </details>

        <details>
          <summary>How can subagents share state or context with each other?</summary>
          <div className="answer">
            <p>
              Two ways. Through the lead: a worker's report comes back as a tool result and the lead copies the key facts into the next worker's brief (sequential). Through shared state: each worker writes its own section of a shared file or store, and the lead reads it when all are done (parallel). Never share a whole window between agents, because that undoes the isolation.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a checkpoint, and why does a long-running agent need one?</summary>
          <div className="answer">
            <p>
              Saving the run's state (steps done, facts found, status) to storage after every step. A long run will meet a timeout, a rate limit or a deploy; with a checkpoint it resumes and skips finished steps instead of repeating their time, cost and side effects. Steps with side effects should be idempotent, for example record the message id before sending so a resume never sends twice.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you add human approval to an agent?</summary>
          <div className="answer">
            <p>
              Make approval a pause, not a wait: save the state with a status like <code>waiting_for_approval</code> and end the process. When a person approves (a button, an API call), the run loads its checkpoint and continues from the approval step. Nothing stays running while you wait, and the approval survives a restart.
            </p>
          </div>
        </details>

        <details>
          <summary>How does an agent know when to stop?</summary>
          <div className="answer">
            <p>
              Normally the model decides it is done (<code>stop_reason</code> is <code>end_turn</code>). Because it may never decide, your code adds guards checked before each model call: a turn cap, a token budget, a timeout, and a check for the same tool call repeated. Whichever hits first ends the run, and the run should report why and hand over to a person.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between short-term and long-term memory?</summary>
          <div className="answer">
            <p>
              The model itself remembers nothing between calls; memory is your app storing data and putting the relevant part back into the prompt. In production both live in a database, and they differ in scope: short-term memory is one conversation (keyed by thread id) whose whole history is re-sent every turn, while long-term memory is one user across all conversations (keyed by user id) where only a few selected facts go into the prompt. Long-term memory needs a source and a date on every fact so it can expire or be deleted.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
