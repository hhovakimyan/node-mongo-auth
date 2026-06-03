import type { Request, Response } from 'express';

import { UserRepository } from '#repositories/UserRepository';
import { AuthenticationService } from '#services/AuthenticationService';
import type { LoginUserParams, RegisterUserParams } from '#types/Controllers';

export class AuthenticationController {
    private authenticationService: AuthenticationService;
    private userRepository: UserRepository;

    public constructor(
        authenticationService: AuthenticationService,
        userRepository: UserRepository,
    ) {
        this.authenticationService = authenticationService;
        this.userRepository = userRepository;
    }

    public async registerUser(req: Request<{}, {}, RegisterUserParams>, res: Response) {
        const { email, password: plainTextPassword, firstName, lastName } = req.body;

        const userWithSameEmail = await this.userRepository.findUserByEmail(email);
        if (userWithSameEmail) {
            res.status(400).json({ errors: ['User with same email is already registered'] });

            return;
        }

        const hashedPassword = await this.authenticationService.hashPassword(plainTextPassword);

        const response = await this.userRepository.createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        const authToken = this.authenticationService.createAccessToken(response);

        res.status(201).json({ token: authToken });
    }

    public async login(req: Request<{}, {}, LoginUserParams>, res: Response) {
        const { email, password: plainTextPassword } = req.body;

        const targetUser = await this.userRepository.findUserByEmail(email);
        if (!targetUser) {
            res.status(401).json({ message: 'Invalid login creds' });

            return;
        }

        const isPasswordCorrect = await this.authenticationService.verifyPassword(
            plainTextPassword,
            targetUser.password,
        );
        if (!isPasswordCorrect) {
            res.status(401).json({ message: 'Invalid login creds' });

            return;
        }

        const authToken = this.authenticationService.createAccessToken(
            targetUser._id.toHexString(),
        );

        res.status(200).json({ token: authToken });
    }

    public async logout(req: Request<{}, {}, LoginUserParams>, res: Response) {
        this.authenticationService.invalidateToken(req.authToken);

        res.status(204).send();
    }
}
