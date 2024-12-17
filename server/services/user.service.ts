import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { config } from "../utils/config.utils";
import HttpException from "../utils/error.utils";
import { generateToken } from "./token.service";
import { isValidEmail } from "../helpers/user.helper";

export const registerUserService = async (name: string, username: string, password: string, email: string) => {
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new HttpException(400, "Username already exists");
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw new HttpException(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(config.SALT_ROUNDS)
  );

  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      password: hashedPassword,
      email,
    },
  });

  return newUser;
};

export const loginUserService = async (username: string, password: string) => {
  const user = await prisma.user.findFirst({ where: { username } })
  if (!user) {
    throw new HttpException(401, "User not found");
  }

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    throw new HttpException(401, "Invalid password");
  }

  const foundUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
  };

  const accessToken = generateToken(foundUser);

  return {
    user: foundUser,
    accessToken,
  };
}

export const updateUserService = async (userId: number | undefined, name: string, email: string) => {
  if (!userId) {
    throw new HttpException(401, "Unauthorized");
  }

  if (email && !isValidEmail(email)) {
    throw new HttpException(400, "Invalid email format");
  }

  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  if (Object.keys(updateData).length === 0) {
    throw new HttpException(400, "No valid fields provided to update");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updatedUser;
  } catch (error) {
    throw new HttpException(500, "Internal server error");
  }
}

export const changePasswordService = async (userId: number | undefined, currentPassword: string, newPassword: string, reTypePassword: string) => {
  if (!userId) {
    throw new HttpException(401, "Unauthorized");
  }

  if (!currentPassword || !newPassword || !reTypePassword) {
    throw new HttpException(400, "Missing required fields");
  }

  if (newPassword !== reTypePassword) {
    throw new HttpException(400, "Passwords do not match");
  }

  const foundUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!foundUser) {
    throw new HttpException(404, "User not found");
  }

  const passwordMatched = await bcrypt.compare(currentPassword, foundUser.password);
  if (!passwordMatched) {
    throw new HttpException(401, "Invalid current password");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(newPassword, parseInt(config.SALT_ROUNDS))
      },
    });

    return updatedUser;
  } catch (error) {
    throw new HttpException(500, "Internal server error");
  }
}
