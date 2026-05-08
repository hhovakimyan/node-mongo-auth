import express from "express";
import UserController from "#controllers/UserController";
import {validate} from "#middleware/validation";
import {updateUserSchema} from "#validation/UpdateUserSchema";

const router = express.Router();

router.get('/', UserController.listAllUsers);
router.get('/:id', UserController.getUserData);
router.patch('/:id', validate(updateUserSchema), UserController.updateUserData);

export default router;