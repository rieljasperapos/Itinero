import React from 'react';
import '../app/globals.css';
import { Timeline, TimelineContent, TimelineDot, TimelineHeading, TimelineItem, TimelineLine } from './timeline';
import { Button } from '@/components/button';
import { Pencil } from 'lucide-react';

interface ItineraryDetailsActivityProps {
    activitityName: string;
    activityLocation: string;
    timeStart: string;
    timeEnd: string;
    Note: string;
    activityStatus: boolean;
}

const activities = [
    {
        activitityName: "Sample Activity 1",
        activityLocation: "Sample Location 1",
        timeStart: "10:00 AM",
        timeEnd: "11:00 AM",
        Note: "Sample Note 1",
        activityStatus: true,
    },
    {
        activitityName: "Sample Activity 2",
        activityLocation: "Sample Location 2",
        timeStart: "12:00 PM",
        timeEnd: "1:00 PM",
        Note: "Sample Note 2",
        activityStatus: true,
    },
    {
        activitityName: "Sample Activity 3",
        activityLocation: "Sample Location 3",
        timeStart: "2:00 PM",
        timeEnd: "3:00 PM",
        Note: "2323232231231 31323231232133",
        activityStatus: false,
    },
];

const ItineraryDetailsActivity: React.FC = () => {
    return (
        <div className="inline-flex flex-col items-start justify-start whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-5 bg-background px-4 pt-4 w-full">
            <Timeline>
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center regulartext">
                        <TimelineItem status={activity.activityStatus ? "done" : "default"}>
                            <TimelineHeading>{activity.activitityName}</TimelineHeading>
                            <TimelineDot status={activity.activityStatus ? "done" : "default"} />
                            {index < activities.length - 1 ? (
                                <TimelineLine done={activity.activityStatus} className={activity.activityStatus ? "bg-primary" : "bg-muted"} />
                            ) : (
                                <TimelineLine done={activity.activityStatus} className="bg-transparent" />
                            )}
                            <TimelineContent>
                                <div className="flex flex-row space-x-8 items-center justify-center regulartext">
                                    <p className="span-1">{activity.activityLocation}</p>
                                    <div className="flex flex-col">
                                        <p>{activity.timeStart} -</p>
                                        <p>{activity.timeEnd}</p>
                                    </div>
                                    <p>{activity.Note}</p>
                                    <Button variant="ghost" style={{ fontWeight: '700' }}>
                                        <Pencil className="mr-1 size-4" strokeWidth={2} />
                                        Edit Activity
                                    </Button>
                                </div>
                            </TimelineContent>
                        </TimelineItem>
                    </div>
                ))}
            </Timeline>
        </div>
    );
};

export default ItineraryDetailsActivity;