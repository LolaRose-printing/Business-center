"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../utils";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

// ADD IMAGE
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    // Verify user exists
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
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userId, path }: UpdateImageParams) {
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
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: number) {
  try {
    await prisma.image.delete({ where: { id: imageId } });
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

// GET IMAGE BY ID
export async function getImageById(imageId: number) {
  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            clerkId: true,
          },
        },
      },
    });

    if (!image) throw new Error("Image not found");
    return image;
  } catch (error) {
    handleError(error);
  }
}

// GET IMAGES
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
    // NOTE: You’ll need to implement search/filter logic for your SQL DB here.
    // For now, simple example filtering title or prompt containing searchQuery.

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
              clerkId: true,
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
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
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
  userId: number;
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
              clerkId: true,
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
  }
}
