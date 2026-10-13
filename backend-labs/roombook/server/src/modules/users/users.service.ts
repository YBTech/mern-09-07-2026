import { usersRepository } from "./users.repository";
import type { User } from "./users.types";

export function listUsers(): User[] {
  return usersRepository.findAll();
}
