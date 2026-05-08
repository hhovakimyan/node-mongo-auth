import express from 'express';
import dotenv from 'dotenv';

import {validate} from "#middleware/validation";
import {registerUserSchema} from "#validation/UserSchema";

import UserController from "#controllers/UserController";
import AuthenticationController from "#controllers/AuthenticationController";

import authRouter from '#routes/auth';
import userRouter from '#routes/user';

// Load environment variables
dotenv.config();

const app = express();
const port = "3000";

app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});