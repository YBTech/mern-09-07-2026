import Anthropic from "@anthropic-ai/sdk";

// The one Anthropic client. The assistant demo uses it directly for its tool-calling loop.
export const client = new Anthropic();

// An older, cheaper model on purpose: many apps in production still run one like it, and it follows more disguised instructions.
export const MODEL = "claude-haiku-4-5";

// One model call, recorded, so the page can show exactly what was sent and what came back.
export type Call = { label: string; system: string; user: string; reply: string };

export async function ask(label: string, system: string, user: string, maxTokens = 600): Promise<Call> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  const reply = response.content[0].type === "text" ? response.content[0].text : "";
  return { label, system, user, reply };
}
