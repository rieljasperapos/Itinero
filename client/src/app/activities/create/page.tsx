"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Form, FormControl, FormField, FormItem } from "@/components/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Calendar } from "@/components/calendar";
import { CalendarIcon } from "lucide-react";
import { createActivitySchema } from "@/schemas";
import { Activity } from "@/types/activity-type";

// Define the schema (ensure this matches your validation requirements)
interface CreateActivityFormProps {
  itineraryId: number;
  itineraryDateStart: string;
  itineraryDateEnd: string;
  activity?: Activity; // Optional activity prop for editing
  onSuccess?: () => void; // Callback after successful submission
}

const CreateActivityForm: React.FC<CreateActivityFormProps> = ({
  itineraryId,
  itineraryDateStart,
  itineraryDateEnd,
  activity,
  onSuccess,
}) => {
  const { data: session } = useSession();

  // Determine if we are in edit mode or create mode
  const isEditMode = Boolean(activity);

  // Initialize form with default values
  const form = useForm<z.infer<typeof createActivitySchema>>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: isEditMode
      ? {
          activityName: activity?.activityName || "",
          locationName: activity?.locationName || "",
          address: activity?.address || "",
          // Initialize date in local timezone
          date: activity ? new Date(activity.startTime) : undefined,
          startTime: activity
            ? format(new Date(activity.startTime), "HH:mm")
            : "",
          endTime: activity ? format(new Date(activity.endTime), "HH:mm") : "",
          itineraryId: activity?.itineraryId || itineraryId,
        }
      : {
          activityName: "",
          locationName: "",
          address: "",
          date: undefined,
          startTime: "",
          endTime: "",
          itineraryId: itineraryId,
        },
  });

  const onSubmit = async (data: z.infer<typeof createActivitySchema>) => {
    if (!session?.user.accessToken) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      if (isEditMode && activity) {
        // Update existing activity
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/activities/${activity.id}`,
          {
            activityName: data.activityName,
            locationName: data.locationName,
            address: data.address,
            date: data.date ? format(data.date, "yyyy-MM-dd") : null,
            startTime: data.startTime,
            endTime: data.endTime,
            itineraryId: data.itineraryId,
          },
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new activity
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/activities/create`,
          {
            activityName: data.activityName,
            locationName: data.locationName,
            address: data.address,
            date: data.date ? format(data.date, "yyyy-MM-dd") : null,
            startTime: data.startTime,
            endTime: data.endTime,
            itineraryId: data.itineraryId,
          },
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Invoke the onSuccess callback
      if (onSuccess) {
        onSuccess();
      }

      // Close the dialog or reset the form as needed
      form.reset();
    } catch (error: any) {
      console.error("Error submitting activity:", error);
    }
  };

  // Handle delete action in edit mode
  const handleDelete = async () => {
    if (!activity || !isEditMode) return;
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/activities/${activity.id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });
      // Invoke the onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* <div className="border-b py-2">
        <h1 className="heading">{isEditMode ? "Edit Activity" : "Create Activity"}</h1>
      </div> */}
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Activity Name Field */}
            <FormField
              control={form.control}
              name="activityName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="tripname_small mt-3">Activity Name</p>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter activity name"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="error">{fieldState.error.message}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Location Name Field */}
            <FormField
              control={form.control}
              name="locationName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="tripname_small mt-3">Location Name</p>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter location name"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="error">{fieldState.error.message}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p className="tripname_small mt-3">Address</p>
                  <FormControl>
                    <Input type="text" placeholder="Enter address" {...field} />
                  </FormControl>
                  {fieldState.error && (
                    <p className="error">{fieldState.error.message}</p>
                  )}
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <FormItem className="flex-1">
                  <p className="tripname_small mt-3">Date</p>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="button mt-2">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="size-4 opacity-50" />
                            {field.value ? (
                              <span>
                                {format(new Date(field.value), "PPP")}
                              </span>
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </div>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            // Normalize the time of both dates to midnight
                            const normalizeToMidnight = (d: Date) => {
                              const normalized = new Date(itineraryDateStart);
                              normalized.setHours(0, 0, 0, 0); // Set time to 00:00:00
                              return normalized;
                            };

                            const today = normalizeToMidnight(new Date()); // Today's date at midnight
                            const minDate = new Date(itineraryDateEnd);

                            return date < today || date > minDate;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {fieldState.error && (
                    <p className="error">{fieldState.error.message}</p>
                  )}
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              {/* Start Time Field */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <p className="tripname_small mt-3">Start Time</p>
                    <FormControl>
                      <Input type="time" placeholder="Start Time" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="error">{fieldState.error.message}</p>
                    )}
                  </FormItem>
                )}
              />

              {/* End Time Field */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <p className="tripname_small mt-3">End Time</p>
                    <FormControl>
                      <Input type="time" placeholder="End Time" {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <p className="error">{fieldState.error.message}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Itinerary ID Field (Hidden) */}
            <FormField
              control={form.control}
              name="itineraryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit">
                {isEditMode ? "Update Activity" : "Create Activity"}
              </Button>
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Activity
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateActivityForm;
