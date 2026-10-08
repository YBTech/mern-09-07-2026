// Runs crunch() on a separate thread, so the page's main thread stays free.
import { crunch } from "./heavy";

self.onmessage = () => {
  self.postMessage(crunch());
};
