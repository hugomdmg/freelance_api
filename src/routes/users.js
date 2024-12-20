import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../services/data_base.js';

const router = Router();

router.get('/users', async (req, res) => {
    try {
        const users = await db.getAllItems('users');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.send({ status: 500, message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({ status: 400, message: 'Email and password are required' });
    }

    try {
        const existingUsers = await db.getFilteredItems('users', { email });

        if (existingUsers.length === 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                email,
                password: hashedPassword,
                roll: 'costumer',
                projects: [],
                chats: []
            };
            await db.addItem('users', newUser);
            res.send({ status: 201, message: 'User registered successfully' });
        } else {
            res.send({ status: 400, message: 'Email already registered' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.send({ status: 500, message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({ status: 400, message: 'Email and password are required' });
    }

    try {
        const [user] = await db.getFilteredItems('users', { email });

        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.send({ status: 200, message: 'Login successful', data: user });
            } else {
                res.send({ status: 400, message: 'Invalid email or password' });
            }
        } else {
            res.send({ status: 400, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.send({ status: 500, message: 'Internal server error' });
    }
});

router.post('/update-account', async (req, res) => {
    const { prevEmail, email, password } = req.body;

    if (!prevEmail || !email || !password) {
        return res.send({ status: 400, message: 'All fields are required' });
    }

    try {
        const [user] = await db.getFilteredItems('users', { email: prevEmail });

        if (!user) {
            return res.send({ status: 404, message: 'User not found' });
        }

        user.email = email;
        user.password = await bcrypt.hash(password, 10);

        await db.updateItem('users', { email: prevEmail }, user);

        res.send({ status: 200, message: 'Account updated successfully', data: user });
    } catch (error) {
        console.error('Error updating account:', error);
        res.send({ status: 500, message: 'Internal server error' });
    }
});

router.post('/delete-account', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({ status: 400, message: 'Email and password are required' });
    }

    try {
        const [user] = await db.getFilteredItems('users', { email });

        if (!user) {
            return res.send({ status: 404, message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            await db.deleteItem('users', { email });
            res.send({ status: 200, message: 'Account deleted successfully' });
        } else {
            res.send({ status: 400, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        res.send({ status: 500, message: 'Internal server error' });
    }
});

export default router;
