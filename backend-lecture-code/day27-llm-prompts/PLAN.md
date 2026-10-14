# Day 27 lecture code

- `playground/`: raw Claude API scripts, one per topic (see its README).
- `backend/`: Express + TS + Claude SDK, one file per route in `src/routes/`.
- `frontend/`: React + TS + Vite, one file per page in `src/pages/`.

## Run it

```bash
npm run install:all   # once
npm run dev:all       # backend :3001 + frontend :5173
```

Put `ANTHROPIC_API_KEY` in `backend/.env` (and `playground/.env`).

## Pages

| Page | Route | Endpoint |
|------|-------|----------|
| Chat, no streaming | `/chat` | `POST /api/chat` |
| Chat, streaming | `/chat-stream` | `POST /api/chat-stream` |
| Extract event (structured output) | `/extract-event` | `POST /api/extract-event` |
| Prompt eval | `/eval` | `POST /api/eval` |

## Prompt eval

Type a system prompt, click Run. The backend generates a reply for each of 6 test cases,
a grader model scores each reply 1-5 against that case's criteria, and the page shows the
overall score plus input, reply, score and reason per case. Test cases live in `backend/src/routes/eval.ts`.

Try: the one-line starter prompt scores about 3.5, a prompt with explicit rules scores about 5.
