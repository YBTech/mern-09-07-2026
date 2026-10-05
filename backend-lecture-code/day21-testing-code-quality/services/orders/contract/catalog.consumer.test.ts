// Contract test, consumer side (Pact): Orders writes down what it needs from Catalog.
// Catalog replays that file in catalog.provider.test.ts, so a breaking change fails in its pipeline.
import path from "node:path";
import { describe, it, expect } from "vitest";
import { PactV4, MatchersV3 } from "@pact-foundation/pact";
import { createCatalogClient } from "../catalogClient";

const { like, integer, string } = MatchersV3;

// Pact runs a mock Catalog that answers only the requests declared below
const pact = new PactV4({
  consumer: "orders",
  provider: "catalog",
  // the contract file is written here; in real life a Pact Broker shares it between teams
  dir: path.resolve("pacts"),
  logLevel: "warn",
});

describe("Orders' contract with Catalog", () => {
  it("gets an existing product", async () => {
    await pact
      .addInteraction()
      .given("product 1 exists")
      .uponReceiving("a request for product 1")
      .withRequest("GET", "/products/1")
      .willRespondWith(200, (res) =>
        // Matchers say "any value of this TYPE", not "exactly this value".
        // Orders cares that `price` is a number, not that it's 50 today.
        res.jsonBody(
          like({
            id: integer(1),
            name: string("Keyboard"),
            price: integer(50),
            stock: integer(10),
          }),
        ),
      )
      .executeTest(async (mockCatalog) => {
        // our real catalogClient, pointed at the mock instead of the real Catalog
        const client = createCatalogClient(mockCatalog.url);

        const product = await client.getProduct(1);

        expect(product).toEqual({ id: 1, name: "Keyboard", price: 50, stock: 10 });
      });
  });
  
  it("gets null for a product that doesn't exist", async () => {
    await pact
      .addInteraction()
      .given("product 999 does not exist")
      .uponReceiving("a request for product 999")
      .withRequest("GET", "/products/999")
      .willRespondWith(404)
      .executeTest(async (mockCatalog) => {
        const client = createCatalogClient(mockCatalog.url);

        expect(await client.getProduct(999)).toBeNull();
      });
  });
});
