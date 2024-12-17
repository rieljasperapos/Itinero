import { prisma } from "../lib/prisma";

export const getUserItineraries = async (userId: number) => {
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
  return [
    ...createdItineraries,
    ...collaboratedItineraries.filter(
      (collaborated) =>
        !createdItineraries.some((created) => created.id === collaborated.id)
    ),
  ];
};

export const getItineraryByIdService = async (id: number) => {
  return await prisma.itinerary.findUnique({
    where: { id },
    include: {
      collaborators: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const createItineraryService = async (data: {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdById?: number;
}) => {
  return await prisma.itinerary.create({
    data,
  });
};

export const updateItineraryService = async ({
  id,
  title,
  description,
  startDate,
  endDate,
  userId,
}: {
  id: number;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: number;
}) => {
  const itinerary = await prisma.itinerary.findUnique({ where: { id } });

  if (!itinerary) {
    return { status: 404, error: true, message: "Itinerary not found" };
  }

  if (itinerary.createdById !== userId) {
    return { status: 403, error: true, message: "Permission denied" };
  }

  await prisma.itinerary.update({
    where: { id },
    data: { title, description, startDate, endDate },
  });

  return { status: 200, error: false };
};

export const deleteItineraryService = async (
  id: number,
  userId?: number
): Promise<{ status: number; error: boolean; message?: string }> => {
  const itinerary = await prisma.itinerary.findUnique({ where: { id } });

  if (!itinerary) {
    return { status: 404, error: true, message: "Itinerary not found" };
  }

  if (itinerary.createdById !== userId) {
    return { status: 403, error: true, message: "You do not have permission to delete this itinerary" };
  }

  // Check for related activities
  const relatedActivities = await prisma.activity.count({
    where: { itineraryId: id },
  });

  if (relatedActivities > 0) {
    return {
      status: 400,
      error: true,
      message: "You must delete related activities before deleting this itinerary."
    };
  }

  await prisma.itinerary.delete({ where: { id } });

  return { status: 200, error: false };
};

