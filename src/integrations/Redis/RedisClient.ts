import { createClient, type RedisClientType } from 'redis';

export class RedisClient {
    private static client: RedisClientType | null = null;

    public static async init() {
        if (!RedisClient.client) {
            try {
                RedisClient.client = await createClient();
                await RedisClient.connect();
            } catch (_e) {
                throw new Error('Connecting to Redis failed');
            }
        }
    }

    public static async connect() {
        try {
            await RedisClient.client?.connect();
        } catch (_e) {
            throw new Error('Connecting to Redis failed');
        }
    }

    public static getClient() {
        return RedisClient.client;
    }
}
