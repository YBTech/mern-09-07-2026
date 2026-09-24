// given — same as every router in this lab, you don't need to touch this.
// It expects `registrationsController` to export list/getById/create/cancel
// — build controller.ts to match.

import { Router } from "express";

import { registrationsController } from "./controller";

export const registrationsRouter = Router();

registrationsRouter.get("/", registrationsController.list);
registrationsRouter.get("/:id", registrationsController.getById);
registrationsRouter.post("/", registrationsController.create);
registrationsRouter.patch("/:id", registrationsController.cancel);
