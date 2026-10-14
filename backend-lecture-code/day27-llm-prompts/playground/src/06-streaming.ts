import Anthropic from "@anthropic-ai/sdk";
import { bold, cyan, dim, green, magenta, title, yellow } from "./utils/log";

const client = new Anthropic();

const PROMPT = "Write a 200-word short story about a robot who learns to bake bread.";

// Step 1: no streaming, nothing appears until the whole answer is done
async function step1NoStreaming() {
  title("Step 1: no streaming (waiting...)");
  const started = Date.now();

  const response = await client.messages.create({
    model: "claude-haiku-5-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: PROMPT }],
  });

  for (const block of response.content) {
    if (block.type === "text") console.log(block.text);
  }
  console.log(yellow(`\nfirst word after ${Date.now() - started} ms`));
}

// Step 2: streaming, the text arrives piece by piece
async function step2Streaming() {
  title("Step 2: streaming");
  const started = Date.now();
  let firstPieceAt = 0;

  const stream = client.messages.stream({
    model: "claude-haiku-5-5",
    max_tokens: 2000,
    messages: [{ role: "user", content: PROMPT }],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      if (!firstPieceAt) firstPieceAt = Date.now() - started;
      process.stdout.write(event.delta.text);
    }
  }

  const final = await stream.finalMessage();
  console.log(yellow(`\n\nfirst word after ${firstPieceAt} ms`));
  console.log(yellow(`whole answer after ${Date.now() - started} ms`));
  console.log(dim(`stop_reason: ${final.stop_reason}, output tokens: ${final.usage.output_tokens}`));
}

// Step 3: log every event in the stream
async function step3AllEvents() {
  title("Step 3: every stream event");

  const stream = client.messages.stream({
    model: "claude-haiku-5-5",
    max_tokens: 300,
    messages: [{ role: "user", content: "Say hello in five languages, one per line." }],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta") {
      if (event.delta.type === "text_delta") {
        console.log(cyan(event.type), dim("text_delta"), green(JSON.stringify(event.delta.text)));
      } else {
        console.log(cyan(event.type), dim(event.delta.type));
      }
    } else if (event.type === "content_block_start") {
      console.log(magenta(event.type), dim(`block type: ${event.content_block.type}`));
    } else if (event.type === "message_delta") {
      console.log(bold(event.type), dim(`stop_reason: ${event.delta.stop_reason}`));
    } else {
      console.log(bold(event.type));
    }
  }
}

// await step1NoStreaming();
await step2Streaming();
// await step3AllEvents();
