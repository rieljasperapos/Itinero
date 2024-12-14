import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";

export const getActivities = async (req: Request, res: Response) => {
  const { itineraryId } = req.query;

  try {
    let activities;
    if (itineraryId) {
      activities = await prisma.activity.findMany({
        where: {
          itineraryId: Number(itineraryId),
        },
        orderBy: {
          startTime: 'asc',
        },
      });
    } else {
      activities = await prisma.activity.findMany({
        orderBy: {
          startTime: 'asc',
        },
      });
    }
    res.status(StatusCodes.OK).send({ data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: "An error occurred while fetching activities." });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await prisma.activity.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.status(StatusCodes.OK).send({ data: data });
  return;
};

export const createActivity = async (req: CustomRequest, res: Response) => {
  try {
    const { activityName, startTime, endTime, locationName, address, itineraryId, date } = req.body;
    const user = req.user;

    if (!activityName || !startTime || !endTime || !locationName || !address || !itineraryId || !date) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: "Missing required fieldssdasda" });
      return;
    }
    const dateOnly = date.split('T')[0];

    const data = await prisma.activity.create({
      data: {
        activityName,
        startTime: new Date(`${dateOnly}T${startTime}:00`),
        endTime: new Date(`${dateOnly}T${endTime}:00`),
        locationName,
        address,
        itineraryId: Number(itineraryId),
        createdById: user?.id as number,
      },
    });
    res.status(StatusCodes.OK).send({ data: data, message: "Activity created successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error, message: "An error occurred while creating the activity" });
    return;
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
    
    const user = req.user;

    if (
      !activityName ||
      !startTime ||
      !endTime ||
      !locationName ||
      !address ||
      !date ||
      !itineraryId
    ) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: "Missing required fields" });
      return;
    }

    const dateOnly = date.split('T')[0]; // Extract the date part

    const updatedActivity = await prisma.activity.update({
      where: {
        id: Number(id),
      },
      data: {
        activityName,
        startTime: new Date(`${dateOnly}T${startTime}:00`),
        endTime: new Date(`${dateOnly}T${endTime}:00`),
        locationName,
        address,
        itineraryId: Number(itineraryId),
        updatedAt: new Date(),
      },
    });
    res.status(StatusCodes.OK).send({ data: updatedActivity, message: "Activity updated successfully" });
  } catch (error) {
    console.error('Error updating activity:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred while updating the activity." });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await prisma.activity.delete({
    where: {
      id: Number(id),
    },
  });
  res.status(StatusCodes.OK).send({ data: data });
  return;
};