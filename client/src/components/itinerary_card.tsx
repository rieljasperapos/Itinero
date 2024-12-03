import React from 'react';
import { UsersRound } from 'lucide-react';
import { Clock } from 'lucide-react';
import '../app/globals.css';

interface ItineraryCardProps {
    title: string;
    dateStart: string;
    dateEnd: string;
    numPeople: number;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ title, dateStart, dateEnd, numPeople }) => {
    return (
        <div className="inline-flex flex-col items-start justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground p-4 w-[800px]">
            <div className="flex flex-row items-center space-x-4">
                <h2 className="tripname">{title}</h2>
                <div className="flex flex-row items-center space-x-1">
                    <UsersRound className="size-4 regulartext" strokeWidth={2}  color="#C0C0C0"/>
                    <p className="text-sm">{numPeople}</p>
                </div>
            </div>

            <div className="flex flex-row items-center space-x-2 mt-2 " style={{ color: '#C0C0C0' }}>
                <Clock className="size-4" strokeWidth={1.5} color="#C0C0C0"/>
                <p className="text-xs smalltext" >{dateStart} —</p>
                <p className="text-xs smalltext" >{dateEnd}</p>
            </div>
        </div>
    );
};

export default ItineraryCard;