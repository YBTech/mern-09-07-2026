// REFERENCE — fully implemented. Routers are given for every resource in
// this lab; you'll never need to write or edit one.

import { Router } from "express";

import { workshopsController } from "./controller";

export const workshopsRouter = Router();

workshopsRouter.get("/", workshopsController.list);
workshopsRouter.get("/:id", workshopsController.getById);
workshopsRouter.post("/", workshopsController.create);
workshopsRouter.patch("/:id", workshopsController.update);
workshopsRouter.delete("/:id", workshopsController.remove);
