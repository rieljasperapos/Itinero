import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";

export const getNotifications = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const [notifications, total] = await Promise.all([
      prisma.notifaction.findMany({
        where: {
          userId: Number(userId),
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: skip,
      }),
      prisma.notifaction.count({
        where: {
          userId: Number(userId),
        },
      }),
    ]);

    res.status(StatusCodes.OK).send({ 
      data: notifications,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + notifications.length < total
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: "An error occurred while fetching notifications." });
  }
};

export const markNotificationAsRead = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: "Invalid notification ID." });
    return
  }

  try {
    const updatedNotification = await prisma.notifaction.update({
      where: {
        id: Number(id),
      },
      data: {
        isRead: true,
      },
    });
    res.status(StatusCodes.OK).send({ data: updatedNotification });
    return;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: "An error occurred while marking the notification as read." });
    return;
  }
};

export const getNotificationsUnreadCount = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const notifications = await prisma.notifaction.findMany({
      where: {
        userId: Number(userId),
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(StatusCodes.OK).send({ data: notifications.length });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: "An error occurred while fetching notifications." });
  }
};
