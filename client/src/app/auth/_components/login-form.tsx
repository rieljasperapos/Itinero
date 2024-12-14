"use client";
import { CardWrapper } from "./card-wrapper";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const { data: session, status } = useSession();
  if (session?.user) {
    redirect("/")
  }

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      console.error("Sign-in error:", res.error);
      form.setError("root", { message: "Invalid username or password" });
    }
  };

  return (
    <>
      {status === "unauthenticated" ? (
        <CardWrapper
          headerTitle="Signin"
          register="Don't have an account?"
          registerHref="/auth/signup"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your username"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between items-center">
                  <div className="flex-1 min-w-[200px]"> {/* Set a minimum width */}
                    {form.formState.errors.root && (
                      <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>
                    )}
                  </div>
                  <Link href="/reset-password">
                    <span className="text-sm text-blue-400 hover:text-blue-500 cursor-pointer">
                      Reset password?
                    </span>
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="bg-[#3A86FF] hover:bg-[#77A4EC]"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </CardWrapper>
      ) : (
        <></>
      )}
    </>
  );
};
