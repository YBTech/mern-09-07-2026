import type {
  Claim,
  ClaimStatus,
  Decision,
  Employee,
  Payment,
  PayoutRequest,
  StoredResult,
} from "../../types";

// One row of the inbox
export type ClaimSummary = {
  id: string;
  employeeName: string;
  merchant: string;
  amount: number;
  submittedAt: string;
  status: ClaimStatus;
  decision: Decision | null;
};

export type ClaimDetail = {
  claim: Claim;
  employee: Employee | null;
  result: StoredResult | null;
  payments: Payment[];
  payout: PayoutRequest | null;
  receiptImage: string | null; // data URL of the photo, when there is one
};

// One card in the review queue
export type ReviewItem = {
  claim: Claim;
  employee: Employee | null;
  merchant: string;
  result: StoredResult;
  receiptImage: string | null;
};

export type NewClaim = {
  employeeId: string;
  amount: number;
  expenseDate: string;
  note: string;
  category?: string;
  receiptText?: string;
  receiptImage?: string; // data URL
};

export type ReviewAction = { note?: string };
