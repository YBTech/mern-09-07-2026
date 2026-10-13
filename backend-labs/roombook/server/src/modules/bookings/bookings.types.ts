/** A booking joined with its room and user names, as the API returns it. */
export interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  userId: number;
  userName: string;
  title: string;
  /** Office-local time as "YYYY-MM-DDTHH:mm". There are no time zones in RoomBook. */
  start: string;
  end: string;
}

export interface CreateBookingInput {
  roomId: number;
  userId: number;
  title: string;
  start: string;
  end: string;
}
