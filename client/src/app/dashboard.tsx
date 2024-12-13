import React, { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { CirclePlus } from "lucide-react";
import ItineraryCard from "@/components/itinerary_card";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import CreateItineraryForm from "./itinerary/create/page";
import Layout from "@/components/layout";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import ItineraryDetails from "@/components/itinerary_details";

const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState<"upcoming" | "ongoing" | "past">(
    "ongoing"
  ); // New state for filter
  const { data: session, status } = useSession();
  const [isEditor, setIsEditor] = useState(false);

  interface Itinerary {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    collaborators: any[];
  }

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to control dialog

  // console.log({ session });
  // console.log("session access token ", session?.user.accessToken);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const fetchUser = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axios.get(`${apiBaseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchItineraries = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // console.log("session access token ::: ", session?.user.accessToken);
      const response = await axios.get(`${apiBaseUrl}/itineraries`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });
      // console.log("CHECK RESPONSE: ", response.data.data);
      // Set the fetched itineraries to the state
      setItineraries(response.data.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  useEffect(() => {
    if (session && session.user && session.user.accessToken) {
      fetchUser();
      fetchItineraries();
      console.log("where ", { itineraries });
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

  useEffect(() => {
    if (session?.user?.email && itineraries.length > 0) {
      const editorCheck = itineraries.some((itinerary) =>
        itinerary.collaborators.some(
          (collaborator) => collaborator.user.email === session.user.email
        )
      );
      setIsEditor(editorCheck);
    }
  }, [session, itineraries]);

  const filteredItineraries = itineraries.filter(filterItineraries);
  console.log("filtered itineraries: ", filteredItineraries);

  return (
    <Layout breadcrumb="Dashboard">
      <div className="flex flex-col gap-8 p-4">
        <div className="mediumtext flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFilter("ongoing")}
            className={filter === "ongoing" ? "bg-primary text-white" : "ml-2"}
          >
            Ongoing
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilter("upcoming")}
            className={filter === "upcoming" ? "bg-primary text-white" : ""}
          >
            Upcoming
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilter("past")}
            className={filter === "past" ? "bg-primary text-white" : ""}
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
          {filteredItineraries.length === 0 ? (
            <>
              <p className="text-center text-gray-400">No {filter} Itineraries</p>
            </>
          
          ): (
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
                      collaborators={itinerary.collaborators.length}
                      onItineraryChange={fetchItineraries}
                      isEditor={isEditor}
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
