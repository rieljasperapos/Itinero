import { Suspense } from "react";
import Collabs from "./_components/collaborators";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaborators | Itinero",
  description: "View your collaborators.",
};

const CollaboratorsPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Collabs />
    </Suspense>
  )
}

export default CollaboratorsPage;