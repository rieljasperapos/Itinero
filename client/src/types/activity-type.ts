export interface Activity {
  id: number;
  activityName: string;
  startTime: string;
  endTime: string;
  locationName: string;
  address: string;
  itineraryId?: number;
  createdById?: number;
}