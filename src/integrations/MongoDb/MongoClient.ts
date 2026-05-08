import { MongoClient as Mongo, Db as MongoDb, Collection } from "mongodb";
import type { Document } from "mongodb";

class MongoClient {
    private static client: Mongo | null;
    private static db: MongoDb | null;

    public static async getInstance(): Promise<Mongo> {
        if (!MongoClient.client) {
            MongoClient.client = new Mongo(process.env.MONGO_CONNECTION_STRING);
            await MongoClient.client.connect();
            MongoClient.db = MongoClient.client.db(process.env.MONGO_DB_NAME);
        }

        return MongoClient.client;
    }

    public static getCollection<T extends Document>(collectionName: string): Collection<T> {
        if (!MongoClient.db) {
            throw new Error("MongoClient not initialized");
        }

        return MongoClient.db.collection(collectionName);
    }
}

export default MongoClient;
