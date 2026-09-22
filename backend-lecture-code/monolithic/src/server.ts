import path from "path";
import os from "os";
import fs from "fs";
import "dotenv/config";

import express from "express";

import { pool, query } from "./db/pool";

const app = express();
const PORT = Number(process.env.PORT) || 3100;

app.use(express.json());

interface Product {
  id: number;
  sku: string;
  name: string;
  priceCents: number;
  createdAt: Date;
}

// IIFE + Closure
const genId = (() => {
  let id = 1;
  return () => id++;
})();

const products: Product[] = [
  {
    id: genId(),
    sku: "MUG-001",
    name: "Ceramic Mug",
    priceCents: 12.99,
    createdAt: new Date(),
  },
  {
    id: genId(),
    sku: "NB-001",
    name: "Dot-Grid Notebook",
    priceCents: 8.99,
    createdAt: new Date(),
  },
];

// blocking
app.get("/blocking", async (req, res) => {
  // intentionally block for 5 seconds
  const start = Date.now();
  // cpu related tasks will block the main thread
  while (Date.now() - start < 5000) {
    /* busy-wait: the thread is stuck here */
  }

  res.send("hello");
});

// we are creating / defining the endpoints

// GET http://localhost:3100/products
app.get("/products", async (req, res) => {
  // query parameters
  const { limit, skip } = req.query;

  console.log("get request received");

  try {
    const { rows } = await pool.query(
      "SELECT * FROM products LIMIT $1 OFFSET $2",
      [limit, skip],
    );
    res.json(rows);
  } catch (err) {
    res.status(400).json({
      error: {
        message: `bad request`,
      },
    });
  }
});

// GET http://localhost:3100/products/:id
app.get("/products/:id", async (req, res) => {
  // route parameters
  // all are strings from req.query & req.params
  const { id } = req.params;

  await pool.query("BEGIN");
  try {
    const { rows } = await pool.query(
      `SELECT * FROM products WHERE id=${id} LIMIT 1`,
    );
    const product = rows[0];

    if (!product) {
      return res.status(404).json({
        error: {
          message: `Product with id ${id} cannot be found`,
        },
      });
    }

    await pool.query("COMMIT");
    res.json(product);
  } catch (err) {
    await pool.query("ROLLBACK");
  }
});

// POST http://localhost:3100/products
app.post("/products", async (req, res) => {
  // client sends info to server in the body
  const { sku, name, priceCents } = req.body;

  const isSkuExisted = products.some((p) => p.sku === sku);
  if (isSkuExisted) {
    return res.status(409).json({
      error: {
        message: `product with sku ${sku} already exists`,
      },
    });
  }

  const newProduct: Product = {
    id: genId(),
    sku,
    name,
    priceCents,
    createdAt: new Date(),
  };

  products.push(newProduct);
  res.status(201).json(products);
});

app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, priceCents } = req.body;
  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    return res.status(404).json({
      error: {
        message: `Product with id ${id} cannot be found`,
      },
    });
  }

  product.name = name;

  res.json(product);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === Number(id));
  if (!index) {
    return res.status(204).send();
  }

  products.splice(index);
  return res.status(204).send();
});

// GET http://localhost:3100/health
app.get("/health", async (_req, res) => {
  try {
    await query("SELECT 1");
    res.status(200).json({ status: "ok", db: "up" });
  } catch (err) {
    res.status(503).json({ status: "degraded", db: "down" });
  }
});

app.listen(PORT, () => {
  console.log(`Monolithic API listening on http://localhost:${PORT}`);
});



// Atomicity
// Transfer from A - B

// query A: take $1000 out of account A
// network fail
// query B: put $1000 into account B

// query A: places an order of 5
// network fail
// query B: update from the inventory to reduce 5


// Isolation
// inventory has 1 left

// user A: checkout, check inventory is still there, order success
// user B: checkout at the same time, check inventory is still there, order success

// when us  er A reads the query:  SELECT quantity FROM Inventory where id = 1 FOR UPDATE;
// user B reads the query next: but it's locked, so user B has to wait