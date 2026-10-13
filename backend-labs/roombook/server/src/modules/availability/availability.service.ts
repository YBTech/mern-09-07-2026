import { bookingsRepository } from "../bookings/bookings.repository";
import type { Booking } from "../bookings/bookings.types";
import { dateOf } from "../../utils/datetime";

/**
 * Do two time ranges overlap? Times are "YYYY-MM-DDTHH:mm" text, so string comparison works.
 */
export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

/** Existing bookings in this room that clash with the requested time range. */
export function findConflicts(roomId: number, start: string, end: string): Booking[] {
  return bookingsRepository
    .listForRoomOnDate(roomId, dateOf(start))
    .filter((existing) => overlaps(start, end, existing.start, existing.end));
}

export function isRoomFree(roomId: number, start: string, end: string): boolean {
  return findConflicts(roomId, start, end).length === 0;
}
