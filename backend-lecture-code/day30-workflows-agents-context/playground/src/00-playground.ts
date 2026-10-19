import Anthropic from "@anthropic-ai/sdk";
import { checkHardReply, EASY_FIRMWARE, EASY_REFUND, EASY_STATUS, HARD, lookUpOrder, searchPolicy } from "./lib/support";
import { cyan, dim, green, isMain, printChecklist, red, title, yellow } from "./lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: the router
// ════════════════════════════════════════════════════════════════════════════════════════════════

export type Result = { reply: string; path: string[]; modelCalls: number; inputTokens: number; outputTokens: number; ms: number };

type Path = { prompt: string; facts: (orderId?: string) => string };
const PATHS: Record<string, Path> = {
  refund: {
    prompt: "You handle returns. Quote the exact fee and time limit from the policy.",
    facts: (id) => `Order: ${JSON.stringify(lookUpOrder(id))}\nPolicy: ${searchPolicy("refund")}`,
  },
  firmware: {
    prompt: "You handle technical problems. Give the exact firmware version that fixes it and how to update.",
    facts: () => `Notes: ${searchPolicy("firmware")}`,
  },
  order_status: {
    prompt: "You handle order questions. Say what was ordered and when it was delivered.",
    facts: (id) => `Order: ${JSON.stringify(lookUpOrder(id))}`,
  },
};

// What the customer gets when no path fits
const HAND_OFF = "Thanks for writing. This one needs a person, so I have passed it to our support team.";

export async function runRouter(email: string, quiet = false): Promise<Result> {
  const started = Date.now();
  const result: Result = { reply: "", path: [], modelCalls: 0, inputTokens: 0, outputTokens: 0, ms: 0 };
  const log = (step: string, detail: string) => {
    result.path.push(step);
    if (!quiet) console.log(yellow(`      ${step.padEnd(9)}`), dim(detail));
  };
  const count = (usage: Anthropic.Usage) => {
    result.modelCalls++;
    result.inputTokens += usage.input_tokens;
    result.outputTokens += usage.output_tokens;
  };

  // 1. the router: a model puts the email in exactly one box (or "other")
  const route = await classifyEmail(email);
  count(route.usage);
  log("route", route.category);

  // 2. code follows the chosen path. "other" has no path → a person takes over
  const path = PATHS[route.category];
  if (!path) {
    result.reply = HAND_OFF;
    log("escalate", "no path for this category");
  } else {
    // the chosen path fetches only its own facts
    const facts = path.facts(email.match(/A\d{4}/)?.[0]);
    log("facts", facts.replace(/\s+/g, " ").slice(0, 90));

    // 3. that path's own prompt writes the reply
    const draft = await draftReply(path, email, facts);
    count(draft.usage);
    result.reply = draft.reply;
    log("draft", `${draft.reply.split(/\s+/).length} words`);
  }

  result.ms = Date.now() - started;
  return result;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

const text = (r: Anthropic.Message) => r.content.find((b) => b.type === "text")?.text ?? "";

// 1. the router: put the email in exactly one box (or "other")
async function classifyEmail(email: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" }, // no hidden reasoning: cheaper, and token counts stay comparable
    max_tokens: 20,
    system: `Classify the customer email. Reply with exactly one word: ${Object.keys(PATHS).join(", ")} or other.`,
    messages: [{ role: "user", content: email }],
  });
  return { category: text(response).trim().toLowerCase(), usage: response.usage };
}

// 3. that path's own prompt writes the reply, using only that path's facts
async function draftReply(path: Path, email: string, facts: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 400,
    system: `You are Lumen Audio support. ${path.prompt} Reply in under 100 words, plain text, using only these facts:\n${facts}`,
    messages: [{ role: "user", content: email }],
  });
  return { reply: text(response), usage: response.usage };
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

const NO_PATH = "Hi, do you sell gift cards? I'd like to buy one for my brother.";

if (isMain(import.meta.url)) {
  for (const email of [EASY_REFUND, EASY_FIRMWARE, EASY_STATUS, NO_PATH]) {
    title("Customer email");
    console.log(cyan(email));
    const result = await runRouter(email);
    console.log(green(`\nreply > ${result.reply}`));
  }

  title("Now an email that fits two boxes at once");
  console.log(cyan(HARD));
  const hard = await runRouter(HARD);
  console.log(green(`\nreply > ${hard.reply}`));

  title("Did it cover everything the customer asked?");
  printChecklist(checkHardReply(hard.reply));
  console.log(red("\nThe model was not the problem. The router had to pick ONE path, so the other half of the email was lost."));
  console.log(dim("Adding a path for this case just moves the problem to the next unusual email."));
}
