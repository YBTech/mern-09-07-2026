import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
}

export interface TodosContextType {
  todos: Todo[];
  addTodo: (content: string) => void;
  deleteTodoById: (id: string) => void;
}

export const TodosContext = createContext<TodosContextType | null>(null);

export default function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", content: "Buy groceries", completed: false },
    { id: "2", content: "Walk the dog", completed: true },
    { id: "3", content: "Read a chapter", completed: false },
  ]);

  const addTodo = (content: string) => {
    const newTodo = {
      id: crypto.randomUUID(),
      content,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const deleteTodoById = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TodosContext.Provider value={{ todos, addTodo, deleteTodoById }}>
      {children}
    </TodosContext.Provider>
  );
}

// custom hook
// just like a function
// reuse hooks logics
export function useTodos() {
  const todosContext = useContext(TodosContext);

  if (!todosContext) {
    throw new Error("Cannot use context outside of a provider");
  }

  return todosContext;
}
