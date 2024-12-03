import { config as dotenv } from "dotenv";

dotenv();

export const config = {
  PORT: process.env.PORT as string
};