// COMPONENT tests: render the real component into jsdom, click it like a user, check the screen.
// `fetch` is replaced with a fake, so these tests don't need the API running. That's why they
// can run in CI on a machine with no backend.
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Cart } from "./Cart";

const PRODUCTS = [
  { id: "p1", name: "Mechanical keyboard", priceCents: 1200 },
  { id: "p2", name: "USB-C cable", priceCents: 450 },
];

const PAST_ORDER = {
  id: 1,
  createdAt: "2026-10-01T10:00:00.000Z",
  items: [{ productId: "p2", name: "USB-C cable", quantity: 3 }],
  totalCents: 1350,
};

const NEW_ORDER = {
  id: 2,
  createdAt: "2026-10-06T10:00:00.000Z",
  items: [
    { productId: "p1", name: "Mechanical keyboard", quantity: 2 },
    { productId: "p2", name: "USB-C cable", quantity: 1 },
  ],
  totalCents: 2850,
};

let fetchMock: ReturnType<typeof vi.fn>;

// A fake backend. `pastOrders` is what GET /orders returns when the page loads.
function fakeApi(pastOrders: object[]) {
  fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === "/products") return Response.json(PRODUCTS);
    if (url === "/orders" && init?.method === "POST") return Response.json(NEW_ORDER, { status: 201 });
    if (url === "/orders") return Response.json(pastOrders);
    return new Response(null, { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
}

beforeEach(() => {
  fakeApi([]);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("<Cart />", () => {
  it("fail on purpose", async ()=>{
    expect(true).toBeFalsy();
  })

  it("loads the products from the API", async () => {
    render(<Cart />);
    expect(await screen.findByText("Mechanical keyboard")).toBeInTheDocument();
    expect(screen.getByText("USB-C cable")).toBeInTheDocument();
    expect(screen.getByTestId("total")).toHaveTextContent("$0.00");
  });

  it("updates the total as you add and remove items", async () => {
    render(<Cart />);
    await userEvent.click(await screen.findByRole("button", { name: "Add one Mechanical keyboard" }));
    await userEvent.click(screen.getByRole("button", { name: "Add one USB-C cable" }));
    expect(screen.getByTestId("total")).toHaveTextContent("$16.50");

    await userEvent.click(screen.getByRole("button", { name: "Remove one USB-C cable" }));
    expect(screen.getByTestId("total")).toHaveTextContent("$12.00");
  });

  it("disables checkout until something is in the cart", async () => {
    render(<Cart />);
    await screen.findByText("Mechanical keyboard");
    expect(screen.getByRole("button", { name: "Checkout" })).toBeDisabled();
  });

  it("sends the order to the API and shows the server's total", async () => {
    render(<Cart />);
    await userEvent.click(await screen.findByRole("button", { name: "Add one Mechanical keyboard" }));
    await userEvent.click(screen.getByRole("button", { name: "Add one Mechanical keyboard" }));
    await userEvent.click(screen.getByRole("button", { name: "Add one USB-C cable" }));
    await userEvent.click(screen.getByRole("button", { name: "Checkout" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Order placed! Total charged: $28.50");
    const [, init] = fetchMock.mock.calls.find(([url, options]) => url === "/orders" && options?.method === "POST")!;
    expect(JSON.parse(init.body)).toEqual({
      items: [
        { productId: "p1", quantity: 2 },
        { productId: "p2", quantity: 1 },
      ],
    });
  });

  it("shows past orders when the page loads", async () => {
    fakeApi([PAST_ORDER]);
    render(<Cart />);
    const history = screen.getByRole("region", { name: "Past orders" });
    expect(await within(history).findByText("Order #1")).toBeInTheDocument();
    expect(within(history).getByText("3 × USB-C cable")).toBeInTheDocument();
    expect(within(history).getByText("$13.50")).toBeInTheDocument();
  });

  it("says so when there are no past orders", async () => {
    render(<Cart />);
    expect(await screen.findByText("No orders yet.")).toBeInTheDocument();
  });

  it("adds a new order to the top of the history after checkout", async () => {
    fakeApi([PAST_ORDER]);
    render(<Cart />);
    await userEvent.click(await screen.findByRole("button", { name: "Add one Mechanical keyboard" }));
    await userEvent.click(screen.getByRole("button", { name: "Checkout" }));

    const history = screen.getByRole("region", { name: "Past orders" });
    await within(history).findByText("Order #2");
    const ids = within(history)
      .getAllByText(/^Order #/)
      .map((el) => el.textContent);
    expect(ids).toEqual(["Order #2", "Order #1"]);
  });

  it("shows an error if checkout fails", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url === "/products" ? Response.json(PRODUCTS) : new Response(null, { status: 500 }),
    );
    render(<Cart />);
    await userEvent.click(await screen.findByRole("button", { name: "Add one USB-C cable" }));
    await userEvent.click(screen.getByRole("button", { name: "Checkout" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Checkout failed");
  });
});
