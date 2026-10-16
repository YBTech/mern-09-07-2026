import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createEvent, deleteEvent, listEvents, updateEvent } from "./calendar-api";
import { getWeather } from "./weather-api";

// The same 5 tools as ai-chat/src/tools.ts, now usable by ANY MCP app
const server = new McpServer({ name: "calendar", version: "1.0.0" });

function reply(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data) }] };
}

server.registerTool(
  "list_events",
  { description: "List every event on the user's calendar, with ids." },
  async () => reply(await listEvents()),
);

server.registerTool(
  "create_event",
  {
    description: "Add an event to the user's calendar.",
    inputSchema: {
      title: z.string(),
      date: z.string().describe("YYYY-MM-DD"),
      time: z.string().optional().describe("HH:MM, 24-hour. Empty for all day."),
      description: z.string().optional(),
    },
  },
  async (input) => reply(await createEvent(input)),
);

server.registerTool(
  "update_event",
  {
    description: "Change an existing event. Get its id from list_events first.",
    inputSchema: {
      id: z.number(),
      title: z.string().optional(),
      date: z.string().optional().describe("YYYY-MM-DD"),
      time: z.string().optional().describe("HH:MM, 24-hour"),
      description: z.string().optional(),
    },
  },
  async (input) => reply(await updateEvent(input)),
);

server.registerTool(
  "delete_event",
  {
    description: "Delete an event. Get its id from list_events first.",
    inputSchema: { id: z.number() },
  },
  async (input) => reply(await deleteEvent(input)),
);

server.registerTool(
  "get_weather",
  {
    description: "Get the weather forecast for a city on a date, up to 16 days ahead.",
    inputSchema: { city: z.string(), date: z.string().describe("YYYY-MM-DD") },
  },
  async (input) => reply(await getWeather(input)),
);

// stdio: the app starts this file as a child process. Log with console.error, never console.log.
await server.connect(new StdioServerTransport());
console.error("Calendar MCP server running");
