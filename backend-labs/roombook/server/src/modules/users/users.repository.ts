import { getDb } from "../../db";
import type { User } from "./users.types";

export const usersRepository = {
  findAll(): User[] {
    return getDb().prepare("SELECT id, name FROM users ORDER BY name").all() as User[];
  },
  findById(id: number): User | undefined {
    return getDb().prepare("SELECT id, name FROM users WHERE id = ?").get(id) as User | undefined;
  },
};
