import { Router } from 'express';
import bcrypt from 'bcrypt';
import DataBase from '../services/data_base.js';

const router = Router();
const db = new DataBase();




router.get('/users', async (req, res) => {
    try {
        const users = await db.getAllItems('users');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal server error');
    }
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const registered = await db.getFilteredItems('users', { username });

        if (registered.length === 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.addItem('users', { username, password: hashedPassword, projects: [], chats: [] });
            res.status(201).send('User registered successfully');
        } else {
            res.status(400).send('Username already registered');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const registered = await db.getFilteredItems('users', { username });

        if (registered.length === 1) {
            const match = await bcrypt.compare(password, registered[0].password);
            if (match) {
                res.send({ status: 200, value: 'Login successful' });
            } else {
                res.send({ status: 400, value: 'Invalid username or password' });
            }
        } else {
            res.send({ status: 401, value: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.send({ status: 500, value: 'Internal server error' });
    }
});

export default router;