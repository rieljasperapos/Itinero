import { Response } from "express";
import { getNotifications, inviteCollaborator } from "../services/collaborator.service";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";
import HttpException from "../utils/error.utils";

export const inviteUser = async (req: CustomRequest, res: Response) => {
  const { itineraryId, email, role } = req.body;
  const inviterId = Number(req.user?.id);

  if (!itineraryId || !email || !role) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: "Missing required fields" });
    return;
  }

  try {
    const result = await inviteCollaborator(itineraryId, inviterId, email, role);
    res.status(StatusCodes.OK).send(result);
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.status).send({ error: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: "An unexpected error occurred",
        details: error.message,
      });
    }
  }
  return;
}

export const getUserNotifications = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.user?.id);
  
  try {
    const notifications = await getNotifications(userId);
    res.status(StatusCodes.OK).send({ data: notifications});
    return;
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error, message: "An error occurred while fetching notifications" });
    return
  }
}

