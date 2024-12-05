"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, CalendarDays, Clock } from "lucide-react";

const Calendar = () => {
  const [activities, setActivities] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchActivities = async () => {
      if (session?.user.accessToken) {
        try {
          const response = await axios.get("http://localhost:3000/itineraries", {
            headers: {
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
          });
          console.log("Fetched activities:", response.data);

          // Map the response data to FullCalendar event format
          const fetchedActivities = response.data.data.flatMap((itinerary: any) =>
            itinerary.activities.map((activity: any) => ({
              title: activity.activityName,
              start: activity.startTime,
              end: activity.endTime,
              location: activity.locationName, // Optional: extra data if needed
              itinerary: itinerary.title,
            }))
          );

          setActivities(fetchedActivities);
        } catch (error) {
          console.error("Error fetching activities:", error);
        }
      }
    };

    fetchActivities();
  }, [session?.user.accessToken]);

  const formatTime = (dateString: any) => {
    const options: any = { hour: "2-digit", minute: "2-digit", hour12: true };
    return new Date(dateString).toLocaleTimeString([], options);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="border-b py-2">
        <h1 className="heading">Calendar</h1>
      </div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <FullCalendar
          timeZone="Asia/Manila"
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridYear",
          }}
          initialDate={new Date()}
          editable={true}
          selectable={true}
          events={activities} // Use the state here
          eventContent={(eventInfo) => {
            const startTime = formatTime(eventInfo.event.start);
            const endTime = formatTime(eventInfo.event.end);

            return (
              <div className="rounded-lg p-2 bg-gray-100 ease-in-out truncate flex flex-col gap-2">
                <div className="text-xs md:text-sm mt-1 italic font-bold border-b border-gray-300 p-2">
                  {eventInfo.event.extendedProps.itinerary}
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span className="text-sm md:text-base font-medium">
                    {eventInfo.event.title}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-xs md:text-sm">{eventInfo.event.extendedProps.location}</span>
                </div>
                <div className="flex items-center text-xs md:text-sm mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  {startTime} - {endTime}
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
