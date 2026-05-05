import express from 'express';

import {validate} from "#middleware/validation";
import {registerUserSchema} from "#validation/UserSchema";

import UserController from "#controllers/UserController";

const app = express();
const port = "3000";

app.use(express.json());

app.get('/', (_req, res) => {
    res.send(JSON.stringify({message: "Hello World"}));
});

app.post('/register', validate(registerUserSchema), UserController.registerUser);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});