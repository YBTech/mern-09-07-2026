// Contract test, provider side (Pact): Catalog replays pacts/orders-catalog.json (written by
// Orders) against the real Catalog app. Run the consumer first: `npm run test:contract` does both.
import path from "node:path";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, it } from "vitest";
import { Verifier } from "@pact-foundation/pact";
import { createCatalogApp, type Product } from "../app";

// The real Catalog app, but with a product list this test controls.
const products: Product[] = [];
let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createCatalogApp(products).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

afterAll(() => {
  server.close();
});

describe("Catalog honours its contracts", () => {
  it("satisfies everything Orders expects", async () => {
    await new Verifier({
      provider: "catalog",
      providerBaseUrl: baseUrl,
      pactUrls: [path.resolve("pacts/orders-catalog.json")],
      logLevel: "warn",
      // Each `.given("...")` in the contract maps to a setup step here.
      stateHandlers: {
        "product 1 exists": async () => {
          products.splice(0, products.length, { id: 1, name: "Keyboard", price: 50, stock: 10 });
        },
        "product 999 does not exist": async () => {
          products.splice(0, products.length);
        },
      },
    }).verifyProvider();
  });
});
