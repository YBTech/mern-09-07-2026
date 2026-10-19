import Anthropic from "@anthropic-ai/sdk";
import type { Request, Response } from "express";
import { searchPolicies } from "./search";
import { products } from "./products";

// The agent from playground/09, as an endpoint. Two tools: policy retrieval and the product catalog
const TOOLS: Anthropic.Tool[] = [
  {
    name: "search_policies",
    description:
      "Search Lumen Audio's help documents: refunds, shipping, warranty, repair programs, error codes, firmware releases, product SKUs, promotions and gift cards, price match, loyalty points, trade-in, troubleshooting, support, privacy, and terms of service. Returns the 5 most relevant sections.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string", description: "What to look up, in a few words" } },
      required: ["query"],
    },
  },
  {
    name: "get_products",
    description:
      "Get Lumen Audio's current product catalog: every product's id, name, type (Headphones, Earphones, Speaker, Accessory) and price in USD. Use this for questions about what we sell, product lists, or prices. Takes no input.",
    input_schema: { type: "object", properties: {} },
  },
];

const client = new Anthropic();
const SYSTEM = `You are the support assistant for Lumen Audio, an online headphone and speaker store.
Use search_policies before answering any question about a policy.
Use get_products for questions about which products we sell or what they cost. Product data is not a policy, so do not cite it.
Each search result is labelled with a number like [1]. After every sentence that relies on a result, cite it with that number in square brackets, e.g. "Opened items can be returned within 30 days [1]." Use several like [1][2] if needed. Only cite numbers you were given; never cite for general chit-chat.
If the search finds nothing useful, say you don't know. Be brief, plain text, no markdown.`;
const MAX_TURNS = 10;

export async function chatRoute(req: Request, res: Response) {
  const messages: Anthropic.MessageParam[] = req.body.messages;
  // Position in this array + 1 is the citation number the model sees
  const sources: { source: string; heading: string; foundBy: string[] }[] = [];

  try {
    for (let turn = 1; turn <= MAX_TURNS; turn++) {
      const response = await client.messages.create({
        model: "claude-haiku-5-5",
        max_tokens: 1000,
        system: SYSTEM,
        tools: TOOLS,
        messages,
      });
      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        const reply = response.content.find((b) => b.type === "text")?.text ?? "";
        res.json({ reply, sources });
        return;
      }

      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;

        if (block.name === "get_products") {
          results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(products) });
          continue;
        }

        const { query } = block.input as { query: string };
        const found = await searchPolicies(query);

        // Number each chunk (reusing the number if it was already found), so the model can cite it
        const text = found
          .map((chunk) => {
            let index = sources.findIndex((s) => s.source === chunk.source && s.heading === chunk.heading);
            if (index === -1) index = sources.push({ source: chunk.source, heading: chunk.heading, foundBy: chunk.foundBy }) - 1;
            return `[${index + 1}] ${chunk.source} › ${chunk.heading}\n${chunk.text}`;
          })
          .join("\n\n");
        results.push({ type: "tool_result", tool_use_id: block.id, content: text });
      }
      messages.push({ role: "user", content: results });
    }
    res.json({ reply: "Sorry, that took too many steps.", sources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "The assistant failed" });
  }
}
