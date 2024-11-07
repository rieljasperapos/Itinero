import jwt from "jsonwebtoken";
import { config } from "../utils/config.utils";
import { User } from "../types/user.types";

export const generateToken = (user: User) => {
  return jwt.sign(
    { name: user.name, username: user.username },
    config.JWT_SECRET,
    { expiresIn: "15m" }
  );
};
