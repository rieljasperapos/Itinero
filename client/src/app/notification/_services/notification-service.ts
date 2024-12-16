import axios from "axios";

export async function fetchNotifications(token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data; // Assuming API returns data in this structure
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(id: number, token: string) {
  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}
