import { prisma } from "../lib/prisma";

export const fetchActivities = async (itineraryId?: string | number) => {
  if (itineraryId) {
    return await prisma.activity.findMany({
      where: {
        itineraryId: Number(itineraryId),
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
  return await prisma.activity.findMany({
    orderBy: {
      startTime: 'asc',
    },
  });
};

export const fetchActivityById = async (id: string | number) => {
  return await prisma.activity.findUnique({
    where: {
      id: Number(id),
    },
  });
};

export const createNewActivity = async (activityData: {
  activityName: string;
  startTime: Date;
  endTime: Date;
  locationName: string;
  address: string;
  itineraryId: number;
  createdById: number;
}) => {
  return await prisma.activity.create({
    data: activityData,
  });
};

export const updateExistingActivity = async (
  id: string | number,
  updatedData: {
    activityName: string;
    startTime: Date;
    endTime: Date;
    locationName: string;
    address: string;
    itineraryId: number;
    updatedAt: Date;
  }
) => {
  return await prisma.activity.update({
    where: {
      id: Number(id),
    },
    data: updatedData,
  });
};

export const deleteActivityById = async (id: string | number) => {
  return await prisma.activity.delete({
    where: {
      id: Number(id),
    },
  });
};
