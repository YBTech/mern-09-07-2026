import { processClaim } from "../../ai/workflow";
import { AppError, ConflictError, NotFoundError, ValidationError } from "../../errors";
import { db } from "../../store";
import type { Claim, ClaimResult } from "../../types";
import { routeOutcome } from "./claims.outcome";
import type { ClaimDetail, ClaimSummary, NewClaim } from "./claims.types";

const DECISIONS = ["approve", "partial", "reject", "needs_approval", "escalate"];
const CATEGORIES = ["meal", "hotel", "transport", "conference", "equipment", "other"];
const MAX_IMAGE_CHARS = 6_000_000; // about 4.5 MB of photo
const inFlight = new Set<string>(); // claims being processed right now

function findClaim(id: string): Claim {
  const claim = db.claims.find((c) => c.id === id);
  if (!claim) throw new NotFoundError(`No claim with id ${id}`);
  return claim;
}

// The receipt's first line is usually the merchant
function merchantOf(claim: Claim) {
  return claim.receiptText.split("\n")[0]?.trim() || "(no receipt)";
}

export function listClaims(): ClaimSummary[] {
  return db.claims.map((claim) => ({
    id: claim.id,
    employeeName: db.employees.find((e) => e.id === claim.employeeId)?.name ?? claim.employeeId,
    merchant: merchantOf(claim),
    amount: claim.amount,
    submittedAt: claim.submittedAt,
    status: claim.status,
    decision: db.results.get(claim.id)?.decision ?? null,
  }));
}

export function getClaimDetail(id: string): ClaimDetail {
  const claim = findClaim(id);
  return {
    claim,
    employee: db.employees.find((e) => e.id === claim.employeeId) ?? null,
    result: db.results.get(id) ?? null,
    payments: db.payments.filter((p) => p.claimId === id),
    payout: db.payouts.find((p) => p.claimId === id) ?? null,
    receiptImage: db.receiptImages.get(id) ?? null,
  };
}

export function createClaim(input: NewClaim): Claim {
  if (!db.employees.some((e) => e.id === input.employeeId))
    throw new ValidationError("Unknown employee");
  if (!(input.amount > 0)) throw new ValidationError("Amount must be more than 0");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.expenseDate ?? ""))
    throw new ValidationError("expenseDate must be YYYY-MM-DD");
  if (!input.note?.trim()) throw new ValidationError("Write a note about the expense");
  if (input.category && !CATEGORIES.includes(input.category))
    throw new ValidationError("Unknown category");
  if (input.receiptImage && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(input.receiptImage))
    throw new ValidationError("The receipt photo must be a png, jpeg, webp or gif");
  if (input.receiptImage && input.receiptImage.length > MAX_IMAGE_CHARS)
    throw new ValidationError("The receipt photo is too large (4 MB at most)");

  const claim: Claim = {
    id: `C${String(db.claims.length + 1).padStart(2, "0")}`,
    employeeId: input.employeeId,
    amount: Math.round(input.amount * 100) / 100,
    expenseDate: input.expenseDate,
    submittedAt: new Date().toISOString().slice(0, 10),
    note: input.note.trim(),
    receiptText: input.receiptText?.trim() ?? "",
    category: input.category || undefined,
    hasReceiptImage: Boolean(input.receiptImage),
    status: "new",
  };
  db.claims.push(claim);
  if (input.receiptImage) db.receiptImages.set(claim.id, input.receiptImage);
  return claim;
}

// Stages 1-7 decide (the AI), stage 8 carries the decision out (this module)
export async function processClaimById(id: string): Promise<ClaimResult> {
  const claim = findClaim(id);
  if (!["new", "awaiting_review"].includes(claim.status)) {
    throw new ConflictError(`${id} is ${claim.status}; press "Reset data" to start over`);
  }
  if (inFlight.has(id)) throw new ConflictError(`${id} is already being processed`);

  inFlight.add(id);
  try {
    const result = await decide(id);
    db.results.set(id, { ...result, processedAt: new Date().toISOString() });
    await routeOutcome(claim, result);
    return result;
  } finally {
    inFlight.delete(id);
  }
}

async function decide(id: string): Promise<ClaimResult> {
  let result: ClaimResult;
  try {
    result = await processClaim(id);
  } catch (err) {
    console.error(err);
    throw new AppError(500, `processClaim failed: ${(err as Error).message}`);
  }
  const problem = checkResult(result);
  if (problem) throw new AppError(500, `processClaim returned an invalid result: ${problem}`);
  return result;
}

function checkResult(r: ClaimResult): string | null {
  if (!r || typeof r !== "object") return "expected an object";
  if (!DECISIONS.includes(r.decision)) return `decision must be one of ${DECISIONS.join(", ")}`;
  if (typeof r.approvedAmount !== "number" || r.approvedAmount < 0)
    return "approvedAmount must be a number ≥ 0";
  if (!Array.isArray(r.ruleIds) || r.ruleIds.some((id) => !/^R\d+$/.test(id)))
    return 'ruleIds must look like ["R3"]';
  for (const field of ["summary", "emailToEmployee"] as const) {
    if (typeof r[field] !== "string") {
      return `${field} must be a string, got ${typeof r[field]} (if it came from a tool call, check that stop_reason was not "max_tokens")`;
    }
  }
  return null;
}
