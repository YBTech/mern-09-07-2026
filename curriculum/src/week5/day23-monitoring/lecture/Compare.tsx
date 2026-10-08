// The two-column frame every lecture demo uses: the slow version on the left, the fix on the right,
// each with its live demo on top and the essential code underneath.
import { useState, type ReactNode } from "react";
import CodeBlock from "../../../components/CodeBlock";

type Side = { demo: ReactNode; code: string; marks?: number[] };

export function Compare(props: { title: string; hint: string; before: Side; after: Side; replay?: boolean }) {
  const { title, hint, before, after, replay } = props;
  const [run, setRun] = useState(0); // bumping this remounts both demos, so time-based ones restart
  return (
    <section className="fe-block">
      <h3>
        {title}
        {replay && (
          <button className="fe-replay" onClick={() => setRun((r) => r + 1)}>
            ↻ Replay
          </button>
        )}
      </h3>
      <p className="fe-hint">{hint}</p>
      <div className="fe-compare">
        <div className="fe-col before">
          <header>Before: slow</header>
          <div className="fe-demo" key={run}>{before.demo}</div>
          <CodeBlock language="tsx" code={before.code} bad={before.marks} />
        </div>
        <div className="fe-col after">
          <header>After: fixed</header>
          <div className="fe-demo" key={run}>{after.demo}</div>
          <CodeBlock language="tsx" code={after.code} good={after.marks} />
        </div>
      </div>
    </section>
  );
}
