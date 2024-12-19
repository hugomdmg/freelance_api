import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../services/data_base.js';

const router = Router()

router.post('/get-messages', async (req, res) => {
    const data = req.body;

    try {
        const user = await db.getFilteredItems('users', { email: data.user1 });

        if (user.length === 0) {
            return res.status(404).send({ status: 404, data: 'User not found' });
        }

        for (const chat of user[0].chats) {
            if (chat.user === data.user2) {
                return res.send({ status: 200, data: chat });
            }
        }

        return res.send({ status: 404, data: 'Chat not found' });

    } catch (error) {
        console.error('Error in /get-messages:', error);
        res.status(500).send({ status: 500, data: 'Internal server error' });
    }
});


router.post('/send-message', async (req, res) => {
    const data = req.body;

    try {
        const [user1] = await db.getFilteredItems('users', { email: data.emailUser1 });
        const [user2] = await db.getFilteredItems('users', { email: data.emailUser2 });

        if (!user1 || !user2) {
            return res.status(404).send({ status: 404, value: 'Users not found' });
        }

        let chatUpdated1 = false;
        let index1 = 0
        user1.chats.forEach((chat, i) => {
            if (chat.user === data.emailUser2) {
                user1.chats[i].messages.push({ owner: data.emailUser1, message: data.message });
                index1 = i
                chatUpdated1 = true;
            }
        });
        if (!chatUpdated1) {
            user1.chats[index1].messages.push({
                user: data.emailUser2,
                messages: [data.message],
            });
        }

        let chatUpdated2 = false;
        let index2 = 0
        user2.chats.forEach((chat, i) => {
            if (chat.user === data.emailUser1) {
                user2.chats[i].messages.push({ owner: data.emailUser1, message: data.message })
                index2 = i
                chatUpdated2 = true;
            }
        });
        if (!chatUpdated2) {
            user2.chats[index2].messages.push({
                user: data.emailUser1,
                messages: [data.message],
            });
        }

        await db.updateItem('users', { email: data.emailUser1 }, user1);
        await db.updateItem('users', { email: data.emailUser2 }, user2);

        res.status(200).send({ status: 200, value: 'Message sent successfully' });

    } catch (error) {
        console.error('Error while sending message:', error);
        res.status(500).send({ status: 500, value: 'Internal server error' });
    }
});


export default router