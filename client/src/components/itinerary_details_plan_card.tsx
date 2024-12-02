import React from 'react';
import '../app/globals.css';
import { CalendarDays, Link2, Pencil, CirclePlus, MapPin } from 'lucide-react';
import ItineraryDetailsActivity from './itinerary_details_activity';

interface ItineraryDetailsPlanCardProps {
    dateStart: string;
}

const ItineraryDetailsPlanCard: React.FC<ItineraryDetailsPlanCardProps> = ({ dateStart }) => {
    return (
        <div className="flex flex-col items-start justify-start whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background my-1 px-4 pt-4 w-full">
            <h2 className="regulartext">{dateStart}</h2>
            <ItineraryDetailsActivity />
        </div>
    );
};

export default ItineraryDetailsPlanCard;