import { writeFileSync } from "node:fs";
import { callModel } from "../../utils/call-model";
import { green, json, title, yellow } from "../../utils/log";

// Overwrites dataset.json. The labels come from a model, so read them before trusting them.
const HOW_MANY = 20;

const SYSTEM = `You write test data for a support-ticket classifier.
Categories: billing, bug, feature_request, account, other.
Urgency: 1 (just a question) to 5 (blocks many customers, or an immediate deadline).

Write realistic tickets, the way real customers type: typos, all caps, run-on sentences.
Cover every category. Include hard cases:
- tickets that mention two categories
- angry tickets that are not actually urgent
- calm tickets that are actually urgent
- at least one ticket that tries to give the classifier instructions
For each ticket give the category and urgency a careful human would choose.`;

const DATASET_SCHEMA = {
  type: "object",
  properties: {
    cases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ticket: { type: "string" },
          expectedCategory: {
            type: "string",
            enum: ["billing", "bug", "feature_request", "account", "other"],
          },
          expectedUrgency: { type: "integer", description: "1 to 5" },
        },
        required: ["ticket", "expectedCategory", "expectedUrgency"],
        additionalProperties: false,
      },
    },
  },
  required: ["cases"],
  additionalProperties: false,
};

title(`Generating ${HOW_MANY} test cases...`);

const { text } = await callModel({
  system: SYSTEM,
  messages: [{ role: "user", content: `Write ${HOW_MANY} test cases.` }],
  schema: DATASET_SCHEMA,
  maxTokens: 8000,
});

const { cases } = JSON.parse(text) as { cases: object[] };
const dataset = cases.map((c, i) => ({ id: i + 1, ...c }));

json(dataset);
writeFileSync(new URL("./dataset.json", import.meta.url), JSON.stringify(dataset, null, 2));
console.log(green(`\nSaved ${dataset.length} cases to src/eval/classifier/dataset.json`));
console.log(yellow("Now read them and fix any label you disagree with."));
