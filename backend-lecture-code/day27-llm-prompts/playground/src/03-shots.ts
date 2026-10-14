import Anthropic from "@anthropic-ai/sdk";
import { dim, green, title, yellow } from "./utils/log";

const client = new Anthropic();

const SYSTEM = `Classify the customer's support ticket.
Categories: billing, bug, feature_request, account, other.
Also rate the urgency from 1 (can wait) to 5 (critical).`;

const TICKETS = [
  "The app crashes every time I tap Export.",
  "Please cancel my subscription and refund this month.",
  "I can't log in, and I have a client presentation from your app in 10 minutes!!",
];

const ZERO_SHOT: Anthropic.MessageParam[] = [];

// An example is a fake earlier turn: the answer we wish it had given
const ONE_SHOT: Anthropic.MessageParam[] = [
  { role: "user", content: "I was charged twice for my March invoice." },
  { role: "assistant", content: "billing | urgency 4" },
];

const FEW_SHOT: Anthropic.MessageParam[] = [
  { role: "user", content: "I was charged twice for my March invoice." },
  { role: "assistant", content: "billing | urgency 4" },
  { role: "user", content: "It would be nice to have a dark mode." },
  { role: "assistant", content: "feature_request | urgency 1" },
  { role: "user", content: "I want to cancel my plan." },
  { role: "assistant", content: "billing | urgency 2" },
  { role: "user", content: "The password reset email never arrives, and I'm locked out." },
  { role: "assistant", content: "account | urgency 4" },
];

async function classify(examples: Anthropic.MessageParam[], ticket: string) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 500,
    system: SYSTEM,
    messages: [...examples, { role: "user", content: ticket }],
  });

  console.log(yellow(`\n  ticket: ${ticket}`));
  for (const block of response.content) {
    if (block.type === "text") console.log(green(`  answer: ${block.text}`));
  }
  console.log(dim(`  (${response.usage.input_tokens} input tokens)`));
}

const EXAMPLES = ZERO_SHOT;
// const EXAMPLES = ONE_SHOT;
// const EXAMPLES = FEW_SHOT;

title(`${EXAMPLES.length / 2} example(s)`);
for (const ticket of TICKETS) {
  await classify(EXAMPLES, ticket);
}
