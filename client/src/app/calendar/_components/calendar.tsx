"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/sidebar/layout";
import "../_lib/custom-calendar.css";
import { redirect } from "next/navigation";
import { fetchActivities } from "../_services/calendar-services";
import { Activity } from "../_types/types";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Calendar = () => {
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLottieReact
          className="w-[50%]"
          src="https://lottie.host/aa2eba8e-913d-420f-b307-890f5a41365f/EaQL3x2VpA.lottie"
          loop
          autoplay
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
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
