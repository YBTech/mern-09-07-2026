import type { TraceStep } from "../types";

// Records what each stage did, who did it, how long it took and how many tokens it used.

type Usage = { input_tokens: number; output_tokens: number };

export class Trace {
  steps: TraceStep[] = [];
  private tokens = { input: 0, output: 0 };

  // Model calls report their usage here, and the running step picks it up
  addUsage(usage: Usage) {
    this.tokens.input += usage.input_tokens;
    this.tokens.output += usage.output_tokens;
  }

  // Shorthands for the two kinds of stage
  code = <T>(stage: string, work: () => Promise<T> | T, describe: (result: T) => string) =>
    this.step(stage, "code", work, describe);
  model = <T>(stage: string, work: () => Promise<T> | T, describe: (result: T) => string) =>
    this.step(stage, "model", work, describe);

  async step<T>(
    stage: string,
    actor: TraceStep["actor"],
    work: () => Promise<T> | T,
    describe: (result: T) => string,
  ): Promise<T> {
    this.tokens = { input: 0, output: 0 };
    const started = Date.now();
    const result = await work();
    this.steps.push({
      stage,
      actor,
      ms: Date.now() - started,
      tokens: this.tokens,
      note: describe(result),
    });
    return result;
  }
}
