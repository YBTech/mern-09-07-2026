import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// The chat window every Day 30 demo runs in. A demo only supplies `respond`: an async
// function that drives one bot turn through the `Run` handle below. Each call shows up in
// the chat as it happens, so students watch the pattern's shape instead of a flowchart.
//
//   await run.step({ kind: "tool", label: "Look up order", ms: 900, result: "Aria 500" })
//   await Promise.all([run.step(a), run.step(b)])   // parallel steps: just don't await one by one
//   run.note("Routed to: Refund path", "info")
//   await run.say("Hi Dana, …")                       // streams the final reply
//
// No model and no API anywhere: every step is a timer plus hard-coded logic.
//
// "Show AI reasoning" (DemoPage's toggle, read through ShowReasoning) only changes what is
// drawn. Off, a turn looks like a real support chat: typing dots, then the reply. The steps
// still run, just faster, and their events are kept, so switching it back on mid-turn
// reveals everything that already happened.

/** Hidden steps still take time, but a real user shouldn't sit through the slowed-down
 *  lecture pacing behind a typing indicator. */
const HIDDEN_SPEED = 0.35;

export const ShowReasoning = createContext(true);

export type StepKind = "model" | "code" | "tool";
/** "think" draws a note as the model's reasoning rather than a status line. */
type Tone = "ok" | "bad" | "warn" | "info" | "think";

export type StepSpec = {
  kind: StepKind;
  label: string;
  ms: number;
  /** One line shown next to the step once it finishes. */
  result: string;
  tone?: Tone;
  /** What went into the step and what came out, shown when the step is expanded. */
  input?: string;
  output?: string;
};

export type Run = {
  /** Resolves with how long the step took, in ms. */
  step(spec: StepSpec): Promise<number>;
  note(text: string, tone?: Tone): void;
  say(text: string): Promise<void>;
  wait(ms: number): Promise<void>;
};

type StepEvent = StepSpec & { type: "step"; id: number; state: "running" | "done"; tookMs?: number };
type NoteEvent = { type: "note"; id: number; text: string; tone: Tone };
type TextEvent = { type: "text"; id: number; text: string };
type BotEvent = StepEvent | NoteEvent | TextEvent;

type Turn =
  | { role: "user"; id: number; text: string }
  | { role: "bot"; id: number; events: BotEvent[]; done: boolean };

const KIND_TIPS: Record<StepKind, string> = {
  model: "Real app: an LLM call. Here: hard-coded logic behind a timer.",
  code: "Plain code. No model involved, even in a real app.",
  tool: "Real app: the model fills in the arguments and your code runs the function. Here: a lookup in a hard-coded object.",
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function SimBadge() {
  return (
    <span
      className="wf-tip wf-sim"
      tabIndex={0}
      data-tip="Simulated. No model, no API, no network. Each step is a timer plus hard-coded logic (keyword matching, object lookups) so you can watch the pattern's shape. Hover a step's tag to see what it would be in a real app."
    >
      Simulated · no AI ⓘ
    </span>
  );
}

function Step({ ev }: { ev: StepEvent }) {
  const [open, setOpen] = useState(false);
  const hasDetail = ev.input !== undefined || ev.output !== undefined;
  return (
    <div className={`wf-step is-${ev.state}`}>
      <div className="wf-step-row">
        <span className="wf-step-icon">{ev.state === "running" ? <span className="wf-spinner" /> : "✓"}</span>
        <span className={`wf-tip wf-kind kind-${ev.kind}`} tabIndex={0} data-tip={KIND_TIPS[ev.kind]}>
          {ev.kind}
        </span>
        <span className="wf-step-label">{ev.label}</span>
        {ev.state === "running" ? (
          <span className="wf-step-wait">working…</span>
        ) : (
          <span className={`wf-step-result tone-${ev.tone ?? "ok"}`}>→ {ev.result}</span>
        )}
        {ev.tookMs !== undefined && <span className="wf-step-ms">{(ev.tookMs / 1000).toFixed(1)}s</span>}
        {hasDetail && ev.state === "done" && (
          <button className="wf-step-more" onClick={() => setOpen(!open)}>
            {open ? "hide" : "in / out"}
          </button>
        )}
      </div>
      {open && (
        <div className="wf-step-detail">
          {ev.input !== undefined && (
            <>
              <span className="wf-io">in</span>
              <pre>{ev.input}</pre>
            </>
          )}
          {ev.output !== undefined && (
            <>
              <span className="wf-io">out</span>
              <pre>{ev.output}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

type Props = {
  greeting: string;
  /** A flat list, or labelled groups such as { Easy: [...], Hard: [...] }. */
  suggestions: string[] | Record<string, string[]>;
  respond: (text: string, run: Run) => Promise<void>;
  /** Extra controls above the chat, e.g. a mode switch. */
  toolbar?: ReactNode;
};

function TypingDots() {
  return (
    <div className="wf-bubble wf-dots" aria-label="typing">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function ChatDemo({ greeting, suggestions, respond, toolbar }: Props) {
  const showReasoning = useContext(ShowReasoning);
  // read at the start of every step, so flipping the toggle mid-turn changes the pace
  const showRef = useRef(showReasoning);
  showRef.current = showReasoning;
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [turns]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    setBusy(true);

    const botId = nextId.current++;
    setTurns((t) => [...t, { role: "user", id: nextId.current++, text: message }, { role: "bot", id: botId, events: [], done: false }]);

    const edit = (fn: (events: BotEvent[]) => BotEvent[]) =>
      setTurns((t) => t.map((turn) => (turn.role === "bot" && turn.id === botId ? { ...turn, events: fn(turn.events) } : turn)));
    const add = (ev: BotEvent) => edit((events) => [...events, ev]);

    const run: Run = {
      wait,
      async step(spec) {
        const id = nextId.current++;
        add({ ...spec, type: "step", id, state: "running" });
        const ms = showRef.current ? spec.ms : Math.round(spec.ms * HIDDEN_SPEED);
        await wait(ms);
        edit((events) => events.map((e) => (e.id === id ? { ...e, state: "done", tookMs: ms } : e)));
        return ms;
      },
      note(text, tone = "info") {
        add({ type: "note", id: nextId.current++, text, tone });
      },
      async say(full) {
        const id = nextId.current++;
        add({ type: "text", id, text: "" });
        for (let i = 3; i < full.length + 3; i += 3) {
          await wait(16);
          const text = full.slice(0, i);
          edit((events) => events.map((e) => (e.id === id ? { ...e, text } : e)));
        }
      },
    };

    await wait(300);
    await respond(message, run);
    setTurns((t) => t.map((turn) => (turn.role === "bot" && turn.id === botId ? { ...turn, done: true } : turn)));
    setBusy(false);
  }

  return (
    <div className="wf-chat">
      <div className="wf-chat-head">
        <span className="wf-chat-title">Lumen Audio support</span>
        <SimBadge />
        <button className="wf-reset" onClick={() => setTurns([])} disabled={busy || turns.length === 0}>
          Clear
        </button>
      </div>
      {toolbar && <div className="wf-chat-toolbar">{toolbar}</div>}

      <div className="wf-log" ref={logRef}>
        <div className="wf-msg bot">
          <div className="wf-bubble">{greeting}</div>
        </div>
        {turns.map((turn) =>
          turn.role === "user" ? (
            <div key={turn.id} className="wf-msg user">
              <div className="wf-bubble">{turn.text}</div>
            </div>
          ) : (
            <div key={turn.id} className="wf-msg bot">
              {showReasoning && turn.events.length === 0 && <div className="wf-typing">thinking…</div>}
              {!showReasoning && !turn.done && !turn.events.some((e) => e.type === "text") && <TypingDots />}
              {turn.events.map((ev) =>
                !showReasoning && ev.type !== "text" ? null : ev.type === "step" ? (
                  <Step key={ev.id} ev={ev} />
                ) : ev.type === "note" ? (
                  <div key={ev.id} className={`wf-note tone-${ev.tone}`}>{ev.text}</div>
                ) : (
                  <div key={ev.id} className="wf-bubble">{ev.text}</div>
                ),
              )}
            </div>
          ),
        )}
      </div>

      <div className="wf-suggest">
        {Object.entries(Array.isArray(suggestions) ? { "": suggestions } : suggestions).map(([group, items]) => (
          <div key={group} className="wf-suggest-group">
            {group && <span className="wf-suggest-label">{group}</span>}
            {items.map((s) => (
              <button key={s} onClick={() => send(s)} disabled={busy}>
                {s}
              </button>
            ))}
          </div>
        ))}
      </div>
      <form
        className="wf-input"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write to support…" disabled={busy} />
        <button type="submit" disabled={busy || !draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
