import db from '../services/data_base.js';

const seedData = async () => {
    const data = [
        {
            username: 'usuario 1',
            password: 'password 1',
            projects: [],
            chats: [
                { owner: 'usuario 1', message: 'hola' },
                { owner: 'usuario 2', message: 'dime' }]
        },
        {
            username: 'usuario 2',
            password: 'password 2',
            projects: [],
            chats: [
                { owner: 'usuario 1', message: 'hola' },
                { owner: 'usuario 2', message: 'dime' }]
        },
        {
            username: 'usuario 3',
            password: 'password 3',
            projects: [],
            chats: [
                { owner: 'usuario 3', message: 'hola' },
                { owner: 'usuario 2', message: 'dime' }]
        }
    ];

    try {
        await db.connect();

        for (const user of data) {
            const existing = await db.getFilteredItems('users', { username: user.username });
            if (existing.length === 0) {
                await db.addItem('users', user);
            }
        }
        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await db.disconnect();
    }
};

seedData();




