import { Response } from "express";
import { getNotifications, inviteCollaborator } from "../services/collaborator.service";
import { CustomRequest } from "../types/auth.type";

export const inviteUser = async (req: CustomRequest, res: Response) => {
  const { itineraryId, email, role } = req.body;
  const inviterId = Number(req.user?.id);

  console.log(req.body);

  if (!itineraryId || !email || !role) {
    res.status(400).send({ error: "Missing required fields" });
    return;
  }

  try {
    const result = await inviteCollaborator(itineraryId, inviterId, email, role);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error, message: `User with email ${email} is not found`, found: false });
  }
  return;
}

export const getUserNotifications = async (req: CustomRequest, res: Response) => {
  const userId = Number(req.user?.id);
  
  try {
    const notifications = await getNotifications(userId);
    res.status(200).send({ data: notifications});
    return;
  } catch (error) {
    res.status(500).send({ error: error, message: "An error occurred while fetching notifications" });
    return
  }
}

