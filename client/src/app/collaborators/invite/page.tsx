import { Suspense } from "react";
import InviteCollaborator from "./_components/collab-invite";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invite | Itinero",
  description: "Invite a collaborator to your itinerary.",
};

const InviteCollaboratorPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <InviteCollaborator />
    </Suspense>
  )
}

export default InviteCollaboratorPage;
