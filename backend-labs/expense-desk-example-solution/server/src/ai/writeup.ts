import type Anthropic from "@anthropic-ai/sdk";
import type { Decision, GateHit } from "../types";
import { UNTRUSTED_NOTE, callForced, field } from "./model";
import type { Trace } from "./trace";
import type { ClaimContext, Verdict } from "./types";

// Stage 7: the words. A summary for the reviewer and an email for the employee; two email drafts when a person decides.

export type WriteUp = { summary: string; email: string; ifApproved: string; ifRejected: string };

const SYSTEM = `You write for a finance team at Brightline. Use the facts you are given; invent nothing and change no numbers.
- summary: one or two plain sentences for the reviewer: what was claimed, what is proposed and why.
- email: a short, friendly note to the employee that states the amount and names the rule behind the decision. If a person still has to decide, say it is waiting for review.
- When a person decides, also write ifApproved and ifRejected: the final email for each outcome.
${UNTRUSTED_NOTE}`;

const TOOL: Anthropic.Tool = {
  name: "recordWriteUp",
  description: "Record the summary and the email(s).",
  input_schema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      email: { type: "string" },
      ifApproved: { type: "string", description: "Only when a person decides" },
      ifRejected: { type: "string", description: "Only when a person decides" },
    },
    required: ["summary", "email"],
  },
};

export type Facts = {
  decision: Decision;
  verdict: Verdict;
  gates: GateHit[];
  payable: number;
};

export function writeUp(
  { claim, receipt, evidence, flags }: ClaimContext,
  facts: Facts,
  trace: Trace,
): Promise<WriteUp> {
  const personDecides = facts.gates.length > 0;
  return callForced({
    system: SYSTEM,
    content: [
      `<facts>${JSON.stringify({
        employee: evidence.employee.name,
        claimed: claim.amount,
        merchant: receipt.merchant,
        decision: facts.decision,
        amountToPay: facts.payable,
        rules: facts.verdict.ruleIds,
        reasons: facts.verdict.reasons,
        flags: flags.map((f) => f.message),
        waitingFor: personDecides ? facts.gates.map((g) => g.title) : [],
      })}</facts>`,
    ].join("\n"),
    tool: TOOL,
    validate: (input) => toWriteUp(input, personDecides),
    trace,
    maxTokens: 1200,
  });
}

function toWriteUp(input: Record<string, unknown>, personDecides: boolean): WriteUp {
  const email = field.string(input.email, "email");
  return {
    summary: field.string(input.summary, "summary"),
    email,
    ifApproved: personDecides ? field.string(input.ifApproved, "ifApproved") : email,
    ifRejected: personDecides ? field.string(input.ifRejected, "ifRejected") : email,
  };
}
