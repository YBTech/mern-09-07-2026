// Where every service lives. All six run on your machine; change PORT_BASE if 4000-4005 are taken.
const BASE = Number(process.env.PORT_BASE ?? 4000);

export const PORTS = {
  gateway: BASE,
  catalog: BASE + 1,
  orders: BASE + 2,
  inventory: BASE + 3,
  payments: BASE + 4,
  notifications: BASE + 5,
} as const;

export type ServiceName = keyof typeof PORTS;

export const urlOf = (service: ServiceName) => `http://localhost:${PORTS[service]}`;
