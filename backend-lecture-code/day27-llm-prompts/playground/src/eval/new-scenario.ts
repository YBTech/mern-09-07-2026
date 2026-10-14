import { cpSync, existsSync } from "node:fs";
import { SCENARIOS_DIR } from "./scenario";

const name = process.argv[2];
if (!name) {
  console.log("Usage: npm run eval:new -- <scenario-name>");
  process.exit(1);
}

const target = new URL(`${name}/`, SCENARIOS_DIR);
if (existsSync(target)) {
  console.log(`Scenario "${name}" already exists.`);
  process.exit(1);
}

cpSync(new URL("_template/", SCENARIOS_DIR), target, { recursive: true });
console.log(`Created src/eval/scenarios/${name}/`);
console.log("1. Fill in problem.md");
console.log("2. Write prompts/v1.md (add v2.md, v3.md to compare)");
console.log(`3. npm run eval:tests -- ${name}`);
console.log(`4. npm run eval:run -- ${name}`);
