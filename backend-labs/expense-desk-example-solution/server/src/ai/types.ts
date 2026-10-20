import type { Claim, Decision, Employee, Flag, PastClaim, Trip } from "../types";

// The data that moves between stages. Each stage returns one of these; nothing is shared through globals.

export type LineKind =
  | "meal"
  | "alcohol"
  | "lodging"
  | "tax"
  | "transport"
  | "equipment"
  | "conference"
  | "gift"
  | "fee"
  | "other";

export type LineItem = { description: string; amount: number; kind: LineKind };

export type ExpenseKind =
  "meal" | "hotel" | "transport" | "conference" | "equipment" | "gift" | "other";

// Stage 2 output: the receipt (and the note) as structured data
export type Receipt = {
  readable: boolean; // false when there is no receipt or it cannot be read
  merchant: string | null;
  receiptDate: string | null; // YYYY-MM-DD; for a hotel, the departure day
  receiptNumber: string | null;
  total: number | null;
  lineItems: LineItem[];
  guests: number | null;
  nights: number | null; // hotels only
  expenseKind: ExpenseKind;
  purpose: "travel" | "client_hosting" | "none"; // read from the employee's note
  hostedClient: string | null;
};

// Stage 3 output: everything the employee's records say about this claim
export type Evidence = {
  employee: ReturnType<typeof import("../tools").tools.getEmployee>;
  trips: Trip[];
  pastClaims: PastClaim[];
};

export type ClaimContext = {
  claim: Omit<Claim, "status">;
  receipt: Receipt;
  evidence: Evidence;
  flags: Flag[];
};

// What the policy engine or the agent proposes, before the safety checks
export type Verdict = {
  decision: Decision; // approve | partial | reject | escalate (needs_approval comes from the gates)
  payable: number; // what would be paid if everything is cleared (for an escalation: what Finance would pay)
  ruleIds: string[];
  reasons: string[];
  confidence: number;
  inconclusive?: boolean; // the agent ran out of turns or budget
};

export type DecisionPathName = "workflow" | "agent";
export type { Employee };
