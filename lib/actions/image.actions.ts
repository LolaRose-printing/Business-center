"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import { handleError } from "../utils";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

// Define IImage type matching Prisma image model + optional author data
export type IAuthor = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

export type IImage = {
  id: string;
  title: string;
  transformationType: string;
  publicId: string;
  secureURL: string;
  width: number | null;
  height: number | null;
  config: any;
  transformationUrl: string | null;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  createdAt: Date;
  updatedAt: Date;
  author?: IAuthor | null;
};

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
    width?: number | null;
    height?: number | null;
    config?: any;
    transformationUrl?: string | null;
    aspectRatio?: string | null;
    color?: string | null;
    prompt?: string | null;
  };
  userId: string;
  path: string;
}): Promise<IImage | null> {
  try {
    const author = await prisma.user.findUnique({ where: { id: userId } });
    if (!author) throw new Error("User not found");

    const newImage = await prisma.image.create({
      data: {
        title: image.title,
        transformationType: image.transformationType,
        publicId: image.publicId,
        secureURL: image.secureURL,
        width: image.width ?? null,
        height: image.height ?? null,
        config: image.config ?? {},
        transformationUrl: image.transformationUrl ?? null,
        aspectRatio: image.aspectRatio ?? null,
        color: image.color ?? null,
        prompt: image.prompt ?? null,
        authorId: userId,
      },
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

    revalidatePath(path);
    return newImage;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// UPDATE IMAGE
export async function updateImage({
  image,
  userId,
  path,
}: {
  image: {
    id: string;
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string;
    width?: number | null;
    height?: number | null;
    config?: any;
    transformationUrl?: string | null;
    aspectRatio?: string | null;
    color?: string | null;
    prompt?: string | null;
  };
  userId: string;
  path: string;
}): Promise<IImage | null> {
  try {
    const imageToUpdate = await prisma.image.findUnique({
      where: { id: image.id },
    });

    if (!imageToUpdate) throw new Error("Image not found");
    if (imageToUpdate.authorId !== userId)
      throw new Error("Unauthorized to update this image");

    const updatedImage = await prisma.image.update({
      where: { id: image.id },
      data: {
        title: image.title,
        transformationType: image.transformationType,
        publicId: image.publicId,
        secureURL: image.secureURL,
        width: image.width ?? null,
        height: image.height ?? null,
        config: image.config ?? {},
        transformationUrl: image.transformationUrl ?? null,
        aspectRatio: image.aspectRatio ?? null,
        color: image.color ?? null,
        prompt: image.prompt ?? null,
      },
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

    revalidatePath(path);
    return updatedImage;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string): Promise<boolean> {
  try {
    await prisma.image.delete({ where: { id: imageId } });
    // Don't redirect here; let caller handle routing
    return true;
  } catch (error) {
    handleError(error);
    return false;
  }
}

// GET IMAGE BY ID
export async function getImageById(imageId: string): Promise<IImage | null> {
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
}): Promise<{
  data: IImage[];
  totalPages: number;
  savedImages: number;
} | null> {
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
      totalPages: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
    return null;
  }
}

// GET IMAGES BY USER WITH PAGINATION
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}): Promise<{
  data: IImage[];
  totalPages: number;
} | null> {
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
