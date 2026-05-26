import { Schema } from 'mongoose';

import { UserSchema, type UserSchemaProps } from '#dbSchemas/User';
import MongooseClient from '#integrations/MongoDb/MongooseClient';
import UserRepository from '#repositories/UserRepository';

async function createUserRepositoryFactory() {
    const mongoose = await MongooseClient.getInstance();
    const userModel = mongoose.model<UserSchemaProps>('User', new Schema(UserSchema));

    return new UserRepository(userModel);
}

export default createUserRepositoryFactory;
