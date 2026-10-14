import Anthropic from "@anthropic-ai/sdk";

// Just messages.create with the repeated parts filled in
const client = new Anthropic();

interface CallModelParams {
  messages: Anthropic.MessageParam[];
  system?: string;
  model?: string;
  maxTokens?: number;
  schema?: Record<string, unknown>; // JSON Schema: the reply will match it
}

export async function callModel({
  messages,
  system,
  model = "claude-haiku-5-5",
  maxTokens = 1000,
  schema,
}: CallModelParams) {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages,
    output_config: schema ? { format: { type: "json_schema", schema } } : undefined,
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return { text, usage: response.usage, stopReason: response.stop_reason };
}
