"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import ItineraryCard from "@/components/itinerary/itinerary_card";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CreateItineraryForm from "./itinerary/create/page";
import Layout from "@/components/sidebar/layout";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ItineraryDetails from "@/components/itinerary/itinerary_details";
import { Itinerary } from "@/types/itinerary-type";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<"upcoming" | "ongoing" | "past">(
    "ongoing"
  );
  const { data: session, status } = useSession();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to control dialog
  const [loading, setLoading] = useState<boolean>(true);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
      fetchUser();
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

  const filteredItineraries = itineraries.filter(filterItineraries);

  return (
    <Layout breadcrumb="Dashboard">
      <div className="flex flex-col gap-8 p-4">
        <div className="mediumtext flex gap-2">
          <Button
            variant={`${filter === "ongoing" ? "default" : "outline"}`}
            onClick={() => setFilter("ongoing")}
            className="w-full max-w-[100px]"
          >
            Ongoing
          </Button>
          <Button
            variant={`${filter === "upcoming" ? "default" : "outline"}`}
            onClick={() => setFilter("upcoming")}
            className="w-full max-w-[100px]"
          >
            Upcoming
          </Button>
          <Button
            variant={`${filter === "past" ? "default" : "outline"}`}
            onClick={() => setFilter("past")}
            className="w-full max-w-[100px]"
          >
            Past
          </Button>
        </div>

        {/* Add Itinerary Dialog */}
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="link" size="tight" className="mediumtext">
                <CirclePlus className="mr-1 size-6" strokeWidth={1} />
                Add Itinerary
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
              {/* Don't touch this */}
              <VisuallyHidden.Root>
                <DialogDescription />
                <DialogTitle />
              </VisuallyHidden.Root>

              {/* Form Popup */}
              <CreateItineraryForm
                onSuccess={() => {
                  fetchItineraries(); // Refresh itineraries list
                  setIsDialogOpen(false); // Close the dialog
                }}
              >
                <DialogFooter>
                  <div className="mt-4">
                    <Button type="submit">Create Itinerary</Button>
                  </div>
                </DialogFooter>
              </CreateItineraryForm>
            </DialogContent>
          </Dialog>
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
            <>
              {filteredItineraries.map((itinerary) => (
                <Sheet key={itinerary.id}>
                  <SheetTrigger asChild>
                    <div>
                      <ItineraryCard
                        title={itinerary.title}
                        dateStart={itinerary.startDate}
                        dateEnd={itinerary.endDate}
                        collaborators={itinerary.collaborators.length}
                      />
                    </div>
                  </SheetTrigger>
                  <SheetContent side="right">
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
