// CPU and memory of THIS service's process: the "resource saturation" half of the golden signals.
// (Node's event loop and heap metrics come from the auto-instrumentation; process CPU doesn't.)
import { metrics } from "@opentelemetry/api";

const toMicros = (usage: NodeJS.CpuUsage) => usage.user + usage.system;

// Call this AFTER sdk.start(): gauges created before there is a real MeterProvider are silently dropped.
export function registerProcessMetrics() {
  const meter = metrics.getMeter("process");
  let lastCpuMicros = toMicros(process.cpuUsage());
  let lastAt = performance.now();

  meter
    .createObservableGauge("process.cpu.utilization", { unit: "1", description: "Share of ONE CPU core this process used since the last scrape (1.0 = a full core)" })
    .addCallback((result) => {
      const nowMicros = toMicros(process.cpuUsage());
      const now = performance.now();
      result.observe((nowMicros - lastCpuMicros) / ((now - lastAt) * 1000));
      lastCpuMicros = nowMicros;
      lastAt = now;
    });

  meter
    .createObservableGauge("process.memory.rss", { unit: "By", description: "Resident memory of the process" })
    .addCallback((result) => result.observe(process.memoryUsage.rss()));
}
