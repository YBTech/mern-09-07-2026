import type { Request, Response } from "express";
import { listUsers } from "./users.service";

export function list(_req: Request, res: Response) {
  res.json(listUsers());
}
