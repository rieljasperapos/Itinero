import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";

export const getNotifications = async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const notifications = await prisma.notifaction.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(StatusCodes.OK).send({ data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({ error: "An error occurred while fetching notifications." });
  }
};

export const markNotificationAsRead = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  // Validate that the ID is provided and is a number
  if (!id || isNaN(Number(id))) {
    res.status(400).send({ error: "Invalid notification ID." });
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
    res.send({ data: updatedNotification });
    return;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).send({ error: "An error occurred while marking the notification as read." });
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

    res.send({ data: notifications.length });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send({ error: "An error occurred while fetching notifications." });
  }
};
