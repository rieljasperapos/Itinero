"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import "../_lib/custom-calendar.css";
import { redirect } from "next/navigation";
import { fetchActivities } from "../_services/calendar-services";
import { Activity } from "../_types/types";

const Calendar = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    } else if (status === "authenticated") {
      fetchAndSetActivities();
    }
  }, [status]);

  const fetchAndSetActivities = async () => {
    if (!session?.user.accessToken) return;

    const activities = await fetchActivities(session.user.accessToken);
    setActivities(activities);
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <Layout breadcrumb="Calendar">
      <div>
        <div className="mx-auto p-4">
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
