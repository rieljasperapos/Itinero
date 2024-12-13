"use client"
import Layout from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";

interface Collaborator {
  name: string;
  email: string;
  role: string;
};

const CollaboratorsPage = () => {
  const { data: session, status } = useSession();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries`,
            {
              headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
              },
            }
          );

          // Map the response data to the format you need
          const fetchedCollaborators = response.data.data[0].collaborators.map((collaborator: any) => ({
            name: collaborator.user.name,
            email: collaborator.user.email,
            role: collaborator.role, // Include any other relevant fields
          }));

          // console.log(fetchedCollaborators);

          setCollaborators(fetchedCollaborators)
          // console.log(response.data.data[0]);
        } catch (error) {
          console.error("Error fetching collaborators:", error);
        }
      }
    }
    fetchCollaborators();
  }, [status, session]);

  console.log(collaborators);

  return (
    <Layout breadcrumb="Collaborators">
      <div className="p-4 flex flex-col gap-4">
        {collaborators.map((collaborator, idx) => (
          <div key={idx} className="flex gap-4">
            <Avatar className="h-20 w-20 rounded-full">
              <AvatarImage src="/avatars/shadcn.jpg" alt={collaborator.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="flex gap-2 w-full flex-wrap max-w-lg justify-between items-center">
              <p>{collaborator.name}</p>
              <p>{collaborator.email}</p>
              <p className="text-semibold">{collaborator.role}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default CollaboratorsPage;