import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { config, cookieOptions } from "../utils/config.utils";
import bcrypt from "bcrypt";
import { generateToken } from "../services/token.service";

export const getUsers = async (req: Request, res: Response) => {
  const data = await prisma.user.findMany();

  res.send({data: data});
}

export const registerUser = async (req: Request, res: Response) => {
  // Register user
  const { name, username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, parseInt(config.SALT_ROUNDS));
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  })

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        name: name,
        username: username,
        password: hashedPassword
      }
    })
    res.send({
      message: "Successfully created user",
      data: newUser
    })
    return;
  } else {
    res.send({ message: "username already exist" });
    return;
  }
}

export const loginUser = async (req: Request, res: Response) => {
  // Login User
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  });

  const passwordMatched = await bcrypt.compare(password, user?.password as string);

  if (!user || !passwordMatched) {
    res.send({ message: "Invalid Credentials "});
  } else {
    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);
    res.send({ message: "Successfully logged in" });
  }

  return;
}

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  
  res.send({ message: "Logged out successfully" });

  return;
}