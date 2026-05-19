import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import RedisClient from '#integrations/Redis/RedisClient';
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

        const authToken = AuthenticationController.generateJwtToken(response);

        res.status(200).json({ token: authToken });
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

        const isPasswordCorrect = await bcrypt.compare(plainTextPassword, targetUser.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Invalid login creds' });

            return;
        }

        const authToken = AuthenticationController.generateJwtToken(targetUser._id);

        res.status(200).json({ token: authToken });
    }

    public static async logout(req: Request<{}, {}, LoginUserParams>, res: Response) {
        const authToken = req.authToken as string;

        // Store logged out auth token for 5 minutes
        RedisClient.getClient()?.set(authToken, '', { EX: 21600 });

        res.status(204).send();
    }

    private static generateJwtToken(userId: string) {
        return jwt.sign({ data: userId }, process.env.JWT_SECRET, {
            expiresIn: '6 hours',
        });
    }
}

export default AuthenticationController;
