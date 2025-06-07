import express from 'express';
import db from '../db.js';  

const router = express.Router();

router.get('/', (req, res) => {
    const getTodos = db.prepare('select * from todos WHERE user_id = ?');
    const todos = getTodos.all(req.userId);
    res.json(todos);
});

router.post('/', (req, res) => {
    const { task } = req.body;
    console.log('Adding todo:', task);
    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
    const result = insertTodo.run(req.userId, task);
    res.status(201).json({ id: result.lastInsertRowid, task, completed: 0 });
});

router.put('/:id', (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;

    console.log('Updating todo:', id, completed);
    if (!id) {
        return res.status(400).json({ message: 'Task or completed status is required' });
    }

    const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    const result = updateTodo.run(completed, id);

    if (result.changes === 0) {
        return res.status(404).json({ message: 'Todo not found or not owned by user' });
    }

    res.json({ message: 'Todo updated successfully', id, completed});
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    console.log('Deleting todo:', id);
    if (!id) {
        return res.status(400).json({ message: 'Todo ID is required' });
    }

    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    const result = deleteTodo.run(id, req.userId);

    if (result.changes === 0) {
        return res.status(404).json({ message: 'Todo not found or not owned by user' });
    }

    res.json({ message: 'Todo deleted successfully' });
});

router.get('/:id', (req, res) => {});

export default router;