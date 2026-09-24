import { Router } from "express";

import { inventoryController } from "./controller";

export const inventoryRouter = Router();

inventoryRouter.get("/", inventoryController.list);
inventoryRouter.get("/:id", inventoryController.getById);
inventoryRouter.post("/", inventoryController.create);
inventoryRouter.patch("/:id", inventoryController.setQuantity);
inventoryRouter.post("/:id/adjust", inventoryController.adjust);
