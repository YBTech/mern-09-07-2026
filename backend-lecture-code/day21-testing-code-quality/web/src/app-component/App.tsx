import { useEffect, useState } from "react";
import { fetchProducts, placeOrder, type PlacedOrder, type Product } from "../api-boundary/api";
import { addToCart, cartTotal, setQty, type CartLine } from "../cart-pure-logic/cart";
import { OrderSummary } from "../order-snapshot/OrderSummary";
import { QuantityPicker } from "../quantity-picker-spy/QuantityPicker";

export default function App() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [email, setEmail] = useState("");
  const [orderError, setOrderError] = useState("");
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setLoadError(true));
  }, []);

  async function handlePlaceOrder() {
    setOrderError("");
    try {
      const order = await placeOrder({
        email,
        items: cart.map(({ productId, qty }) => ({ productId, qty })),
      });
      setPlaced(order);
      setCart([]);
    } catch (err) {
      setOrderError((err as Error).message);
    }
  }

  if (placed) {
    return (
      <main>
        <h1>Tiny Shop</h1>
        <OrderSummary id={placed.id} total={placed.total} />
      </main>
    );
  }

  return (
    <main>
      <h1>Tiny Shop</h1>

      <h2>Products</h2>
      {loadError && <p role="alert">Could not load products</p>}
      {!loadError && products === null && <p>Loading products…</p>}
      {products?.length === 0 && <p>No products yet</p>}
      <ul>
        {products?.map((p) => (
          <li key={p.id}>
            {p.name} — ${p.price} ({p.stock} left){" "}
            <button
              disabled={p.stock === 0}
              onClick={() =>
                setCart(addToCart(cart, { productId: p.id, name: p.name, price: p.price }))
              }
            >
              Add {p.name} to cart
            </button>
          </li>
        ))}
      </ul>

      <h2>Cart</h2>
      {cart.length === 0 && <p>Your cart is empty</p>}
      <ul>
        {cart.map((line) => (
          <li key={line.productId}>
            {line.name}{" "}
            <QuantityPicker
              label={line.name}
              value={line.qty}
              onChange={(qty) => setCart(setQty(cart, line.productId, qty))}
            />
          </li>
        ))}
      </ul>
      <p>Total: ${cartTotal(cart)}</p>

      <label>
        Email <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button disabled={cart.length === 0} onClick={handlePlaceOrder}>
        Place order
      </button>
      {orderError && <p role="alert">{orderError}</p>}
    </main>
  );
}
