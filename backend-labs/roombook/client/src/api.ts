import type { Booking, NewBooking, Room, User } from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  rooms: () => request<Room[]>("/api/rooms"),
  users: () => request<User[]>("/api/users"),
  bookings: (date: string) => request<Booking[]>(`/api/bookings?date=${date}`),
  createBooking: (input: NewBooking) =>
    request<Booking>("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  cancelBooking: (id: number, userId: number) =>
    request<void>(`/api/bookings/${id}?userId=${userId}`, { method: "DELETE" }),
};
