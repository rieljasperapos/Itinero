import { Collaborator } from "./collaborator-types";
import { Activity } from "./activity-types";

export interface Itinerary {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  collaborators: any[];
}

export interface ItineraryDetailsProps {
  itineraryId: number;
  title: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  collaborators: Collaborator[];
  onItineraryChange?: () => void;
}

export interface Creator {
  email: string;
  id: number;
  name: string;
}

export interface GroupedActivities {
  [date: string]: Activity[];
}
