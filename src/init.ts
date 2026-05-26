import { loadControllers, scopePerRequest } from 'awilix-express';
import dotenv from 'dotenv';
import express from 'express';

import RedisClient from '#integrations/Redis/RedisClient';
import { auth } from '#middleware/authentication';
import authRouter from '#routes/auth';
import userRouter from '#routes/user';
import { getCurrentDirPath } from '#utils/path';

import createDiContainer from './di';

// Load environment variables
dotenv.config();

const diContainer = await createDiContainer();

const app = express();
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

export default app;
