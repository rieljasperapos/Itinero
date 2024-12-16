import { Metadata } from "next";
import InviteCollaborator from "./_components/collab-invite"

export const metadata: Metadata = {
  title: "Invite | Itinero",
  description: "Invite a collaborator to your itinerary.",
};

const InviteCollaboratorPage = () => {
  return (
    <InviteCollaborator />
  )
}

export default InviteCollaboratorPage;