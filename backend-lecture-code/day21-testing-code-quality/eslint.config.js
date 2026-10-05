// ESLint reads the code (never runs it) and flags likely bugs:
// unused variables, `==` instead of `===`, etc. Prettier handles formatting.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig(
  { ignores: ["node_modules", "coverage", "playwright-report", "test-results", "pacts"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { eqeqeq: "error" },
  },
);
