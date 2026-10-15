# Day 28: tools, MCP, and the agent loop

A calendar app, then an AI that learns to use it, one step at a time.

```
calendar-app/   the normal full-stack app: Express API (in-memory) + React with FullCalendar
ai-chat/        a terminal chatbot, one file per step (01 → 06)
mcp-server/     the calendar + weather tools as an MCP server
```

```bash
npm run install:all
# put ANTHROPIC_API_KEY in ai-chat/.env and calendar-app/backend/.env
npm run app          # calendar on http://localhost:5173 (keep it running for every step)
```

## Steps

| Step | Run | What changes |
|---|---|---|
| 0 | `npm run app` | A normal calendar app. No AI. |
| 1 | `npm run chat:01` | Just an LLM. "Add lunch Friday" → it says "done", the calendar is unchanged. |
| 2 | `npm run chat:02` | Describe 2 functions in the prompt. The model picks one as JSON. Nothing runs. |
| 3 | `npm run chat:03` | Our code runs the pick and sends the result back. The event appears in the UI. |
| 4 | `npm run chat:04` | The built-in `tools` parameter, 5 tools in `ai-chat/src/tools.ts`, real weather. One round only. |
| 5 | `npm run chat:05` | The agent loop: "check Friday's weather in Toronto, then add a picnic with the forecast". |
| 6 | `npm run chat:06` | Same agent, but the tools come from `mcp-server/`. `tools.ts` is no longer used. |
| 7 | uncomment 2 lines | The agent inside the app: `calendar-app/backend/src/server.ts` and `calendar-app/frontend/src/App.tsx`. |

Extras:
- `npm run mcp:inspect`: list and call the MCP server's tools in the browser, no AI.
- `claude mcp add calendar -- npx tsx mcp-server/src/server.ts`: the same server inside Claude Code.

Weather is [Open-Meteo](https://open-meteo.com): free, no key, forecasts up to 16 days ahead.
