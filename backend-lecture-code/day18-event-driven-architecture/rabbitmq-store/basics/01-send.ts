// A plain queue: the producer drops messages into a named queue and leaves.
// Nobody has to be listening. The messages wait.
//
//   npm run send -- 5        sends 5 messages to the "hello" queue
import amqp from "amqplib";

const count = Number(process.argv[2] ?? 1);

const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();

await channel.assertQueue("hello", { durable: true }); // create it if it's missing

for (let i = 1; i <= count; i++) {
  const text = `message #${i} (${new Date().toLocaleTimeString()})`;
  channel.sendToQueue("hello", Buffer.from(text), { persistent: true });
  console.log(`sent: ${text}`);
}

await channel.close();
await connection.close();
