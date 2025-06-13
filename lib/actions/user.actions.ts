"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../utils";

const prisma = new PrismaClient();

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    const newUser = await prisma.user.create({
      data: user,
    });

    return newUser;
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) throw new Error("User not found");

    return user;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: user,
    });

    if (!updatedUser) throw new Error("User update failed");

    return updatedUser;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
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
  }
}

// USE CREDITS
export async function updateCredits(userId: number, creditFee: number) {
  try {
    const updatedUserCredits = await prisma.user.update({
      where: { id: userId },
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
  }
}
