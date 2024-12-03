import jwt from "jsonwebtoken";
import { config } from "../utils/config.utils";
import { User } from "../types/user.types";

export const generateToken = (user: User) => {
  return jwt.sign(
    { 
      id: user.id,
      name: user.name, 
      username: user.username 
    },
    config.JWT_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRES_IN }
  );
};

export const generateRefreshToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      username: user.username,
    },
    config.JWT_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN }
  )
}
