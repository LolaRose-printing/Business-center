import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // use singleton prisma instance
import { parseTokenCookie, verifyToken } from "@/lib/auth";

export const routeConfig = {
  runtime: "nodejs",
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

  const formData = await request.formData();
  const file = formData.get("profilePicture") as File | null;

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // sanitize file.name here if you want
  const fileName = `${userId}-${Date.now()}-${file.name}`;
  // Buffer is supported in nodejs runtime
  const buffer = Buffer.from(await file.arrayBuffer());

  // Implement your upload logic here (filesystem, cloud storage, etc)

  const photoUrl = `/uploads/${fileName}`;

  await prisma.user.update({
    where: { id: userId },
    data: { photo: photoUrl },
  });

  return NextResponse.json({ photoUrl });
}
