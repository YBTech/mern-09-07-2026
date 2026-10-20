import { tools } from "../tools";
import type { Claim, PastClaim } from "../types";
import { daysBetween } from "./dates";

// Stage 1: checks the policy decides without judgment. A hit rejects the claim before any model call.

export type Rejection = { ruleIds: string[]; summary: string; email: string };

type FormClaim = Omit<Claim, "status">;

const DEADLINE_DAYS = 60;
const RECEIPT_FREE_LIMIT = 25;

export function hardChecks(claim: FormClaim, pastClaims: PastClaim[]): Rejection | null {
  const firstName = tools.getEmployee({ employeeId: claim.employeeId }).name.split(" ")[0];
  return (
    tooLate(claim, firstName) ??
    missingReceipt(claim, firstName) ??
    paidReceipt(claim, pastClaims, firstName)
  );
}

// R5: claims must be submitted within 60 days of the expense
function tooLate(claim: FormClaim, firstName: string): Rejection | null {
  const age = daysBetween(claim.expenseDate, claim.submittedAt);
  if (age <= DEADLINE_DAYS) return null;
  return reject(
    "R5",
    `Submitted ${age} days after the expense; the limit is ${DEADLINE_DAYS}.`,
    firstName,
    `claims must be submitted within ${DEADLINE_DAYS} days of the expense, and this one was ${age} days late`,
  );
}

// R1: anything over $25 needs a receipt
function missingReceipt(claim: FormClaim, firstName: string): Rejection | null {
  const hasReceipt = Boolean(claim.receiptText.trim()) || Boolean(claim.hasReceiptImage);
  if (hasReceipt || claim.amount <= RECEIPT_FREE_LIMIT) return null;
  return reject(
    "R1",
    `No receipt attached for $${claim.amount.toFixed(2)} (limit without a receipt: $${RECEIPT_FREE_LIMIT}).`,
    firstName,
    `expenses over $${RECEIPT_FREE_LIMIT} need a receipt, and none was attached. You can submit it again with the receipt`,
  );
}

// R8: the receipt number of a claim that was already paid appears on this receipt
function paidReceipt(
  claim: FormClaim,
  pastClaims: PastClaim[],
  firstName: string,
): Rejection | null {
  const paid = pastClaims.find(
    (p) => p.receiptNumber && claim.receiptText.includes(p.receiptNumber),
  );
  if (!paid) return null;
  return reject(
    "R8",
    `Receipt ${paid.receiptNumber} was already paid on ${paid.expenseDate} (${paid.merchant}).`,
    firstName,
    `this receipt (${paid.receiptNumber}) was already reimbursed, and a receipt can be claimed only once`,
  );
}

export function reject(
  ruleId: string,
  summary: string,
  firstName: string,
  reason: string,
): Rejection {
  return {
    ruleIds: [ruleId],
    summary,
    email: `Hi ${firstName},\n\nWe could not reimburse this claim: ${reason} (policy ${ruleId}).\n\nIf something looks wrong, reply to this email and Finance will take a look.\n\nBrightline Expense Desk`,
  };
}
