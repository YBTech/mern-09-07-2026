import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 32 — Concepts Reference</title>
      <DayNav day="day32-evaluation-observability" current="concepts" />
      <h1>Day 32 — Concepts Reference</h1>
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
          <summary>Why does an AI app need evals, and not only unit tests?</summary>
          <div className="answer">
            <p>
              A unit test asserts one exact answer, but a model's answer changes from run to run and "200 OK" says nothing about whether it is right. An eval runs many test cases and scores the answers, so you see how often it is right instead of trusting one demo. Keep unit tests for the code around the model and add evals for the model's answers.
            </p>
          </div>
        </details>

        <details>
          <summary>How do we evaluate an AI app?</summary>
          <div className="answer">
            <p>
              Give the agent a task (an input plus success criteria), record what happened, and let graders decide pass or fail. Run the whole suite on every change, so a drop in the score shows a regression before users see it.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between the transcript and the outcome?</summary>
          <div className="answer">
            <p>
              The transcript is everything the agent said and called; the outcome is the state it left behind. "Your order is placed" is transcript; an order row in the database is outcome, and the outcome is what you should check.
            </p>
          </div>
        </details>

        <details>
          <summary>What kinds of grader are there, and when do you use each?</summary>
          <div className="answer">
            <p>
              Code for anything code can decide (fast, free, same answer every time); a decision model for one yes/no question about a reply; an LLM judge for qualities like correctness and tone scored against a rubric; a human for the gold standard that checks the model graders. Use code wherever you can and a model only for what code can't check.
            </p>
          </div>
        </details>

        <details>
          <summary>What does a code grader check?</summary>
          <div className="answer">
            <p>
              The outcome or business rule (the order exists, no charge without confirmation), a pattern in the reply (no phone number), the tool call and its arguments (<code>add_to_cart</code> with quantity 2), and the output schema. Compute expected values from your source of truth, such as the price list, so a price change doesn't break the test.
            </p>
          </div>
        </details>

        <details>
          <summary>What is an LLM as a judge, and how do you write a good test case for it?</summary>
          <div className="answer">
            <p>
              A second model reads the answer and scores it against a rubric. Make the rubric specific: score each quality separately (correctness, tone, completeness) with a clear meaning for 1 and 5, and have the judge write its reasoning before the score. Describe what a good answer does rather than the exact words.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you evaluate a RAG system?</summary>
          <div className="answer">
            <p>
              Score the steps separately and ask in order: is the fact in the documents, was it retrieved, and did the answer use it faithfully? If you only score the final answer, you won't know whether to fix retrieval or the prompt.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between offline and online evaluation?</summary>
          <div className="answer">
            <p>
              Offline scores the eval suite before release and protects you from known failures. Online scores live traffic after release and finds the new ones; bad answers from production become new test cases, which closes the loop.
            </p>
          </div>
        </details>

        <details>
          <summary>What are observability and tracing, and how are they different from evaluation?</summary>
          <div className="answer">
            <p>
              Evaluation asks "is this version good enough to ship?"; observability asks "what is it doing for real users right now, and why?". A trace is one request's tree of timed steps, and each model call, tool call or retrieval inside it is a span that records its input, output and time.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you debug an AI's mistake?</summary>
          <div className="answer">
            <p>
              Open the trace of the bad request and read each span's input and output until one looks wrong. That tells you which step failed (a bad retrieval, a wrong tool argument, a misread prompt); fix that step and add the case as a new eval task so it can't come back.
            </p>
          </div>
        </details>

        <details>
          <summary>What metrics should you monitor in production?</summary>
          <div className="answer">
            <p>
              The classic ones (latency, errors, TTFT) plus the AI ones: token usage and cost, tool-call failures, and a quality score from online evals and user thumbs-down. Track them per route and per prompt version so a change shows up as a step in the line.
            </p>
          </div>
        </details>

        <details>
          <summary>What platforms are used for tracing and evals?</summary>
          <div className="answer">
            <p>
              Observability platforms such as LangSmith store the traces, show them in a viewer and run evals, so you don't build that layer yourself. Turning tracing on is usually a few environment variables or one wrapper, and OpenTelemetry can send AI traces to the tools you already use.
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
          <summary>Can you trust an LLM judge?</summary>
          <div className="answer">
            <p>
              Only after you calibrate it: if it agrees with people on about 50 labelled answers, it can grade the rest. Known biases have fixes: use a specific rubric, run pairwise comparisons in both orders, and judge with a different model family than the one being judged.
            </p>
          </div>
        </details>

        <details>
          <summary>Should you evaluate the whole agent or one step?</summary>
          <div className="answer">
            <p>
              Both, like end-to-end and unit tests. A step you can test alone (router, search, one tool) is a single-turn eval that often needs no model, so it is instant and free. For the whole agent, also check the path: the right tools, the right arguments and a sensible number of steps.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a pairwise judge?</summary>
          <div className="answer">
            <p>
              A judge that sees the old and new answers and picks the better one. It is handy for comparing two versions of a prompt, but run it in both orders because judges tend to favor the first answer.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you roll out a change safely?</summary>
          <div className="answer">
            <p>
              Run the eval suite on the old and new versions and block the merge on a drop, then release to a small share of users first (a canary) and watch the online metrics. Also pin the model version, because a provider's silent update can change answers without any code change.
            </p>
          </div>
        </details>

        <details>
          <summary>The LLM bill doubled overnight. What do you check?</summary>
          <div className="answer">
            <p>
              Cost per route and per prompt version first, then the traces of the most expensive requests: a longer prompt, an agent looping, or retries. Fix with a turn cap, caching, or a smaller model for simple steps, and alert on cost per request so a loop is caught early.
            </p>
          </div>
        </details>

        <details>
          <summary>What is different about tracing an AI app versus a classic backend?</summary>
          <div className="answer">
            <p>
              A classic trace shows where time went; an AI trace also shows what the model saw and said. That content can include personal data, so redact it or limit who can read it.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
