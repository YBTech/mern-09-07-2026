import React, { useState, type SubmitEvent } from "react";
import TodosProvider, { useTodos, type Todo } from "./TodosContext";

export default function TodoApp() {
  return (
    <TodosProvider>
      <h2>Todo App</h2>
      <AddTodoForm />
      <TodoList />
    </TodosProvider>
  );
}

function AddTodoForm() {
  const [content, setContent] = useState("");
  const { addTodo } = useTodos();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    addTodo(content);
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList() {
  const { todos } = useTodos();
  return (
    <div className="todo-list">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </div>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  const { deleteTodoById } = useTodos();
  return (
    <div style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
      {todo.content}
      <button onClick={() => deleteTodoById(todo.id)}>delete</button>
    </div>
  );
}
