import express from "express";
import * as itinerariesController from "../controllers/itineraries.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/itineraries", itinerariesController.getItineraries);
router.get("/itineraries/:id", itinerariesController.getItineraryById);
router.post("/itineraries/create", authenticate, itinerariesController.createItinerary);

export default router;