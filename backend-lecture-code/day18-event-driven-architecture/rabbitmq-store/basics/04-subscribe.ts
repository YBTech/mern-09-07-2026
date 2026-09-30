// Each subscriber gets its OWN queue, bound to the exchange.
//   npm run subscribe -- email      and      npm run subscribe -- sms
//     → two queues, so BOTH get every message (fan-out)
//   npm run subscribe -- email      in two terminals
//     → one shared queue, so the two copies SPLIT the messages
import amqp from "amqplib";

const name = process.argv[2] ?? "subscriber";
const queue = `news.${name}`;

const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();

await channel.assertExchange("news", "fanout", { durable: true });
await channel.assertQueue(queue, { durable: true });
await channel.bindQueue(queue, "news", ""); // "copy everything from news into my queue"

console.log(`[${name}] queue "${queue}" bound to exchange "news", waiting...`);

await channel.consume(queue, (msg) => {
  if (!msg) return;
  console.log(`[${name}] got: ${msg.content.toString()}`);
  channel.ack(msg);
});
