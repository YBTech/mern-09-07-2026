import { Router } from "express";
import * as orders from "../controllers/orders.controller";

export const ordersRouter = Router();

ordersRouter.post("/", orders.create);
ordersRouter.get("/:id", orders.get);
ordersRouter.patch("/:id/cancel", orders.cancel);
