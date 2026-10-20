import { Router } from "express";
import * as controller from "./claims.controller";

export const claimsRouter = Router();

claimsRouter.get("/", controller.list);
claimsRouter.post("/", controller.create);
claimsRouter.get("/queue", controller.queue); // before "/:id", or "queue" would be read as an id
claimsRouter.get("/:id", controller.get);
claimsRouter.post("/:id/process", controller.process);
claimsRouter.post("/:id/approve", controller.approve);
claimsRouter.post("/:id/reject", controller.reject);
