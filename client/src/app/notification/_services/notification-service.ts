import axios from "axios";

export async function fetchNotifications(token: string, page: number = 1, limit: number = 8) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`,
      {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { data: [], pagination: { total: 0, currentPage: 1, totalPages: 1, hasMore: false } };
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
