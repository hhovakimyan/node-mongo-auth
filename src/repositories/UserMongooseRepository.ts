import type {Mongoose, Model} from "mongoose";

import MongooseClient from "#integrations/MongoDb/MongooseClient";
import type {UserProps} from "#types/DataModels";
import {UserSchema} from "#dbSchemas/User";

// TODO think about making repos single-tone
class UserMongooseRepository {
    private mongoose: Mongoose | undefined;
    private model: Model | undefined;

    public async getInstance(): Promise<UserMongooseRepository> {
        this.mongoose = await MongooseClient.getInstance();
        this.model = this.mongoose.model('User', UserSchema);

        return this;
    }

    public async createUser(user: UserProps): Promise<string> {
        if (!this.mongoose || !this.model) {
            throw new Error("Mongoose not initialized");
        }

        const newUser = new this.model(user);
        const createdUser = await newUser.save();

        return createdUser._id.toHexString();
    }
}

export default UserMongooseRepository;