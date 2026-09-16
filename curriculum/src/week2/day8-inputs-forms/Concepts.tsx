import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 8 Concepts Reference</title>
      <DayNav day="day8-inputs-forms" current="concepts" />
      <h1>Day 8 — Concepts Reference</h1>
      <p className="intro">
        Try answering each question yourself before clicking to reveal the
        answer underneath it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up
          constantly in interviews. If you're shaky on any of these, that's the
          priority to fix.
        </p>

        <details>
          <summary>
            What's the difference between{" "}
            <code>
              onClick={"{"}handleClick{"}"}
            </code>
            ,{" "}
            <code>
              onClick={"{"}handleClick(){"}"}
            </code>
            , and{" "}
            <code>
              onClick={"{"}() =&gt; handleClick(id){"}"}
            </code>
            ?
          </summary>
          <div className="answer">
            <p>
              The first passes the function itself, so React calls it on click —
              correct.The second calls it immediately during render and passes
              its return value as the handler, which is almost never what you
              want. The third wraps it in a new arrow function so it can be
              called later, with an argument, on click.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a controlled component?</summary>
          <div className="answer">
            <p>
              A form element whose displayed value is always driven by React
              state via a <code>value</code> prop, with every change routed back
              through <code>onChange</code> — the DOM element never holds its
              own independent value.
            </p>
          </div>
        </details>

        <details>
          <summary>What is two-way data binding in React?</summary>
          <div className="answer">
            <p>
              React doesn't have automatic two-way binding — you build it
              explicitly with a controlled input: state flows into the input via{" "}
              <code>value</code>, and input changes flow back into state via{" "}
              <code>onChange</code>.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today's lecture covered —
          mostly "gotcha" interview trivia and things that sharpen how you code
          without being asked often.
        </p>

        <details>
          <summary>How do you perform form input validation?</summary>
          <div className="answer">
            <p>
              Check the controlled state values in the <code>onSubmit</code>{" "}
              handler (after <code>e.preventDefault()</code>), and store a
              validation error in state to conditionally render a message — the
              same pattern as any other conditional rendering.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What is a Synthetic Event?{" "}

          </summary>
          <div className="answer">
            <p>
              React's cross-browser wrapper around the native DOM event, passed
              into every event handler (e.g. the <code>e</code> in{" "}
              <code>handleSubmit(e)</code>). It normalizes event behavior across
              browsers and pools/reuses event objects for performance.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
