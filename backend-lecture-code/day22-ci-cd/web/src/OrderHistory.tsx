import type { Order } from "./api";
import { formatPrice } from "./price";

// Past orders, newest first. Loaded from GET /orders when the page opens.
export function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <section aria-label="Past orders" style={{ marginTop: "2rem" }}>
      <h2>Past orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0, listStyle: "none" }}>
          {orders.map((order) => (
            <li key={order.id} style={{ borderTop: "1px solid #ddd", padding: "8px 0" }}>
              <strong>Order #{order.id}</strong> · {new Date(order.createdAt).toLocaleString()} ·{" "}
              <strong>{formatPrice(order.totalCents)}</strong>
              <div style={{ color: "#555", fontSize: 14 }}>
                {order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
