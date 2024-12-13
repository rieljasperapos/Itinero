"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/form";
import { Input } from "@/components/input";
import { Calendar } from "@/components/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/popover";
import { Button } from "@/components/button";
import { CalendarIcon, Trash2 } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createItinerarySchema } from "@/schemas";
import { format } from "date-fns";

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

  const form = useForm<z.infer<typeof createItinerarySchema>>({
    resolver: zodResolver(createItinerarySchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: z.infer<typeof createItinerarySchema>) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const response = await axios.put(
        `${apiBaseUrl}/itineraries/${itineraryId}`,
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
      console.log("Itinerary updated:", response.data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error updating itinerary:", error);
    }
  };

  // Handler for deleting the itinerary
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (confirmDelete) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        await axios.delete(`${apiBaseUrl}/itineraries/${itineraryId}`, {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        });
        console.log("Itinerary deleted");
        if (onDeleteSuccess) {
          onDeleteSuccess(); // Callback after successful deletion
        }
      } catch (error) {
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
                                <span className="tripname_small">Start Date</span>
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
                            disabled={(date) => date < new Date("1900-01-01")}
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
                            disabled={(date) => date < new Date("1900-01-01")}
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
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditItineraryForm;