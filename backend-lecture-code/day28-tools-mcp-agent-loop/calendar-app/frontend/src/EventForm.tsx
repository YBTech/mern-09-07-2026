import type { EventInput } from "./api";

interface Props {
  draft: EventInput;
  isEditing: boolean;
  onChange: (draft: EventInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function EventForm({ draft, isEditing, onChange, onSubmit, onCancel, onDelete }: Props) {
  return (
    <form
      className="event-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2>{isEditing ? "Edit event" : "New event"}</h2>
      <input
        placeholder="Title"
        value={draft.title}
        onChange={(e) => onChange({ ...draft, title: e.target.value })}
        required
      />
      <div className="row">
        <input
          type="date"
          value={draft.date}
          onChange={(e) => onChange({ ...draft, date: e.target.value })}
          required
        />
        <input
          type="time"
          value={draft.time}
          onChange={(e) => onChange({ ...draft, time: e.target.value })}
        />
      </div>
      <textarea
        placeholder="Description"
        rows={3}
        value={draft.description}
        onChange={(e) => onChange({ ...draft, description: e.target.value })}
      />
      <div className="row">
        <button type="submit">{isEditing ? "Save" : "Add"}</button>
        {isEditing && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        {onDelete && (
          <button type="button" className="danger" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
