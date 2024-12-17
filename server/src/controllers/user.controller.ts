import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { config } from "../utils/config.utils";
import bcrypt from "bcrypt";
import { CustomRequest } from "../types/auth.type";
import { StatusCodes } from "http-status-codes";
import { changePasswordService, loginUserService, registerUserService, updateUserService } from "../services/user.service";
import HttpException from "../utils/error.utils";

// GET /users - Get all users
export const getUsers = async (req: Request, res: Response) => {
  const data = await prisma.user.findMany();
  res.send({ data: data });
  return;
};

// POST /register - Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, username, password, email } = req.body
    const newUser = await registerUserService(name, username, password, email);

    res.status(StatusCodes.CREATED).send({
      message: "Successfully created user",
      data: newUser,
      valid: true,
    });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.status).send({ error: error.message, valid: false });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: "An unexpected error occurred",
        details: error.message,
      });
    }
  }
};

// POST /login - Login a user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { user, accessToken } = await loginUserService(username, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(StatusCodes.OK).send({
      userResponse: {
        ...user,
        accessToken,
      },
    });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.status).send({ error: error.message, valid: false });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: "An unexpected error occurred",
        details: error.message,
      });
    }
  }
};

// POST /user-update - Update user details
export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, email } = req.body;
    const updatedUser = await updateUserService(userId, name, email);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.status).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
};

// POST /change-password - Change user password
export const changePassword = async (req: CustomRequest, res: Response) => {
  try {
    const { currentPassword, newPassword, reTypePassword } = req.body;
    const userId = req.user?.id;

    const updatedUser = await changePasswordService(userId, currentPassword, newPassword, reTypePassword);
    res.status(StatusCodes.OK).json({ success: true, message: "Password updated successfully", data: updatedUser });
  } catch (error: any) {
    if (error instanceof HttpException) {
      res.status(error.status).json({ success: false, message: error.message });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
};

// POST /find-by-email - Find user by email
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

// POST /reset-password - Reset user password
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
