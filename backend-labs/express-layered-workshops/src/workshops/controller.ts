// REFERENCE — fully implemented. HTTP concerns only: parse + validate the
// request with the Zod schemas from validation.ts, call one service
// method, shape the response. No business logic, no db calls here.

import type { Request, Response } from "express";

import { sendErrorResponse } from "../lib/errors";
import { workshopsService } from "./service";
import {
  createWorkshopBodySchema,
  updateWorkshopBodySchema,
  workshopIdParamSchema,
} from "./validation";

export const workshopsController = {
  async list(_req: Request, res: Response) {
    try {
      const workshops = await workshopsService.list();
      res.json(workshops);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = workshopIdParamSchema.parse(req.params);
      const workshop = await workshopsService.getById(id);
      res.json(workshop);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const body = createWorkshopBodySchema.parse(req.body);
      const workshop = await workshopsService.create(body);
      res.status(201).json(workshop);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = workshopIdParamSchema.parse(req.params);
      const body = updateWorkshopBodySchema.parse(req.body);
      const workshop = await workshopsService.update(id, body);
      res.json(workshop);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { id } = workshopIdParamSchema.parse(req.params);
      await workshopsService.remove(id);
      res.status(204).send();
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },
};
