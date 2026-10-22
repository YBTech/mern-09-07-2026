import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import { HumanMessage } from "langchain";
import { AGENT_VERSION, agent } from "../src/agents";
import { getProjectId, langsmith } from "../src/langsmith";
import { ORDERS } from "../src/shop";
import type { OrderItem } from "../src/shop";

// The one helper every evaluator uses: send a conversation to the agent, exactly like the chat window does,
// and return what the graders look at.
//   reply        the agent's last answer (what the customer reads)
//   cart         the cart at the end (the real state, not what the agent SAYS it did)
//   orderPlaced  whether a card was charged during the conversation
//   toolCalls    every tool the agent called, with its arguments (part of the transcript)
//   runId        the last turn's trace in LangSmith, so we can attach the grade to it
export async function runAgent(messages: string[]) {
  const threadId = `eval-${crypto.randomUUID()}`;
  const ordersBefore = Object.keys(ORDERS).length;
  let runId = "";

  // Record every tool call. LangChain calls handleToolStart before each tool runs (the tool's name is the 7th argument).
  const toolCalls: { name: string; args: Record<string, unknown> }[] = [];
  const toolRecorder = {
    handleToolStart(_tool: unknown, input: string, _runId: string, _parentRunId?: string, _tags?: string[], _metadata?: unknown, toolName?: string) {
      toolCalls.push({ name: toolName ?? "unknown", args: JSON.parse(input) });
    },
  };

  for (const message of messages) {
    runId = crypto.randomUUID();
    await agent.invoke(
      { messages: [new HumanMessage(message)] },
      {
        configurable: { thread_id: threadId },
        callbacks: [toolRecorder],
        runId,
        runName: "eval",
        tags: ["eval", `agent-${AGENT_VERSION}`],
        metadata: { thread_id: threadId, agent_version: AGENT_VERSION },
      },
    );
  }

  const state = await agent.getState({ configurable: { thread_id: threadId } });
  const pausedForConfirmation = state.tasks.some((task) => task.interrupts.length > 0);
  const lastMessage = state.values.messages.at(-1);

  return {
    reply: pausedForConfirmation ? "(paused: waiting for the customer to confirm the order)" : lastMessage.text,
    cart: state.values.cart as OrderItem[],
    orderPlaced: Object.keys(ORDERS).length > ordersBefore,
    toolCalls,
    runId,
  };
}

export type AgentResult = Awaited<ReturnType<typeof runAgent>>;

// Attach a grade to the run's trace in LangSmith (if a key is set), so failed tasks can be filtered and opened there
export async function saveGradeInLangSmith(runId: string, grader: string, pass: boolean, comment: string) {
  if (!langsmith) return;
  await awaitAllCallbacks(); // make sure the trace has been uploaded first
  await langsmith.createFeedback({ runId, sessionId: await getProjectId(), key: grader, score: pass ? 1 : 0, comment });
}

// Wait for the last traces to upload, then exit (the agents keep SQLite and the embedder open)
export async function finish() {
  await awaitAllCallbacks();
  process.exit(0);
}
