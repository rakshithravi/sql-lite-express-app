import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    console.log('Registering user:', username, password);
    //encrypt the password
    const hashedPassword = await bcrypt.hashSync(password, 10);
    console.log('Hashed password:', hashedPassword);
    try {
        const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const result = insertUser.run(username, hashedPassword);

        // add default todo for the user
        const defaultTodo = 'Welcome to your Todo App!';
        const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
        insertTodo.run(result.lastInsertRowid, defaultTodo);
        console.log('User registered successfully:', result);

        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.json({ token })
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(503);

    }
    // res.sendStatus(201);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log('Logging in user:', username, password);
    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = getUser.get(username);
        console.log('User found:', user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Is password valid:', isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // we have a valid user and password
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.json({ token })
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(503).json({ message: 'Service unavailable' });
    }
});

export default router;