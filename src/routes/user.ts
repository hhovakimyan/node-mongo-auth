import { makeClassInvoker } from 'awilix-express';
import express from 'express';
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
        const { originalname } = file;
        const extension = originalname.split('.').pop() as string;

        if (!['jpg', 'png', 'jpeg'].includes(extension)) {
            return cb(new Error('invalid_file_format'));
        }

        return cb(null, true);
    },
});

router.post(
    '/me/avatar',
    upload.single('avatar'),
    makeClassInvoker(UserController)('uploadAvatar'),
);

router.delete('/me/avatar', makeClassInvoker(UserController)('deleteAvatar'));

export default router;
