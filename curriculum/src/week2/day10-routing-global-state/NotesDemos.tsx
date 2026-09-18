import { createContext, useContext, useState, type ReactNode } from "react";

// Live demos for Day 10's notes page. Both render the same two-pane UI — a header badge and
// an "Add to cart" button that are siblings, not parent and child — so the only difference a
// student sees is whether the two panes agree with each other.

function Pane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="todo-item-row">
      <span className="todo-priority todo-priority-low">{label}</span>
      <span className="todo-item-title">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pain point: each sibling owns its own copy of the same state        */
/* ------------------------------------------------------------------ */

function LocalBadge() {
  const [count] = useState(0);
  return <Pane label="Header">Cart: {count} item(s)</Pane>;
}

function LocalAddButton() {
  const [count, setCount] = useState(0);
  return (
    <Pane label="Product">
      <span>Added {count} time(s)</span>
      <span className="todo-item-actions">
        <button onClick={() => setCount(count + 1)}>Add to cart</button>
      </span>
    </Pane>
  );
}

export function OutOfSyncDemo() {
  return (
    <div className="todo-app">
      <LocalBadge />
      <LocalAddButton />
      <p className="todo-empty">
        Click Add a few times — the header never moves. Two components, two separate useState
        calls, two separate truths.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The fix: one owner above them both, read through context            */
/* ------------------------------------------------------------------ */

type CartContextType = {
  count: number;
  addItem: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const addItem = () => setCount((prev) => prev + 1);
  const clear = () => setCount(0);
  return (
    <CartContext.Provider value={{ count, addItem, clear }}>{children}</CartContext.Provider>
  );
}

function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

function SharedBadge() {
  const { count, clear } = useCart();
  return (
    <Pane label="Header">
      <span>Cart: {count} item(s)</span>
      <span className="todo-item-actions">
        <button onClick={clear}>Clear</button>
      </span>
    </Pane>
  );
}

function SharedAddButton() {
  const { count, addItem } = useCart();
  return (
    <Pane label="Product">
      <span>Added {count} time(s)</span>
      <span className="todo-item-actions">
        <button onClick={addItem}>Add to cart</button>
      </span>
    </Pane>
  );
}

export function ContextSyncDemo() {
  return (
    <CartProvider>
      <div className="todo-app">
        <SharedBadge />
        <SharedAddButton />
        <p className="todo-empty">
          Same two siblings, same JSX tree — but the number now lives in one place above them, so
          either button moves both panes.
        </p>
      </div>
    </CartProvider>
  );
}
