import express from 'express';
import AuthenticationController from '#controllers/AuthenticationController';
import { validate } from '#middleware/validation';
import { registerUserSchema } from '#validation/RegisterUserSchema';
import { loginUserSchema } from '#validation/LoginUserSchema';

const router = express.Router();

router.post('/register', validate(registerUserSchema), AuthenticationController.registerUser);
router.post('/login', validate(loginUserSchema), AuthenticationController.login);
router.post('/logout', AuthenticationController.logout);

export default router;
