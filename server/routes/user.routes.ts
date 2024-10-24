import express from "express"
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();
router.get('/users', authenticate, userController.getUsers);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/logout', userController.logoutUser);

export default router;