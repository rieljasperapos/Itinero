import axios from 'axios';

export const inviteCollaborator = async (itineraryId: string | null, email: string, role: string, accessToken: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/collab/invite`,
      {
        itineraryId: itineraryId,
        email: email,
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data; // Throw the error to be handled in the component
  }
};
