import { Request } from "express";
import { User } from "./user.types";

export interface CustomRequest extends Request {
  user?: User
}