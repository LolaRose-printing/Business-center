import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseTokenCookie, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // to handle multipart/form-data manually
  },
};

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = parseTokenCookie(cookieHeader);

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let userId: string;
  try {
    const decoded = verifyToken(token) as { userId: string };
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse multipart form-data (profilePicture)
  const formData = await request.formData();
  const file = formData.get("profilePicture") as File | null;

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // You need to handle the actual upload to a storage (local, cloud like AWS S3, Cloudinary, etc)
  // For demo, let's assume you save locally and generate a URL `/uploads/{filename}`

  // Example: generate a unique filename
  const fileName = `${userId}-${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // For local filesystem, you can use 'fs' but Next.js API routes don't allow it directly.
  // You may want to use an external service like Cloudinary here or custom upload handler.

  // Pseudo code (replace with your actual storage logic):
  /*
  await fs.promises.writeFile(`./public/uploads/${fileName}`, buffer);
  const photoUrl = `/uploads/${fileName}`;
  */

  // For now, let's pretend upload succeeded and photoUrl is this:
  const photoUrl = `/uploads/${fileName}`;

  // Update user in DB
  await prisma.user.update({
    where: { id: userId },
    data: { photo: photoUrl },
  });

  return NextResponse.json({ photoUrl });
}
