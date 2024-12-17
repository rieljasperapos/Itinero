"use client";
import Layout from "@/components/sidebar/layout";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleSubmitEditInfo, handleSubmitEditPassword, validatePasswordFields } from "../_lib/profile-handler";
import { redirect } from "next/navigation";
import { AvatarSection } from "./avatar-section";
import { PersonalInfoSection } from "./personal-info";
import { PasswordSection } from "./security-section";

const Profile = () => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const { data: session, status, update } = useSession();
  const { toast } = useToast();

  // Redirect to login page if user is not authenticated
  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  // Handler for updating user information
  const handleInfoSubmit = async () => {
    const response = await handleSubmitEditInfo(newName, newEmail, session, toast);
    if (response && response.success) {
      await update({
        ...session,
        user: {
          name: response.data.name,
          email: response.data.email
        }
      });
    }
    setIsEditingInfo(!isEditingInfo);
  };

  // Handle password submission
  const handlePasswordSubmit = async () => {
    const validation = validatePasswordFields(currentPassword, newPassword, reTypePassword);
    if (!validation.valid) {
      Object.entries(validation.errors).forEach(([key, message]) => {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: message,
        });
      });
      return;
    }
    const response = await handleSubmitEditPassword(currentPassword, newPassword, reTypePassword, session, toast);
    if (response && response.success) {
      setIsEditingPassword(!isEditingPassword);
    }
  }

  return (
    status === "loading" ? (
      <div className="p-4 flex flex-col gap-10">
        <h1 className="font-bold text-2xl">Loading...</h1>
      </div>
    ) : (
      <Layout breadcrumb="Profile">
      <div className="p-4 flex flex-col gap-10 w-full max-w-6xl mx-auto">
        <AvatarSection name={session?.user.name} username={session?.user.username} />
        <PersonalInfoSection
          isEditingInfo={isEditingInfo}
          name={session?.user.name}
          email={session?.user.email}
          setIsEditingInfo={setIsEditingInfo}
          setNewName={setNewName}
          setNewEmail={setNewEmail}
          handleInfoSubmit={handleInfoSubmit}
        />
        <PasswordSection
          isEditingPassword={isEditingPassword}
          setIsEditingPassword={setIsEditingPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setReTypePassword={setReTypePassword}
          handlePasswordSubmit={handlePasswordSubmit}
        />
      </div>
    </Layout>
    )
  );
};

export default Profile;
