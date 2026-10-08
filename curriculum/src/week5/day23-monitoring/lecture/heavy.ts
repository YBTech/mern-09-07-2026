// Deliberately slow helpers for the live demos. Not a pattern to copy.

/** Block the main thread for `ms` milliseconds (stands in for real rendering or computing work). */
export function burn(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    /* busy-wait */
  }
}

/** A few hundred milliseconds of pure CPU work. */
export function crunch(): number {
  let n = 0;
  for (let i = 0; i < 2e8; i++) n = (n * 31 + i) % 1000003;
  return n;
}
