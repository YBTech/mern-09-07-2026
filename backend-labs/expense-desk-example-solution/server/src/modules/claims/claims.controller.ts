import type { Request, Response } from "express";
import * as outcome from "./claims.outcome";
import * as service from "./claims.service";

export function list(_req: Request, res: Response) {
  res.json(service.listClaims());
}

export function get(req: Request<{ id: string }>, res: Response) {
  res.json(service.getClaimDetail(req.params.id));
}

export function create(req: Request, res: Response) {
  res.status(201).json(service.createClaim(req.body));
}

export async function process(req: Request<{ id: string }>, res: Response) {
  res.json(await service.processClaimById(req.params.id));
}

export function queue(_req: Request, res: Response) {
  res.json(outcome.getReviewQueue());
}

export async function approve(req: Request<{ id: string }>, res: Response) {
  await outcome.approveReview(req.params.id, req.body?.note);
  res.json(service.getClaimDetail(req.params.id));
}

export function reject(req: Request<{ id: string }>, res: Response) {
  outcome.rejectReview(req.params.id, req.body?.note);
  res.json(service.getClaimDetail(req.params.id));
}
