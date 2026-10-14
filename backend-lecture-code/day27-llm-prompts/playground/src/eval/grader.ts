import { callModel } from "../utils/call-model";

export const GRADER_MODEL = "claude-haiku-5-5";
export const PASS_SCORE = 4;

const GRADER_SYSTEM = `You grade one reply from an AI assistant.
You get the problem the assistant is built for, the user's message, the reply, and the
criteria this reply must meet.

Score from 1 to 5:
5 = meets every criterion
4 = meets every criterion, with a small flaw
3 = misses one criterion
2 = misses several criteria
1 = ignores the criteria, or makes things worse

Give the score and a short reason that names the criterion missed.`;

const GRADE_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", description: "1 to 5" },
    reason: { type: "string" },
  },
  required: ["score", "reason"],
  additionalProperties: false,
};

export async function grade(problem: string, input: string, reply: string, criteria: string[]) {
  const { text } = await callModel({
    model: GRADER_MODEL,
    system: GRADER_SYSTEM,
    messages: [
      {
        role: "user",
        content: `<problem>${problem}</problem>
<user_message>${input}</user_message>
<reply>${reply}</reply>
<criteria>
${criteria.map((c) => `- ${c}`).join("\n")}
</criteria>`,
      },
    ],
    schema: GRADE_SCHEMA,
  });
  return JSON.parse(text) as { score: number; reason: string };
}
