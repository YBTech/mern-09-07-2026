import { useState } from "react";
import ChatDemo, { type Run, type StepSpec } from "./ChatDemo";
import { DEFAULT_ORDER_ID, FIRMWARE_NOTES, ORDERS, REFUND_WINDOW_DAYS, WARRANTY_DAYS, findOrderId, type Order } from "./data";

// 2.3 Parallelization: independent calls start together and the reply waits for all of them.
//   sectioning  three different checks, merged into one answer
//   voting      the same question asked three times, majority wins
// Each check's timer is different, so they finish in a different order than they started.

type Mode = "sectioning" | "voting";

function sectionChecks(order: Order): StepSpec[] {
  const days = order.daysSinceDelivery ?? 0;
  const buggy = order.product === "Aria 500" && order.firmware === "2.3.1";
  return [
    {
      kind: "model",
      label: "Check refund window",
      ms: 1300,
      result: days <= REFUND_WINDOW_DAYS ? `day ${days} of ${REFUND_WINDOW_DAYS}: refundable` : `day ${days}: past the window`,
      tone: days <= REFUND_WINDOW_DAYS ? "ok" : "bad",
      output: `state.refund = { eligible: ${days <= REFUND_WINDOW_DAYS}, days: ${days} }`,
    },
    {
      kind: "model",
      label: "Check warranty",
      ms: 2100,
      result: days <= WARRANTY_DAYS ? "covered for 1 year" : "expired",
      output: `state.warranty = { covered: ${days <= WARRANTY_DAYS} }`,
    },
    {
      kind: "model",
      label: "Check firmware notes",
      ms: 3000,
      result: buggy ? `v${order.firmware} has the known pairing bug` : `v${order.firmware}: no known issues`,
      tone: buggy ? "warn" : "ok",
      input: FIRMWARE_NOTES,
      output: `state.firmware = { knownBug: ${buggy}, version: "${order.firmware}" }`,
    },
  ];
}

/** Three judges, one dissenter: the majority is right even when one call is wrong. */
function judges(order: Order): StepSpec[] {
  const buggy = order.product === "Aria 500" && order.firmware === "2.3.1";
  const votes: [string, string][] = buggy
    ? [["YES", "matches the 2.3.1 pairing issue"], ["NO", "“broke” could be physical damage"], ["YES", "Aria 500 on v2.3.1"]]
    : [["NO", `v${order.firmware} has no known bug`], ["YES", "symptoms sound like pairing"], ["NO", `the bug is Aria 500 only`]];
  return votes.map(([vote, why], i) => ({
    kind: "model",
    label: `Judge ${i + 1}: is it the firmware bug?`,
    ms: [1500, 2400, 1900][i],
    result: `${vote}: ${why}`,
    tone: vote === "YES" ? "ok" : "bad",
    output: vote,
  }));
}

/** Starts every step at once and reports how long the slowest one took. */
async function runTogether(steps: StepSpec[], run: Run) {
  const started = Date.now();
  const took = await Promise.all(steps.map((s) => run.step(s)));
  const total = took.reduce((sum, ms) => sum + ms, 0);
  run.note(`All ${steps.length} done in ${((Date.now() - started) / 1000).toFixed(1)}s. One after another would have taken ${(total / 1000).toFixed(1)}s.`, "info");
}

async function sectioning(order: Order, run: Run) {
  // 1. three independent checks, all started at once; each writes its own key of the state
  const checks = sectionChecks(order);
  await runTogether(checks, run);

  // 2. model: merge reads the whole state and writes one reply
  const refundable = (order.daysSinceDelivery ?? 0) <= REFUND_WINDOW_DAYS;
  const buggy = checks[2].tone === "warn";
  await run.step({ kind: "model", label: "Merge into one reply", ms: 1400, result: "reply drafted", input: "reads state.refund, state.warranty, state.firmware" });

  await run.say(
    `Hi ${order.customer},\n\n` +
      (refundable
        ? `Your ${order.product} is within our ${REFUND_WINDOW_DAYS}-day window, so you can have a full refund of $${order.price}. `
        : `Your ${order.product} is past the ${REFUND_WINDOW_DAYS}-day refund window, but the 1-year warranty covers a free repair. `) +
      (buggy
        ? `And yes — firmware ${order.firmware} has a known bug where the right earcup stops pairing after sleep. Updating to 2.3.2 fixes it, if you'd rather keep them.`
        : `Your firmware (${order.firmware}) has no known issues, so this looks like a hardware fault.`) +
      `\n\nLumen Audio support`,
  );
}

async function voting(order: Order, run: Run) {
  // 1. the same question, three times at once
  const ballots = judges(order);
  await runTogether(ballots, run);

  // 2. code: count the votes
  const yes = ballots.filter((j) => j.output === "YES").length;
  const isBug = yes * 2 > ballots.length;
  await run.step({ kind: "code", label: "Take the majority", ms: 400, result: `${yes} of ${ballots.length} say YES → ${isBug ? "YES" : "NO"}`, input: `votes = ${JSON.stringify(ballots.map((j) => j.output))}` });

  await run.say(
    `Hi ${order.customer},\n\n` +
      (isBug
        ? `This looks like the known firmware 2.3.1 pairing bug. Updating to 2.3.2 should fix it. If it doesn't, reply here and we'll sort out a refund or repair.`
        : `This doesn't look like a firmware bug: your ${order.product} on v${order.firmware} has no known issues. Reply with what happened and we'll arrange a repair or refund.`) +
      `\n\nLumen Audio support`,
  );
}

export default function ParallelDemo() {
  const [mode, setMode] = useState<Mode>("sectioning");

  async function respond(text: string, run: Run) {
    const order = ORDERS[findOrderId(text) ?? DEFAULT_ORDER_ID] ?? ORDERS[DEFAULT_ORDER_ID];
    if (mode === "sectioning") await sectioning(order, run);
    else await voting(order, run);
  }

  return (
    <ChatDemo
      greeting="Hi! Tell us what's wrong and we'll check everything at once."
      suggestions={[
        "My Aria 500 broke after 10 days. I want a refund, and is this the firmware bug?",
        "My Aria 300 (order A-1002) stopped working, what are my options?",
      ]}
      respond={respond}
      toolbar={
        <div className="wf-modes">
          {(["sectioning", "voting"] as Mode[]).map((m) => (
            <button key={m} className={m === mode ? "is-active" : ""} onClick={() => setMode(m)}>
              {m === "sectioning" ? "Sectioning: different checks" : "Voting: same check ×3"}
            </button>
          ))}
        </div>
      }
    />
  );
}
