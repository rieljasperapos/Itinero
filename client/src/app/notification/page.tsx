"use client";
import Layout from "@/components/layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const NotificationPage = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchResponse = async () => {
      if (status === "authenticated") {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`,
            {
              headers: {
                Authorization: `Bearer ${session?.user.accessToken}`,
              },
            }
          );
          setNotifications(response.data.data);
        } catch (error) {
          console.error("Error fetching user notifications:", error);
        }
      }
    };

    fetchResponse();
  }, [status, session]);

  const calculateTimeAgo = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - createdDate.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(minutesDiff / 1440); // 1440 minutes in a day

    if (daysDiff > 0) {
      return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
    } else if (hoursDiff > 0) {
      return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
    } else {
      return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;
    }
  };


  const handleNotificationClick = async (id: number) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
      // Update the notification state locally
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    status === "loading" ? (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-gray-300" />
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <Layout breadcrumb="Notification">
        <div className="flex flex-col gap-4 p-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification.id)}
              className={`border-b rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition duration-200 bg-white`}
            >
              {/* Notification Title */}
              <div className="flex items-center">
                {notification.isRead ? null : (
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span> // Red indicator for unread notifications
                )}
                <h1
                  className={`text-lg ${notification.isRead ? "" : "font-bold"}`}
                >
                  {notification.title}
                </h1>
                <span
                  className={`${notification.isRead ? "text-gray-400" : ""
                    } ml-auto`}
                >
                  {calculateTimeAgo(notification.createdAt)}
                </span>
              </div>
              {/* Notification Content */}
              <div>
                <p className={`${notification.isRead ? "text-gray-400" : ""}`}>
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    )
  );
};

export default NotificationPage;
