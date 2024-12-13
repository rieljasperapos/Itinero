"use client";
import Layout from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/input";
import axios from "axios";
import { EditPasswordSchema } from "@/schemas";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const ProfilePage = () => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reTypePassword, setReTypePassword] = useState("");
  const { data: session, status, update } = useSession();
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    reTypePassword: "",
  });
  const { toast } = useToast();
  console.log({ session });

  const handleSubmitEditInfo = async () => {
    // POST request to the server to update the user's information
    try {
      const response = await axios.post(
        "http://localhost:3000/user-update",
        {
          name: newName,
          email: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          }
        }
      );
      console.log("Handle Edit Info Response:", response.data);


      await update({
        ...session,
        user: {
          ...session?.user,
          name: response.data.data.name,
          email: response.data.data.email,
        }
      })

    } catch (error) {
      console.error("Error in handleSubmitEditInfo:", error);
    }

    setIsEditingInfo(!isEditingInfo); // Change the isEditing to false once Save Changes is clicked

    // Reset the input fields
    setNewName("");
    setNewEmail("");
  }

  const validatePasswordFields = () => {
    try {
      const passwordData = { currentPassword, newPassword, reTypePassword };
      // Validate password fields using the password schema
      EditPasswordSchema.parse(passwordData);
      setErrors({
        currentPassword: "",
        newPassword: "",
        reTypePassword: "",
      }); // Clear errors on success
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key in keyof typeof errors]: string } = {
          currentPassword: "",
          newPassword: "",
          reTypePassword: "",
        };

        error.errors.forEach((err) => {
          // Ensure the path[0] is one of the keys in errors (currentPassword, newPassword, reTypePassword)
          if (newErrors.hasOwnProperty(err.path[0])) {
            // Cast err.path[0] as keyof typeof errors to prevent TypeScript error
            newErrors[err.path[0] as keyof typeof newErrors] = err.message;
          }
        });

        setErrors(newErrors); // Set errors
      }
      return false;
    }
  };

  const handleSubmitChangePassword = async () => {
    // POST request to the server to update the user's password
    if (!validatePasswordFields()) {
      return; // Don't submit if validation fails
    }

    try {
      // EditPasswordSchema.parse(passwordData);
      const response = await axios.post(
        "http://localhost:3000/change-password",
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
          reTypePassword: reTypePassword,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          }
        }
      );
      console.log(response.data.data.message);
      setIsEditingPassword(!isEditingPassword);
    } catch (error: any) {
      if (error.response.data.message === "Invalid current password") {
        toast({
          variant: "destructive",
          title: "Invalid current password",
          description: "Please enter the correct current password",
          action: <ToastAction altText="Try again">Try again</ToastAction>
        })
      }
      console.error(error);
    }
  }
  
  return (
    <Layout breadcrumb="Profile">
      {status === "loading" ? (
        <>
          <div className="p-4 flex flex-col gap-10">
            <h1 className="font-bold text-2xl">Loading...</h1>
          </div>
        </>
      ): (
      <div className="p-4 flex flex-col gap-10">
        <h1 className="font-bold text-2xl">My Profile</h1>
        <div className="border p-4 flex items-center gap-3">
          <Avatar className="h-24 w-24 rounded-full">
            <AvatarImage src="/avatars/shadcn.jpg" alt={session?.user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          {/* <Image src="https://github.com/shadcn.png" alt="profile" width={80} height={80} className="rounded-full" /> */}
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
                <Button className="flex items-center gap-2" onClick={handleSubmitEditInfo}>
                  <Check />
                  <p>Save Changes</p>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsEditingInfo(!isEditingInfo)}>
                  <Edit2 />
                  {/* {isEditingInfo ? "Save Changes" : "Edit"} */}
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
                    placeholder="********"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="max-w-xs"
                  />
                  <span className="text-red-500">{errors.currentPassword}</span>
                </div>
                {/* New Password Field */}
                <div className="flex flex-col gap-2 text-slate-400">
                  <span>New Password</span>
                  <Input 
                    type="password"
                    placeholder="********"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="max-w-xs"
                  />
                  <span className="text-red-500">{errors.newPassword}</span>
                </div>
                {/* Re-type Password Field */}
                <div className="flex flex-col gap-2 text-slate-400">
                  <span>Re-type Password</span>
                  <Input
                    type="password" 
                    placeholder="********"
                    onChange={(e) => setReTypePassword(e.target.value)}
                    className="max-w-xs"
                  />
                  <span className="text-red-500">{errors.reTypePassword}</span>
                </div>
                <Button className="max-w-xs" onClick={handleSubmitChangePassword}>Save Changes</Button>
              </>
            ) : (
              <>
                {/* Password */}
                <div className="flex flex-col gap-2 text-slate-400">
                  <span>Password</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">******************</span>
                    <Button variant="outline" onClick={() => setIsEditingPassword(!isEditingPassword)}>Change Password</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </Layout>
  );
};

export default ProfilePage;
