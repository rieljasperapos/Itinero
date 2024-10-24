import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { config } from "../utils/config.utils";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  const data = await prisma.user.findMany();

  res.send({data: data});
}

export const registerUser = async (req: Request, res: Response) => {
  // Register user
  const body = req.body;
  
  const hashedPassword = await bcrypt.hash(body.password, parseInt(config.SALT_ROUNDS));
  const user = await prisma.user.create({
    data: {
      name: body.name,
      username: body.username,
      password: hashedPassword
    }
  })

  res.send({
    message: "Successfully created user",
    data: user
  })
}

export const loginUser = async (req: Request, res: Response) => {
  // Login User
}