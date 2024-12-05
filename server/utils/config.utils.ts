import { config as dotenv } from "dotenv";

dotenv();

export const config = {
  PORT: process.env.PORT as string,
  SALT_ROUNDS: process.env.SALT_ROUNDS as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  AUTH_SECRET: process.env.AUTH_SECRET as string,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
};