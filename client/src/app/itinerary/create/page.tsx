"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createItinerarySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Layout from "@/components/sidebar/layout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const CreateItineraryForm = () => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  const form = useForm<z.infer<typeof createItinerarySchema>>({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof createItinerarySchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries/create`,
        {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error creating itinerary:", error);
    }
  };

  return (
    status === "loading" ? (
      <div className="flex justify-center items-center h-screen">
        <DotLottieReact
          className="w-[50%]"
          src="https://lottie.host/aa2eba8e-913d-420f-b307-890f5a41365f/EaQL3x2VpA.lottie"
          loop
          autoplay
        />
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <Layout breadcrumb="Create Itinerary">
        <div className="p-4 grid lg:grid-cols-2 gap-8">
          <div className="space-y-8 max-w-2xl">
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl font-bold">Create Itinerary</h1>
              <p className="text-muted-foreground">Plan your next adventure with ease</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter a memorable title for your trip"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Description</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Brief description of your journey"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    {/* Start Date Field */}
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <button type="button" className="w-full h-11 px-4 flex items-center justify-between border rounded-md bg-background hover:bg-accent transition-colors">
                                  <span className="text-muted-foreground">
                                    {field.value ? format(field.value, "PPP") : "Select date"}
                                  </span>
                                  <CalendarIcon className="h-4 w-4 opacity-50" />
                                </button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  // Normalize the time of both dates to midnight
                                  const normalizeToMidnight = (d: Date) => {
                                    const normalized = new Date(d);
                                    normalized.setHours(0, 0, 0, 0); // Set time to 00:00:00
                                    return normalized;
                                  };
    
                                  const today = normalizeToMidnight(new Date()); // Today's date at midnight
                                  const minDate = new Date("1900-01-01");
    
                                  return date < today || date < minDate;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    {/* End Date Field - Similar structure to Start Date */}
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <button type="button" className="w-full h-11 px-4 flex items-center justify-between border rounded-md bg-background hover:bg-accent transition-colors">
                                  <span className="text-muted-foreground">
                                    {field.value ? format(field.value, "PPP") : "Select date"}
                                  </span>
                                  <CalendarIcon className="h-4 w-4 opacity-50" />
                                </button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  // Normalize the time of both dates to midnight
                                  const normalizeToMidnight = (d: Date) => {
                                    const normalized = new Date(d);
                                    normalized.setHours(0, 0, 0, 0); // Set time to 00:00:00
                                    return normalized;
                                  };
    
                                  const today = normalizeToMidnight(new Date()); // Today's date at midnight
                                  const minDate = new Date("1900-01-01");
    
                                  return date < today || date < minDate;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 text-base">
                  Create Itinerary
                </Button>
              </form>
            </Form>
          </div>
          <div className="hidden lg:block">
            <DotLottieReact
              src="https://lottie.host/9746e61a-4fd1-4dfd-8269-2c832012f2c8/ZDaqdpoqao.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </Layout>
    )
  );
};

export default CreateItineraryForm;