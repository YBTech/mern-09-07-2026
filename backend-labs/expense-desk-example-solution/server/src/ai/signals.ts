import type { Flag, PastClaim, Trip } from "../types";
import { addDays } from "./dates";
import type { ClaimContext, DecisionPathName, Receipt } from "./types";

// Stage 4: small if-checks raise flags; any real flag sends the claim to the agent.

export function raiseFlags(
  { claim, receipt, evidence }: Omit<ClaimContext, "flags">,
  discrepancies: Flag[],
): Flag[] {
  return [
    ...discrepancies,
    giftItem(receipt),
    duplicateOfPaidClaim(claim, receipt, evidence.pastClaims),
    splitIntoSmallClaims(claim, receipt, evidence.pastClaims),
    hotelWithoutTrip(receipt, evidence.trips),
    mealWithoutReason(claim, receipt, evidence.trips),
  ].filter((f): f is Flag => f !== null);
}

export function routeClaim(flags: Flag[]): DecisionPathName {
  return flags.some((f) => f.severity !== "info") ? "agent" : "workflow";
}

// ── The checks ──────────────────────────────────────────────────────────

function giftItem(receipt: Receipt): Flag | null {
  const isGift = receipt.expenseKind === "gift" || receipt.lineItems.some((i) => i.kind === "gift");
  return isGift
    ? { id: "GIFT", severity: "high", message: "The receipt contains a gift or gift card (R7)." }
    : null;
}

function duplicateOfPaidClaim(
  claim: { amount: number; expenseDate: string },
  receipt: Receipt,
  past: PastClaim[],
): Flag | null {
  const twin = past.find(
    (p) =>
      sameMerchant(p.merchant, receipt.merchant) &&
      p.expenseDate === claim.expenseDate &&
      Math.abs(p.amount - claim.amount) < 0.01,
  );
  if (!twin) return null;
  return {
    id: "DUPLICATE_SUSPECTED",
    severity: "high",
    message: `Same merchant, date and amount as paid claim ${twin.id} (R8).`,
  };
}

function splitIntoSmallClaims(
  claim: { amount: number; expenseDate: string; note: string },
  receipt: Receipt,
  past: PastClaim[],
): Flag | null {
  const sameDay = past.filter(
    (p) => sameMerchant(p.merchant, receipt.merchant) && p.expenseDate === claim.expenseDate,
  );
  const noteSaysPart = /\bpart\s*\d|\b\d\s*of\s*\d|\bsplit\b/i.test(claim.note);
  if (sameDay.length > 0 && (claim.amount <= 25 || noteSaysPart)) {
    return {
      id: "SPLIT_SUSPECTED",
      severity: "high",
      message: `${sameDay.length} paid claim(s) from the same merchant on the same day, and this one is small (R9).`,
    };
  }
  return noteSaysPart
    ? {
        id: "SPLIT_SUSPECTED",
        severity: "medium",
        message: "The note says this is one part of a larger expense (R9).",
      }
    : null;
}

function hotelWithoutTrip(receipt: Receipt, trips: Trip[]): Flag | null {
  if (receipt.expenseKind !== "hotel" || !receipt.receiptDate) return null;
  const arrive = addDays(receipt.receiptDate, -(receipt.nights ?? 1));
  const covered = trips.some(
    (t) => t.from <= addDays(receipt.receiptDate!, 1) && t.to >= addDays(arrive, -1),
  );
  return covered
    ? null
    : {
        id: "HOTEL_NO_TRIP",
        severity: "medium",
        message: `No trip in the calendar covers the stay (${arrive} to ${receipt.receiptDate}) (R4).`,
      };
}

function mealWithoutReason(
  claim: { expenseDate: string },
  receipt: Receipt,
  trips: Trip[],
): Flag | null {
  if (receipt.expenseKind !== "meal") return null;
  const hosting = receipt.purpose === "client_hosting" && Boolean(receipt.hostedClient);
  const traveling = trips.some((t) => t.from <= claim.expenseDate && t.to >= claim.expenseDate);
  return hosting || traveling
    ? null
    : {
        id: "MEAL_NO_REASON",
        severity: "medium",
        message: "A meal with no trip on that date and no client named in the note (R2).",
      };
}

// "Tavolata" and "TAVOLATA Seattle" are the same place
export function sameMerchant(a: string | null, b: string | null): boolean {
  const [x, y] = [a, b].map((s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, ""));
  return x.length >= 4 && y.length >= 4 && (x.includes(y) || y.includes(x));
}
