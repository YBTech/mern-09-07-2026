import { createApp } from "./app";
import { initDb } from "./db";

const port = Number(process.env.PORT ?? 3001);

initDb();
createApp().listen(port, () => {
  console.log(
    `RoomBook API on http://localhost:${port} (in-memory SQLite: data resets on restart)`,
  );
});
