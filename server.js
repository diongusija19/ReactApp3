const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory task store used as a mock database.
let tasks = [
  { id: 1, title: 'Set up React project structure', completed: true },
  { id: 2, title: 'Build task CRUD API', completed: false },
  { id: 3, title: 'Connect frontend to API', completed: false },
];
let nextId = 4;

app.get('/api/tasks', (_req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const title = (req.body?.title || '').trim();
  if (!title) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const newTask = { id: nextId++, title, completed: false };
  tasks.unshift(newTask);
  return res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.completed = !task.completed;
  return res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskExists = tasks.some((item) => item.id === id);

  if (!taskExists) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  tasks = tasks.filter((item) => item.id !== id);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Task API running at http://127.0.0.1:${PORT}`);
});
