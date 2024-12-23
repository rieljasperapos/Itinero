"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus, Filter, Calendar, History, PlayCircle, ArrowUpDown } from "lucide-react";
import ItineraryCard from "@/components/itinerary/itinerary_card";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
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

const Dashboard = () => {
  const [filter, setFilter] = useState<"upcoming" | "ongoing" | "past">("ongoing");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");
  const { data: session, status } = useSession();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const fetchItineraries = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );
      setItineraries(response.data.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && session.user && session.user.accessToken) {
      fetchItineraries();
    }
  }, [session]);

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
      <div className="flex flex-col gap-8 p-4">
        <div className="flex items-center flex-wrap justify-between gap-4">
          <Link href="/itinerary/create">
            <Button variant="link" size="tight" className="mediumtext">
              <CirclePlus className="mr-1 size-6" strokeWidth={1} />
              Add Itinerary
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {/* Filter options */}
            <Select value={filter} onValueChange={(value: "upcoming" | "ongoing" | "past") => setFilter(value)}>
              <SelectTrigger className="w-auto sm:w-[140px]">
                <Filter className="mr-2 h-3 w-3" />
                <SelectValue placeholder="Filter trips" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">
                  <div className="flex items-center text-xs sm:text-sm">
                    <PlayCircle className="mr-2 h-3 w-3" />
                    Ongoing
                  </div>
                </SelectItem>
                <SelectItem value="upcoming">
                  <div className="flex items-center text-xs sm:text-sm">
                    <Calendar className="mr-2 h-3 w-3" />
                    Upcoming
                  </div>
                </SelectItem>
                <SelectItem value="past">
                  <div className="flex items-center text-xs sm:text-sm">
                    <History className="mr-2 h-3 w-3" />
                    Past
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {/* Sort options */}
            <Select value={sort} onValueChange={(value: "newest" | "oldest" | "title") => setSort(value)}>
              <SelectTrigger className="w-auto sm:w-[140px]">
                <ArrowUpDown className="mr-2 h-3 w-3" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center text-xs sm:text-sm">
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center text-xs sm:text-sm">
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value="title">
                  <div className="flex items-center text-xs sm:text-sm">
                    Title A-Z
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          {loading ? (
            <DotLottieReact
              className="w-[50%] mx-auto"
              src="https://lottie.host/6025c0eb-2a63-4e6c-8091-85a3cf9f2e93/TxFn9kH1iO.lottie"
              loop
              autoplay
            />
          ) : filteredItineraries.length === 0 ? (
            <p className="text-center text-gray-400">
              No {filter} Itineraries
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary) => (
                <Sheet key={itinerary.id}>
                  <SheetTrigger asChild>
                    <div className="cursor-pointer w-full">
                      <ItineraryCard
                        title={itinerary.title}
                        description={itinerary.description}
                        dateStart={itinerary.startDate}
                        dateEnd={itinerary.endDate}
                        collaborators={itinerary.collaborators.length}
                      />
                    </div>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[100dvw] sm:w-full sm:max-w-[825px] p-0 sm:p-6">
                    <ItineraryDetails
                      itineraryId={itinerary.id}
                      title={itinerary.title}
                      description={itinerary.description}
                      dateStart={itinerary.startDate}
                      dateEnd={itinerary.endDate}
                      collaborators={itinerary.collaborators}
                      onItineraryChange={fetchItineraries}
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
