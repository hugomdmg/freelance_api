import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../services/data_base.js';

const router = Router()

router.post('/get-messages', async (req, res) => {
    const data = req.body;

    try {
        const user = await db.getFilteredItems('users', { email: data.user1 });

        if (user.length === 0) {
            return res.status(404).send({ status: 'User not found', data: [] });
        }

        for (const chat of user[0].chats) {
            if (chat.user === data.user2) {
                return res.send({ status: 200, data: chat });
            }
        }

        return res.send({ status: 'Chat not found', data: { owner: '', messages: [] } });

    } catch (error) {
        console.error('Error in /get-messages:', error);
        res.status(500).send({ status: 'Internal server error', data: [] });
    }
});


router.post('/send-message', async (req, res) => {
    const data = req.body;

    try {
        const [user1] = await db.getFilteredItems('users', { email: data.emailUser1 });
        const [user2] = await db.getFilteredItems('users', { email: data.emailUser2 });

        if (!user1 || !user2) {
            return res.status(404).send({ status: 'Users not found', data: [] });
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

        res.status(200).send({ status: 'Message sent successfully', data: [] });

    } catch (error) {
        console.error('Error while sending message:', error);
        res.status(500).send({ status: 'Internal server error', data: [] });
    }
});


export default router