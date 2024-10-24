// Auth middleware
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../utils/config.utils";

interface CustomRequest extends Request {
  user?: any,
}

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    res.send({ message: "Unauthorized access: No token provided" });
    return;
  }
  
  jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }

    req.user = user;
    next();
  })
}