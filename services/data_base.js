import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

class Data_base {
    constructor() {
        this.dataBase = process.env.DB_NAME;
        this.uri = process.env.DB_URL
        this.client = new MongoClient(this.uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
    }

    async connect() {
        try {
            if (!this.client.isConnected?.()) {
                await this.client.connect();
            }
        } catch (error) {
            console.error("Error when connecting to MongoDB:", error);
            throw new Error("Failed to connect to MongoDB");
        }
    }

    async disconnect() {
        try {
            if (this.client.isConnected?.()) {
                await this.client.close();
            }
        } catch (error) {
            console.error("Error when disconnecting from MongoDB:", error);
        }
    }

    async getAllItems(collectionName) {
        try {
            await this.connect();
            const database = this.client.db(this.dataBase);
            const collection = database.collection(collectionName);
            return await collection.find().toArray();
        } catch (error) {
            console.error("Error when fetching items from MongoDB:", error);
            throw new Error("Failed to fetch items from MongoDB");
        } finally {
            await this.disconnect();
        }
    }

    async addItem(collectionName, item) {
        try {
            await this.connect();
            const database = this.client.db(this.dataBase);
            const collection = database.collection(collectionName);
            return await collection.insertOne(item);
        } catch (error) {
            console.error("Error when adding an item to MongoDB:", error);
            throw new Error("Failed to add an item to MongoDB");
        } finally {
            await this.disconnect();
        }
    }

    async deleteItem(collectionName, filter) {
        try {
            await this.connect();
            const database = this.client.db(this.dataBase);
            const collection = database.collection(collectionName);
            return await collection.deleteOne(filter);
        } catch (error) {
            console.error("Error when deleting an item from MongoDB:", error);
            throw new Error("Failed to delete an item from MongoDB");
        } finally {
            await this.disconnect();
        }
    }

    async updateItem(collectionName, filter, update) {
        try {
            await this.connect();
            const database = this.client.db(this.dataBase);
            const collection = database.collection(collectionName);
            return await collection.updateOne(filter, { $set: update });
        } catch (error) {
            console.error("Error when updating an item in MongoDB:", error);
            throw new Error("Failed to update an item in MongoDB");
        } finally {
            await this.disconnect();
        }
    }
}

export default Data_base;


