import React from 'react';
import { UsersRound, Clock } from 'lucide-react';
import { format } from 'date-fns';
import '../app/globals.css';

interface ItineraryCardProps {
  title: string;
  dateStart: string;
  dateEnd: string;
  collaborators: number;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ title, dateStart, dateEnd, collaborators }) => {
  const formattedDateStart = format(new Date(dateStart), 'MMM d, yyyy');
  const formattedDateEnd = format(new Date(dateEnd), 'MMM d, yyyy');

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow w-[900px]">
      <div className='flex items-center gap-4'>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <div className="flex items-center space-x-2">
          <UsersRound size={16} />
          <span>{collaborators}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 text-gray-600">
        <div className="flex items-center space-x-2">
          <Clock size={16} />
          <span>{formattedDateStart}</span>
          <span>—</span>
          <span>{formattedDateEnd}</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
