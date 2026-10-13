import type { Request, Response } from "express";
import { ValidationError } from "../../errors";
import * as bookings from "./bookings.service";

export function list(req: Request, res: Response) {
  const { date } = req.query;
  if (typeof date !== "string") throw new ValidationError("date is required");
  res.json(bookings.listBookings(date));
}

export function create(req: Request, res: Response) {
  const { roomId, userId, title, start, end } = req.body ?? {};
  res
    .status(201)
    .json(
      bookings.createBooking({ roomId: Number(roomId), userId: Number(userId), title, start, end }),
    );
}

export function cancel(req: Request<{ id: string }>, res: Response) {
  bookings.cancelBooking(Number(req.params.id), Number(req.query.userId));
  res.status(204).end();
}
