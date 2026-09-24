import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("redis client error", err));

// not connected yet — call redisClient.connect() from server.ts on boot.
