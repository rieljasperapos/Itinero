// utils/profileHandlers.ts
import { z } from "zod";
import { updateUserInfo, changeUserPassword } from "../_services/user-api"; // Import your API functions
import { EditPasswordSchema } from "@/schemas";

// Function to handle personal information submission
export const handleSubmitEditInfo = async (newName: string, newEmail: string, session: any, toast: any) => {
  try {
    const response = await updateUserInfo(newName, newEmail, session?.user.accessToken);
    if (response.success) {
      toast({
        variant: "default",
        title: "Success",
        description: "Your information has been updated",
      });
      return response; // Return updated user data
    }
  } catch (error) {
    console.error("Error in handleSubmitEditInfo:", error);
  }
};

// Function to handle password submission
export const handleSubmitEditPassword = async (
  currentPassword: string,
  newPassword: string,
  reTypePassword: string,
  session: any,
  toast: any
) => {
  try {
    const response = await changeUserPassword(currentPassword, newPassword, reTypePassword, session?.user.accessToken);
    if (response.success) {
      toast({
        variant: "default",
        title: "Success!",
        description: "Your password has been updated",
      });
    }
    return response;
  } catch (error: any) {
    if (error.response.data.success === false) {
      toast({
        variant: "destructive",
        title: "Invalid Current Password",
        description: "Please enter the correct current password",
      });
    }
    console.error("Error in handleSubmitEditPassword:", error);
  }
};

// Function to validate password fields
export const validatePasswordFields = (currentPassword: string, newPassword: string, reTypePassword: string) => {
  try {
    const passwordData = { currentPassword, newPassword, reTypePassword };
    EditPasswordSchema.parse(passwordData);
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: { [key: string]: string } = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      return { valid: false, errors };
    }
    return { valid: false, errors: {} };
  }
};
