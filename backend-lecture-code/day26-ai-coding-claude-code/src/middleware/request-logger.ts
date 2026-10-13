import type { NextFunction, Request, Response } from "express";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    if (process.env.NODE_ENV !== "test") {
      console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`);
    }
  });
  next();
}
