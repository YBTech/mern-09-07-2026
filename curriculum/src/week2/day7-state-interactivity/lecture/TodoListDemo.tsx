import { useState } from "react";

type Priority = "low" | "medium" | "high";
type Todo = { id: string; title: string; priority: Priority };

const MIN_TITLE_LENGTH = 3;

export default function TodoListDemo() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: crypto.randomUUID(), title: "Review closures", priority: "medium" },
    { id: crypto.randomUUID(), title: "Ship the login form", priority: "high" },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("medium");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (newTitle.trim().length < MIN_TITLE_LENGTH) {
      setError(`Title needs at least ${MIN_TITLE_LENGTH} characters.`);
      return;
    }
    setError("");
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), title: newTitle.trim(), priority: newPriority }]);
    setNewTitle("");
    setNewPriority("medium");
  }

  function handleDelete(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function saveEdit(id: string) {
    if (editTitle.trim().length < MIN_TITLE_LENGTH) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: editTitle.trim(), priority: editPriority } : t)),
    );
    setEditingId(null);
  }

  return (
    <div className="todo-app">
      <form className="todo-form-row" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New todo title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add</button>
      </form>
      {error && <p className="todo-error">{error}</p>}

      {todos.length === 0 && <p className="todo-empty">No todos yet.</p>}

      {todos.map((todo) =>
        editingId === todo.id ? (
          <div className="todo-form-row" key={todo.id}>
            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value as Priority)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="button" onClick={() => saveEdit(todo.id)}>
              Save
            </button>
            <button type="button" className="secondary" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="todo-item-row" key={todo.id}>
            <span className={`todo-priority todo-priority-${todo.priority}`}>{todo.priority}</span>
            <span className="todo-item-title">{todo.title}</span>
            <span className="todo-item-actions">
              <button type="button" onClick={() => startEdit(todo)}>
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(todo.id)}>
                Delete
              </button>
            </span>
          </div>
        ),
      )}
    </div>
  );
}
