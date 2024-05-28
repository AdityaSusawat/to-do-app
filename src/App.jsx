import { useEffect, useRef, useState } from "react";

export default function ToDo() {
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("ToDoItems");
    if (localValue == null) return [];
    return JSON.parse(localValue);
  });
  const newTaskRef = useRef();

  useEffect(() => {
    localStorage.setItem("ToDoItems", JSON.stringify(todos));
  }, [todos]);

  const addToDo = (title) => {
    setTodos((prev) => {
      return [...prev, { id: crypto.randomUUID(), title, completed: false }];
    });
    newTaskRef.current.focus();
  };

  const deleteToDo = (id) => {
    setTodos((prev) => {
      return prev.filter((todo) => todo.id !== id);
    });
  };

  const deleteAllCompleted = () => {
    setTodos((prev) => {
      return prev.filter((todo) => todo.completed === false);
    });
  };

  const toggleToDo = (id, completed) => {
    setTodos((prev) => {
      return prev.map((e) => {
        if (e.id === id) {
          return { ...e, completed };
        }
        return e;
      });
    });
  };

  return (
    <>
      <ToDoForm
        onSubmit={addToDo}
        newTaskRef={newTaskRef}
        deleteAllCompleted={deleteAllCompleted}
      />
      <h1 className="header">Here are your tasks</h1>
      {todos.length == 0 ? (
        <h3 className="header">No tasks available</h3>
      ) : (
        <ToDoList
          deleteToDo={deleteToDo}
          toggleToDo={toggleToDo}
          todos={todos}
        />
      )}
    </>
  );
}

function ToDoForm({ onSubmit, newTaskRef, deleteAllCompleted }) {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <div className="form-row">
        <label htmlFor="item">NEW TASK</label>
        <input
          type="text"
          id="item"
          value={task}
          ref={newTaskRef}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>
      <button
        className="btn"
        type="submit"
        disabled={task.length === 0 ? true : false}
      >
        ADD TASK
      </button>
      <button className="btn" type="button" onClick={deleteAllCompleted}>
        DELETE ALL COMPLETED
      </button>
    </form>
  );
}

function ToDoItem({ id, title, completed, toggleTodo, deleteToDo }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(event) => toggleTodo(id, event.target.checked)}
        />
        {title}
      </label>
      <button className="btn btn-danger" onClick={() => deleteToDo(id)}>
        Delete
      </button>
    </li>
  );
}

function ToDoList({ todos, deleteToDo, toggleToDo }) {
  return (
    <ul className="list">
      {todos.map((e) => (
        <ToDoItem
          key={e.id}
          {...e}
          toggleTodo={toggleToDo}
          deleteToDo={deleteToDo}
        />
      ))}
    </ul>
  );
}
