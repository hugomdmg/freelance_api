import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const dataBase = process.env.DB_NAME;
const uri = process.env.DB_URL;

if (!dataBase || !uri) {
    throw new Error("Environment variables DB_NAME and DB_URL are required.");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});


class DataBase {
    constructor() {
    }

    async connect() {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
        }
    }

    async disconnect() {
        if (client.topology && client.topology.isConnected()) {
            await client.close();
        }
    }

    async getAllItems(collectionName) {
        await this.connect();
        const database = client.db(dataBase);
        const collection = database.collection(collectionName);
        const items = await collection.find().toArray();
        await this.disconnect();
        return items;
    }

    async getFilteredItems(collectionName, filter) {
        await this.connect();
        const database = client.db(dataBase);
        const collection = database.collection(collectionName);
        const items = await collection.find(filter).toArray();
        await this.disconnect();
        return items;
    }

    async addItem(collectionName, item) {
        await this.connect();
        const database = client.db(dataBase);
        const collection = database.collection(collectionName);
        const result = await collection.insertOne(item);
        await this.disconnect();
        return result;
    }

    async deleteItem(collectionName, filter) {
        await this.connect();
        const database = client.db(dataBase);
        const collection = database.collection(collectionName);
        const result = await collection.deleteOne(filter);
        await this.disconnect();
        return result;
    }

    async updateItem(collectionName, filter, update) {
        await this.connect();
        const database = client.db(dataBase);
        const collection = database.collection(collectionName);
        const result = await collection.updateOne(filter, { $set: update });
        await this.disconnect();
        return result;
    }
}

const db = new DataBase()

export default db;