import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { green, json, red, title, yellow } from "./utils/log";

const client = new Anthropic();

const QUESTION = "Tell me about the book Dune.";

// Step 1: just ask for JSON in the prompt
async function step1AskInPrompt() {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    system: "Reply in JSON with the keys title, author, year, genres.",
    messages: [{ role: "user", content: QUESTION }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  title("Step 1: raw text from the model");
  console.log(yellow(text));

  try {
    const book = JSON.parse(text);
    console.log(green("JSON.parse worked:"), book);
  } catch (err) {
    console.log(red(`JSON.parse failed: ${(err as Error).message}`));
  }
}

// Step 2: give the API a JSON Schema, the reply always matches it
const BOOK_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    author: { type: "string" },
    year: { type: "integer", description: "Year first published" },
    genres: { type: "array", items: { type: "string" } },
  },
  required: ["title", "author", "year", "genres"],
  additionalProperties: false,
};

async function step2JsonSchema() {
  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    messages: [{ role: "user", content: QUESTION }],
    output_config: {
      format: { type: "json_schema", schema: BOOK_JSON_SCHEMA },
    },
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  title("Step 2: raw text from the model");
  console.log(yellow(text));

  const book = JSON.parse(text);
  json(book);
}

// Step 3: the schema guarantees the shape, not that the values make sense, so validate too
const BookSchema = z.object({
  title: z.string(),
  author: z.string(),
  year: z.number().int().min(1450).max(new Date().getFullYear()),
  genres: z.array(z.string()).min(1),
});

async function step3ParseAndValidate() {
  const response = await client.messages.parse({
    model: "claude-haiku-5-5",
    max_tokens: 1000,
    messages: [{ role: "user", content: QUESTION }],
    output_config: { format: zodOutputFormat(BookSchema) },
  });

  title("Step 3: already parsed and typed");
  json(response.parsed_output);

  const book = BookSchema.parse(response.parsed_output);
  console.log(green(`${book.title} by ${book.author}, ${book.year}`));
}

await step1AskInPrompt();
// await step2JsonSchema();
// await step3ParseAndValidate();
