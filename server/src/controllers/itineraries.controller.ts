import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";
import { createItineraryService, deleteItineraryService, getItineraryByIdService, getUserItineraries, updateItineraryService } from "../services/itinerary.service";

export const getItineraries = async (req: Request, res: Response) => {
  const data = await prisma.itinerary.findMany();
  res.send({ data: data });
  return;
};

export const getItineraryByUserId = async (
  req: CustomRequest,
  res: Response
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access",
    });
    return;
  }

  try {
    const itineraries = await getUserItineraries(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: itineraries,
    });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching itineraries.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getItineraryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await getItineraryByIdService(Number(id));

    if (!data) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "Itinerary not found" });
      return;
    }

    res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "An error occurred while fetching the itinerary" });
  }
};

export const getActivitiesByItineraryId = async (
  req: Request,
  res: Response
) => {
  const { itineraryId } = req.params;

  try {
    const activities = await prisma.activity.findMany({
      where: {
        itineraryId: Number(itineraryId),
      },
    });

    if (!activities || activities.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ message: "No activities found for this itinerary" });
    }

    res.status(StatusCodes.OK).send({ data: activities });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ error: "An error occurred while fetching activities" });
  }
  return;
};

export const createItinerary = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const user = req.user;

    if (!title || !description || !startDate || !endDate) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Missing required fields" });
      return;
    }

    const data = await createItineraryService({
      title,
      description,
      startDate,
      endDate,
      createdById: user?.id,
    });

    res.status(StatusCodes.OK).send({ data });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({
        error: error,
        message: "An error occurred while creating the itinerary",
      });
  }
};

export const updateItinerary = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;
  const userId = req.user?.id;

  try {
    const result = await updateItineraryService({
      id: Number(id),
      title,
      description,
      startDate,
      endDate,
      userId,
    });

    if (result.error) {
      res.status(result.status).json({
        success: false,
        message: result.message,
      });
      return;
    }

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

export const deleteItinerary = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const result = await deleteItineraryService(Number(id), userId);

    if (result.error) {
      res.status(result.status).json({
        success: false,
        message: result.message,
      });
      return;
    }

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
