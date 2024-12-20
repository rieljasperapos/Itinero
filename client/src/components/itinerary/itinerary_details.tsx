import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Link2, Pencil, CirclePlus, Eye } from "lucide-react";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useItineraryDetails } from "@/hooks/useItineraryDetails";
import { ItineraryDetailsProps } from "@/types/itinerary-types";
import ItineraryDetailsPlanCard from "./itinerary_details_plan_card";
import EditItineraryForm from "./EditItineraryForm";
import CreateActivityForm from "@/app/activities/create/page";
import "../../app/globals.css";
import { useSession } from "next-auth/react";

const ItineraryDetails: React.FC<ItineraryDetailsProps> = ({
  itineraryId,
  title,
  dateStart,
  dateEnd,
  collaborators,
  description,
  onItineraryChange,
}) => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const { data: session, status } = useSession();
  
  const {
    activitiesByDate,
    loading,
    loadingRoles,
    isEditor,
    createdBy,
    fetchActivities,
  } = useItineraryDetails(itineraryId, collaborators);

  const formattedDateStart = format(new Date(dateStart), "MMMM d, yyyy");
  const formattedDateEnd = format(new Date(dateEnd), "MMMM d, yyyy");

  const handleDeleteSuccess = () => {
    setOpenEditDialog(false);
    onItineraryChange?.();
  };

  const handleEditSuccess = () => {
    setOpenEditDialog(false);
    onItineraryChange?.();
    fetchActivities();
  };

  return (
    <div className="flex flex-col h-full gap-2.5">
      <div className="flex flex-col gap-2 mb-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4" strokeWidth={1.5} />
        <p className="text-sm">{formattedDateStart}</p>
        <p>—</p>
        <p>{formattedDateEnd}</p>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-foreground">Created by:</span>
        {loadingRoles ? (
          <span className="text-sm font-medium">Loading...</span>
        ) : (
          <span className="text-sm font-medium">{createdBy.name}</span>
        )}
      </div>
      {session?.user.email !== createdBy.email && (
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">Role:</span>
          {loadingRoles ? (
            <span className="text-sm font-medium">Loading...</span>
          ) : (
            <span className="text-sm font-medium">{isEditor ? 'Editor' : 'Viewer'}</span>
          )}
        </div>
      )}
      {!loadingRoles && isEditor && (
        <>
          <Link href={`/collaborators/invite?itineraryId=${itineraryId}`}>
            <div className="flex items-center group">
              <Link2 className="mr-2 size-4" strokeWidth={1.5} />
              <p className="text-sm group-hover:underline">Invite Collaborators</p>
            </div>
          </Link>
          <div
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={() => setOpenEditDialog(true)}
          >
            <Pencil className="size-4" strokeWidth={1.5} />
            <span className="text-sm group-hover:underline">Edit Trip Info</span>
          </div>
        </>
      )}
      <Link href={`/collaborators?itineraryId=${itineraryId}`}>
        <div className="flex flex-row items-center space-x-2 cursor-pointer group">
          <p className="group-hover:underline text-sm">View collaborators</p>
        </div>
      </Link>
      <div className="flex flex-row items-center justify-between w-full mt-6">
        <p className="font-bold text-xl">Activities</p>
        {isEditor && (
          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CirclePlus className="mr-2 size-4" strokeWidth={1.5} />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px]">
              <CreateActivityForm
                itineraryId={itineraryId}
                itineraryDateStart={formattedDateStart}
                itineraryDateEnd={formattedDateEnd}
                onSuccess={() => {
                  fetchActivities();
                  setOpenCreateDialog(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[825px]">
          <VisuallyHidden.Root>
            <DialogTitle>Edit Itinerary</DialogTitle>
            <DialogDescription>
              Make changes to your itinerary.
            </DialogDescription>
          </VisuallyHidden.Root>
          <EditItineraryForm
            itineraryId={itineraryId}
            initialData={{
              title,
              description,
              startDate: new Date(dateStart),
              endDate: new Date(dateEnd),
            }}
            onSuccess={handleEditSuccess}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </DialogContent>
      </Dialog>
      {loading ? (
        <DotLottieReact
          src="https://lottie.host/018376da-dc3a-4de9-b682-5b1606e99a7f/zgc6cY5hCe.lottie"
          loop
          autoplay
        />
      ) : Object.keys(activitiesByDate).length === 0 ? (
        <p className="text-center text-gray-400">No activities found.</p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {Object.keys(activitiesByDate).map((date) => (
            <ItineraryDetailsPlanCard
              key={date}
              date={date}
              activities={activitiesByDate[date]}
              itineraryId={itineraryId}
              refreshActivities={fetchActivities}
              dateStart={dateStart}
              dateEnd={dateEnd}
              isEditor={isEditor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryDetails;
