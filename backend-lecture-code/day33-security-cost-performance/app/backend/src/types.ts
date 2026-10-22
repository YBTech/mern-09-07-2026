import type { Call } from "./ask.js";

// What one demo endpoint returns to its page
export type Guard = { name: string; fired: boolean; detail: string };
// data: what the app itself needs from the run (an amount to pay, which reviews were flagged). The text in `output` is for people.
export type DemoResult = { output: string; calls: Call[]; guards: Guard[]; data?: Record<string, unknown> };

// Every demo has the same shape: the same input goes to a vulnerable version and a safe version.
export type Input = Record<string, string>;
export type Demo = {
  info: {
    id: string;
    title: string;
    story: string; // what the app does
    attack: string; // what the poisoned input does
    fix: string; // what the safe version changes
    fields: { name: string; label: string; rows: number }[];
    samples: { label: string; poisoned: boolean; values: Input }[];
  };
  vulnerable: (input: Input) => Promise<DemoResult>;
  safe: (input: Input) => Promise<DemoResult>;
  // For the probe script: did the attack get what it wanted?
  attackWorked: (result: DemoResult) => boolean;
};
