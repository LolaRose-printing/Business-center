import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseTokenCookie, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export const runtime = "nodejs";


export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = parseTokenCookie(cookieHeader);

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        photo: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name:
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.username ||
          user.email,
        avatarUrl: user.photo || "/assets/images/avatar-placeholder.png",
      },
    });
  } catch (err) {
    console.error("Token verification failed or other error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
