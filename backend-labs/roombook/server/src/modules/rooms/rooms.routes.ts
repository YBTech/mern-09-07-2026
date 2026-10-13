import { Router } from "express";
import * as controller from "./rooms.controller";

export const roomsRouter = Router();

roomsRouter.get("/", controller.list);
