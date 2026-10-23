import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 34 — Concepts Reference</title>
      <DayNav day="day34-ai-system-design" current="concepts" />
      <h1>Day 34 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you're shaky on any of these, that's the priority to fix.
        </p>

        <details>
          <summary>Walk me through how you would design an AI feature.</summary>
          <div className="answer">
            <p>
              Five steps, out loud: the business (who is hurting and what it costs), the requirements (what it must do, then how well), the architecture (one diagram), the deep dive (failures, evals, safety, cost), and why this shape. Ask what it may do before you decide how to build it.
            </p>
          </div>
        </details>

        <details>
          <summary>Workflow or agent: how do you decide?</summary>
          <div className="answer">
            <p>
              Ask who decides the next step. If the path is known, your code decides and you use a workflow: it is cheaper, predictable and easy to test. Use an agent only where the next step cannot be known in advance, and cap its turns.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the autonomy ladder?</summary>
          <div className="answer">
            <p>
              A way to choose how much freedom a system gets: answer only, act with approval, multi-step with a human at the end, act alone. Pick the lowest rung that solves the problem, and put a human or a hard limit wherever money moves or a customer is reached.
            </p>
          </div>
        </details>

        <details>
          <summary>What is RAG, and when do you use it instead of fine-tuning?</summary>
          <div className="answer">
            <p>
              RAG retrieves relevant chunks from your documents and lets the model answer from them. Use it when the model needs facts it does not have, especially ones that change. Fine-tuning changes how a model writes, not what it knows.
            </p>
          </div>
        </details>

        <details>
          <summary>How do tools work, and who executes them?</summary>
          <div className="answer">
            <p>
              The model only asks for a tool by name and arguments. Your code runs the function, decides whether it is allowed, and sends the result back as a message. The model never touches anything itself.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does a long agent run get worse, and what do you do?</summary>
          <div className="answer">
            <p>
              Every turn resends a growing context, so it gets slower, costlier and less accurate. Keep it healthy with four moves: write notes outside the window, select only what is needed, compress old history, and isolate noisy work in subagents.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you evaluate an LLM app?</summary>
          <div className="answer">
            <p>
              Score a test set on every change instead of trusting one try. Use the cheapest grader that catches each failure: a code check, a yes/no model, an LLM judge, then a human. Calibrate any judge against human labels, and turn production failures into new tests.
            </p>
          </div>
        </details>

        <details>
          <summary>What do you trace and monitor in production?</summary>
          <div className="answer">
            <p>
              One trace per request showing every model call, tool call and retrieval, with its input, output, tokens and time. Watch latency, errors, cost per request, tool failures, a quality score and user feedback, per route and per prompt version.
            </p>
          </div>
        </details>

        <details>
          <summary>What is prompt injection, and where do the guardrails go?</summary>
          <div className="answer">
            <p>
              Text the model reads can steer it, because instructions and data share one channel. It arrives three ways: the user's message, retrieved content and tool results. Guard each door, then check the output in code. Models lower the odds, code holds.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you cut cost and latency?</summary>
          <div className="answer">
            <p>
              Cache the stable prompt prefix, batch work nobody waits for, route easy steps to a smaller model, and cap tokens and turns. For speed, lower the time to first token: stream the reply and shorten or cache the prompt.
            </p>
          </div>
        </details>

        <details>
          <summary>Where must a human stay in the loop?</summary>
          <div className="answer">
            <p>
              Wherever a mistake is expensive or hard to undo: moving money, changing records, anything that reaches a customer. The system prepares and proposes; a person approves. The run pauses at a checkpoint and resumes when they answer.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today's lecture covered — mostly "gotcha"
          interview trivia and things that sharpen how you code without being asked often.
        </p>

        <details>
          <summary>How do you make a long-running agent survive a crash?</summary>
          <div className="answer">
            <p>
              Save the state after every step (a checkpoint) under an id for that run, and make steps safe to repeat. After a crash you resume from the last checkpoint instead of starting over. The same mechanism lets a run wait days for a human.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you stop one user's documents leaking into another user's answer?</summary>
          <div className="answer">
            <p>
              Store each chunk with its access groups and filter by the signed-in user's groups inside the search, never after it. Never share a cache across permission groups, and keep the user's identity in the session, not in the prompt.
            </p>
          </div>
        </details>

        <details>
          <summary>Why compute money in code instead of asking the model?</summary>
          <div className="answer">
            <p>
              A model can be wrong, or steered by text in a document. Arithmetic, limits and approvals in plain code are exact and always hold, so the model reads and proposes while code decides amounts.
            </p>
          </div>
        </details>

        <details>
          <summary>How would you roll out a prompt change safely?</summary>
          <div className="answer">
            <p>
              Run the offline eval on the old and new versions and block on a drop, release to a small share of users, watch the live metrics and feedback, then expand. Pin the model version so a provider update cannot change behaviour silently.
            </p>
          </div>
        </details>

        <details>
          <summary>What changes when you move from a prototype to production?</summary>
          <div className="answer">
            <p>
              You add what the prototype skipped: evals, tracing, guardrails on every door, permissions, caps on tokens and cost, retries and fallbacks, and a human at the risky step. The prototype shows it can work; production proves it keeps working.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
