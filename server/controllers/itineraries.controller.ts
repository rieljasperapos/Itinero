import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";

export const getItineraries = async (req: Request, res: Response) => {
  const data = await prisma.itinerary.findMany();
  res.send({ data: data });
  return;
};

export const getItineraryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await prisma.itinerary.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!data) {
    res.send({ message: "Itinerary not found" });
  } else {
    res.send({ data: data });
  }
  return;
};

export const getActivitiesByItineraryId = async (req: Request, res: Response) => {
  const { itineraryId } = req.params;
  console.log(itineraryId);

  try {
    const activities = await prisma.activity.findMany({
      where: {
        itineraryId: Number(itineraryId),
      },
    });

    if (!activities || activities.length === 0) {
      res.status(404).send({ message: "No activities found for this itinerary" });
    }

    res.send({ data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An error occurred while fetching activities" });
  }
  return;
};

export const createItinerary = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const user = req.user;
    console.log(user);
    
    if (!title || !description || !startDate || !endDate) {
      res.status(400).send({ error: "Missing required fields" });
      return;
    }

    const data = await prisma.itinerary.create({
      data: {
        title: title,
        description: description,
        startDate: startDate,
        endDate: endDate,
        createdById: user?.id,
      },
    });
    res.send({ data: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error, message: "An error occurred while creating the itinerary" });
    return;
  }
};