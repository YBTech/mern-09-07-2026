// Snapshot test: the first run saves the rendered HTML to __snapshots__/, later runs compare to it.
import { render } from "@testing-library/react";
import { it, expect } from "vitest";
import { OrderSummary } from "./OrderSummary";

it("renders the order confirmation", () => {
  const { container } = render(<OrderSummary id={7} total={150} />);

  // first run saves the HTML to a .snap file; later runs fail if it differs, even by one character
  // answers "did this change?", not "is it correct?": read the .snap file before committing it
  // unintended change: fix the code. intended change: `npx vitest -u` rewrites the snapshot
  expect(container).toMatchSnapshot();
});

// Inline snapshot: the expected string lives in the test file (Vitest fills it in on the first
// run), so a reviewer sees it next to the test. Better for small output.
it("renders the order line (inline snapshot)", () => {
  const { getByText } = render(<OrderSummary id={7} total={150} />);

  expect(getByText(/Order #7/).textContent).toMatchInlineSnapshot(`"Order #7 · total $150"`);
});
