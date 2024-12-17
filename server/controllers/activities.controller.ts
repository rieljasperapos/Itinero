import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";
import { createNewActivity, deleteActivityById, fetchActivities, fetchActivityById, updateExistingActivity } from "../services/activity.service";

// GET /activities - Get all activities
export const getActivities = async (req: Request, res: Response) => {
  const { itineraryId } = req.query;

  try {
    const activities = await fetchActivities(itineraryId as string);
    res.status(StatusCodes.OK).send({ data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred while fetching activities." });
  }
};

// GET /activities/:id - Get activity by ID
export const getActivityById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await fetchActivityById(id);
    res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    console.error("Error fetching activity:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred while fetching the activity." });
  }
};

// POST /activities/create - Create a new activity
export const createActivity = async (req: CustomRequest, res: Response) => {
  try {
    const {
      activityName,
      startTime,
      endTime,
      locationName,
      address,
      itineraryId,
      date,
    } = req.body;
    const user = req.user;

    if (
      !activityName ||
      !startTime ||
      !endTime ||
      !locationName ||
      !address ||
      !itineraryId ||
      !date
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Missing required fields" });
      return;
    }

    const utcStartTime = new Date(startTime);
    const utcEndTime = new Date(endTime);

    const activityData = {
      activityName,
      startTime: utcStartTime,
      endTime: utcEndTime,
      locationName,
      address,
      itineraryId: Number(itineraryId),
      createdById: user?.id as number,
    };

    const data = await createNewActivity(activityData);
    res
      .status(StatusCodes.OK)
      .send({ data, message: "Activity created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred while creating the activity" });
  }
};

// PUT /activities/:id - Update an existing activity
export const updateActivity = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      activityName,
      startTime,
      endTime,
      locationName,
      address,
      date,
      itineraryId,
    } = req.body;

    if (
      !activityName ||
      !startTime ||
      !endTime ||
      !locationName ||
      !address ||
      !date ||
      !itineraryId
    ) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Missing required fields" });
      return;
    }

    const utcStartTime = new Date(startTime);
    const utcEndTime = new Date(endTime);

    const updatedData = {
      activityName,
      startTime: utcStartTime,
      endTime: utcEndTime,
      locationName,
      address,
      itineraryId: Number(itineraryId),
      updatedAt: new Date(),
    };

    const updatedActivity = await updateExistingActivity(id, updatedData);
    res
      .status(StatusCodes.OK)
      .send({ data: updatedActivity, message: "Activity updated successfully" });
  } catch (error) {
    console.error("Error updating activity:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred while updating the activity." });
  }
};

// DELETE /activities/:id - Delete an activity
export const deleteActivity = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await deleteActivityById(id);
    res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred while deleting the activity." });
  }
};