import type { UserProps } from "#types/DataModels";
import MongoClient from "#database/MongoClient";
import type {Collection} from "mongodb";

class UserRepository {
    private readonly collectionName = "users";
    private collection: Collection<UserProps> | null = null;

    public async getInstance(): Promise<this> {
        await MongoClient.getInstance();
        this.collection = MongoClient.getCollection<UserProps>(this.collectionName);

        return this;
    }

    public async createUser(user: UserProps) {
        if (!this.collection) {
            throw new Error("Collection not initialized");
        }

        await this.collection.insertOne(user);
    }

    public async findUser(email: string): Promise<UserProps | null> {
        if (!this.collection) {
            throw new Error("Collection not initialized");
        }

        return await this.collection.findOne({email});
    }
}

export default UserRepository;