import jwt from "jsonwebtoken";
import { config } from "../utils/config.utils";
import { User } from "../types/user.types";

export const generateToken = (user: User) => {
  return jwt.sign(
    { 
      id: user.id,
      name: user.name, 
      email: user.email,
      username: user.username 
    },
    config.AUTH_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN }
  );
};
