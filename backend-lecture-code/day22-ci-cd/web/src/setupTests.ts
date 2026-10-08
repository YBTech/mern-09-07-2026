// Adds DOM matchers like toBeInTheDocument() and toHaveTextContent() to expect(),
// and unmounts rendered components between tests.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
