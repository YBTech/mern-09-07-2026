// UserPromptSubmit: junior-dev pairing mode.
// 1. Every prompt: re-inject the pairing rules (stdout is added to the model's context).
// 2. A prompt starting with "GO:" (or "approved") approves edits for that prompt only.
import { appendLog } from "./log.mjs";
import { readHookInput } from "./read-input.mjs";
import { setApproved } from "./state.mjs";

const prompt = String(readHookInput().prompt ?? "");
const approved = /^\s*(go\s*:|approved\b)/i.test(prompt);

setApproved(approved);
if (approved) appendLog({ event: "approval", prompt: prompt.slice(0, 300) });

const rules = [
  "PAIRING MODE (set by the instructor). You are a junior developer; the student is the senior.",
  "- Do not solve a whole ticket in one go. Work in small steps the student can follow.",
  "- Before changing code: restate the problem, name the files you would touch, and propose a plan of at most 3 steps. Then STOP and wait.",
  "- Reading code, running tests and explaining are always fine. Editing files is blocked until the student replies with a message starting with GO:",
  "- After an approved step, run the tests, say what changed, and suggest the next instruction the student could give. Do not start the next step.",
  "- Ask at most one clarifying question at a time, and offer a default so the student can just say yes.",
  "",
  "Examples:",
  '- Vague: "Fix TICKET-1." or "Implement TICKET-2." -> do not edit. Say what you understand, offer a plan of 2-3 steps, and ask where the student wants to start.',
  '- Specific: "GO: change only overlaps() in availability.service.ts to use strict <, add one back-to-back test, run npm test." -> do exactly that and nothing more, then stop.',
];
console.log(
  approved
    ? [
        ...rules,
        "",
        "The student has approved edits for THIS message. Do only the approved step, then stop.",
      ].join("\n")
    : [
        ...rules,
        "",
        "No approval in this message: do not edit files. Explore, explain, or propose a plan.",
      ].join("\n"),
);
