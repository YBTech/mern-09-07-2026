// A brand-new consumer group that starts at offset 0: it reads the topic's
// ENTIRE history, including messages every other group consumed long ago.
// A queue can't do this; once a message was acked, it was gone.
//
//   npm run replay
import { createConsumer, leaveGroupOnExit } from "../shared/kafka";

const groupId = `replay-${Date.now()}`; // new name every run = no committed offsets yet
const consumer = createConsumer(groupId);
leaveGroupOnExit(consumer);

await consumer.connect();
await consumer.subscribe({ topic: "demo", fromBeginning: true });

console.log(`[${groupId}] reading "demo" from the very beginning...`);

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    console.log(`partition ${partition}, offset ${message.offset}: ${message.key} → ${message.value}`);
  },
});
