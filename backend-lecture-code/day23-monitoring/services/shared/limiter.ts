// A counting semaphore. Three things in this demo are "a limited number of slots, and everyone
// else waits in line": the DB connection pool, a row lock (1 slot), and the payment provider.
// Waiting in line is invisible in the code, but it is exactly what a saturated system looks like
// in Grafana: queue length climbs, then latency does.
export class Semaphore {
  private inUse = 0;
  private readonly waiters: Array<() => void> = [];

  constructor(readonly size: number) {}

  get active() {
    return this.inUse;
  }

  get waiting() {
    return this.waiters.length;
  }

  /** Resolves when a slot is free. Returns how many ms we had to wait for it. */
  async acquire(): Promise<number> {
    if (this.inUse < this.size) {
      this.inUse++;
      return 0;
    }
    const start = performance.now();
    await new Promise<void>((resolve) => this.waiters.push(resolve));
    return performance.now() - start; // the slot was handed over directly, inUse is unchanged
  }

  release() {
    const next = this.waiters.shift();
    if (next) next();
    else this.inUse--;
  }
}
