import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // singleton client
import { parseTokenCookie, verifyToken } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const routeConfig = {
  runtime: "nodejs",
};

export async function POST(request: Request) {
  try {
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

    const formData = await request.formData();
    const file = formData.get("profilePicture") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const sanitizeFileName = (name: string) =>
      name
        .replace(/\s+/g, "_")
        .replace(/[()]/g, "")
        .replace(/[^a-zA-Z0-9_.-]/g, "");

    const timestamp = Date.now();
    const safeName = sanitizeFileName(file.name);
    const fileName = `${userId}-${timestamp}-${safeName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const photoUrl = `/uploads/${fileName}`;

    await prisma.user.update({
      where: { id: userId },
      data: { photo: photoUrl },
    });

    return NextResponse.json({ photoUrl });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
