import type { Request, Response } from 'express';

import UserRepository from '#repositories/UserRepository';
import type { UpdateUserParams } from '#types/Controllers';

class UserController {
    private userRepository: UserRepository;

    public constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async getProfile(req: Request, res: Response) {
        const response = await this.userRepository.findUserById(req.authUserId);

        res.status(200).json({ data: response });
    }

    public async updateProfile(req: Request<{}, {}, UpdateUserParams>, res: Response) {
        try {
            const response = await this.userRepository.updateUser(req.authUserId, req.body);
            if (!response) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ data: response });
        } catch (_error) {
            res.status(500).json({ message: 'Updating user failed' });
        }
    }

    public async deleteProfile(req: Request, res: Response) {
        try {
            const response = await this.userRepository.deleteUser(req.authUserId);
            if (!response) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(204).json({});
        } catch (_error) {
            res.status(500).json({ message: 'Deleting user failed' });
        }
    }
}

export default UserController;
