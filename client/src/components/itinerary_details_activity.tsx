"use client";
import React, { useEffect, useState } from 'react';
import { Timeline, TimelineContent, TimelineDot, TimelineHeading, TimelineItem, TimelineLine } from './timeline';
import { Button } from '@/components/button';
import { Pencil, MapPin, Clock, Footprints } from 'lucide-react';
import CreateActivityForm from '@/app/activities/create/page';
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog';
import { Activity } from '@/types/activity-type';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Collaborator } from '@/types/collaborator-type';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip"

interface ItineraryDetailsActivityProps {
  activities: Activity[];
  itineraryId: number;
  refreshActivities: () => void;
  collaborators: Collaborator[];
  dateStart: string;
  dateEnd: string;
}

const ItineraryDetailsActivity: React.FC<ItineraryDetailsActivityProps> = ({ activities, itineraryId, refreshActivities, collaborators, dateStart, dateEnd }) => {
  const [openActivityId, setOpenActivityId] = useState<number | null>(null);
  const [collaboratorsByItinerary, setCollaboratorsByItinerary] = useState<any[]>(collaborators);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [createdBy, setCreatedBy] = useState<any>("");
  const { data: session, status } = useSession();
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const router = useRouter();

  const getActivityStatus = (startTime: string, endTime: string): 'current' | 'done' | 'default' => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) {
      return 'current';
    } else if (now > end) {
      return 'done';
    } else {
      return 'default';
    }
  };

  useEffect(() => {
    const fetchItinerarieById = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/itineraries/${itineraryId}`)

        setCollaboratorsByItinerary(response.data.data.collaborators);
        setCreatedBy(response.data.data.createdBy.email);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    }

    fetchItinerarieById();
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.email) {
      // Check if the user is the creator
      const userIsCreator = createdBy === session.user.email;

      if (userIsCreator) {
        setIsEditor(true); // Automatically set as editor
      } else {
        // Check if the user is an editor among collaborators
        const userIsEditor = collaboratorsByItinerary.some(
          (collaborator) =>
            collaborator.user.email === session.user.email && collaborator.role === 'EDITOR'
        );
        setIsEditor(userIsEditor); // Set the boolean state
      }
    } else {
      setIsEditor(false); // Reset if no user session
    }
  }, [session, collaboratorsByItinerary, createdBy]);

  const handleMapClick = (address: string) => async () => {
    const prepareAddressForGeocoder = (addr: string) => {
      return encodeURIComponent(addr.replace(/\s+/g, '+'));
    };

    const preparedAddress = prepareAddressForGeocoder(address);

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${preparedAddress}&key=${process.env.NEXT_PUBLIC_OPEN_CAGE_KEY}`
      );

      if (response.data.results && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;

        // Redirect to the map page with query parameters
        router.push(`/map?Lat=${lat}&Lng=${lng}`);
      } else {
        console.error('No results found for the given address.');
      }
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  };

  return (
    <div className="w-full">
      <Timeline>
        {activities.map((activity, index) => {
          const status = getActivityStatus(activity.startTime, activity.endTime);
          const isLastActivity = index === activities.length - 1;

          return (
            <TimelineItem key={activity.id} className="group">
              <TimelineHeading className='regulartext'>{activity.locationName}</TimelineHeading>

              <TimelineDot status={status === 'current' ? 'current' : status === 'done' ? 'done' : 'default'} />

              {isLastActivity ? (
                <TimelineLine className="bg-transparent" />
              ) : (
                <TimelineLine className={status === 'done' ? 'bg-primary done' : 'bg-muted'} />
              )}


              <TimelineContent className="flex w-full">
                <div className="flex items-center justify-between w-full gap-4">

                  {/* Activity Address */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[150px] group cursor-pointer" onClick={handleMapClick(activity.address)}>
                          <MapPin className="w-4 flex-shrink-0 text-gray-500 group-hover:animate-bounce group-hover:text-red-500 group-hover:font-bold" />
                          <p className="truncate text-sm group-hover:underline">{activity.address}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View on map</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Activity Start and End Time */}
                  <div className="flex-1 min-w-[100px] max-w-[250px] text-center flex items-center gap-2">
                    <Clock className="w-4 flex-shrink-0 text-gray-500" />
                    <p className="text-sm">
                      {new Date(activity.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      <span> - </span>
                      {new Date(activity.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Activity Name */}
                  <div className="flex-1 min-w-[150px] max-w-[250px] flex items-center gap-2">
                    <Footprints className="w-4 flex-shrink-0 text-gray-500" />
                    <p className="font-bold truncate">{activity.activityName}</p>
                  </div>

                  {/* Edit Activity Button */}
                  <div className="flex-shrink-0">
                    <Dialog
                      open={openActivityId === activity.id}
                      onOpenChange={(open) => setOpenActivityId(open ? activity.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`font-bold transition-colors ${!isEditor ? 'opacity-20 cursor-not-allowed invisible' : ''
                            }`}
                          disabled={!isEditor}
                        >
                          <Pencil className="mr-1 size-4" strokeWidth={2} />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[825px]">
                        <CreateActivityForm
                          itineraryId={itineraryId}
                          itineraryDateStart={dateStart}
                          itineraryDateEnd={dateEnd}
                          activity={activity}
                          onSuccess={() => {
                            refreshActivities(); // Refresh activities list
                            setOpenActivityId(null); // Close the dialog
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                </div>
              </TimelineContent>

            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
};

export default ItineraryDetailsActivity;