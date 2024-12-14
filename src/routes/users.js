import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../services/data_base.js';

const router = Router();

router.get('/users', async (req, res) => {
    try {
        res.status(200).json(await db.getAllItems('users'));
    } catch (error) {
        console.error('Error fetching users:', error);
        res.send({ status: 500, value: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const user = {
        email: '',
        password: '',
        roll: 'costumer',
        projects: [],
        chats: []
    }

    if (!email || !password) {
        return res.send({ status: 400, value: 'email and password are required' });
    }

    try {
        const registered = await db.getFilteredItems('users', { email });

        if (registered.length === 0) {
            user.password = await bcrypt.hash(password, 10);
            user.email = email
            await db.addItem('users', user);
            res.send({ status: 201, value: 'User registered successfully' });
        } else {
            res.send({ status: 400, value: 'email already registered' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.send({ status: 500, value: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('email and password are required');
    }

    try {
        const registered = await db.getFilteredItems('users', { email });

        if (registered.length === 1) {
            const match = await bcrypt.compare(password, registered[0].password);
            if (match) {
                res.send({ status: 200, value: 'Login successful', data: registered[0] });
            } else {
                res.send({ status: 400, value: 'Invalid email or password', data: {} });
            }
        } else {
            res.send({ status: 400, value: 'Invalid email or password', data: {} });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.send({ status: 500, value: 'Internal server error' });
    }
});

export default router;