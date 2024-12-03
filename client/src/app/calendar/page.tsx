"use client"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const Calendar = () => {
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
          initialDate="2023-10-01"
          editable={true}
          selectable={true}
          events={[
            {
              title: "All Day Event",
              start: "2024-12-01",
              end: "2024-12-02",
            },
            {
              title: "Long Event",
              start: "2024-12-01",
              end: "2024-12-02",
            },
            {
              title: "Meeting",
              start: "2023-10-12T11:30:00",
              end: "2023-10-12T12:30:00",
              allDay: false,
            },
            {
              title: "Lunch",
              start: "2023-10-12T12:00:00",
              end: "2023-10-12T14:00:00",
              allDay: false,
            },
            {
              title: "Birthday Party",
              start: "2023-10-13T07:00:00",
              end: "2023-10-13T09:00:00",
              allDay: false,
            },
            {
              title: "Click for Google",
              url: "http://google.com/",
              start: "2023-10-28",
              end: "2023-10-29",
            },
          ]}
        />
      </div>
    </div>
  )
}

export default Calendar;