import { Router } from "express";
import * as activitiesController from "../controllers/activities.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/activities", authenticate, activitiesController.getActivities);
router.get("/activities/:id", authenticate, activitiesController.getActivityById);
router.post("/activities/create", authenticate, activitiesController.createActivity);
router.put("/activities/:id", authenticate, activitiesController.updateActivity);
router.delete("/activities/:id", authenticate, activitiesController.deleteActivity);

export default router;