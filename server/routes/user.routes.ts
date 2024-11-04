import express from "express"
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { limiter } from "../middlewares/limiter.middleware";

const router = express.Router();
router.get('/users', authenticate, userController.getUsers);
router.post('/login', limiter, userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/logout', userController.logoutUser);

export default router;