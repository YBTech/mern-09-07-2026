import type { TraceStep } from "../types";

// What each stage did, who did it (code or model), how long it took and what it cost in tokens
export default function RunTimeline({ steps }: { steps: TraceStep[] }) {
  return (
    <details className="timeline">
      <summary>How the AI got here ({steps.length} steps)</summary>
      <table>
        <tbody>
          {steps.map((s) => (
            <tr key={s.stage}>
              <td>{s.stage}</td>
              <td>
                <span className={`actor actor-${s.actor}`}>{s.actor}</span>
              </td>
              <td>{s.note}</td>
              <td className="muted num">
                {s.ms} ms
                {s.tokens.input + s.tokens.output > 0 &&
                  ` · ${s.tokens.input}+${s.tokens.output} tokens`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
