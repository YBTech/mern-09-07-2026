import type { Request, Response } from "express";
import { listRooms } from "./rooms.service";

export function list(_req: Request, res: Response) {
  res.json(listRooms());
}
