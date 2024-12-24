import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ItineraryCard from "@/components/itinerary/itinerary_card";
import ItineraryDetails from "@/components/itinerary/itinerary_details";
import { Itinerary } from "@/types/itinerary-types";
import { useQueryClient } from "@tanstack/react-query";

interface ItineraryGridProps {
  itineraries: Itinerary[];
}

export const ItineraryGrid = ({ itineraries }: ItineraryGridProps) => {
  const queryClient = useQueryClient();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {itineraries.map((itinerary) => (
        <Sheet key={itinerary.id}>
          <SheetTrigger asChild>
            <div className="cursor-pointer w-full transition-transform hover:scale-[1.02] duration-300">
              <ItineraryCard
                title={itinerary.title}
                description={itinerary.description}
                dateStart={itinerary.startDate}
                dateEnd={itinerary.endDate}
                collaborators={itinerary.collaborators.length}
              />
            </div>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-[825px] p-0 sm:p-6 border-l"
          >
            <ItineraryDetails
              itineraryId={itinerary.id}
              title={itinerary.title}
              description={itinerary.description}
              dateStart={itinerary.startDate}
              dateEnd={itinerary.endDate}
              collaborators={itinerary.collaborators}
              onItineraryChange={() => {
                queryClient.invalidateQueries({ queryKey: ["itineraries"] });
              }}
            />
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
};
