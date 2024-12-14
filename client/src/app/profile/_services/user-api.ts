// services/userApi.ts
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const updateUserInfo = async (name: string, email: string, token: string) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/user-update`,
      { name, email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return response data
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error; // Rethrow to handle it in the calling function
  }
};

export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string,
  reTypePassword: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/change-password`,
      { currentPassword, newPassword, reTypePassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return response data
  } catch (error) {
    console.error("Error changing user password:", error);
    throw error; // Rethrow to handle it in the calling function
  }
};
