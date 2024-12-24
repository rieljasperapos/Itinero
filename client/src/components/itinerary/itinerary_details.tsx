import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Link2, Pencil, CirclePlus, Eye, Users, ChevronDown } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-[100dvh] sm:h-[calc(100vh-2rem)] gap-6 p-4 sm:p-0"
    >
      <div className="space-y-4">
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="flex items-start"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
              {session?.user.email === createdBy.email && !loadingRoles && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:scale-105 transition-transform"
                  onClick={() => setOpenEditDialog(true)}
                >
                  <Pencil className="size-4" strokeWidth={1.5} />
                </Button>
              )}
            </div>
            <Badge variant="outline" className="rounded-md">
              <CalendarDays className="mr-2 size-3.5" strokeWidth={1.5} />
              {formattedDateStart} — {formattedDateEnd}
            </Badge>
          </div>
        </motion.div>
        <div className="space-y-3 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar className="size-7 ring-2 ring-primary/10">
              <AvatarImage src={createdBy.name[0] || undefined} />
              <AvatarFallback>{createdBy.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">{createdBy.name}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {session?.user.email === createdBy.email ? "You" : "Creator"}
              </span>
            </div>
          </div>

          {!loadingRoles && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {isEditor ? "Editor" : "Viewer"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {isEditor
                  ? "You can edit this itinerary"
                  : "You can only view this itinerary"}
              </span>
            </div>
          )}
        </div>
        <Separator className="my-4" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {session?.user.email === createdBy.email ? (
          <Button
            variant="outline"
            className="group hover:border-primary"
            asChild
          >
            <Link href={`/collaborators/invite?itineraryId=${itineraryId}`}>
              <Link2 className="mr-2 size-4 group-hover:rotate-45 transition-transform" strokeWidth={1.5} />
              Invite
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            className="group cursor-not-allowed"
          >
            <Link2 className="mr-2 size-4" strokeWidth={1.5} />
            Invite
          </Button>
        )}
        <Button
          variant="outline"
          className="group hover:border-primary"
          asChild
        >
          <Link href={`/collaborators?itineraryId=${itineraryId}`}>
            <Users className="mr-2 size-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            Collaborators
          </Link>
        </Button>
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">Activities</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  Sort by
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                  Latest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isEditor && (
            <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:scale-105 transition-transform"
                >
                  <CirclePlus className="mr-2 size-4" strokeWidth={1.5} />
                  Add Activity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[825px] w-[100dvw] sm:w-[calc(100vw-2rem)] h-[100dvh] sm:h-[calc(100vh-2rem)]">
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
        <ScrollArea className="flex-1 h-[calc(100dvh-20rem)] sm:h-[calc(100vh-24rem)]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <DotLottieReact
                src="https://lottie.host/018376da-dc3a-4de9-b682-5b1606e99a7f/zgc6cY5hCe.lottie"
                loop
                autoplay
              />
            </div>
          ) : Object.keys(activitiesByDate).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <p className="text-center">No activities planned yet.</p>
            </div>
          ) : (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {Object.keys(activitiesByDate)
                .sort((a, b) => {
                  const comparison = new Date(a).getTime() - new Date(b).getTime();
                  return sortOrder === "asc" ? comparison : -comparison;
                })
                .map((date) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ItineraryDetailsPlanCard
                      date={date}
                      activities={activitiesByDate[date]}
                      itineraryId={itineraryId}
                      refreshActivities={fetchActivities}
                      dateStart={dateStart}
                      dateEnd={dateEnd}
                      isEditor={isEditor}
                    />
                  </motion.div>
                ))}
            </motion.div>
          )}
        </ScrollArea>
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
    </motion.div>
  );
};

export default ItineraryDetails;
