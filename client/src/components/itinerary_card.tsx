import React from 'react';
import { UsersRound } from 'lucide-react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import '../app/globals.css';

interface ItineraryCardProps {
    title: string;
    dateStart: string;
    dateEnd: string;
    collaborators: number;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ title, dateStart, dateEnd, collaborators }) => {
    // Format the dates
    const formattedDateStart = format(new Date(dateStart), 'MMM. d, yyyy');
    const formattedDateEnd = format(new Date(dateEnd), 'MMM. d, yyyy');

    return (
        <div className="mb-4 inline-flex flex-col items-start justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground p-6 w-[900px] cursor-pointer">
            <div className="flex flex-row items-center space-x-4">
                <h2 className="tripname_small">{title}</h2>
                <div className="flex flex-row items-center space-x-1">
                    <UsersRound className="size-4 regulartext" strokeWidth={2} color="#C0C0C0" />
                    <p className="regulartext">{collaborators}</p>
                </div>
            </div>

            <div className="flex flex-row items-center space-x-2 mt-2">
                <Clock className="size-4" strokeWidth={1.5} color="#C0C0C0" />
                <p className="smalltext">{formattedDateStart}</p>
                <p className="smalltext">—</p>
                <p className="smalltext">{formattedDateEnd}</p>
            </div>
        </div>
    );
};

export default ItineraryCard;