import Anthropic from "@anthropic-ai/sdk";
import { DANA, lookUpOrder, searchPolicy } from "../lib/support";
import { bold, cyan, dim, green, magenta, title, yellow } from "../lib/log";

const client = new Anthropic();

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 👉 START HERE: parallelization
// ════════════════════════════════════════════════════════════════════════════════════════════════

// The three independent checks: each one reads only its own facts
const order = lookUpOrder("A1042");
const CHECKS: Record<string, { facts: string; question: string }> = {
  refund: { facts: `Order: ${JSON.stringify(order)}\nPolicy: ${searchPolicy("refund")}`, question: "Can this be returned, and with what fee? Compare the days since delivery with each time limit." },
  warranty: { facts: `Order: ${JSON.stringify(order)}\nPolicy: ${searchPolicy("warranty")}`, question: "Is this covered by the warranty?" },
  firmware: { facts: `Notes: ${searchPolicy("firmware")}`, question: "Is there a known fix for this problem? Give the version." },
};

async function runParallelization() {
  title("Customer email");
  console.log(cyan(DANA));

  // Sectioning, the slow way first: the three checks one after another
  title("Sectioning: three independent checks");
  let started = Date.now();
  for (const name of Object.keys(CHECKS)) {
    await runCheck(name);
  }
  const sequentialMs = Date.now() - started;
  console.log(dim(`  one after another: ${sequentialMs} ms`));

  // 1. the same checks at once. None needs another's answer, and each writes ITS OWN key, so nobody overwrites anybody
  const state: Record<string, string> = {};
  started = Date.now();
  await Promise.all(
    Object.keys(CHECKS).map(async (name) => {
      state[name] = await runCheck(name);
      console.log(yellow(`      ${name.padEnd(8)} done after ${Date.now() - started} ms`));
    }),
  );
  const parallelMs = Date.now() - started;
  console.log(dim(`  all at once:       ${parallelMs} ms`));

  printState(state);

  // 2. merge: one call reads the shared state, not the three conversations
  title("Merge: one call reads the shared state");
  const reply = await mergeFromState(state);
  console.log(green(`reply > ${reply}`));

  // Voting: the same yes/no question to three judges at once, then take the majority
  title("Voting: three judges, the same question");
  const votes = await Promise.all([1, 2, 3].map(() => askJudge()));
  votes.forEach((v, i) => console.log(yellow(`      judge ${i + 1}: ${v}`)));
  const yes = votes.filter((v) => v === "YES").length;
  console.log(bold(`  majority: ${yes >= 2 ? "YES" : "NO"} (${yes} of 3)`));

  console.log(bold("\nWhat to notice"));
  console.log(`  The three checks took ${parallelMs} ms together instead of ${sequentialMs} ms one after another, because none needed another's answer.`);
  console.log("  They shared data through one state object, each writing its own key. The merge call read only that.");
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔧 Step details (skim)
// ════════════════════════════════════════════════════════════════════════════════════════════════

const text = (r: Anthropic.Message) => r.content.find((b) => b.type === "text")?.text ?? "";

// One check = one small model call. It never sees the other checks.
async function runCheck(name: string) {
  const { facts, question } = CHECKS[name];
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" }, // no hidden reasoning: cheaper, and token counts stay comparable
    max_tokens: 150,
    system: `Answer in one sentence with exact figures, using only these facts:\n${facts}`,
    messages: [{ role: "user", content: `Customer email: ${DANA}\n\nQuestion: ${question}` }],
  });
  return text(response);
}

function printState(state: Record<string, string>) {
  console.log(magenta(`\n  shared state after the checks:`));
  for (const [key, value] of Object.entries(state)) console.log(magenta(`    ${key}: `) + dim(value));
}

async function mergeFromState(state: Record<string, string>) {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 400,
    system: `You are Lumen Audio support. Reply to the customer in under 100 words, plain text, using only these checked facts:\n${JSON.stringify(state, null, 2)}`,
    messages: [{ role: "user", content: DANA }],
  });
  return text(response);
}

async function askJudge() {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    thinking: { type: "disabled" },
    max_tokens: 5,
    messages: [
      {
        role: "user",
        content: `Notes: ${searchPolicy("firmware")}\n\nCustomer email: ${DANA}\n\nIs this problem caused by the firmware 2.4.0 bug? Reply with exactly YES or NO.`,
      },
    ],
  });
  return text(response).trim().toUpperCase().startsWith("YES") ? "YES" : "NO";
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// ▶️ Run it
// ════════════════════════════════════════════════════════════════════════════════════════════════

await runParallelization();
