import jwt from "jsonwebtoken";
import { config } from "../utils/config.utils";

export const generateToken = (user: any) => {
  return jwt.sign({ name: user.name, username: user.username }, config.JWT_SECRET, { expiresIn: "15m" });
}