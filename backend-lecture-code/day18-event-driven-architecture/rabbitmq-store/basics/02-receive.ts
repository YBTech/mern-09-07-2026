// Reads from the "hello" queue. Run it in two terminals and the messages are
// split between them: each message goes to exactly ONE consumer.
//
//   npm run receive -- worker-A
import amqp from "amqplib";

const name = process.argv[2] ?? "worker";

const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();

await channel.assertQueue("hello", { durable: true });
await channel.prefetch(1); // one unacked message at a time, so workers take turns

console.log(`[${name}] waiting for messages on "hello"...`);

await channel.consume("hello", (msg) => {
  if (!msg) return;
  console.log(`[${name}] got: ${msg.content.toString()}`);
  channel.ack(msg); // "done". Only now does RabbitMQ delete the message.
});
