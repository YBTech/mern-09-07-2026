import { app } from "./app.js";

const PORT = Number(process.env.PORT ?? 3022);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
