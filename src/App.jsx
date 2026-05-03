import { useEffect, useState } from 'react';
import './App.css';

const API_BASE = 'http://127.0.0.1:4000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load tasks once when the page mounts.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setError('');
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Failed to fetch tasks.');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Unexpected error.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    try {
      setError('');
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to add task.');
      const createdTask = await response.json();
      setTasks((prev) => [createdTask, ...prev]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      setError('');
      const response = await fetch(`${API_BASE}/${id}/complete`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to update task.');
      const updatedTask = await response.json();

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError('');
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task.');
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    }
  };

  return (
    <main className="app-shell">
      <section className="task-card">
        <h1>Task Manager</h1>
        <p className="subtitle">React + Express full-stack CRUD demo</p>

        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            placeholder="Add a new task"
            aria-label="Task title"
          />
          <button type="submit">Add</button>
        </form>

        {error && <p className="error-text">{error}</p>}

        {isLoading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id)}
                  />
                  <span className={task.completed ? 'done' : ''}>{task.title}</span>
                </label>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
