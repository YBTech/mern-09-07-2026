// Reads the "demo" topic as a member of a consumer group.
//
//   npm run consume -- email         in two terminals → same group: they SPLIT the partitions
//   npm run consume -- email         and
//   npm run consume -- analytics     → different groups: BOTH read every message
//
// Stop it, produce more, start it again: it resumes from its committed offset.
import { createConsumer, ensureTopic, leaveGroupOnExit, logAssignments } from "../shared/kafka";

const groupId = process.argv[2] ?? "demo-group";

await ensureTopic("demo");
const consumer = createConsumer(groupId);
logAssignments(consumer, groupId);
leaveGroupOnExit(consumer);

await consumer.connect();
// fromBeginning only matters the FIRST time a group ever reads this topic.
// After that, the group's committed offset decides where it resumes.
await consumer.subscribe({ topic: "demo", fromBeginning: false });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    console.log(`[${groupId}] partition ${partition}, offset ${message.offset}: ${message.key} → ${message.value}`);
    // Returning without throwing = kafkajs commits this offset for the group.
  },
});
