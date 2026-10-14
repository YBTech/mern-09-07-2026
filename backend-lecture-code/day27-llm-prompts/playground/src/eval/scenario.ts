import { existsSync, readdirSync, readFileSync } from "node:fs";

export const SCENARIOS_DIR = new URL("./scenarios/", import.meta.url);

export interface TestCase {
  id: number;
  input: string;
  criteria: string[];
}

export function scenarioDir(name: string | undefined) {
  if (!name) {
    console.log("Pass a scenario name, e.g.: npm run eval:run -- support-bot");
    process.exit(1);
  }
  const dir = new URL(`${name}/`, SCENARIOS_DIR);
  if (!existsSync(dir)) {
    const names = readdirSync(SCENARIOS_DIR).filter((n) => !n.startsWith("_"));
    console.log(`No scenario "${name}". Available: ${names.join(", ")}`);
    process.exit(1);
  }
  return dir;
}

export function loadProblem(name: string) {
  return readFileSync(new URL("problem.md", scenarioDir(name)), "utf8");
}

export function loadDataset(name: string): TestCase[] {
  return JSON.parse(readFileSync(new URL("dataset.json", scenarioDir(name)), "utf8"));
}

// every prompts/*.md file is one system prompt to compare
export function loadPrompts(name: string) {
  const dir = new URL("prompts/", scenarioDir(name));
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => ({ name: file.replace(".md", ""), text: readFileSync(new URL(file, dir), "utf8") }));
}
