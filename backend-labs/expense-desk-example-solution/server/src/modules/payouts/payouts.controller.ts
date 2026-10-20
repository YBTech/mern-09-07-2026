import type { Request, Response } from "express";
import { listFailedPayouts, retryPayout, setFinanceOutage } from "../../payouts";
import { db } from "../../store";

export function failed(_req: Request, res: Response) {
  res.json(listFailedPayouts());
}

export async function retry(req: Request<{ id: string }>, res: Response) {
  res.json(await retryPayout(req.params.id));
}

export function getOutage(_req: Request, res: Response) {
  res.json({ on: db.financeOutage });
}

export function putOutage(req: Request, res: Response) {
  setFinanceOutage(Boolean(req.body?.on));
  res.json({ on: db.financeOutage });
}
