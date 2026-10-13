import type { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { UnauthorizedError } from "../errors";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.header("x-admin-token") !== config.adminToken) throw new UnauthorizedError();
  next();
}
