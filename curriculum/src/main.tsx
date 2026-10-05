import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

try {
  document.documentElement.lang = localStorage.getItem("lang") === "zh" ? "zh" : "en";
} catch { /* storage blocked → stay English */ }
import { BrowserRouter } from "react-router-dom";
import "./index.css";
// highlight.js's shipped vs2015 theme as the Dark+ base, matching week1's pages. Imported before
// curriculum.css so the few week1-parity overrides there (background, padding, foreground)
// take precedence over the theme's own.
import "highlight.js/styles/vs2015.css";
import "./styles/curriculum.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
