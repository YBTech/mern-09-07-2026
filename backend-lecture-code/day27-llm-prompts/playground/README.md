# Day 27 playground

Raw Claude API calls for the lecture, one file per topic. Not a server: each file is run on
its own with an npm script and edited live (uncomment a line, save, re-run).

```bash
cp .env.example .env    # paste ANTHROPIC_API_KEY
npm install
```

| Script                                     | File                     | Topic                                                        |
| ------------------------------------------ | ------------------------ | ------------------------------------------------------------ |
| `npm run anatomy` / `anatomy:watch`        | `01-anatomy.ts`          | `messages.create` fields, and how to read the response       |
| `npm run system` / `system:watch`          | `02-system-prompts.ts`   | Same question, four system prompts (incl. guardrails)        |
| `npm run shots` / `shots:watch`            | `03-shots.ts`            | Zero-shot vs one-shot vs few-shot                            |
| `npm run structured` / `structured:watch`  | `04-structured-output.ts`| Ask for JSON → `output_config.format` → validate with Zod     |
| `npm run chat`                             | `05-multi-turn.ts`       | Terminal chat: history is resent every call                  |
| `npm run stream`                           | `06-streaming.ts`        | Time to first word, with and without streaming; raw events   |
| `npm run errors`                           | `07-errors.ts`           | Real 401 / 404 / 400, and a cut-off answer with no exception |
| `npm run eval:classifier`                  | `eval/classifier/`       | Code-check eval for the ticket classifier (exact answers)    |

## Eval for any scenario

Think about the problem first, then write the prompt, then test it. Each scenario is a folder in
`src/eval/scenarios/`:

```
support-bot/
  problem.md      who uses it, what a good and a bad reply look like
  prompts/v1.md   one system prompt per file; add v2.md, v3.md to compare
  dataset.json    test cases: a user message + criteria (written by the model, read by you)
```

```bash
npm run eval:new -- my-scenario          # copy the template
# fill in problem.md and prompts/v1.md
npm run eval:tests -- my-scenario        # a model writes dataset.json from problem.md (--force to redo)
npm run eval:run -- my-scenario          # every prompt × every case, a grader model scores 1-5
```

Examples to read: `support-bot`, `code-helper`.

- Files 01-04 call `client.messages.create` directly. From 05 on, the repeated lines move into
  `utils/call-model.ts`, a thin wrapper that is still just `messages.create`.
- `utils/log.ts` is only pretty console output.
- Current models reject `temperature` (400). The anatomy file explains how to show it on `claude-haiku-4-5`.
- Current models can return a `thinking` block before the `text` block, so read the text by block type.
