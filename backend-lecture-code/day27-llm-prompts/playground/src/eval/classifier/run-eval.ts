import { readFileSync } from "node:fs";
import { callModel } from "../../utils/call-model";
import { bold, dim, green, red, title, yellow } from "../../utils/log";
import {
  GRADER_MODEL,
  SUMMARY_PASS_SCORE,
  checkCategory,
  checkUrgency,
  gradeSummary,
} from "./criteria";
import { PROMPTS, type PromptName } from "./prompts";

const PROMPTS_TO_TEST: PromptName[] = ["v1_vague", "v2_definitions", "v3_few_shot"];
const MODELS_TO_TEST = ["claude-haiku-5-5"];
// const MODELS_TO_TEST = ["claude-haiku-5-5", "claude-haiku-4-5"];

// the grader doubles the number of calls
const USE_GRADER = true;

interface EvalCase {
  id: number;
  ticket: string;
  expectedCategory: string;
  expectedUrgency: number;
}

const dataset: EvalCase[] = JSON.parse(
  readFileSync(new URL("./dataset.json", import.meta.url), "utf8"),
);

const TICKET_SCHEMA = {
  type: "object",
  properties: {
    category: { type: "string", enum: ["billing", "bug", "feature_request", "account", "other"] },
    urgency: { type: "integer", description: "1 to 5" },
    summary: { type: "string" },
  },
  required: ["category", "urgency", "summary"],
  additionalProperties: false,
};

async function runCase(testCase: EvalCase, promptName: PromptName, model: string) {
  const { text, usage } = await callModel({
    model,
    system: PROMPTS[promptName],
    messages: [{ role: "user", content: `<ticket>${testCase.ticket}</ticket>` }],
    schema: TICKET_SCHEMA,
  });
  const answer = JSON.parse(text) as { category: string; urgency: number; summary: string };

  const categoryOk = checkCategory(testCase.expectedCategory, answer.category);
  const urgencyOk = checkUrgency(testCase.expectedUrgency, answer.urgency);
  const grade = USE_GRADER ? await gradeSummary(testCase.ticket, answer.summary) : null;

  return {
    testCase,
    answer,
    categoryOk,
    urgencyOk,
    grade,
    tokens: usage.input_tokens + usage.output_tokens,
  };
}

title(`Eval: ${dataset.length} cases · grader: ${USE_GRADER ? GRADER_MODEL : "off"}`);
const summaryRows = [];

for (const model of MODELS_TO_TEST) {
  for (const promptName of PROMPTS_TO_TEST) {
    console.log(bold(`\n${model} · ${promptName}`));
    const started = Date.now();

    const results = await Promise.all(dataset.map((c) => runCase(c, promptName, model)));

    // print only the failures
    for (const r of results) {
      if (!r.categoryOk) {
        console.log(
          red(
            `  ✗ #${r.testCase.id} category: expected ${r.testCase.expectedCategory}, got ${r.answer.category}`,
          ),
          dim(`"${r.testCase.ticket}"`),
        );
      }
      if (!r.urgencyOk) {
        console.log(
          yellow(
            `  ✗ #${r.testCase.id} urgency: expected ${r.testCase.expectedUrgency}, got ${r.answer.urgency}`,
          ),
        );
      }
      if (r.grade && r.grade.score < SUMMARY_PASS_SCORE) {
        console.log(
          yellow(`  ✗ #${r.testCase.id} summary scored ${r.grade.score}: ${r.grade.reason}`),
          dim(`"${r.answer.summary}"`),
        );
      }
    }

    const percent = (passed: number) => `${Math.round((passed / results.length) * 100)}%`;
    summaryRows.push({
      model,
      prompt: promptName,
      category: percent(results.filter((r) => r.categoryOk).length),
      urgency: percent(results.filter((r) => r.urgencyOk).length),
      summary: USE_GRADER
        ? percent(results.filter((r) => r.grade!.score >= SUMMARY_PASS_SCORE).length)
        : "-",
      tokens: results.reduce((sum, r) => sum + r.tokens, 0),
      seconds: ((Date.now() - started) / 1000).toFixed(1),
    });
  }
}

title("Results");
console.table(summaryRows);
console.log(
  green("Higher % is better. Compare tokens too: a better prompt is often a longer one."),
);
