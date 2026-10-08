// Catalog's product data. Note: bulkDiscount is OPTIONAL. Only some products have one.

export type Product = {
  id: string;
  name: string;
  priceCents: number;
  bulkDiscount?: { minQuantity: number; percent: number };
};

export const products: Product[] = [
  { id: "p1", name: "Mechanical keyboard", priceCents: 8900, bulkDiscount: { minQuantity: 5, percent: 10 } },
  { id: "p2", name: "USB-C cable", priceCents: 1200, bulkDiscount: { minQuantity: 5, percent: 20 } },
  { id: "p3", name: "Monitor stand", priceCents: 3500 },
  { id: "p4", name: "Webcam", priceCents: 6400 },
  { id: "p5", name: "Desk mat", priceCents: 2500, bulkDiscount: { minQuantity: 5, percent: 15 } },
  { id: "p6", name: "Laptop stand", priceCents: 4200 },
  { id: "p7", name: "Desk lamp", priceCents: 5200 },
  { id: "p8", name: "Noise-cancelling headset", priceCents: 14900, bulkDiscount: { minQuantity: 5, percent: 8 } },
];
