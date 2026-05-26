import type { Request, Response } from 'express';

import UserRepository from '#repositories/UserRepository';
import AuthenticationService from '#services/AuthenticationService';
import type { LoginUserParams, RegisterUserParams } from '#types/Controllers';

// TODO pass dependencies to AuthenticationController via dependency injection
class AuthenticationController {
    public static async registerUser(req: Request<{}, {}, RegisterUserParams>, res: Response) {
        const { email, password: plainTextPassword, firstName, lastName } = req.body;

        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();
        const userWithSameEmail = await instance.findUserByEmail(email);
        if (userWithSameEmail) {
            res.status(400).json({ errors: ['User with same email is already registered'] });

            return;
        }

        const hashedPassword = await AuthenticationService.hashPassword(plainTextPassword);

        const response = await instance.createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        const authToken = AuthenticationService.createAccessToken(response);

        res.status(201).json({ token: authToken });
    }

    public static async login(req: Request<{}, {}, LoginUserParams>, res: Response) {
        const { email, password: plainTextPassword } = req.body;

        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();
        const targetUser = await instance.findUserByEmail(email);
        if (!targetUser) {
            res.status(401).json({ message: 'Invalid login creds' });

            return;
        }

        const isPasswordCorrect = await AuthenticationService.verifyPassword(
            plainTextPassword,
            targetUser.password,
        );
        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Invalid login creds' });

            return;
        }

        const authToken = AuthenticationService.createAccessToken(targetUser._id.toHexString());

        res.status(200).json({ token: authToken });
    }

    public static async logout(req: Request<{}, {}, LoginUserParams>, res: Response) {
        AuthenticationService.invalidateToken(req.authToken);

        res.status(204).send();
    }
}

export default AuthenticationController;
