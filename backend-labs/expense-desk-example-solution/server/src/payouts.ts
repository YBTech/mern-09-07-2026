import { ConflictError, NotFoundError } from "./errors";
import { db } from "./store";
import { tools } from "./tools";
import type { PayoutRequest } from "./types";

// ════════════════════════════════════════════════════════════════════════════════════════════════
// 💸 STAGE 9: HAND-OFF TO FINANCE. The AI never pays; approved claims become a payout request here.
// ════════════════════════════════════════════════════════════════════════════════════════════════
// Finance's system is tools.payClaim in this lab. Only this file calls it, once per claim.

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 300;

const submitting = new Set<string>(); // payout ids being sent right now

// One request per claim: asking again returns the existing one
export function createPayout(claimId: string, amount: number): PayoutRequest {
  const existing = db.payouts.find((p) => p.claimId === claimId);
  if (existing) return existing;
  const now = new Date().toISOString();
  const payout: PayoutRequest = {
    id: `PO-${db.payouts.length + 1}`,
    claimId,
    amount,
    status: "queued",
    attempts: 0,
    lastError: null,
    paymentId: null,
    createdAt: now,
    updatedAt: now,
  };
  db.payouts.push(payout);
  setClaimStatus(claimId, "approved");
  return payout;
}

// Send it to Finance, retrying a few times. A recorded payout is never sent again.
export async function submitPayout(payoutId: string): Promise<PayoutRequest> {
  const payout = findPayout(payoutId);
  if (isRecorded(payout) || submitting.has(payoutId)) return payout;

  submitting.add(payoutId);
  try {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS && !isRecorded(payout); attempt++) {
      tryOnce(payout);
      if (!isRecorded(payout) && attempt < MAX_ATTEMPTS) await sleep(RETRY_DELAY_MS);
    }
  } finally {
    submitting.delete(payoutId);
  }
  return payout;
}

export const listFailedPayouts = () => db.payouts.filter((p) => p.status === "failed");

// Finance presses Retry on a failed payout
export function retryPayout(payoutId: string): Promise<PayoutRequest> {
  const payout = findPayout(payoutId);
  if (payout.status !== "failed")
    throw new ConflictError(`${payoutId} is ${payout.status}, only failed payouts can be retried`);
  payout.status = "queued";
  return submitPayout(payoutId);
}

export const setFinanceOutage = (on: boolean) => {
  db.financeOutage = on;
};

// ── One attempt ─────────────────────────────────────────────────────────

function tryOnce(payout: PayoutRequest) {
  payout.attempts += 1;
  try {
    payout.paymentId = callFinanceApi(payout).id;
    markStatus(payout, "recorded", null);
  } catch (err) {
    markStatus(payout, "failed", (err as Error).message);
  }
}

function callFinanceApi(payout: PayoutRequest) {
  if (db.financeOutage) throw new Error("Finance system unavailable (503)");
  return tools.payClaim({ claimId: payout.claimId, amount: payout.amount });
}

function markStatus(payout: PayoutRequest, status: PayoutRequest["status"], error: string | null) {
  payout.status = status;
  payout.lastError = error;
  payout.updatedAt = new Date().toISOString();
  setClaimStatus(payout.claimId, status === "recorded" ? "payout_recorded" : "payout_failed");
}

function setClaimStatus(claimId: string, status: "approved" | "payout_recorded" | "payout_failed") {
  const claim = db.claims.find((c) => c.id === claimId);
  if (claim) claim.status = status;
}

function findPayout(payoutId: string): PayoutRequest {
  const payout = db.payouts.find((p) => p.id === payoutId);
  if (!payout) throw new NotFoundError(`No payout with id ${payoutId}`);
  return payout;
}

// A function, so TypeScript re-reads the status after each attempt changes it
const isRecorded = (payout: PayoutRequest) => payout.status === "recorded";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
