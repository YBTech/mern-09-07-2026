import { roomsRepository } from "./rooms.repository";
import type { Room } from "./rooms.types";

export function listRooms(): Room[] {
  return roomsRepository.findAll();
}
