import Anthropic from "@anthropic-ai/sdk";
import { listFiles, readFile } from "./incident";
import { runAgent } from "./loop";

// The worker (also called a subagent) that steps 10 and 11 share: an agent loop in a FRESH window.
// It gets a brief, reads whatever incident files it needs, and returns only a short report.
// Step 10 starts it from our code; step 11 starts it from the lead agent's tool call. Same worker, different caller.

const WORKER_TOOLS: Anthropic.Tool[] = [
  { name: "list_files", description: "List the incident files.", input_schema: { type: "object", properties: {} } },
  {
    name: "read_file",
    description: "Read one incident file completely.",
    input_schema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  },
];

export function runWorker(brief: string, label = "  worker") {
  return runAgent({
    label,
    system:
      "You are a researcher for Lumen Audio. Read the incident files you need and answer the brief with exact figures, under 120 words. " +
      "End with two lines: 'Sources: <file names>' and 'Not found: <what you could not find, or none>'.",
    task: brief,
    tools: WORKER_TOOLS,
    run: (name, args: { name?: string }) => (name === "list_files" ? listFiles().join("\n") : readFile(args.name ?? "")),
  });
}
