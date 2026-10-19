import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import { loadChunks } from "./lib/chunks";
import { hybridSearch } from "./lib/hybrid-search";
import { cyan, dim, green, red, title, yellow } from "./lib/log";
import { buildVectorStore } from "./lib/vector-search";

const chunks = loadChunks();
const vectorStore = await buildVectorStore(chunks);

// Retrieval is now a tool. The model decides when to search, and what for
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
];

const client = new Anthropic();
const SYSTEM = `You are the support assistant for Lumen Audio, an online headphone and speaker store.
Use search_policies before answering any question about a policy, and name the source file you used.
If the search finds nothing useful, say you don't know. Be brief, plain text, no markdown.`;
const MAX_TURNS = 10;
const history: Anthropic.MessageParam[] = [];

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("RAG as a tool (type exit to quit)");

while (true) {
  const question = await terminal.question(cyan("\nyou > "));
  if (question === "exit") break;
  history.push({ role: "user", content: question });

  // The agent loop from yesterday
  let turns = 0;
  while (true) {
    if (++turns > MAX_TURNS) {
      console.log(red("      stopped: too many turns"));
      break;
    }

    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 1000,
      system: SYSTEM,
      tools: TOOLS,
      messages: history,
    });
    history.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") {
      console.log(green(`bot > ${response.content.find((b) => b.type === "text")?.text ?? ""}`));
      break;
    }

    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const { query } = block.input as { query: string };
      console.log(yellow(`      turn ${turns} → search_policies`), dim(JSON.stringify({ query })));

      const found = await hybridSearch(chunks, vectorStore, query);
      for (const chunk of found) console.log(dim(`        found: ${chunk.source} › ${chunk.heading}`));

      const text = found.map((c) => `[${c.source} › ${c.heading}]\n${c.text}`).join("\n\n");
      results.push({ type: "tool_result", tool_use_id: block.id, content: text });
    }
    history.push({ role: "user", content: results });
  }
}

terminal.close();
