import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Request, Response } from "express";
import { z } from "zod";

const client = new Anthropic();

const EventSchema = z.object({
  title: z.string(),
  date: z.iso.date(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  location: z.string(),
});

// Structured output: the reply always matches the schema, so there is no JSON.parse to fail
export async function extractEventRoute(req: Request, res: Response) {
  const { text } = req.body;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const response = await client.messages.parse({
      model: "claude-haiku-5-5",
      max_tokens: 500,
      system: `Extract the calendar event from the text. Today is ${today}. Time is 24-hour HH:MM.`,
      messages: [{ role: "user", content: text }],
      output_config: { format: zodOutputFormat(EventSchema) },
    });

    res.json({ event: response.parsed_output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "The model call failed" });
  }
}
