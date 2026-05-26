import { makeClassInvoker } from 'awilix-express';
import express from 'express';

import UserController from '#controllers/UserController';
import { validate } from '#middleware/validation';
import { updateUserSchema } from '#validation/UpdateUserSchema';

const router = express.Router();

router
    .route('/me')
    .get(makeClassInvoker(UserController)('getProfile'))
    .patch(validate(updateUserSchema), makeClassInvoker(UserController)('updateProfile'))
    .delete(makeClassInvoker(UserController)('deleteProfile'));

export default router;
