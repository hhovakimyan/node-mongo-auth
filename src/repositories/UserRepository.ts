import type {Mongoose, Model} from "mongoose";

import MongooseClient from "#integrations/MongoDb/MongooseClient";
import type {CreateUserProps, ListUserProps} from "#types/DataModels";
import {UserSchema} from "#dbSchemas/User";
import type {UpdateUserParams} from "#types/Controllers";

// TODO think about making repos single-tone
class UserRepository {
    private mongoose: Mongoose | undefined;
    private model: Model | undefined;

    public async getInstance(): Promise<UserRepository> {
        this.mongoose = await MongooseClient.getInstance();
        this.model = this.mongoose.model('User', UserSchema);

        return this;
    }

    public async createUser(user: CreateUserProps): Promise<string> {
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

    public async updateUser(id: string, updateData: UpdateUserParams)
    {
        if (!this.mongoose || !this.model) {
            throw new Error("Mongoose not initialized");
        }

        const updatedData: Promise<ListUserProps> = await this.model.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });

        return updatedData;
    }
}

export default UserRepository;