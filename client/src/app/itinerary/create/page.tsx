"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/form";
import { Input } from "@/components/input";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createItinerarySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/popover";
import { Calendar } from "@/components/calendar";
import { CalendarIcon } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface CreateItineraryFormProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

const CreateItineraryForm: React.FC<CreateItineraryFormProps> = ({ children, onSuccess }) => {
  const { data: session } = useSession();

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
    // Post request to server using axios
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
      // Invoke the onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating itinerary:", error);
      // Optionally, handle error (e.g., display error message)
    }
  };

  return (
    <div className="p-8">
      <div className="border-b py-2">
        <h1 className="heading">Create Itinerary</h1>
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
                    <FormItem className="flex-4 min-w-[180px]">
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
                    <FormItem className="flex-4 min-w-[180px]">
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

            {/* Render Children (e.g., Submit Button) */}
            {children}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateItineraryForm;