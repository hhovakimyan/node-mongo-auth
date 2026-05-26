import { makeClassInvoker } from 'awilix-express';
import express from 'express';

import AuthenticationController from '#controllers/AuthenticationController';
import { validate } from '#middleware/validation';
import { loginUserSchema } from '#validation/LoginUserSchema';
import { registerUserSchema } from '#validation/RegisterUserSchema';

const router = express.Router();

router.post(
    '/register',
    validate(registerUserSchema),
    makeClassInvoker(AuthenticationController)('registerUser'),
);
router.post(
    '/login',
    validate(loginUserSchema),
    makeClassInvoker(AuthenticationController)('login'),
);
router.post('/logout', makeClassInvoker(AuthenticationController)('logout'));

export default router;
