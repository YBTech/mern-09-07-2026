// Vitest is the TEST RUNNER for everything except E2E. Each "project" is one
// kind of test, so you can run one kind at a time (see package.json scripts).
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    projects: [
      {
        // Backend unit tests: plain Node, no DOM needed.
        test: {
          name: "unit:backend",
          environment: "node",
          include: ["services/**/*.test.ts"],
          // contract tests have their own projects below
          exclude: [...configDefaults.exclude, "services/**/contract/**"],
        },
      },
      {
        // Frontend unit + component tests. "jsdom" is the fake browser DOM
        // (not React's virtual DOM) that React Testing Library renders into.
        plugins: [react()],
        test: {
          name: "unit:web",
          environment: "jsdom",
          include: ["web/**/*.test.{ts,tsx}"],
          exclude: [...configDefaults.exclude, "web/**/contract/**"],
          setupFiles: ["web/src/setupTests.ts"],
        },
      },
      {
        // Two real services talking over real HTTP.
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
        },
      },
      {
        // Pact, consumer side. Each consumer writes its own contract file:
        //   orders -> catalog   services/orders/contract/   pacts/orders-catalog.json
        //   web    -> orders    web/src/api-boundary/contract/   pacts/web-orders.json
        test: {
          name: "contract-consumer",
          environment: "node",
          include: [
            "services/**/contract/*.consumer.test.ts",
            "web/**/contract/*.consumer.test.ts",
          ],
        },
      },
      {
        // Pact, provider side: each provider replays the contracts written
        // about it against its real app.
        test: {
          name: "contract-provider",
          environment: "node",
          include: ["services/**/contract/*.provider.test.ts"],
          testTimeout: 30_000,
        },
      },
    ],

    coverage: {
      provider: "v8",
      include: ["services/**/*.ts", "web/src/**/*.{ts,tsx}"],
      // Excluded on purpose, each for a stated reason, never just to make
      // the number go up:
      //   server.ts, main.tsx  only wire things up and start listening
      //   catalogClient.ts     the network boundary, so unit tests stub it out;
      //                        covered by the integration + contract tests
      //   api.ts               same, on the frontend; covered by its Pact consumer
      //                        test and by E2E
      exclude: [
        "**/*.test.*",
        "**/server.ts",
        "web/src/main.tsx",
        "web/src/setupTests.ts",
        "services/orders/catalogClient.ts",
        "web/src/api-boundary/api.ts",
      ],
      reporter: ["text", "html"],
      // The build fails if coverage drops below these numbers.
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
