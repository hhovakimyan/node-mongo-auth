import type { Request, Response } from 'express';

import UserRepository from '#repositories/UserRepository';
import type { UpdateUserParams } from '#types/Controllers';

class UserController {
    public static async getProfile(req: Request, res: Response) {
        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();
        const response = await instance.findUserById(req.authUserId);

        res.status(200).json({ data: response });
    }

    public static async updateProfile(req: Request<{}, {}, UpdateUserParams>, res: Response) {
        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();

        try {
            const response = await instance.updateUser(req.authUserId, req.body);
            if (!response) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ data: response });
        } catch (_error) {
            res.status(500).json({ message: 'Updating user failed' });
        }
    }

    public static async deleteProfile(req: Request, res: Response) {
        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();

        try {
            const response = await instance.deleteUser(req.authUserId);
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
