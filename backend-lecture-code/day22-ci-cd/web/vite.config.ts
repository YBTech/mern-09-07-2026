import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // In development, forward API calls to the Express server (npm run dev in api/).
  server: { port: 5122, proxy: { "/version": "http://localhost:3022", "/products": "http://localhost:3022", "/orders": "http://localhost:3022" } },
  test: {
    // jsdom = a fake browser DOM in Node, so React Testing Library can render
    // components on a CI machine that has no browser.
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
  },
});
