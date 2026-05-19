import { Schema } from 'mongoose';
import type { Model } from 'mongoose';

import { UserSchema, type UserSchemaProps } from '#dbSchemas/User';
import MongooseClient from '#integrations/MongoDb/MongooseClient';
import type { UpdateUserParams } from '#types/Controllers';
import type { CreateUserProps } from '#types/DataModels';

// TODO think about making repos single-tone
// TODO think about dependency injection in Node.js
class UserRepository {
    private static model: Model<UserSchemaProps> | undefined;

    private publicFields: string[] = ['firstName', 'lastName', 'email'];

    public async getInstance(): Promise<UserRepository> {
        if (!UserRepository.model) {
            const mongoose = await MongooseClient.getInstance();
            UserRepository.model = mongoose.model<UserSchemaProps>('User', new Schema(UserSchema));
        }

        return this;
    }

    public async createUser(user: CreateUserProps): Promise<string> {
        if (!UserRepository.model) {
            throw new Error('Mongoose not initialized');
        }

        const newUser = new UserRepository.model(user);
        const createdUser = await newUser.save();

        return createdUser._id.toHexString();
    }

    public async listAllUsers() {
        if (!UserRepository.model) {
            throw new Error('Mongoose not initialized');
        }

        return UserRepository.model.find({}, this.publicFields).exec();
    }

    public async findUserById(id: string) {
        if (!UserRepository.model) {
            throw new Error('Mongoose not initialized');
        }

        return UserRepository.model.findById(id, this.publicFields).exec();
    }

    public async findUserByEmail(email: string): Promise<UserSchemaProps | null> {
        if (!UserRepository.model) {
            throw new Error('Mongoose not initialized');
        }

        return UserRepository.model.findOne({ email }).exec();
    }

    public async updateUser(id: string, updateData: UpdateUserParams) {
        if (!UserRepository.model) {
            throw new Error('Mongoose not initialized');
        }

        return UserRepository.model.findByIdAndUpdate(id, updateData, {
            returnDocument: 'after',
            select: this.publicFields.join(' '),
        });
    }

    public async deleteUser(id: string) {
        if (!UserRepository.model) {
            throw new Error('Mongoose not initialized');
        }

        return UserRepository.model.findByIdAndDelete(id, { select: this.publicFields });
    }
}

export default UserRepository;
