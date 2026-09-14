import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 6 Concepts Reference</title>
      <DayNav day="day6-components-basics" current="concepts" />
      <h1>Day 6 — Concepts Reference</h1>
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
          <summary>What is a React component?</summary>
          <div className="answer">
            <p>
              A JS function that returns JSX describing a piece of UI. React
              calls it, gets the JSX back, and renders the result.
            </p>
          </div>
        </details>

        <details>
          <summary>What is JSX? Does the browser understand it?</summary>
          <div className="answer">
            <p>
              A syntax extension that lets you write HTML-like markup inside JS.
              The browser never sees it — Vite's build step compiles it into
              plain <code>React.createElement(...)</code> calls.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the virtual DOM?</summary>
          <div className="answer">
            <p>
              A lightweight in-memory copy of the UI tree that React keeps and
              updates on every render. React compares ("diffs") the new version
              against the previous one and patches only what actually changed in
              the real DOM, instead of re-rendering everything from scratch.
            </p>
          </div>
        </details>

        <details>
          <summary>What are props? Are they mutable?</summary>
          <div className="answer">
            <p>
              The arguments passed into a component from its parent — how data
              flows down. They're read-only: a component must never reassign or
              mutate the props object it receives.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a "children" prop?</summary>
          <div className="answer">
            <p>
              Whatever is placed between a component's opening and closing tags,
              passed in automatically as <code>props.children</code> (typed{" "}
              <code>React.ReactNode</code>). It's how wrapper components like a
              card or a modal render whatever content is put inside them.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you handle conditional rendering in React?</summary>
          <div className="answer">
            <p>
              With plain JS inside <code>{"{ }"}</code>: <code>&&</code> to
              render something or nothing, a ternary (<code>? :</code>) to pick
              between two outcomes, or <code>||</code> to fall back to a default
              value. No special template syntax needed.
            </p>
          </div>
        </details>

        <details>
          <summary>Why do we need keys in a list?</summary>
          <div className="answer">
            <p>
              React uses each item's key to match it to the same item from the
              previous render, so it knows which DOM nodes and state to reuse
              versus which items are new, moved, or removed.
            </p>
          </div>
        </details>
      </section>

      <details>
        <summary>Why can't we use a simple index as a key in a list?</summary>
        <div className="answer">
          <p>
            An index looks stable but isn't tied to the item itself — if the
            list is reordered or an item is inserted/removed, every index after
            that point now refers to a different item, so React can mismatch
            state and DOM (like text input contents) to the wrong row.
          </p>
        </div>
      </details>

      <details>
        <summary>What are the requirements for a valid key in a list?</summary>
        <div className="answer">
          <p>
            Unique among siblings and stable across re-renders — the same item
            must get the same key every time, even after reordering. A database
            id, or an id generated once when the item is created, both work;{" "}
            <code>Date.now()</code> or <code>Math.random()</code> at render time
            do not, since they produce a new value every render.
          </p>
        </div>
      </details>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today's lecture covered —
          mostly "gotcha" interview trivia and things that sharpen how you code
          without being asked often.
        </p>

        <details>
          <summary>
            Why React instead of vanilla JS? Why choose React as a UI library?
          </summary>
          <div className="answer">
            <p>
              Vanilla JS UI code means manually finding elements and mutating
              them step by step, which gets error-prone fast as an app grows.
              React lets you describe what the UI should look like for a given
              state, and it handles turning that into the right DOM changes —
              declarative instead of imperative, and reusable via components.
            </p>
          </div>
        </details>

        <details>
          <summary>What is React.StrictMode and why do we need it?</summary>
          <div className="answer">
            <p>
              A development-only wrapper that intentionally renders every
              component twice, to surface impurities (side effects during
              render) early instead of letting them slip into production
              undetected. It has no effect on the production build.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What are "Fragments" in React, and why do we use them?
          </summary>
          <div className="answer">
            <p>
              <code>&lt;&gt;...&lt;/&gt;</code> — a wrapper that groups sibling
              elements to satisfy JSX's "one root element" rule without adding
              an extra, meaningless <code>&lt;div&gt;</code> to the real DOM.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What is PropTypes? Do we need it in React + TypeScript?{" "}
          </summary>
          <div className="answer">
            <p>
              A runtime prop-validation library used in plain-JS React codebases
              before TypeScript was common. With TypeScript, props are already
              checked at compile time, so PropTypes is redundant here and not
              used in this stack.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What is a pure function, and what does it mean for a component to be
            "pure"?
          </summary>
          <div className="answer">
            <p>
              A pure function always returns the same output for the same input
              and doesn't touch anything outside itself. A pure component does
              the same during render: it only computes and returns JSX, with no
              side effects.
            </p>
          </div>
        </details>

        <details>
          <summary>
            What counts as a side effect inside a React component's render?
          </summary>
          <div className="answer">
            <p>
              Anything that affects the outside world as a byproduct of calling
              the function: mutating a variable declared outside the component,
              writing to the DOM directly, logging, or firing a network request
              in the function body instead of in an event handler or{" "}
              <code>useEffect</code>.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
