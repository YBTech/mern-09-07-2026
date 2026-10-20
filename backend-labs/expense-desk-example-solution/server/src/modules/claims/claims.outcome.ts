import { ConflictError, NotFoundError, ValidationError } from "../../errors";
import { createPayout, submitPayout } from "../../payouts";
import { db } from "../../store";
import type { Claim, ClaimResult, ReviewRequest, StoredResult } from "../../types";
import type { ReviewItem } from "./claims.types";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 🔀 STAGE 8: ROUTE THE OUTCOME. The AI has decided; this file carries it out.
// ════════════════════════════════════════════════════════════════════════════════════════════════
// Approved → payout request for Finance. Needs a person → review queue. Rejected → closed.

export async function routeOutcome(claim: Claim, result: ClaimResult): Promise<void> {
  if (result.decision === "approve" || result.decision === "partial")
    return handOffToFinance(claim.id, result.approvedAmount);
  if (result.decision === "reject") return close(claim, result);
  return sendToReview(claim, result);
}

// ── The review queue ────────────────────────────────────────────────────

export function getReviewQueue(): ReviewItem[] {
  return db.claims
    .filter((c) => c.status === "awaiting_review")
    .map((claim) => ({
      claim,
      employee: db.employees.find((e) => e.id === claim.employeeId) ?? null,
      merchant: claim.receiptText.split("\n")[0]?.trim() || "(see receipt)",
      result: db.results.get(claim.id)!,
      receiptImage: db.receiptImages.get(claim.id) ?? null,
    }));
}

// The reviewer approves: the payout request is created before anything else, so a second click is refused
export async function approveReview(claimId: string, note = ""): Promise<void> {
  const { claim, result, review } = waitingForReview(claimId);
  if (review.proposedAmount <= 0)
    throw new ValidationError("Nothing would be paid on this claim: reject it to close it");
  resolve(result, review, "approve", note);
  const payout = createPayout(claim.id, review.proposedAmount);
  await submitPayout(payout.id);
}

export function rejectReview(claimId: string, note = ""): void {
  const { claim, result, review } = waitingForReview(claimId);
  resolve(result, review, "reject", note);
  claim.status = "rejected";
  notifyEmployee(claim, result.emailToEmployee);
}

// ── Helpers ─────────────────────────────────────────────────────────────

async function handOffToFinance(claimId: string, amount: number) {
  const payout = createPayout(claimId, amount);
  await submitPayout(payout.id);
}

function close(claim: Claim, result: ClaimResult) {
  claim.status = "rejected";
  notifyEmployee(claim, result.emailToEmployee);
}

function sendToReview(claim: Claim, result: ClaimResult) {
  claim.status = "awaiting_review";
  const review = (result.review ??= fallbackReview(result));
  const who = review.reviewer === "manager" ? `manager ${review.reviewerName ?? ""}` : "Finance";
  console.log(
    `[notify] ${claim.id} is waiting for ${who}: ${review.gates.map((g) => g.id).join(", ") || "no gate listed"}`,
  );
}

// Only reached by a processClaim that forgot to attach a review
function fallbackReview(result: ClaimResult): ReviewRequest {
  return {
    reviewer: "finance",
    reviewerName: null,
    gates: [],
    proposedAmount: result.approvedAmount,
    drafts: { ifApproved: result.emailToEmployee, ifRejected: result.emailToEmployee },
  };
}

function waitingForReview(claimId: string) {
  const claim = db.claims.find((c) => c.id === claimId);
  if (!claim) throw new NotFoundError(`No claim with id ${claimId}`);
  const result = db.results.get(claimId);
  if (claim.status !== "awaiting_review" || !result?.review) {
    throw new ConflictError(`${claimId} is not waiting for review (status: ${claim.status})`);
  }
  return { claim, result, review: result.review };
}

function resolve(
  result: StoredResult,
  review: ReviewRequest,
  action: "approve" | "reject",
  note: string,
) {
  review.resolution = { action, note: note.trim(), at: new Date().toISOString() };
  result.emailToEmployee =
    action === "approve" ? review.drafts.ifApproved : review.drafts.ifRejected;
}

const notifyEmployee = (claim: Claim, email: string) =>
  console.log(`[email to ${claim.employeeId}] ${email.split("\n")[0]} …`);
