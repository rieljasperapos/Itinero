import React from 'react';
import { UsersRound, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import '../../app/globals.css';

interface ItineraryCardProps {
    title: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    collaborators: number;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ title, description, dateStart, dateEnd, collaborators }) => {
    const formattedDateStart = format(new Date(dateStart), 'MMM. d, yyyy');
    const formattedDateEnd = format(new Date(dateEnd), 'MMM. d, yyyy');

    return (
        <Card className="hover:shadow-lg transition-all duration-300 h-full group">
            <div className="relative w-full h-40 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828"
                    alt="Travel"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-semibold line-clamp-1">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-3">
                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                        {description}
                    </CardDescription>
                    <div className="flex items-center space-x-2">
                        <Clock className="size-4" strokeWidth={1.5} color="#6b7280" />
                        <div className="flex items-center text-sm text-muted-foreground">
                            <span>{formattedDateStart}</span>
                            <span className="mx-2">→</span>
                            <span>{formattedDateEnd}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UsersRound className="size-4" strokeWidth={1.5} color="#6b7280" />
                        <span className="text-sm text-muted-foreground">
                            {collaborators} {collaborators === 1 ? 'collaborator' : 'collaborators'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ItineraryCard;