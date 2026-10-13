import { Router } from "express";
import * as controller from "./users.controller";

export const usersRouter = Router();

usersRouter.get("/", controller.list);
