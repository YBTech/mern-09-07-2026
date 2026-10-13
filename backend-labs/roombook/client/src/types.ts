export interface Room {
  id: number;
  name: string;
  floor: number;
  capacity: number;
}

export interface User {
  id: number;
  name: string;
}

export interface Booking {
  id: number;
  roomId: number;
  roomName: string;
  userId: number;
  userName: string;
  title: string;
  /** Office-local "YYYY-MM-DDTHH:mm" */
  start: string;
  end: string;
}

export interface NewBooking {
  roomId: number;
  userId: number;
  title: string;
  start: string;
  end: string;
}
