import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Cart } from "./Cart";
import { VersionBadge } from "./VersionBadge";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Cart />
    
    <VersionBadge />
  </StrictMode>,
);
