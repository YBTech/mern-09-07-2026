import { NextFunction, Router } from "express";

import { productsController } from "./controller";

export const productsRouter = Router();

productsRouter.get("/", productsController.list);
productsRouter.get("/:id", productsController.getById);
productsRouter.post("/", productsController.create);
productsRouter.patch("/:id", productsController.update);
productsRouter.delete("/:id", productsController.remove);
