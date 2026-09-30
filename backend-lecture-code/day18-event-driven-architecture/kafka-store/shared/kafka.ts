import { Kafka, logLevel, Partitioners, type Consumer, type logCreator } from "kafkajs";

// kafkajs reports some normal, self-healing events as errors, e.g. "the group
// is rebalancing" every time a consumer joins. Hide those so real problems
// stand out in a lecture terminal.
const EXPECTED = ["rebalancing", "coordinator is not available", "not the correct coordinator"];
const quietLogger: logCreator =
  () =>
  ({ level, log }) => {
    if (level > logLevel.WARN) return;
    const text = `${log.message}${log.error ? `: ${log.error}` : ""}`;
    if (EXPECTED.some((e) => text.includes(e))) return;
    console.error(`kafkajs ${level === logLevel.ERROR ? "ERROR" : "WARN"}: ${text}`);
  };

export const kafka = new Kafka({
  clientId: "day18-store",
  brokers: [process.env.KAFKA_BROKER ?? "localhost:9092"],
  logCreator: quietLogger,
  retry: { retries: 10 }, // ride out the broker still booting
});

// The default partitioner: hash(key) % partitionCount. Same key, same
// partition, every time.
export function createProducer() {
  return kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });
}

// Create the "demo" topic for the basics scripts if it doesn't exist yet.
// (The store's "orders" topic is created by `npm run infra:up`.) The
// partition count is chosen up front: it caps how many consumers in one
// group can work in parallel.
export async function ensureTopic(topic: string, numPartitions = 3) {
  const admin = kafka.admin();
  await admin.connect();
  if (!(await admin.listTopics()).includes(topic)) {
    await admin.createTopics({ topics: [{ topic, numPartitions, replicationFactor: 1 }], waitForLeaders: true });
  }
  await admin.disconnect();
}

// Every consumer in this project uses these settings. A 10s session timeout
// (the default is 30s) means a crashed member is noticed and its partitions
// are handed out again quickly, which is what you want in a live demo.
export function createConsumer(groupId: string) {
  return kafka.consumer({ groupId, sessionTimeout: 10_000, heartbeatInterval: 3_000 });
}

// On Ctrl+C, tell the group we're leaving so it hands our partitions to
// someone else right away. Without this, the group only notices when our
// session times out. disconnect() waits for the batch in hand to finish, so
// a slow consumer gets 4s before we give up and exit anyway.
export function leaveGroupOnExit(consumer: Consumer) {
  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.once(signal, async () => {
      await Promise.race([consumer.disconnect(), new Promise((resolve) => setTimeout(resolve, 4_000))]);
      process.exit(0);
    });
  }
}

// Log which partitions this instance was handed every time the group
// rebalances: when a member joins, leaves, or crashes.
export function logAssignments(consumer: Consumer, label: string) {
  consumer.on(consumer.events.GROUP_JOIN, ({ payload }) => {
    const assigned = Object.entries(payload.memberAssignment)
      .map(([topic, partitions]) => `${topic} [${partitions.join(", ")}]`)
      .join("; ");
    console.log(`🔀 [${label}] group "${payload.groupId}" rebalanced → I own partitions: ${assigned || "none (idle)"}`);
  });
}
