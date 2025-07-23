import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseTokenCookie, verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // not used in Next 13/14 app router but fine
  },
};

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = parseTokenCookie(cookieHeader);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let userId: string;
  try {
    const decoded = verifyToken(token) as { userId: string };
    userId = decoded.userId;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the uploaded file
  const formData = await request.formData();
  const file = formData.get("profilePicture") as File | null;

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/\s+/g, "_");
  const fileName = `${userId}-${timestamp}-${safeName}`;

  // Where to save it
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);

  // Make sure uploads/ exists
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const photoUrl = `/uploads/${fileName}`;

  // Update user record
  await prisma.user.update({
    where: { id: userId },
    data: { photo: photoUrl },
  });

  return NextResponse.json({ photoUrl });
}
