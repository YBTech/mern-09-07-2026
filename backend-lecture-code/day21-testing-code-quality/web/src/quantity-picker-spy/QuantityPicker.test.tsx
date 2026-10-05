// Unit test of one React component: Vitest runs it, React Testing Library renders it.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";
import { QuantityPicker } from "./QuantityPicker";

it("shows the current quantity", () => {
  // render() mounts into jsdom, a fake browser DOM (set in vitest.config.ts)
  render(<QuantityPicker label="Mouse" value={3} onChange={() => {}} />);

  expect(screen.getByText("Quantity: 3")).toBeInTheDocument();
});

it("asks for one more when + is clicked", async () => {
  const onChange = vi.fn(); // a spy: records how it was called
  render(<QuantityPicker label="Mouse" value={1} onChange={onChange} />);

  // queries like a user would: by role and accessible name
  await userEvent.click(screen.getByRole("button", { name: "Increase Mouse" }));

  expect(onChange).toHaveBeenCalledWith(2);
});

it("won't go below 1", () => {
  render(<QuantityPicker label="Mouse" value={1} onChange={() => {}} />);

  expect(screen.getByRole("button", { name: "Decrease Mouse" })).toBeDisabled();
});
