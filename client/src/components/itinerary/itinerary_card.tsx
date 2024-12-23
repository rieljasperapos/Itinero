import React from 'react';
import { UsersRound, Clock, MapPin, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ny } from '@/lib/utils';
import '../../app/globals.css';
import Image from 'next/image';

interface ItineraryCardProps {
    title: string;
    description: string;
    dateStart: string;
    dateEnd: string;
    collaborators: number;
    className?: string;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ 
    title, 
    description, 
    dateStart, 
    dateEnd, 
    collaborators,
    className 
}) => {
    const formattedDateStart = format(new Date(dateStart), 'MMM d, yyyy');
    const formattedDateEnd = format(new Date(dateEnd), 'MMM d, yyyy');
    const durationDays = differenceInDays(new Date(dateEnd), new Date(dateStart)) + 1;
    
    // Determine if the trip is upcoming, ongoing, or past
    const now = new Date();
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);
    
    const status = now < startDate 
        ? 'upcoming'
        : now > endDate 
            ? 'past' 
            : 'ongoing';

    const statusColors = {
        upcoming: 'bg-blue-500/10 text-blue-500',
        ongoing: 'bg-green-500/10 text-green-500',
        past: 'bg-gray-500/10 text-gray-500'
    };

    const statusText = {
        upcoming: 'Upcoming',
        ongoing: 'Ongoing',
        past: 'Past'
    };

    // Random travel images for variety (in production, these would come from your API)
    const travelImages = [
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1',
        'https://images.unsplash.com/photo-1503220317375-aaad61436b1b'
    ];

    const randomImage = travelImages[Math.floor(Math.random() * travelImages.length)];

    return (
        <Card className={ny(
            "overflow-hidden hover:shadow-lg transition-all duration-300 h-full group relative w-auto sm:w-[350px]",
            className
        )}>
            {/* Image Section */}
            <div className="relative w-full h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <Image
                    src={randomImage}
                    alt="Travel destination"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={500}
                    height={300}
                    priority={false}
                    quality={75}
                    style={{ objectFit: 'cover' }}
                />
                {/* Status Badge */}
                <Badge 
                    className={ny(
                        "absolute top-4 right-4 z-20",
                        statusColors[status]
                    )}
                    variant="secondary"
                >
                    {statusText[status]}
                </Badge>
            </div>

            <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col space-y-4">
                    {/* Date Range */}
                    <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <Calendar className="size-4 mt-0.5" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span>{formattedDateStart}</span>
                                <span>→</span>
                                <span>{formattedDateEnd}</span>
                            </div>
                            <span className="text-xs text-muted-foreground/75">
                                {durationDays} {durationDays === 1 ? 'day' : 'days'}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border" />

                    {/* Footer Info */}
                    <div className="flex items-center justify-between">
                        {/* Collaborators */}
                        <div className="flex items-center space-x-2">
                            <UsersRound className="size-4" strokeWidth={1.5} />
                            <span className="text-sm text-muted-foreground">
                                {collaborators} {collaborators === 1 ? 'collaborator' : 'collaborators'}
                            </span>
                        </div>

                        {/* View Details Hint */}
                        <span className="text-xs text-muted-foreground/75 group-hover:text-primary transition-colors">
                            Click to view details →
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ItineraryCard;
