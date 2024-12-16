import { fetchNotifications, markNotificationAsRead } from "./notification-service";

export async function loadNotifications(token: string) {
  try {
    const notifications = await fetchNotifications(token);
    return notifications;
  } catch (error) {
    console.error("Error loading notifications:", error);
    throw error;
  }
}

export async function handleMarkAsRead(id: number, token: string, updateState: (id: number) => void) {
  try {
    await markNotificationAsRead(id, token);
    updateState(id); // Callback to update local state
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}
