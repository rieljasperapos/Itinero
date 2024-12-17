import express from "express";
import * as itinerariesController from "../controllers/itineraries.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/itineraries", authenticate, itinerariesController.getItineraryByUserId);
router.get("/itineraries/:itineraryId/activities", itinerariesController.getActivitiesByItineraryId);
router.get("/itineraries/:id", itinerariesController.getItineraryById);
router.post("/itineraries/create", authenticate, itinerariesController.createItinerary);
router.put("/itineraries/:id", authenticate, itinerariesController.updateItinerary);
router.delete("/itineraries/:id", authenticate, itinerariesController.deleteItinerary);

export default router;