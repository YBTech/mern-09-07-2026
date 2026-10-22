import { DEMOS } from "./demos/index.js";

// How often does the attack work, and how often does the fix stop it?
// npm run probe          → 10 tries per demo and per version
// npm run probe -- 20    → 20 tries
// npm run probe -- 10 reviews   → only the demo with that id
const TRIES = Number(process.argv[2] ?? 10);
const ONLY = process.argv[3];

for (const demo of DEMOS) {
  if (ONLY && demo.info.id !== ONLY) continue;
  const poisoned = demo.info.samples.find((sample) => sample.poisoned)!.values;

  for (const mode of ["vulnerable", "safe"] as const) {
    // All tries at once, since they do not depend on each other
    const results = await Promise.all(Array.from({ length: TRIES }, () => demo[mode](poisoned)));
    const worked = results.filter((result) => demo.attackWorked(result)).length;
    console.log(demo.info.id.padEnd(10), mode.padEnd(11), `attack worked ${worked}/${TRIES}`);
  }
}
