// given — same as every router in this lab, you don't need to touch this.
// It already points at `attendeesController`'s methods; keep those method
// names as you refactor and this file never needs to change.

import { Router } from "express";

import { attendeesController } from "./controller";

export const attendeesRouter = Router();

attendeesRouter.get("/", attendeesController.list);
attendeesRouter.get("/:id", attendeesController.getById);
attendeesRouter.post("/", attendeesController.create);
attendeesRouter.patch("/:id", attendeesController.update);
attendeesRouter.delete("/:id", attendeesController.remove);
