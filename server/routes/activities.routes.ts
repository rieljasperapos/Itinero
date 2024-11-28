import { Router } from "express";
import * as activitiesController from "../controllers/activities.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
router.get("/activities", authenticate, activitiesController.getActivities);

export default router;