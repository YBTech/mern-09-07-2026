import type Anthropic from "@anthropic-ai/sdk";
import { createEvent, deleteEvent, listEvents, updateEvent } from "./lib/calendar-api";
import { getWeather } from "./lib/weather-api";

// Every tool lives inside this AI app: the definitions here, the code that runs them below
export const TOOLS: Anthropic.Tool[] = [
  {
    name: "list_events",
    description: "List every event on the user's calendar, with ids.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "create_event",
    description: "Add an event to the user's calendar.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
        time: { type: "string", description: "HH:MM, 24-hour. Empty for all day." },
        description: { type: "string" },
      },
      required: ["title", "date"],
    },
  },
  {
    name: "update_event",
    description: "Change an existing event. Get its id from list_events first.",
    input_schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
        time: { type: "string", description: "HH:MM, 24-hour" },
        description: { type: "string" },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_event",
    description: "Delete an event. Get its id from list_events first.",
    input_schema: {
      type: "object",
      properties: { id: { type: "number" } },
      required: ["id"],
    },
  },
  {
    name: "get_weather",
    description: "Get the weather forecast for a city on a date, up to 16 days ahead.",
    input_schema: {
      type: "object",
      properties: {
        city: { type: "string" },
        date: { type: "string", description: "YYYY-MM-DD" },
      },
      required: ["city", "date"],
    },
  },
];

export async function runTool(name: string, input: any) {
  switch (name) {
    case "list_events":
      return listEvents();
    case "create_event":
      return createEvent(input);
    case "update_event":
      return updateEvent(input);
    case "delete_event":
      return deleteEvent(input);
    case "get_weather":
      return getWeather(input);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// Demo Jira tools, each maps to a Jira REST endpoint (/rest/api/3/issue/...)
export const JIRA_TOOLS: Anthropic.Tool[] = [
  {
    name: "update_issue", // PUT /issue/{issueIdOrKey}
    description: "Update fields of a Jira issue.",
    input_schema: {
      type: "object",
      properties: {
        issueKey: { type: "string", description: "e.g. PROJ-123" },
        summary: { type: "string" },
        description: { type: "string" },
      },
      required: ["issueKey"],
    },
  },
  {
    name: "delete_issue", // DELETE /issue/{issueIdOrKey}
    description: "Delete a Jira issue.",
    input_schema: {
      type: "object",
      properties: { issueKey: { type: "string" } },
      required: ["issueKey"],
    },
  },
  {
    name: "assign_issue", // PUT /issue/{issueIdOrKey}/assignee
    description: "Assign a Jira issue to a user.",
    input_schema: {
      type: "object",
      properties: { issueKey: { type: "string" }, accountId: { type: "string" } },
      required: ["issueKey", "accountId"],
    },
  },
  {
    name: "get_issue_changelog", // GET /issue/{issueIdOrKey}/changelog
    description: "Get the change history of a Jira issue.",
    input_schema: {
      type: "object",
      properties: { issueKey: { type: "string" } },
      required: ["issueKey"],
    },
  },
  {
    name: "get_transitions", // GET /issue/{issueIdOrKey}/transitions
    description: "List the status transitions available for a Jira issue.",
    input_schema: {
      type: "object",
      properties: { issueKey: { type: "string" } },
      required: ["issueKey"],
    },
  },
  {
    name: "transition_issue", // POST /issue/{issueIdOrKey}/transitions
    description: "Move a Jira issue to a new status. Get the transition id from get_transitions first.",
    input_schema: {
      type: "object",
      properties: { issueKey: { type: "string" }, transitionId: { type: "string" } },
      required: ["issueKey", "transitionId"],
    },
  },
  {
    name: "notify_issue", // POST /issue/{issueIdOrKey}/notify
    description: "Send an email notification about a Jira issue.",
    input_schema: {
      type: "object",
      properties: { issueKey: { type: "string" }, subject: { type: "string" }, body: { type: "string" } },
      required: ["issueKey", "subject"],
    },
  },
];

// Stubbed for the demo: returns fake data instead of calling Jira
export async function runJiraTool(name: string, input: any) {
  switch (name) {
    case "update_issue":
      return { ok: true, updated: input.issueKey };
    case "delete_issue":
      return { ok: true, deleted: input.issueKey };
    case "assign_issue":
      return { ok: true, issue: input.issueKey, assignee: input.accountId };
    case "get_issue_changelog":
      return [{ field: "status", from: "To Do", to: "In Progress" }];
    case "get_transitions":
      return [
        { id: "11", name: "To Do" },
        { id: "21", name: "In Progress" },
        { id: "31", name: "Done" },
      ];
    case "transition_issue":
      return { ok: true, issue: input.issueKey, transitionId: input.transitionId };
    case "notify_issue":
      return { ok: true, notified: input.issueKey };
    default:
      return { error: `Unknown tool: ${name}` };
  }
}




