import type {Request, Response} from "express";
import UserRepository from "#repositories/UserRepository";

class AuthenticationController {
    public static async registerUser(req: Request<any, any, RegisterUserParams>, res: Response) {
        const { email, password, firstName, lastName } = req.body;

        const mongooseRepo = new UserRepository();
        const instance = await mongooseRepo.getInstance();
        const userWithSameEmail = await instance.findUserByEmail(email);
        if (userWithSameEmail) {
            res.status(400).json({errors: ["User with same email is already registered"]});

            return;
        }

        const response = await instance.createUser({email, password, firstName, lastName});

        res.status(201).json({userId: response});
    }
}

export default AuthenticationController;