import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  // console.log({ payload });
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (isUserExist) {
    throw new AppError(400, "User already exist");
  }
  const createdUser = await prisma.user.create({
    data: payload,
  });
  return createdUser;
};

const getAllFromDB = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      pictures: true,
      role: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      posts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getUserById = async (id: number) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

const deleteUser = async (id: number) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

const updateUser = async (id: number, payload: Partial<User>) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const UserService = {
  createUser,
  getAllFromDB,
  getUserById,
  deleteUser,
  updateUser,
};
