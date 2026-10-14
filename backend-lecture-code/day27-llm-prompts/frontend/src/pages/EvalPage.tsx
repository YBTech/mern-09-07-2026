import { useState } from "react";

type CaseResult = {
  id: number;
  input: string;
  criteria: string[];
  reply: string;
  score: number;
  reason: string;
};

const STARTER_PROMPT = "You are a customer support agent for Pageturner, an online bookshop.";

export default function EvalPage() {
  const [systemPrompt, setSystemPrompt] = useState(STARTER_PROMPT);
  const [overall, setOverall] = useState<number | null>(null);
  const [results, setResults] = useState<CaseResult[]>([]);
  const [running, setRunning] = useState(false);

  async function runEval() {
    setRunning(true);
    const res = await fetch("/api/eval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt }),
    });
    const data = await res.json();
    setOverall(data.overall);
    setResults(data.results);
    setRunning(false);
  }

  return (
    <div>
      <h1>Prompt eval</h1>
      <label>System prompt</label>
      <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={8} />
      <button onClick={runEval} disabled={running}>
        {running ? "Running 6 test cases…" : "Run eval"}
      </button>

      {overall !== null && (
        <>
          <div className="score">
            Overall <strong>{overall.toFixed(1)}</strong> / 5
          </div>
          {results.map((r) => (
            <div key={r.id} className="case">
              <div className="case-head">
                <span>Customer: {r.input}</span>
                <span className={`pill score-${r.score}`}>{r.score} / 5</span>
              </div>
              <p className="criteria">Criteria: {r.criteria.join(" · ")}</p>
              <p>
                <strong>Reply:</strong> {r.reply}
              </p>
              <p className="reason">
                <strong>Grader:</strong> {r.reason}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
