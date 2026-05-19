import express from 'express';
import dotenv from 'dotenv';

import authRouter from '#routes/auth';
import userRouter from '#routes/user';
import { auth } from '#middleware/authentication';
import RedisClient from '#integrations/Redis/RedisClient';

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
const port = '3000';

app.use(express.json());
app.use(auth);

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
