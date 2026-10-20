# What you get: tools and the model client

Everything below is already built. Import it from your code in `server/src/ai/`.

## `tools` (server/src/tools)

The only way to reach company data. Each tool works in both styles:

```ts
import { tools, readToolSchemas, payClaimSchema, runTool } from "../tools";

// In a workflow step: your code calls the function
const trips = tools.getTravelCalendar({ employeeId: "E01" });

// In an agent: give the model the schemas, then run what it asks for
const response = await ai.messages.create({ max_tokens: 1000, tools: readToolSchemas, messages });
for (const block of response.content) {
  if (block.type === "tool_use") {
    const output = runTool(block.name, block.input); // a string, ready for a tool_result block
  }
}
```

| Tool                | Input                 | Returns                                                                          |
| ------------------- | --------------------- | -------------------------------------------------------------------------------- |
| `getClaim`          | `{ claimId }`         | the claim: employee id, amount, dates, note, receipt text (`""` = no receipt)    |
| `getEmployee`       | `{ employeeId }`      | name, title, department, home city, manager id and name                          |
| `getPolicy`         | `{ topic? }`          | every rule, or only the rules for one topic (`meals`, `hotels`, `receipts`, ...) |
| `getPastClaims`     | `{ employeeId }`      | claims this employee was already paid for                                        |
| `getTravelCalendar` | `{ employeeId }`      | the employee's work trips: city, first and last day                              |
| `payClaim`          | `{ claimId, amount }` | sends money and returns the payment. **Calling it twice pays twice.**            |

- Tools throw a `ToolError` when something is wrong (unknown id, paying more than the claim).
  `runTool` turns errors into text, so an agent can read them and try again.
- `readToolSchemas` has the five read tools. `payClaimSchema` is separate on purpose: decide in your
  design whether a model should ever be able to pay.

## `ai` (server/src/llm.ts)

The Anthropic SDK call you know from the lectures, with the same parameters:

```ts
import { ai } from "../llm";

const response = await ai.messages.create({
  max_tokens: 500,
  system: "...",
  messages: [{ role: "user", content: "..." }],
  // tools, tool_choice: { type: "tool", name: "..." } and so on work as usual
});
```

- The model is always `claude-haiku-5-5`, and thinking is off. You do not pass `model`.
- If a forced tool call comes back with missing fields, check that `response.stop_reason` is not
  `"max_tokens"`, and raise `max_tokens`.
