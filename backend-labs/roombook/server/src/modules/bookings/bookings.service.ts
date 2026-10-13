import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../../errors";
import { bookingsRepository } from "./bookings.repository";
import { roomsRepository } from "../rooms/rooms.repository";
import { usersRepository } from "../users/users.repository";
import type { Booking, CreateBookingInput } from "./bookings.types";
import { dateOf, isValidDate, isValidDateTime } from "../../utils/datetime";
import { isRoomFree } from "../availability/availability.service";

export function listBookings(date: string): Booking[] {
  if (!isValidDate(date)) throw new ValidationError("date must look like 2030-01-07");
  return bookingsRepository.listForDate(date);
}

export function createBooking(input: CreateBookingInput): Booking {
  const { roomId, userId, title, start, end } = input;

  if (typeof title !== "string" || title.trim() === "" || title.length > 100) {
    throw new ValidationError("title is required (100 characters at most)");
  }
  if (!isValidDateTime(start) || !isValidDateTime(end)) {
    throw new ValidationError("start and end must look like 2030-01-07T09:30");
  }
  if (dateOf(start) !== dateOf(end))
    throw new ValidationError("a booking must start and end on the same day");
  if (end <= start) throw new ValidationError("end must be after start");

  if (!roomsRepository.findById(roomId)) throw new NotFoundError(`Room ${roomId} not found`);
  if (!usersRepository.findById(userId)) throw new NotFoundError(`User ${userId} not found`);

  if (!isRoomFree(roomId, start, end)) throw new ConflictError("Room not available");

  const id = bookingsRepository.insert({ roomId, userId, title: title.trim(), start, end });
  return bookingsRepository.findById(id)!;
}

export function cancelBooking(id: number, userId: number): void {
  const booking = bookingsRepository.findById(id);
  if (!booking) throw new NotFoundError(`Booking ${id} not found`);
  if (booking.userId !== userId) throw new ForbiddenError("You can only cancel your own bookings");
  bookingsRepository.remove(id);
}
