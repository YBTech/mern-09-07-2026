import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { RecipeBookApp } from "./_solution";

// The finished lab is a router in its own right, and react-router refuses to nest one <Router>
// inside another — this app already has a BrowserRouter at its root (see main.tsx). Mounting the
// demo in its own React root puts it outside that context, so its MemoryRouter is legal and its
// navigation stays inside the panel instead of changing the page's address bar.
export default function RecipeBookFrame() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const root = createRoot(host);
    root.render(<RecipeBookApp />);

    // Deferred: unmounting a root synchronously from an effect cleanup warns in React 19,
    // because the outer tree is still rendering at that point.
    return () => {
      setTimeout(() => root.unmount(), 0);
    };
  }, []);

  return <div ref={hostRef} />;
}
