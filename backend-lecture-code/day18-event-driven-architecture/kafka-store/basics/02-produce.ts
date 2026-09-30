// Appends keyed messages to the "demo" topic and prints where each one
// landed. Run it twice: the same key always goes to the same partition, and
// offsets keep counting up. Nothing is ever overwritten.
//
//   npm run produce                     keys alice, dave, carol, alice, dave, carol
//   npm run produce -- order-1 order-1  your own keys
import { createProducer, ensureTopic } from "../shared/kafka";

const keys = process.argv.length > 2 ? process.argv.slice(2) : ["alice", "dave", "carol", "alice", "dave", "carol"];

await ensureTopic("demo");
const producer = createProducer();
await producer.connect();

for (const key of keys) {
  const [meta] = await producer.send({
    topic: "demo",
    messages: [{ key, value: `hello from ${key} at ${new Date().toLocaleTimeString()}` }],
  });
  console.log(`key=${key.padEnd(8)} → partition ${meta.partition}, offset ${meta.baseOffset}`);
}

await producer.disconnect();
