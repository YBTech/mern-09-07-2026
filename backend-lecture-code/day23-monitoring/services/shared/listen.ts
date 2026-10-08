// Start a service, and shut it down cleanly when `tsx watch` restarts it after a file edit.
//
// Why this exists: OpenTelemetry registers its own SIGTERM handler (to flush telemetry), which
// stops Node from exiting on SIGTERM by itself. Without the handler below, every save would make
// tsx wait 5 seconds and then force-kill the service.
import type { Express } from "express";
import { logger } from "./logger";
import { PORTS, type ServiceName } from "./ports";

export function listen(app: Express, service: ServiceName) {
  const server = app.listen(PORTS[service], () =>
    logger.info(`${service} listening on http://localhost:${PORTS[service]}`),
  );

  process.once("SIGTERM", () => {
    server.close();
    // Give OpenTelemetry a moment to send the last batch of telemetry, then exit.
    setTimeout(() => process.exit(0), 300);
  });
}
