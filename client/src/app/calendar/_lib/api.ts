import axios from "axios";
import { format, toZonedTime } from 'date-fns-tz';
import { Activity } from "./types";

export const fetchActivities = async (accessToken: string): Promise<Activity[]> => {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return transformActivities(data.data);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

const transformActivities = (data: any) => {
  return data.flatMap((itinerary: any) =>
    itinerary.activities.map((activity: any) => ({
      title: activity.activityName,
      start: convertToPHT(activity.startTime),
      end: convertToPHT(activity.endTime), 
      location: activity.locationName,
      itinerary: itinerary.title,
    }))
  );
};

// Convert UTC time to Philippine Time (PHT)
const convertToPHT = (utcString: string): string => {
  const utcDate = new Date(utcString);
  const phtDate = toZonedTime(utcDate, 'Asia/Manila'); // Convert UTC to PHT
  return format(phtDate, "yyyy-MM-dd'T'HH:mm:ssXXX"); // Format as ISO string
};