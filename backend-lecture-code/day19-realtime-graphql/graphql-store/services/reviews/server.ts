// Reviews: product reviews. Plain REST.
//   GET /reviews?authorId=c-1          one customer's reviews
//   GET /reviews?skus=sku-101,sku-102  reviews for one or more products (batch-friendly)
//
// A review stores ids, not copies: the author's name lives in Users, the
// product's details in Catalog.
import express from "express";
import { allowBrowser, edgeLatency, latencyControl } from "../../shared/http";

const PORT = Number(process.env.PORT ?? 4505);

type Review = {
  id: string;
  productSku: string;
  authorId: string;
  rating: number;
  title: string;
  body: string;
  helpfulVotes: number;
  createdAt: string;
};

const TEXT: [string, string][] = [
  ["Worth every penny", "Feels solid, and the setup took two minutes. I use it eight hours a day and it still feels new."],
  ["Good, not great", "Does the job. The finish picks up dust more than I expected, but it works well."],
  ["My new favourite", "Replaced an older model and the difference is obvious. Quiet, sturdy, and it looks great on the desk."],
  ["Arrived fast", "Shipping was quicker than promised and it was well packed. Happy so far after a month."],
  ["Returned it", "It worked, but it was bigger than it looked in the photos. The return was easy, though."],
];
const SKUS = ["sku-101", "sku-102", "sku-103", "sku-104", "sku-105", "sku-106", "sku-107", "sku-108"];
const AUTHORS = ["c-1", "c-2", "c-3", "c-4", "c-5"];

const reviews: Review[] = Array.from({ length: 20 }, (_, i) => {
  // Varied so no author, and no product, gets the same review text twice.
  const variety = (i + 4 * Math.floor(i / 5)) % 5;
  return {
    id: `r-${i + 1}`,
    productSku: SKUS[i % SKUS.length],
    authorId: AUTHORS[i % AUTHORS.length],
    rating: [5, 4, 5, 4, 2][variety],
    title: TEXT[variety][0],
    body: TEXT[variety][1],
    helpfulVotes: (i * 7) % 23,
    createdAt: new Date(Date.UTC(2026, 8, 28 - i)).toISOString(),
  };
});

const app = express();
app.use(allowBrowser, edgeLatency);
latencyControl(app);

app.get("/reviews", (req, res) => {
  const authorId = req.query.authorId ? String(req.query.authorId) : null;
  const skus = req.query.skus ? String(req.query.skus).split(",") : null;
  if (!authorId && !skus) return res.status(400).json({ error: "pass authorId or skus" });
  res.json(reviews.filter((r) => (!authorId || r.authorId === authorId) && (!skus || skus.includes(r.productSku))));
});

app.get("/health", (_req, res) => {
  res.json({ service: "reviews", status: "ok" });
});

app.listen(PORT, () => console.log(`reviews (REST) on http://localhost:${PORT}`));
