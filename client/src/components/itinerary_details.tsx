import React from 'react';
import '../app/globals.css';
import { Button } from '@/components/button';
import { CalendarDays, Link2, Pencil, CirclePlus } from 'lucide-react';
import AvatarCircles from './avatar-circles';
import ItineraryDetailsPlanCard from './itinerary_details_plan_card';

interface ItineraryDetailsProps {
    title: string;
    dateStart: string;
    dateEnd: string;
    collaborators: number;
}

//create a function to get the avatar urls from the backend
const avatarUrls = [ //readjust this once we our backend is working
    'https://avatars.githubusercontent.com/u/98586665',
    'https://avatars.githubusercontent.com/u/20110627',
    'https://avatars.githubusercontent.com/u/106103625',
];

//create a function to get the plans from the backend
const plans = [
    { dateStart: 'Sun, Dec 1' },
    { dateStart: 'Mon, Dec 2' },
    { dateStart: 'Tue, Dec 3' },
];

const ItineraryDetails: React.FC<ItineraryDetailsProps> = ({ title, dateStart, dateEnd, collaborators }) => {
    return (
        <div className="inline-flex flex-col items-start justify-start whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground p-4 w-[100vh] h-[100vh]">
            <div className="flex flex-row items-center space-x-4 mt-6 mb-2">
                <h2 className="tripname_big">{title}</h2>
            </div>

            <div className="flex flex-row items-center space-x-2 mt-3" >
            <CalendarDays className="size-4" strokeWidth={1.5} />
                <p className="smalltext" style={{fontWeight: 600}}>{dateStart}</p>
                <p className="smalltext" style={{fontWeight: 600}}>—</p>
                <p className="smalltext" style={{fontWeight: 600}}>{dateEnd}</p>
            </div>

            <div className="flex flex-row items-center space-x-2 mt-3 ">
            <Link2 className="size-4" strokeWidth={1.5} />
                <p className="smalltext" style={{fontWeight: 600}}>Share</p>
            </div>

            <div className="flex flex-row items-center space-x-2 mt-3 ">
            <Pencil className="size-4" strokeWidth={1.5}/>
                <p className="smalltext" style={{fontWeight: 600}}>Edit Trip Info</p>
            </div>

            <div className="flex flex-row items-center space-x-2 mt-3 ">
                <AvatarCircles numPeople={collaborators} avatarUrls={avatarUrls} />
            </div>
            
            <div className="flex flex-row items-center justify-between w-full mt-3 mb-2"> 
                <p className="regulartext" style={{ fontWeight: '700' }}>Plans</p>
                <div className="flex flex-row items-center space-x-2">
                    <Button variant="ghost" className="smalltext" style={{ fontWeight: '700' }}>
                        <CirclePlus className="mr-1 size-6" strokeWidth={1} />
                        Add a Plan
                    </Button>
                </div>
            </div>

            <div className="flex flex-col px-2 overflow-y-auto">
                {plans.map((plan, index) => (
                    <ItineraryDetailsPlanCard key={index} dateStart={plan.dateStart} />
                ))}
            </div>
        </div>
    );
};

export default ItineraryDetails;