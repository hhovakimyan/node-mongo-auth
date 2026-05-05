import type {Request, Response} from 'express';
import type { RegisterUserParams } from '#types/Controllers';
import UserRepository from "#repositories/UserRepository";

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

        await collection.createUser({email, password, firstName, lastName});

        res.status(201).json({message: "Registered"})
    }
}

export default UserController;