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
    res.status(StatusCodes.NOT_FOUND).send({ message: "Itinerary not found" });
  } else {
    res.status(StatusCodes.OK).send({ data: data });
  }
  return;
};

export const getActivitiesByItineraryId = async (req: Request, res: Response) => {
  const { itineraryId } = req.params;

  try {
    const activities = await prisma.activity.findMany({
      where: {
        itineraryId: Number(itineraryId),
      },
    });

    if (!activities || activities.length === 0) {
      res.status(StatusCodes.NOT_FOUND).send({ message: "No activities found for this itinerary" });
    }

    res.status(StatusCodes.OK).send({ data: activities });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: "An error occurred while fetching activities" });
  }
  return;
};

export const createItinerary = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const user = req.user;
    
    if (!title || !description || !startDate || !endDate) {
      res.status(StatusCodes.BAD_REQUEST).send({ error: "Missing required fields" });
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
    res.status(StatusCodes.OK).send({ data: data });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error, message: "An error occurred while creating the itinerary" });
    return;
  }
};

export const updateItinerary = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;
  const userId = req.user?.id;

  try {
    // Check if the itinerary exists
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: Number(id) },
    });

    if (!itinerary) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Itinerary not found",
      });
      return;
    }

    // Check if the user has permission to edit
    if (itinerary.createdById !== userId) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to edit this itinerary",
      });
      return;
    }

    // Update the itinerary
    await prisma.itinerary.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        startDate,
        endDate,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Itinerary updated successfully",
    });
  } catch (error) {
    console.error("Error updating itinerary:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating the itinerary.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteItinerary = async (req: CustomRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    // Check if the itinerary exists
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: Number(id) },
    });

    if (!itinerary) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Itinerary not found",
      });
      return;
    }

    // Check if the user has permission to delete
    if (itinerary.createdById !== userId) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to delete this itinerary",
      });
      return;
    }

    // Delete the itinerary
    await prisma.itinerary.delete({
      where: { id: Number(id) },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting itinerary:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while deleting the itinerary.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};