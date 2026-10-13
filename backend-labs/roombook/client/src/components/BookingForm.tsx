import { useState, type FormEvent } from "react";
import { api } from "../api";
import type { Room } from "../types";

interface Props {
  rooms: Room[];
  userId: number;
  date: string;
  onCreated: () => void;
}

export default function BookingForm({ rooms, userId, date, onCreated }: Props) {
  const [roomId, setRoomId] = useState<number>(rooms[0]?.id ?? 0);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.createBooking({
        roomId,
        userId,
        title,
        start: `${date}T${start}`,
        end: `${date}T${end}`,
      });
      setTitle("");
      onCreated();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form className="booking-form" onSubmit={submit}>
      <h2>Book a room on {date}</h2>
      <label>
        Room
        <select value={roomId} onChange={(e) => setRoomId(Number(e.target.value))}>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} (seats {r.capacity})
            </option>
          ))}
        </select>
      </label>
      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Weekly sync"
          required
        />
      </label>
      <div className="row">
        <label>
          From
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
        </label>
        <label>
          To
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit">Book</button>
    </form>
  );
}
