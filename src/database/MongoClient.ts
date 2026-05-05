import { MongoClient as Mongo, Db as MongoDb, Collection } from "mongodb";
import type { Document } from "mongodb";

class MongoClient {
    private static readonly connectionUrl = "mongodb://localhost:27017";
    private static readonly dbName = "auth";
    private static client: Mongo | null;
    private static db: MongoDb | null;

    private constructor() {}

    public static async getInstance(): Promise<Mongo> {
        if (!MongoClient.client) {
            MongoClient.client = new Mongo(MongoClient.connectionUrl);
            await MongoClient.client.connect();
            MongoClient.db = MongoClient.client.db(this.dbName);
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