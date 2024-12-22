import { fetchNotifications, markNotificationAsRead } from "./notification-service";

export async function loadNotifications(token: string, page: number = 1) {
  try {
    const response = await fetchNotifications(token, page);
    return response;
  } catch (error) {
    console.error("Error loading notifications:", error);
    throw error;
  }
}

export async function handleMarkAsRead(id: number, token: string, updateState: (id: number) => void) {
  try {
    await markNotificationAsRead(id, token);
    updateState(id);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}
