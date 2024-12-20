export interface Collaborator {
  id: number;
  itineraryId: number;
  user: {
    id: number;
    email: string;
    name: string;
  };
  role: string;
}
