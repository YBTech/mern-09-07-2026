import { invoice } from "./invoice.js";
import { translate } from "./translate.js";
import type { Demo } from "../types.js";

// The classic vulnerable/safe demos the probe script runs (the assistant has its own probe, probe:assistant).
export const DEMOS: Demo[] = [translate, invoice];
