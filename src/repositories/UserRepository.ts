import type {Mongoose, Model} from "mongoose";

import MongooseClient from "#integrations/MongoDb/MongooseClient";
import type {ListUserProps, UserProps} from "#types/DataModels";
import {UserSchema} from "#dbSchemas/User";

// TODO think about making repos single-tone
class UserRepository {
    private mongoose: Mongoose | undefined;
    private model: Model | undefined;

    public async getInstance(): Promise<UserRepository> {
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

    public async listAllUsers() {
        if (!this.mongoose || !this.model) {
            throw new Error("Mongoose not initialized");
        }

        const data: Promise<ListUserProps[]> = await this.model.find({}, ['_id', 'firstName', 'lastName', 'email']).exec();

        return data;
    }

    public async findUserById(id: string)
    {
        if (!this.mongoose || !this.model) {
            throw new Error("Mongoose not initialized");
        }

        const data: Promise<ListUserProps | null> = await this.model.findById(id, ['firstName', 'lastName', 'email']).exec();

        return data;
    }

    public async findUserByEmail(email: string)
    {
        if (!this.mongoose || !this.model) {
            throw new Error("Mongoose not initialized");
        }

        const data: Promise<ListUserProps | null> = await this.model.findOne({email}, ['_id', 'firstName', 'lastName']).exec();

        return data;
    }
}

export default UserRepository;