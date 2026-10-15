import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Request, Response } from "express";

// The agent from ai-chat/06, as an API endpoint. Tools still come from the MCP server.
const mcp = new Client({ name: "calendar-app", version: "1.0.0" });
await mcp.connect(
  new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/server.ts"],
    cwd: new URL("../../../mcp-server", import.meta.url).pathname,
  }),
);
const { tools } = await mcp.listTools();
const TOOLS: Anthropic.Tool[] = tools.map((t) => ({
  name: t.name,
  description: t.description,
  input_schema: t.inputSchema,
}));

const client = new Anthropic();
const MAX_TURNS = 10;

export async function assistantRoute(req: Request, res: Response) {
  const messages: Anthropic.MessageParam[] = req.body.messages;
  const system = `You are a calendar assistant. Today is ${new Date().toDateString()}. Be brief, plain text, no markdown.`;
  const steps: { tool: string; input: unknown }[] = [];

  try {
    for (let turn = 1; turn <= MAX_TURNS; turn++) {
      const response = await client.messages.create({
        model: "claude-haiku-5-5",
        max_tokens: 1000,
        system,
        tools: TOOLS,
        messages,
      });
      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use") {
        const reply = response.content.find((b) => b.type === "text")?.text ?? "";
        res.json({ reply, steps });
        return;
      }

      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        steps.push({ tool: block.name, input: block.input });
        const output = await mcp.callTool({ name: block.name, arguments: block.input as any });
        const text = (output.content as { text: string }[]).map((c) => c.text).join("");
        results.push({ type: "tool_result", tool_use_id: block.id, content: text });
      }
      messages.push({ role: "user", content: results });
    }
    res.json({ reply: "Sorry, that took too many steps.", steps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "The assistant failed" });
  }
}
