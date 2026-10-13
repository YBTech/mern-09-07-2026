import type { Booking, Room } from "../types";

interface Props {
  rooms: Room[];
  bookings: Booking[];
  currentUserId: number;
  onCancel: (booking: Booking) => void;
}

const timeOf = (dateTime: string) => dateTime.slice(11, 16);

export default function DayView({ rooms, bookings, currentUserId, onCancel }: Props) {
  return (
    <div className="day-view">
      {rooms.map((room) => {
        const roomBookings = bookings.filter((b) => b.roomId === room.id);
        return (
          <section key={room.id} className="room-card">
            <header>
              <h3>{room.name}</h3>
              <span className="muted">
                floor {room.floor} · seats {room.capacity}
              </span>
            </header>
            {roomBookings.length === 0 ? (
              <p className="muted">Free all day</p>
            ) : (
              <ul>
                {roomBookings.map((b) => (
                  <li key={b.id}>
                    <strong>
                      {timeOf(b.start)} to {timeOf(b.end)}
                    </strong>{" "}
                    {b.title} <span className="muted">({b.userName})</span>
                    {b.userId === currentUserId && (
                      <button className="link" onClick={() => onCancel(b)}>
                        Cancel
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
