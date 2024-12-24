import { Itinerary } from "@/types/itinerary-types";

export type FilterType = "upcoming" | "ongoing" | "past";
export type SortType = "newest" | "oldest" | "title";

export const filterItineraries = (itinerary: Itinerary, filter: FilterType) => {
  const now = new Date();
  const start = new Date(itinerary.startDate);
  const end = new Date(itinerary.endDate);

  switch (filter) {
    case "upcoming":
      return start > now;
    case "ongoing":
      return start <= now && end >= now;
    case "past":
      return end < now;
    default:
      return true;
  }
};

export const sortItineraries = (itineraries: Itinerary[], sort: SortType) => {
  return [...itineraries].sort((a, b) => {
    switch (sort) {
      case "newest":
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};
