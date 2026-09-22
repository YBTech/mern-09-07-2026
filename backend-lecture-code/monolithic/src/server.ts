import path from "path";
import os from "os";
import fs from "fs";
import "dotenv/config";

import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3100;

app.use(express.json());

interface Product {
  id: number;
  sku: string;
  name: string;
  priceCents: number;
  createdAt: Date;
  updatedAt: Date;
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
    updatedAt: new Date(),
  },
  {
    id: genId(),
    sku: "NB-001",
    name: "Dot-Grid Notebook",
    priceCents: 8.99,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// blocking
app.get("/blocking", (req, res) => {
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
app.get("/products", (req, res) => {
  // query parameters
  const { sortBy, order } = req.query;

  // based on query params you can sort the products and return
  const _products = [...products].sort(/*sorting logic*/);

  console.log("get request received");

  res.json(_products);
});

// GET http://localhost:3100/products/:id
app.get("/products/:id", (req, res) => {
  // route parameters
  // all are strings from req.query & req.params
  const { id } = req.params;
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return res.status(404).json({
      error: {
        message: `Product with id ${id} cannot be found`,
      },
    });
  }

  res.json(product);
});

// POST http://localhost:3100/products
app.post("/products", (req, res) => {
  // client sends info to server in the body
  const { sku, name, priceCents } = req.body;

  // const isSkuExisted = products.some((p) => p.sku === sku);
  // if (isSkuExisted) {
  //   return res.status(409).json({
  //     error: {
  //       message: `product with sku ${sku} already exists`,
  //     },
  //   });
  // }

  const newProduct: Product = {
    id: genId(),
    sku,
    name,
    priceCents,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

app.patch("/products/:id", (req, res) => {
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
  product.updatedAt = new Date();

  res.json(product);
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === Number(id));
  if (!index) {
    return res.status(204).send();
  }

  products.splice(index);
  return res.status(204).send();
});

// GET http://localhost:3100/health
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Monolithic API listening on http://localhost:${PORT}`);
});
