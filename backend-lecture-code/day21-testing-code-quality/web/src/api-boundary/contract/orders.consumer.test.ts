// Contract test, consumer side (Pact): the web app writes down what it needs from Orders.
// Orders replays that file in services/orders/contract/orders.provider.test.ts.
import path from "node:path";
import { afterEach, describe, it, expect, vi } from "vitest";
import { PactV4, MatchersV3 } from "@pact-foundation/pact";
import { placeOrder } from "../api";

const { like, integer, string } = MatchersV3;

const pact = new PactV4({
  consumer: "web",
  provider: "orders",
  dir: path.resolve("pacts"),
  logLevel: "warn",
});

const realFetch = globalThis.fetch;

// api.ts calls "/api/orders", which the browser sends to the gateway. The gateway only forwards
// /api/* to the services, so the contract is with Orders itself: this stub does the forwarding.
function useMockOrders(baseUrl: string) {
  vi.stubGlobal("fetch", (url: string, init?: RequestInit) =>
    realFetch(baseUrl + url.replace(/^\/api/, ""), init),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

const request = { email: "ana@example.com", items: [{ productId: 1, qty: 2 }] };

describe("Web's contract with Orders", () => {
  it("places an order", async () => {
    await pact
      .addInteraction()
      .given("product 1 is in stock")
      .uponReceiving("a request to order 2 of product 1")
      .withRequest("POST", "/orders", (req) => req.jsonBody(request))
      .willRespondWith(201, (res) =>
        // The web app only reads these three fields. The real Orders response
        // has more (email, items). Orders may add fields freely; removing or
        // renaming one of these three is what breaks the contract.
        res.jsonBody(like({ id: integer(1), total: integer(100), status: string("placed") })),
      )
      .executeTest(async (mockOrders) => {
        useMockOrders(mockOrders.url);

        const order = await placeOrder(request);

        expect(order).toEqual({ id: 1, total: 100, status: "placed" });
      });
  });

  it("shows Orders' error message when there isn't enough stock", async () => {
    await pact
      .addInteraction()
      .given("product 1 has only 1 left")
      .uponReceiving("a request to order 2 of product 1 when only 1 is left")
      .withRequest("POST", "/orders", (req) => req.jsonBody(request))
      .willRespondWith(409, (res) =>
        res.jsonBody(like({ error: string("only 1 Keyboard left in stock") })),
      )
      .executeTest(async (mockOrders) => {
        useMockOrders(mockOrders.url);

        await expect(placeOrder(request)).rejects.toThrow("only 1 Keyboard left in stock");
      });
  });
});
