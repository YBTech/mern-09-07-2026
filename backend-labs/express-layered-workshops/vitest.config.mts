import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // all three test files share one SQLite database file and each one
    // wipes it in beforeEach — running files in parallel means one file's
    // reset can wipe out another file's in-flight test. Keep it simple and
    // just run them one at a time instead of reaching for per-file DB
    // isolation.
    fileParallelism: false,
  },
});
