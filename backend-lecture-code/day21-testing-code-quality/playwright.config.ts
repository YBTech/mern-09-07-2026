// Playwright is the E2E runner. It starts the WHOLE stack itself (both
// services, the gateway, and the React app), then drives a real browser.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  // Retries hide flakiness instead of fixing it. Allowed in CI only, and the
  // report still marks a retried-then-passed test as "flaky".
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: "http://localhost:4103",
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // Each server must answer its URL before any test starts.
  // reuseExistingServer: if `npm run dev:all` is already running, use it.
  webServer: [
    { command: "npm run catalog", url: "http://localhost:4101/health", reuseExistingServer: true },
    { command: "npm run orders", url: "http://localhost:4102/health", reuseExistingServer: true },
    { command: "npm run gateway", url: "http://localhost:4100/health", reuseExistingServer: true },
    { command: "npm run web", url: "http://localhost:4103", reuseExistingServer: true },
  ],
});
