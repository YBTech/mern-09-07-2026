// Contract test, provider side (Pact): Orders replays pacts/web-orders.json (written by the web
// app) against the real Orders app. Orders is also a consumer of Catalog: see catalog.consumer.test.ts.
import path from "node:path";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, it } from "vitest";
import { Verifier } from "@pact-foundation/pact";
import { createOrdersApp } from "../app";
import type { CatalogClient, CatalogProduct } from "../catalogClient";

// Catalog is faked: this file only checks Orders' own API (Orders <-> Catalog is the other contract)
const products = new Map<number, CatalogProduct>();
const fakeCatalog: CatalogClient = {
  getProduct: async (id) => products.get(id) ?? null,
};

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createOrdersApp(fakeCatalog).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

afterAll(() => {
  server.close();
});

describe("Orders honours its contracts", () => {
  it("satisfies everything the web app expects", async () => {
    await new Verifier({
      provider: "orders",
      providerBaseUrl: baseUrl,
      pactUrls: [path.resolve("pacts/web-orders.json")],
      logLevel: "warn",
      // Each `.given("...")` in the contract maps to a setup step here.
      stateHandlers: {
        "product 1 is in stock": async () => {
          products.set(1, { id: 1, name: "Keyboard", price: 50, stock: 10 });
        },
        "product 1 has only 1 left": async () => {
          products.set(1, { id: 1, name: "Keyboard", price: 50, stock: 1 });
        },
      },
    }).verifyProvider();
  });
});
