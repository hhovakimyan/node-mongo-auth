import type {Model} from "mongoose";

import MongooseClient from "#integrations/MongoDb/MongooseClient";
import type {CreateUserProps, ListUserProps} from "#types/DataModels";
import {UserSchema} from "#dbSchemas/User";
import type {UpdateUserParams} from "#types/Controllers";

// TODO think about making repos single-tone
// TODO think about dependency injection in Node.js
class UserRepository {
    private static model: Model | undefined;

    public async getInstance(): Promise<UserRepository> {
        if (!UserRepository.model) {
            const mongoose = await MongooseClient.getInstance();
            UserRepository.model = mongoose.model('User', UserSchema);
        }

        return this;
    }

    public async createUser(user: CreateUserProps): Promise<string> {
        if (!UserRepository.model) {
            throw new Error("Mongoose not initialized");
        }

        const newUser = new UserRepository.model(user);
        const createdUser = await newUser.save();

        return createdUser._id.toHexString();
    }

    public async listAllUsers() {
        if (!UserRepository.model) {
            throw new Error("Mongoose not initialized");
        }

        const data: Promise<ListUserProps[]> = await UserRepository.model.find({}, ['_id', 'firstName', 'lastName', 'email']).exec();

        return data;
    }

    public async findUserById(id: string)
    {
        if (!UserRepository.model) {
            throw new Error("Mongoose not initialized");
        }

        const data: Promise<ListUserProps | null> = await UserRepository.model.findById(id, ['firstName', 'lastName', 'email']).exec();

        return data;
    }

    public async findUserByEmail(email: string)
    {
        if (!UserRepository.model) {
            throw new Error("Mongoose not initialized");
        }

        const data: Promise<ListUserProps | null> = await UserRepository.model.findOne({email}, ['_id', 'firstName', 'lastName']).exec();

        return data;
    }

    public async updateUser(id: string, updateData: UpdateUserParams)
    {
        if (!UserRepository.model) {
            throw new Error("Mongoose not initialized");
        }

        const updatedData: Promise<ListUserProps> = await UserRepository.model.findByIdAndUpdate(id, updateData, { returnDocument: 'after', select: "firstName lastName email" });

        return updatedData;
    }
}

export default UserRepository;