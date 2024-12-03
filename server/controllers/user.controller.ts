import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { config, cookieOptions } from "../utils/config.utils";
import bcrypt from "bcrypt";
import { generateToken } from "../services/token.service";
import { User } from "../types/user.types";

export const getUsers = async (req: Request, res: Response) => {
  const data = await prisma.user.findMany();
  res.send({ data: data });
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(config.SALT_ROUNDS)
    );
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          username: username,
          password: hashedPassword,
          email: email
        },
      });
      res.send({
        message: "Successfully created user",
        data: newUser,
      });
    } else {
      res.send({ message: "username already exist" });
    }
  } catch (error) {
    res.send({ message: `Server error ${error}` });
  }
  return;
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(`USERNAME: ${username}`);

  // Find user in the database
  const user = await prisma.user.findFirst({ where: { username: username } });
  if (!user){
    res.status(401).json({ message: "User not found" });
    return;
  }

  // Check if the password matches
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  res.status(200).json({ user });
  return;
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.send({ message: "Logged out successfully" });
  return;
};
