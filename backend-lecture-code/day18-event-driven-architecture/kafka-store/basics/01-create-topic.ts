// A topic is created on purpose, with a partition count: here, "demo" with 3.
//
//   npm run create-topic
import { kafka } from "../shared/kafka";

const admin = kafka.admin();
await admin.connect();

if (!(await admin.listTopics()).includes("demo")) {
  await admin.createTopics({
    topics: [{ topic: "demo", numPartitions: 3, replicationFactor: 1 }],
    waitForLeaders: true,
  });
}

const { topics } = await admin.fetchTopicMetadata({ topics: ["demo"] });
console.log(`topic "demo" has ${topics[0].partitions.length} partitions`);

await admin.disconnect();
