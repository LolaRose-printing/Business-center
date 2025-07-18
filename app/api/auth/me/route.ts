import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parseTokenCookie, verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const token = parseTokenCookie(request.headers.get("cookie") || undefined);
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const decoded = verifyToken(token) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        company: true,
        userType: true,
        username: true,
        firstName: true,
        lastName: true,
        creditBalance: true,
      },
    });

    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
