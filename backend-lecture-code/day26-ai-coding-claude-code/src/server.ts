import { createApp } from "./app";
import { config } from "./config";
import { resetData } from "./data/reset";

resetData();
createApp().listen(config.port, () => {
  console.log(`Bookshop API listening on http://localhost:${config.port}`);
});
