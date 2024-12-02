import { Router } from "express";
import * as collabController from "../controllers/collab.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/collab/invite", authenticate, collabController.inviteUser);
router.get("/collab/notifications", authenticate, collabController.getUserNotifications);

export default router;