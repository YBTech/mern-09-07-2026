// Adds DOM matchers like toBeInTheDocument() to Vitest's expect.
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount whatever the last test rendered, so tests can't leak into each other.
afterEach(() => cleanup());
