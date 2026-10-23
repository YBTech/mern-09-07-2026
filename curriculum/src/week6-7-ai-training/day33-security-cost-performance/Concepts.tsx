import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 33 — Concepts Reference</title>
      <DayNav day="day33-security-cost-performance" current="concepts" />
      <h1>Day 33 — Concepts Reference</h1>
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
          <summary>What is prompt injection, and why does it exist?</summary>
          <div className="answer">
            <p>
              Text the model reads can steer it, so an attacker can make it follow their instructions instead of yours. It exists because the developer's rules, the user's message and any retrieved document all reach the model as one stream of text, and the model can't be sure which words are orders and which are data.
            </p>
          </div>
        </details>

        <details>
          <summary>Why do the classic attacks usually fail now, and which injections still get through?</summary>
          <div className="answer">
            <p>
              The blatant ones — “ignore all previous instructions”, “you are now DAN”, “repeat the text above” — are things modern models are trained to refuse, so on their own they usually fail. The injections that still work are the ones that aren't harmful at all; they just break a rule of your business that the model knows nothing about, so it has no reason to resist. The model's training protects against harm, not against your business rules.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between direct and indirect prompt injection?</summary>
          <div className="answer">
            <p>
              Direct: the attacker types the instruction into the chat. Indirect: it is hidden in something the model reads, such as a retrieved document, a web page, an email or a tool result, so the attacker never has to touch your chat.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the three ways injected text gets into the model?</summary>
          <div className="answer">
            <p>
              The user's own message; retrieved content (RAG), such as a document or web page the bot looks up; and a tool or MCP result. The model reads all three as one stream, so any of them can carry instructions. Only the user's message passes your input guard — RAG and tool content skip it, so you screen them where they enter.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the input guard, and why isn't a keyword filter enough on its own?</summary>
          <div className="answer">
            <p>
              The input guard checks the user's message before the model runs, in two layers: a cheap keyword filter first, then an LLM that judges the intent. The keyword filter only catches exact phrases, so another language, a typo or a reworded request walks past it, and it wrongly blocks innocent messages that use those words. The LLM judge reads the intent instead, but it is a model too, so it is one layer, not the whole wall.
            </p>
          </div>
        </details>

        <details>
          <summary>What are guardrails, and where do they go?</summary>
          <div className="answer">
            <p>
              Checks outside the main model, in layers: an input guard on the user's message; a screen on the content the model reads (label RAG and tool results as data, drop anything that carries instructions); authorization inside the tool before an action; and an output guard in code on the reply. Each has its own false positives, so measure them.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the difference between a model-based guardrail and a code-based one?</summary>
          <div className="answer">
            <p>
              A model check lowers the odds but can be wrong or targeted; a code check always holds, but only for the one thing it checks. Let the model decide what to ask for, and let code decide what is allowed.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you keep an agent's tools safe?</summary>
          <div className="answer">
            <p>
              Authorize inside the tool, using the signed-in user from the session and never from the prompt, and give each tool only the access its task needs (least privilege). Pause risky or large actions for a person to approve.
            </p>
          </div>
        </details>

        <details>
          <summary>What are the three kinds of cache, and what does each save?</summary>
          <div className="answer">
            <p>
              A prompt cache (kept by the provider) makes the repeated prompt prefix about ten times cheaper to read. A response cache (kept by you) returns a stored answer for an identical question. A semantic cache returns a stored answer for a question that means about the same, using embeddings. The last two skip the model call entirely.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you use prompt caching well?</summary>
          <div className="answer">
            <p>
              Put the stable content first (rules, tools, documents) and the changing content last (time, user, question), because the cache matches the exact start of the prompt. Check the cache-read count in the response's usage; if it stays at zero, something at the front keeps changing.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the risk of a semantic cache?</summary>
          <div className="answer">
            <p>
              Similar is not the same: two questions can read almost alike but have different answers (the same item in two sizes) and still score high, so the cache returns the wrong one. Cache only questions whose answer doesn't depend on the user, tune the threshold on real traffic, and never share cached answers that contain one customer's data.
            </p>
          </div>
        </details>

        <details>
          <summary>When should you use a batch API?</summary>
          <div className="answer">
            <p>
              For work nobody is waiting for: nightly labelling, evals, summarising yesterday's tickets. It costs about half as much and returns results later (within 24 hours), so it is wrong for anything live.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you control the cost of an LLM app?</summary>
          <div className="answer">
            <p>
              Cache the stable prefix, batch what can wait, send easy steps to a smaller model, cap tokens and turns, and alert on cost per request and per route. Judge cost per solved task, not per request, because retries and extra turns count.
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
          <summary>What makes an agent dangerous, and how do you reduce the risk?</summary>
          <div className="answer">
            <p>
              Three things together: access to private data, exposure to untrusted content, and a way to send data out. Cut any one (no private data in the prompt, no unknown links, no send tool, or a human approval) and the attack has nowhere to go.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a model cascade, and how is it different from routing?</summary>
          <div className="answer">
            <p>
              A cascade tries a small model first and escalates to a bigger one only when a cheap check (a rule, schema or score) fails. Routing picks the model by task type up front. Measure quality per dollar on your eval set, and compare against one model at lower effort first, which is simpler and keeps one cache.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you handle rate limits and outages?</summary>
          <div className="answer">
            <p>
              Retry only errors that can succeed later (429, 5xx, timeouts) with exponential backoff plus jitter, always set a timeout, then fall back to another model or vendor, then queue the job and tell the user. Don't retry a bad request, it will fail again.
            </p>
          </div>
        </details>

        <details>
          <summary>Why add jitter to retries?</summary>
          <div className="answer">
            <p>
              Without randomness, every client that failed at the same moment retries at the same moment and overloads the service again. A little random delay spreads the retries out.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you make a chat feel fast?</summary>
          <div className="answer">
            <p>
              Optimise time to first token: stream the reply, keep the prompt short (input tokens take time too), run independent steps in parallel, and use a smaller model where the quality allows.
            </p>
          </div>
        </details>

        <details>
          <summary>Which OWASP LLM risks relate to today's topics?</summary>
          <div className="answer">
            <p>
              Prompt injection, sensitive information disclosure, insecure output handling (unvalidated replies, links and images), excessive agency (tools with too much power) and unbounded consumption (no caps on tokens, turns or spend).
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
