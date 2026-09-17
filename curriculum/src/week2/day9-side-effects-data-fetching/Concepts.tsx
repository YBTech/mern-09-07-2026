import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 9 Concepts Reference</title>
      <DayNav day="day9-side-effects-data-fetching" current="concepts" />
      <h1>Day 9 — Concepts Reference</h1>
      <p className="intro">
        Try answering each question yourself before clicking to reveal the answer underneath it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you're shaky on any of these, that's the priority to fix.
        </p>

        <details>
          <summary>What do "mounting" and "unmounting" mean for a component?</summary>
          <div className="answer">
            <p>
              Mounting is the component being created and inserted into the page for the first time.
              Unmounting is it being removed from the page for good — anything it subscribed to needs to
              be torn down at that point.
            </p>
          </div>
        </details>

        <details>
          <summary>
            How does <code>useEffect</code> work? What is its purpose?
          </summary>
          <div className="answer">
            <p>
              It runs a function after React commits a render to the DOM, letting a component synchronize
              with something outside React — a timer, an event listener, a fetch, a subscription. It's
              not a general "run this after render" hook; if the code doesn't touch anything external, it
              usually doesn't belong in an effect.
            </p>
          </div>
        </details>

        <details>
          <summary>
            Explain the dependency array of <code>useEffect</code>.
          </summary>
          <div className="answer">
            <p>
              No array: the effect runs after every render. An empty array (<code>[]</code>): it runs
              once, right after the first render. An array with values (<code>[dep]</code>): it runs
              after the first render, then again any time one of those values changes between renders.
            </p>
          </div>
        </details>

        <details>
          <summary>How do we clean up in <code>useEffect</code>? Why do we need to?</summary>
          <div className="answer">
            <p>
              Return a function from the effect — React calls it right before the effect runs again, and
              when the component unmounts. Without it, anything the effect opened (a timer, a listener, a
              socket) keeps running after the component is gone, leaking resources and firing callbacks
              against state that no longer exists.
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
          <summary>Why might a <code>useEffect</code> call run multiple times unexpectedly?</summary>
          <div className="answer">
            <p>
              In development, <code>React.StrictMode</code> deliberately mounts, unmounts, and re-mounts
              every component once, to force your cleanup function to prove it actually works — this
              doesn't happen in production. Outside of that, a dependency that's a new object/array/function
              created every render will also make the effect "change" and re-run every time.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you avoid infinite re-rendering inside <code>useEffect</code>?</summary>
          <div className="answer">
            <p>
              Give the effect a dependency array so it doesn't re-run after every render, and make sure
              any state it sets isn't also listed in that same array (or that setting it won't keep
              producing a "changed" value forever).
            </p>
          </div>
        </details>

        <details>
          <summary>When handling side effects, how is doing it inside <code>useEffect</code> different from doing it inside an event handler?</summary>
          <div className="answer">
            <p>
              An event handler's side effect runs exactly once, in direct response to a specific user
              action (a click, a submit). An effect's side effect runs in response to a render committing
              — on mount, and again whenever its dependencies change — regardless of what caused that
              render, which is the right tool for "stay in sync with X" rather than "respond to this one action."
            </p>
          </div>
        </details>

        <details>
          <summary>What are the class component lifecycle methods?</summary>
          <div className="answer">
            <p>
              Class components (the pre-hooks way of writing React, not used in this course) expose{" "}
              <code>componentDidMount</code>, <code>componentDidUpdate</code>, and{" "}
              <code>componentWillUnmount</code> — roughly the same three moments <code>useEffect</code>{" "}
              covers with dependency arrays instead of separate named methods. Good to recognize if you
              read older React code; not something you'll write here.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
