import type { Trip } from "../types";
import { money, round2 } from "./dates";
import type { ClaimContext, Verdict } from "./types";

// Stage 5a: the routine claim's decision, as plain arithmetic on the structured receipt. No model involved.

const MEAL_CAP_PER_PERSON = 75;
const HOTEL_CAP_PER_NIGHT = 250;

// What is left to pay so far, and the rules and reasons that got it there
type Running = { amount: number; ruleIds: string[]; reasons: string[] };

export function decideByPolicy(ctx: ClaimContext): Verdict {
  const { receipt } = ctx;
  if (receipt.expenseKind === "gift")
    return escalate(["R7"], "Gifts are never paid through expenses (R7).");
  if (receipt.expenseKind === "other") return escalate([], "Not clearly a covered expense (R10).");

  const afterReceipt = removeAlcohol(capAtReceiptTotal(start(ctx), ctx), ctx);
  if (receipt.expenseKind === "meal") return mealVerdict(afterReceipt, ctx);
  if (receipt.expenseKind === "hotel") return hotelVerdict(afterReceipt, ctx);
  return finish(addRule(afterReceipt, "R10", "Covered work expense with a receipt (R10)."), ctx);
}

// ── Steps that change the running amount ────────────────────────────────

const start = (ctx: ClaimContext): Running => ({
  amount: ctx.claim.amount,
  ruleIds: [],
  reasons: [],
});

// R1: pay what the receipt shows when the claim is higher
function capAtReceiptTotal(state: Running, { receipt }: ClaimContext): Running {
  if (receipt.total === null || state.amount <= receipt.total + 0.005) return state;
  return {
    ...addRule(state, "R1", `Receipt total ${money(receipt.total)} is lower than the claim (R1).`),
    amount: receipt.total,
  };
}

function removeAlcohol(state: Running, { receipt }: ClaimContext): Running {
  const alcohol = round2(
    receipt.lineItems.filter((i) => i.kind === "alcohol").reduce((sum, i) => sum + i.amount, 0),
  );
  if (alcohol === 0) return state;
  return {
    ...addRule(state, "R3", `Alcohol removed: ${money(alcohol)} (R3).`),
    amount: round2(state.amount - alcohol),
  };
}

function mealVerdict(state: Running, ctx: ClaimContext): Verdict {
  const { receipt, evidence, claim } = ctx;
  const hosting = receipt.purpose === "client_hosting" && Boolean(receipt.hostedClient);
  if (!hosting && !onTrip(evidence.trips, claim.expenseDate)) {
    return rejectWith(["R2"], "No trip on that date and no client named in the note (R2).");
  }
  const cap = MEAL_CAP_PER_PERSON * Math.max(1, receipt.guests ?? 1);
  const capped =
    state.amount > cap
      ? { ...addRule(state, "R2", `Meal cap ${money(cap)} applied (R2).`), amount: cap }
      : addRule(state, "R2", "Meal covered (R2).");
  return finish(capped, ctx);
}

function hotelVerdict(state: Running, ctx: ClaimContext): Verdict {
  const nights = Math.max(1, ctx.receipt.nights ?? 1);
  const cap = HOTEL_CAP_PER_NIGHT * nights;
  const capped =
    state.amount > cap
      ? {
          ...addRule(
            state,
            "R4",
            `Hotel cap ${money(HOTEL_CAP_PER_NIGHT)} per night applied (R4).`,
          ),
          amount: cap,
        }
      : addRule(state, "R4", "Hotel within the nightly cap (R4).");
  return finish(capped, ctx);
}

// ── Helpers ─────────────────────────────────────────────────────────────

const onTrip = (trips: Trip[], date: string) => trips.some((t) => t.from <= date && t.to >= date);

const addRule = (state: Running, ruleId: string, reason: string): Running => ({
  ...state,
  ruleIds: state.ruleIds.includes(ruleId) ? state.ruleIds : [...state.ruleIds, ruleId],
  reasons: [...state.reasons, reason],
});

function finish(state: Running, ctx: ClaimContext): Verdict {
  const payable = round2(Math.max(0, state.amount));
  if (payable === 0) return rejectWith(state.ruleIds, "Nothing is left to pay after the rules.");
  const decision = payable < ctx.claim.amount - 0.005 ? "partial" : "approve";
  return {
    decision,
    payable,
    ruleIds: state.ruleIds,
    reasons: state.reasons,
    confidence: ctx.receipt.readable ? 0.95 : 0.7,
  };
}

const rejectWith = (ruleIds: string[], reason: string): Verdict => ({
  decision: "reject",
  payable: 0,
  ruleIds,
  reasons: [reason],
  confidence: 0.9,
});
const escalate = (ruleIds: string[], reason: string): Verdict => ({
  decision: "escalate",
  payable: 0,
  ruleIds,
  reasons: [reason],
  confidence: 0.9,
});
