"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { CalendarIcon, Plane } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Layout from "@/components/sidebar/layout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ny } from "@/lib/utils";
import { motion } from "framer-motion";

const CreateItineraryForm = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

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
          title: data.title.trim(),
          description: data.description?.trim(),
          startDate: data.startDate,
          endDate: data.endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );

      if (response.data.data) {
        toast({
          title: "Success",
          description: "Itinerary created successfully",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Error creating itinerary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to create itinerary",
      });
    }
  };

  return status === "loading" ? (
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
      <div className="min-h-[calc(100vh-5rem)] p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Create Itinerary</h1>
            <p className="text-muted-foreground">
              Plan your next adventure with ease. Fill in the details below to get started.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a memorable title for your trip"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your journey"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={ny(
                                  "h-11 w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-3 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const normalizeToMidnight = (d: Date) => {
                                  const normalized = new Date(d);
                                  normalized.setHours(0, 0, 0, 0);
                                  return normalized;
                                };
                                const today = normalizeToMidnight(new Date());
                                const minDate = new Date("1900-01-01");
                                return date < today || date < minDate;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={ny(
                                  "h-11 w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-3 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : "Select date"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const normalizeToMidnight = (d: Date) => {
                                  const normalized = new Date(d);
                                  normalized.setHours(0, 0, 0, 0);
                                  return normalized;
                                };
                                const today = normalizeToMidnight(new Date());
                                const minDate = new Date("1900-01-01");
                                return date < today || date < minDate;
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full h-11">
                  <Plane className="mr-2 h-4 w-4" />
                  Create Itinerary
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CreateItineraryForm;