import { Metadata } from "next";
import Profile from "./_components/profile"

export const metadata: Metadata = {
  title: "Profile | Itinero",
  description: "View your profile.",
};

const ProfilePage = () => {
  return (
    <Profile />
  )
}

export default ProfilePage;