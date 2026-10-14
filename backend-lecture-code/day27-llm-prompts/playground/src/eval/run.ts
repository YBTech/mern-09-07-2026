import { callModel } from "../utils/call-model";
import { bold, dim, green, red, title } from "../utils/log";
import { PASS_SCORE, grade } from "./grader";
import { loadDataset, loadPrompts, loadProblem } from "./scenario";

const name = process.argv[2];

const MODELS_TO_TEST = ["claude-haiku-5-5"];

const problem = loadProblem(name);
const dataset = loadDataset(name);
const prompts = loadPrompts(name);

async function runCase(systemPrompt: string, testCase: (typeof dataset)[number], model: string) {
  const { text: reply, usage } = await callModel({
    model,
    system: systemPrompt,
    messages: [{ role: "user", content: testCase.input }],
  });
  const { score, reason } = await grade(problem, testCase.input, reply, testCase.criteria);
  return { testCase, reply, score, reason, tokens: usage.input_tokens + usage.output_tokens };
}

title(`Eval "${name}": ${dataset.length} cases × ${prompts.length} prompts`);
const summaryRows = [];

for (const model of MODELS_TO_TEST) {
  for (const prompt of prompts) {
    console.log(bold(`\n${model} · ${prompt.name}`));
    const results = await Promise.all(dataset.map((c) => runCase(prompt.text, c, model)));

    // print only the failures
    for (const r of results.filter((r) => r.score < PASS_SCORE)) {
      console.log(red(`  ✗ #${r.testCase.id} scored ${r.score}`), dim(`"${r.testCase.input}"`));
      console.log(dim(`    ${r.reason}`));
    }

    const passed = results.filter((r) => r.score >= PASS_SCORE).length;
    summaryRows.push({
      model,
      prompt: prompt.name,
      "avg score": (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(2),
      passed: `${passed}/${results.length}`,
      tokens: results.reduce((sum, r) => sum + r.tokens, 0),
    });
  }
}

title("Results");
console.table(summaryRows);
console.log(green(`A reply passes with a score of ${PASS_SCORE}+. Higher is better.`));
