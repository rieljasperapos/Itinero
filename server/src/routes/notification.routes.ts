import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/notifications", authenticate, notificationController.getNotifications);
router.put("/notifications/:id", authenticate, notificationController.markNotificationAsRead);
router.get("/notifications/unread-count", authenticate, notificationController.getNotificationsUnreadCount);

export default router;