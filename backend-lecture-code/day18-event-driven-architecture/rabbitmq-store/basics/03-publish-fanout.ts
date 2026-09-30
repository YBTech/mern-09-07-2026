// Publishes to an EXCHANGE, not a queue. The exchange copies the message into
// every queue bound to it. An exchange stores nothing: if no queue is bound
// yet, the message is simply dropped.
//
//   npm run publish -- "flash sale starts now"
import amqp from "amqplib";

const text = process.argv[2] ?? "hello, everyone";

const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();

await channel.assertExchange("news", "fanout", { durable: true });

channel.publish("news", "", Buffer.from(text)); // "" = routing key; fanout ignores it
console.log(`published to exchange "news": ${text}`);

await channel.close();
await connection.close();
