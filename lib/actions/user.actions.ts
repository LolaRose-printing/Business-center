"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../utils";

const prisma = new PrismaClient();

type CreateUserParams = {
  email: string;
  username: string;
  passwordHash: string;
  clerkId?: string;
  firstName?: string;
  lastName?: string;
  accountType?: "INDIVIDUAL" | "BUSINESS";
  company?: string;
  planId?: number;
  creditBalance?: number;
  photo?: string;
};

type UpdateUserParams = Partial<CreateUserParams>;

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: user,
    });

    return newUser;
  } catch (error) {
    handleError(error);
    throw error; // Rethrow so caller can react
  }
}

// READ by clerkId (optional unique)
export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// READ by id (primary key)
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// UPDATE by clerkId
export async function updateUserByClerkId(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: user,
    });

    if (!updatedUser) throw new Error("User update failed");

    return updatedUser;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// UPDATE by id
export async function updateUserById(id: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: user,
    });

    if (!updatedUser) throw new Error("User update failed");

    return updatedUser;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// DELETE by clerkId
export async function deleteUserByClerkId(clerkId: string) {
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!userToDelete) throw new Error("User not found");

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: { clerkId },
    });

    revalidatePath("/");

    return deletedUser;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// DELETE by id
export async function deleteUserById(id: string) {
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) throw new Error("User not found");

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/");

    return deletedUser;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// USE CREDITS - increment or decrement by creditFee (use negative to decrement)
export async function updateCredits(id: string, creditFee: number) {
  try {
    const updatedUserCredits = await prisma.user.update({
      where: { id },
      data: {
        creditBalance: {
          increment: creditFee,
        },
      },
    });

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return updatedUserCredits;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
