import { loadControllers, scopePerRequest } from 'awilix-express';
import dotenv from 'dotenv';
import express from 'express';

import createDiContainer from '#bootstrap/di';
import RedisClient from '#integrations/Redis/RedisClient';
import { auth } from '#middleware/authentication';
import authRouter from '#routes/auth';
import userRouter from '#routes/user';
import { getCurrentDirPath } from '#utils/path';

// Load environment variables
dotenv.config();

export const diContainer = await createDiContainer();

export const app = express();
app.use(scopePerRequest(diContainer));
app.use(await loadControllers('controller/*.ts', { cwd: getCurrentDirPath() }));

// Init Redis
RedisClient.init()
    .then(() => {
        console.log('Connected to Lovely Redis');
    })
    .catch((error) => {
        console.log(error);
    });

app.use(express.json());
app.use(auth);

app.use('/auth', authRouter);
app.use('/users', userRouter);
