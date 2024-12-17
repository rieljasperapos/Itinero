"use client";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/schemas";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, // Import FormMessage for error messages
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [emailFound, setEmailFound] = useState(false);
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      reTypePassword: "",
    },
  });

  const handleFindEmail = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/find-by-email`,
        { email }
      );
      if (response.data.success) {
        setEmailFound(true);
        toast({
          variant: "default",
          title: "Email exists",
          description: "You can now reset your password",
        });
      } else {
        console.error("Error finding user by email:", response.data.message);
      }
    } catch (error) {
      console.error("Error finding user by email:", error);
    }
  };

  const onSubmit = async (data: z.infer<typeof ResetPasswordSchema>) => {
    // POST request to the server to reset the password
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password`,
        { newPassword: data.newPassword, reTypePassword: data.reTypePassword, email: email }
      );
      if (response.data.success) {
        setEmailFound(false);
        toast({
          variant: "default",
          title: "Password reset",
          description: "Your password has been reset",
        });
      } else {
        console.error("Error resetting password:", response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto p-8">
      <h1 className="text-center text-2xl font-bold">Reset Password</h1>
      <span className="text-center text-sm text-muted-foreground">
        Enter your email address to reset your password.
      </span>
      <div className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleFindEmail} className="bg-[#3A86FF] hover:bg-[#77A4EC]">Enter email</Button>
      </div>
      {/* ENTER NEW PASSWORD */}
      <div className="flex flex-col gap-4 mt-8">
        {emailFound && (
          <>
            <span className="text-center text-sm text-muted-foreground">
              Enter your new password and confirm it.
            </span>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.newPassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reTypePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Re-type Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Re-type your new password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage>
                          {form.formState.errors.reTypePassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-[#3A86FF] hover:bg-[#77A4EC]">Submit</Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
