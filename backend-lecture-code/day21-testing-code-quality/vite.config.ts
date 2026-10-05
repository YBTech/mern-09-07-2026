// The React app's dev server. /api/* is proxied to the gateway, so the
// browser sees one origin and there's no CORS to configure.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "web",
  plugins: [react()],
  server: {
    port: 4103,
    strictPort: true,
    proxy: { "/api": "http://localhost:4100" },
  },
});
