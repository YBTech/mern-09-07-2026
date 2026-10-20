import { readFileSync } from "node:fs";
import type {
  Claim,
  Employee,
  PastClaim,
  Payment,
  PayoutRequest,
  PolicyRule,
  StoredResult,
  Trip,
} from "./types";

// An in-memory "database", loaded from server/data/*.json. Everything resets when the server restarts
// (or when you press "Reset data" in the app). Your AI code reads it through src/tools, not directly.

const DATA_DIR = new URL("../data/", import.meta.url);

function load<T>(file: string): T {
  return JSON.parse(readFileSync(new URL(file, DATA_DIR), "utf8")) as T;
}

type Store = {
  employees: Employee[];
  policy: PolicyRule[];
  trips: Trip[];
  pastClaims: PastClaim[];
  claims: Claim[];
  results: Map<string, StoredResult>; // claimId → the last result of processClaim
  payments: Payment[];
  receiptImages: Map<string, string>; // claimId → receipt photo as a data URL
  payouts: PayoutRequest[]; // requests to Finance's system, one per approved claim
  financeOutage: boolean; // demo switch: Finance's API answers with an error
};

export const db: Store = {
  employees: [],
  policy: [],
  trips: [],
  pastClaims: [],
  claims: [],
  results: new Map(),
  payments: [],
  receiptImages: new Map(),
  payouts: [],
  financeOutage: false,
};

export function resetStore() {
  db.employees = load("employees.json");
  db.policy = load("policy.json");
  db.trips = load("trips.json");
  db.pastClaims = load("past-claims.json");
  db.claims = load("claims.json");
  db.results = new Map();
  db.payments = [];
  db.receiptImages = new Map();
  db.payouts = [];
  db.financeOutage = false;
}

resetStore();
