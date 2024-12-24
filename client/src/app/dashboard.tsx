"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus, Filter, Calendar, History, PlayCircle, ArrowUpDown } from "lucide-react";
import ItineraryCard from "@/components/itinerary/itinerary_card";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ItineraryDetails from "@/components/itinerary/itinerary_details";
import { Itinerary } from "@/types/itinerary-types";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Layout from "@/components/sidebar/layout";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"upcoming" | "ongoing" | "past">("ongoing");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { data: itineraries = [], isLoading } = useQuery({
    queryKey: ['itineraries', session?.user?.accessToken],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      return response.data.data;
    },
    enabled: !!session?.user?.accessToken,
  });

  const filterItineraries = (itinerary: Itinerary) => {
    const now = new Date();
    const start = new Date(itinerary.startDate);
    const end = new Date(itinerary.endDate);

    switch (filter) {
      case "upcoming":
        return start > now;
      case "ongoing":
        return start <= now && end >= now;
      case "past":
        return end < now;
      default:
        return true;
    }
  };

  const sortItineraries = (itineraries: Itinerary[]) => {
    return [...itineraries].sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case "oldest":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredItineraries = sortItineraries(itineraries.filter(filterItineraries));

  return (
    <Layout breadcrumb="Dashboard">
      <div className="flex flex-col gap-6 p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Your Trips</h1>
          <p className="text-muted-foreground">
            Manage and organize your travel itineraries
          </p>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Link href="/itinerary/create">
            <Button
              variant="default"
              size="lg"
              className="group hover:shadow-lg transition-all duration-300"
            >
              <CirclePlus className="mr-2 size-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
              Create New Trip
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={(value: "upcoming" | "ongoing" | "past") => setFilter(value)}>
              <SelectTrigger className="w-auto sm:w-[140px] bg-background">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter trips" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">
                  <div className="flex items-center">
                    <PlayCircle className="mr-2 h-4 w-4 text-primary" />
                    Ongoing
                  </div>
                </SelectItem>
                <SelectItem value="upcoming">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    Upcoming
                  </div>
                </SelectItem>
                <SelectItem value="past">
                  <div className="flex items-center">
                    <History className="mr-2 h-4 w-4 text-primary" />
                    Past
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(value: "newest" | "oldest" | "title") => setSort(value)}>
              <SelectTrigger className="w-auto sm:w-[140px] bg-background">
                <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <DotLottieReact
                className="w-40 h-40"
                src="https://lottie.host/6025c0eb-2a63-4e6c-8091-85a3cf9f2e93/TxFn9kH1iO.lottie"
                loop
                autoplay
              />
            </div>
          ) : filteredItineraries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-center bg-card/50 rounded-lg border border-border/50">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium">No {filter} trips found</p>
                <p className="text-sm">Create a new trip to get started</p>
              </div>
              <Link href="/itinerary/create">
                <Button variant="outline" size="lg">
                  <CirclePlus className="mr-2 size-4" strokeWidth={1.5} />
                  Create Trip
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary) => (
                <Sheet key={itinerary.id}>
                  <SheetTrigger asChild>
                    <div className="cursor-pointer w-full transition-transform hover:scale-[1.02] duration-300">
                      <ItineraryCard
                        title={itinerary.title}
                        description={itinerary.description}
                        dateStart={itinerary.startDate}
                        dateEnd={itinerary.endDate}
                        collaborators={itinerary.collaborators.length}
                      />
                    </div>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:max-w-[825px] p-0 sm:p-6 border-l"
                  >
                    <ItineraryDetails
                      itineraryId={itinerary.id}
                      title={itinerary.title}
                      description={itinerary.description}
                      dateStart={itinerary.startDate}
                      dateEnd={itinerary.endDate}
                      collaborators={itinerary.collaborators}
                      onItineraryChange={() => {
                        queryClient.invalidateQueries({ queryKey: ['itineraries'] })
                      }}
                    />
                  </SheetContent>
                </Sheet>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
