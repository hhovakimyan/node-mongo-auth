import dotenv from 'dotenv';
import express from 'express';

import RedisClient from '#integrations/Redis/RedisClient';
import { auth } from '#middleware/authentication';
import authRouter from '#routes/auth';
import userRouter from '#routes/user';

// Load environment variables
dotenv.config();

// Init Redis
RedisClient.init()
    .then(() => {
        console.log('Connected to Lovely Redis');
    })
    .catch((error) => {
        console.log(error);
    });

const app = express();

app.use(express.json());
app.use(auth);

app.use('/auth', authRouter);
app.use('/users', userRouter);

export default app;
