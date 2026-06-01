import type { Model } from 'mongoose';

import { type UserSchemaProps } from '#dbSchemas/User';
import type { UpdateUserParams } from '#types/Controllers';
import type { CreateUserProps } from '#types/DataModels';

// TODO think about making repos single-tone
class UserRepository {
    private model: Model<UserSchemaProps>;
    private publicFields: string[] = ['firstName', 'lastName', 'email'];

    public constructor(model: Model<UserSchemaProps>) {
        this.model = model;
    }

    public async createUser(user: CreateUserProps): Promise<string> {
        const newUser = new this.model(user);
        const createdUser = await newUser.save();

        return createdUser._id.toHexString();
    }

    public async listAllUsers() {
        return this.model.find({}, this.publicFields).exec();
    }

    public async findUserById(id: string) {
        return this.model.findById(id, this.publicFields).exec();
    }

    public async findUserByEmail(email: string): Promise<UserSchemaProps | null> {
        return this.model.findOne({ email }).exec();
    }

    public async updateUser(id: string, updateData: UpdateUserParams) {
        return this.model.findByIdAndUpdate(id, updateData, {
            returnDocument: 'after',
            select: this.publicFields.join(' '),
        });
    }

    public async deleteUser(id: string) {
        return this.model.findByIdAndDelete(id, { select: this.publicFields });
    }

    public async deleteAllUsers() {
        await this.model.deleteMany();
    }

    public async saveAvatar(id: string, avatar: Buffer) {
        return this.model.findByIdAndUpdate(
            id,
            { avatar },
            {
                returnDocument: 'after',
                select: this.publicFields.join(' '),
            },
        );
    }

    public async deleteAvatar(id: string) {
        const user = await this.findUserById(id);
        if (user) {
            user.avatar = undefined;
            await user.save();
        }
    }
}

export default UserRepository;
