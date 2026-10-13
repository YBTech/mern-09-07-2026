import { getDb } from "../../db";
import type { Room } from "./rooms.types";

export const roomsRepository = {
  findAll(): Room[] {
    return getDb()
      .prepare("SELECT id, name, floor, capacity FROM rooms ORDER BY name")
      .all() as Room[];
  },
  findById(id: number): Room | undefined {
    return getDb().prepare("SELECT id, name, floor, capacity FROM rooms WHERE id = ?").get(id) as
      Room | undefined;
  },
};
