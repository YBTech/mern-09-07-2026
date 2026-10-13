import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import BookingForm from "./components/BookingForm";
import DayView from "./components/DayView";
import type { Booking, Room, User } from "./types";

function todayString() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userId, setUserId] = useState<number>(1);
  const [date, setDate] = useState(todayString());
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.rooms(), api.users()])
      .then(([r, u]) => {
        setRooms(r);
        setUsers(u);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const loadBookings = useCallback(() => {
    api
      .bookings(date)
      .then(setBookings)
      .catch((err: Error) => setError(err.message));
  }, [date]);

  useEffect(loadBookings, [loadBookings]);

  async function cancel(booking: Booking) {
    try {
      await api.cancelBooking(booking.id, userId);
      loadBookings();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="app">
      <header className="top">
        <h1>RoomBook</h1>
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label>
          I am
          <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      {error && <p className="error">{error}</p>}
      <main>
        {rooms.length > 0 && (
          <BookingForm rooms={rooms} userId={userId} date={date} onCreated={loadBookings} />
        )}
        <DayView rooms={rooms} bookings={bookings} currentUserId={userId} onCancel={cancel} />
      </main>
    </div>
  );
}
