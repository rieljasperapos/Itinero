"use client";
import Layout from "@/components/sidebar/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Collaborator } from "@/types/collaborator-types";

const Collabs = () => {
  const searchParams = useSearchParams();
  const itineraryId = searchParams.get("itineraryId");
  const { data: session, status } = useSession();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  useEffect(() => {
    const fetchCollaborators = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries/${itineraryId}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
              },
            }
          );
          setCollaborators(response.data.data.collaborators);
        } catch (error) {
          console.error("Error fetching collaborators:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCollaborators();
  }, [status, session]);

  return (
    status === "loading" || loading ? (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-gray-300" />
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <Layout breadcrumb="Collaborators">
        <div className="p-4 flex flex-col gap-4">
          {collaborators.length === 0 ? (
            <>
              <p>No collaborators found.</p>
            </>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <h1 className="text-5xl font-bold">Collaborators</h1>
                <span className="text-sm text-muted-foreground">See who you are collaborating with in this itinerary.</span>
              </div>
              {collaborators.map((collaborator, idx) => (
                <div key={idx} className="flex gap-4">
                  <Avatar className="h-20 w-20 rounded-full">
                    <AvatarImage src="/avatars/shadcn.jpg" alt={collaborator.user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2 w-full flex-wrap max-w-lg justify-between items-center">
                    <p>{collaborator.user.name}</p>
                    <p>{collaborator.user.email}</p>
                    <p className="text-semibold">{collaborator.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    )
  );
};

export default Collabs;