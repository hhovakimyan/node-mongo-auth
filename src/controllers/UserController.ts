import type {Request, Response} from 'express';
import type {UpdateUserParams} from '#types/Controllers';
import UserRepository from "#repositories/UserRepository";

class UserController {
    public static async listAllUsers(req: Request, res: Response)
    {
        const mongooseRepo = new UserRepository();
        const instance = await mongooseRepo.getInstance();
        const response = await instance.listAllUsers();

        res.status(200).json({data: response});
    }

    public static async getUserData(req: Request<{id: string}>, res: Response)
    {
        const mongooseRepo = new UserRepository();
        const instance = await mongooseRepo.getInstance();

        const userId = req.params.id;
        const response = await instance.findUserById(userId);
        if (!response) {
            res.status(404).json({message: "User not found"});

            return;
        }

        res.status(200).json({data: response});
    }

    public static async updateUserData(req: Request<{id: string}, {}, UpdateUserParams>, res: Response)
    {
        const mongooseRepo = new UserRepository();
        const instance = await mongooseRepo.getInstance();

        const userId = req.params.id;
        try {
            const response = await instance.updateUser(userId, req.body);
            if (!response) {
                res.status(404).json({message: "User not found"});
                return;
            }

            res.status(200).json({data: response});
        } catch (error) {
            res.status(500).json({message: "Updating user failed"});
        }
    }
}

export default UserController;