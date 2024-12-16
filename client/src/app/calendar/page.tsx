import { Metadata } from "next";
import Calendar from "./_components/calendar"

export const metadata: Metadata = {
  title: "Calendar | Itinero",
  description: "View your upcoming activities.",
}

const CalendarPage = () => {
  return (
    <Calendar />
  )
}

export default CalendarPage;
