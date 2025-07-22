"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../utils";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

// ADD IMAGE
export async function addImage({
  image,
  userId,
  path,
}: {
  image: {
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width?: number;
    height?: number;
    config?: any;
    transformationUrl?: string;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
  };
  userId: string; // Use string for Prisma ID
  path: string;
}) {
  try {
    const author = await prisma.user.findUnique({ where: { id: userId } });
    if (!author) throw new Error("User not found");

    const newImage = await prisma.image.create({
      data: {
        title: image.title,
        transformationType: image.transformationType,
        publicId: image.publicId,
        secureURL: image.secureURL,
        width: image.width,
        height: image.height,
        config: image.config,
        transformationUrl: image.transformationUrl,
        aspectRatio: image.aspectRatio,
        color: image.color,
        prompt: image.prompt,
        authorId: userId,
      },
    });

    revalidatePath(path);
    return newImage;
  } catch (error) {
    handleError(error);
    return null; // or throw error if you prefer
  }
}

// UPDATE IMAGE
export async function updateImage({
  image,
  userId,
  path,
}: {
  image: {
    id: string; // Prisma uses string IDs
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width?: number;
    height?: number;
    config?: any;
    transformationUrl?: string;
    aspectRatio?: string;
    color?: string;
    prompt?: string;
  };
  userId: string;
  path: string;
}) {
  try {
    const imageToUpdate = await prisma.image.findUnique({
      where: { id: image.id },
    });

    if (!imageToUpdate || imageToUpdate.authorId !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await prisma.image.update({
      where: { id: image.id },
      data: {
        title: image.title,
        transformationType: image.transformationType,
        publicId: image.publicId,
        secureURL: image.secureURL,
        width: image.width,
        height: image.height,
        config: image.config,
        transformationUrl: image.transformationUrl,
        aspectRatio: image.aspectRatio,
        color: image.color,
        prompt: image.prompt,
      },
    });

    revalidatePath(path);
    return updatedImage;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await prisma.image.delete({ where: { id: imageId } });
    redirect("/");
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGE BY ID
export async function getImageById(imageId: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!image) throw new Error("Image not found");
    return image;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// GET ALL IMAGES WITH SEARCH + PAGINATION
export async function getAllImages({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    const skipAmount = (page - 1) * limit;

    const whereClause = searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { prompt: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};

    const [images, totalImages, savedImages] = await Promise.all([
      prisma.image.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: skipAmount,
        take: limit,
      }),
      prisma.image.count({ where: whereClause }),
      prisma.image.count(),
    ]);

    return {
      data: images,
      totalPages: Math.ceil(totalImages / limit), // fixed to totalPages plural
      savedImages,
    };
  } catch (error) {
    handleError(error);
    return null;
  }
}

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    const skipAmount = (page - 1) * limit;

    const [images, totalImages] = await Promise.all([
      prisma.image.findMany({
        where: { authorId: userId },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: skipAmount,
        take: limit,
      }),
      prisma.image.count({ where: { authorId: userId } }),
    ]);

    return {
      data: images,
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
    return null;
  }
}
