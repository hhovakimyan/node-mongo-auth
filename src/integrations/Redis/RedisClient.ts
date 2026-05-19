import { createClient, type RedisClientType } from 'redis';

// TODO check for connection loosing
class RedisClient {
    private static client: RedisClientType | null = null;

    public static async init() {
        if (!RedisClient.client) {
            try {
                RedisClient.client = await createClient();
                await RedisClient.connect();
            } catch (e) {
                throw new Error('Connecting to Redis failed');
            }
        }
    }

    public static async connect() {
        try {
            await RedisClient.client?.connect();
        } catch (e) {
            throw new Error('Connecting to Redis failed');
        }
    }

    public static getClient() {
        return RedisClient.client;
    }
}

export default RedisClient;
