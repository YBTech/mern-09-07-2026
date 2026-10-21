import { Client } from "langsmith";

// Observability: tracing is switched on by environment variables alone (.env: LANGSMITH_TRACING + LANGSMITH_API_KEY).
// LangChain and LangGraph then send every run (each node, model call, tool call and retrieval) to LangSmith by themselves.
// Nothing is deployed: this process on your laptop uploads the traces to your LangSmith account.

// No key yet? Switch tracing off so the app and the raw evals still work before you sign up.
if (!process.env.LANGSMITH_API_KEY) process.env.LANGSMITH_TRACING = "false";

export const TRACING = process.env.LANGSMITH_TRACING === "true";
export const PROJECT = process.env.LANGSMITH_PROJECT ?? "default";

// The LangSmith client: only for what tracing does not do by itself (user feedback, datasets, trace links)
export const langsmith = TRACING ? new Client() : null;

// Feedback is attached to a run inside a project, so we look the project's id up once
let projectId: string | undefined;
export async function getProjectId() {
  projectId ??= (await langsmith!.readProject({ projectName: PROJECT })).id;
  return projectId;
}
