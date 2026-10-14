import { callModel } from "../../utils/call-model";

// Code checks: exact and free. Use them whenever there is a right answer.
export function checkCategory(expected: string, actual: string) {
  return expected === actual;
}

// Urgency is a judgement call, so off by one is fine
export function checkUrgency(expected: number, actual: number) {
  return Math.abs(expected - actual) <= 1;
}

// Grader model: for what code can't check, like "is this summary faithful?"
export const GRADER_MODEL = "claude-haiku-5-5";

const GRADER_SYSTEM = `You grade one-sentence summaries of customer support tickets.

Score from 1 to 5:
5 = accurate, complete, one neutral sentence, nothing invented
4 = accurate, with a small issue (slightly long, slightly vague)
3 = mostly accurate but misses the main point or adds an opinion
2 = contains a detail that is not in the ticket
1 = wrong or unrelated

Give the score and a short reason.`;

const GRADE_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", description: "1 to 5" },
    reason: { type: "string" },
  },
  required: ["score", "reason"],
  additionalProperties: false,
};

export const SUMMARY_PASS_SCORE = 4;

export async function gradeSummary(ticket: string, summary: string) {
  const { text } = await callModel({
    model: GRADER_MODEL,
    system: GRADER_SYSTEM,
    messages: [
      { role: "user", content: `<ticket>${ticket}</ticket>\n<summary>${summary}</summary>` },
    ],
    schema: GRADE_SCHEMA,
  });
  return JSON.parse(text) as { score: number; reason: string };
}
