import mongoose, { Mongoose } from 'mongoose';

class MongooseClient {
    private static mongoose: Mongoose | null;

    public static async getInstance(): Promise<Mongoose> {
        if (MongooseClient.mongoose) {
            return MongooseClient.mongoose;
        }

        MongooseClient.mongoose = await mongoose.connect(
            `${process.env.MONGO_CONNECTION_STRING}/${process.env.MONGO_DB_NAME}`,
        );
        if (!MongooseClient.mongoose) {
            throw new Error('Connection failed');
        }

        return MongooseClient.mongoose;
    }
}

export default MongooseClient;
