import type { Request, Response } from 'express';
import type { UpdateUserParams } from '#types/Controllers';
import UserRepository from '#repositories/UserRepository';

class UserController {
    public static async getProfile(req: Request, res: Response) {
        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();
        const response = await instance.findUserById(req.authUserId);

        res.status(200).json({ data: response });
    }

    public static async updateProfile(
        req: Request<{ id: string }, {}, UpdateUserParams>,
        res: Response,
    ) {
        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();

        try {
            const response = await instance.updateUser(req.authUserId, req.body);
            if (!response) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ data: response });
        } catch (error) {
            res.status(500).json({ message: 'Updating user failed' });
        }
    }

    public static async deleteProfile(req: Request<{ id: string }>, res: Response) {
        const userRepo = new UserRepository();
        const instance = await userRepo.getInstance();

        try {
            const response = await instance.deleteUser(req.authUserId);
            if (!response) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(204).json({});
        } catch (error) {
            res.status(500).json({ message: 'Deleting user failed' });
        }
    }
}

export default UserController;
