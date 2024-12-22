"use client";
import Layout from "@/components/sidebar/layout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { loadNotifications, handleMarkAsRead } from "../_services/notification-action";
import { calculateTimeAgo } from "../_utils/calculate-time-ago";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchData = async (pageNum: number) => {
    try {
      const response = await loadNotifications(session?.user.accessToken as string, pageNum);
      if (pageNum === 1) {
        setNotifications(response.data);
      } else {
        setNotifications(prev => [...prev, ...response.data]);
      }
      setHasMore(response.pagination.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData(1);
    } else if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [session, status]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchData(page + 1);
    }
  };

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
        <DotLottieReact
          className="w-[50%]"
          src="https://lottie.host/aa2eba8e-913d-420f-b307-890f5a41365f/EaQL3x2VpA.lottie"
          loop
          autoplay
        />
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
                <div className="flex items-center">
                  {notification.isRead ? null : (
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span>
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
                <div>
                  <p className={`${notification.isRead ? "text-gray-400" : ""}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
            
            {hasMore && (
              <Button
                variant="text"
                onClick={loadMore}
                disabled={loading}
                className="text-sm text-gray-400 hover:text-gray-500 hover:underline hover:underline-offset-4 hover:decoration-gray-500 hover:font-bold hover:cursor-pointer hover:bg-transparent"
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </div>
        )}
      </Layout>
    )
  );
};

export default Notifications;