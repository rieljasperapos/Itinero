import { prisma } from "../lib/prisma";
import HttpException from "../utils/error.utils";

export const inviteCollaborator = async (itineraryId: number, inviterId: number, inviteeEmail: string, role: "VIEWER" | "EDITOR") => {
  // Validate ownership of the itinerary
  const itinerary = await prisma.itinerary.findFirst({
    where: {
      id: itineraryId,
      createdById: inviterId
    }
  });

  if (!itinerary) {
    throw new HttpException(403, "You are not authorized to invite collaborators to this itinerary");
  }

  // Validate email format
  if (!inviteeEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    throw new HttpException(400, "Invalid email format");
  }

  // Find the invitee by email
  const invitee = await prisma.user.findUnique({
    where: {
      email: inviteeEmail
    }
  });

  if (!invitee) {
    throw new HttpException(404, "The user with this email does not exist");
  }

  // Check if the user is already a collaborator
  const existingCollaborator = await prisma.collaborator.findFirst({
    where: {
      userId: invitee.id,
      itineraryId
    }
  });

  if (existingCollaborator) {
    // Update role 
    await prisma.collaborator.update({
      where: { id: existingCollaborator.id },
      data: { role}
    });
  } else {
    // Add new collaborator
    await prisma.collaborator.create({
      data: {
        userId: invitee.id,
        itineraryId,
        role,
      }
    })
  }

  // Create notification for the invitee
  await prisma.notifaction.create({
    data: {
      userId: invitee.id,
      itineraryId,
      message: `You have been invited to collaborate on ${itinerary.title} as ${role}`,
      isRead: false,
    }
  });

  return {
    message: `Successfully invited ${invitee.name} to collaborate on ${itinerary.title} as ${role}`,
  };
};

export const getNotifications = async (userId: number) => {
  const notifications = await prisma.notifaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
};