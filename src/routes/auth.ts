import express from 'express';
import AuthenticationController from '#controllers/AuthenticationController';
import { validate } from '#middleware/validation';
import { registerUserSchema } from '#validation/RegisterUserSchema';

const router = express.Router();

router.post('/register', validate(registerUserSchema), AuthenticationController.registerUser);

export default router;
