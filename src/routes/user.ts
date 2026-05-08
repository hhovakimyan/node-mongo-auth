import express from "express";
import UserController from "#controllers/UserController";

const router = express.Router();

router.get('/', UserController.listAllUsers);
router.get('/:id', UserController.getUserData);

export default router;