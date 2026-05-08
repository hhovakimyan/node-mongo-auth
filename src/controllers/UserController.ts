import type {Request, Response} from 'express';
import type { RegisterUserParams } from '#types/Controllers';
import UserRepository from "#repositories/UserRepository";
import UserMongooseRepository from "#repositories/UserMongooseRepository";

class UserController {
    public static async registerUser(req: Request<any, any, RegisterUserParams>, res: Response) {
        const { email, password, firstName, lastName } = req.body;

        const repo = new UserRepository();
        const collection = await repo.getInstance();
        const userWithSameEmail = await collection.findUser(email);
        if (userWithSameEmail) {
            res.status(400).json({errors: ["User with same email is already registered"]});

            return;
        }

        const mongooseRepo = new UserMongooseRepository();
        const instance = await mongooseRepo.getInstance();
        const response = await instance.createUser({email, password, firstName, lastName});

        res.status(201).json({userId: response});
    }
}

export default UserController;