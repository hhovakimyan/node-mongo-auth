import { Types } from 'mongoose';

export type UserSchemaProps = {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export const UserSchema = {
    _id: {
        type: Types.ObjectId,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
    },
    password: String,
};
