import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// PORT is this page's port and API_PORT is the backend's, so two copies (agent v1 and agent v2) can run side by side.
// Requests to /api go to that Express backend.
const port = Number(process.env.PORT ?? 5232);
const apiPort = Number(process.env.API_PORT ?? 3032);

export default defineConfig({
  plugins: [react()],
  server: { port, strictPort: true, proxy: { "/api": `http://localhost:${apiPort}` } },
});
