import { createContext, useContext, useState, type ReactNode } from "react";

// One switch for the whole app: show the explanations (what the attack is, guards, prompts, the attacker's log)
// or hide them, so every page looks like an ordinary website. The choice is remembered when the page reloads.
const KEY = "explain";
const ExplainContext = createContext({ explain: true, toggle: () => {} });

export function ExplainProvider({ children }: { children: ReactNode }) {
  const [explain, setExplain] = useState(() => {
    // http://localhost:5234/?explain=off opens a clean page, whatever was remembered
    const fromAddress = new URLSearchParams(window.location.search).get("explain");
    if (fromAddress) return fromAddress !== "off";
    try {
      return localStorage.getItem(KEY) !== "off";
    } catch {
      return true;
    }
  });

  function toggle() {
    const next = !explain;
    setExplain(next);
    try {
      localStorage.setItem(KEY, next ? "on" : "off");
    } catch {
      // private window: the switch still works, it just isn't remembered
    }
  }

  return <ExplainContext.Provider value={{ explain, toggle }}>{children}</ExplainContext.Provider>;
}

export const useExplain = () => useContext(ExplainContext);
