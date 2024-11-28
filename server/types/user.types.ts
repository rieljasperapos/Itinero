export type User = {
  id: number;
  name: string;
  username: string;
  password?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}