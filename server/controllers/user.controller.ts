import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { config } from "../utils/config.utils";
import bcrypt from "bcrypt";
import { generateToken } from "../services/token.service";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";
import { isValidEmail } from "../helpers/user.helper";

export const getUsers = async (req: Request, res: Response) => {
  const data = await prisma.user.findMany();
  res.send({ data: data });
  return;
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(config.SALT_ROUNDS)
    );

    const existingUser = await prisma.user.findUnique({ where: { username: username } });
    if (existingUser) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "Username already exists" });
      return;
    }

    const existingEmail = await prisma.user.findUnique({ where: { email: email } });
    if (existingEmail) {
      res.status(StatusCodes.BAD_REQUEST).send({ message: "Email already exists" });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name: name,
        username: username,
        password: hashedPassword,
        email: email,
      },
    });

    res.status(StatusCodes.OK).send({
      message: "Successfully created user",
      data: newUser,
      valid: true,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `Server error ${error}` });
  }
  return;
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Find user in the database
  const user = await prisma.user.findFirst({ where: { username: username } });
  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  // Check if the password matches
  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    res.status(401).json({ message: "Invalid password" });
    return;
  }

  // Generate a token for the user
  const foundUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
  };
  const accessToken = generateToken(foundUser);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  const userResponse = {
    ...foundUser,
    accessToken,
  };
  res.status(200).json({ userResponse });
  return;
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  const { name, email } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized"
    });
    return;
  }

  // Input validation for email if provided
  if (email && !isValidEmail(email)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid email format"
    });
    return;
  }

  const updateData: any = {};  // Object to hold the fields to be updated

  // Add the fields to update if they exist in the request body
  if (name) {
    updateData.name = name;
  }
  if (email) {
    updateData.email = email;
  }

  // If no fields are provided in the request body, return an error
  if (Object.keys(updateData).length === 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "No valid fields provided to update"
    });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
    return;
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error
    });
    return;
  }
};

export const changePassword = async (req: CustomRequest, res: Response) => {
  const { currentPassword, newPassword, reTypePassword } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized"
    });
    return;
  }

  // Input validation for passwords
  if (!currentPassword || !newPassword || !reTypePassword) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Missing required fields"
    });
    return;
  }

  // Check if the new passwords match with the re-type password
  if (newPassword !== reTypePassword) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Passwords do not match"
    });
    return;
  }

  // Check if the user exists
  const foundUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!foundUser) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "User not found"
    });
    return;
  }

  // Check if the current password matches
  const passwordMatched = await bcrypt.compare(currentPassword, foundUser.password);
  if (!passwordMatched) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid current password"
    });
    return;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(newPassword, parseInt(config.SALT_ROUNDS))
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password updated successfully",
      data: updatedUser
    });
    return;
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error
    });
    return;
  }
};

export const findUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User found successfully",
      data: user
    });
    return;
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error
    });
    return;
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, reTypePassword, email } = req.body;

  // Input validation for passwords
  if (!newPassword || !reTypePassword) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Missing required fields"
    });
    return;
  }

  // Check if the new passwords match with the re-type password
  if (newPassword !== reTypePassword) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Passwords do not match"
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, parseInt(config.SALT_ROUNDS))
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password updated successfully",
      data: updatedUser
    });
    return;
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: error
    });
    return;
  }
}

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(StatusCodes.OK).send({ message: "Logged out successfully" });
  return;
};
