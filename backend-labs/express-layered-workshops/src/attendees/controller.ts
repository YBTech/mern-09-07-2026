// YOUR TASK (exercise 2) — this file works today (run the tests, they
// pass), but it's everything dumped into one place: manual validation,
// business logic, and the HTTP response all mixed into each handler, with
// no service layer and no Zod. That's the Day 11 style; this lab is about
// the Day 13 one.
//
// Split this into three files, following workshops/ as your reference:
//   1. attendees/validation.ts  — replace every manual `if` below with a
//      Zod schema (see workshops/validation.ts for the shape).
//   2. attendees/service.ts     — move whatever isn't parsing the request
//      or sending the response into here. (For this resource there's not
//      much — that's fine. Not every resource needs real business rules;
//      the point is knowing where the seam goes even when one side is
//      thin.)
//   3. attendees/controller.ts  — end up with just: parse with Zod, call
//      the service, respond. Compare it to workshops/controller.ts when
//      you're done — they should look the same shape.
//
// Do NOT touch attendees/repository.ts or attendees/router.ts — both are
// already correct, and router.ts already points at `attendeesController`,
// so as long as you keep exporting the same method names, nothing else
// needs to change.
//
// Your refactor is correct if `npm test` still passes when you're done —
// these tests are the contract; don't change the tests to make them pass.

import type { Request, Response } from "express";

import { attendeesRepository } from "./repository";

export const attendeesController = {
  async list(_req: Request, res: Response) {
    try {
      const attendees = await attendeesRepository.list();
      res.json(attendees);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: { message: "internal server error" } });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res
          .status(400)
          .json({ error: { message: "id must be a number" } });
      }

      const attendee = await attendeesRepository.findById(id);
      if (!attendee) {
        return res
          .status(404)
          .json({ error: { message: `attendee ${id} not found` } });
      }

      res.json(attendee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: { message: "internal server error" } });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;

      if (typeof name !== "string" || name.trim().length === 0) {
        return res
          .status(400)
          .json({ error: { message: "name is required" } });
      }
      if (typeof email !== "string" || email.trim().length === 0) {
        return res
          .status(400)
          .json({ error: { message: "email is required" } });
      }

      const attendee = await attendeesRepository.create({ name, email });
      res.status(201).json(attendee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: { message: "internal server error" } });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res
          .status(400)
          .json({ error: { message: "id must be a number" } });
      }

      const { name, email } = req.body;
      if (name !== undefined && typeof name !== "string") {
        return res
          .status(400)
          .json({ error: { message: "name must be a string" } });
      }
      if (email !== undefined && typeof email !== "string") {
        return res
          .status(400)
          .json({ error: { message: "email must be a string" } });
      }
      if (name === undefined && email === undefined) {
        return res
          .status(400)
          .json({ error: { message: "nothing to update" } });
      }

      const attendee = await attendeesRepository.update(id, { name, email });
      if (!attendee) {
        return res
          .status(404)
          .json({ error: { message: `attendee ${id} not found` } });
      }

      res.json(attendee);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: { message: "internal server error" } });
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res
          .status(400)
          .json({ error: { message: "id must be a number" } });
      }

      const deleted = await attendeesRepository.delete(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ error: { message: `attendee ${id} not found` } });
      }

      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: { message: "internal server error" } });
    }
  },
};
