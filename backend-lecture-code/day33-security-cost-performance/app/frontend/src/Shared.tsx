import { useEffect, useState } from "react";
import { useExplain } from "./Explain";
import type { DemoInfo, Mode, Result } from "./types";

// The top of every demo page: title, which version this is, a link to the other version, and what the attack and fix are
export function DemoHeader({ demo, mode, keepTitle }: { demo: DemoInfo; mode: Mode; keepTitle?: boolean }) {
  const { explain } = useExplain();
  // Explanations hidden: a plain page. Pages that are not a social feed keep their title so they still have a heading.
  if (!explain) return keepTitle ? <h1>{demo.title}</h1> : null;
  const other: Mode = mode === "vulnerable" ? "safe" : "vulnerable";
  return (
    <>
      <div className="title-row">
        <h1>{demo.title}</h1>
        <span className={`pill ${mode === "safe" ? "good" : "bad"}`}>{mode === "safe" ? "SAFE version" : "VULNERABLE version"}</span>
        <a className="switch" href={`#/${demo.id}/${other}`}>Switch to the {other} page →</a>
      </div>
      <p className="story">{demo.story}</p>
      <p className="note bad-note"><b>The attack:</b> {demo.attack}</p>
      {mode === "safe" && <p className="note good-note"><b>The fix:</b> {demo.fix}</p>}
    </>
  );
}

// The guards that ran, and the exact prompts of every model call
export function GuardsAndCalls({ result }: { result: Result }) {
  const { explain } = useExplain();
  if (!explain) return null;
  return (
    <>
      {result.guards.length > 0 && (
        <ul className="guards">
          {result.guards.map((guard) => (
            <li key={guard.name} className={guard.fired ? "fired" : ""}>
              <b>{guard.fired ? "⚠ FIRED" : "✓ passed"}</b> {guard.name}
              <span>{guard.detail}</span>
            </li>
          ))}
        </ul>
      )}

      <details>
        <summary>Under the hood: the {result.calls.length} model call(s)</summary>
        {result.calls.map((call, index) => (
          <div className="call" key={index}>
            <p className="call-label">{index + 1}. {call.label}</p>
            <p className="tag">system prompt</p><pre>{call.system}</pre>
            <p className="tag">user message</p><pre>{call.user}</pre>
            <p className="tag">model reply</p><pre>{call.reply}</pre>
          </div>
        ))}
      </details>
    </>
  );
}

// Talk to the backend: returns the JSON, or throws an Error with the backend's message
export async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Something went wrong");
  return data;
}

// Shows the reply as text, but turns markdown images into real <img> tags, like a chat widget would.
// The browser loads the picture, and that request is what carries the data to the attacker.
export function Reply({ text }: { text: string }) {
  const { explain } = useExplain();
  const parts = text.split(/(!\[[^\]]*\]\([^)\s]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const image = part.match(/^!\[[^\]]*\]\(([^)\s]+)\)$/);
        if (!image) return <span key={index}>{part}</span>;
        // The picture always loads. Only the label that points it out is an explanation.
        return (
          <span key={index} className={explain ? "image-chip" : ""}>
            <img src={image[1]} width={1} height={1} alt="" className="hidden-pixel" />
            {explain && `🖼 image loaded from ${safeHost(image[1])}`}
          </span>
        );
      })}
    </>
  );
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

// The pretend attacker's server log, refreshed every second and a half
export function AttackerPanel() {
  const { explain } = useExplain();
  const [log, setLog] = useState<{ time: string; data: Record<string, string> }[]>([]);

  useEffect(() => {
    const load = () => fetch("/attacker/log").then((response) => response.json()).then(setLog);
    load();
    const timer = setInterval(load, 1500);
    return () => clearInterval(timer);
  }, []);

  if (!explain) return null;

  async function clear() {
    setLog(await (await fetch("/attacker/log", { method: "DELETE" })).json());
  }

  return (
    <div className="attacker">
      <div className="title-row">
        <h3>🕵️ The attacker's server log</h3>
        <button className="ghost" onClick={clear}>Clear</button>
      </div>
      {log.length === 0 ? (
        <p className="muted">Nothing received yet.</p>
      ) : (
        <ul>
          {log.map((entry, index) => (
            <li key={index}>
              <b>{entry.time}</b> received: {Object.entries(entry.data).map(([key, value]) => `${key}=${value}`).join("  ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
