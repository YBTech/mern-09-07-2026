import { createCatalogApp } from "./app";

const PORT = Number(process.env.PORT ?? 4101);

createCatalogApp().listen(PORT, () => {
  console.log(`catalog listening on http://localhost:${PORT}`);
});
