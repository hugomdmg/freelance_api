import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class DataBase {
    constructor() {
        this.dataBase = process.env.DB_NAME;
        this.uri = process.env.DB_URL;

        if (!this.dataBase || !this.uri) {
            throw new Error("Environment variables DB_NAME and DB_URL are required.");
        }

        this.client = new MongoClient(this.uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
    }

    async connect() {
        if (!this.client.topology || !this.client.topology.isConnected()) {
            await this.client.connect();
        }
    }

    async disconnect() {
        if (this.client.topology && this.client.topology.isConnected()) {
            await this.client.close();
        }
    }

    async getAllItems(collectionName) {
        await this.connect();
        const database = this.client.db(this.dataBase);
        const collection = database.collection(collectionName);
        const items = await collection.find().toArray();
        await this.disconnect();
        return items;
    }

    async getFilteredItems(collectionName, filter) {
        await this.connect();
        const database = this.client.db(this.dataBase);
        const collection = database.collection(collectionName);
        const items = await collection.find(filter).toArray();
        await this.disconnect();
        return items;
    }

    async addItem(collectionName, item) {
        await this.connect();
        const database = this.client.db(this.dataBase);
        const collection = database.collection(collectionName);
        const result = await collection.insertOne(item);
        await this.disconnect();
        return result;
    }

    async deleteItem(collectionName, filter) {
        await this.connect();
        const database = this.client.db(this.dataBase);
        const collection = database.collection(collectionName);
        const result = await collection.deleteOne(filter);
        await this.disconnect();
        return result;
    }

    async updateItem(collectionName, filter, update) {
        await this.connect();
        const database = this.client.db(this.dataBase);
        const collection = database.collection(collectionName);
        const result = await collection.updateOne(filter, { $set: update });
        await this.disconnect();
        return result;
    }
}

export default DataBase;