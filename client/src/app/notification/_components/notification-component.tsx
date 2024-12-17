"use client";
import Layout from "@/components/sidebar/layout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { loadNotifications, handleMarkAsRead } from "../_services/notification-action";
import { calculateTimeAgo } from "../_utils/calculate-time-ago";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          const data = await loadNotifications(session?.user.accessToken as string);
          setNotifications(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  const markAsRead = async (id: number) => {
    await handleMarkAsRead(id, session?.user.accessToken as string, (idToUpdate) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === idToUpdate ? { ...notification, isRead: true } : notification
        )
      );
    });
  };

  return (
    status === "loading" || loading ? (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-gray-300" />
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <Layout breadcrumb="Notification">
        {notifications.length === 0 ? (
          <div className="flex flex-col gap-4 p-4">
            <p className="text-center text-gray-400">
              No notifications found.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`border-b rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition duration-200`}
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
        )}
      </Layout>
    )
  );
};

export default Notifications;