import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseTokenCookie, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  console.log("Cookie header:", cookieHeader);

  const token = parseTokenCookie(cookieHeader);
  console.log("Parsed token:", token);

  if (!token) {
    console.log("No token found in cookies, returning 401");
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token) as { userId: string };
    console.log("Decoded token:", decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true, // Make sure your DB has this field if you want it
        email: true,     // Add any other fields your frontend needs
      },
    });

    if (!user) {
      console.log("User not found for id:", decoded.userId);
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Return user object (excluding sensitive info like password)
    return NextResponse.json({ user });
  } catch (err) {
    console.log("Token verification failed or other error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
