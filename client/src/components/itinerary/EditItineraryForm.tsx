"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trash2 } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createItinerarySchema } from "@/schemas";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface EditItineraryFormProps {
  itineraryId: number;
  initialData: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
  };
  onSuccess?: () => void;
  onDeleteSuccess?: () => void; // New prop for delete success callback
}

const EditItineraryForm: React.FC<EditItineraryFormProps> = ({
  itineraryId,
  initialData,
  onSuccess,
  onDeleteSuccess, // Receive the new prop
}) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createItinerarySchema>>({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: z.infer<typeof createItinerarySchema>) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries/${itineraryId}`,
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
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      if (!error.response.data.success) {
        toast({
          variant: "destructive",
          title: "You are not the owner!",
          description: error.response.data.message,
        });
      }
      console.error("Error updating itinerary:", error);
    }
  };

  // Handler for deleting the itinerary
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries/${itineraryId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.accessToken}`,
            },
          }
        );
        if (onDeleteSuccess) {
          onDeleteSuccess(); // Callback after successful deletion
        }
      } catch (error: any) {
        if (!error.response.data.success) {
          toast({
            variant: "destructive",
            title: "Uh oh!",
            description: error.response.data.message,
          })
        }
        console.error("Error deleting itinerary:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="border-b py-2">
        <h1 className="heading">Make Changes</h1>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Form Fields */}
            <div>
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <p className="tripname_small mt-3"> Title </p>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your title"
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
                    <p className="tripname_small mt-3"> Description </p>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                {/* Start Date Field */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[180px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button type="button" className="button">
                              <div className="flex items-center mt-4 space-x-2">
                                <span className="tripname_small">
                                  Start Date
                                </span>
                                <CalendarIcon className="size-4 opacity-50 self-center" />
                              </div>
                              {field.value ? (
                                <span>{format(field.value, "PPP")}</span>
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                {/* End Date Field */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[180px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button type="button" className="button">
                              <div className="flex items-center mt-4 space-x-2">
                                <span className="tripname_small">End Date</span>
                                <CalendarIcon className="size-4 opacity-50 self-center" />
                              </div>
                              {field.value ? (
                                <span>{format(field.value, "PPP")}</span>
                              ) : (
                                <span>Pick a date</span>
                              )}
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
            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
                Delete Itinerary
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditItineraryForm;
