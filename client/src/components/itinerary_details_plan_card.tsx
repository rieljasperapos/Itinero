import React from 'react';
import ItineraryDetailsActivity from './itinerary_details_activity';
import { Activity } from '@/types/activity-type';

interface ItineraryDetailsPlanCardProps {
    date: string;
    activities: Activity[];
    itineraryId: number;
    refreshActivities: () => void;
    collaborators: number;
    isEditor: boolean;
    dateStart: string;
    dateEnd: string;
  }

  const ItineraryDetailsPlanCard: React.FC<ItineraryDetailsPlanCardProps> = ({ date, activities, itineraryId, refreshActivities, collaborators, isEditor, dateStart, dateEnd }) => {
    const parsedDate = new Date(date);
    const formattedDate = new Date(parsedDate).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });  
    return (
      <div className="flex flex-col items-start justify-start whitespace-nowrap text-sm font-medium border border-input bg-background my-1 px-4 pt-4 w-full">
        <h2 className="tripname_small">{formattedDate}</h2>
        <ItineraryDetailsActivity
            activities={activities}
            itineraryId={itineraryId}
            refreshActivities={refreshActivities}
            collaborators={collaborators}
            isEditor={isEditor}
            dateStart={dateStart}
            dateEnd={dateEnd}
        />
      </div>
    );
  };
  
  export default ItineraryDetailsPlanCard;