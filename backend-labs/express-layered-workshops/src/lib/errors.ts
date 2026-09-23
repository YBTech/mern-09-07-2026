// given — shared error types + response mapping, used the same way across
// every resource. throw one of these from a service and the controller's
// catch block (or the error-handling middleware, if you built one in
// lecture) turns it into the right status code.

import type { Response } from "express";
import { ZodError } from "zod";

export class NotFoundError extends Error {}
export class ConflictError extends Error {}

export function sendErrorResponse(err: unknown, res: Response) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: err.issues
          .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
          .join("; "),
      },
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: { message: err.message } });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: { message: err.message } });
  }
  console.error(err);
  return res.status(500).json({ error: { message: "internal server error" } });
}
