import { makeClassInvoker } from 'awilix-express';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';

import UserController from '#controllers/UserController';
import { validate } from '#middleware/validation';
import { updateUserSchema } from '#validation/UpdateUserSchema';

const router = express.Router();

router
    .route('/me')
    .get(makeClassInvoker(UserController)('getProfile'))
    .patch(validate(updateUserSchema), makeClassInvoker(UserController)('updateProfile'))
    .delete(makeClassInvoker(UserController)('deleteProfile'));

const upload = multer({
    limits: {
        fileSize: 2000000, // 2 MB
    },
    fileFilter: (_req, file, cb) => {
        if (!file.originalname.endsWith('.jpg') && !file.originalname.endsWith('.png')) {
            return cb(new Error('Please upload a JPG or PNG image'));
        }

        return cb(null, true);
    },
});

router.post(
    '/me/avatar',
    upload.single('avatar'),
    makeClassInvoker(UserController)('uploadAvatar'),
    (error: { message: string }, _req: Request, res: Response, _next: NextFunction) => {
        res.status(400).send({ message: error.message });
    },
);

router.delete('/me/avatar', makeClassInvoker(UserController)('deleteAvatar'));

export default router;
