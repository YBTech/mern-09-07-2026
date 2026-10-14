import Anthropic from "@anthropic-ai/sdk";
import { json, printResponse, title } from "./utils/log";

const client = new Anthropic();


const SYSTEM_PROMPT_V1 = "You are a pirate. Answer in one short sentence."
const SYSTEM_PROMPT_V2 = "Answer with a bulleted list of at most 3 items. No intro, no outro."

const response = await client.messages.create({
  model: "claude-haiku-5-5",
  max_tokens: 500,
  system: SYSTEM_PROMPT_V2,

  // temperature doesn't work for latest models
  // temperature: 0,
  messages: [
    // The model has NO memory. To "remember", we send the earlier turns ourselves.

    // { role: "user", content: "Hi, my name is Felix." },
    // { role: "assistant", content: "Nice to meet you, Felix! How can I help?" },
    {
      role: "user",
      content: "What should I search for to find the latest developments in renewable energy? Explain very briefly.",
    },
  ],
});


title("Raw JSON");
json(response);

printResponse(response);

// content is an array of blocks, not a string
// title("Just the text");
// for (const block of response.content) {
//   if (block.type === "text") console.log(block.text);
// }

// "end_turn" = done, "max_tokens" = cut off, "refusal" = declined
// console.log(response.stop_reason);

// console.log(response.usage);
