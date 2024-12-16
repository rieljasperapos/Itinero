import Notifications from "./_components/notification-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | Itinero",
  description: "View your latest notifications.",
};

const NotificationPage = () => {
  return (
    <Notifications />
  )
}

export default NotificationPage;