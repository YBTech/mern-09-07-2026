import Anthropic from "@anthropic-ai/sdk";

// The model client to use in src/ai/. It is the normal Anthropic SDK call, `ai.messages.create(...)`,
// with one difference: the model is always MODEL, so the whole class stays on the same cheap model.

export const MODEL = "claude-haiku-5-5";

type CreateParams = Omit<Anthropic.MessageCreateParamsNonStreaming, "model"> & { model?: string };

let client: Anthropic | undefined;

async function create(params: CreateParams): Promise<Anthropic.Message> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is missing: copy .env.example to .env and paste your key");
  }
  client ??= new Anthropic();
  if (params.model && params.model !== MODEL) {
    console.warn(`[llm] model "${params.model}" replaced with ${MODEL}`);
  }

  return client.messages.create({
    thinking: { type: "disabled" }, // cheaper, and token counts stay comparable between students
    ...params,
    model: MODEL,
    stream: false,
  });
}

export const ai = { messages: { create } };
