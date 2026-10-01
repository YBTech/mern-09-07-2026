// Users: customer profiles. Plain REST — small objects with a fixed shape.
//   GET /users/:id
//   GET /users?ids=c-1,c-2     several customers in one call (what DataLoader uses)
import express from "express";
import { allowBrowser, edgeLatency, latencyControl } from "../../shared/http";

const PORT = Number(process.env.PORT ?? 4501);

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  tier: string;
  address: { line1: string; city: string; region: string; postalCode: string; country: string };
  preferences: { newsletter: boolean; currency: string; language: string };
};

const user = (id: string, name: string, memberSince: string, tier: string, city: string): User => ({
  id,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@shop.com`,
  phone: "+1 555 0100",
  memberSince,
  tier,
  address: { line1: "12 Market St", city, region: "ON", postalCode: "M5V 2T6", country: "CA" },
  preferences: { newsletter: true, currency: "CAD", language: "en" },
});

const users = new Map(
  [
    user("c-1", "Alice Martin", "2023-04-12", "gold", "Toronto"),
    user("c-2", "Bob Kim", "2022-01-30", "silver", "Ottawa"),
    user("c-3", "Carol Tran", "2024-06-02", "standard", "Montreal"),
    user("c-4", "Dev Patel", "2021-11-18", "gold", "Vancouver"),
    user("c-5", "Erin Smith", "2025-02-07", "standard", "Calgary"),
  ].map((u) => [u.id, u]),
);

const app = express();
app.use(allowBrowser, edgeLatency);
latencyControl(app);

app.get("/users", (req, res) => {
  const ids = String(req.query.ids ?? "")
    .split(",")
    .filter(Boolean);
  res.json(ids.map((id) => users.get(id)).filter(Boolean));
});

app.get("/users/:id", (req, res) => {
  const found = users.get(req.params.id);
  if (!found) return res.status(404).json({ error: `user ${req.params.id} not found` });
  res.json(found);
});

app.get("/health", (_req, res) => {
  res.json({ service: "users", status: "ok" });
});

app.listen(PORT, () => console.log(`users (REST) on http://localhost:${PORT}`));
