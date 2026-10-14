import Anthropic from "@anthropic-ai/sdk";
import type { Request, Response } from "express";

const client = new Anthropic();

// No streaming: the browser waits until the whole answer is ready
export async function chatRoute(req: Request, res: Response) {
  const { system, messages } = req.body;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 1000,
      system,
      messages,
    });

    const text = response.content.find((block) => block.type === "text")?.text ?? "";
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "The model call failed" });
  }
}
