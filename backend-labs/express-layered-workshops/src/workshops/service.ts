// REFERENCE — fully implemented. Workshops has no interesting business
// rules of its own (that's what registrations is for) — but the shape is
// the same one you'll follow everywhere else: call the repository, decide
// what a missing/invalid result *means*, throw a typed error if so.

import { NotFoundError } from "../lib/errors";
import { workshopsRepository, type Workshop } from "./repository";
import type { CreateWorkshopBody, UpdateWorkshopBody } from "./validation";

export const workshopsService = {
  async list(): Promise<Workshop[]> {
    return workshopsRepository.list();
  },

  async getById(id: number): Promise<Workshop> {
    const workshop = await workshopsRepository.findById(id);
    if (!workshop) throw new NotFoundError(`workshop ${id} not found`);
    return workshop;
  },

  async create(data: CreateWorkshopBody): Promise<Workshop> {
    return workshopsRepository.create(data);
  },

  async update(id: number, data: UpdateWorkshopBody): Promise<Workshop> {
    const workshop = await workshopsRepository.update(id, data);
    if (!workshop) throw new NotFoundError(`workshop ${id} not found`);
    return workshop;
  },

  async remove(id: number): Promise<void> {
    const deleted = await workshopsRepository.delete(id);
    if (!deleted) throw new NotFoundError(`workshop ${id} not found`);
  },
};
