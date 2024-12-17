import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../utils/config.utils";
import { CustomRequest } from "../types/auth.type";
import { User } from "../types/user.types";

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "Unauthorized: No Authorization header" });
    return
  }

  // Extract token from 'Authorization' header using split
  const token = authHeader.split(" ")[1]; // ['Bearer', '<token>']

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    // Verify the JWT using the secret (it contains user data)
    const decoded = jwt.verify(token, config.AUTH_SECRET) as User;

    // If valid, attach the user data to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return
  }
};
