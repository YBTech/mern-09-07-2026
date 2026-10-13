import type { Request, Response } from "express";
import * as ordersService from "../services/orders.service";
import { parseNewOrder } from "../validation";

export function create(req: Request, res: Response) {
  const input = parseNewOrder(req.body);
  console.log("order placed", input);
  res.status(201).json(ordersService.createOrder(input));
}

export function cancel(req: Request<{ id: string }>, res: Response) {
  res.json(ordersService.cancelOrder(req.params.id));
}

export function get(req: Request<{ id: string }>, res: Response) {
  res.json(ordersService.getOrder(req.params.id));
}
