import React, { useEffect, useState } from 'react';
import '../app/globals.css';
import { Button } from '@/components/button';
import { CalendarDays, Link2, Pencil, CirclePlus, Trash2 } from 'lucide-react';
import AvatarCircles from './avatar-circles';
import ItineraryDetailsPlanCard from './itinerary_details_plan_card';
import EditItineraryForm from "@/components/EditItineraryForm";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import axios from 'axios';
import CreateActivityForm from '@/app/activities/create/page';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog';
import { Activity } from '@/types/activity-type';
import Link from 'next/link';

interface ItineraryDetailsProps {
  itineraryId: number;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  collaborators: number;
  onItineraryChange?: () => void; // New prop for dynamic refresh
  isEditor: boolean;
}

const avatarUrls = [ // Readjust this once your backend is working
  'https://avatars.githubusercontent.com/u/98586665',
  'https://avatars.githubusercontent.com/u/20110627',
  'https://avatars.githubusercontent.com/u/106103625',
];

const ItineraryDetails: React.FC<ItineraryDetailsProps> = ({
  itineraryId,
  title,
  dateStart,
  dateEnd,
  collaborators,
  description,
  onItineraryChange, // Receive the new prop
  isEditor,
}) => {
  const formattedDateStart = format(new Date(dateStart), 'MMMM d, yyyy');
  const formattedDateEnd = format(new Date(dateEnd), 'MMMM d, yyyy');
  const { data: session } = useSession();
  const [activitiesByDate, setActivitiesByDate] = useState<{ [date: string]: Activity[] }>({});
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/activities`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        params: { itineraryId },
      });
      const activities: Activity[] = response.data.data;
      // Group activities by date
      const groupedActivities = activities.reduce((group: { [date: string]: Activity[] }, activity: Activity) => {
        const localDate = new Date(activity.startTime).toLocaleDateString('en-CA'); // Formats to 'YYYY-MM-DD' in local timezone
        if (!group[localDate]) {
          group[localDate] = [];
        }
        group[localDate].push(activity);
        return group;
      }, {});

      setActivitiesByDate(groupedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  // Use fetchActivities in useEffect
  useEffect(() => {
    if (session && itineraryId) {
      fetchActivities();
    }
  }, [itineraryId, session]);

  const handleDeleteSuccess = () => {
    setOpenEditDialog(false); // Close the edit dialog
    if (onItineraryChange) {
      onItineraryChange(); // Notify parent to refresh itineraries
    }
    // Optionally, you can add more actions like redirecting to dashboard
  };

  const handleEditSuccess = () => {
    setOpenEditDialog(false); // Close the edit dialog
    if (onItineraryChange) {
      onItineraryChange(); // Notify parent to refresh itineraries
    }
    // Optionally, refresh activities or other related data
    fetchActivities();
  };

  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex flex-row items-center space-x-4">
        <h2 className="tripname_big">{title}</h2>
      </div>

      <div className="flex flex-row items-center space-x-2">
        <p className="regulartext" style={{ fontWeight: 600 }}>{description}</p>
      </div>

      <div className="flex flex-row items-center space-x-2 mt-2">
        <CalendarDays className="size-4" strokeWidth={1.5} />
        <p className="smalltext" style={{ fontWeight: 600 }}>{formattedDateStart}</p>
        <p className="smalltext" style={{ fontWeight: 600 }}>—</p>
        <p className="smalltext" style={{ fontWeight: 600 }}>{formattedDateEnd}</p>
      </div>

      <div className="flex flex-row items-center space-x-2 mt-2">
        <Link href={`/collaborators/invite?itineraryId=${itineraryId}`}>
          <Button variant="link" size='tight' className="regulartext" style={{ fontWeight: '600' }}>
            <Link2 className="mr-2 size-4" strokeWidth={1.5} />
            Invite Collaborators
          </Button>
        </Link>
      </div>

      <div className="flex flex-row items-center space-x-2 mt-2">
        <Button
          variant="link"
          size="tight"
          className="regulartext"
          style={{ fontWeight: '600' }}
          onClick={() => setOpenEditDialog(true)}
        >
          <Pencil className="mr-2 size-4" strokeWidth={1.5} />
          Edit Trip Info
        </Button>
      </div>

      {/* Edit Itinerary Dialog */}
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
            onSuccess={handleEditSuccess} // Handle edit success
            onDeleteSuccess={handleDeleteSuccess} // Handle delete success
          />
        </DialogContent>
      </Dialog>

      {/* MODIFY THIS */}
      <Link href="/collaborators">
        <div className="flex flex-row items-center space-x-2 mt-3 cursor-pointer group">
          <AvatarCircles numPeople={collaborators} avatarUrls={avatarUrls} />
          <p className='group-hover:underline'>Collaborators</p>
        </div>
      </Link>

      <div className="flex flex-row items-center justify-between w-full mt-3 mb-2">
        <p className="font-bold text-xl">Activities</p>
        <div className="flex flex-row items-center space-x-2">
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
                  fetchActivities(); // Refresh activities list
                  setOpenCreateDialog(false); // Close the dialog
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.keys(activitiesByDate).map((date) => (
          <ItineraryDetailsPlanCard
            key={date}
            date={date}
            activities={activitiesByDate[date]}
            itineraryId={itineraryId}
            refreshActivities={fetchActivities}
            collaborators={collaborators}
            isEditor={isEditor}
            dateStart={dateStart}
            dateEnd={dateEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default ItineraryDetails;