import express from "express"
import * as userController from "../controllers/user.controller";

const router = express.Router();
router.get('/users', userController.getUsers);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);

export default router;