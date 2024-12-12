"use client";
import { AppSidebar } from "../../components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Separator } from "@/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/layout";
import { MapPin, CalendarDays, Clock } from "lucide-react";
import "./_lib/custom-calendar.css";

const Calendar = () => {
  const [activities, setActivities] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchActivities = async () => {
      if (session?.user.accessToken) {
        try {
          const response = await axios.get(
            "http://localhost:3000/itineraries",
            {
              headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
              },
            }
          );
          console.log("Fetched activities:", response.data);

          // Map the response data to FullCalendar event format
          const fetchedActivities = response.data.data.flatMap(
            (itinerary: any) =>
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
    <Layout breadcrumb="Calendar">
      <div>
        <div className="max-w-6xl mx-auto p-4">
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
            dayMaxEventRows={3}
            editable={true}
            selectable={true}
            eventTimeFormat={{
              hour: "numeric",
              meridiem: "short",
            }}
            events={activities} // Use the state here
          />
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
