import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseTokenCookie, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// New config export per Next.js 14:
export const routeConfig = {
  runtime: "edge",  // or "nodejs" if you need Node APIs (fs etc)
  // Next.js 14 currently does not support disabling bodyParser like before,
  // So you'll handle multipart/form-data manually as you do.
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

  // Generate unique filename
  const fileName = `${userId}-${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Your upload logic here (e.g., upload to cloud or save locally)

  const photoUrl = `/uploads/${fileName}`;

  await prisma.user.update({
    where: { id: userId },
    data: { photo: photoUrl },
  });

  return NextResponse.json({ photoUrl });
}
