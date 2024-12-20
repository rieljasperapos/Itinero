import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Activity } from "@/types/activity-types";
import { Creator, GroupedActivities } from "@/types/itinerary-types";
import { Collaborator } from "@/types/collaborator-types";

export const useItineraryDetails = (
  itineraryId: number,
  collaborators: Collaborator[]
) => {
  const { data: session } = useSession();
  const [activitiesByDate, setActivitiesByDate] = useState<GroupedActivities>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [createdBy, setCreatedBy] = useState<Creator>({
    id: 0,
    email: "",
    name: "",
  });

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/activities`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          params: { itineraryId },
        }
      );
      const activities: Activity[] = response.data.data;
      const groupedActivities = activities.reduce(
        (group: GroupedActivities, activity: Activity) => {
          const localDate = new Date(activity.startTime).toLocaleDateString("en-CA");
          if (!group[localDate]) {
            group[localDate] = [];
          }
          group[localDate].push(activity);
          return group;
        },
        {}
      );

      setActivitiesByDate(groupedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchItineraryAndCheckRole = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries/${itineraryId}`
        );

        const creator = {
          id: response.data.data.createdBy.id,
          email: response.data.data.createdBy.email,
          name: response.data.data.createdBy.name
        };
        setCreatedBy(creator);

        if (session?.user?.email) {
          if (creator.email === session.user.email) {
            setIsEditor(true);
          } else {
            console.log(session.user.email);
            console.log(collaborators);
            const userIsEditor = collaborators.some(
              (collaborator) =>
                collaborator.user.email === session.user.email && 
                collaborator.role === 'EDITOR'
            );
            setIsEditor(userIsEditor);
          }
        }
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    };

    if (session?.user?.email) {
      fetchItineraryAndCheckRole();
    }
  }, [itineraryId, session, collaborators]);

  useEffect(() => {
    if (session && itineraryId) {
      fetchActivities();
    }
  }, [itineraryId, session]);

  console.log(isEditor);

  return {
    activitiesByDate,
    loading,
    isEditor,
    createdBy,
    fetchActivities,
  };
}; 