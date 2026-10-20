import { tools } from "../tools";
import type { Claim } from "../types";
import { daysBetween } from "./dates";
import type { Receipt, Verdict } from "./types";

// Stage 6a: sanity rules every proposed decision must pass, whoever proposed it.

export function checkGuardrails(
  verdict: Verdict,
  claim: Omit<Claim, "status">,
  receipt: Receipt,
): string[] {
  const pays = verdict.decision === "approve" || verdict.decision === "partial";
  const checks: Array<[boolean, string]> = [
    [verdict.payable < 0, "The amount is negative."],
    [verdict.payable > claim.amount + 0.005, "The amount is more than the claim."],
    [
      receipt.total !== null && pays && verdict.payable > receipt.total + 0.005,
      "The amount is more than the receipt total.",
    ],
    [pays && verdict.payable <= 0, "An approval must pay more than $0."],
    [verdict.decision === "reject" && verdict.payable !== 0, "A rejection must pay $0."],
    [
      pays && daysBetween(claim.expenseDate, claim.submittedAt) > 60,
      "Past the 60-day deadline (R5).",
    ],
    [
      pays && claim.amount > 25 && !claim.receiptText.trim() && !claim.hasReceiptImage,
      "No receipt for more than $25 (R1).",
    ],
    [
      unknownRules(verdict.ruleIds).length > 0,
      `Unknown rule ids: ${unknownRules(verdict.ruleIds).join(", ")}.`,
    ],
  ];
  return checks.filter(([failed]) => failed).map(([, message]) => message);
}

function unknownRules(ruleIds: string[]): string[] {
  const known = new Set(tools.getPolicy().map((r) => r.id));
  return ruleIds.filter((id) => !known.has(id));
}
