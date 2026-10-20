import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Requests to /api go to the Express backend
export default defineConfig({
  plugins: [react()],
  server: { port: 5231, proxy: { "/api": "http://localhost:3031" } },
});
