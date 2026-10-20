// Mirrors server/src/types.ts and server/src/modules/claims/claims.types.ts

export type Decision = "approve" | "partial" | "reject" | "needs_approval" | "escalate";
export type ClaimStatus =
  "new" | "rejected" | "awaiting_review" | "approved" | "payout_recorded" | "payout_failed";
export type Reviewer = "manager" | "finance";

export type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  managerId: string | null;
  homeCity: string;
};

export type Claim = {
  id: string;
  employeeId: string;
  amount: number;
  expenseDate: string;
  submittedAt: string;
  note: string;
  receiptText: string;
  category?: string;
  hasReceiptImage?: boolean;
  status: ClaimStatus;
};

export type Flag = { id: string; severity: "info" | "medium" | "high"; message: string };
export type GateHit = { id: string; title: string; reviewer: Reviewer; reason: string };
export type TraceStep = {
  stage: string;
  actor: "code" | "model";
  ms: number;
  tokens: { input: number; output: number };
  note: string;
};

export type ReviewRequest = {
  reviewer: Reviewer;
  reviewerName: string | null;
  gates: GateHit[];
  proposedAmount: number;
  drafts: { ifApproved: string; ifRejected: string };
  resolution?: { action: "approve" | "reject"; note: string; at: string };
};

export type ClaimResult = {
  decision: Decision;
  approvedAmount: number;
  ruleIds: string[];
  summary: string;
  emailToEmployee: string;
  processedAt?: string;
  path?: "hard-rule" | "workflow" | "agent";
  confidence?: number;
  flags?: Flag[];
  review?: ReviewRequest;
  trace?: TraceStep[];
};

export type Payment = { id: string; claimId: string; amount: number; paidAt: string };

export type ClaimSummary = {
  id: string;
  employeeName: string;
  merchant: string;
  amount: number;
  submittedAt: string;
  status: ClaimStatus;
  decision: Decision | null;
};

export type PayoutRequest = {
  id: string;
  claimId: string;
  amount: number;
  status: "queued" | "recorded" | "failed";
  attempts: number;
  lastError: string | null;
  paymentId: string | null;
};

export type ClaimDetail = {
  claim: Claim;
  employee: Employee | null;
  result: ClaimResult | null;
  payments: Payment[];
  payout: PayoutRequest | null;
  receiptImage: string | null;
};

export type ReviewItem = {
  claim: Claim;
  employee: Employee | null;
  merchant: string;
  result: ClaimResult & { review: ReviewRequest };
  receiptImage: string | null;
};

export type NewClaim = {
  employeeId: string;
  amount: number;
  expenseDate: string;
  note: string;
  category?: string;
  receiptText: string;
  receiptImage?: string;
};
