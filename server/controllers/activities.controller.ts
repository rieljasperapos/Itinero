import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";

export const getActivities = async (req: Request, res: Response) => {
  const data = await prisma.activity.findMany();
  res.send({ data: data });
  return;
};

export const getActivityById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await prisma.activity.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.send({ data: data });
  return;
};

export const createActivity = async (req: CustomRequest, res: Response) => {
  try {
    const { activityName, startTime, endTime, locationName, address, itineraryId } = req.body;
    const user = req.user;
    console.log(user);

    if (!activityName || !startTime || !endTime || !locationName || !address || !itineraryId) {
      res.status(400).send({ error: "Missing required fields" });
      return;
    }

    const data = await prisma.activity.create({
      data: {
        activityName,
        startTime,
        endTime,
        locationName,
        address,
        itineraryId: Number(itineraryId),
        createdById: user?.id as number,
      },
    });
    res.send({ data: data, message: "Activity created successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error, message: "An error occurred while creating the activity" });
    return;
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { activityName, startTime, endTime, locationName, address } = req.body;
  const data = await prisma.activity.update({
    where: {
      id: Number(id),
    },
    data: {
      activityName,
      startTime,
      endTime,
      locationName,
      address,
    },
  });
  res.send({ data: data });
  return;
};

export const deleteActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await prisma.activity.delete({
    where: {
      id: Number(id),
    },
  });
  res.send({ data: data });
  return;
};