import { agentV1 } from "./v1";
import { agentV2 } from "./v2";

// The switch: AGENT_VERSION=v1 or v2 picks which agent the chat app AND the evals use (v1 if it isn't set).
//   npm run app:v1        npm run app:v2        AGENT_VERSION=v2 npm run eval:code
export const AGENT_VERSION: "v1" | "v2" = process.env.AGENT_VERSION === "v2" ? "v2" : "v1";

// Both graphs keep the same state (messages + cart), so the rest of the code treats them the same
export const agent = (AGENT_VERSION === "v2" ? agentV2 : agentV1) as typeof agentV2;
