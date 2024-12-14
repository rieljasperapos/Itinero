"use client";
import React, { useEffect, useState } from 'react';
import { Timeline, TimelineContent, TimelineDot, TimelineHeading, TimelineItem, TimelineLine } from './timeline';
import { Button } from '@/components/button';
import { Pencil } from 'lucide-react';
import CreateActivityForm from '@/app/activities/create/page';
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog';
import { Activity } from '@/types/activity-type';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Collaborator } from '@/types/collaborator-type';

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
  
        console.log("User is editor: ", userIsEditor);
        setIsEditor(userIsEditor); // Set the boolean state
      }
    } else {
      setIsEditor(false); // Reset if no user session
    }
  }, [session, collaboratorsByItinerary, createdBy]);

  return (
    <div className="inline-flex flex-col items-start justify-start whitespace-nowrap text-sm font-medium bg-background px-4 pt-4 w-full">
      <Timeline>
        {activities.map((activity, index) => {
          const status = getActivityStatus(activity.startTime, activity.endTime);
          const isLastActivity = index === activities.length - 1;

          return (
            <TimelineItem key={activity.id}>
              <TimelineHeading className='regulartext'>{activity.locationName}</TimelineHeading>

              <TimelineDot status={status === 'current' ? 'current' : status === 'done' ? 'done' : 'default'} />

              {isLastActivity ? (
                <TimelineLine className="bg-transparent" />
              ) : (
                <TimelineLine className={status === 'done' ? 'bg-primary done' : 'bg-muted'} />
              )}


              <TimelineContent>
                <div className="flex flex-row space-x-4 items-center justify-between w-full">

                  {/* Activity Address */}
                  <div className="flex-1 min-w-[150px] max-w-[250px] px-2 smalltext">
                    <p className="text-left">{activity.address}</p>
                  </div>

                  {/* Activity Start and End Time */}
                  <div className="flex-1 min-w-[100px] max-w-[150px] px-2 smalltext">
                    <p className="text-center">
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
                  <div className="flex-1 min-w-[150px] max-w-[250px] px-2 smalltext">
                    <p className="text-left">{activity.activityName}</p>
                  </div>

                  {/* Edit Activity Button */}
                  <div className="flex-1 min-w-[100px] max-w-[150px] px-2 text-center smalltext">
                    <Dialog
                      open={openActivityId === activity.id}
                      onOpenChange={(open) => setOpenActivityId(open ? activity.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`font-bold ${!isEditor ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!isEditor}
                        >
                          <Pencil className="mr-1 size-4" strokeWidth={2} />
                          Edit Activity
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