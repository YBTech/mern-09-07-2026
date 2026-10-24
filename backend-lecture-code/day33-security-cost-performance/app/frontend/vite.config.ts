import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The page is on 5234 and the Express backend on 3034. /api (the demos) and /attacker (the pretend
// attacker's server) are both forwarded to it.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5234,
    strictPort: true,
    proxy: { "/api": "http://localhost:3034", "/attacker": "http://localhost:3034" },
  },
});
