import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";

export const getItineraries = async (req: Request, res: Response) => {
  const data = await prisma.itinerary.findMany();
  res.send({ data: data });
  return;
};

export const getItineraryByUserId = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  try {
    // Fetch itineraries created by the user
    const createdItineraries = await prisma.itinerary.findMany({
      where: { createdById: userId },
      include: {
        activities: true,
        collaborators: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    // Fetch itineraries where the user is a collaborator
    const collaboratedItineraries = await prisma.itinerary.findMany({
      where: { collaborators: { some: { userId } } },
      include: {
        activities: true,
        collaborators: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    // Combine results and remove duplicates
    const combinedItineraries = [
      ...createdItineraries,
      ...collaboratedItineraries.filter(
        (collaborated) =>
          !createdItineraries.some((created) => created.id === collaborated.id)
      ),
    ];

    res.status(StatusCodes.OK).json({
      success: true,
      data: combinedItineraries,
    });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching itineraries.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
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