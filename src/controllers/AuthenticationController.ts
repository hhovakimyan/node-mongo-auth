import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserRepository from '#repositories/UserRepository';
import type { LoginUserParams, RegisterUserParams } from '#types/Controllers';

class AuthenticationController {
    public static async registerUser(req: Request<{}, {}, RegisterUserParams>, res: Response) {
        const { email, password, firstName, lastName } = req.body;

        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();
        const userWithSameEmail = await instance.findUserByEmail(email);
        if (userWithSameEmail) {
            res.status(400).json({ errors: ['User with same email is already registered'] });

            return;
        }

        // TODO move this somewhere like service
        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await instance.createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        res.status(201).json({ userId: response });
    }

    public static async login(req: Request<{}, {}, LoginUserParams>, res: Response) {
        const { email, password } = req.body;

        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();
        const targetUser = await instance.findUserByEmail(email);
        if (!targetUser) {
            res.status(401).json({ message: 'Invalid login creds' });

            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, targetUser.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Invalid login creds' });

            return;
        }

        res.status(200).json({});
    }
}

export default AuthenticationController;
