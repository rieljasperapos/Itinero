"use client";
import Layout from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/input";
import { useToast } from "@/hooks/use-toast";
import { handleSubmitEditInfo, handleSubmitEditPassword, validatePasswordFields } from "./_lib/profile-handler";
import { redirect } from "next/navigation";

const ProfilePage = () => {
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
        <div className="p-4 flex flex-col gap-10">
          <h1 className="font-bold text-2xl">My Profile</h1>
          <div className="border p-4 flex items-center gap-3">
            <Avatar className="h-24 w-24 rounded-full">
              <AvatarImage src="/avatars/shadcn.jpg" alt={session?.user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{session?.user.name}</p>
              <p className="text-sm">{session?.user.username}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="border p-4 flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold">Personal Information</h1>
              {isEditingInfo ? (
                <>
                  <Button
                    className="flex items-center gap-2"
                    onClick={handleInfoSubmit}
                  >
                    <Check />
                    <p>Save Changes</p>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setIsEditingInfo(!isEditingInfo)}
                  >
                    <Edit2 />
                    <p>Edit</p>
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-6">
              {isEditingInfo ? (
                <>
                  {/* Edit Name */}
                  <div className="flex flex-col gap-2 text-slate-400">
                    <span>Name</span>
                    <Input
                      defaultValue={session?.user.name}
                      onChange={(e) => setNewName(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  {/* Edit Email */}
                  <div className="flex flex-col gap-2 text-slate-400">
                    <span>Email address</span>
                    <Input
                      defaultValue={session?.user.email}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Name */}
                  <div className="flex flex-col gap-2 text-slate-400 text-md">
                    <span>Name</span>
                    <span className="font-bold">{session?.user.name}</span>
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-2 text-slate-400">
                    <span>Email address</span>
                    <span className="font-bold">{session?.user.email}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="border p-4 flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-semibold">Security & Privacy</h1>
            </div>

            <div className="flex flex-col gap-6">
              {isEditingPassword ? (
                <>
                  {/* Current Password Field */}
                  <div className="flex flex-col gap-2 text-slate-400">
                    <span>Current Password</span>
                    <Input
                      type="password"
                      placeholder="Enter your current password"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  {/* New Password Field */}
                  <div className="flex flex-col gap-2 text-slate-400">
                    <span>New Password</span>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  {/* Re-type Password Field */}
                  <div className="flex flex-col gap-2 text-slate-400">
                    <span>Re-type Password</span>
                    <Input
                      type="password"
                      placeholder="Re-type your new password"
                      onChange={(e) => setReTypePassword(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                  <Button
                    className="max-w-xs"
                    onClick={handlePasswordSubmit}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  {/* Password */}
                  <div className="flex flex-col gap-2 text-slate-400">
                    <span>Password</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">******************</span>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingPassword(!isEditingPassword)}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  );
};

export default ProfilePage;
