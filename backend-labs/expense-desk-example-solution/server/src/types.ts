// The domain: who claims, what they claim, and the rules that decide it.

export type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  managerId: string | null;
  homeCity: string;
};

// Where a claim is in its life: waiting for a person, closed, or on its way to Finance's system.
export type ClaimStatus =
  "new" | "rejected" | "awaiting_review" | "approved" | "payout_recorded" | "payout_failed";

export type Claim = {
  id: string;
  employeeId: string;
  amount: number; // what the employee asks for, in USD
  expenseDate: string; // YYYY-MM-DD
  submittedAt: string; // YYYY-MM-DD
  note: string; // the employee's own words
  receiptText: string; // OCR text of the receipt, "" when there is no receipt
  category?: string; // the employee's own pick on the form: meal, hotel, transport, ...
  hasReceiptImage?: boolean; // the photo itself lives in the store (receipts.ts), not in this object
  status: ClaimStatus;
};

export type PastClaim = {
  id: string;
  employeeId: string;
  merchant: string;
  description: string;
  expenseDate: string;
  submittedAt: string;
  amount: number;
  receiptNumber: string | null;
  status: "paid";
};

export type Trip = {
  id: string;
  employeeId: string;
  city: string;
  from: string; // first day, YYYY-MM-DD
  to: string; // last day, YYYY-MM-DD
  purpose: string;
};

export type PolicyRule = {
  id: string; // "R1" ... "R10"
  title: string;
  topics: string[];
  text: string;
};

export type Payment = {
  id: string;
  claimId: string;
  amount: number;
  paidAt: string; // ISO timestamp
};

// ── The contract between the app and YOUR code in src/ai/ ───────────────
export type Decision = "approve" | "partial" | "reject" | "needs_approval" | "escalate";

export type ClaimResult = {
  decision: Decision;
  approvedAmount: number; // what will be paid: the full amount, a lower amount, or 0
  ruleIds: string[]; // the policy rules that decided it, for example ["R3"]
  summary: string; // one or two sentences for the finance team
  emailToEmployee: string; // the message the employee receives
  // Extras added by the level 2 solution (all optional, so the contract above still holds)
  path?: DecisionPath;
  confidence?: number; // 0..1
  flags?: Flag[]; // risk flags raised before the decision
  review?: ReviewRequest; // present when a person must sign
  trace?: TraceStep[]; // what each stage did
};

export type StoredResult = ClaimResult & { processedAt: string };

// ── Level 2 solution types ──────────────────────────────────────────────
export type DecisionPath = "hard-rule" | "workflow" | "agent";

export type Flag = { id: string; severity: "info" | "medium" | "high"; message: string };

export type Reviewer = "manager" | "finance";

export type GateHit = { id: string; title: string; reviewer: Reviewer; reason: string };

export type ReviewRequest = {
  reviewer: Reviewer;
  reviewerName: string | null; // the manager's name when a manager signs
  gates: GateHit[];
  proposedAmount: number; // what goes to Finance if the reviewer approves; 0 means only Reject is possible
  drafts: { ifApproved: string; ifRejected: string };
  resolution?: { action: "approve" | "reject"; note: string; at: string };
};

export type TraceStep = {
  stage: string;
  actor: "code" | "model";
  ms: number;
  tokens: { input: number; output: number };
  note: string;
};

export type PayoutStatus = "queued" | "recorded" | "failed";

// One request to Finance's system per claim. The AI never creates or submits these.
export type PayoutRequest = {
  id: string;
  claimId: string;
  amount: number;
  status: PayoutStatus;
  attempts: number;
  lastError: string | null;
  paymentId: string | null; // Finance's record, once accepted
  createdAt: string;
  updatedAt: string;
};
