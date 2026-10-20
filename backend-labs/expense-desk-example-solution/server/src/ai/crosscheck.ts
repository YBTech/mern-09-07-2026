import { tools } from "../tools";
import type { Claim, Flag, PastClaim } from "../types";
import { daysBetween, money, round2 } from "./dates";
import { reject, type Rejection } from "./intake";
import type { Evidence, Receipt } from "./types";

// Stage 3: gather the employee's records, then compare what the employee typed with what the receipt shows.

type FormClaim = Omit<Claim, "status">;

// Independent lookups, run together (they become real API calls in a real system)
export async function loadEvidence(employeeId: string): Promise<Evidence> {
  const [employee, trips, pastClaims] = await Promise.all([
    Promise.resolve(tools.getEmployee({ employeeId })),
    Promise.resolve(tools.getTravelCalendar({ employeeId })),
    Promise.resolve(tools.getPastClaims({ employeeId })),
  ]);
  return { employee, trips, pastClaims };
}

// R8 again, now that the number is read from the photo (stage 1 only sees OCR text)
export function findPaidReceipt(
  receipt: Receipt,
  pastClaims: PastClaim[],
  firstName: string,
): Rejection | null {
  const paid = pastClaims.find((p) => p.receiptNumber && p.receiptNumber === receipt.receiptNumber);
  if (!paid) return null;
  return reject(
    "R8",
    `Receipt ${paid.receiptNumber} was already paid on ${paid.expenseDate} (${paid.merchant}).`,
    firstName,
    `this receipt (${paid.receiptNumber}) was already reimbursed, and a receipt can be claimed only once`,
  );
}

export function crossCheck(claim: FormClaim, receipt: Receipt): Flag[] {
  return [
    unreadable(claim, receipt),
    lineItemsAddUp(receipt),
    dateMatches(claim, receipt),
    categoryMatches(claim, receipt),
    amountAboveReceipt(claim, receipt),
  ].filter((f): f is Flag => f !== null);
}

function unreadable(claim: FormClaim, receipt: Receipt): Flag | null {
  const attached = Boolean(claim.receiptText.trim()) || Boolean(claim.hasReceiptImage);
  if (!attached || receipt.readable) return null;
  return {
    id: "RECEIPT_UNREADABLE",
    severity: "high",
    message: "A receipt is attached but could not be read.",
  };
}

function lineItemsAddUp(receipt: Receipt): Flag | null {
  if (receipt.total === null || receipt.lineItems.length === 0) return null;
  const sum = round2(receipt.lineItems.reduce((acc, item) => acc + item.amount, 0));
  if (Math.abs(sum - receipt.total) <= 0.02) return null;
  return {
    id: "LINE_ITEMS_MISMATCH",
    severity: "high",
    message: `Line items add up to ${money(sum)} but the receipt total is ${money(receipt.total)}.`,
  };
}

function dateMatches(claim: FormClaim, receipt: Receipt): Flag | null {
  if (!receipt.receiptDate) return null;
  const gap = Math.abs(daysBetween(receipt.receiptDate, claim.expenseDate));
  if (gap <= 1) return null;
  return {
    id: "DATE_MISMATCH",
    severity: "high",
    message: `The form says ${claim.expenseDate} but the receipt says ${receipt.receiptDate}.`,
  };
}

function categoryMatches(claim: FormClaim, receipt: Receipt): Flag | null {
  const chosen = claim.category?.toLowerCase();
  if (
    !chosen ||
    chosen === "other" ||
    receipt.expenseKind === "other" ||
    chosen === receipt.expenseKind
  )
    return null;
  return {
    id: "CATEGORY_MISMATCH",
    severity: "high",
    message: `The form says "${chosen}" but the receipt looks like "${receipt.expenseKind}".`,
  };
}

// Claiming more than the receipt shows is normal: R1 pays the receipt total
function amountAboveReceipt(claim: FormClaim, receipt: Receipt): Flag | null {
  if (receipt.total === null || claim.amount <= receipt.total + 0.01) return null;
  return {
    id: "AMOUNT_ABOVE_RECEIPT",
    severity: "info",
    message: `Claimed ${money(claim.amount)}, receipt total is ${money(receipt.total)} (R1).`,
  };
}
