// Component test: <App /> rendered together with its real <QuantityPicker /> child.
// Still not integration: all our own code, one process, no boundary crossed.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it, expect, vi } from "vitest";
import App from "./App";
import { fetchProducts, placeOrder } from "../api-boundary/api";

vi.mock("../api-boundary/api"); // swaps the whole api module for fakes: no request leaves the test

const PRODUCTS = [
  { id: 1, name: "Keyboard", price: 50, stock: 10 },
  { id: 3, name: "Monitor", price: 200, stock: 0 },
];

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(fetchProducts).mockResolvedValue(PRODUCTS);
});

describe("App", () => {
  it("lists products from the API", async () => {
    render(<App />);

    // findBy* WAITS for the element: the fetch is async. Using getBy* here
    // would be a classic source of flaky tests.
    expect(await screen.findByText(/Keyboard — \$50/)).toBeInTheDocument();
  });

  it("disables out-of-stock products", async () => {
    render(<App />);

    expect(await screen.findByRole("button", { name: "Add Monitor to cart" })).toBeDisabled();
  });

  it("shows an error when products fail to load", async () => {
    vi.mocked(fetchProducts).mockRejectedValue(new Error("500"));

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load products");
  });

  it("updates the cart total as the quantity changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Add Keyboard to cart" }));
    await user.click(screen.getByRole("button", { name: "Increase Keyboard" }));

    expect(screen.getByText("Total: $100")).toBeInTheDocument();
  });

  it("places an order and shows the confirmation", async () => {
    vi.mocked(placeOrder).mockResolvedValue({ id: 7, total: 50, status: "placed" });
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Add Keyboard to cart" }));
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Place order" }));

    expect(await screen.findByTestId("confirmation")).toHaveTextContent("Order placed");
    expect(placeOrder).toHaveBeenCalledWith({
      email: "ana@example.com",
      items: [{ productId: 1, qty: 1 }],
    });
  });

  it("shows the server's error when the order is rejected", async () => {
    vi.mocked(placeOrder).mockRejectedValue(new Error("only 3 Mouse left in stock"));
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Add Keyboard to cart" }));
    await user.click(screen.getByRole("button", { name: "Place order" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("only 3 Mouse left in stock");
  });
});
