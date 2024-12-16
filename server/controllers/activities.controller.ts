import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";
import { toZonedTime } from "date-fns-tz";
import { createNewActivity, deleteActivityById, fetchActivities, fetchActivityById, updateExistingActivity } from "../services/activity.service";

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

    const dateOnly = date.split("T")[0];
    const startDateTime = `${dateOnly}T${startTime}:00`;
    const endDateTime = `${dateOnly}T${endTime}:00`;

    // Convert to UTC
    const utcStartTime = toZonedTime(startDateTime, 'Asia/Manila'); // UTC+8
    const utcEndTime = toZonedTime(endDateTime, 'Asia/Manila'); // UTC+8

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

    const dateOnly = date.split("T")[0];
    const updatedData = {
      activityName,
      startTime: new Date(`${dateOnly}T${startTime}:00`),
      endTime: new Date(`${dateOnly}T${endTime}:00`),
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