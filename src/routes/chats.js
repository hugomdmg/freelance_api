import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../services/data_base.js';

const router = Router()

router.post('/get-messages', async (req, res) => {
    const data = req.body;

    try {
        const user = await db.getFilteredItems('users', { email: data.user1.email });

        if (user.length === 0) {
            return res.status(404).send({ status: 404, data: 'User not found' });
        }

        for (const chat of user[0].chats) {
            if (chat.user === data.user2.email) {
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
        // Buscar usuarios por email
        const user1 = await db.getFilteredItems('users', { email: data.user1.email });
        const user2 = await db.getFilteredItems('users', { email: data.user2.email });

        if (!user1.length || !user2.length) {
            return res.status(404).send({ status: 404, value: 'Users not found' });
        }

        // Referencias a los objetos principales
        const user1Data = user1[0];
        const user2Data = user2[0];

        // Actualizar chats para user1
        let chatUpdated1 = false;
        user1Data.chats.forEach((chat, index) => {
            if (chat.user === data.user2.email) {
                user1Data.chats[index].messages = data.messages;
                chatUpdated1 = true;
            }
        });
        if (!chatUpdated1) {
            user1Data.chats.push({
                user: data.user2.email,
                messages: data.messages,
            });
        }

        // Actualizar chats para user2
        let chatUpdated2 = false;
        user2Data.chats.forEach((chat, index) => {
            if (chat.user === data.user1.email) {
                user2Data.chats[index].messages = data.messages;
                chatUpdated2 = true;
            }
        });
        if (!chatUpdated2) {
            user2Data.chats.push({
                user: data.user1.email,
                messages: data.messages,
            });
        }

        // Guardar usuarios actualizados en la base de datos
        await db.updateItem('users', { email: data.user1.email }, user1Data);
        await db.updateItem('users', { email: data.user2.email }, user2Data);

        // Respuesta exitosa
        res.status(200).send({ status: 200, value: 'Message sent successfully' });

    } catch (error) {
        console.error('Error while sending message:', error);
        res.status(500).send({ status: 500, value: 'Internal server error' });
    }
});


export default router