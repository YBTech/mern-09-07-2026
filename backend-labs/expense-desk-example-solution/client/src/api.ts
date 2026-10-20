import type {
  Claim,
  ClaimDetail,
  ClaimResult,
  ClaimSummary,
  Employee,
  NewClaim,
  PayoutRequest,
  ReviewItem,
} from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body as T;
}

const post = (body?: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body ?? {}),
});

// Every call from the browser to the API
export const api = {
  claims: () => request<ClaimSummary[]>("/api/claims"),
  claim: (id: string) => request<ClaimDetail>(`/api/claims/${id}`),
  createClaim: (input: NewClaim) => request<Claim>("/api/claims", post(input)),
  processClaim: (id: string) => request<ClaimResult>(`/api/claims/${id}/process`, post()),
  reviewQueue: () => request<ReviewItem[]>("/api/claims/queue"),
  approve: (id: string, note: string) =>
    request<ClaimDetail>(`/api/claims/${id}/approve`, post({ note })),
  reject: (id: string, note: string) =>
    request<ClaimDetail>(`/api/claims/${id}/reject`, post({ note })),
  failedPayouts: () => request<PayoutRequest[]>("/api/payouts/failed"),
  retryPayout: (id: string) => request<PayoutRequest>(`/api/payouts/${id}/retry`, post()),
  financeOutage: () => request<{ on: boolean }>("/api/admin/finance-outage"),
  setFinanceOutage: (on: boolean) =>
    request<{ on: boolean }>("/api/admin/finance-outage", { ...post({ on }), method: "PUT" }),
  employees: () => request<Employee[]>("/api/employees"),
  reset: () => request<void>("/api/admin/reset", post()),
};
