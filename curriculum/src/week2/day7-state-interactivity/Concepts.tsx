import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 7 Concepts Reference</title>
      <DayNav day="day7-state-interactivity" current="concepts" />
      <h1>Day 7 — Concepts Reference</h1>
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
          <summary>What is a stateless component?</summary>
          <div className="answer">
            <p>
              A component that renders purely from its props, with no{" "}
              <code>useState</code> of its own — same props always produce the
              same output.
            </p>
          </div>
        </details>

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
          <summary>
            Why must array/object state be updated immutably instead of mutated
            in place?
          </summary>
          <div className="answer">
            <p>
              React decides whether to re-render by comparing the new state
              reference to the old one. Mutating the same array/object and
              setting it again keeps the same reference, so React sees "no
              change" and won't re-render even though the contents changed.
            </p>
          </div>
        </details>

        <details>
          <summary>What's the difference between state and props?</summary>
          <div className="answer">
            <p>
              Props are passed down from a parent and are read-only from the
              child's perspective. State is owned and managed inside the
              component itself, and changing it triggers a re-render of that
              component (and its children).
            </p>
          </div>
        </details>

        <details>
          <summary>What causes a component to re-render?</summary>
          <div className="answer">
            <p>
              Its own state changing, or the props it receives from its parent
              changing (which usually happens because the parent itself
              re-rendered).
            </p>
          </div>
        </details>

        <details>
          <summary>
            Explain how <code>useState</code> works.
          </summary>
          <div className="answer">
            <p>
              It returns a <code>[value, setter]</code> pair. Calling the setter
              schedules a re-render with the new value; React preserves that
              value across renders internally (tied to the component instance)
              instead of resetting it every time the function runs.
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
          <summary>How do you prevent unnecessary re-renders?</summary>
          <div className="answer">
            <p>
              Wrap a component in <code>React.memo</code> so it skips
              re-rendering when its props haven't changed, avoid creating new
              derived state that duplicates what can be computed inline, and
              keep state as local as possible so unrelated components don't
              re-render too.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Why doesn't a state variable update immediately after calling its
            setter, and why pass a function to the setter instead of a value?
          </summary>
          <div className="answer">
            <p>
              A setter schedules an update for the <em>next</em> render rather
              than changing the variable in place — code right after the call
              still sees the old value. Passing a function (
              <code>setCount((prev) =&gt; prev + 1)</code>) instead of a value
              guarantees each update reads the latest queued value, so multiple
              updates in one handler stack correctly.
            </p>
          </div>
        </details>

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

        <details>
          <summary>
            What is React reconciliation?{" "}
           
          </summary>
          <div className="answer">
            <p>
              The algorithm React uses to diff the new virtual DOM tree against
              the previous one and compute the minimal set of real DOM changes
              needed — the mechanism behind "React only updates what changed."
            </p>
          </div>
        </details>

        <details>
          <summary>
            Briefly explain React Fiber.{" "}
           
          </summary>
          <div className="answer">
            <p>
              React's internal reimplementation of reconciliation (since React
              16) as an interruptible, unit-of-work-based process instead of one
              uninterrupted recursive pass — it lets React pause, prioritize,
              and resume rendering work. Deep internals; rarely needed day to
              day, but a classic "how well do you really know React" interview
              question.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
