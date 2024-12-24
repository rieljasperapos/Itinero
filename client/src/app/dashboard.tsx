"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Layout from "@/components/sidebar/layout";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { ItineraryGrid } from "@/components/dashboard/ItineraryGrid";
import {
  FilterType,
  SortType,
  filterItineraries,
  sortItineraries,
} from "@/lib/itinerary/filters";
import { Itinerary } from "@/types/itinerary-types";

const Dashboard = () => {
  const [filter, setFilter] = useState<FilterType>("ongoing");
  const [sort, setSort] = useState<SortType>("newest");
  const { data: session } = useSession();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { data: itineraries = [], isLoading } = useQuery({
    queryKey: ["itineraries", session?.user?.accessToken],
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

  const filteredItineraries = sortItineraries(
    itineraries.filter((item: Itinerary) => filterItineraries(item, filter)),
    sort
  );

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

        <DashboardActions
          filter={filter}
          sort={sort}
          onFilterChange={setFilter}
          onSortChange={setSort}
        />

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
            <ItineraryGrid itineraries={filteredItineraries} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
