import { Request, Response } from "express";
import { pool } from "../../db/pool";

import * as orderService from "./service";
import * as orderRepository from "./repository";

export const getAll = async (req: Request, res: Response) => {
  // validation
  const limit = req.query.limit ? Number(req.query.limit) : 50;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  if (Number.isNaN(limit) || Number.isNaN(offset)) {
    return res
      .status(400)
      .json({ error: { message: "limit and offset must be numbers" } });
  }

  try {
    // controller layer calling service layer
    const orders = await orderService.getAll({ limit, offset });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: { message: "failed to fetch orders" } });
  }
};

export const create = async (req: Request, res: Response) => {
  // validation
  const { productId, quantity } = req.body;
  if (typeof productId !== "number" || !Number.isInteger(productId)) {
    return res
      .status(400)
      .json({ error: { message: "productId must be an integer" } });
  }
  if (typeof quantity !== "number" || quantity <= 0) {
    return res
      .status(400)
      .json({ error: { message: "quantity must be a positive number" } });
  }

  // service logic — new orders always start out pending

  // db query — lock the inventory row, check there's enough stock, decrement
  // it, and insert the order, all in one transaction. the FOR UPDATE lock is
  // what stops two concurrent orders from both reading the same "1 left" and
  // both succeeding (see the isolation notes at the bottom of server.ts).
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: invRows } = await client.query(
      "SELECT quantity FROM inventory WHERE product_id = $1 FOR UPDATE",
      [productId],
    );
    const available = invRows[0]?.quantity ?? 0;

    if (available < quantity) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: {
          message: `only ${available} in stock for product ${productId}`,
        },
      });
    }

    await client.query(
      "UPDATE inventory SET quantity = quantity - $1, updated_at = now() WHERE product_id = $2",
      [quantity, productId],
    );

    const { rows } = await client.query(
      "INSERT INTO orders (product_id, quantity, status) VALUES ($1, $2, $3) RETURNING *",
      [productId, quantity, "pending"],
    );

    const newOrder = await orderRepository.insert(productId, quantity, "pending");

    await client.query("COMMIT");
    res.status(201).json(newOrder);
  } catch (err: any) {
    await client.query("ROLLBACK");
    if (err.code === "23503") {
      return res
        .status(409)
        .json({ error: { message: `product ${productId} does not exist` } });
    }
    res.status(500).json({ error: { message: "failed to create order" } });
  } finally {
    client.release();
  }
}
