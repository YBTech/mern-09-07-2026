import { Router } from "express";
import * as controller from "./bookings.controller";

export const bookingsRouter = Router();

bookingsRouter.get("/", controller.list);
bookingsRouter.post("/", controller.create);
bookingsRouter.delete("/:id", controller.cancel);
