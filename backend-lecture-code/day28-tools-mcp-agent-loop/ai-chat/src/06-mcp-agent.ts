import Anthropic from "@anthropic-ai/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as readline from "node:readline/promises";
import { cyan, dim, green, red, title, yellow } from "./lib/log";

// Same agent as 05, but tools.ts is gone: the tools come from the MCP server
// Start the MCP server as a child process and connect to it
const mcp = new Client({ name: "terminal-chat", version: "1.0.0" });
await mcp.connect(
  new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/server.ts"],
    cwd: new URL("../../mcp-server", import.meta.url).pathname,
  }),
);

// Ask the server what tools it has, and convert them to the format Claude expects
const { tools } = await mcp.listTools();
const TOOLS: Anthropic.Tool[] = tools.map((t) => ({
  name: t.name,
  description: t.description,
  input_schema: t.inputSchema,
}));
console.log(dim(`Tools from the MCP server: ${TOOLS.map((t) => t.name).join(", ")}`));

const client = new Anthropic();
const SYSTEM = `You are a calendar assistant. Today is ${new Date().toDateString()}.`;
const MAX_TURNS = 10;
const history: Anthropic.MessageParam[] = [];

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
title("Calendar agent + MCP (type exit to quit)");

while (true) {
  const userText = await terminal.question(cyan("\nyou > "));
  if (userText === "exit") break;
  history.push({ role: "user", content: userText });

  // Same agent loop as 05
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

    // Run each requested tool, now on the MCP server
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      console.log(yellow(`      turn ${turns} → ${block.name}`), dim(JSON.stringify(block.input)));
      // Instead of runTool(), ask the MCP server to run it
      const output = await mcp.callTool({ name: block.name, arguments: block.input as any });
      // MCP returns a list of text parts; join them into one string
      const text = (output.content as { text: string }[]).map((c) => c.text).join("");
      results.push({ type: "tool_result", tool_use_id: block.id, content: text });
    }
    history.push({ role: "user", content: results });
  }
}

terminal.close();
await mcp.close();
