// Publishes a message no consumer can ever read (it isn't JSON). Every
// subscriber rejects it without requeue, so each copy lands in orders.dlq.
// Look for it at http://localhost:15672/#/queues → orders.dlq → Get messages.
//
//   npm run poison
import { ORDERS_EXCHANGE } from "../shared/events";
import { connect, declareOrdersExchange } from "../shared/rabbit";

const connection = await connect();
const channel = await connection.createChannel();
await declareOrdersExchange(channel);

channel.publish(ORDERS_EXCHANGE, "", Buffer.from("{ this is not json"));
console.log(`published a poison message to exchange "${ORDERS_EXCHANGE}"`);

await channel.close();
await connection.close();
