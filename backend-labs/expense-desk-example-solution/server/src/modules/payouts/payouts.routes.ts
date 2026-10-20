import { Router } from "express";
import * as controller from "./payouts.controller";

export const payoutsRouter = Router();

payoutsRouter.get("/failed", controller.failed);
payoutsRouter.post("/:id/retry", controller.retry);
