import express from 'express';

import UserController from '#controllers/UserController';
import { validate } from '#middleware/validation';
import { updateUserSchema } from '#validation/UpdateUserSchema';

const router = express.Router();

router
    .route('/me')
    .get(UserController.getProfile)
    .patch(validate(updateUserSchema), UserController.updateProfile)
    .delete(UserController.deleteProfile);

export default router;
