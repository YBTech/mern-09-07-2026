// Shipping: where each order's parcel is. Plain REST.
//   GET /shipments?orderIds=ord-2004,ord-2003   several orders in one call
//   GET /shipments/:orderId
import express from "express";
import { allowBrowser, edgeLatency, latencyControl } from "../../shared/http";

const PORT = Number(process.env.PORT ?? 4504);

const shipments: Record<string, object> = {
  "ord-2004": { orderId: "ord-2004", status: "in_transit", carrier: "Canada Post", trackingNumber: "CP123456789CA", eta: "2026-10-02" },
  "ord-2003": { orderId: "ord-2003", status: "delivered", carrier: "UPS", trackingNumber: "1Z999AA10123456784", eta: "2026-09-23" },
  "ord-2002": { orderId: "ord-2002", status: "delivered", carrier: "Purolator", trackingNumber: "PUR335599771", eta: "2026-09-14" },
  "ord-2001": { orderId: "ord-2001", status: "delivered", carrier: "Canada Post", trackingNumber: "CP987654321CA", eta: "2026-09-02" },
};

const shipmentFor = (orderId: string) =>
  shipments[orderId] ?? { orderId, status: "preparing", carrier: null, trackingNumber: null, eta: null };

const app = express();
app.use(allowBrowser, edgeLatency);
latencyControl(app);

// One call for a whole list of orders, instead of one call per order.
app.get("/shipments", (req, res) => {
  const ids = String(req.query.orderIds ?? "")
    .split(",")
    .filter(Boolean);
  res.json(ids.map(shipmentFor));
});

app.get("/shipments/:orderId", (req, res) => {
  res.json(shipmentFor(req.params.orderId));
});

app.get("/health", (_req, res) => {
  res.json({ service: "shipping", status: "ok" });
});

app.listen(PORT, () => console.log(`shipping (REST) on http://localhost:${PORT}`));
