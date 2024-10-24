import { config as dotenv } from "dotenv";

dotenv();

export const config = {
  PORT: process.env.PORT as string,
  SALT_ROUNDS: process.env.SALT_ROUNDS as string
};