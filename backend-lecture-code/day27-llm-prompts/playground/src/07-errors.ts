import Anthropic from "@anthropic-ai/sdk";
import { bold, dim, red, title, yellow } from "./utils/log";

// The SDK throws a different class per HTTP status.
// 400/401/404: our fault, fix the code. 429/5xx: wait and retry (the SDK already retries twice).
function explain(err: unknown) {
  if (err instanceof Anthropic.BadRequestError) {
    console.log(red(`400 Bad request → fix our code.`));
  } else if (err instanceof Anthropic.AuthenticationError) {
    console.log(red(`401 Authentication → check ANTHROPIC_API_KEY.`));
  } else if (err instanceof Anthropic.NotFoundError) {
    console.log(red(`404 Not found → is the model name spelled right?`));
  } else if (err instanceof Anthropic.RateLimitError) {
    console.log(yellow(`429 Rate limited → slow down and retry later.`));
  } else if (err instanceof Anthropic.APIError) {
    console.log(yellow(`${err.status} API error → probably temporary, retry later.`));
  } else {
    throw err;
  }
  console.log(dim(`   message: ${(err as Error).message}`));
}

async function case1WrongKey() {
  title("Case 1: wrong API key");
  const badClient = new Anthropic({ apiKey: "sk-ant-this-key-does-not-exist" });
  try {
    await badClient.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 100,
      messages: [{ role: "user", content: "Hi" }],
    });
  } catch (err) {
    explain(err);
  }
}

async function case2WrongModel() {
  title("Case 2: misspelled model");
  const client = new Anthropic();
  try {
    await client.messages.create({
      model: "claude-haiku-55",
      max_tokens: 100,
      messages: [{ role: "user", content: "Hi" }],
    });
  } catch (err) {
    explain(err);
  }
}

async function case3BadParameter() {
  title("Case 3: unsupported parameter");
  const client = new Anthropic();
  try {
    await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 100,
      temperature: 0.7,
      messages: [{ role: "user", content: "Hi" }],
    });
  } catch (err) {
    explain(err);
  }
}

// No exception here, only stop_reason tells us the answer was cut off
async function case4CutOff() {
  title("Case 4: no exception, but the answer is incomplete");
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 30,
    messages: [{ role: "user", content: "Explain how the internet works." }],
  });
  console.log(bold(`stop_reason: ${response.stop_reason}`));
  if (response.stop_reason === "max_tokens") {
    console.log(red("Cut off → raise max_tokens, or ask for a shorter answer."));
  }
}

await case1WrongKey();
await case2WrongModel();
await case3BadParameter();
await case4CutOff();
