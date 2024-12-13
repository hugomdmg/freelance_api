import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../services/data_base.js';

const router = Router()


router.post('/send-chat', async (req, res) => {
    const data = req.body;

    try {
        const registered = await db.getFilteredItems('users', { username: data.username });
        registered[0].chats.push(data.message)

        // const hashedPassword = await bcrypt.hash(password, 10);
        await db.updateItem('users', { username: data.username }, registered[0])

        res.send('message sent')

    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

export default router